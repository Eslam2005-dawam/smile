const bestSellers = [
  { id:'morning-rose', name:'عطر ورد الصباح', description:'نفحات زهرية ناعمة تدوم', category:'perfume', image:'product-perfume.jpg', price:189, oldPrice:239, discount:'−٢٠٪', rating:'٤٫٩', note:'الأكثر طلباً' },
  { id:'soft-touch', name:'كريم لمسة ناعمة', description:'ترطيب يومي لبشرة مشرقة', category:'skincare', image:'product-skincare.jpg', price:129, oldPrice:159, discount:'−١٩٪', rating:'٤٫٨', note:'اختياركم المفضّل' },
  { id:'rose-bag', name:'حقيبة روز اليومية', description:'أناقة عملية لكل مشاويركِ', category:'bags', image:'product-handbag.jpg', price:259, oldPrice:345, discount:'−٢٥٪', rating:'٤٫٩', note:'عدد محدود' },
  { id:'berry-lip', name:'أحمر شفاه بلَش', description:'لون مخملي بلمسة خفيفة', category:'makeup', image:'product-lipstick.jpg', price:79, oldPrice:109, discount:'−٢٨٪', rating:'٤٫٧', note:'لون الموسم' },
];
const newArrivals = [
  { id:'golden-drops', name:'زيت لمعة الذهب', description:'زيت خفيف لتوهّج طبيعي', category:'natural', image:'product-face-oil.jpg', price:119, oldPrice:149, discount:'جديد', rating:'٤٫٨', note:'وصل حديثاً' },
  { id:'silk-hair', name:'سيروم شعر حريري', description:'عناية يومية بخلاصة نباتية', category:'hair', image:'product-haircare.jpg', price:99, oldPrice:125, discount:'جديد', rating:'٤٫٩', note:'وصل حديثاً' },
  { id:'soft-palette', name:'لوحة ألوان سُكّر', description:'درجات ناعمة لكل مناسبة', category:'makeup', image:'product-palette.jpg', price:145, oldPrice:175, discount:'جديد', rating:'٤٫٨', note:'كمية محدودة' },
  { id:'gold-charm', name:'سوار حكاية ذهب', description:'تفصيلة رقيقة تكمل إطلالتكِ', category:'accessories', image:'product-jewelry.jpg', price:139, oldPrice:169, discount:'جديد', rating:'٤٫٧', note:'وصل حديثاً' },
];
const formatNumber = new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 });
const toast = document.querySelector('#toast');
let toastTimer;
let cartQuantity = 0;
let activeFilter = 'all';
let activeSearch = '';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}
function productCard(product) {
  const badgeClass = product.discount === 'جديد' ? 'product-badge badge-new' : 'product-badge';
  return `<article class="product-card" data-product-card data-name="${product.name}" data-category="${product.category}">
    <div class="product-media"><img src="assets/${product.image}" alt="${product.name}" loading="lazy"><span class="${badgeClass}">${product.discount}</span>
      <button class="favorite-button" type="button" aria-label="أضيفي ${product.name} إلى المفضلة" aria-pressed="false" data-favorite="${product.id}"><svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg></button>
    </div><div class="product-info"><div class="product-rating" aria-label="التقييم ${product.rating} من ٥"><span class="star" aria-hidden="true">★</span><span>${product.rating}</span><span class="product-note">· ${product.note}</span></div>
      <h3 class="product-title">${product.name}</h3><p class="product-description">${product.description}</p>
      <div class="product-price-line"><span class="product-price">${formatNumber.format(product.price)} <small>ر.س</small></span><span class="product-old-price">${formatNumber.format(product.oldPrice)} ر.س</span></div>
      <div class="product-card-bottom"><span class="product-note">سعر تجريبي</span><button class="add-button" type="button" data-add="${product.id}" aria-label="أضيفي ${product.name} إلى السلة"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg> أضيفي للسلة</button></div>
    </div></article>`;
}
function renderProducts() {
  document.querySelector('#best-seller-grid').innerHTML = bestSellers.map(productCard).join('');
  document.querySelector('#new-arrivals-grid').innerHTML = newArrivals.map(productCard).join('');
  applyFilters();
}
function applyFilters() {
  const cards = [...document.querySelectorAll('[data-product-card]')];
  const needle = activeSearch.trim().toLocaleLowerCase('ar');
  const counts = new Map();
  cards.forEach((card) => {
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesSearch = !needle || card.dataset.name.toLocaleLowerCase('ar').includes(needle) || card.textContent.toLocaleLowerCase('ar').includes(needle);
    const visible = matchesCategory && matchesSearch;
    card.hidden = !visible;
    const grid = card.closest('.product-grid');
    counts.set(grid, (counts.get(grid) || 0) + Number(visible));
  });
  counts.forEach((count, grid) => {
    const message = document.querySelector(grid.id === 'best-seller-grid' ? '#best-results' : '#new-results');
    message.textContent = count === 0 && needle ? 'ما لقينا منتجات مطابقة، جرّبي كلمة أو قسماً آخر.' : '';
  });
}
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('[data-filter]').forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  applyFilters();
}
function setCartCount() {
  document.querySelector('#cart-count').textContent = formatNumber.format(cartQuantity);
  document.querySelector('#cart-button').setAttribute('aria-label', `سلة المشتريات، ${formatNumber.format(cartQuantity)} منتجات`);
}

