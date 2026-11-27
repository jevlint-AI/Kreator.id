/* ============================================================
   KREATOR.ID: data & interaksi
   GANTI GAMBAR PRODUK: taruh file di assets/products/ dengan
   nama sesuai "image" di bawah (tanpa ekstensi). Format yang
   dicoba berurutan: webp, png, jpg, jpeg, avif. Bila file belum
   ada, otomatis tampil placeholder. Atau ubah nilai "image".
   ============================================================ */
const products = [
  { n: ["Stiker", "Sticker"],             category: "digital",     priceFrom: 12000,  image: "assets/products/stiker",       href: "/produk/stiker",       tags: "stiker sticker label vinyl" },
  { n: ["Brosur", "Brochure"],            category: "offset",      priceFrom: 15000, image: "assets/products/brosur",       href: "/produk/brosur",       tags: "brosur flyer leaflet brochure" },
  { n: ["Kaos", "T-Shirt"],               category: "merchandise", priceFrom: 77000,  image: "assets/products/kaos",         href: "/produk/kaos",         tags: "merchandise kaos tshirt t-shirt" },
  { n: ["Packaging", "Packaging"],        category: "offset",      priceFrom: 17000, image: "assets/products/packaging",    href: "/produk/packaging",    tags: "packaging kemasan box dus" },
  { n: ["Kalender", "Calendar"],          category: "offset",      priceFrom: 46000,  image: "assets/products/kalender",     href: "/produk/kalender",     tags: "kalender calendar meja dinding" },
  { n: ["Kartu Voucer", "Voucher Card"],  category: "digital",     priceFrom: 24000,  image: "assets/products/kartu-vocer",  href: "/produk/kartu-voucer", tags: "kartu voucer vocer voucher kupon" },
  { n: ["Nota", "Invoice Pad"],           category: "offset",      priceFrom: 89000,  image: "assets/products/nota",         href: "/produk/nota",         tags: "nota invoice kwitansi faktur" },
  { n: ["Mug & Tumbler", "Mug & Tumbler"], category: "merchandise", priceFrom: 27000, image: "assets/products/mug-thumbler", href: "/produk/mug-tumbler",  tags: "merchandise mug tumbler thumbler gelas" },
  { n: ["Topi", "Cap"],                   category: "merchandise", priceFrom: 42000,  image: "assets/products/topi",         href: "/produk/topi",         tags: "merchandise topi cap hat" },
  { n: ["Tote Bag", "Tote Bag"],          category: "merchandise", priceFrom: 37000,  image: "assets/products/totebag",      href: "/produk/totebag",      tags: "merchandise totebag tote bag tas" }
];

/* GANTI FOTO TESTIMONI: assets/avatars/<avatar>.webp (opsional, default inisial) */
const testimonials = [
  { name: "Budi Santoso",   role: ["Pebisnis UMKM", "SME Owner"],            avatar: "assets/avatars/budi", text: ["Cetaknya rapi, prosesnya cepat. Sangat membantu untuk kebutuhan usaha saya.", "Neat prints and a fast process. A big help for my business needs."] },
  { name: "Siti Nurhaliza", role: ["Pengusaha Online", "Online Entrepreneur"], avatar: "assets/avatars/siti", text: ["Harga bersaing dan kualitas memuaskan. Recommended!", "Competitive prices and great quality. Recommended!"] },
  { name: "Andi Pratama",   role: ["Freelance Designer", "Freelance Designer"], avatar: "assets/avatars/andi", text: ["Pelayanannya ramah dan pengiriman tepat waktu.", "Friendly service and on-time delivery."] },
  { name: "Rina Wulandari", role: ["Pemilik Kafe", "Cafe Owner"],             avatar: "assets/avatars/rina", text: ["Packaging pesanan kami jadi lebih profesional. Warnanya sesuai desain.", "Our order packaging looks far more professional. Colors match the design."] }
];

const $ = (s, r = document) => r.querySelector(s);
const rupiah = n => "Rp " + n.toLocaleString("id-ID");
const EXTS = ["webp", "png", "jpg", "jpeg", "avif"];
let lang = "id";
const T = (id, en) => lang === "en" ? en : id;
const nm = p => p.n[lang === "en" ? 1 : 0];

