/**
 * Maheswari Plywood & Hardware - Billing & Inventory Management Engine
 * Version 2.0 (Production Desktop Edition)
 */

const STORAGE_KEY = 'hardwareShopBillingData';
const BACKUP_KEY = 'hardwareShopBillingBackups';
const LAST_EXPORT_KEY = 'hardwareShopLastExport';
const MAX_SNAPSHOTS = 15;

// Default Shop Configuration
const DEFAULT_SHOP_INFO = {
  name: 'Maheswari Plywood & Hardware',
  tag: 'Complete Billing & Inventory System',
  phone: '+91 98765 43210',
  email: 'contact@maheswariph.com',
  address1: 'Main Road, Hardware Market',
  address2: 'Near Bus Stand, Industrial Area',
  city: 'Tiruppur',
  state: 'Tamil Nadu',
  stateCode: '33',
  gstin: '33AABCM1234F1Z9',
  pan: 'AABCM1234F',
  bankName: 'State Bank of India',
  bankAccount: '123456789012',
  bankIfsc: 'SBIN0001234',
  upiId: 'maheswari@upi',
  invoicePrefix: 'MPH-',
  nextInvoiceNo: 1001,
  defaultTaxRate: 18,
  defaultTerms: '1. Goods once sold will not be taken back without original bill.\n2. Interest @18% p.a. will be charged if bill is unpaid after 15 days.\n3. Subject to local jurisdiction only.',
  printPaperSize: 'A4', // 'A4', 'A5'
  adminPin: ''
};

// Initial Sample Catalog
const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Gurjan Commercial Plywood 18mm (8x4)', sku: 'PLY-GUR-18', barcode: '8901001', category: 'Plywood', hsn: '4412', purchasePrice: 2100, sellingPrice: 2650, stock: 45, unit: 'sheet', taxRate: 18, minStock: 10, supplier: 'National Ply Distributors' },
  { id: 'p2', name: 'Waterproof Marine Ply 12mm (8x4)', sku: 'PLY-MAR-12', barcode: '8901002', category: 'Plywood', hsn: '4412', purchasePrice: 1650, sellingPrice: 2100, stock: 30, unit: 'sheet', taxRate: 18, minStock: 10, supplier: 'National Ply Distributors' },
  { id: 'p3', name: 'Teak Finish Plywood 6mm (8x4)', sku: 'PLY-TEAK-06', barcode: '8901003', category: 'Plywood', hsn: '4412', purchasePrice: 850, sellingPrice: 1150, stock: 25, unit: 'sheet', taxRate: 18, minStock: 8, supplier: 'National Ply Distributors' },
  { id: 'p4', name: 'PVC Pipe 1 inch 6kg', sku: 'PVC-PIP-001', barcode: '8902001', category: 'Plumbing & PVC', hsn: '3917', purchasePrice: 110, sellingPrice: 150, stock: 80, unit: 'm', taxRate: 18, minStock: 20, supplier: 'Supreme Plastics' },
  { id: 'p5', name: 'PVC Elbow 1 inch', sku: 'PVC-ELB-001', barcode: '8902002', category: 'Plumbing & PVC', hsn: '3917', purchasePrice: 18, sellingPrice: 30, stock: 150, unit: 'pcs', taxRate: 18, minStock: 30, supplier: 'Supreme Plastics' },
  { id: 'p6', name: 'Ultratech Cement (OPC 53 Grade)', sku: 'CEM-ULT-53', barcode: '8903001', category: 'Cement', hsn: '2523', purchasePrice: 380, sellingPrice: 440, stock: 65, unit: 'box', taxRate: 28, minStock: 25, supplier: 'Regional Cement Agency' },
  { id: 'p7', name: 'Claw Hammer 16oz Steel Grip', sku: 'TLS-HAM-16', barcode: '8904001', category: 'Hand Tools', hsn: '8205', purchasePrice: 240, sellingPrice: 350, stock: 28, unit: 'pcs', taxRate: 18, minStock: 5, supplier: 'Stanley Tools Hub' },
  { id: 'p8', name: 'Phillips Screwdriver Set 6pc', sku: 'TLS-SCR-006', barcode: '8904002', category: 'Hand Tools', hsn: '8205', purchasePrice: 180, sellingPrice: 275, stock: 22, unit: 'set', taxRate: 18, minStock: 5, supplier: 'Stanley Tools Hub' },
  { id: 'p9', name: 'Steel Wire Nails 2 inch', sku: 'FAS-NAL-002', barcode: '8905001', category: 'Fasteners', hsn: '7317', purchasePrice: 52, sellingPrice: 75, stock: 140, unit: 'kg', taxRate: 18, minStock: 30, supplier: 'Apex Fasteners' },
  { id: 'p10', name: 'Asian Paints Tractor Emulsion 4L', sku: 'PNT-TRC-04L', barcode: '8906001', category: 'Paints & Putty', hsn: '3209', purchasePrice: 580, sellingPrice: 720, stock: 18, unit: 'ltr', taxRate: 18, minStock: 6, supplier: 'Asian Paints Depot' },
  { id: 'p11', name: 'Birla White Wall Putty 20kg', sku: 'PNT-PUT-20K', barcode: '8906002', category: 'Paints & Putty', hsn: '3214', purchasePrice: 640, sellingPrice: 780, stock: 16, unit: 'box', taxRate: 18, minStock: 5, supplier: 'Birla White Dist' },
  { id: 'p12', name: 'SS Door Hinges 4x3 Heavy', sku: 'HRD-HNG-403', barcode: '8907001', category: 'Hardware', hsn: '8302', purchasePrice: 65, sellingPrice: 110, stock: 60, unit: 'pcs', taxRate: 18, minStock: 15, supplier: 'Kich Hardware' },
  { id: 'p13', name: 'Mortise Door Handle & Lock Set', sku: 'HRD-LCK-001', barcode: '8907002', category: 'Hardware', hsn: '8301', purchasePrice: 750, sellingPrice: 1150, stock: 14, unit: 'set', taxRate: 18, minStock: 4, supplier: 'Godrej Lock Agency' }
];

// App State
let DATA = {
  version: 2,
  products: [],
  invoices: [],
  customers: [],
  suppliers: [],
  purchases: [],
  expenses: [],
  heldBills: [],
  stockMovements: [],
  shopInfo: { ...DEFAULT_SHOP_INFO },
  nextInvoiceNo: 1001
};

let cart = [];
let currentTab = 'dashboard';
let editingProductId = null;
let editingCustomerId = null;
let editingSupplierId = null;
let currentViewingInvoice = null;

/* ---------------- Data Layer & Safe Migration ---------------- */
async function loadData() {
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch(e) {}
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      DATA = migrateData(parsed);
      return;
    } catch (e) {
      console.error("Data parse error, trying automatic recovery", e);
      const snaps = readSnapshots();
      for (let i = snaps.length - 1; i >= 0; i--) {
        try {
          DATA = migrateData(JSON.parse(snaps[i].data));
          await saveData();
          setTimeout(() => showToast('Data was recovered from automatic backup'), 800);
          return;
        } catch (_) {}
      }
    }
  }
  // Fresh install
  DATA.products = [...INITIAL_PRODUCTS];
  DATA.shopInfo = { ...DEFAULT_SHOP_INFO };
  await saveData();
}

function migrateData(rawObj) {
  const d = { ...DATA, ...rawObj };
  d.version = 2;
  if (!Array.isArray(d.products)) d.products = [...INITIAL_PRODUCTS];
  if (!Array.isArray(d.invoices)) d.invoices = [];
  if (!Array.isArray(d.customers)) d.customers = [];
  if (!Array.isArray(d.suppliers)) d.suppliers = [];
  if (!Array.isArray(d.purchases)) d.purchases = [];
  if (!Array.isArray(d.expenses)) d.expenses = [];
  if (!Array.isArray(d.heldBills)) d.heldBills = [];
  if (!Array.isArray(d.stockMovements)) d.stockMovements = [];
  if (!d.shopInfo) d.shopInfo = { ...DEFAULT_SHOP_INFO };
  else d.shopInfo = { ...DEFAULT_SHOP_INFO, ...d.shopInfo };

  // Upgrade legacy products
  d.products = d.products.map((p, idx) => ({
    id: p.id || 'p' + (idx + 1),
    name: p.name || 'Unnamed Product',
    sku: p.sku || 'SKU-' + (idx + 1),
    barcode: p.barcode || '',
    category: p.category || 'General',
    hsn: p.hsn || '8205',
    purchasePrice: p.purchasePrice !== undefined ? Number(p.purchasePrice) : Math.round(Number(p.price || 100) * 0.75),
    sellingPrice: Number(p.sellingPrice || p.price || 0),
    stock: Number(p.stock || 0),
    unit: p.unit || 'pcs',
    taxRate: p.taxRate !== undefined ? Number(p.taxRate) : 18,
    minStock: p.minStock !== undefined ? Number(p.minStock) : 5,
    supplier: p.supplier || ''
  }));

  // Upgrade legacy invoices
  d.invoices = d.invoices.map(inv => {
    const isInterState = inv.customerState && inv.customerState !== d.shopInfo.state;
    const items = (inv.items || []).map(it => {
      const prod = d.products.find(p => p.id === it.productId);
      const rate = Number(it.price || 0);
      const qty = Number(it.qty || 1);
      const taxRate = it.taxRate !== undefined ? Number(it.taxRate) : (prod ? prod.taxRate : 18);
      const taxable = rate * qty;
      const taxAmt = taxable * (taxRate / 100);
      return {
        productId: it.productId || '',
        name: it.name || '',
        sku: it.sku || (prod ? prod.sku : ''),
        hsn: it.hsn || (prod ? prod.hsn : '8205'),
        price: rate,
        costPrice: prod ? prod.purchasePrice : Math.round(rate * 0.75),
        qty: qty,
        unit: it.unit || 'pcs',
        taxRate: taxRate,
        taxableValue: taxable,
        cgstAmt: isInterState ? 0 : taxAmt / 2,
        sgstAmt: isInterState ? 0 : taxAmt / 2,
        igstAmt: isInterState ? taxAmt : 0,
        total: taxable + taxAmt
      };
    });

    const subtotal = inv.subtotal !== undefined ? Number(inv.subtotal) : items.reduce((s, i) => s + (i.price * i.qty), 0);
    const total = Number(inv.total || subtotal);
    const paid = inv.paidAmount !== undefined ? Number(inv.paidAmount) : total;
    return {
      id: inv.id || 'inv' + Date.now(),
      number: inv.number || 'MPH-1000',
      date: inv.date || new Date().toISOString(),
      customerName: inv.customerName || 'Walk-in Customer',
      customerPhone: inv.customerPhone || '',
      customerGst: inv.customerGst || '',
      customerAddress: inv.customerAddress || '',
      customerState: inv.customerState || d.shopInfo.state,
      stateCode: inv.stateCode || d.shopInfo.stateCode,
      items: items,
      subtotal: subtotal,
      itemDiscountsTotal: Number(inv.itemDiscountsTotal || 0),
      billDiscountPct: Number(inv.discountPct || 0),
      billDiscountAmt: Number(inv.discountAmt || 0),
      totalTaxable: inv.totalTaxable || (subtotal - Number(inv.discountAmt || 0)),
      taxAmt: Number(inv.taxAmt || 0),
      cgstTotal: isInterState ? 0 : Number(inv.taxAmt || 0) / 2,
      sgstTotal: isInterState ? 0 : Number(inv.taxAmt || 0) / 2,
      igstTotal: isInterState ? Number(inv.taxAmt || 0) : 0,
      roundOff: Number(inv.roundOff || 0),
      total: total,
      paymentMethod: inv.paymentMethod || 'Cash',
      paidAmount: paid,
      balanceDue: Math.max(0, total - paid),
      status: inv.status || (paid >= total ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'CREDIT')),
      notes: inv.notes || '',
      returns: inv.returns || []
    };
  });

  return d;
}

