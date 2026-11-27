import React from 'react';
import { createPortal } from 'react-dom';

const h = React.createElement;
const routes = [
  'M5 198 C170 198 180 130 315 126 S500 72 635 10',
  'M0 184 C165 184 174 114 310 113 S493 59 640 0',
  'M9 208 C180 208 191 143 325 139 S511 85 640 23',
];

function PurchaseLink() {
  return h('div', { className: 'ls-v7-access', dir: 'ltr', lang: 'en' },
    h('div', { className: 'ls-v7-price' },
      h('span', { className: 'ls-v7-price-amount' }, '$119'),
      h('span', { className: 'ls-v7-price-meta' }, 'One-time payment ', h('span', null, '·'), ' No subscription')
    ),
    h('a', { className: 'ls-v7-buy', href: '/buy.html', target: '_blank', rel: 'noopener noreferrer' },
      'Get lifetime access ', h('span', { 'aria-hidden': true }, '↗')
    )
  );
}

function DiscoveryScene() {
  return h('div', {
    className: 'ls-v8-discovery', lang: 'en', dir: 'ltr', role: 'img',
    'aria-label': 'Be there when they search. Illustrative local searches: coffee shop near me, bakery near me, florist near me.'
  },
    h('div', { className: 'ls-v8-halo', 'aria-hidden': true }),
    h('svg', { className: 'ls-v8-stream', 'aria-hidden': true, viewBox: '0 0 640 208', preserveAspectRatio: 'none' },
      h('defs', null,
        h('linearGradient', { id: 'ls8-stream', x1: '0', y1: '1', x2: '1', y2: '0' },
          h('stop', { stopColor: '#F2A93B', stopOpacity: '0' }),
          h('stop', { offset: '.48', stopColor: '#F2A93B', stopOpacity: '.32' }),
          h('stop', { offset: '1', stopColor: '#E94F82', stopOpacity: '0' })
        )
      ),
      h('g', { fill: 'none', stroke: 'url(#ls8-stream)' }, routes.map(d => h('path', { key: d, d }))),
      h('path', { className: 'ls-v8-trace', d: routes[0], fill: 'none', stroke: '#F2A93B', strokeWidth: '2', strokeLinecap: 'round', strokeDasharray: '12 950' })
    ),
    h('div', { className: 'ls-v8-content', 'aria-hidden': true },
      h('div', { className: 'ls-v8-eyebrow' }, h('i'), ' THE MOMENT OF DISCOVERY'),
      h('div', { className: 'ls-v8-headline' }, 'Be there when', h('br'), 'they ', h('em', null, 'search.')),
      h('div', { className: 'ls-v8-query' },
        h('svg', { viewBox: '0 0 24 24', width: '19', height: '19', fill: 'none', stroke: 'currentColor', strokeWidth: '1.7', strokeLinecap: 'round' },
          h('circle', { cx: '10', cy: '10', r: '6.4' }), h('path', { d: 'm15 15 5 5' })
        ),
        h('span', { className: 'ls-v8-changing' }, ['coffee shop', 'bakery', 'florist'].map(word => h('span', { key: word }, word))),
        h('span', { className: 'ls-v8-near' }, 'near me'), h('span', { className: 'ls-v8-cursor' })
      ),
      h('div', { className: 'ls-v8-caption' }, 'Local search · example queries')
    )
  );
}

// Keep the generator and its 20 language dictionaries completely unchanged.
// A React portal mounts only the new visual elements into the existing header.
export default class LocalSignalHeader extends React.Component {
  state = { host: null };
  observer = null;

  syncHost = () => {
    const root = document.getElementById('root');
    const host = root?.querySelector('.ls-visual-header') || null;
    const mount = this.mount;
    if (!mount) return;
    if (host && mount.parentNode !== host) host.appendChild(mount);
    if (!host && mount.parentNode) mount.remove();
  };

  componentDidMount() {
    const root = document.getElementById('root');
    if (!root) return;
    this.mount = document.createElement('div');
    this.mount.className = 'ls-v8-addon';
    this.observer = new MutationObserver(this.syncHost);
    this.observer.observe(root, { childList: true, subtree: true });
    this.syncHost();
    this.setState({ host: this.mount });
  }

  componentWillUnmount() {
    this.observer?.disconnect();
    this.observer = null;
    this.mount?.remove();
    this.mount = null;
  }

  render() {
    if (!this.state.host) return null;
    return createPortal([h(PurchaseLink, { key: 'purchase' }), h(DiscoveryScene, { key: 'discovery' })], this.state.host);
  }
}