function imageWithFallback(base, alt, makeFallback) {
  const img = new Image();
  let i = 0;
  img.alt = alt; img.loading = "lazy"; img.decoding = "async";
  img.onerror = () => {
    i++;
    if (i < EXTS.length) img.src = `${base}.${EXTS[i]}`;
    else img.replaceWith(makeFallback());
  };
  img.src = `${base}.${EXTS[0]}`;
  return img;
}

/* ---------- produk ---------- */
const grid = $("#product-grid"), emptyMsg = $("#empty"), allBtn = $("#btn-all"), sub = $("#produk-sub");
const LIMIT = 5;
const state = { q: "", category: "all", showAll: false };

function placeholder(name) {
  const d = document.createElement("div");
  d.className = "ph";
  d.innerHTML = `<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="5"/><circle cx="18" cy="21" r="3.5"/><path d="m8 34 11-9 8 6 6-4 9 7"/></svg><span>${T("Foto produk", "Product photo")}<br>${name}</span>`;
  return d;
}

function renderProducts() {
  const q = state.q.trim().toLowerCase();
  const filtered = products.filter(p =>
    (state.category === "all" || p.category === state.category) &&
    (!q || `${nm(p)} ${p.tags}`.toLowerCase().includes(q)));
  const searching = q || state.category !== "all";
  const list = (searching || state.showAll) ? filtered : filtered.slice(0, LIMIT);

  grid.replaceChildren(...list.map((p, i) => {
    const el = document.createElement("article");
    el.className = "product-card glass";
    el.style.animationDelay = `${i * 70}ms`;
    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.append(imageWithFallback(p.image, nm(p), () => placeholder(nm(p))));
    const body = document.createElement("div");
    body.className = "p-body";
    body.innerHTML = `<div><h3 class="p-name"><a class="stretch" href="${orderLink(p)}" data-i="${products.indexOf(p)}">${nm(p)}</a></h3><p class="p-from">${T("Mulai dari", "From")}</p><p class="p-price">${rupiah(p.priceFrom)}</p></div>
      <span class="go" aria-hidden="true"><svg class="ic sm" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>`;
    el.append(thumb, body);
    return el;
  }));

  emptyMsg.hidden = list.length > 0;
  if (!list.length) {
    emptyMsg.innerHTML = `${T("Produk tidak ditemukan.", "No products found.")}<br>${T("Silahkan chat kami melalui", "Please chat with us via the")} <button type="button" class="link" id="empty-chat">${T("kontak di sidebar", "contact sidebar")}</button>`;
    const tab = document.getElementById("side-open"); tab.classList.remove("nudge"); void tab.offsetWidth; tab.classList.add("nudge");
  }
  sub.textContent = searching
    ? T(`${filtered.length} produk ditemukan${q ? ` untuk "${state.q.trim()}"` : ""}.`, `${filtered.length} products found${q ? ` for "${state.q.trim()}"` : ""}.`)
    : T("Pilihan paling populer untuk kebutuhan cetak Anda.", "Our most popular picks for your printing needs.");
  allBtn.firstChild.textContent = (searching || state.showAll) && filtered.length > LIMIT ? T("Tampilkan Ringkas", "Show Less") : T("Lihat Semua", "View All");
  allBtn.hidden = !searching && products.length <= LIMIT;
}

allBtn.addEventListener("click", () => {
  if (state.q || state.category !== "all") { state.q = ""; state.category = "all"; $("#search-input").value = ""; $("#search-category").value = "all"; state.showAll = true; }
  else state.showAll = !state.showAll;
  document.querySelectorAll(".cats button").forEach(b => b.classList.remove("on"));
  renderProducts();
});

