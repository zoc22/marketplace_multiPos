<template>
  <div class="space-y-6 font-mono select-none">
    
    <!-- HEADER -->
    <div class="bg-zinc-950 border border-emerald-950 p-5 rounded-xl">
      <h1 class="text-sm font-bold uppercase text-emerald-100 tracking-wider">Configuration Périphériques &amp; Paramètres POS</h1>
      <p class="text-[9.5px] text-zinc-500">Réglage des ports d’imprimante ESC/POS, taux d'imposition douaniers et couplage monétique.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- CORE CONFIG FORM -->
      <div class="lg:col-span-2 p-5 bg-[#020503] border border-emerald-955/60 rounded-xl space-y-4">
        <h3 class="text-xs font-bold text-emerald-500 uppercase tracking-widest pb-1 border-b border-emerald-955/65">
          Spécifications du Terminal de Vente
        </h3>

        <form @submit.prevent="saveDeviceSettings" class="space-y-4 text-xs font-mono">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1 font-bold">Désignation du Poste (Terminal ID)</label>
              <input 
                type="text" 
                v-model="terminalConfig.name"
                class="w-full bg-black border border-emerald-950 px-3 py-2 rounded text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1 font-bold">Matériel &amp; Numéro de Série</label>
              <input 
                type="text" 
                v-model="terminalConfig.serial"
                class="w-full bg-[#09110d]/50 border border-emerald-950 px-3 py-2 rounded text-zinc-500 focus:outline-none"
                disabled
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1">Taux de TVA standard par défaut (%)</label>
              <input 
                type="number" 
                step="0.01"
                v-model.number="terminalConfig.vatRate"
                class="w-full bg-black border border-emerald-950 px-3 py-2 rounded text-emerald-300 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1">Port de Couplage TPE GIMAC</label>
              <select 
                v-model="terminalConfig.tpePort"
                class="w-full bg-black border border-emerald-950 px-3 py-2 rounded text-zinc-300 focus:outline-none"
              >
                <option value="TCP_192168120">TCP/IP : 192.168.1.120 (Conseillé)</option>
                <option value="USB_COM3">USB Emulateur COM3</option>
                <option value="RS232_PORT2">Série RS232 SubD9 Port #2</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[9.5px] uppercase text-zinc-500 mb-1">Annonce bas de ticket (Footer thermal Message)</label>
            <input 
              type="text" 
              v-model="terminalConfig.footerNotice"
              class="w-full bg-black border border-emerald-950 px-3 py-2 rounded text-zinc-200 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1">Volume Bip scanneur</label>
              <select v-model="terminalConfig.scanVolume" class="w-full bg-black border border-emerald-950 px-2 py-1.5 rounded text-zinc-300">
                <option value="low">Sourd (Low)</option>
                <option value="med">Normal (Medium)</option>
                <option value="high">Strident (High)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1">Affichage client externe</label>
              <select v-model="terminalConfig.guestScreen" class="w-full bg-black border border-emerald-950 px-2 py-1.5 rounded text-zinc-300">
                <option value="enabled">Actif [2x20 Caract.]</option>
                <option value="disabled">Désactivé</option>
              </select>
            </div>

            <div>
              <label class="block text-[9.5px] uppercase text-zinc-500 mb-1">Tiroir-caisse connecté</label>
              <select v-model="terminalConfig.cashDrawerEnabled" class="w-full bg-black border border-emerald-950 px-2 py-1.5 rounded text-zinc-300">
                <option value="true">Oui (Pilote EPSON Kick)</option>
                <option value="false">Non manuel</option>
              </select>
            </div>
          </div>

          <div class="pt-4 border-t border-emerald-950/40 flex justify-end">
            <button 
              type="submit"
              class="px-5 py-2.5 bg-emerald-950 hover:bg-[#0d2e1b] border border-emerald-900 text-emerald-400 font-mono font-bold text-xs rounded transition uppercase tracking-wider"
            >
              Sauvegarder Configuration [ Save ]
            </button>
          </div>
        </form>
      </div>

      <!-- SIDEBAR STATUS DETAILS -->
      <div class="space-y-6">
        
        <!-- HARDWARE CHECKS -->
        <div class="p-5 bg-zinc-950 border border-emerald-950 rounded-xl space-y-4">
          <h3 class="text-xs font-bold text-emerald-450 uppercase tracking-widest font-mono">
            Diagnostic Périphériques
          </h3>

          <div class="space-y-2.5 font-mono text-[9.5px]">
            <div class="p-2 bg-black rounded flex justify-between items-center border border-zinc-904">
              <span>🖨️ Imprimante Thermique EPSON TM-T20</span>
              <span class="text-emerald-400 font-bold bg-[#041a0f] px-1 rounded border border-emerald-900 text-[8.5px]">CONNECTÉ</span>
            </div>

            <div class="p-2 bg-black rounded flex justify-between items-center border border-zinc-904">
              <span>🏷️ Lecteur Bi-Optique Honeywell</span>
              <span class="text-emerald-400 font-bold bg-[#041a0f] px-1 rounded border border-emerald-900 text-[8.5px]">PRÊT</span>
            </div>

            <div class="p-2 bg-black rounded flex justify-between items-center border border-zinc-904">
              <span>💳 Terminal TPE Ingenico Desk5000</span>
              <span class="text-amber-500 font-bold bg-amber-950/20 px-1 rounded border border-amber-900/60 text-[8.5px]">ATTENTE TPE</span>
            </div>

            <div class="p-2 bg-black rounded flex justify-between items-center border border-zinc-904">
              <span>⚖️ Balance Industrielle Mettler</span>
              <span class="text-zinc-600 font-bold bg-zinc-900 px-1 rounded text-[8.5px]">STABLE (0.00g)</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-[#110505]/20 border border-red-950/40 rounded-xl space-y-1.5 text-[9.5px]">
          <h4 class="text-red-400 font-bold uppercase text-[9px] tracking-wider">Zone de Test d’Interruption</h4>
          <p class="text-zinc-550 leading-relaxed font-sans">
            En cas de panne réseau avec les services GIMAC de Yaoundé ou d'incident d’impression thermo-papier, veuillez utiliser les boutons de diagnostic déportés.
          </p>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const terminalConfig = ref({
  name: 'Terminal Central - Bassa B2B',
  serial: 'HW-TM88VI-00192A0B',
  vatRate: 19.25,
  tpePort: 'TCP_192168120',
  footerNotice: 'Merci de votre visite. Produits agricoles de qualité certifiés FIFO.',
  scanVolume: 'med',
  guestScreen: 'enabled',
  cashDrawerEnabled: 'true'
});

onMounted(() => {
  const saved = localStorage.getItem('pos_hardware_settings_v1');
  if (saved) {
    terminalConfig.value = JSON.parse(saved);
  }
});

function saveDeviceSettings() {
  localStorage.setItem('pos_hardware_settings_v1', JSON.stringify(terminalConfig.value));
  toast.success('Configuration des ports et du matériel enregistrée.');
}
</script>
