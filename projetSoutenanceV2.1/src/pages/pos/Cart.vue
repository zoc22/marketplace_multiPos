<template>
  <div class="space-y-6 font-mono select-none">
    
    <!-- SUBHEADER ROW -->
    <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl flex justify-between items-center">
      <div>
        <h1 class="text-sm font-bold uppercase text-emerald-100 tracking-wider">Panier Détaillé</h1>
        <p class="text-[9.5px] text-zinc-500">Validation des remises unitaires, taxes de Douala et quantités B2B.</p>
      </div>

      <router-link 
        to="/pos" 
        class="px-3 py-1.5 bg-black border border-emerald-950 text-emerald-400 hover:text-white rounded text-xs hover:border-emerald-700 transition"
      >
        &larr; Écran Grille
      </router-link>
    </div>

    <!-- MAIN BODY -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- ITEMS TABLE LIST -->
      <div class="lg:col-span-2 bg-[#020503] border border-emerald-950/60 rounded-xl overflow-hidden p-4 space-y-4">
        
        <h3 class="text-xs font-bold text-emerald-500 uppercase tracking-widest pb-1 border-b border-emerald-950/60">
          Articles en File de Caisse
        </h3>

        <div v-if="cart.items.length === 0" class="text-center py-16">
          <span class="text-2xl">🛒</span>
          <p class="text-xs text-zinc-500 mt-2">Votre panier est vide. Ajoutez des produits depuis le catalogue.</p>
          <router-link to="/pos" class="mt-4 inline-block text-xs text-emerald-400 underline uppercase font-bold hover:text-emerald-300">
            Fouiller le Magasin !
          </router-link>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr class="border-b border-emerald-950 text-zinc-550 text-[10px] uppercase font-bold">
                <th class="pb-2">Désignation Produit</th>
                <th class="pb-2 text-center">Quantité</th>
                <th class="pb-2 text-right">Prix Unit</th>
                <th class="pb-2 text-center">Remise Offre</th>
                <th class="pb-2 text-right">Total Net</th>
                <th class="pb-2 text-center"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-950">
              <tr v-for="item in cart.items" :key="item.productId" class="hover:bg-[#07130b]/20">
                <td class="py-3">
                  <span class="font-bold text-zinc-200 block">{{ item.name }}</span>
                  <span class="text-[9px] text-[#2c5b46] font-mono uppercase">SKU: {{ item.sku }}</span>
                </td>
                <td class="py-3 text-center">
                  <div class="inline-flex items-center space-x-1.5">
                    <button 
                      @click="decreaseQty(item)"
                      class="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded hover:bg-zinc-900 text-zinc-400 font-bold"
                    >
                      -
                    </button>
                    <span class="font-bold text-emerald-400 w-8 inline-block text-center">{{ item.qty }}</span>
                    <button 
                      @click="increaseQty(item)"
                      class="px-2 py-0.5 bg-zinc-950 border border-zinc-900 rounded hover:bg-zinc-900 text-zinc-400 font-bold"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="py-3 text-right font-semibold">
                  {{ Math.round(item.price).toLocaleString() }} ₣
                </td>
                <td class="py-3 text-center">
                  <div class="flex items-center justify-center space-x-1 text-[10px]">
                    <select 
                      v-model="item.discountType"
                      class="bg-black border border-zinc-900 text-[10px] text-zinc-400 rounded p-1"
                    >
                      <option value="none">S/R</option>
                      <option value="percentage">%</option>
                      <option value="fixed">Flat</option>
                    </select>
                    
                    <input 
                      v-if="item.discountType !== 'none'"
                      type="number" 
                      min="0"
                      v-model.number="item.discountValue"
                      class="w-12 bg-black border border-zinc-800 text-zinc-200 text-center rounded p-0.5 font-bold"
                    />
                  </div>
                </td>
                <td class="py-3 text-right font-bold text-[#10b981]">
                  {{ Math.round(getItemNetTotal(item)).toLocaleString() }} ₣
                </td>
                <td class="py-3 text-center">
                  <button 
                    @click="removeFromCart(item.productId)"
                    class="text-red-500 hover:text-red-400 font-bold px-1"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- RIGHT SIDE: DISCOUNTS SUMMARY & PROMPT -->
      <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl space-y-6">
        
        <h3 class="text-xs font-bold text-emerald-500 uppercase tracking-widest pb-1 border-b border-emerald-950/60">
          Bilan Comptable
        </h3>

        <!-- GLOBAL DISCOUNTS CONFIG -->
        <div class="p-3 bg-[#07130b]/20 border border-[#1e462c]/40 rounded-lg space-y-3">
          <h4 class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Bordereau De Remise Globale</h4>
          <p class="text-[9px] text-zinc-650 leading-tight">Appliquer un abattement commercial sur la totalité de la transaction POS.</p>
          
          <div class="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label class="block text-zinc-650 uppercase mb-0.5 font-bold">Type Remise</label>
              <select 
                v-model="cart.globalDiscountType"
                class="w-full bg-black border border-zinc-900 rounded p-1.5 text-zinc-300 font-bold"
              >
                <option value="none">Aucune Remise</option>
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant Fixe (FCFA)</option>
              </select>
            </div>
            <div>
              <label class="block text-zinc-650 uppercase mb-0.5 font-bold">Valeur Remise</label>
              <input 
                type="number" 
                min="0"
                v-model.number="cart.globalDiscountValue"
                placeholder="Ex: 5"
                class="w-full bg-black border border-zinc-900 rounded p-1.5 text-emerald-400 font-bold text-center"
                :disabled="cart.globalDiscountType === 'none'"
              />
            </div>
          </div>
        </div>

        <!-- TOTALS BLOCK -->
        <div class="space-y-3 pt-2 text-xs">
          <div class="flex justify-between items-center text-zinc-500">
            <span>Somme brute (HT cumulé) :</span>
            <span class="font-bold text-zinc-300">{{ cartSubtotalHT.toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-red-400 text-[11px]" v-if="cartDiscountAmount > 0">
            <span>Abattement Remise globale :</span>
            <span>- {{ cartDiscountAmount.toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-zinc-550">
            <span>Base Imposable (HT Net) :</span>
            <span class="font-bold text-zinc-350">{{ cartHTAfterDiscount.toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-zinc-500">
            <span>TVA Réglementaire (19.25%) :</span>
            <span class="font-bold text-zinc-350">{{ Math.round(cartTaxAmount).toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-base font-bold pt-3 border-t border-emerald-950/80">
            <span class="text-emerald-100 uppercase text-xs tracking-wider">VALEUR FINALE TTC :</span>
            <span class="text-emerald-450 text-[15px]">
              {{ Math.round(cartTotalTTC).toLocaleString() }} FCFA
            </span>
          </div>
        </div>

        <!-- ACTIONS BUTTONS -->
        <div class="space-y-3 pt-3">
          <button 
            @click="goToPaymentPage"
            :disabled="cart.items.length === 0"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold uppercase tracking-widest text-white text-xs rounded transition disabled:opacity-50"
          >
            VALIDER ET ENCAISSER &raquo;
          </button>
          
          <button 
            @click="clearActiveCart"
            v-if="cart.items.length > 0"
            class="w-full py-2 bg-red-950/30 text-red-500 hover:bg-red-950 border border-red-950 rounded text-xs uppercase font-bold tracking-wider transition"
          >
            Annihiler Le Panier
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { 
  cart, 
  updateCartQty,
  removeFromCart,
  cartSubtotalHT,
  cartDiscountAmount,
  cartHTAfterDiscount,
  cartTaxAmount,
  cartTotalTTC
} from '@/composables/usePOS.js';

const router = useRouter();
const toast = useToast();

function decreaseQty(item) {
  updateCartQty(item.productId, item.qty - 1);
}

function increaseQty(item) {
  updateCartQty(item.productId, item.qty + 1);
}

function getItemNetTotal(item) {
  let sub = item.price * item.qty;
  if (item.discountType === 'percentage') {
    sub -= (sub * (item.discountValue / 100));
  } else if (item.discountType === 'fixed') {
    sub -= (item.discountValue * item.qty);
  }
  return Math.max(0, sub);
}

function clearActiveCart() {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser le panier ?")) {
    cart.value.items = [];
    cart.value.customerPhone = '';
    cart.value.customerName = '';
    cart.value.globalDiscountType = 'none';
    cart.value.globalDiscountValue = 0;
    toast.warning("Panier détruit.");
  }
}

function goToPaymentPage() {
  router.push('/pos/payment');
}
</script>