async function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  } catch (e) {
    showToast('Storage error ₹” storage quota might be full!');
  }
}

/* ---------------- Snapshot Auto-Backups ---------------- */
function readSnapshots() {
  try { return JSON.parse(localStorage.getItem(BACKUP_KEY)) || []; } catch(e) { return []; }
}
function writeSnapshots(list) {
  while (true) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(list));
      return true;
    } catch(e) {
      if (list.length <= 1) return false;
      list.shift();
    }
  }
}
function createSnapshot(label, kind) {
  try {
    let list = readSnapshots();
    list.push({
      id: 's' + Date.now(),
      ts: new Date().toISOString(),
      kind: kind || 'manual',
      label: label,
      invoices: DATA.invoices.length,
      products: DATA.products.length,
      data: JSON.stringify(DATA)
    });
    while (list.length > MAX_SNAPSHOTS) list.shift();
    writeSnapshots(list);
  } catch(e) {}
}

/* ---------------- Toast & Alerts ---------------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span>${escapeHtml(msg)}</span>`;
  t.classList.add('show');
  clearTimeout(showToast._tm);
  showToast._tm = setTimeout(() => t.classList.remove('show'), 2600);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

/* ---------------- Indian Rupees in Words ---------------- */
function numberToIndianWords(num) {
  num = Math.round(Number(num) || 0);
  if (num === 0) return 'Rupees Zero Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    return '';
  }

  let str = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const rem = num;

  if (crore > 0) str += inWords(crore) + ' Crore ';
  if (lakh > 0) str += inWords(lakh) + ' Lakh ';
  if (thousand > 0) str += inWords(thousand) + ' Thousand ';
  if (rem > 0) str += inWords(rem) + ' ';

  return 'Rupees ' + str.trim() + ' Only';
}

/* ---------------- Navigation Tabs ---------------- */
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      const tab = el.dataset.tab;
      if (!tab) return;
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-page').forEach(p => {
    p.style.display = (p.id === 'page-' + tab) ? 'block' : 'none';
  });

  if (tab === 'dashboard') renderDashboard();
  if (tab === 'billing') { renderProductCatalog(); renderCart(); renderHeldBillsDropdown(); }
  if (tab === 'inventory') renderInventoryModule();
  if (tab === 'purchases') renderPurchasesModule();
  if (tab === 'customers') renderCustomersModule();
  if (tab === 'expenses') renderExpensesModule();
  if (tab === 'history') renderHistoryModule();
  if (tab === 'reports') renderReportsModule();
  if (tab === 'settings') renderSettingsModule();
}

