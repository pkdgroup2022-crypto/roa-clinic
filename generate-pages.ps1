# generate-pages.ps1
# Generates static HTML for each program page.
# Run: powershell -ExecutionPolicy Bypass -File generate-pages.ps1

Set-Location $PSScriptRoot

# Read program.html
$src = [System.IO.File]::ReadAllText('program.html', [System.Text.Encoding]::UTF8)
$bt  = [char]96   # backtick

# Read ID -> URL-path mapping from vercel.json
$vercelRaw = [System.IO.File]::ReadAllText('vercel.json', [System.Text.Encoding]::UTF8)
$vercel = $vercelRaw | ConvertFrom-Json
$pathMap = @{}
foreach ($rule in $vercel.rewrites) {
    if ($rule.destination -match 'id=([^&]+)') {
        $id  = $Matches[1]
        $urlPath = $rule.source.TrimStart('/')
        $pathMap[$id] = $urlPath
    }
}

# Extract single-line string field from a program block
function Get-Field($src, $id, $field) {
    $patterns = @("    ${id}: {", "    '${id}': {")
    $startIdx = -1
    foreach ($p in $patterns) {
        $i = $src.IndexOf($p)
        if ($i -ge 0) { $startIdx = $i; break }
    }
    if ($startIdx -lt 0) { return '' }
    $block = $src.Substring($startIdx, [Math]::Min(3000, $src.Length - $startIdx))
    if ($block -match "${field}:\s*'([^']+)'") { return $Matches[1] }
    return ''
}

# Extract seo template-literal content from a program block
function Get-Seo($src, $id) {
    $bt = [char]96
    $patterns = @("    ${id}: {", "    '${id}': {")
    $startIdx = -1
    foreach ($p in $patterns) {
        $i = $src.IndexOf($p)
        if ($i -ge 0) { $startIdx = $i; break }
    }
    if ($startIdx -lt 0) { return '' }
    $seoLabel    = "seo: $bt"
    $seoStart    = $src.IndexOf($seoLabel, $startIdx)
    if ($seoStart -lt 0) { return '' }
    $contentStart = $seoStart + $seoLabel.Length
    $seoEnd      = $src.IndexOf("${bt},", $contentStart)
    if ($seoEnd -lt 0) { return '' }
    return $src.Substring($contentStart, $seoEnd - $contentStart).Trim()
}

$count = 0

foreach ($id in $pathMap.Keys) {
    $urlPath = $pathMap[$id]

    Write-Host "[$id]" -NoNewline

    $titleSeo   = Get-Field $src $id 'titleSeo'
    $metaDesc   = Get-Field $src $id 'metaDesc'
    $kw         = Get-Field $src $id 'keywords'
    $seoContent = Get-Seo   $src $id

    if (-not $titleSeo) {
        Write-Host " SKIP (no titleSeo)" -ForegroundColor Yellow
        continue
    }

    $canonicalUrl = "https://shylifting.com/$urlPath"
    $fullTitle    = "$titleSeo | ROA CLINIC BUCHEON"
    # Use actual title from titleSeo (already has Korean)

    $html = $src

    # Pre-render meta tags
    $html = [regex]::Replace($html,
        '<title id="pageTitle">[^<]*</title>',
        "<title>$titleSeo</title>")

    $html = [regex]::Replace($html,
        '<meta name="description" id="pageDesc"[^>]*>',
        "<meta name=`"description`" content=`"$metaDesc`">")

    $html = [regex]::Replace($html,
        '<meta property="og:title" id="ogTitle"[^>]*>',
        "<meta property=`"og:title`" content=`"$titleSeo`">")

    $html = [regex]::Replace($html,
        '<meta property="og:description" id="ogDesc"[^>]*>',
        "<meta property=`"og:description`" content=`"$metaDesc`">")

    $html = [regex]::Replace($html,
        '<meta name="keywords" id="pageKeywords"[^>]*>',
        "<meta name=`"keywords`" content=`"$kw`">")

    $html = [regex]::Replace($html,
        '<meta property="og:url" id="ogUrl"[^>]*>',
        "<meta property=`"og:url`" content=`"$canonicalUrl`">")

    # Insert canonical link before first preconnect
    $preIdx = $html.IndexOf('<link rel="preconnect"')
    if ($preIdx -ge 0) {
        $cTag = "<link rel=`"canonical`" href=`"$canonicalUrl`">`n"
        $html = $html.Substring(0, $preIdx) + $cTag + $html.Substring($preIdx)
    }

    # Pre-render seo section
    if ($seoContent) {
        $ph  = '<div class="seo-section" id="seoSection"></div>'
        $rep = "<div class=`"seo-section`" id=`"seoSection`">$seoContent</div>"
        if ($html.Contains($ph)) {
            $html = $html.Replace($ph, $rep)
        }
    }

    # Hardcode program ID (remove query-param lookup)
    $html = $html.Replace(
        "const id = new URLSearchParams(location.search).get('id') || 'ulthera';",
        "const id = '$id';"
    )

    # Save file (UTF-8 no BOM)
    $outPath = ".\$urlPath.html"
    [System.IO.File]::WriteAllText($outPath, $html, (New-Object System.Text.UTF8Encoding $false))
    $count++
    Write-Host " -> $outPath" -ForegroundColor Green
}

Write-Host "Done: $count files generated." -ForegroundColor Cyan