renderProducts();
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  setFilter(button.dataset.filter);
  const hasBestSeller = bestSellers.some((product) => product.category === button.dataset.filter);
  document.querySelector(hasBestSeller || button.dataset.filter === 'all' ? '#best-sellers' : '#new-arrivals').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
document.querySelectorAll('[data-filter-link]').forEach((link) => link.addEventListener('click', () => setFilter(link.dataset.filterLink)));
document.querySelector('#search-form').addEventListener('submit', (event) => event.preventDefault());
document.querySelector('#store-search').addEventListener('input', (event) => { activeSearch = event.currentTarget.value; applyFilters(); });
document.addEventListener('click', (event) => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const selected = favorite.getAttribute('aria-pressed') !== 'true';
    favorite.setAttribute('aria-pressed', String(selected));
    showToast(selected ? 'أُضيف المنتج إلى مفضّلتكِ' : 'أُزيل المنتج من مفضّلتكِ');
    return;
  }
  if (event.target.closest('[data-add]')) {
    cartQuantity += 1;
    setCartCount();
    showToast('أُضيف المنتج إلى سلتكِ التجريبية — هذه معاينة للتصميم فقط.');
  }
});
document.querySelector('#cart-button').addEventListener('click', () => showToast(cartQuantity ? `في سلتكِ التجريبية ${formatNumber.format(cartQuantity)} منتجات — لا توجد عملية شراء فعلية.` : 'سلتكِ التجريبية فارغة — أضيفي منتجاً لمعاينة التصميم.'));
document.querySelector('#account-button').addEventListener('click', () => showToast('الحسابات غير مفعّلة في هذه المعاينة.'));
document.querySelector('#mobile-menu-toggle').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const menu = document.querySelector('#mobile-menu');
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'أغلقي القائمة' : 'افتحي القائمة');
  button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="${open ? '#i-close' : '#i-menu'}"/></svg>`;
  menu.hidden = !open;
});
document.querySelectorAll('#mobile-menu a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('#mobile-menu').hidden = true;
  document.querySelector('#mobile-menu-toggle').setAttribute('aria-expanded', 'false');
  document.querySelector('#mobile-menu-toggle').setAttribute('aria-label', 'افتحي القائمة');
  document.querySelector('#mobile-menu-toggle').innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg>';
}));
document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#newsletter-email');
  if (!email.reportValidity()) return;
  document.querySelector('#newsletter-feedback').textContent = 'شكراً لكِ! هذا نموذج تجريبي ولا يحفظ بياناتكِ.';
  email.value = '';
});
document.querySelector('#current-year').textContent = formatNumber.format(new Date().getFullYear());
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => backToTop.classList.toggle('is-visible', window.scrollY > 600), { passive: true });
