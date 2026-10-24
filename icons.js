/* Haven icon API — Material Symbols Rounded (see index.html font link). */

const MATERIAL_ICONS = {
  health: 'health_and_safety',
  term: 'shield_with_heart',
  motor: 'directions_car',
  bike: 'two_wheeler',
  home: 'home',
  renew: 'autorenew',
  policy: 'description',
  claim: 'assignment_turned_in',
  advisor: 'support_agent',
  compare: 'compare_arrows',
  award: 'emoji_events',
  shield: 'verified_user',
  zap: 'bolt',
  search: 'search',
  chat: 'chat_bubble',
  folder: 'folder_open',
  book: 'menu_book',
  doctor: 'article',
  user: 'person',
  family: 'family_restroom',
  senior: 'elderly',
  money: 'currency_rupee',
  lock: 'lock',
  sparkles: 'auto_awesome',
  bank: 'account_balance',
  card: 'credit_card',
  calendar: 'event',
  smartphone: 'smartphone',
  wallet: 'account_balance_wallet',
  repeat: 'sync',
  hospital: 'local_hospital',
  mapPin: 'location_on',
  file: 'article',
  port: 'swap_horiz',
  grievance: 'gavel',
  support: 'chat_bubble',
  wrench: 'car_repair',
  back: 'arrow_back',
  chevronRight: 'chevron_right',
  chevronDown: 'expand_more',
  forward: 'arrow_forward',
  phone: 'call',
  send: 'send',
  navHome: 'home',
  navExplore: 'explore',
  navPolicies: 'description',
  navClaims: 'assignment',
  navHelp: 'help',
  check: 'check',
  logout: 'logout',
  notifications: 'notifications',
  settings: 'settings',
  campaign: 'campaign',
  info: 'info',
  mail: 'mail',
};

const ICON_OUTLINE = new Set([
  'compare', 'search', 'chat', 'grievance', 'navHelp',
  'navHome', 'navExplore', 'navPolicies', 'navClaims',
  'back', 'chevronDown',
]);

const ICON_SIZE = Object.freeze({ sm: 16, md: 20, lg: 24, xl: 32, x2: 48 });
window.ICON_SIZE = ICON_SIZE;

const PRODUCT_GRADIENTS = {
  health: 'linear-gradient(145deg, #ff6b6b 0%, #e63946 55%, #c1121f 100%)',
  term: 'linear-gradient(145deg, #4a7fd4 0%, #1e5bb8 55%, #0d3d7a 100%)',
  motor: 'linear-gradient(145deg, #2dd4bf 0%, #0d9488 55%, #0f766e 100%)',
  bike: 'linear-gradient(145deg, #5eead4 0%, #14b8a6 55%, #0d9488 100%)',
  home: 'linear-gradient(145deg, #a78bfa 0%, #7c3aed 55%, #5b21b6 100%)',
};

function resolveIconSize(size) {
  if (size == null) return ICON_SIZE.lg;
  if (typeof size === 'number') return size;
  return ICON_SIZE[size] ?? ICON_SIZE.lg;
}

function icon(name, size = ICON_SIZE.lg, className = 'haven-icon') {
  const glyph = MATERIAL_ICONS[name];
  if (!glyph) {
    console.warn(`[Haven icons] Unknown icon name: ${name}`);
    return '';
  }
  const px = resolveIconSize(size);
  const tone = ICON_OUTLINE.has(name) ? 'haven-icon--outline' : 'haven-icon--filled';
  const extra = className.includes('haven-icon--outline') || className.includes('haven-icon--filled') ? '' : ` ${tone}`;
  return `<span class="${className}${extra}" style="font-size:${px}px" aria-hidden="true">${glyph}</span>`;
}

function iconProduct(name, color, size = ICON_SIZE.lg) {
  const bg = PRODUCT_GRADIENTS[name] || `linear-gradient(145deg, ${color} 0%, ${color}cc 100%)`;
  return `<span class="icon-product icon-product--${name}" style="background:${bg}">${icon(name, size, 'haven-icon haven-icon--product')}</span>`;
}

function iconBox(name, color, size = ICON_SIZE.lg, boxClass = 'icon-box') {
  const bg = `color-mix(in srgb, ${color} 10%, transparent)`;
  return `<span class="${boxClass}" style="background:${bg};color:${color}">${icon(name, size)}</span>`;
}

function iconBack(size = ICON_SIZE.lg) {
  return icon('back', size, 'haven-icon haven-icon--back');
}

function successBadge() {
  return `<div class="success-badge" aria-hidden="true">
    <div class="success-badge__ring"></div>
    <div class="success-badge__ring success-badge__ring--delay"></div>
    <div class="success-badge__circle">
      ${icon('check', ICON_SIZE.x2, 'haven-icon success-badge__glyph')}
    </div>
  </div>`;
}

function hydrateShellIcons() {
  const map = {
    callExpert: 'phone',
    aiFab: 'sparkles',
    aiSend: 'send',
  };
  Object.entries(map).forEach(([id, name]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const size = id === 'callExpert' ? ICON_SIZE.sm : id === 'aiSend' ? ICON_SIZE.md : ICON_SIZE.lg;
    el.insertAdjacentHTML('afterbegin', icon(name, size, 'haven-icon haven-icon--shell'));
  });

  const navMap = {
    home: 'navHome',
    explore: 'navExplore',
    policies: 'navPolicies',
    claims: 'navClaims',
    help: 'navHelp',
  };
  document.querySelectorAll('.bottom-nav__item').forEach((btn) => {
    const key = navMap[btn.dataset.view];
    if (!key) return;
    const slot = btn.querySelector('.bottom-nav__icon-slot');
    const target = slot || btn;
    const existing = target.querySelector('.haven-icon, svg');
    if (existing) existing.remove();
    const html = icon(key, ICON_SIZE.lg, 'haven-icon haven-icon--nav');
    if (slot) slot.innerHTML = html;
    else target.insertAdjacentHTML('afterbegin', html);
  });
}

document.addEventListener('DOMContentLoaded', hydrateShellIcons);
