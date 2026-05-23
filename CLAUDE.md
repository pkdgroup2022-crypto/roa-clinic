# 로아한의원 부천점 — 홈페이지 프로젝트

## 프로젝트 개요
리프팅 전문 한의원 **로아한의원 부천점**의 공개 홈페이지.
순수 정적 HTML/CSS/JS 단일 파일 구조. 별도 프레임워크 없음.

## 로컬 서버 실행 방법
```powershell
# PowerShell에서 실행 (포트 8080)
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8080
```
브라우저에서 `http://localhost:8080` 접속.

또는 Claude Code의 launch.json 설정으로 실행 (`로아한의원` configuration).

## 파일 구조
```
미용한의원/
├── index.html          ← 메인 홈페이지 (모든 섹션 포함)
├── serve.ps1           ← PowerShell HTTP 서버
├── admin.html          ← 관리자 페이지 (사진 업로드 등)
├── apps-script.js      ← Google Apps Script 백엔드 코드
├── images/
│   ├── ulthera.png     ← 울쎄라 기기 사진
│   ├── onda.png        ← 온다 기기 사진 (투명 배경)
│   ├── volnumer.png    ← 볼뉴머 기기 사진
│   ├── venusko.png     ← 비너스코 시술 사진 (투명 배경)
│   ├── sig-lifting.png ← 수줍은리프팅 얼굴 이모티콘
│   ├── sig-volume.png  ← 볼륨샷 얼굴 이모티콘
│   └── sig-slim.png    ← 슬림샷 얼굴 이모티콘
└── CLAUDE.md           ← 이 파일
```

## 섹션 구성 (index.html)
1. **Nav** — 고정 상단 네비게이션, 모바일 햄버거 메뉴
2. **Hero** — 풀스크린 배경 이미지, 예약 버튼
3. **이달의 이벤트** — 동적 이벤트 목록 (빨간 가격 표시)
4. **Signature** — 수줍은리프팅 / 볼륨샷 / 슬림샷 에디토리얼 레이아웃
5. **Custom Lifting** — 울쎄라 / 온다 / 볼뉴머 / 비너스코 카드 그리드
6. **시술 전후 사진** — 캐러셀 + 시술명 필터 버튼 6개
7. **오시는 길 & 진료시간** — 지도 링크, 진료시간표

## CSS 핵심 변수
```css
--dark: #0E0E0E  --gold: #B09060  --cream: #F4EFE6
--warm: #FAF7F2  --naver: #03C75A
```
폰트: Noto Serif KR (제목) + Noto Sans KR (본문)

## JS 데이터 구조 (DEMO 객체)
백엔드(Google Sheets) 미연결 시 `DEMO` 상수의 데이터를 사용.
- `DEMO.info` — 클리닉 기본 정보
- `DEMO.events` — 이달의 이벤트 목록
- `DEMO.programs` — 시술 프로그램 (Signature / Custom Lifting)
- `DEMO.photos` — 전후 사진 목록

## 전후사진 필터 순서
```javascript
const FILTER_ORDER = ['수줍은리프팅', '울쎄라', '온다', '볼륨샷', '슬림샷', '비너스코'];
```
사진 데이터의 `시술명` 필드가 FILTER_ORDER 항목을 **포함(includes)**하면 매칭.

## 이미지 처리 방식
- 흰 배경 사진: `mix-blend-mode: multiply` + `background: #fff` 래퍼
- 투명 배경 PNG: 그대로 사용 (온다, 비너스코는 remove.bg로 배경 제거)
- Signature 이미지: 280×280px (모바일에서 200×200px, 가운데 정렬)

## 모바일 반응형 핵심
- 900px 이하: 햄버거 메뉴, 1열 레이아웃
- 760px 이하: Signature 1열, 치료 카드 2열
- 600px 이하: 전후사진 `aspect-ratio: 4/3` (직사각형 유지)
- 540px 이하: 히어로 폰트 축소, 이벤트 세로 배치
- 420px 이하: 치료 카드 1열

## 네이버 예약 링크
```javascript
const NAVER_BOOKING = 'https://booking.naver.com/booking/13/bizes/1064400953';
const NAVER_MAP     = 'https://map.naver.com/p/entry/place/1064400953?';
```

## GitHub 저장소
https://github.com/pkdgroup2022-crypto/claude-memory

## 앞으로 작업할 것들
- [ ] Google Sheets + Apps Script 백엔드 연결
- [ ] Vercel 배포 (실제 도메인으로 서비스)
- [ ] 실제 전후사진 업로드
- [ ] 실제 Hero 배경 이미지 교체
