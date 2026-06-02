// ================================================================
// 로아한의원 홈페이지 - Google Apps Script 백엔드
// ================================================================
// 설정 순서:
//   1. Google 시트 열기 → [확장 프로그램] → [Apps Script]
//   2. 이 코드 전체 붙여넣기 (기존 내용 삭제 후)
//   3. 저장(Ctrl+S)
//   4. [배포] → [새 배포]
//      - 유형: 웹 앱
//      - 실행: 나 (본인 계정)
//      - 액세스: 모든 사용자 (익명 포함)
//   5. 배포 URL 복사 → index.html 의 SCRIPT_URL 에 붙여넣기
// ================================================================
//
// ★ 필요한 시트 목록 (시트명 정확히 맞춰야 함):
//   - 기본정보       : 키/값 2열 구조
//   - 클리닉통계     : 키/값 2열 구조
//   - 이달의이벤트   : 헤더 행 + 데이터 행
//   - 후기사진       : 헤더 행 + 데이터 행
// ================================================================

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const data = {
    info:        getKeyValue(ss, '기본정보'),
    clinicStats: getKeyValue(ss, '클리닉통계'),
    events:      getSheetRows(ss, '이달의이벤트'),
    photos:      getSheetRows(ss, '후기사진')
  };

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 키/값 2열 시트 → {key: value} 객체
function getKeyValue(ss, sheetName) {
  try {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return {};
    const rows = sheet.getDataRange().getValues();
    const result = {};
    rows.forEach(function(row) {
      const key = String(row[0]).trim();
      const val = row[1] !== undefined ? String(row[1]).trim() : '';
      if (key) result[key] = val;
    });
    return result;
  } catch(e) { return {}; }
}

// 헤더 + 데이터 시트 → 객체 배열
function getSheetRows(ss, sheetName) {
  try {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    const headers = data[0].map(function(h) { return String(h).trim(); });
    return data.slice(1)
      .filter(function(row) { return row.some(function(cell) { return cell !== ''; }); })
      .map(function(row) {
        const obj = {};
        headers.forEach(function(h, i) {
          obj[h] = row[i] !== undefined ? String(row[i]).trim() : '';
        });
        return obj;
      });
  } catch(e) { return []; }
}
