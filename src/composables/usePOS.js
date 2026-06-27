import { ref, computed, watch } from 'vue';
import { products, stores, purchaseFIFOStock } from '@/utils/supplier_db.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const POS_STORAGE_KEY = 'secure_pos_register_v1';

// Default schema for local storage
const defaultState = {
  session: {
    isOpen: false,
    openedAt: null,
    closedAt: null,
    openingBalance: 0,
    storeId: null,
    cashierName: 'Jean Dupont',
    cashierId: 'usr_techsupp_mgr',
    sessionSales: 0
  },
  cart: {
    items: [],
    customerPhone: '',
    customerName: '',
    globalDiscountType: 'none', // 'none', 'percentage', 'fixed'
    globalDiscountValue: 0
  },
  splitPayments: [],
  vouchers: [
    // pre-seed some credit vouchers (avoirs) for demo convenience
    { code: 'AV-9810-DF', amount: 5000, clientPhone: '699223344', status: 'unused', date: '2026-06-10' },
    { code: 'AV-3402-XS', amount: 15000, clientPhone: '677889900', status: 'unused', date: '2026-06-15' }
  ],
  transactions: [
    // pre-seed a couple of finished transactions
    {
      id: 'TX-20260618-001',
      date: '2026-06-18T05:12:00Z',
      storeId: 'store_1',
      cashierId: 'usr_techsupp_mgr',
      items: [
        { productId: 'prod_1', name: 'Poivre Blanc de Penja Premium - Lot Standard', sku: 'CMR-PROD-AGR-0001', qty: 2, price: 12000, discountType: 'none', discountValue: 0, total: 24000 }
      ],
      subtotalHT: 24000,
      discount: 0,
      tax: 4620, // 19.25% of 24000
      totalTTC: 28620,
      payments: [{ method: 'cash', amount: 30000, memo: '' }],
      change: 1380,
      returnedItems: [],
      vouchersIssued: []
    }
  ],
  lastReceipt: null
};

// Internal reactive states
const savedPOS = localStorage.getItem(POS_STORAGE_KEY);
const parsedPOS = savedPOS ? JSON.parse(savedPOS) : defaultState;

// Sync issues: make sure defaults exist
if (!parsedPOS.vouchers) parsedPOS.vouchers = defaultState.vouchers;
if (!parsedPOS.transactions) parsedPOS.transactions = defaultState.transactions;
if (!parsedPOS.lastReceipt) parsedPOS.lastReceipt = null;
if (!parsedPOS.cart || Array.isArray(parsedPOS.cart) || !parsedPOS.cart.items) {
  parsedPOS.cart = {
    items: [],
    customerPhone: '',
    customerName: '',
    globalDiscountType: 'none',
    globalDiscountValue: 0
  };
}

export const session = ref(parsedPOS.session);
export const cart = ref(parsedPOS.cart);
export const splitPayments = ref(parsedPOS.splitPayments);
export const vouchers = ref(parsedPOS.vouchers);
export const transactions = ref(parsedPOS.transactions);
export const lastReceipt = ref(parsedPOS.lastReceipt);

// Sync with LocalStorage automatically
watch(
  [session, cart, splitPayments, vouchers, transactions, lastReceipt],
  () => {
    const data = {
      session: session.value,
      cart: cart.value,
      splitPayments: splitPayments.value,
      vouchers: vouchers.value,
      transactions: transactions.value,
      lastReceipt: lastReceipt.value
    };
    localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(data));
  },
  { deep: true }
);

// Get current selected store
export const currentStore = computed(() => {
  if (!session.value.storeId) return null;
  return stores.value.find(s => s.id === session.value.storeId) || null;
});

// CART CALCULATIONS
export const cartSubtotalHT = computed(() => {
  return cart.value.items.reduce((sum, item) => {
    let itemSubTotal = item.price * item.qty;
    if (item.discountType === 'percentage') {
      itemSubTotal -= (itemSubTotal * (item.discountValue / 100));
    } else if (item.discountType === 'fixed') {
      itemSubTotal -= (item.discountValue * item.qty);
    }
    return sum + Math.max(0, itemSubTotal);
  }, 0);
});