/* ---------------- 1. Dashboard ---------------- */
function renderDashboard() {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayInvoices = DATA.invoices.filter(i => new Date(i.date) >= startToday);
  const todaySales = todayInvoices.reduce((s, i) => s + (i.total || 0), 0);

  const lowStockItems = DATA.products.filter(p => p.stock <= p.minStock);
  const outOfStockItems = DATA.products.filter(p => p.stock <= 0);

  const totalDues = DATA.customers.reduce((s, c) => s + (c.creditBalance || 0), 0) +
    DATA.invoices.reduce((s, i) => s + (i.balanceDue || 0), 0);

  const totalStockValue = DATA.products.reduce((s, p) => s + (p.stock * p.purchasePrice), 0);
  const totalRetailValue = DATA.products.reduce((s, p) => s + (p.stock * p.sellingPrice), 0);

  document.getElementById('dashTodaySales').textContent = '₹' + todaySales.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  document.getElementById('dashTodayCount').textContent = `${todayInvoices.length} invoices generated today`;
  document.getElementById('dashTotalInvoices').textContent = DATA.invoices.length;
  document.getElementById('dashLowStockCount').textContent = lowStockItems.length;
  document.getElementById('dashLowStockSub').textContent = `${outOfStockItems.length} items completely out of stock`;
  document.getElementById('dashCustomerDues').textContent = '₹' + totalDues.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  // Render Low Stock Alert Table
  const alertBox = document.getElementById('dashLowStockList');
  if (alertBox) {
    if (lowStockItems.length === 0) {
      alertBox.innerHTML = '<div style="padding:16px; color:var(--green); font-weight:500;">'₹' All inventory items are above their minimum threshold.</div>';
    } else {
      alertBox.innerHTML = lowStockItems.slice(0, 6).map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dotted var(--border);">
          <div>
            <div style="font-weight:600; font-size:13.5px;">${escapeHtml(p.name)}</div>
            <div style="font-size:11px; color:var(--ink-muted); font-family:var(--font-mono);">${p.sku}'₹'Min: ${p.minStock} ${p.unit}</div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="badge ${p.stock <= 0 ? 'badge-red' : 'badge-amber'}">${p.stock} ${p.unit}</span>
            <button class="btn btn-sm btn-primary" onclick="quickStockAdd('${p.id}')">+ Restock</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Recent Invoices
  const recentBox = document.getElementById('dashRecentInvoices');
  if (recentBox) {
    const recent = [...DATA.invoices].reverse().slice(0, 5);
    if (recent.length === 0) {
      recentBox.innerHTML = '<div style="padding:16px; color:var(--ink-muted);">No invoices generated yet. Create a bill to get started.</div>';
    } else {
      recentBox.innerHTML = recent.map(inv => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dotted var(--border);">
          <div>
            <div style="font-weight:600; font-size:13px; color:var(--primary); cursor:pointer;" onclick="viewInvoiceById('${inv.id}')">${inv.number}</div>
            <div style="font-size:11px; color:var(--ink-muted);">${escapeHtml(inv.customerName)}'₹'${new Date(inv.date).toLocaleDateString('en-IN')}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-weight:700;">₹${inv.total.toFixed(2)}</div>
            <span class="badge ${inv.status === 'PAID' ? 'badge-green' : 'badge-amber'}" style="font-size:10px;">${inv.status}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Dashboard 7-Day Revenue Trend Chart
  renderDashboardRevenueChart();
}

function renderDashboardRevenueChart() {
  const chartBox = document.getElementById('dashRevenueChart');
  if (!chartBox) return;

  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const nextD = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    const dayTotal = DATA.invoices
      .filter(inv => { const t = new Date(inv.date); return t >= d && t < nextD; })
      .reduce((s, inv) => s + (inv.total || 0), 0);
    days.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short' }), total: dayTotal });
  }

  const max = Math.max(...days.map(d => d.total), 100);
  chartBox.innerHTML = `
    <div style="display:flex; align-items:flex-end; gap:12px; height:180px; padding-top:20px;">
      ${days.map(d => {
        const pct = Math.max((d.total / max) * 100, d.total > 0 ? 5 : 2);
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
            <div style="font-family:var(--font-mono); font-size:10px; color:var(--ink-muted); margin-bottom:4px;">${d.total > 0 ? '₹' + Math.round(d.total) : ''}</div>
            <div style="width:100%; max-width:44px; height:${pct}%; background:${d.total > 0 ? 'var(--primary)' : 'var(--border)'}; border-radius:4px 4px 0 0; transition:height 0.2s;"></div>
            <div style="font-size:11px; font-weight:600; color:var(--ink-muted); margin-top:8px;">${d.label}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ---------------- 2. Advanced POS Billing ---------------- */
function getActiveInvoiceNumber() {
  const prefix = DATA.shopInfo.invoicePrefix || 'MPH-';
  return prefix + String(DATA.nextInvoiceNo).padStart(4, '0');
}

function renderProductCatalog() {
  const grid = document.getElementById('productCatalogGrid');
  if (!grid) return;

  const q = (document.getElementById('posSearchInput')?.value || '').toLowerCase().trim();
  const cat = document.querySelector('.category-chips .chip.active')?.dataset.category || 'all';

  const items = DATA.products.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q));
    const matchCat = (cat === 'all') || (p.category === cat);
    return matchQ && matchCat;
  });

  if (items.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--ink-muted);">No products match your search or filter.</div>';
    return;
  }

  grid.innerHTML = items.map(p => {
    const isOut = p.stock <= 0;
    const isLow = !isOut && p.stock <= p.minStock;
    return `
      <div class="product-card ${isOut ? 'out-of-stock' : ''}" onclick="addToCart('${p.id}')">
        <div class="cat-tag">${escapeHtml(p.category)}</div>
        <div class="p-title">${escapeHtml(p.name)}</div>
        <div class="p-sku">${p.sku}'₹'GST ${p.taxRate}%</div>
        <div class="p-price">₹${p.sellingPrice.toFixed(2)}</div>
        <div class="p-stock ${isLow ? 'low' : ''}">
          ${isOut ? '₹ Out of Stock' : (isLow ? `₹ Low: ${p.stock} ${p.unit}` : `₹ ${p.stock} ${p.unit}`)}
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(productId) {
  const p = DATA.products.find(x => x.id === productId);
  if (!p) return;
  const inCart = cart.find(c => c.productId === productId);
  const currentQty = inCart ? inCart.qty : 0;

  if (currentQty + 1 > p.stock) {
    showToast(`Insufficient stock! Only ${p.stock} ${p.unit} available for ${p.name}`);
    return;
  }

  if (inCart) {
    inCart.qty += 1;
  } else {
    cart.push({
      productId: p.id,
      name: p.name,
      sku: p.sku,
      hsn: p.hsn,
      price: p.sellingPrice,
      costPrice: p.purchasePrice,
      qty: 1,
      unit: p.unit,
      taxRate: p.taxRate,
      discountPct: 0
    });
  }
  renderCart();
}

function updateCartItemQty(productId, val) {
  const item = cart.find(c => c.productId === productId);
  if (!item) return;
  const p = DATA.products.find(x => x.id === productId);
  const newQty = Math.max(0, Number(val) || 0);

  if (newQty === 0) {
    removeFromCart(productId);
    return;
  }
  if (p && newQty > p.stock) {
    showToast(`Only ${p.stock} ${p.unit} available in stock!`);
    item.qty = p.stock;
  } else {
    item.qty = newQty;
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.productId !== productId);
  renderCart();
}

function clearCart() {
  if (cart.length > 0 && !confirm('Clear current ticket?')) return;
  cart = [];
  document.getElementById('posCustName').value = '';
  document.getElementById('posCustPhone').value = '';
  document.getElementById('posCustGst').value = '';
  document.getElementById('posCustState').value = DATA.shopInfo.state || 'Tamil Nadu';
  document.getElementById('posBillDiscount').value = '0';
  document.getElementById('posPaidAmount').value = '';
  renderCart();
}

function calculateTicketTotals() {
  const isInterState = (document.getElementById('posCustState')?.value || DATA.shopInfo.state) !== DATA.shopInfo.state;
  const billDiscountPct = Math.min(100, Math.max(0, parseFloat(document.getElementById('posBillDiscount')?.value) || 0));

  let subtotal = 0;
  let itemDiscountsTotal = 0;
  let totalTaxable = 0;
  let totalGst = 0;

  const itemCalcs = cart.map(it => {
    const rawLine = it.price * it.qty;
    const itemDisc = rawLine * (it.discountPct / 100);
    const lineAfterItemDisc = rawLine - itemDisc;
    subtotal += rawLine;
    itemDiscountsTotal += itemDisc;

    // Apply proportional bill discount
    const billDiscShare = lineAfterItemDisc * (billDiscountPct / 100);
    const lineTaxable = lineAfterItemDisc - billDiscShare;
    totalTaxable += lineTaxable;

    const lineTax = lineTaxable * (it.taxRate / 100);
    totalGst += lineTax;

    return {
      ...it,
      itemDiscountAmt: itemDisc,
      taxableValue: lineTaxable,
      cgstAmt: isInterState ? 0 : lineTax / 2,
      sgstAmt: isInterState ? 0 : lineTax / 2,
      igstAmt: isInterState ? lineTax : 0,
      total: lineTaxable + lineTax
    };
  });

  const billDiscountAmt = (subtotal - itemDiscountsTotal) * (billDiscountPct / 100);
  const netAmount = totalTaxable + totalGst;
  const roundedTotal = Math.round(netAmount);
  const roundOff = Number((roundedTotal - netAmount).toFixed(2));

  return {
    isInterState,
    subtotal,
    itemDiscountsTotal,
    billDiscountPct,
    billDiscountAmt,
    totalTaxable,
    cgstTotal: isInterState ? 0 : totalGst / 2,
    sgstTotal: isInterState ? 0 : totalGst / 2,
    igstTotal: isInterState ? totalGst : 0,
    roundOff,
    grandTotal: roundedTotal,
    itemsWithCalculations: itemCalcs
  };
}

function renderCart() {
  const container = document.getElementById('posCartItems');
  const totalsBox = document.getElementById('posTotalsContainer');
  if (!container || !totalsBox) return;

  document.getElementById('posInvoiceNumberDisplay').textContent = getActiveInvoiceNumber();

  if (cart.length === 0) {
    container.innerHTML = '<div style="padding:32px 10px; text-align:center; color:var(--ink-muted); font-size:13px;">Cart is empty. Click any item on the left to add.</div>';
    totalsBox.innerHTML = '';
    return;
  }

  const totals = calculateTicketTotals();

  container.innerHTML = totals.itemsWithCalculations.map(it => `
    <div class="cart-item-row">
      <div>
        <div class="cart-item-name">${escapeHtml(it.name)}</div>
        <div class="cart-item-meta">₹${it.price.toFixed(2)}/${it.unit}'₹'GST ${it.taxRate}%</div>
      </div>
      <div class="qty-controller">
        <button onclick="updateCartItemQty('${it.productId}', ${it.qty - 1})">₹</button>
        <input type="number" min="1" value="${it.qty}" onchange="updateCartItemQty('${it.productId}', this.value)">
        <button onclick="updateCartItemQty('${it.productId}', ${it.qty + 1})">+</button>
      </div>
      <div style="font-family:var(--font-mono); font-size:12px;">
        <input type="number" min="0" max="100" placeholder="Disc%" value="${it.discountPct || ''}" style="width:50px; padding:3px 4px; font-size:11px;" onchange="updateItemDiscount('${it.productId}', this.value)">%
      </div>
      <div class="cart-item-total">₹${it.total.toFixed(2)}</div>
      <button class="btn-remove-item" onclick="removeFromCart('${it.productId}')">₹</button>
    </div>
  `).join('');

  totalsBox.innerHTML = `
    <div class="totals-line">
      <span>Subtotal (${cart.reduce((s, c) => s + c.qty, 0)} items)</span>
      <span style="font-family:var(--font-mono);">₹${totals.subtotal.toFixed(2)}</span>
    </div>
    ${totals.itemDiscountsTotal > 0 ? `
      <div class="totals-line" style="color:var(--accent);">
        <span>Item Discounts</span>
        <span style="font-family:var(--font-mono);">₹${totals.itemDiscountsTotal.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="totals-line">
      <span>Taxable Value</span>
      <span style="font-family:var(--font-mono); font-weight:600;">₹${totals.totalTaxable.toFixed(2)}</span>
    </div>
    ${totals.isInterState ? `
      <div class="totals-line">
        <span>IGST (Inter-state)</span>
        <span style="font-family:var(--font-mono);">+₹${totals.igstTotal.toFixed(2)}</span>
      </div>
    ` : `
      <div class="totals-line">
        <span>CGST</span>
        <span style="font-family:var(--font-mono);">+₹${totals.cgstTotal.toFixed(2)}</span>
      </div>
      <div class="totals-line">
        <span>SGST</span>
        <span style="font-family:var(--font-mono);">+₹${totals.sgstTotal.toFixed(2)}</span>
      </div>
    `}
    ${totals.roundOff !== 0 ? `
      <div class="totals-line" style="font-size:11px; color:var(--ink-muted);">
        <span>Round off</span>
        <span style="font-family:var(--font-mono);">${totals.roundOff > 0 ? '+' : ''}₹${totals.roundOff.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="totals-line grand">
      <span>Total Payable</span>
      <span style="color:var(--primary);">₹${totals.grandTotal.toFixed(2)}</span>
    </div>
    <div style="font-size:11px; color:var(--ink-muted); text-align:right; margin-top:2px;">
      ${numberToIndianWords(totals.grandTotal)}
    </div>
  `;

  // Auto-fill paid amount if not modified
  const paidInput = document.getElementById('posPaidAmount');
  if (paidInput && (!paidInput.value || Number(paidInput.dataset.autoFilled) === 1)) {
    paidInput.value = totals.grandTotal;
    paidInput.dataset.autoFilled = '1';
  }
}

function updateItemDiscount(productId, val) {
  const item = cart.find(c => c.productId === productId);
  if (!item) return;
  item.discountPct = Math.min(100, Math.max(0, parseFloat(val) || 0));
  renderCart();
}

/* ---------------- Hold & Resume Tickets ---------------- */
function holdCurrentTicket() {
  if (cart.length === 0) {
    showToast('Add items to the ticket before putting it on hold.');
    return;
  }
  const custName = document.getElementById('posCustName').value.trim() || 'Guest';
  DATA.heldBills.push({
    id: 'hold_' + Date.now(),
    date: new Date().toISOString(),
    customerName: custName,
    customerPhone: document.getElementById('posCustPhone').value.trim(),
    customerGst: document.getElementById('posCustGst').value.trim(),
    customerState: document.getElementById('posCustState').value,
    cart: [...cart]
  });
  saveData();
  cart = [];
  document.getElementById('posCustName').value = '';
  document.getElementById('posCustPhone').value = '';
  document.getElementById('posCustGst').value = '';
  renderCart();
  renderHeldBillsDropdown();
  showToast('Ticket put on hold successfully.');
}

function renderHeldBillsDropdown() {
  const box = document.getElementById('posHeldBillsList');
  if (!box) return;
  if (DATA.heldBills.length === 0) {
    box.innerHTML = '';
    box.style.display = 'none';
    return;
  }
  box.style.display = 'block';
  box.innerHTML = `
    <div style="background:var(--amber-soft); border:1px solid #FCD34D; border-radius:var(--radius); padding:10px 14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <span style="font-size:12.5px; font-weight:600; color:#92400E;">₹³ ${DATA.heldBills.length} Bill(s) on Hold:</span>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${DATA.heldBills.map(hb => `
          <button class="btn btn-sm" onclick="resumeHeldBill('${hb.id}')" style="background:#FFF;">
            ${escapeHtml(hb.customerName)} (${hb.cart.length} items)
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function resumeHeldBill(id) {
  const hb = DATA.heldBills.find(h => h.id === id);
  if (!hb) return;
  if (cart.length > 0 && !confirm('Replace current ticket with held bill?')) return;
  cart = [...hb.cart];
  document.getElementById('posCustName').value = hb.customerName;
  document.getElementById('posCustPhone').value = hb.customerPhone || '';
  document.getElementById('posCustGst').value = hb.customerGst || '';
  document.getElementById('posCustState').value = hb.customerState || DATA.shopInfo.state;
  DATA.heldBills = DATA.heldBills.filter(h => h.id !== id);
  saveData();
  renderCart();
  renderHeldBillsDropdown();
  showToast(`Resumed ticket for ${hb.customerName}`);
}

/* ---------------- Complete Sale & Invoice Generation ---------------- */
async function completeSaleTransaction() {
  if (cart.length === 0) {
    showToast('Cannot complete sale: Cart is empty.');
    return;
  }

  // Double check stock availability
  for (const c of cart) {
    const p = DATA.products.find(x => x.id === c.productId);
    if (!p || c.qty > p.stock) {
      showToast(`Stock updated during checkout! Insufficient stock for ${c.name}.`);
      renderProductCatalog();
      return;
    }
  }

  const totals = calculateTicketTotals();
  const custName = document.getElementById('posCustName').value.trim() || 'Walk-in Customer';
  const custPhone = document.getElementById('posCustPhone').value.trim();
  const custGst = document.getElementById('posCustGst').value.trim().toUpperCase();
  const custState = document.getElementById('posCustState').value;
  const payMethod = document.getElementById('posPaymentMethod').value;
  const paidVal = parseFloat(document.getElementById('posPaidAmount').value);
  const paidAmount = isNaN(paidVal) ? totals.grandTotal : Math.max(0, paidVal);
  const balanceDue = Math.max(0, totals.grandTotal - paidAmount);

  const status = balanceDue === 0 ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'CREDIT');

  const btn = document.getElementById('btnCompleteSale');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

  const invoice = {
    id: 'inv_' + Date.now(),
    number: getActiveInvoiceNumber(),
    date: new Date().toISOString(),
    customerName: custName,
    customerPhone: custPhone,
    customerGst: custGst,
    customerAddress: '',
    customerState: custState,
    stateCode: custState === DATA.shopInfo.state ? DATA.shopInfo.stateCode : 'OT',
    items: totals.itemsWithCalculations,
    subtotal: totals.subtotal,
    itemDiscountsTotal: totals.itemDiscountsTotal,
    billDiscountPct: totals.billDiscountPct,
    billDiscountAmt: totals.billDiscountAmt,
    totalTaxable: totals.totalTaxable,
    cgstTotal: totals.cgstTotal,
    sgstTotal: totals.sgstTotal,
    igstTotal: totals.igstTotal,
    roundOff: totals.roundOff,
    total: totals.grandTotal,
    paymentMethod: payMethod,
    paidAmount: paidAmount,
    balanceDue: balanceDue,
    status: status,
    notes: document.getElementById('posBillNotes')?.value || '',
    returns: []
  };

  // 1. Deduct Stock & Record Stock Movement
  cart.forEach(c => {
    const p = DATA.products.find(x => x.id === c.productId);
    if (p) {
      p.stock -= c.qty;
      DATA.stockMovements.push({
        id: 'sm_' + Date.now() + Math.random(),
        date: invoice.date,
        productId: p.id,
        productName: p.name,
        changeQty: -c.qty,
        reason: `Sale ${invoice.number}`,
        balanceStock: p.stock
      });
    }
  });

  // 2. Add Invoice
  DATA.invoices.push(invoice);
  DATA.nextInvoiceNo += 1;

  // 3. Update Customer Ledger
  if (custName.toLowerCase() !== 'walk-in customer') {
    let cust = DATA.customers.find(c => c.name.toLowerCase() === custName.toLowerCase());
    if (!cust) {
      cust = {
        id: 'cust_' + Date.now(),
        name: custName,
        phone: custPhone,
        gstin: custGst,
        address: '',
        state: custState,
        creditBalance: 0,
        totalBilled: 0
      };
      DATA.customers.push(cust);
    }
    cust.totalBilled = (cust.totalBilled || 0) + invoice.total;
    cust.creditBalance = (cust.creditBalance || 0) + balanceDue;
    if (custPhone) cust.phone = custPhone;
    if (custGst) cust.gstin = custGst;
  }

  // 4. Save & Snapshot
  await saveData();
  createSnapshot(`After Sale ${invoice.number}`, 'sale');

  // Reset ticket
  cart = [];
  document.getElementById('posCustName').value = '';
  document.getElementById('posCustPhone').value = '';
  document.getElementById('posCustGst').value = '';
  document.getElementById('posPaidAmount').value = '';
  if (btn) { btn.disabled = false; btn.textContent = 'Complete Sale'; }

  renderCart();
  renderProductCatalog();
  showInvoiceModal(invoice);
}

/* ---------------- 3. GST Printable Invoice Generation ---------------- */
function showInvoiceModal(invoice) {
  currentViewingInvoice = invoice;
  const isInterState = invoice.customerState && invoice.customerState !== DATA.shopInfo.state;

  const modalHtml = `
    <div class="modal-overlay" id="invoiceModalOverlay">
      <div class="modal-content large" style="max-width:900px;">
        <div class="modal-header no-print">
          <div class="modal-title">Tax Invoice ₹” ${invoice.number}</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>

        <div class="modal-body" style="padding:24px; background:#FFFFFF;">
          <!-- Printable Invoice Layout -->
          <div id="invoicePrintArea" style="background:#FFF; color:#000; font-family:'Inter', sans-serif;">

            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #0F172A; padding-bottom:14px; margin-bottom:14px;">
              <div style="display:flex; gap:14px; align-items:center;">
                <img src="${LOGO_DATA_URI}" style="width:72px; height:auto; border-radius:4px;" alt="Logo">
                <div>
                  <h1 style="font-family:'Oswald',sans-serif; font-size:22px; margin:0; line-height:1.2; text-transform:uppercase;">${escapeHtml(DATA.shopInfo.name)}</h1>
                  <div style="font-size:11.5px; color:#475569; margin-top:2px;">${escapeHtml(DATA.shopInfo.address1)}, ${escapeHtml(DATA.shopInfo.address2)}, ${escapeHtml(DATA.shopInfo.city)} - ${escapeHtml(DATA.shopInfo.state)}</div>
                  <div style="font-size:11.5px; font-weight:600; margin-top:2px;">Phone: ${escapeHtml(DATA.shopInfo.phone)}'₹'Email: ${escapeHtml(DATA.shopInfo.email)}</div>
                  <div style="font-size:12px; font-weight:700; color:#0F172A; margin-top:2px;">GSTIN: ${escapeHtml(DATA.shopInfo.gstin)}'₹'State Code: ${escapeHtml(DATA.shopInfo.stateCode)}</div>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="background:#0F172A; color:#FFF; font-family:'Oswald',sans-serif; font-size:13px; letter-spacing:1px; padding:4px 12px; border-radius:3px; display:inline-block;">TAX INVOICE</div>
                <div style="font-family:'JetBrains Mono',monospace; font-weight:700; font-size:14px; margin-top:6px; color:#EA580C;">${invoice.number}</div>
                <div style="font-size:11.5px; color:#475569; margin-top:2px;">Date: ${new Date(invoice.date).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</div>
                <div style="font-size:11.5px; margin-top:2px;">Payment: <strong>${invoice.paymentMethod}</strong> (${invoice.status})</div>
              </div>
            </div>

            <!-- Billed To / Shipped To -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:10px 14px; margin-bottom:14px; font-size:12px;">
              <div>
                <strong style="text-transform:uppercase; font-size:10.5px; color:#64748B;">Billed To (Customer Details):</strong>
                <div style="font-weight:700; font-size:14px; margin-top:2px;">${escapeHtml(invoice.customerName)}</div>
                ${invoice.customerPhone ? `<div>Phone: ${escapeHtml(invoice.customerPhone)}</div>` : ''}
                ${invoice.customerAddress ? `<div>Address: ${escapeHtml(invoice.customerAddress)}</div>` : ''}
                <div>Place of Supply: <strong>${escapeHtml(invoice.customerState || DATA.shopInfo.state)}</strong></div>
              </div>
              <div style="text-align:right;">
                ${invoice.customerGst ? `
                  <strong style="text-transform:uppercase; font-size:10.5px; color:#64748B;">Customer GSTIN:</strong>
                  <div style="font-family:'JetBrains Mono',monospace; font-weight:700; font-size:13px; color:#0F172A;">${escapeHtml(invoice.customerGst)}</div>
                ` : '<div style="color:#64748B; font-style:italic; margin-top:10px;">Consumer / Unregistered Person</div>'}
              </div>
            </div>

            <!-- Items Table -->
            <table style="width:100%; border-collapse:collapse; font-size:11.5px; margin-bottom:14px;">
              <thead>
                <tr style="background:#0F172A; color:#FFF; text-align:left;">
                  <th style="padding:6px 8px;">#</th>
                  <th style="padding:6px 8px;">Item Description</th>
                  <th style="padding:6px 8px;">HSN</th>
                  <th style="padding:6px 8px; text-align:right;">Qty</th>
                  <th style="padding:6px 8px; text-align:right;">Rate (₹)</th>
                  <th style="padding:6px 8px; text-align:right;">Taxable (₹)</th>
                  ${isInterState ? `
                    <th style="padding:6px 8px; text-align:right;">IGST</th>
                  ` : `
                    <th style="padding:6px 8px; text-align:right;">CGST</th>
                    <th style="padding:6px 8px; text-align:right;">SGST</th>
                  `}
                  <th style="padding:6px 8px; text-align:right;">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((it, idx) => `
                  <tr style="border-bottom:1px solid #E2E8F0;">
                    <td style="padding:6px 8px;">${idx + 1}</td>
                    <td style="padding:6px 8px; font-weight:600;">${escapeHtml(it.name)}</td>
                    <td style="padding:6px 8px; font-family:'JetBrains Mono',monospace;">${it.hsn || '₹”'}</td>
                    <td style="padding:6px 8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.qty} ${it.unit}</td>
                    <td style="padding:6px 8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.price.toFixed(2)}</td>
                    <td style="padding:6px 8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.taxableValue.toFixed(2)}</td>
                    ${isInterState ? `
                      <td style="padding:6px 8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.igstAmt.toFixed(2)} (${it.taxRate}%)</td>
                    ` : `
                      <td style="padding:6px 8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.cgstAmt.toFixed(2)} (${it.taxRate/2}%)</td>
                      <td style="padding:6px 8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.sgstAmt.toFixed(2)} (${it.taxRate/2}%)</td>
                    `}
                    <td style="padding:6px 8px; text-align:right; font-weight:600; font-family:'JetBrains Mono',monospace;">${it.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Summary & Bank Info -->
            <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:20px; align-items:start; border-top:1px solid #CBD5E1; padding-top:10px;">
              <div>
                <div style="font-size:11px; margin-bottom:6px;">
                  <strong>Amount in Words:</strong><br>
                  <span style="font-style:italic; font-weight:600;">${numberToIndianWords(invoice.total)}</span>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:4px; padding:8px 12px; font-size:11px; line-height:1.4;">
                  <strong>Bank & UPI Payment Details:</strong><br>
                  Bank Name: ${escapeHtml(DATA.shopInfo.bankName)}<br>
                  A/C No: <strong>${escapeHtml(DATA.shopInfo.bankAccount)}</strong>'₹'IFSC: <strong>${escapeHtml(DATA.shopInfo.bankIfsc)}</strong><br>
                  UPI ID: <strong>${escapeHtml(DATA.shopInfo.upiId)}</strong>
                </div>
              </div>

              <div style="font-size:12px; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; justify-content:space-between;"><span>Taxable Subtotal:</span><strong style="font-family:'JetBrains Mono',monospace;">₹${invoice.totalTaxable.toFixed(2)}</strong></div>
                ${isInterState ? `
                  <div style="display:flex; justify-content:space-between;"><span>Integrated GST (IGST):</span><span style="font-family:'JetBrains Mono',monospace;">₹${invoice.igstTotal.toFixed(2)}</span></div>
                ` : `
                  <div style="display:flex; justify-content:space-between;"><span>Central GST (CGST):</span><span style="font-family:'JetBrains Mono',monospace;">₹${invoice.cgstTotal.toFixed(2)}</span></div>
                  <div style="display:flex; justify-content:space-between;"><span>State GST (SGST):</span><span style="font-family:'JetBrains Mono',monospace;">₹${invoice.sgstTotal.toFixed(2)}</span></div>
                `}
                ${invoice.billDiscountAmt > 0 ? `
                  <div style="display:flex; justify-content:space-between; color:#EA580C;"><span>Bill Discount (${invoice.billDiscountPct}%):</span><span style="font-family:'JetBrains Mono',monospace;">₹₹${invoice.billDiscountAmt.toFixed(2)}</span></div>
                ` : ''}
                ${invoice.roundOff !== 0 ? `
                  <div style="display:flex; justify-content:space-between; color:#64748B;"><span>Round Off:</span><span style="font-family:'JetBrains Mono',monospace;">${invoice.roundOff > 0 ? '+' : ''}₹${invoice.roundOff.toFixed(2)}</span></div>
                ` : ''}
                <div style="display:flex; justify-content:space-between; border-top:2px solid #0F172A; padding-top:6px; font-size:15px; font-weight:700;">
                  <span>Grand Total:</span>
                  <span style="color:#2563EB; font-family:'JetBrains Mono',monospace;">₹${invoice.total.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-top:2px;">
                  <span>Paid: ₹${invoice.paidAmount.toFixed(2)}</span>
                  <span style="color:${invoice.balanceDue > 0 ? '#DC2626' : '#16A34A'}; font-weight:600;">
                    ${invoice.balanceDue > 0 ? `Balance Due: ₹${invoice.balanceDue.toFixed(2)}` : 'Fully Paid'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Signatures & Terms -->
            <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:20px; align-items:flex-end; margin-top:20px; padding-top:12px; border-top:1px dashed #CBD5E1;">
              <div style="font-size:10px; color:#64748B; line-height:1.35;">
                <strong>Terms & Conditions:</strong><br>
                ${escapeHtml(DATA.shopInfo.defaultTerms).replace(/\n/g, '<br>')}
              </div>
              <div style="text-align:center;">
                <div style="font-size:11px; font-weight:600; margin-bottom:40px;">For ${escapeHtml(DATA.shopInfo.name)}</div>
                <div style="border-top:1px solid #000; font-size:11px; padding-top:4px;">Authorised Signatory</div>
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer no-print">
          <button class="btn" onclick="closeModal()">Close</button>
          <button class="btn btn-accent" onclick="shareInvoiceWhatsApp('${invoice.id}')">ðŸ“² WhatsApp</button>
          <button class="btn" onclick="downloadInvoicePDFDirect('${invoice.id}')">₹¬‡ Download PDF</button>
          <button class="btn btn-primary" onclick="window.print()">ðŸ–¨ Print Invoice</button>
        </div>
      </div>
    </div>
  `;

  // Place into printable element and show modal
  document.getElementById('printableInvoice').innerHTML = document.createRange().createContextualFragment(modalHtml).querySelector('#invoicePrintArea').innerHTML;
  const existingModal = document.getElementById('invoiceModalOverlay');
  if (existingModal) existingModal.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.remove();
}

/* ---------------- WhatsApp Share ---------------- */
function shareInvoiceWhatsApp(invoiceId) {
  const inv = DATA.invoices.find(x => x.id === invoiceId) || currentViewingInvoice;
  if (!inv) return;

  let phone = (inv.customerPhone || '').replace(/\D/g, '');
  if (phone.length === 10) phone = '91' + phone;

  const lines = [
    `*TAX INVOICE ₹” ${DATA.shopInfo.name}*`,
    `Invoice: *${inv.number}* | Date: ${new Date(inv.date).toLocaleDateString('en-IN')}`,
    `Customer: ${inv.customerName}`,
    `--------------------------------`,
    ...inv.items.map(it => `₹¢ ${it.name} (${it.qty} ${it.unit}) = ₹${it.total.toFixed(2)}`),
    `--------------------------------`,
    `Taxable: ₹${inv.totalTaxable.toFixed(2)}`,
    `GST Total: ₹${((inv.cgstTotal || 0) + (inv.sgstTotal || 0) + (inv.igstTotal || 0)).toFixed(2)}`,
    `*Grand Total: ₹${inv.total.toFixed(2)}*`,
    inv.balanceDue > 0 ? `Balance Due: ₹${inv.balanceDue.toFixed(2)}` : `Status: FULLY PAID`,
    `--------------------------------`,
    `Bank/UPI: ${DATA.shopInfo.upiId}`,
    `Thank you for your business!`
  ];

  const text = encodeURIComponent(lines.join('\n'));
  const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  window.open(url, '_blank');
}

/* ---------------- PDF Download ---------------- */
function downloadInvoicePDFDirect(invoiceId) {
  const inv = DATA.invoices.find(x => x.id === invoiceId) || currentViewingInvoice;
  if (!inv) return;

  if (window.jspdf && window.jspdf.jsPDF) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ format: 'a4', unit: 'mm' });
      const pw = doc.internal.pageSize.getWidth();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(DATA.shopInfo.name, pw / 2, 16, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${DATA.shopInfo.address1}, ${DATA.shopInfo.city}'₹'Phone: ${DATA.shopInfo.phone}'₹'GSTIN: ${DATA.shopInfo.gstin}`, pw / 2, 22, { align: 'center' });

      doc.setDrawColor(15, 23, 42);
      doc.line(14, 26, pw - 14, 26);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`TAX INVOICE: ${inv.number}`, 14, 33);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date(inv.date).toLocaleDateString('en-IN')}`, pw - 14, 33, { align: 'right' });
      doc.text(`Customer: ${inv.customerName} ${inv.customerPhone ? '(' + inv.customerPhone + ')' : ''}`, 14, 39);

      let y = 48;
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y - 5, pw - 28, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Item Description', 16, y);
      doc.text('HSN', 88, y);
      doc.text('Qty', 110, y, { align: 'right' });
      doc.text('Rate', 135, y, { align: 'right' });
      doc.text('Total (Rs.)', pw - 16, y, { align: 'right' });
      y += 6;

      doc.setFont('helvetica', 'normal');
      inv.items.forEach((it, i) => {
        doc.text(it.name.substring(0, 38), 16, y);
        doc.text(it.hsn || '₹”', 88, y);
        doc.text(`${it.qty} ${it.unit}`, 110, y, { align: 'right' });
        doc.text(it.price.toFixed(2), 135, y, { align: 'right' });
        doc.text(it.total.toFixed(2), pw - 16, y, { align: 'right' });
        y += 6;
      });

      doc.line(14, y, pw - 14, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Total Amount: Rs. ${inv.total.toFixed(2)}`, pw - 16, y, { align: 'right' });
      y += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Amount in words: ${numberToIndianWords(inv.total)}`, 14, y);

      doc.save(`${inv.number}.pdf`);
      showToast('PDF generated and downloaded.');
      return;
    } catch (e) {
      console.warn('jsPDF error, falling back to window.print', e);
    }
  }
  // Native fallback
  window.print();
}

/* ---------------- 4. Inventory Management Module ---------------- */
function renderInventoryModule() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  const q = (document.getElementById('invSearchInput')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('invCategoryFilter')?.value || 'all';
  const stockFilter = document.getElementById('invStockFilter')?.value || 'all';

  const filtered = DATA.products.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q));
    const matchCat = cat === 'all' || p.category === cat;
    let matchStock = true;
    if (stockFilter === 'low') matchStock = p.stock <= p.minStock && p.stock > 0;
    if (stockFilter === 'out') matchStock = p.stock <= 0;
    if (stockFilter === 'in') matchStock = p.stock > p.minStock;
    return matchQ && matchCat && matchStock;
  });

  // Calculate stock stats
  const totalItems = DATA.products.length;
  const totalStockUnits = DATA.products.reduce((s, p) => s + p.stock, 0);
  const totalValuation = DATA.products.reduce((s, p) => s + (p.stock * p.purchasePrice), 0);
  const retailValuation = DATA.products.reduce((s, p) => s + (p.stock * p.sellingPrice), 0);

  document.getElementById('invTotalItems').textContent = totalItems;
  document.getElementById('invTotalUnits').textContent = totalStockUnits;
  document.getElementById('invValuationCost').textContent = '₹' + Math.round(totalValuation).toLocaleString('en-IN');
  document.getElementById('invExpectedProfit').textContent = '₹' + Math.round(retailValuation - totalValuation).toLocaleString('en-IN');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--ink-muted);">No products found in inventory.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isOut = p.stock <= 0;
    const isLow = !isOut && p.stock <= p.minStock;
    const badgeClass = isOut ? 'badge-red' : (isLow ? 'badge-amber' : 'badge-green');
    const badgeText = isOut ? 'Out of Stock' : (isLow ? 'Low Stock' : 'In Stock');

    return `
      <tr>
        <td>
          <div style="font-weight:600;">${escapeHtml(p.name)}</div>
          <div style="font-size:11px; color:var(--ink-muted); font-family:var(--font-mono);">${p.barcode ? 'Barcode: ' + p.barcode : ''}</div>
        </td>
        <td style="font-family:var(--font-mono); font-size:12px;">${p.sku}</td>
        <td>${escapeHtml(p.category)}</td>
        <td style="font-family:var(--font-mono); font-size:12px;">${p.hsn || '₹”'}</td>
        <td style="font-family:var(--font-mono);">₹${p.purchasePrice.toFixed(2)}</td>
        <td style="font-family:var(--font-mono); font-weight:600; color:var(--primary);">₹${p.sellingPrice.toFixed(2)}</td>
        <td style="font-family:var(--font-mono); font-weight:700;">${p.stock} ${p.unit}</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm" onclick="openStockAdjustModal('${p.id}')">Stock ₹±</button>
            <button class="btn btn-sm" onclick="editProductModal('${p.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProductPrompt('${p.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddProductModal() {
  editingProductId = null;
  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Add New Product</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Product Name *</label>
            <input type="text" id="mProdName" placeholder="e.g. Gurjan Waterproof Plywood 18mm" style="width:100%;">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>SKU (Auto or Custom)</label>
              <input type="text" id="mProdSku" placeholder="Auto">
            </div>
            <div class="form-group">
              <label>Barcode</label>
              <input type="text" id="mProdBarcode" placeholder="Scan or enter barcode">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select id="mProdCat">
                <option value="Plywood">Plywood</option>
                <option value="Plumbing & PVC">Plumbing & PVC</option>
                <option value="Cement">Cement</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Fasteners">Fasteners</option>
                <option value="Paints & Putty">Paints & Putty</option>
                <option value="Hardware">Hardware</option>
                <option value="Electrical">Electrical</option>
                <option value="General">General</option>
              </select>
            </div>
            <div class="form-group">
              <label>HSN / SAC Code</label>
              <input type="text" id="mProdHsn" placeholder="e.g. 4412">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Purchase Price (₹)</label>
              <input type="number" id="mProdCost" step="0.01" min="0" placeholder="0.00">
            </div>
            <div class="form-group">
              <label>Selling Price (₹) *</label>
              <input type="number" id="mProdPrice" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Initial Stock Qty</label>
              <input type="number" id="mProdStock" min="0" value="0">
            </div>
            <div class="form-group">
              <label>Unit of Measure</label>
              <select id="mProdUnit">
                <option value="pcs">Pieces (pcs)</option>
                <option value="sheet">Sheet</option>
                <option value="box">Box</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="m">Metre (m)</option>
                <option value="ltr">Litre (ltr)</option>
                <option value="set">Set</option>
                <option value="sq.ft">Sq. Ft</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>GST Tax Rate (%)</label>
              <select id="mProdTax">
                <option value="0">0% (Nil)</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18" selected>18% (Standard)</option>
                <option value="28">28% (Cement/Luxury)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Min Stock Threshold</label>
              <input type="number" id="mProdMinStock" min="0" value="5">
            </div>
          </div>
          <div class="form-group">
            <label>Preferred Supplier</label>
            <input type="text" id="mProdSupplier" placeholder="Supplier or distributor name" style="width:100%;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="saveProductModal()">Save Product</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function editProductModal(id) {
  const p = DATA.products.find(x => x.id === id);
  if (!p) return;
  editingProductId = id;

  openAddProductModal();
  document.querySelector('.modal-title').textContent = 'Edit Product ₹” ' + p.name;
  document.getElementById('mProdName').value = p.name;
  document.getElementById('mProdSku').value = p.sku;
  document.getElementById('mProdBarcode').value = p.barcode || '';
  document.getElementById('mProdCat').value = p.category;
  document.getElementById('mProdHsn').value = p.hsn || '';
  document.getElementById('mProdCost').value = p.purchasePrice;
  document.getElementById('mProdPrice').value = p.sellingPrice;
  document.getElementById('mProdStock').value = p.stock;
  document.getElementById('mProdUnit').value = p.unit;
  document.getElementById('mProdTax').value = p.taxRate;
  document.getElementById('mProdMinStock').value = p.minStock;
  document.getElementById('mProdSupplier').value = p.supplier || '';
}

async function saveProductModal() {
  const name = document.getElementById('mProdName').value.trim();
  const price = parseFloat(document.getElementById('mProdPrice').value);
  if (!name || isNaN(price) || price < 0) {
    showToast('Please enter a valid product name and selling price.');
    return;
  }

  const sku = document.getElementById('mProdSku').value.trim() || ('SKU-' + Date.now().toString().slice(-6));
  const barcode = document.getElementById('mProdBarcode').value.trim();
  const category = document.getElementById('mProdCat').value;
  const hsn = document.getElementById('mProdHsn').value.trim() || '8205';
  const cost = parseFloat(document.getElementById('mProdCost').value) || 0;
  const stock = parseInt(document.getElementById('mProdStock').value) || 0;
  const unit = document.getElementById('mProdUnit').value;
  const taxRate = parseFloat(document.getElementById('mProdTax').value) || 18;
  const minStock = parseInt(document.getElementById('mProdMinStock').value) || 5;
  const supplier = document.getElementById('mProdSupplier').value.trim();

  if (editingProductId) {
    const p = DATA.products.find(x => x.id === editingProductId);
    if (p) {
      p.name = name;
      p.sku = sku;
      p.barcode = barcode;
      p.category = category;
      p.hsn = hsn;
      p.purchasePrice = cost;
      p.sellingPrice = price;
      p.stock = stock;
      p.unit = unit;
      p.taxRate = taxRate;
      p.minStock = minStock;
      p.supplier = supplier;
    }
    showToast('Product updated.');
  } else {
    DATA.products.push({
      id: 'p_' + Date.now(),
      name, sku, barcode, category, hsn,
      purchasePrice: cost, sellingPrice: price,
      stock, unit, taxRate, minStock, supplier
    });
    showToast('New product added to inventory.');
  }

  await saveData();
  closeModal();
  renderInventoryModule();
  renderProductCatalog();
}

async function deleteProductPrompt(id) {
  const p = DATA.products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Are you sure you want to delete "${p.name}"?\nExisting invoices referencing this product will still be preserved.`)) return;

  DATA.products = DATA.products.filter(x => x.id !== id);
  await saveData();
  renderInventoryModule();
  renderProductCatalog();
  showToast('Product deleted from inventory.');
}

function openStockAdjustModal(id) {
  const p = DATA.products.find(x => x.id === id);
  if (!p) return;

  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Stock Adjustment: ${escapeHtml(p.name)}</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px; border-radius:var(--radius); margin-bottom:14px; font-size:13px;">
            Current Available Stock: <strong style="color:var(--primary); font-size:16px;">${p.stock} ${p.unit}</strong>
          </div>
          <div class="form-group">
            <label>Adjustment Type</label>
            <select id="mAdjType" style="width:100%;">
              <option value="add">Add Stock (+)</option>
              <option value="reduce">Reduce Stock (₹)</option>
              <option value="set">Set Exact Count (=)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input type="number" id="mAdjQty" min="0" step="1" value="1" style="width:100%;">
          </div>
          <div class="form-group">
            <label>Reason / Audit Note</label>
            <select id="mAdjReason" style="width:100%;">
              <option value="Stock Physical Audit">Stock Physical Audit</option>
              <option value="Supplier Purchase">Supplier Purchase</option>
              <option value="Damaged / Broken">Damaged / Broken Goods</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Correction / Other">Other Manual Correction</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="confirmStockAdjustment('${p.id}')">Apply Stock Change</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function confirmStockAdjustment(id) {
  const p = DATA.products.find(x => x.id === id);
  if (!p) return;

  const type = document.getElementById('mAdjType').value;
  const qty = parseInt(document.getElementById('mAdjQty').value) || 0;
  const reason = document.getElementById('mAdjReason').value;

  if (qty <= 0 && type !== 'set') {
    showToast('Please enter a valid quantity.');
    return;
  }

  let delta = 0;
  if (type === 'add') delta = qty;
  else if (type === 'reduce') delta = -qty;
  else if (type === 'set') delta = qty - p.stock;

  if (p.stock + delta < 0) {
    if (!confirm('This adjustment will result in negative stock. Authorize anyway?')) return;
  }

  p.stock += delta;
  DATA.stockMovements.push({
    id: 'sm_' + Date.now(),
    date: new Date().toISOString(),
    productId: p.id,
    productName: p.name,
    changeQty: delta,
    reason: reason,
    balanceStock: p.stock
  });

  await saveData();
  closeModal();
  renderInventoryModule();
  renderProductCatalog();
  showToast(`Stock updated for ${p.name} (Now: ${p.stock} ${p.unit})`);
}

function quickStockAdd(id) {
  openStockAdjustModal(id);
}

/* ---------------- CSV Export & Import ---------------- */
function exportInventoryCSV() {
  const headers = ['Name', 'SKU', 'Barcode', 'Category', 'HSN', 'PurchasePrice', 'SellingPrice', 'Stock', 'Unit', 'TaxRate', 'MinStock', 'Supplier'];
  const rows = DATA.products.map(p => [
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${p.sku || ''}"`,
    `"${p.barcode || ''}"`,
    `"${p.category || ''}"`,
    `"${p.hsn || ''}"`,
    p.purchasePrice,
    p.sellingPrice,
    p.stock,
    `"${p.unit || 'pcs'}"`,
    p.taxRate,
    p.minStock,
    `"${(p.supplier || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
  downloadBlob(csvContent, 'inventory_export_' + new Date().toISOString().slice(0, 10) + '.csv', 'text/csv');
  showToast('Inventory exported to CSV.');
}

function handleCSVImport(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) throw new Error('File has no data rows.');

      let imported = 0;
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('#')) continue;
        const cols = parseCSVLine(line);
        if (cols.length >= 7) {
          const name = cols[0];
          const sku = cols[1] || 'SKU-' + Date.now();
          const barcode = cols[2] || '';
          const category = cols[3] || 'General';
          const hsn = cols[4] || '8205';
          const purchasePrice = parseFloat(cols[5]) || 0;
          const sellingPrice = parseFloat(cols[6]) || 0;
          const stock = parseInt(cols[7]) || 0;
          const unit = cols[8] || 'pcs';
          const taxRate = parseFloat(cols[9]) || 18;
          const minStock = parseInt(cols[10]) || 5;
          const supplier = cols[11] || '';

          const existing = DATA.products.find(p => p.sku === sku || p.name.toLowerCase() === name.toLowerCase());
          if (existing) {
            existing.purchasePrice = purchasePrice;
            existing.sellingPrice = sellingPrice;
            existing.stock = stock;
            existing.unit = unit;
            existing.taxRate = taxRate;
          } else {
            DATA.products.push({
              id: 'p_' + Date.now() + '_' + i,
              name, sku, barcode, category, hsn,
              purchasePrice, sellingPrice, stock, unit, taxRate, minStock, supplier
            });
          }
          imported++;
        }
      }

      await saveData();
      renderInventoryModule();
      renderProductCatalog();
      showToast(`Imported ${imported} products from CSV.`);
    } catch (err) {
      showToast('Error importing CSV: ' + err.message);
    }
    fileInput.value = '';
  };
  reader.readAsText(file);
}

function parseCSVLine(text) {
  const res = [];
  let entry = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { entry += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes) {
      res.push(entry.trim());
      entry = '';
    } else {
      entry += c;
    }
  }
  res.push(entry.trim());
  return res;
}

/* ---------------- 5. Purchases & Suppliers Module ---------------- */
function renderPurchasesModule() {
  const tbody = document.getElementById('purchasesTableBody');
  if (!tbody) return;

  const totalSpent = DATA.purchases.reduce((s, p) => s + (p.totalCost || 0), 0);
  document.getElementById('purchasesTotalSpent').textContent = '₹' + Math.round(totalSpent).toLocaleString('en-IN');
  document.getElementById('purchasesCount').textContent = DATA.purchases.length;
  document.getElementById('suppliersCount').textContent = DATA.suppliers.length;

  if (DATA.purchases.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--ink-muted);">No supplier purchase orders recorded yet. Record one using "+ New Purchase".</td></tr>';
    return;
  }

  tbody.innerHTML = [...DATA.purchases].reverse().map(po => `
    <tr>
      <td style="font-family:var(--font-mono); font-weight:700; color:var(--primary);">${po.poNumber}</td>
      <td style="font-family:var(--font-mono); font-size:12px;">${escapeHtml(po.invoiceRef || '₹”')}</td>
      <td>${new Date(po.date).toLocaleDateString('en-IN')}</td>
      <td style="font-weight:600;">${escapeHtml(po.supplierName)}</td>
      <td>${po.items.length} items (${po.items.reduce((s, i) => s + i.qty, 0)} units)</td>
      <td style="font-family:var(--font-mono); font-weight:700;">₹${po.totalCost.toFixed(2)}</td>
      <td><span class="badge badge-green">Received</span></td>
    </tr>
  `).join('');
}

function openNewPurchaseModal() {
  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content large">
        <div class="modal-header">
          <div class="modal-title">Record Supplier Purchase / Inward Stock</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Supplier Name *</label>
              <input type="text" id="poSupplierName" placeholder="e.g. Supreme Plastics Ltd" style="width:100%;">
            </div>
            <div class="form-group">
              <label>Supplier Invoice / Bill #</label>
              <input type="text" id="poInvoiceRef" placeholder="e.g. SUP-9821">
            </div>
            <div class="form-group">
              <label>Purchase Date</label>
              <input type="date" id="poDate" value="${new Date().toISOString().slice(0, 10)}">
            </div>
          </div>

          <div style="margin:16px 0 8px; font-weight:600; font-size:13px; border-bottom:1px solid #CBD5E1; padding-bottom:6px;">
            Select Product to Inward
          </div>
          <div style="display:flex; gap:10px; margin-bottom:12px; align-items:flex-end; flex-wrap:wrap;">
            <div style="flex:2; min-width:200px;">
              <label>Product</label>
              <select id="poProductSelect" style="width:100%;">
                ${DATA.products.map(p => `<option value="${p.id}">${escapeHtml(p.name)} (${p.sku})</option>`).join('')}
              </select>
            </div>
            <div style="flex:1; min-width:80px;">
              <label>Quantity</label>
              <input type="number" id="poItemQty" min="1" value="10" style="width:100%;">
            </div>
            <div style="flex:1; min-width:100px;">
              <label>Cost Rate (₹)</label>
              <input type="number" id="poItemCost" min="0" step="0.01" placeholder="Cost price" style="width:100%;">
            </div>
            <button class="btn btn-primary" onclick="addPoItemRow()">+ Add Item</button>
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-top:10px;">
            <thead>
              <tr style="background:#F8FAFC; text-align:left;">
                <th style="padding:6px;">Item</th>
                <th style="padding:6px; text-align:right;">Qty</th>
                <th style="padding:6px; text-align:right;">Cost (₹)</th>
                <th style="padding:6px; text-align:right;">Total (₹)</th>
                <th style="padding:6px;"></th>
              </tr>
            </thead>
            <tbody id="poItemsTableBody">
              <tr><td colspan="5" style="text-align:center; padding:14px; color:var(--ink-muted);">No items added yet.</td></tr>
            </tbody>
          </table>

          <div style="margin-top:16px; text-align:right; font-size:16px; font-weight:700;">
            Total Purchase Cost: <span id="poTotalDisplay" style="color:var(--primary);">₹0.00</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="savePurchaseOrder()">Confirm Purchase & Update Stock</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  window._poItems = [];
}

function addPoItemRow() {
  const prodId = document.getElementById('poProductSelect').value;
  const p = DATA.products.find(x => x.id === prodId);
  if (!p) return;

  const qty = parseInt(document.getElementById('poItemQty').value) || 1;
  const cost = parseFloat(document.getElementById('poItemCost').value) || p.purchasePrice;

  window._poItems = window._poItems || [];
  window._poItems.push({
    productId: p.id,
    name: p.name,
    sku: p.sku,
    qty,
    unit: p.unit,
    purchasePrice: cost,
    taxRate: p.taxRate,
    total: qty * cost
  });

  renderPoItemsTable();
}

function renderPoItemsTable() {
  const tbody = document.getElementById('poItemsTableBody');
  const totalDisp = document.getElementById('poTotalDisplay');
  if (!tbody || !window._poItems) return;

  if (window._poItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:14px; color:var(--ink-muted);">No items added yet.</td></tr>';
    totalDisp.textContent = '₹0.00';
    return;
  }

  tbody.innerHTML = window._poItems.map((it, idx) => `
    <tr style="border-bottom:1px solid #E2E8F0;">
      <td style="padding:6px; font-weight:600;">${escapeHtml(it.name)}</td>
      <td style="padding:6px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.qty} ${it.unit}</td>
      <td style="padding:6px; text-align:right; font-family:'JetBrains Mono',monospace;">₹${it.purchasePrice.toFixed(2)}</td>
      <td style="padding:6px; text-align:right; font-family:'JetBrains Mono',monospace;">₹${it.total.toFixed(2)}</td>
      <td style="padding:6px; text-align:center;"><button class="btn-remove-item" onclick="removePoItemRow(${idx})">₹</button></td>
    </tr>
  `).join('');

  const total = window._poItems.reduce((s, i) => s + i.total, 0);
  totalDisp.textContent = '₹' + total.toFixed(2);
}

function removePoItemRow(idx) {
  window._poItems.splice(idx, 1);
  renderPoItemsTable();
}

async function savePurchaseOrder() {
  const supplierName = document.getElementById('poSupplierName').value.trim();
  if (!supplierName) {
    showToast('Please enter supplier name.');
    return;
  }
  if (!window._poItems || window._poItems.length === 0) {
    showToast('Add at least one item to inward.');
    return;
  }

  const invoiceRef = document.getElementById('poInvoiceRef').value.trim();
  const date = document.getElementById('poDate').value || new Date().toISOString();
  const totalCost = window._poItems.reduce((s, i) => s + i.total, 0);
  const poNumber = 'PO-' + (DATA.purchases.length + 101);

  const po = {
    id: 'po_' + Date.now(),
    poNumber,
    invoiceRef,
    date,
    supplierName,
    items: [...window._poItems],
    totalCost,
    status: 'RECEIVED'
  };

  // Increase stock for each product
  window._poItems.forEach(it => {
    const p = DATA.products.find(x => x.id === it.productId);
    if (p) {
      p.stock += it.qty;
      p.purchasePrice = it.purchasePrice; // update latest cost price
      DATA.stockMovements.push({
        id: 'sm_' + Date.now() + Math.random(),
        date: new Date().toISOString(),
        productId: p.id,
        productName: p.name,
        changeQty: it.qty,
        reason: `Purchase Inward ${poNumber}`,
        balanceStock: p.stock
      });
    }
  });

  DATA.purchases.push(po);
  await saveData();
  closeModal();
  renderPurchasesModule();
  renderInventoryModule();
  showToast(`Purchase order ${poNumber} saved. Inventory stock updated.`);
}

/* ---------------- 6. Customers & Credit Ledger ---------------- */
function renderCustomersModule() {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  const q = (document.getElementById('custSearchInput')?.value || '').toLowerCase().trim();
  const filtered = DATA.customers.filter(c => !q || c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)) || (c.gstin && c.gstin.toLowerCase().includes(q)));

  const totalDues = DATA.customers.reduce((s, c) => s + (c.creditBalance || 0), 0);
  document.getElementById('custTotalDues').textContent = '₹' + Math.round(totalDues).toLocaleString('en-IN');
  document.getElementById('custTotalCount').textContent = DATA.customers.length;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--ink-muted);">No customers found. Saved customers appear automatically during billing.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td style="font-weight:600;">${escapeHtml(c.name)}</td>
      <td style="font-family:var(--font-mono); font-size:12px;">${c.phone || '₹”'}</td>
      <td style="font-family:var(--font-mono); font-size:12px;">${c.gstin || '₹”'}</td>
      <td>${c.state || DATA.shopInfo.state}</td>
      <td style="font-family:var(--font-mono); font-weight:700; color:${c.creditBalance > 0 ? 'var(--red)' : 'var(--green)'};">
        ₹${(c.creditBalance || 0).toFixed(2)}
      </td>
      <td style="font-family:var(--font-mono);">₹${(c.totalBilled || 0).toFixed(2)}</td>
      <td>
        <div style="display:flex; gap:6px;">
          ${c.creditBalance > 0 ? `<button class="btn btn-sm btn-primary" onclick="openCreditPaymentModal('${c.id}')">Collect Pay</button>` : ''}
          <button class="btn btn-sm" onclick="viewCustomerLedger('${c.id}')">Ledger</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openCreditPaymentModal(customerId) {
  const c = DATA.customers.find(x => x.id === customerId);
  if (!c) return;

  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Collect Payment from ${escapeHtml(c.name)}</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div style="background:#FEE2E2; border:1px solid #FCA5A5; color:#991B1B; padding:12px; border-radius:var(--radius); margin-bottom:14px; font-size:13.5px;">
            Current Outstanding Balance: <strong style="font-size:16px;">₹${c.creditBalance.toFixed(2)}</strong>
          </div>
          <div class="form-group">
            <label>Amount Received (₹) *</label>
            <input type="number" id="recAmount" min="1" max="${c.creditBalance}" value="${c.creditBalance}" style="width:100%;">
          </div>
          <div class="form-group">
            <label>Payment Method</label>
            <select id="recMethod" style="width:100%;">
              <option value="Cash">Cash</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Bank Transfer">NEFT / Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div class="form-group">
            <label>Receipt Note / Ref #</label>
            <input type="text" id="recRef" placeholder="e.g. UPI Ref / Cheque No" style="width:100%;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="confirmCreditPayment('${c.id}')">Confirm Receipt</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function confirmCreditPayment(customerId) {
  const c = DATA.customers.find(x => x.id === customerId);
  if (!c) return;

  const amt = parseFloat(document.getElementById('recAmount').value);
  if (isNaN(amt) || amt <= 0) {
    showToast('Enter a valid payment amount.');
    return;
  }

  const method = document.getElementById('recMethod').value;
  const ref = document.getElementById('recRef').value.trim();

  c.creditBalance = Math.max(0, (c.creditBalance || 0) - amt);
  // Also settle oldest unpaid invoices for this customer
  let remainingSettle = amt;
  DATA.invoices
    .filter(i => i.customerName.toLowerCase() === c.name.toLowerCase() && i.balanceDue > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(inv => {
      if (remainingSettle <= 0) return;
      const settleThis = Math.min(inv.balanceDue, remainingSettle);
      inv.paidAmount += settleThis;
      inv.balanceDue -= settleThis;
      remainingSettle -= settleThis;
      inv.status = inv.balanceDue === 0 ? 'PAID' : 'PARTIAL';
    });

  await saveData();
  closeModal();
  renderCustomersModule();
  showToast(`Payment of ₹${amt.toFixed(2)} received from ${c.name}. Balance updated.`);
}

function viewCustomerLedger(customerId) {
  const c = DATA.customers.find(x => x.id === customerId);
  if (!c) return;

  const customerInvoices = DATA.invoices.filter(i => i.customerName.toLowerCase() === c.name.toLowerCase());

  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content large">
        <div class="modal-header">
          <div class="modal-title">Customer Ledger: ${escapeHtml(c.name)}</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:16px;">
            <div class="panel" style="padding:12px; margin:0;">
              <div style="font-size:11px; color:var(--ink-muted);">TOTAL BILLED</div>
              <div style="font-size:18px; font-weight:700;">₹${(c.totalBilled || 0).toFixed(2)}</div>
            </div>
            <div class="panel" style="padding:12px; margin:0;">
              <div style="font-size:11px; color:var(--ink-muted);">CURRENT OUTSTANDING</div>
              <div style="font-size:18px; font-weight:700; color:${c.creditBalance > 0 ? 'var(--red)' : 'var(--green)'};">₹${(c.creditBalance || 0).toFixed(2)}</div>
            </div>
            <div class="panel" style="padding:12px; margin:0;">
              <div style="font-size:11px; color:var(--ink-muted);">INVOICES COUNT</div>
              <div style="font-size:18px; font-weight:700;">${customerInvoices.length}</div>
            </div>
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:#F8FAFC; text-align:left;">
                <th style="padding:8px;">Invoice #</th>
                <th style="padding:8px;">Date</th>
                <th style="padding:8px; text-align:right;">Billed (₹)</th>
                <th style="padding:8px; text-align:right;">Paid (₹)</th>
                <th style="padding:8px; text-align:right;">Due (₹)</th>
                <th style="padding:8px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${customerInvoices.map(inv => `
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:8px; font-family:'JetBrains Mono',monospace; font-weight:600; color:var(--primary); cursor:pointer;" onclick="viewInvoiceById('${inv.id}')">${inv.number}</td>
                  <td style="padding:8px;">${new Date(inv.date).toLocaleDateString('en-IN')}</td>
                  <td style="padding:8px; text-align:right; font-family:'JetBrains Mono',monospace;">${inv.total.toFixed(2)}</td>
                  <td style="padding:8px; text-align:right; font-family:'JetBrains Mono',monospace;">${inv.paidAmount.toFixed(2)}</td>
                  <td style="padding:8px; text-align:right; font-family:'JetBrains Mono',monospace; font-weight:600; color:${inv.balanceDue > 0 ? 'var(--red)' : 'var(--green)'};">${inv.balanceDue.toFixed(2)}</td>
                  <td style="padding:8px;"><span class="badge ${inv.status === 'PAID' ? 'badge-green' : 'badge-amber'}">${inv.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/* ---------------- 7. Expenses Module ---------------- */
function renderExpensesModule() {
  const tbody = document.getElementById('expensesTableBody');
  if (!tbody) return;

  const totalExp = DATA.expenses.reduce((s, e) => s + (e.amount || 0), 0);
  document.getElementById('expensesTotalAmount').textContent = '₹' + Math.round(totalExp).toLocaleString('en-IN');
  document.getElementById('expensesCountDisplay').textContent = `${DATA.expenses.length} expense records`;

  if (DATA.expenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--ink-muted);">No expenses recorded yet. Track operational shop costs using "+ Add Expense".</td></tr>';
    return;
  }

  tbody.innerHTML = [...DATA.expenses].reverse().map(e => `
    <tr>
      <td>${new Date(e.date).toLocaleDateString('en-IN')}</td>
      <td style="font-weight:600;">${escapeHtml(e.category)}</td>
      <td>${escapeHtml(e.description || '₹”')}</td>
      <td>${e.paymentMethod}</td>
      <td style="font-family:'JetBrains Mono',monospace; font-weight:700; color:var(--accent);">₹${e.amount.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense('${e.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddExpenseModal() {
  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Record Shop Operating Expense</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Expense Category *</label>
              <select id="expCat" style="width:100%;">
                <option value="Shop Rent">Shop Rent</option>
                <option value="Electricity / Utility">Electricity / Utility Bill</option>
                <option value="Staff Salary & Wages">Staff Salary & Wages</option>
                <option value="Freight & Transport">Freight & Transport</option>
                <option value="Shop Maintenance">Shop Maintenance</option>
                <option value="Tea & Refreshment">Tea & Refreshment</option>
                <option value="Packaging & Bags">Packaging & Bags</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount (₹) *</label>
              <input type="number" id="expAmount" min="1" step="0.5" placeholder="0.00" style="width:100%;">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input type="date" id="expDate" value="${new Date().toISOString().slice(0, 10)}">
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <select id="expMethod">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Description / Note</label>
            <input type="text" id="expDesc" placeholder="e.g. October month electricity bill" style="width:100%;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="saveExpense()">Save Expense</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function saveExpense() {
  const category = document.getElementById('expCat').value;
  const amount = parseFloat(document.getElementById('expAmount').value);
  if (isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid expense amount.');
    return;
  }
  const date = document.getElementById('expDate').value || new Date().toISOString();
  const paymentMethod = document.getElementById('expMethod').value;
  const description = document.getElementById('expDesc').value.trim();

  DATA.expenses.push({
    id: 'exp_' + Date.now(),
    date, category, amount, paymentMethod, description
  });

  await saveData();
  closeModal();
  renderExpensesModule();
  showToast('Expense recorded successfully.');
}

async function deleteExpense(id) {
  if (!confirm('Delete this expense record?')) return;
  DATA.expenses = DATA.expenses.filter(e => e.id !== id);
  await saveData();
  renderExpensesModule();
  showToast('Expense deleted.');
}

/* ---------------- 8. Invoice History & Returns ---------------- */
function renderHistoryModule() {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  const q = (document.getElementById('histSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('histStatusFilter')?.value || 'all';

  const filtered = DATA.invoices.filter(inv => {
    const matchQ = !q || inv.number.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q) || (inv.customerPhone && inv.customerPhone.includes(q));
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchQ && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--ink-muted);">No invoices match your search.</td></tr>';
    return;
  }

  tbody.innerHTML = [...filtered].reverse().map(inv => `
    <tr>
      <td style="font-family:'JetBrains Mono',monospace; font-weight:700; color:var(--primary); cursor:pointer;" onclick="viewInvoiceById('${inv.id}')">${inv.number}</td>
      <td>${new Date(inv.date).toLocaleDateString('en-IN', { dateStyle:'medium' })}</td>
      <td style="font-weight:600;">${escapeHtml(inv.customerName)}</td>
      <td style="font-family:'JetBrains Mono',monospace; font-size:12px;">${inv.customerPhone || '₹”'}</td>
      <td>${inv.items.reduce((s, i) => s + i.qty, 0)} items</td>
      <td style="font-family:'JetBrains Mono',monospace; font-weight:700;">₹${inv.total.toFixed(2)}</td>
      <td><span class="badge ${inv.status === 'PAID' ? 'badge-green' : (inv.status === 'PARTIAL' ? 'badge-amber' : 'badge-red')}">${inv.status}</span></td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm" onclick="viewInvoiceById('${inv.id}')">View / Print</button>
          <button class="btn btn-sm btn-danger" onclick="openReturnModal('${inv.id}')">Return</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function viewInvoiceById(invoiceId) {
  const inv = DATA.invoices.find(x => x.id === invoiceId);
  if (inv) showInvoiceModal(inv);
}

function openReturnModal(invoiceId) {
  const inv = DATA.invoices.find(x => x.id === invoiceId);
  if (!inv) return;

  const modalHtml = `
    <div class="modal-overlay">
      <div class="modal-content large">
        <div class="modal-header">
          <div class="modal-title">Process Sales Return ₹” ${inv.number}</div>
          <button class="btn btn-sm btn-icon" onclick="closeModal()">₹</button>
        </div>
        <div class="modal-body">
          <div style="font-size:13px; margin-bottom:12px; color:var(--ink-muted);">
            Customer: <strong>${escapeHtml(inv.customerName)}</strong> ₹ Date: ${new Date(inv.date).toLocaleDateString('en-IN')}
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:14px;">
            <thead>
              <tr style="background:#F8FAFC; text-align:left;">
                <th style="padding:8px;">Item Description</th>
                <th style="padding:8px; text-align:right;">Billed Qty</th>
                <th style="padding:8px; text-align:right;">Rate (₹)</th>
                <th style="padding:8px; text-align:center;">Return Qty</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items.map((it, idx) => `
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:8px; font-weight:600;">${escapeHtml(it.name)}</td>
                  <td style="padding:8px; text-align:right; font-family:'JetBrains Mono',monospace;">${it.qty} ${it.unit}</td>
                  <td style="padding:8px; text-align:right; font-family:'JetBrains Mono',monospace;">₹${it.price.toFixed(2)}</td>
                  <td style="padding:8px; text-align:center;">
                    <input type="number" min="0" max="${it.qty}" value="0" id="retQty_${idx}" style="width:65px; padding:4px; text-align:center;">
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="form-group">
            <label>Reason for Return</label>
            <input type="text" id="retReason" placeholder="e.g. Excess purchase, wrong size" style="width:100%;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal()">Cancel</button>
          <button class="btn btn-danger" onclick="confirmReturn('${inv.id}')">Confirm Return & Restock</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function confirmReturn(invoiceId) {
  const inv = DATA.invoices.find(x => x.id === invoiceId);
  if (!inv) return;

  let totalRefund = 0;
  const returnedItems = [];

  inv.items.forEach((it, idx) => {
    const input = document.getElementById(`retQty_${idx}`);
    const retQty = input ? parseInt(input.value) || 0 : 0;
    if (retQty > 0) {
      const refundAmt = (it.price * retQty);
      totalRefund += refundAmt;
      returnedItems.push({ productId: it.productId, name: it.name, qty: retQty, refundAmt });

      // Restore stock
      const p = DATA.products.find(x => x.id === it.productId);
      if (p) {
        p.stock += retQty;
        DATA.stockMovements.push({
          id: 'sm_' + Date.now() + Math.random(),
          date: new Date().toISOString(),
          productId: p.id,
          productName: p.name,
          changeQty: retQty,
          reason: `Sales Return on ${inv.number}`,
          balanceStock: p.stock
        });
      }
    }
  });

  if (returnedItems.length === 0) {
    showToast('Please select quantity to return.');
    return;
  }

  const reason = document.getElementById('retReason').value.trim() || 'Customer return';
  inv.returns = inv.returns || [];
  inv.returns.push({
    date: new Date().toISOString(),
    items: returnedItems,
    totalRefund,
    reason
  });

  if (inv.total - totalRefund <= 0) inv.status = 'RETURNED';

  await saveData();
  closeModal();
  renderHistoryModule();
  renderProductCatalog();
  showToast(`Return processed. ₹${totalRefund.toFixed(2)} refunded and stock replenished.`);
}

/* ---------------- 9. Reports & Profit Analytics ---------------- */
function renderReportsModule() {
  const range = document.getElementById('repTimeRange')?.value || 'thisMonth';
  const now = new Date();
  let fromDate = new Date(now.getFullYear(), now.getMonth(), 1);

  if (range === 'today') {
    fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === 'last7') {
    fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  } else if (range === 'thisMonth') {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (range === 'lastMonth') {
    fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else if (range === 'thisYear') {
    fromDate = new Date(now.getFullYear(), 0, 1);
  }

  const filteredInvoices = DATA.invoices.filter(i => new Date(i.date) >= fromDate);
  const filteredExpenses = DATA.expenses.filter(e => new Date(e.date) >= fromDate);

  const grossSales = filteredInvoices.reduce((s, i) => s + (i.total || 0), 0);
  const taxableSales = filteredInvoices.reduce((s, i) => s + (i.totalTaxable || 0), 0);
  const totalTaxCollected = filteredInvoices.reduce((s, i) => s + ((i.cgstTotal || 0) + (i.sgstTotal || 0) + (i.igstTotal || 0)), 0);

  // Calculate COGS (Cost of Goods Sold)
  let cogs = 0;
  filteredInvoices.forEach(inv => {
    inv.items.forEach(it => {
      cogs += (it.costPrice || (it.price * 0.75)) * it.qty;
    });
  });

  const grossProfit = taxableSales - cogs;
  const totalOperatingExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalOperatingExpenses;

  document.getElementById('repGrossSales').textContent = '₹' + Math.round(grossSales).toLocaleString('en-IN');
  document.getElementById('repTaxableSales').textContent = '₹' + Math.round(taxableSales).toLocaleString('en-IN');
  document.getElementById('repGstCollected').textContent = '₹' + Math.round(totalTaxCollected).toLocaleString('en-IN');
  document.getElementById('repCogs').textContent = '₹' + Math.round(cogs).toLocaleString('en-IN');
  document.getElementById('repGrossProfit').textContent = '₹' + Math.round(grossProfit).toLocaleString('en-IN');
  document.getElementById('repNetProfit').textContent = '₹' + Math.round(netProfit).toLocaleString('en-IN');
  document.getElementById('repOperatingExpenses').textContent = '₹' + Math.round(totalOperatingExpenses).toLocaleString('en-IN');

  // Render Top 5 Products Table
  const prodMap = {};
  filteredInvoices.forEach(inv => {
    inv.items.forEach(it => {
      if (!prodMap[it.name]) prodMap[it.name] = { qty: 0, revenue: 0 };
      prodMap[it.name].qty += it.qty;
      prodMap[it.name].revenue += it.total;
    });
  });

  const topProducts = Object.entries(prodMap).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const topProdBox = document.getElementById('repTopProducts');
  if (topProdBox) {
    if (topProducts.length === 0) {
      topProdBox.innerHTML = '<div style="padding:16px; color:var(--ink-muted);">No product sales recorded in this period.</div>';
    } else {
      topProdBox.innerHTML = topProducts.map(([name, data]) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dotted var(--border);">
          <div>
            <div style="font-weight:600; font-size:13px;">${escapeHtml(name)}</div>
            <div style="font-size:11px; color:var(--ink-muted);">${data.qty} units sold</div>
          </div>
          <div style="font-family:var(--font-mono); font-weight:700; color:var(--primary);">₹${data.revenue.toFixed(2)}</div>
        </div>
      `).join('');
    }
  }
}

/* ---------------- 10. Settings & Backup ---------------- */
function renderSettingsModule() {
  document.getElementById('cfgShopName').value = DATA.shopInfo.name || '';
  document.getElementById('cfgShopTag').value = DATA.shopInfo.tag || '';
  document.getElementById('cfgPhone').value = DATA.shopInfo.phone || '';
  document.getElementById('cfgEmail').value = DATA.shopInfo.email || '';
  document.getElementById('cfgAddress1').value = DATA.shopInfo.address1 || '';
  document.getElementById('cfgAddress2').value = DATA.shopInfo.address2 || '';
  document.getElementById('cfgCity').value = DATA.shopInfo.city || '';
  document.getElementById('cfgState').value = DATA.shopInfo.state || 'Tamil Nadu';
  document.getElementById('cfgStateCode').value = DATA.shopInfo.stateCode || '33';
  document.getElementById('cfgGstin').value = DATA.shopInfo.gstin || '';
  document.getElementById('cfgBankName').value = DATA.shopInfo.bankName || '';
  document.getElementById('cfgAccount').value = DATA.shopInfo.bankAccount || '';
  document.getElementById('cfgIfsc').value = DATA.shopInfo.bankIfsc || '';
  document.getElementById('cfgUpi').value = DATA.shopInfo.upiId || '';
  document.getElementById('cfgPrefix').value = DATA.shopInfo.invoicePrefix || 'MPH-';
  document.getElementById('cfgPaperSize').value = DATA.shopInfo.printPaperSize || 'A4';
  document.getElementById('cfgTerms').value = DATA.shopInfo.defaultTerms || '';

  renderSnapshotsManager();
}

async function saveShopSettings() {
  DATA.shopInfo.name = document.getElementById('cfgShopName').value.trim();
  DATA.shopInfo.tag = document.getElementById('cfgShopTag').value.trim();
  DATA.shopInfo.phone = document.getElementById('cfgPhone').value.trim();
  DATA.shopInfo.email = document.getElementById('cfgEmail').value.trim();
  DATA.shopInfo.address1 = document.getElementById('cfgAddress1').value.trim();
  DATA.shopInfo.address2 = document.getElementById('cfgAddress2').value.trim();
  DATA.shopInfo.city = document.getElementById('cfgCity').value.trim();
  DATA.shopInfo.state = document.getElementById('cfgState').value.trim();
  DATA.shopInfo.stateCode = document.getElementById('cfgStateCode').value.trim();
  DATA.shopInfo.gstin = document.getElementById('cfgGstin').value.trim().toUpperCase();
  DATA.shopInfo.bankName = document.getElementById('cfgBankName').value.trim();
  DATA.shopInfo.bankAccount = document.getElementById('cfgAccount').value.trim();
  DATA.shopInfo.bankIfsc = document.getElementById('cfgIfsc').value.trim().toUpperCase();
  DATA.shopInfo.upiId = document.getElementById('cfgUpi').value.trim();
  DATA.shopInfo.invoicePrefix = document.getElementById('cfgPrefix').value.trim() || 'MPH-';
  DATA.shopInfo.printPaperSize = document.getElementById('cfgPaperSize').value;
  DATA.shopInfo.defaultTerms = document.getElementById('cfgTerms').value.trim();

  await saveData();
  showToast('Settings saved successfully.');
}

function exportFullBackupJSON() {
  const json = JSON.stringify(DATA, null, 2);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadBlob(json, `maheswari_billing_backup_${stamp}.json`, 'application/json');
  showToast('Full JSON backup downloaded.');
}

function triggerImportBackup() {
  document.getElementById('importBackupFileInput').click();
}

function handleBackupFileRestore(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON backup file.');
      if (!confirm('Restoring this backup will replace current products, invoices, and settings. A safeguard snapshot of your current data will be created first. Proceed?')) {
        input.value = '';
        return;
      }
      createSnapshot('Pre-restore safeguard snapshot', 'pre-restore');
      DATA = migrateData(parsed);
      await saveData();
      switchTab('dashboard');
      showToast('Backup restored successfully!');
    } catch (err) {
      showToast('Failed to restore backup: ' + err.message);
    }
    input.value = '';
  };
  reader.readAsText(file);
}

function renderSnapshotsManager() {
  const box = document.getElementById('snapshotsList');
  if (!box) return;
  const list = readSnapshots().slice().reverse();

  if (list.length === 0) {
    box.innerHTML = '<div style="font-size:12px; color:var(--ink-muted); padding:10px 0;">No local snapshots yet. Snapshots are created automatically before major actions.</div>';
    return;
  }

  box.innerHTML = list.map(sn => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dotted var(--border); font-size:12.5px;">
      <div>
        <div style="font-weight:600;">${escapeHtml(sn.label)}</div>
        <div style="font-size:11px; color:var(--ink-muted); font-family:var(--font-mono);">${new Date(sn.ts).toLocaleString('en-IN')}'₹'${sn.invoices} bills'₹'${sn.products} items</div>
      </div>
      <button class="btn btn-sm" onclick="restoreSnapshot('${sn.id}')">Restore</button>
    </div>
  `).join('');
}

async function restoreSnapshot(snapshotId) {
  const snaps = readSnapshots();
  const sn = snaps.find(s => s.id === snapshotId);
  if (!sn) return;
  if (!confirm(`Restore snapshot "${sn.label}" from ${new Date(sn.ts).toLocaleString('en-IN')}?`)) return;

  createSnapshot('Before restoring snapshot', 'pre-restore');
  DATA = migrateData(JSON.parse(sn.data));
  await saveData();
  switchTab('dashboard');
  showToast('Snapshot restored.');
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------- App Initialization ---------------- */
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initNavigation();
  switchTab('dashboard');

  // Search listeners
  document.getElementById('posSearchInput')?.addEventListener('input', renderProductCatalog);
  document.getElementById('invSearchInput')?.addEventListener('input', renderInventoryModule);
  document.getElementById('invCategoryFilter')?.addEventListener('change', renderInventoryModule);
  document.getElementById('invStockFilter')?.addEventListener('change', renderInventoryModule);
  document.getElementById('custSearchInput')?.addEventListener('input', renderCustomersModule);
  document.getElementById('histSearchInput')?.addEventListener('input', renderHistoryModule);
  document.getElementById('histStatusFilter')?.addEventListener('change', renderHistoryModule);
  document.getElementById('repTimeRange')?.addEventListener('change', renderReportsModule);

  // Category filter chips in POS
  document.querySelectorAll('.category-chips .chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.category-chips .chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      renderProductCatalog();
    });
  });
});

