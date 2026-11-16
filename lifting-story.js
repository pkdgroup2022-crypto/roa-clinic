/* 리프팅 노하우 ~ "한의원에서 리프팅? 의심하셔도 좋습니다." 섹션
   (원래 메인 페이지에 있던 부분 — 실리프팅 계열 상세페이지에서만 표시)
   사용: mountLiftingStory(document.getElementById('liftingStory')) */
(function () {
    const CSS = `
.ls-wrap { --ls-dark:#1a1a1a; --ls-gold:#8B1A2A; --ls-mid:#3C3C3C; --ls-muted:#888888; width:100%; }   /* 메인 페이지 색상 그대로 (--gold가 메인에선 버건디 핑크) */
.ls-wrap .ls-pc { display:inline; } .ls-wrap .ls-mo { display:none; } .ls-wrap .ls-mo-br { display:none; }

/* 임팩트 통계 */
.ls-impact { background:#F7F7F7; padding:6rem 2rem; display:flex; align-items:center; justify-content:center; }
.ls-impact-inner { max-width:780px; width:100%; margin:0 auto; }
.ls-stats-row { display:flex; align-items:center; gap:3rem; flex-wrap:wrap; margin-bottom:0.7rem; }
.ls-brackets-col { display:flex; flex-direction:column; gap:1.4rem; }
.ls-bracket-item { display:flex; flex-direction:column; gap:0.3rem; }
.ls-bracket-num { font-family:'Noto Serif KR',serif; font-size:clamp(2.4rem,5.5vw,4.2rem); font-weight:700; color:var(--ls-dark); letter-spacing:-0.01em; line-height:1.2; }
.ls-bracket { color:var(--ls-gold); }
.ls-counter { font-variant-numeric:tabular-nums; }
.ls-bracket-label { font-size:clamp(0.72rem,1.1vw,0.88rem); color:var(--ls-muted); letter-spacing:0.08em; padding-left:0.2rem; }
.ls-noha { font-family:'Noto Serif KR',serif; font-size:clamp(1.8rem,4vw,3.4rem); font-weight:700; color:var(--ls-dark); letter-spacing:0.04em; border-left:3px solid var(--ls-gold); padding-left:1.4rem; line-height:1.35; white-space:nowrap; }
.ls-period { font-size:clamp(0.68rem,1.2vw,0.8rem); color:var(--ls-muted); letter-spacing:0.03em; margin:0 0 2rem; }
.ls-copy { font-family:'Noto Serif KR',serif; font-size:clamp(1.1rem,1.8vw,1.35rem); color:var(--ls-mid); line-height:1.9; font-weight:600; word-break:keep-all; margin:0; }
.ls-copy strong { color:var(--ls-dark); font-weight:700; }

/* 고민 */
.ls-worry { background:#fff; padding:7rem 2rem; display:flex; justify-content:center; }
.ls-worry-inner { max-width:900px; width:100%; text-align:center; }
.ls-worry-label { font-size:1rem; color:var(--ls-gold); letter-spacing:0.15em; font-weight:700; margin-bottom:1.2rem; }
.ls-worry-title { font-family:'Noto Serif KR',serif; font-size:clamp(1.8rem,3.8vw,3rem); font-weight:700; color:var(--ls-dark); line-height:1.35; margin:0 0 1.2rem; word-break:keep-all; }
.ls-worry-sub { font-size:clamp(0.9rem,1.5vw,1.05rem); color:var(--ls-mid); margin:0 0 3.5rem; line-height:1.7; }
.ls-worry-row1 { display:flex; gap:1.2rem; margin-bottom:1.2rem; }
.ls-worry-row2 { display:flex; gap:1.2rem; justify-content:center; }
.ls-worry-row2 .ls-worry-card { flex:0 1 calc(33.33% - 0.6rem); }
.ls-worry-card { flex:1; border:1px solid rgba(139,26,42,0.2); border-radius:10px; padding:2rem 1.5rem; font-size:clamp(0.88rem,1.3vw,1rem); color:var(--ls-mid); line-height:1.8; text-align:center; word-break:keep-all; background:#fafafa; }
.ls-worry-card strong { color:var(--ls-dark); font-weight:700; }
.ls-worry-bottom { margin-top:4.5rem; }
.ls-worry-bottom-main { font-size:clamp(1rem,1.6vw,1.15rem); color:var(--ls-mid); margin:0 0 1rem; }
.ls-worry-bottom-sub { font-family:'Noto Serif KR',serif; font-size:clamp(1.2rem,2.4vw,1.8rem); color:var(--ls-dark); font-weight:500; line-height:1.7; word-break:keep-all; margin:0; }
.ls-worry-bottom-sub strong { color:var(--ls-gold); font-weight:800; }

/* 한의원에서 리프팅? */
.ls-wk { background:#F8F5F0; padding:100px 24px; }
.ls-wk-inner { max-width:1000px; margin:0 auto; }
.ls-wk-header { text-align:center; margin-bottom:72px; }
.ls-wk-title { font-family:'Noto Serif KR',serif; font-size:clamp(1.8rem,4vw,3rem); color:#1a1a1a; line-height:1.4; margin:0 0 36px; font-weight:700; word-break:keep-all; }
.ls-wk-qbox { display:inline-block; border:1px solid rgba(0,0,0,0.12); border-radius:8px; padding:20px 32px; background:#fff; }
.ls-wk-q { font-family:'Noto Serif KR',serif; font-size:clamp(1.15rem,2.4vw,1.6rem); color:var(--ls-gold); font-weight:600; margin:0 0 10px; }
.ls-wk-qdesc { font-size:clamp(0.95rem,1.8vw,1.2rem); color:#666; margin:0; }
.ls-wk-answer { font-size:clamp(1.1rem,2.2vw,1.4rem); font-weight:600; color:#1a1a1a; margin:32px 0 0; line-height:1.7; text-align:center; }
.ls-wk-items { display:flex; flex-direction:column; gap:80px; }
.ls-wk-item { display:flex; flex-direction:column; gap:28px; }
.ls-wk-num { display:block; font-family:'Noto Serif KR',serif; font-size:0.85rem; color:var(--ls-gold); letter-spacing:0.15em; margin-bottom:12px; font-weight:600; }
.ls-wk-item-title { font-family:'Noto Serif KR',serif; font-size:clamp(1.45rem,2.6vw,1.9rem); color:#1a1a1a; font-weight:700; margin:0 0 16px; line-height:1.5; word-break:keep-all; }
.ls-wk-item-desc { font-size:clamp(1.1rem,1.8vw,1.35rem); color:#555; line-height:1.9; word-break:keep-all; margin:0; }
.ls-wk-media { border-radius:12px; overflow:hidden; aspect-ratio:4/3; max-width:560px; width:100%; margin:0 auto; }
.ls-wk-media video { width:100%; height:100%; object-fit:cover; border-radius:12px; display:block; }
.ls-wk-gallery { display:flex; gap:16px; width:100%; align-items:flex-start; }
.ls-wk-gitem { flex:1; display:flex; flex-direction:column; gap:10px; }
.ls-wk-gitem:nth-child(3) { flex:0.65; }
.ls-wk-gimg { width:100%; height:auto; display:block; border-radius:10px; pointer-events:none; user-select:none; -webkit-user-drag:none; }
.ls-wk-gcap { font-size:clamp(0.72rem,1.1vw,0.82rem); color:#555; text-align:center; line-height:1.5; word-break:keep-all; margin:0; }
.ls-wk-conclusion { margin:60px 0 0; text-align:center; font-size:clamp(1.3rem,3vw,1.8rem); line-height:1.9; color:#1a1a1a; word-break:keep-all; }
.ls-wk-conclusion em { font-style:normal; color:#1a1a1a; font-weight:700; }
.ls-wk-conclusion strong { color:var(--ls-gold); font-weight:700; }

@media (max-width:760px) {
    .ls-wrap .ls-pc { display:none; } .ls-wrap .ls-mo { display:inline; } .ls-wrap .ls-mo-br { display:inline; }
    .ls-wk { padding:70px 20px; }
    .ls-wk-media { aspect-ratio:16/9; }
    .ls-wk-items { gap:56px; }
    .ls-wk-q { font-size:1rem; }
    .ls-wk-gallery { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto auto; gap:10px; }
    .ls-wk-gitem:nth-child(1) { grid-column:1; grid-row:1; }
    .ls-wk-gitem:nth-child(2) { grid-column:2; grid-row:1; }
    .ls-wk-gitem:nth-child(3) { grid-column:1 / -1; grid-row:2; max-width:55%; margin:0 auto; }
    .ls-wk-gcap { font-size:0.68rem; }
}
@media (max-width:700px) {
    .ls-worry { padding:5rem 1.6rem; }
    .ls-worry-row1, .ls-worry-row2 { flex-direction:column; }
    .ls-worry-row2 .ls-worry-card { flex:1 1 auto; }
    .ls-worry-bottom-sub { font-size:1rem; }
}
@media (max-width:600px) {
    .ls-impact { padding:4rem 1.6rem; }
    .ls-stats-row { flex-direction:row; align-items:center; gap:1.2rem; flex-wrap:nowrap; }
    .ls-noha { font-size:clamp(1.6rem,7vw,2.2rem); white-space:normal; }
    .ls-bracket-num { font-size:clamp(1.6rem,7vw,2.2rem); white-space:nowrap; }
    .ls-copy { font-size:0.83rem; }
}`;

    const HTML = `
<section class="ls-impact" id="lsImpact">
    <div class="ls-impact-inner">
        <div class="ls-stats-row">
            <div class="ls-brackets-col">
                <div class="ls-bracket-item">
                    <div class="ls-bracket-num"><span class="ls-bracket">[</span>&nbsp;<span class="ls-counter" id="lsTreatments">0</span>건&nbsp;<span class="ls-bracket">]</span></div>
                    <div class="ls-bracket-label">리프팅 시술건수</div>
                </div>
                <div class="ls-bracket-item">
                    <div class="ls-bracket-num"><span class="ls-bracket">[</span>&nbsp;<span class="ls-counter" id="lsThreads">0</span>줄&nbsp;<span class="ls-bracket">]</span></div>
                    <div class="ls-bracket-label">리프팅 실 사용건수</div>
                </div>
            </div>
            <div class="ls-noha">리프팅의<br>노하우</div>
        </div>
        <p class="ls-period" id="lsPeriod"></p>
        <p class="ls-copy">
            <span class="ls-pc">공장형 시술이 아닌, 오직 당신의 얼굴만을 위해 고민한 결과입니다.<br></span>
            <span class="ls-mo">공장형 시술이 아닌,<br>오직 당신의 얼굴만을 위해 고민한 결과입니다.<br></span>
            <strong>결과로 증명하는 1:1 맞춤 리프팅을 지금 확인하세요.</strong>
        </p>
    </div>
</section>

<section class="ls-worry">
    <div class="ls-worry-inner">
        <div class="ls-worry-label">병원 예약 전 고민</div>
        <h2 class="ls-worry-title">"정말 여기서 하면,<br>이번엔 다를까?"</h2>
        <p class="ls-worry-sub">
            <span class="ls-pc">병원 예약 버튼 누르기 전, 여러분이 속으로 하셨던 고민들입니다.</span>
            <span class="ls-mo">병원 예약 버튼 누르기 전,<br>여러분이 속으로 하셨던 고민들입니다.</span>
        </p>
        <div class="ls-worry-row1">
            <div class="ls-worry-card">"비싼 돈 주고 했는데,<br><strong>효과가 없으면 어떻게 하지?</strong>"</div>
            <div class="ls-worry-card">"시술받다 잘못돼서<br><strong>얼굴이 어색해지면 어쩌지?</strong>"</div>
            <div class="ls-worry-card">"실장님 말고,<br><strong>진짜 원장님이 내 얼굴을 보고 상담해줄까?</strong>"</div>
        </div>
        <div class="ls-worry-row2">
            <div class="ls-worry-card">"나만을 위한 디자인,<br><strong>나에게 어울리는 시술은 없을까?</strong>"</div>
            <div class="ls-worry-card">"도대체<br><strong>누구한테 내 얼굴을 맡겨야 할까?</strong>"</div>
        </div>
        <div class="ls-worry-bottom">
            <p class="ls-worry-bottom-main">이런 고민들, 수많은 환자분이 토로하셨습니다.</p>
            <p class="ls-worry-bottom-sub">그래서 저희는 원장이 진료부터 시술까지,<br><strong>1:1 전담 시스템을 원칙으로 합니다.</strong></p>
        </div>
    </div>
</section>

<section class="ls-wk">
    <div class="ls-wk-inner">
        <div class="ls-wk-header">
            <h2 class="ls-wk-title">한의원에서 리프팅?<br>의심하셔도 좋습니다.</h2>
            <div class="ls-wk-qbox">
                <p class="ls-wk-q">"리프팅은 피부과/성형외과 아니야?"</p>
                <p class="ls-wk-qdesc"><span class="ls-pc">저희에게 처음 오시는 분들이 가장 많이 하시는 질문입니다.</span><span class="ls-mo">저희에게 처음 오시는 분들이<br>가장 많이 하시는 질문입니다.</span></p>
            </div>
            <p class="ls-wk-answer">왜 결과가 다른지,<br>이제 그 이유를 증명하겠습니다.</p>
        </div>

        <div class="ls-wk-items">
            <div class="ls-wk-item">
                <div>
                    <span class="ls-wk-num">01</span>
                    <h3 class="ls-wk-item-title">실리프팅,<br class="ls-mo-br"> 그 시작은 <span style="color:var(--ls-gold)">한방 매선</span>이었습니다.</h3>
                    <p class="ls-wk-item-desc">수천 년을 이어온 정교함에 현대한의학과 의학의 해부학적 지식을 더했습니다.</p>
                </div>
                <div class="ls-wk-media">
                    <video src="images/wk-01.mp4" autoplay loop muted playsinline preload="metadata" aria-label="실리프팅 시술"></video>
                </div>
            </div>

            <div class="ls-wk-item">
                <div>
                    <span class="ls-wk-num">02</span>
                    <h3 class="ls-wk-item-title">끊임없는 연구,<br class="ls-mo-br"> <span style="color:var(--ls-gold)">결과로 증명되는 실력</span></h3>
                    <p class="ls-wk-item-desc">수많은 미용 학회와 임상 연구를 통해, 매년 변하는 트렌드 직접 시술하며 쌓아온 데이터가 당신의 리프팅 결과로 이어집니다.</p>
                </div>
                <div class="ls-wk-gallery">
                    <div class="ls-wk-gitem">
                        <img src="images/wk-02a.jpg" alt="임상약침회 수료" class="ls-wk-gimg" loading="lazy" decoding="async">
                        <p class="ls-wk-gcap">임상약침회<br>스킨부스터 전문가과정 수료</p>
                    </div>
                    <div class="ls-wk-gitem">
                        <img src="images/wk-02b.jpg" alt="대한통합레이저학회" class="ls-wk-gimg" loading="lazy" decoding="async">
                        <p class="ls-wk-gcap">대한통합레이저학회<br>회원</p>
                    </div>
                    <div class="ls-wk-gitem">
                        <img src="images/wk-02c.jpg" alt="서울시한의사회 인증" class="ls-wk-gimg" loading="lazy" decoding="async">
                        <p class="ls-wk-gcap">서울특별시한의사회 인증<br>미용 시술 한의사</p>
                    </div>
                </div>
            </div>

            <div class="ls-wk-item">
                <div>
                    <span class="ls-wk-num">03</span>
                    <h3 class="ls-wk-item-title">실장 상담 없이,<br class="ls-mo-br"> <span style="color:var(--ls-gold)">'원장 1:1 전담'</span>의 이유</h3>
                    <p class="ls-wk-item-desc">공장형 병원에서 가장 많이 느끼는 불만이<br class="ls-mo-br"> 상담 따로, 시술 따로입니다.<br>저희는 의료진이 직접 상담하고 시술합니다.</p>
                </div>
                <div class="ls-wk-media">
                    <video src="images/wk-03.mp4" autoplay loop muted playsinline preload="metadata" aria-label="1:1 전담 시술"></video>
                </div>
            </div>
        </div>

        <p class="ls-wk-conclusion">
            <span class="ls-pc">결국, 여러분이 찾는 건 <em>'병원 종류나 이름'</em>이 아니라 <strong>'확실한 결과'</strong>입니다.</span>
            <span class="ls-mo">결국, 여러분이 찾는 건<br><em>'병원 종류나 이름'</em>이 아니라<br><strong>'확실한 결과'</strong>입니다.</span>
        </p>
    </div>
</section>`;

    // 관리자 "수치 통계" 값 (Firebase /stats). 읽기 실패 시 이 브라우저 저장값 → 기본값 순
    const FIREBASE_STATS = 'https://roa-clinic-default-rtdb.firebaseio.com/roa/stats.json';
    const DEFAULT_STATS = { treatments: 5428, threads: 113210, period: '2024년 3월 ~ 2026년 5월' };
    async function getStats() {
        let stats = { ...DEFAULT_STATS };
        try {
            const res = await fetch(FIREBASE_STATS + '?t=' + Date.now());
            const fb = res.ok ? await res.json() : null;
            if (fb && (fb.treatments || fb['시술건수'])) stats = { ...stats, ...fb };
            else throw 0;
        } catch (e) {
            try {
                const local = JSON.parse(localStorage.getItem('roa_stats') || '{}');
                if (local.treatments) stats = { ...stats, ...local };
            } catch (e2) {}
        }
        return {
            treatments: parseInt(stats.treatments || stats['시술건수'] || 4500),
            threads:    parseInt(stats.threads    || stats['실사용줄'] || 101300),
            period:     String(stats.period || stats['기준기간'] || '2024년 3월 ~ 2026년 5월').replace(' 기준', ''),
        };
    }

    function animateCounter(el, target, duration) {
        const start = performance.now();
        (function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);   // easeOutExpo
            el.textContent = Math.floor(ease * target).toLocaleString('ko-KR');
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString('ko-KR');
        })(start);
    }

    window.mountLiftingStory = function (host) {
        if (!host || host.dataset.mounted) return;
        host.dataset.mounted = '1';
        if (!document.getElementById('lsStyle')) {
            const st = document.createElement('style');
            st.id = 'lsStyle';
            st.textContent = CSS;
            document.head.appendChild(st);
        }
        host.className = 'ls-wrap';
        host.innerHTML = HTML;
        host.style.display = '';

        mountCounters(host);
    };

    async function mountCounters(host) {
        const s = await getStats();
        const elT = host.querySelector('#lsTreatments');
        const elTh = host.querySelector('#lsThreads');
        host.querySelector('#lsPeriod').textContent = '*' + s.period + ' 기준';
        // 화면에 들어올 때마다 카운터 재시작
        new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounter(elT, s.treatments, 1500);
                animateCounter(elTh, s.threads, 1500);
            } else {
                elT.textContent = '0';
                elTh.textContent = '0';
            }
        }, { threshold: 0, rootMargin: '-40% 0px -20% 0px' }).observe(host.querySelector('#lsImpact'));
    };
})();
