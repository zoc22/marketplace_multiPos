const fs = require('fs');
let content = fs.readFileSync('c:/wamp64/www/projetSoutenanceV2.1/src/pages/public/Products.vue', 'utf8');

// 1. Make card clickable and fix font sizes
content = content.replace(
  /class="bg-\[var\(--color-surface-elevated\)\] border border-\[var\(--color-border\)\] rounded-2xl overflow-hidden hover:-translate-y-2/g,
  'class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:-translate-y-2 cursor-pointer" @click="openQuickView(prod)'
);

// 2. Stop propagation on action buttons
content = content.replace(/@click="cartStore\.toggleCompare\(prod\)"/g, '@click.stop="cartStore.toggleCompare(prod)"');
content = content.replace(/@click="cartStore\.toggleWishlist\(prod\)"/g, '@click.stop="cartStore.toggleWishlist(prod)"');
content = content.replace(/@click="addPromoWithQuantity\(prod, 1\)"/g, '@click.stop="addPromoWithQuantity(prod, 1)"');

// 3. Increase font sizes in product card
content = content.replace(/text-\[9px\] uppercase font-mono text-\[var\(--color-text-tertiary\)\] block">B2B Base Lot cost/g, 'text-xs uppercase font-bold text-[var(--color-text-secondary)] block mb-1">B2B Base Lot cost');
content = content.replace(/text-emerald-400 font-extrabold text-\[15px\]/g, 'text-emerald-500 font-black text-xl');
content = content.replace(/text-\[9px\] uppercase font-mono text-\[var\(--color-text-tertiary\)\] block">Escrow Stock/g, 'text-xs uppercase font-bold text-[var(--color-text-secondary)] block mb-1">Escrow Stock');
content = content.replace(/text-base font-mono font-bold/g, 'text-xl font-mono font-black');
content = content.replace(/text-\[9\.5px\] font-mono text-\[var\(--color-text-secondary\)\] block mt-0\.5/g, 'text-xs font-mono text-[var(--color-text-tertiary)] block mt-1 font-bold');
content = content.replace(/text-\[10px\] text-\[var\(--color-text-tertiary\)\]/g, 'text-xs text-[var(--color-text-secondary)]');

// 4. Increase QuickView Modal size
content = content.replace(/max-w-3xl w-full/g, 'max-w-5xl w-full');

// Write back
fs.writeFileSync('c:/wamp64/www/projetSoutenanceV2.1/src/pages/public/Products.vue', content);
console.log('Done replacing font sizes and interactions.');