export const cartDiscountAmount = computed(() => {
  const sub = cartSubtotalHT.value;
  if (cart.value.globalDiscountType === 'percentage') {
    return sub * (cart.value.globalDiscountValue / 100);
  } else if (cart.value.globalDiscountType === 'fixed') {
    return Math.min(sub, cart.value.globalDiscountValue);
  }
  return 0;
});

export const cartHTAfterDiscount = computed(() => {
  return Math.max(0, cartSubtotalHT.value - cartDiscountAmount.value);
});

export const cartTaxAmount = computed(() => {
  // Cameroon VAT is 19.25%
  return cartHTAfterDiscount.value * 0.1925;
});

export const cartTotalTTC = computed(() => {
  return cartHTAfterDiscount.value + cartTaxAmount.value;
});

// METHODS

// Register controls
export function openRegister(storeId, openingBalance, cashierName = 'Jean Dupont') {
  session.value.isOpen = true;
  session.value.openedAt = new Date().toISOString();
  session.value.closedAt = null;
  session.value.openingBalance = parseFloat(openingBalance) || 0;
  session.value.storeId = storeId;
  session.value.cashierName = cashierName;
  session.value.sessionSales = 0;
  
  // Clear any active cart and payments
  clearCart();
  
  toast.success(`Caisse ouverte avec succès pour le magasin.`);
}

export function closeRegister() {
  session.value.isOpen = false;
  session.value.closedAt = new Date().toISOString();
  toast.success('La caisse a été fermée. Rapport de caisse (Z) disponible.');
}

// Cart Controls
export function addToCart(product, qty = 1) {
  if (!session.value.isOpen) {
    toast.error('La caisse est fermée ! Ouvrez la caisse d’abord.');
    return;
  }
  
  // Check products stock
  const dbProd = products.value.find(p => p.id === product.id);
  if (!dbProd || dbProd.stock <= 0) {
    toast.error('Produit en rupture de stock mécanique !');
    return;
  }

  const existing = cart.value.items.find(item => item.productId === product.id);
  
  if (existing) {
    const totalQty = existing.qty + qty;
    if (totalQty > dbProd.stock) {
      toast.error(`Stock insuffisant. Disponible: ${dbProd.stock}`);
      return;
    }
    existing.qty = totalQty;
  } else {
    if (qty > dbProd.stock) {
      toast.error(`Stock insuffisant. Disponible: ${dbProd.stock}`);
      return;
    }
    cart.value.items.push({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      qty: qty,
      price: product.price,
      discountType: 'none',
      discountValue: 0
    });
  }
  toast.success(`${product.name} ajouté au panier.`);
}

export function updateCartQty(productId, qty) {
  const dbProd = products.value.find(p => p.id === productId);
  const item = cart.value.items.find(i => i.productId === productId);
  if (!item) return;

  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (dbProd && qty > dbProd.stock) {
    toast.error(`Stock insuffisant dans le stock global ! Max: ${dbProd.stock}`);
    item.qty = dbProd.stock;
    return;
  }

  item.qty = qty;
}

export function removeFromCart(productId) {
  cart.value.items = cart.value.items.filter(item => item.productId !== productId);
}

export function setItemDiscount(productId, type, value) {
  const item = cart.value.items.find(i => i.productId === productId);
  if (!item) return;
  item.discountType = type;
  item.discountValue = parseFloat(value) || 0;
}

export function applyCartGlobalDiscount(type, value) {
  cart.value.globalDiscountType = type;
  cart.value.globalDiscountValue = parseFloat(value) || 0;
}

export function clearCart() {
  cart.value.items = [];
  cart.value.customerPhone = '';
  cart.value.customerName = '';
  cart.value.globalDiscountType = 'none';
  cart.value.globalDiscountValue = 0;
  splitPayments.value = [];
}