/* ---------- pencarian & kategori cepat ---------- */
const searchForm = $("#product-search"), input = $("#search-input"), catSel = $("#search-category");
function runAnim() { if (holder.classList.contains("running")) return; holder.classList.add("running"); setTimeout(() => holder.classList.remove("running"), 950); }
function applySearch(scroll = true) {
  runAnim(); syncSel();
  state.q = input.value; state.category = catSel.value; state.showAll = false;
  renderProducts();
  if (scroll) $("#produk").scrollIntoView({ behavior: "smooth", block: "start" });
}
searchForm.addEventListener("submit", e => { e.preventDefault(); document.querySelectorAll(".cats button").forEach(b => b.classList.remove("on")); applySearch(); });
input.addEventListener("input", () => applySearch(false));
catSel.addEventListener("change", () => applySearch(false));
document.querySelectorAll(".cats button").forEach(btn => btn.addEventListener("click", () => {
  const was = btn.classList.contains("on");
  document.querySelectorAll(".cats button").forEach(b => b.classList.remove("on"));
  input.value = was ? "" : btn.dataset.q;
  if (!was) btn.classList.add("on");
  catSel.value = "all";
  applySearch();
}));

/* ---------- testimoni ---------- */
const track = $("#testi-track");
function renderTesti() { track.replaceChildren(...testimonials.map(t => {
  const el = document.createElement("article");
  el.className = "testi glass";
  const av = document.createElement("div");
  av.className = "avatar";
  const initials = () => { const s = document.createElement("span"); s.textContent = t.name.split(" ").map(w => w[0]).slice(0, 2).join(""); return s; };
  av.append(imageWithFallback(t.avatar, t.name, initials));
  const txt = document.createElement("div");
  txt.innerHTML = `<q></q><p class="who"><b></b><span></span></p>`;
  $("q", txt).textContent = t.text[lang === "en" ? 1 : 0]; $("b", txt).textContent = t.name; $("span", txt).textContent = t.role[lang === "en" ? 1 : 0];
  const stars = document.createElement("span");
  stars.className = "stars"; stars.setAttribute("aria-label", "Rating 5 dari 5"); stars.textContent = "★★★★★";
  el.append(av, txt, stars);
  return el;
})); }
const step = () => track.clientWidth * 0.8;
$("#t-prev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
$("#t-next").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

/* ---------- glow search holder (gerak acak, pelan) ---------- */
const holder = $(".search-holder"), glow = $(".search-glow");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function moveGlowRandomly() {
  if (!holder || !glow || reduced) return;
  const small = window.innerWidth < 768;
  const left = Math.random() * 58;
  const top = -42 + Math.random() * 50;
  glow.style.transitionDuration = `${2.8 + Math.random() * 2.8}s`;
  glow.style.left = `${left}%`;
  glow.style.top = `${top}%`;
  glow.style.opacity = small ? 0.4 : 0.5 + Math.random() * 0.2;
  setTimeout(moveGlowRandomly, 2200 + Math.random() * 2600);
}
moveGlowRandomly();



/* ---------- kontak (ubah di sini) ---------- */
const WA = "6289675099600", WA_SHOW = "0896 7509 9600", MAIL = "kreatorcorporation@gmail.com";
const MAP = "https://www.google.com/maps/search/?api=1&query=Kreator+Corporation";
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const IC = {
  wa: '<svg class="ic" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
  mail: '<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  pin: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>'
};
const contactHTML = () => `
  <a class="ct" href="${waLink(T("Halo Kreator.id, saya ingin bertanya tentang layanan cetak.", "Hello Kreator.id, I'd like to ask about your printing services."))}" target="_blank" rel="noopener">${IC.wa}<span><b>WhatsApp</b><small>${WA_SHOW}</small></span></a>
  <a class="ct" href="mailto:${MAIL}">${IC.mail}<span><b>Email</b><small>${MAIL}</small></span></a>
  <a class="ct" href="${MAP}" target="_blank" rel="noopener">${IC.pin}<span><b>${T("Lokasi", "Location")}</b><small>Kreator Corporation</small></span></a>`;

/* ---------- panel menu: Home - Layanan - Bantuan ---------- */
const pLayanan = $("#panel-layanan"), pBantuan = $("#panel-bantuan"), navHome = $("#nav-home");
let megaCat = "all";
const MEGA = [["all", "Semua Produk", "All Products"], ["offset", "Cetak Offset", "Offset Printing"], ["digital", "Cetak Digital", "Digital Printing"], ["merchandise", "Merchandise", "Merchandise"]];
function renderMega() {
  const list = products.filter(p => megaCat === "all" || p.category === megaCat), cur = MEGA.find(m => m[0] === megaCat);
  pLayanan.innerHTML = `<div class="mega"><ul class="mega-nav">${MEGA.map(m => `<li><button type="button" data-tab="${m[0]}" class="${m[0] === megaCat ? "on" : ""}">${T(m[1], m[2])}</button></li>`).join("")}
    <li><a href="${waLink(T("Halo Kreator.id, saya butuh jasa desain grafis.", "Hello Kreator.id, I need graphic design services."))}" target="_blank" rel="noopener">${T("Desain Grafis", "Graphic Design")}</a></li>
    <li><a href="${waLink(T("Halo Kreator.id, saya ingin custom order.", "Hello Kreator.id, I'd like to place a custom order."))}" target="_blank" rel="noopener">Custom Order</a></li></ul>
    <div class="mega-body"><div class="mega-head"><h3>${T(cur[1], cur[2])}</h3><button type="button" class="mega-all" data-cat="${megaCat}">${T("Lihat di halaman", "View on page")} →</button></div>
    <div class="mega-grid">${list.map(p => `<button type="button" class="mg" data-p="${products.indexOf(p)}"><span class="mg-img"></span><span>${nm(p)}</span></button>`).join("")}</div></div></div>`;
  pLayanan.querySelectorAll(".mg").forEach(b => {
    const p = products[b.dataset.p];
    b.firstElementChild.append(imageWithFallback(p.image, nm(p), () => { const i = document.createElement("i"); i.textContent = nm(p)[0]; return i; }));
  });
}
function renderPanels() {
  renderMega();
  pBantuan.innerHTML = `<div class="mega-help"><h3>${T("Bantuan", "Help")}</h3><div class="help-grid">${contactHTML()}</div></div>`;
  $("#side-body").innerHTML = contactHTML();
}
function closePanels() {
  [pLayanan, pBantuan].forEach(p => p.hidden = true);
  document.querySelectorAll("[data-panel]").forEach(b => { b.classList.remove("open"); b.setAttribute("aria-expanded", "false"); });
  navHome.classList.add("active");
}
document.querySelectorAll("[data-panel]").forEach(btn => btn.addEventListener("click", () => {
  const panel = btn.dataset.panel === "layanan" ? pLayanan : pBantuan, willOpen = panel.hidden;
  closePanels(); closeLang();
  if (willOpen) { panel.hidden = false; btn.classList.add("open"); btn.setAttribute("aria-expanded", "true"); navHome.classList.remove("active"); }
}));
navHome.addEventListener("click", () => { closePanels(); closeLang(); });
const setMega = c => { if (c && c !== megaCat) { megaCat = c; renderMega(); } };
pLayanan.addEventListener("mouseover", e => setMega(e.target.closest("[data-tab]")?.dataset.tab));
pLayanan.addEventListener("click", e => {
  const t = e.target.closest("[data-tab]"); if (t) return setMega(t.dataset.tab);
  const b = e.target.closest("[data-p],[data-cat]");
  if (b) {
    document.querySelectorAll(".cats button").forEach(x => x.classList.remove("on"));
    input.value = b.dataset.p !== undefined ? nm(products[b.dataset.p]) : "";
    catSel.value = b.dataset.cat || "all";
    applySearch(); closePanels();
  } else if (e.target.closest("a")) closePanels();
});
emptyMsg.addEventListener("click", e => { if (e.target.closest("#empty-chat")) toggleSide(true); });
pBantuan.addEventListener("click", e => { if (e.target.closest("a")) closePanels(); });

/* ---------- sidebar kontak ---------- */
const side = $("#side"), scrim = $("#side-scrim"), sideBtn = $("#side-open");
function toggleSide(open) {
  side.classList.toggle("open", open); scrim.hidden = !open; sideBtn.setAttribute("aria-expanded", open);
  if (open) { closePanels(); closeLang(); $("#side-close").focus(); } else if (document.activeElement && side.contains(document.activeElement)) sideBtn.focus();
}
sideBtn.addEventListener("click", () => toggleSide(true));
$("#side-close").addEventListener("click", () => toggleSide(false));
scrim.addEventListener("click", () => toggleSide(false));

/* ---------- bahasa otomatis (Indonesia / English) ---------- */
const DICT = [
  ["Beranda", "Home"],
  ["Cari produk atau layanan...", "Search products or services..."], ["Cari produk atau layanan", "Search products or services"],
  ["Kategori produk", "Product category"], ["Kategori cepat", "Quick categories"],
  ["Semua Produk", "All Products"], ["Cetak Digital", "Digital Printing"], ["Cetak Offset", "Offset Printing"],
  ["Teknologi", "Technology"], ["Brosur & Flyer", "Brochure & Flyer"], ["Nota", "Invoice Pad"], ["Kartu Voucer", "Voucher Card"],
  ["Produk Favorit", "Popular Products"], 
  ["Mengapa Memilih Kreator.id?", "Why Choose Kreator.id?"], ["Solusi Percetakan", "Practical & Trusted"], ["yang Praktis & Terpercaya", "Printing Solutions"],
  ["Dari desain hingga hasil cetak berkualitas, semua dalam satu platform.", "From design to quality prints, all in one platform."], ["Mulai Sekarang", "Get Started"],
  ["Proses Cepat", "Fast Process"], ["Pengerjaan tepat waktu", "On-time production"], ["Kualitas Premium", "Premium Quality"], ["Hasil tajam & warna akurat", "Sharp results & accurate colors"],
  ["Siap membantu kapan saja", "Ready to help anytime"], ["Pembayaran Aman", "Secure Payment"], ["Transaksi mudah dan aman", "Easy and secure transactions"],
  ["Apa Kata Mereka?", "What Do They Say?"], ["Kepercayaan pelanggan adalah prioritas kami.", "Customer trust is our priority."], ["Sebelumnya", "Previous"], ["Berikutnya", "Next"],
  ["Cetak Lebih Mudah,", "Printing Made Easier,"], ["Lebih Baik.", "Made Better."], ["Produk", "Products"], ["Layanan", "Services"], ["Tentang Kami", "About Us"], ["Bantuan", "Help"],
  ["Desain Grafis", "Graphic Design"], ["Profil Perusahaan", "Company Profile"], ["Karir", "Careers"], ["Cara Order", "How to Order"], ["Kontak", "Contact"],
  ["© 2026 Kreator.id. Semua hak dilindungi.", "© 2026 Kreator.id. All rights reserved."], ["Syarat & Ketentuan", "Terms & Conditions"], ["Kebijakan Privasi", "Privacy Policy"],
  ["Hubungi Kami", "Contact Us"], ["Kami siap membantu pesanan cetak Anda.", "We're ready to help with your printing orders."], ["Tutup", "Close"], ["Navigasi utama", "Main navigation"],
  ["Bergabung Menjadi", "Join as a"], ["Franchise Percetakan", "Printing Franchise of"],
  ["Kembangkan bisnis percetakan Anda bersama Kreator.id. Dapatkan dukungan penuh, sistem modern, dan peluang bisnis yang terus berkembang.", "Grow your printing business with Kreator.id. Get full support, a modern system, and an ever-growing business opportunity."],
  ["Gabung Sekarang", "Join Now"], ["Peluang Bisnis Menjanjikan", "Promising Business Opportunity"], ["Pasar terus tumbuh", "A growing market"],
  ["Sistem & Teknologi Lengkap", "Complete System & Technology"], ["Kelola bisnis lebih mudah", "Run your business more easily"],
  ["Dukungan Penuh", "Full Support"], ["Dari tim profesional", "From a professional team"], ["Brand Terpercaya", "Trusted Brand"], ["Bersama nama besar", "Backed by a big name"],
  ["Metode Pembayaran", "Payment Methods"], ["Dipercaya oleh Pelanggan Kami", "Trusted by Our Customers"]
];
const EN = new Map(DICT);
const SKIP = "#panel-layanan,#panel-bantuan,#side-body,#product-grid,#testi-track,#btn-all,#produk-sub,.lang,script";
function translateDOM() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const el = n.parentElement;
    if (!el || el.closest(SKIP)) continue;
    n.__id ??= n.nodeValue;
    const k = n.__id.trim();
    if (k) n.nodeValue = lang === "en" && EN.has(k) ? n.__id.replace(k, EN.get(k)) : n.__id;
  }
  document.querySelectorAll("[placeholder],[aria-label]").forEach(el => {
    if (el.closest(SKIP)) return;
    for (const a of ["placeholder", "aria-label"]) {
      if (!el.hasAttribute(a)) continue;
      el["_" + a] ??= el.getAttribute(a);
      el.setAttribute(a, lang === "en" && EN.has(el["_" + a]) ? EN.get(el["_" + a]) : el["_" + a]);
    }
  });
}
const langBtn = $("#lang-btn"), langMenu = $("#lang-menu");
function closeLang() { langMenu.hidden = true; langBtn.setAttribute("aria-expanded", "false"); }
langBtn.addEventListener("click", () => { const open = langMenu.hidden; closePanels(); langMenu.hidden = !open; langBtn.setAttribute("aria-expanded", open); });
langMenu.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b) { setLang(b.dataset.lang); closeLang(); } });
function setLang(l) {
  lang = l;
  try { localStorage.setItem("kreator-lang", l); } catch (e) {}
  document.documentElement.lang = l;
  $("#lang-label").textContent = l === "en" ? "English" : "Indonesia";
  langMenu.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.lang === l));
  document.title = T("Kreator.id | Cetak Lebih Mudah, Lebih Baik", "Kreator.id | Printing Made Easier, Made Better");
  translateDOM(); syncSel(); renderProducts(); renderTesti(); renderPanels();
  $("#franchise-cta").href = waLink(T("Halo Kreator.id, saya tertarik bergabung menjadi franchise percetakan Kreator.", "Hello Kreator.id, I'm interested in joining the Kreator printing franchise."));
}
document.addEventListener("click", e => { if (!e.target.closest(".site-header,.mega-anchor")) { closePanels(); closeLang(); } });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closePanels(); closeLang(); toggleSide(false); closeOrder(); } });
/* ---------- pop up order via WhatsApp ---------- */
const orderLink = p => waLink(T(`Halo Kreator.id, saya ingin order ${nm(p)}.`, `Hello Kreator.id, I'd like to order ${nm(p)}.`));
const modal = $("#order-modal");
function openOrder(p) {
  $("#om-thumb").replaceChildren(imageWithFallback(p.image, nm(p), () => placeholder(nm(p))));
  $("#om-title").textContent = nm(p);
  $("#om-price").textContent = `${T("Mulai dari", "From")} ${rupiah(p.priceFrom)}`;
  $("#om-note").textContent = T("Pesan produk ini langsung lewat WhatsApp. Tim kami siap membantu ukuran, bahan, dan jumlah.", "Order this product directly via WhatsApp. Our team will help with size, material, and quantity.");
  $("#om-wa").href = orderLink(p);
  $("#om-close").setAttribute("aria-label", T("Tutup", "Close"));
  modal.hidden = false; document.body.style.overflow = "hidden"; $("#om-close").focus();
}
function closeOrder() { if (modal.hidden) return; modal.hidden = true; document.body.style.overflow = ""; }
grid.addEventListener("click", e => { const a = e.target.closest("a.stretch"); if (!a) return; e.preventDefault(); openOrder(products[a.dataset.i]); });
$("#om-close").addEventListener("click", closeOrder);
modal.addEventListener("click", e => { if (e.target === modal) closeOrder(); });
$("#om-wa").addEventListener("click", () => setTimeout(closeOrder, 150));
let saved = null; try { saved = localStorage.getItem("kreator-lang"); } catch (e) {}
setLang(saved || ((navigator.language || "id").toLowerCase().startsWith("id") ? "id" : "en"));

