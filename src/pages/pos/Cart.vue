<template>
  <div class="space-y-6 font-mono select-none text-slate-100 animate-slide-up">
    
    <!-- SUBHEADER ROW -->
    <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl flex justify-between items-center relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
      <div>
        <h1 class="text-sm font-bold uppercase text-slate-200 tracking-wider">Panier Détaillé</h1>
        <p class="text-[9.5px] text-slate-500 font-mono">Validation des remises unitaires, taxes de Douala et quantités B2B.</p>
      </div>

      <router-link 
        to="/pos" 
        class="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs hover:border-slate-700 transition flex items-center gap-1.5"
      >
        <ArrowLeftIcon class="w-3.5 h-3.5" />
        <span>Écran Grille</span>
      </router-link>
    </div>

    <!-- MAIN BODY -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- ITEMS TABLE LIST -->
      <div class="lg:col-span-2 bg-[#14141E] border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
        
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-800 flex items-center gap-2">
          <ShoppingCartIcon class="w-4 h-4 text-emerald-500" />
          <span>Articles en File de Caisse</span>
        </h3>

        <div v-if="cart.items.length === 0" class="text-center py-20 space-y-4">
          <div class="flex justify-center">
            <span class="p-4 bg-slate-950 text-slate-600 rounded-full border border-slate-850">
              <ShoppingCartIcon class="w-8 h-8" />
            </span>
          </div>
          <p class="text-xs text-slate-500">Votre panier est vide. Ajoutez des produits depuis le catalogue.</p>
          <router-link to="/pos" class="mt-4 inline-flex items-center gap-1 text-xs text-[#C8A96E] hover:text-[#e5c283] underline uppercase font-bold transition">
            Fouiller le Magasin !
          </router-link>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-350">
            <thead>
              <tr class="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                <th class="pb-3">Désignation Produit</th>
                <th class="pb-3 text-center">Quantité</th>
                <th class="pb-3 text-right">Prix Unit</th>
                <th class="pb-3 text-center">Remise Offre</th>
                <th class="pb-3 text-right">Total Net</th>
                <th class="pb-3 text-center"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-900">
              <tr v-for="item in cart.items" :key="item.productId" class="hover:bg-slate-950/40 transition-colors">
                <td class="py-4 pr-2">
                  <span class="font-bold text-slate-200 block">{{ item.name }}</span>
                  <span class="text-[9px] text-slate-500 font-mono uppercase">SKU: {{ item.sku }}</span>
                </td>
                <td class="py-4 text-center">
                  <div class="inline-flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                    <button 
                      @click="decreaseQty(item)"
                      class="w-6 h-6 flex items-center justify-center bg-slate-900 border border-slate-800 rounded hover:bg-slate-850 hover:text-white text-slate-400 font-bold transition"
                    >
                      -
                    </button>
                    <span class="font-bold text-emerald-450 w-8 inline-block text-center">{{ item.qty }}</span>
                    <button 
                      @click="increaseQty(item)"
                      class="w-6 h-6 flex items-center justify-center bg-slate-900 border border-slate-800 rounded hover:bg-slate-850 hover:text-white text-slate-400 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="py-4 text-right font-semibold text-slate-300">
                  {{ Math.round(item.price).toLocaleString() }} ₣
                </td>
                <td class="py-4 text-center">
                  <div class="flex items-center justify-center space-x-1.5 text-[10px]">
                    <select 
                      v-model="item.discountType"
                      class="bg-slate-950 border border-slate-850 text-[10px] text-slate-400 rounded-lg p-1.5 focus:outline-none focus:border-slate-700"
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
                      class="w-14 bg-slate-950 border border-slate-800 text-slate-200 text-center rounded-lg p-1 font-bold focus:outline-none focus:border-slate-700"
                    />
                  </div>
                </td>
                <td class="py-4 text-right font-bold text-emerald-400">
                  {{ Math.round(getItemNetTotal(item)).toLocaleString() }} ₣
                </td>
                <td class="py-4 text-center">
                  <button 
                    @click="removeFromCart(item.productId)"
                    class="text-red-500 hover:text-red-400 font-bold p-1 bg-red-950/20 border border-red-900/30 hover:border-red-500/50 rounded-lg transition"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- RIGHT SIDE: DISCOUNTS SUMMARY & PROMPT -->
      <div class="bg-[#14141E] border border-slate-800 p-5 rounded-2xl space-y-6">
        
        <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-800">
          Bilan Comptable
        </h3>

        <!-- GLOBAL DISCOUNTS CONFIG -->
        <div class="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
          <h4 class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bordereau De Remise Globale</h4>
          <p class="text-[9px] text-slate-500 leading-tight">Appliquer un abattement commercial sur la totalité de la transaction POS.</p>
          
          <div class="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <label class="block text-slate-500 uppercase mb-1 font-bold">Type Remise</label>
              <select 
                v-model="cart.globalDiscountType"
                class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-bold focus:outline-none focus:border-slate-700"
              >
                <option value="none">Aucune Remise</option>
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant Fixe (FCFA)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-500 uppercase mb-1 font-bold">Valeur Remise</label>
              <input 
                type="number" 
                min="0"
                v-model.number="cart.globalDiscountValue"
                placeholder="Ex: 5"
                class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-emerald-400 font-bold text-center focus:outline-none focus:border-slate-700"
                :disabled="cart.globalDiscountType === 'none'"
              />
            </div>
          </div>
        </div>

        <!-- TOTALS BLOCK -->
        <div class="space-y-3 pt-2 text-xs">
          <div class="flex justify-between items-center text-slate-400">
            <span>Somme brute (HT cumulé) :</span>
            <span class="font-bold text-slate-300">{{ cartSubtotalHT.toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-red-400 text-[11px]" v-if="cartDiscountAmount > 0">
            <span>Abattement Remise globale :</span>
            <span>- {{ cartDiscountAmount.toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-slate-450">
            <span>Base Imposable (HT Net) :</span>
            <span class="font-bold text-slate-300">{{ cartHTAfterDiscount.toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-slate-400">
            <span>TVA Réglementaire (19.25%) :</span>
            <span class="font-bold text-slate-300">{{ Math.round(cartTaxAmount).toLocaleString() }} FCFA</span>
          </div>

          <div class="flex justify-between items-center text-base font-bold pt-4 border-t border-slate-800">
            <span class="text-slate-200 uppercase text-xs tracking-wider">VALEUR FINALE TTC :</span>
            <span class="text-emerald-450 text-[17px]">
              {{ Math.round(cartTotalTTC).toLocaleString() }} FCFA
            </span>
          </div>
        </div>

        <!-- ACTIONS BUTTONS -->
        <div class="space-y-3 pt-3">
          <button 
            @click="goToPaymentPage"
            :disabled="cart.items.length === 0"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold uppercase tracking-widest text-white text-xs rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/20"
          >
            VALIDER ET ENCAISSER &raquo;
          </button>
          
          <button 
            @click="clearActiveCart"
            v-if="cart.items.length > 0"
            class="w-full py-2.5 bg-red-950/20 text-red-500 hover:bg-red-905 hover:text-white border border-red-900/40 rounded-xl text-xs uppercase font-bold tracking-wider transition"
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
  ArrowLeftIcon, 
  ShoppingCartIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline';

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

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
