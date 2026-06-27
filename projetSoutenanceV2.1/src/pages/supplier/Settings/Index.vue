<template>
  <div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <h1 class="text-xl font-bold text-slate-100">B2B Core Settings &amp; KYC Verification</h1>
      <p class="text-xs text-slate-400 mt-1">Configure company profiles, multi-tenant subdomains records, and review corporate compliant certifications.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- CORE SETTINGS FORM -->
      <div class="lg:col-span-2 p-5 bg-[#080d22] border border-slate-900 rounded-xl space-y-4">
        <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">Company Metadata Registry</h3>
        
        <form @submit.prevent="updateSettings" class="space-y-4 text-xs font-mono select-none">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9.5px] uppercase text-slate-400 mb-1 font-bold">Registered Legal Name</label>
              <input 
                type="text" 
                v-model="supplierCompany.name"
                class="w-full bg-slate-950 border border-slate-900 px-3 py-2 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-slate-400 mb-1 font-bold">Multi-tenant Subdomain Namespace</label>
              <div class="p-2 bg-slate-950 border border-slate-900 rounded text-indigo-400 font-bold font-mono">
                {{ supplierCompany.subdomain }}.platform.local
              </div>
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Corporate Tax Number (RCCM)</label>
              <input 
                type="text" 
                v-model="supplierCompany.rccm"
                class="w-full bg-slate-950 border border-slate-900 px-3 py-2 rounded text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-slate-400 mb-1">VAT identification code (NUI)</label>
              <input 
                type="text" 
                v-model="supplierCompany.nui"
                class="w-full bg-slate-950 border border-slate-900 px-3 py-2 rounded text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-slate-400 mb-1">Registry Headquarters address</label>
            <input 
              type="text" 
              v-model="supplierCompany.headquarters"
              class="w-full bg-slate-950 border border-slate-900 px-3 py-2 rounded text-slate-200 focus:outline-none"
            />
          </div>

          <div class="pt-4 border-t border-slate-900 flex justify-end">
            <button 
              type="submit"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition uppercase"
            >
              Update Corporate Specs
            </button>
          </div>
        </form>
      </div>

      <!-- SIDEBAR FOR KYC DOCUMENTS PREVIEW -->
      <div class="space-y-6">
        
        <div class="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 class="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">KYC Compliance Dossier</h3>
            <span class="text-[9.5px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950 px-1.5 py-0.5 rounded">PASSED VERified</span>
          </div>

          <p class="text-xs text-slate-450 leading-relaxed font-sans">
            Your legal dossiers have been processed and confirmed by the regulatory committee. All inbound client B2B transactions are cleared.
          </p>

          <!-- List of verified file credentials -->
          <div class="space-y-3 font-mono text-[10.5px]">
            <!-- Doc 1 -->
            <div class="p-2.5 bg-slate-950 rounded-lg flex justify-between items-center border border-slate-905">
              <div>
                <span class="font-bold text-slate-300 block">Trade Register Cert (RCCM)</span>
                <span class="text-[8.5px] text-slate-500 block">Uploaded on 2026-03-12</span>
              </div>
              <span class="text-[9px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓ OK</span>
            </div>

            <!-- Doc 2 -->
            <div class="p-2.5 bg-slate-950 rounded-lg flex justify-between items-center border border-slate-905">
              <div>
                <span class="font-bold text-slate-300 block">Corporate Tax Clearance</span>
                <span class="text-[8.5px] text-slate-500 block">Uploaded on 2026-03-14</span>
              </div>
              <span class="text-[9px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓ OK</span>
            </div>

            <!-- Doc 3 -->
            <div class="p-2.5 bg-slate-950 rounded-lg flex justify-between items-center border border-[#1e2e60] bg-indigo-950/20">
              <div>
                <span class="font-bold text-indigo-300 block">CEO Fingerprints &amp; Passport</span>
                <span class="text-[8.5px] text-slate-500 block font-normal">Sourced from secure Gov database</span>
              </div>
              <span class="text-[9px] bg-indigo-950 text-indigo-400 font-bold px-1.5 py-0.5 rounded border border-indigo-900/60 font-mono">SECI ✅</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const supplierCompany = ref({
  name: 'Robert Kane Sourcing Sarl',
  subdomain: 'robertkane',
  rccm: 'RC/DLA/2026/B/4521',
  nui: 'M082613240214Z',
  headquarters: 'Bassa Industrial Zone, Douala, Cameroon'
});

function updateSettings() {
  toast.success('Corporate configuration nodes updated securely.');
}
</script>
