// ================================================================
// 미용한의원 홈페이지 - Google Apps Script 코드
// ================================================================
// 사용법:
//   1. Google 시트 열기 → 상단 메뉴 [확장 프로그램] → [Apps Script]
//   2. 이 코드 전체를 붙여넣기 (기존 내용 삭제 후)
//   3. 저장 후 [배포] → [새 배포] → 유형: 웹 앱
//      - 실행: 나 (본인 계정)
//      - 액세스: 모든 사용자
//   4. 배포 URL 복사 → index.html 의 SCRIPT_URL 에 붙여넣기
// ================================================================

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const data = {
    info:     getInfoData(ss),
    events:   getSheetRows(ss, '이달의이벤트'),
    programs: getSheetRows(ss, '일반프로그램'),
    photos:   getSheetRows(ss, '후기사진')
  };

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 기본정보 시트 → {key: value} 객체로 변환
function getInfoData(ss) {
  try {
    const sheet = ss.getSheetByName('기본정보');
    if (!sheet) return {};
    const rows = sheet.getDataRange().getValues();
    const info = {};
    rows.forEach(function(row) {
      if (row[0] && row[1] !== undefined) {
        info[String(row[0]).trim()] = String(row[1]).trim();
      }
    });
    return info;
  } catch(e) { return {}; }
}

// 일반 시트 → 첫 행을 헤더로 사용해 객체 배열로 변환
function getSheetRows(ss, sheetName) {
  try {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    const headers = data[0].map(function(h) { return String(h).trim(); });
    return data.slice(1).map(function(row) {
      const obj = {};
      headers.forEach(function(h, i) {
        obj[h] = row[i] !== undefined ? String(row[i]).trim() : '';
      });
      return obj;
    });
  } catch(e) { return []; }
}
