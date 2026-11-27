import React, { useRef, useState } from 'react';

// Illustrative tool guide: no claims about real rankings, no calls to the API.
const points = [
  ['west', 'post', 'GBP Post', 220, 285, 'M220 297 L274 293 L350 259 L418 226'],
  ['north', 'qa', 'Q&A', 418, 214, 'M418 226 L548 191 L660 233'],
  ['east', 'seo', 'Local SEO', 660, 220, 'M660 233 L706 258 L610 307 L502 352 L441 351'],
  ['south', 'calendar', 'Calendar', 441, 339, 'M441 351 L399 384 L312 335 L274 293 L220 297'],
  ['center', 'competitor', 'Stand out', 548, 181, 'M548 191 L500 175 L451 153 L385 130'],
];
const data={
west:{i:0,tool:'01 / GBP POST',title:'Give locals a reason to visit.',body:'Have a new offer or update? Turn it into a Google Business Profile post.',next:"Write a post about this week's offer.",action:'Open GBP Post'},
north:{i:1,tool:'02 / Q&A REPLY',title:'Answer before they ask again.',body:'Customers may want to know about opening hours, accessibility or services. Prepare a clear reply.',next:'Draft an answer to a common customer question.',action:'Open Q&A Reply'},
east:{i:2,tool:'03 / SEO COPY',title:'Make your business easier to find.',body:'Help describe what you offer and where you serve customers in your profile and website copy.',next:'Create a local-search-friendly description.',action:'Open SEO Copy'},
south:{i:3,tool:'04 / CALENDAR',title:'Stay visible throughout the month.',body:'Plan useful updates ahead of time instead of starting from scratch every week.',next:'Create a month of 12 post ideas.',action:'Open Calendar'},
center:{i:4,tool:'05 / STAND OUT',title:'Find your point of difference.',body:'Compare a competitor’s public post or profile description to identify ways to differentiate.',next:'Paste a competitor’s text to explore potential gaps.',action:'Open Stand Out'}};

export default function LocalSignalCity({ onOpenTool }) {
  const [selected, setSelected] = useState('west');
  const [hover, setHover] = useState('');
  const scene = useRef(null);
  const active = hover || selected;
  const detail = data[active];
  const choose = key => { setSelected(key); setHover(''); };
  const clearHover = () => setHover('');
  const clearGlow = () => { clearHover(); scene.current?.style.setProperty('--glow', '0'); };
  const moveGlow = event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    event.currentTarget.style.setProperty('--mx', `${(event.clientX - rect.left) / rect.width * 100}%`);
    event.currentTarget.style.setProperty('--my', `${(event.clientY - rect.top) / rect.height * 100}%`);
    event.currentTarget.style.setProperty('--glow', '1');
  };
  return (
    <section lang="en" dir="ltr" className="ls-live-band ls-v6-band" aria-label="Explore Local Signal tools">
      <div className="ls-v6-intro">
        <span className="ls-v6-kicker"><i /> LOCAL SIGNAL / EXPLORE</span>
        <h2>Every location has a next move.</h2>
        <p>Choose a signal on the map. Hover to explore, click or tap to select.</p>
        <span className="ls-v6-disclaimer">Interactive guide · illustrative map, not live business data</span>
      </div>
      <div className="ls-live-scene" ref={scene} data-active={active} onPointerMove={moveGlow} onPointerLeave={clearGlow}>
        <div className="ls-live-image"><img src="/images/ls-city.webp" alt="Illustrative city with golden and rose-lit streets" width="1200" height="675" loading="lazy" decoding="async" /></div>
        <div className="ls-live-glow" />
        <svg aria-hidden="true" className="ls-live-network" preserveAspectRatio="none" viewBox="0 0 900 506">
          {points.map(([key, , , , , path], i) => <React.Fragment key={key}>
            <path className="ls-live-route" data-link={key} d={path} />
            <path className="ls-live-route ls-live-dash" data-link={key} d={path} />
            <circle className="ls-live-particle" data-link={key} r="2.3"><animateMotion begin={`${-i * 1.1}s`} dur={`${4.8 + i * .6}s`} path={path} repeatCount="indefinite" /></circle>
          </React.Fragment>)}
        </svg>
        {points.map(([key, , label, x, y]) => (
          <button key={key} type="button" className="ls-live-node ls-v6-node" data-node={key}
            aria-label={`${label} — explore example`} aria-pressed={selected === key}
            style={{ '--nx': `${x / 900 * 100}%`, '--ny': `${y / 506 * 100}%` }}
            onPointerEnter={event => { if (event.pointerType === 'mouse') setHover(key); }}
            onPointerLeave={clearHover} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setHover(key); }}
            onBlur={clearHover} onClick={() => choose(key)}
            onKeyDown={event => { if (event.key === 'Escape') { clearHover(); event.currentTarget.blur(); } }}>
            <span className="ls-live-node-wave" aria-hidden="true" /><span className="ls-live-node-ring" aria-hidden="true" />
            {key === 'center' && <svg className="ls-v6-extra-pin" viewBox="0 0 24 30" aria-hidden="true"><path d="M12 28C9 23 2 17 2 11a10 10 0 0 1 20 0c0 6-7 12-10 17Z" fill="#211524" stroke="#FFD58B" strokeWidth="1.5"/><circle cx="12" cy="11" r="4" fill="none" stroke="#FFD58B" strokeWidth="1.5" /></svg>}
            <span className="ls-v6-node-label">{label}</span>
          </button>
        ))}
      </div>
      <div className="ls-v6-insight" role="region" aria-label="Selected tool guidance">
        <div className="ls-v6-card-top"><span className="ls-v6-kicker"><i /><span>{detail.tool}</span></span><span className="ls-v6-example">EXAMPLE</span></div>
        <div className="ls-v6-card-main"><img src={`/images/ls-tool-${points[detail.i][1]}.webp`} alt="" width="56" height="56" /><div><h3 aria-live="polite">{detail.title}</h3><p>{detail.body}</p></div></div>
        <div className="ls-v6-next"><span>SUGGESTED NEXT MOVE</span><p>{detail.next}</p></div>
        <button className="ls-v6-open" type="button" onClick={() => { const tool = points[detail.i][1]; choose(active); onOpenTool(tool); }}>{detail.action} <span aria-hidden="true">↗</span></button>
      </div>
      <div className="ls-v6-picker" aria-label="Explore tools">{points.map(([key, , label]) => <button key={key} type="button" data-pick={key} aria-pressed={selected === key} onClick={() => choose(key)}><i />{label}</button>)}</div>
    </section>
  );
}
