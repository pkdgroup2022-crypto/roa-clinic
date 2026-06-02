param([int]$Port = 8080)
$root = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$Port/"

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $resp = $ctx.Response

    $path = $req.Url.LocalPath -replace '/', [IO.Path]::DirectorySeparatorChar
    $file = Join-Path $root $path.TrimStart([IO.Path]::DirectorySeparatorChar)
    if ((Test-Path $file -PathType Leaf) -eq $false) {
        $file = Join-Path $file "index.html"
    }

    if (Test-Path $file -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $mime = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css" }
            ".js"   { "application/javascript" }
            ".json" { "application/json" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".mp4"  { "video/mp4" }
            ".webm" { "video/webm" }
            ".gif"  { "image/gif" }
            default { "application/octet-stream" }
        }

        $fileInfo = [IO.FileInfo]::new($file)
        $fileSize = $fileInfo.Length
        $resp.ContentType = $mime

        # Range 요청 처리 (비디오 스트리밍에 필요)
        $rangeHeader = $req.Headers["Range"]
        if ($rangeHeader -and $rangeHeader -match "bytes=(\d*)-(\d*)") {
            $start = if ($Matches[1]) { [long]$Matches[1] } else { 0 }
            $end   = if ($Matches[2]) { [long]$Matches[2] } else { $fileSize - 1 }
            if ($end -ge $fileSize) { $end = $fileSize - 1 }
            $length = $end - $start + 1

            $resp.StatusCode = 206
            $resp.AddHeader("Content-Range", "bytes $start-$end/$fileSize")
            $resp.AddHeader("Accept-Ranges", "bytes")
            $resp.ContentLength64 = $length

            $fs = [IO.File]::OpenRead($file)
            $fs.Seek($start, [IO.SeekOrigin]::Begin) | Out-Null
            $buf = New-Object byte[] 65536
            $remaining = $length
            while ($remaining -gt 0) {
                $toRead = [Math]::Min($buf.Length, $remaining)
                $read = $fs.Read($buf, 0, $toRead)
                if ($read -le 0) { break }
                try { $resp.OutputStream.Write($buf, 0, $read) } catch { break }
                $remaining -= $read
            }
            $fs.Close()
        } else {
            # 일반 요청 — 청크 스트리밍
            $resp.AddHeader("Accept-Ranges", "bytes")
            $resp.ContentLength64 = $fileSize

            $fs = [IO.File]::OpenRead($file)
            $buf = New-Object byte[] 65536
            while ($true) {
                $read = $fs.Read($buf, 0, $buf.Length)
                if ($read -le 0) { break }
                try { $resp.OutputStream.Write($buf, 0, $read) } catch { break }
            }
            $fs.Close()
        }
    } else {
        $resp.StatusCode = 404
    }

    try { $resp.OutputStream.Close() } catch {}
}