/* ---------- skeleton loading (min. 1,8 dtk) + animasi scroll ---------- */
(() => {
  const root = document.documentElement, skel = $("#skeleton"), bar = $("#progress");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = [];
  const add = (sel, o = {}) => document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal"); if (o.down) el.classList.add("rv-down");
    el.style.setProperty("--d", `${(o.stagger ? i * 90 : 0) + (o.delay || 0)}ms`);
    targets.push(el);
  });
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add("in");
    el.addEventListener("animationend", ev => {
      if (ev.target !== el) return;
      el.classList.remove("reveal", "in", "rv-down"); el.style.removeProperty("--d");
    });
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  const reveal = () => targets.forEach(el => io ? io.observe(el) : el.classList.remove("reveal"));
  const hide = () => {
    skel.classList.add("done"); root.classList.remove("loading");
    setTimeout(() => skel.remove(), 800);
    reveal();
  };
  try {
    if (!reduced) {
      add(".site-header", { down: true }); add(".tagline", { delay: 80 }); add(".search-holder", { delay: 160 }); add(".cats", { delay: 240 });
      add(".section-head"); add("#product-grid"); add(".why"); add(".fr-text"); add(".fr-list li", { stagger: true, delay: 100 }); add(".fr-img", { delay: 200 });
      add("#testi-track"); add(".clients-panel"); add(".client-logos img", { stagger: true, delay: 100 }); add(".footer-glass");
    }
    const minWait = reduced ? 0 : Math.max(0, 1800 - performance.now());
    const loaded = new Promise(r => document.readyState === "complete" ? r() : addEventListener("load", r, { once: true }));
    Promise.all([new Promise(r => setTimeout(r, minWait)), Promise.race([loaded, new Promise(r => setTimeout(r, 4000))])]).then(hide);
  } catch (err) {
    targets.forEach(el => el.classList.remove("reveal")); skel.remove(); root.classList.remove("loading");
  }
  let tick = false;
  const upd = () => { const h = root.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; tick = false; };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
})();

