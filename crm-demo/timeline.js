// Single source of truth for timing: used by the page (visuals) and audio.js (sound).
(function (root) {
  const CPS = 15; // typing speed, chars/second
  const E = {
    duration: 41.5, fps: 60,
    viewStart: [2.0, 6.7, 22.7, 33.1],           // dash, pipeline, contacts, dash
    navPipe: { arrive: 6.4, click: 6.6 },
    grab: 8.9, drop: 10.8,
    newBtn: { arrive: 12.4, click: 12.6 },
    modalOpen: 12.7, modalClose: 19.7, newDeal: 19.8,
    fName: { arrive: 13.6, click: 13.8, type: 14.0, text: 'Local SEO sprint' },
    fCo:   { arrive: 15.7, click: 15.9, type: 16.1, text: 'Northside Dental' },
    fVal:  { arrive: 17.8, click: 18.0, type: 18.2, text: '$14,500' },
    save:  { arrive: 19.4, click: 19.6 },
    navCont: { arrive: 22.4, click: 22.6 },
    row: { arrive: 24.4, click: 24.8 }, drawerOpen: 24.9,
    note: { arrive: 26.6, click: 26.8, type: 27.0, text: 'Wants to kick off in November — send contract.' },
    noteSaved: 30.3, drawerClose: 31.8,
    navDash: { arrive: 32.8, click: 33.0 },
    endCard: 38.8,
    toasts: [
      { t: 10.9, dur: 2.2, text: '🎉 Orbit Fitness won — $31,000' },
      { t: 19.9, dur: 2.0, text: 'Deal created' },
      { t: 30.4, dur: 2.0, text: 'Note saved' },
    ],
  };
  E.CPS = CPS;
  E.charTimes = f => [...f.text].map((_, i) => f.type + i / CPS + 0.025 * Math.sin(i * 12.9898));
  E.typed = (f, t) => [...f.text].slice(0, E.charTimes(f).filter(c => t >= c).length).join('');
  E.clicks = () => [E.navPipe.click, E.grab, E.newBtn.click, E.fName.click, E.fCo.click, E.fVal.click,
    E.save.click, E.navCont.click, E.row.click, E.note.click, E.navDash.click];
  if (typeof module !== 'undefined') module.exports = E; else root.TL = E;
})(this);
