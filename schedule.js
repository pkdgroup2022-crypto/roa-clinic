/* ── 예약 가능 시간 규칙 (booking.html · admin.html 공용) ──
   기본 진료시간
     월·화·목·금 11:00~21:00 (점심 13:00~14:00) / 토 10:00~15:00 / 수·일 휴진
   마지막 예약
     일반 시술: 점심·마감 1시간 전 (평일 12:00 · 20:00)
     울쎄라·온쎄라·볼쎄라 · 실리프팅(코 제외): 1시간 30분 전 (평일 11:30 · 19:30)
   특정 날짜 변경: Firebase roa/schedule/YYYY-MM-DD
     { closed, open, close, lunchStart, lunchEnd, blocked:[시간], extra:[시간], memo }
*/
(function (w) {
    const DEFAULT_HOURS = {
        1: { open: '11:00', close: '21:00', lunchStart: '13:00', lunchEnd: '14:00' },
        2: { open: '11:00', close: '21:00', lunchStart: '13:00', lunchEnd: '14:00' },
        4: { open: '11:00', close: '21:00', lunchStart: '13:00', lunchEnd: '14:00' },
        5: { open: '11:00', close: '21:00', lunchStart: '13:00', lunchEnd: '14:00' },
        6: { open: '10:00', close: '15:00', lunchStart: '',      lunchEnd: ''      }
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

    /* 그날의 진료시간 (특정 날짜 변경 반영). 휴진이면 null */
    function hoursFor(dateStr, overrides) {
        const ov = (overrides || {})[dateStr] || null;
        if (ov && ov.closed) return null;
        const base = DEFAULT_HOURS[dowOf(dateStr)] || null;
        if (ov && ov.open && ov.close) {
            return { open: ov.open, close: ov.close, lunchStart: ov.lunchStart || '', lunchEnd: ov.lunchEnd || '' };
        }
        return base;
    }

    function isClosed(dateStr, overrides) { return !hoursFor(dateStr, overrides); }

    /* 진료시간 안의 30분 단위 시간 전부 (lead 분 전까지) */
    function slotsByHours(h, lead) {
        if (!h) return [];
        const out = [];
        const open = toMin(h.open), close = toMin(h.close);
        const ls = toMin(h.lunchStart), le = toMin(h.lunchEnd);
        const segs = (ls != null && le != null && ls > open && le < close) ? [[open, ls], [le, close]] : [[open, close]];
        segs.forEach(([s, e]) => { for (let t = s; t <= e - lead; t += STEP) out.push(toStr(t)); });
        return out;
    }

    /* 예약 가능한 시간 목록 */
    function availableSlots(dateStr, overrides, long) {
        const ov = (overrides || {})[dateStr] || {};
        const h = hoursFor(dateStr, overrides);
        if (!h) return [];
        const blocked = ov.blocked || [], extra = ov.extra || [];
        let list = slotsByHours(h, long ? LEAD_LONG : LEAD_NORMAL).filter(t => !blocked.includes(t));
        extra.forEach(t => { if (!list.includes(t) && !blocked.includes(t)) list.push(t); });
        return list.sort((a, b) => toMin(a) - toMin(b));
    }

    w.ROA_SCHEDULE = { DEFAULT_HOURS, LEAD_NORMAL, LEAD_LONG, isLongProcedure, hoursFor, isClosed, slotsByHours, availableSlots, dowOf, toMin, toStr };
})(window);