// Payment split controls
export function addPaymentSplit(method, amount, memo = '') {
  splitPayments.value.push({
    id: Date.now().toString(),
    method, // 'cash', 'card', 'momo' (Mobile Money), 'voucher' (Avoir)
    amount: parseFloat(amount) || 0,
    memo
  });
}

export function removePaymentSplit(id) {
  splitPayments.value = splitPayments.value.filter(p => p.id !== id);
}

// Credit Voucher (Avoir) Controls
export function generateVoucher(amount, phone = '') {
  const code = 'AV-' + Math.floor(1000 + Math.random() * 9000) + '-' + ['X', 'W', 'Y', 'Z'][Math.floor(Math.random() * 4)] + ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
  const newVoucher = {
    code,
    amount: Math.round(amount),
    clientPhone: phone,
    status: 'unused',
    date: new Date().toISOString().split('T')[0]
  };
  vouchers.value.push(newVoucher);
  return newVoucher;
}

export function claimVoucher(code) {
  const vc = vouchers.value.find(v => v.code.toUpperCase() === code.toUpperCase() && v.status === 'unused');
  if (!vc) {
    return { success: false, message: 'Avoir non valide ou déjà réclamé.' };
  }
  return { success: true, voucher: vc };
}

// Complete checkout with FIFO deduction & logging
export function checkoutTransaction() {
  if (cart.value.items.length === 0) {
    toast.error("Le panier est vide!");
    return false;
  }

  const ttc = cartTotalTTC.value;
  const payTotal = splitPayments.value.reduce((sum, p) => sum + p.amount, 0);

  // If we have cash + other payments, calculate change
  const cashPayments = splitPayments.value.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0);
  const nonCashPayments = splitPayments.value.filter(p => p.method !== 'cash').reduce((sum, p) => sum + p.amount, 0);
  
  if (payTotal < ttc) {
    toast.error(`Paiement incomplet. Total requis: ${Math.round(ttc)} FCFA, Payé: ${Math.round(payTotal)} FCFA`);
    return false;
  }

  // Deduct products from global FIFO stocks
  let fifoBreakdown = [];
  for (let item of cart.value.items) {
    // Call the database function to trigger real physical batch deduction
    const fifoResult = purchaseFIFOStock(item.productId, item.qty);
    if (!fifoResult || !fifoResult.success) {
      toast.error(`Echec FIFO sur ${item.name}. Stock indisponible d'origine.`);
      return false;
    }
    fifoBreakdown.push({
      productId: item.productId,
      qty: item.qty,
      details: fifoResult.consumedDetails
    });
  }

  // Calculate change (only cash can produce change, cap others as non-refundable in cash)
  const totalChange = Math.max(0, payTotal - ttc);

  // Mark claimed vouchers as used
  for (let payment of splitPayments.value) {
    if (payment.method === 'voucher') {
      const code = payment.memo; // Contains the voucher code
      const vc = vouchers.value.find(v => v.code.toUpperCase() === code.toUpperCase());
      if (vc) {
        vc.status = 'redeemed';
        vc.redeemedAt = new Date().toISOString();
      }
    }
  }

  // Assemble TX log
  const txId = 'TX-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
  
  const formattedItems = cart.value.items.map(item => {
    let itemSub = item.price * item.qty;
    let netPrice = item.price;
    if (item.discountType === 'percentage') {
      netPrice = item.price * (1 - item.discountValue / 100);
    } else if (item.discountType === 'fixed') {
      netPrice = item.price - item.discountValue;
    }
    return {
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      qty: item.qty,
      price: item.price,
      netPrice: netPrice,
      discountType: item.discountType,
      discountValue: item.discountValue,
      total: netPrice * item.qty
    };
  });

  const activeTx = {
    id: txId,
    date: new Date().toISOString(),
    storeId: session.value.storeId,
    cashierId: session.value.cashierId,
    cashierName: session.value.cashierName,
    items: formattedItems,
    fifoBreakdown: fifoBreakdown,
    subtotalHT: cartSubtotalHT.value,
    discount: cartDiscountAmount.value,
    tax: cartTaxAmount.value,
    totalTTC: ttc,
    payments: splitPayments.value.map(p => ({ method: p.method, amount: p.amount, memo: p.memo })),
    change: totalChange,
    customerName: cart.value.customerName || 'Client Comptant',
    customerPhone: cart.value.customerPhone || '',
    returnedItems: []
  };

  transactions.value.unshift(activeTx);
  lastReceipt.value = activeTx;
  session.value.sessionSales += ttc;

  // Reset checkout session variables
  clearCart();
  toast.success(`Dossier de vente validé sous ${txId}. Impression prête.`);
  return true;
}

