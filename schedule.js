/* ── 예약 가능 시간 규칙 (booking.html · admin.html 공용) ──
   Firebase roa/schedule
     weekly: { 0~6: { closed, open, close, lunchStart, lunchEnd } }   ← 관리자 '진료시간 설정' 탭 (없으면 아래 기본값)
     dates : { 'YYYY-MM-DD': { closed, type, open, close, lunchStart, lunchEnd, blocked:[], extra:[], memo } }
       type: 'off'(종일 휴무) · 'short'(단축 영업) · 'special'(특별 근무: 휴무일 영업) · 'change'(시간 변경)
   마지막 예약
     일반 시술: 점심·마감 1시간 전 (평일 12:00 · 20:00)
     울쎄라·온쎄라·볼쎄라 · 실리프팅(코 제외): 1시간 30분 전 (평일 11:30 · 19:30)
*/
(function (w) {
    const WEEKDAY = { closed: false, open: '11:00', close: '21:00', lunchStart: '13:00', lunchEnd: '14:00' };
    const DEFAULT_WEEKLY = {
        0: { closed: true },
        1: WEEKDAY, 2: WEEKDAY,
        3: { closed: true, open: '11:00', close: '21:00', lunchStart: '13:00', lunchEnd: '14:00' },
        4: WEEKDAY, 5: WEEKDAY,
        6: { closed: false, open: '10:00', close: '15:00', lunchStart: '', lunchEnd: '' }
    };
    const LEAD_NORMAL = 60, LEAD_LONG = 90, STEP = 30;

    const LONG_IDS = ['ulthera', 'onsera', 'volsera', 'oneday-silift', '원데이-실리프팅_1793602311456',
                      '팔자주름-패키지_1791787939214', '듀얼-팔자지우개_1793602306708'];

    const toMin = t => { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
    const toStr = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
    const dowOf = dateStr => { const [y, mo, d] = dateStr.split('-').map(Number); return new Date(y, mo - 1, d).getDay(); };

    /* 울쎄라·온쎄라·볼쎄라 · 실리프팅(코 실리프팅 제외)이면 true */
    function isLongProcedure(programId, names) {
        if (programId && LONG_IDS.includes(programId)) return true;
        return (names || []).some(n => {
            n = String(n || '');
            if (/(울|온|볼)쎄라/.test(n)) return true;
            if (/실\s*리프팅/.test(n) && !/코\s*실\s*리프팅|비너스코/.test(n)) return true;
            return false;
        });
    }

    /* 요일별 진료시간 (관리자 설정 → 없으면 기본값) */
    function weeklyFor(dow, sched) {
        const wk = sched && sched.weekly;
        const v = wk && wk[dow];
        return (v && (v.closed || (v.open && v.close))) ? v : DEFAULT_WEEKLY[dow];
    }

    /* 그날의 진료시간. 휴진이면 null */
    function hoursFor(dateStr, sched) {
        const ov = (sched && sched.dates && sched.dates[dateStr]) || null;
        if (ov) {
            if (ov.closed) return null;
            const base = weeklyFor(dowOf(dateStr), sched);
            const open = ov.open || (base && base.open), close = ov.close || (base && base.close);
            if (open && close) {
                const hasLunch = ov.lunchStart !== undefined;
                return { open, close,
                         lunchStart: hasLunch ? (ov.lunchStart || '') : (base.lunchStart || ''),
                         lunchEnd:   hasLunch ? (ov.lunchEnd   || '') : (base.lunchEnd   || '') };
            }
        }
        const b = weeklyFor(dowOf(dateStr), sched);
        return (!b || b.closed) ? null : b;
    }

    function isClosed(dateStr, sched) { return !hoursFor(dateStr, sched); }

    /* 진료시간 안의 30분 단위 시간 (구간 끝 lead 분 전까지) */
    function slotsByHours(h, lead) {
        if (!h || !h.open || !h.close) return [];
        const out = [];
        const open = toMin(h.open), close = toMin(h.close);
        const ls = toMin(h.lunchStart), le = toMin(h.lunchEnd);
        const segs = (ls != null && le != null && ls > open && le < close) ? [[open, ls], [le, close]] : [[open, close]];
        segs.forEach(([s, e]) => { for (let t = s; t <= e - lead; t += STEP) out.push(toStr(t)); });
        return out;
    }

    /* 예약 가능한 시간 목록 */
    function availableSlots(dateStr, sched, long) {
        const ov = (sched && sched.dates && sched.dates[dateStr]) || {};
        const h = hoursFor(dateStr, sched);
        if (!h) return [];
        const blocked = ov.blocked || [], extra = ov.extra || [];
        const list = slotsByHours(h, long ? LEAD_LONG : LEAD_NORMAL).filter(t => !blocked.includes(t));
        extra.forEach(t => { if (!list.includes(t) && !blocked.includes(t)) list.push(t); });
        return list.sort((a, b) => toMin(a) - toMin(b));
    }

    w.ROA_SCHEDULE = { DEFAULT_WEEKLY, LEAD_NORMAL, LEAD_LONG, isLongProcedure, weeklyFor, hoursFor, isClosed, slotsByHours, availableSlots, dowOf, toMin, toStr };
})(window);