/* ---------- label kategori (mobile) + autoplay testimoni ---------- */
function syncSel() { const l = $("#sf-label"); if (l) l.textContent = catSel.selectedOptions[0]?.textContent || ""; }
catSel.addEventListener("change", syncSel);
syncSel();
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let hover = false, visible = false, hold = 0;
  const bump = () => { hold = Date.now() + 7000; };
  const tick = () => {
    if (hover || !visible || document.hidden || Date.now() < hold) return;
    const first = track.firstElementChild; if (!first) return;
    const stepW = first.getBoundingClientRect().width + 16;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + stepW, behavior: "smooth" });
  };
  setInterval(tick, 4200);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.3 }).observe(track);
  track.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") hover = true; });
  track.addEventListener("pointerleave", () => { hover = false; });
  ["pointerdown", "touchstart", "wheel", "keydown"].forEach(ev => track.addEventListener(ev, bump, { passive: true }));
  $("#t-prev").addEventListener("click", bump); $("#t-next").addEventListener("click", bump);
})();

/* ---------- dropdown kategori search (custom, modern) ---------- */
const sfBtn = $("#sf-btn"), sfMenu = $("#sf-menu");
function renderSfMenu() {
  sfMenu.innerHTML = [...catSel.options].map(o => `<button type="button" role="option" data-v="${o.value}" class="${o.value === catSel.value ? "on" : ""}" aria-selected="${o.value === catSel.value}">${o.textContent}</button>`).join("");
}
function closeSf() { sfMenu.hidden = true; sfBtn.setAttribute("aria-expanded", "false"); }
sfBtn.addEventListener("click", () => {
  const open = sfMenu.hidden; closePanels(); closeLang();
  if (open) renderSfMenu();
  sfMenu.hidden = !open; sfBtn.setAttribute("aria-expanded", open);
});
sfMenu.addEventListener("click", e => {
  const b = e.target.closest("[data-v]"); if (!b) return;
  catSel.value = b.dataset.v; syncSel(); closeSf();
  catSel.dispatchEvent(new Event("change", { bubbles: true }));
});
document.addEventListener("click", e => { if (!e.target.closest(".search-filter")) closeSf(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSf(); });