// Process product Return (Refund)
export function processReturn(transactionId, productId, qtyToReturn, refundMethod) {
  const tx = transactions.value.find(t => t.id === transactionId);
  if (!tx) {
    toast.error("Transaction introuvable !");
    return false;
  }

  const txItem = tx.items.find(i => i.productId === productId);
  if (!txItem) {
    toast.error("Produit introuvable dans cette vente.");
    return false;
  }

  // Math remaining qty to return
  const returnedRecord = tx.returnedItems.find(r => r.productId === productId);
  const alreadyReturned = returnedRecord ? returnedRecord.qty : 0;
  
  if (qtyToReturn > (txItem.qty - alreadyReturned)) {
    toast.error(`Quantité invalide. Déjà retourné: ${alreadyReturned}, Max possible: ${txItem.qty - alreadyReturned}`);
    return false;
  }

  // Update return record
  if (returnedRecord) {
    returnedRecord.qty += qtyToReturn;
  } else {
    tx.returnedItems.push({
      productId,
      name: txItem.name,
      sku: txItem.sku,
      qty: qtyToReturn,
      returnedAt: new Date().toISOString()
    });
  }

  // Calculate refund value (pro-rated based on purchase net price + pro-rated TVAC)
  const itemNetWithVAT = txItem.netPrice * 1.1925;
  const totalRefundAmount = Math.round(itemNetWithVAT * qtyToReturn);

  // Return stock to product's global warehouse FIFO batches in the database
  const dbProd = products.value.find(p => p.id === productId);
  if (dbProd) {
    dbProd.stock += qtyToReturn;
    // Add quantity back to the newest batch or create a returned batch
    if (!dbProd.batches) dbProd.batches = [];
    const returnBatch = dbProd.batches.find(b => b.id === 'b_return');
    if (returnBatch) {
      returnBatch.qty += qtyToReturn;
    } else {
      dbProd.batches.push({
        id: 'b_return',
        date: new Date().toISOString().split('T')[0],
        qty: qtyToReturn,
        initialQty: qtyToReturn,
        price: txItem.price * 0.90 // estimated cost of returned goods
      });
    }
  }

  let finalActionMessage = '';
  // Handle Refund Mode
  if (refundMethod === 'voucher') {
    // Issue Avoir credit note
    const code = 'AV-' + Math.floor(1000 + Math.random() * 9000) + '-RT';
    const newVc = {
      code,
      amount: totalRefundAmount,
      clientPhone: tx.customerPhone || '650000000',
      status: 'unused',
      date: new Date().toISOString().split('T')[0],
      isReturnCredit: true,
      origTxId: tx.id
    };
    vouchers.value.push(newVc);
    finalActionMessage = `Avoir généré : ${code} pour un montant de ${totalRefundAmount} FCFA.`;
  } else {
    // Paid in cash or other
    finalActionMessage = `Remboursement direct de ${totalRefundAmount} FCFA validé.`;
  }

  toast.success(`Retour enregistré pour ${qtyToReturn} x ${txItem.name}. ${finalActionMessage}`);
  return { success: true, refundAmount: totalRefundAmount };
}
