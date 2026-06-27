<template>
  <div class="space-y-6 max-w-lg mx-auto">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-100 font-mono uppercase tracking-tight">Supplier KYC Registration</h2>
      <p class="text-[10px] uppercase font-mono tracking-widest text-[#FF8C00] mt-1 font-bold">
        ⚠️ HIGH-SECURITY TRADING GATEWAY
      </p>
    </div>

    <!-- Mandatory Admin Approval Warning Warning Box -->
    <div class="bg-amber-950/40 border border-amber-900/50 p-4 rounded-xl text-xs space-y-2">
      <div class="flex items-start space-x-2.5">
        <span class="text-amber-500 font-bold shrink-0">⚠️</span>
        <div class="text-slate-300 leading-normal">
          <strong class="text-amber-400">Mandatory Verification:</strong> B2B Merchant partitions require exhaustive manual regulatory auditing. After submitting compliance dossiers, your registration profile will remain <span class="bg-amber-900/50 font-semibold px-1 py-0.5 rounded text-amber-300 font-mono font-bold">PENDING REGULATORY APPROVAL</span> until critical administration review clears your tax documents.
        </div>
      </div>
    </div>

    <form @submit.prevent="handleRegisterSupplier" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            Official Company Name
          </label>
          <input 
            type="text" 
            v-model="companyName" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            placeholder="e.g. AgroSourcing SARL" 
          />
        </div>

        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            Primary Manager Identity (Full Name)
          </label>
          <input 
            type="text" 
            v-model="managerName" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Marc Soro" 
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            Commerce Register (RC)
          </label>
          <input 
            type="text" 
            v-model="rc" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. RC-OUA-2026-B" 
          />
        </div>

        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            Tax Number ID (NIU / IFU)
          </label>
          <input 
            type="text" 
            v-model="niu" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. N0009873A" 
          />
        </div>

        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            RCCM Register
          </label>
          <input 
            type="text" 
            v-model="rccm" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. RCCM-BF-OUA-21" 
          />
        </div>
      </div>

      <div>
        <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
          Full Legal Headquarters Address
        </label>
        <textarea 
          v-model="legalAddress" 
          required
          rows="2"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          placeholder="e.g. 1500 Avenue de la République, Bobo-Dioulasso, Burkina Faso"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            Account Email (Sign-In ID)
          </label>
          <input 
            type="email" 
            v-model="email" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            placeholder="info@yourcompany.com" 
          />
        </div>

        <div>
          <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            Liaison Telephone Number
          </label>
          <input 
            type="tel" 
            v-model="phone" 
            required
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. +226 70 11 22 33" 
          />
        </div>
      </div>

      <div>
        <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400 mb-1">
          Define Security Password
        </label>
        <input 
          type="password" 
          v-model="password" 
          required
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          placeholder="••••••••••••" 
        />
      </div>

      <!-- Drag & Drop / Technical File Upload Simulator (Mandatory for Usability Guideline) -->
      <div class="space-y-1">
        <label class="block text-[9px] uppercase font-mono tracking-wider text-slate-400">
          Corporate Fiscal Documents & Articles (PDFs, Max 20MB)
        </label>
        <div 
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleFileDrop"
          @click="simulateFileInput"
          class="border border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
          :class="dragOver ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'"
        >
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            multiple 
            @change="handleFileSelected" 
          />
          <span class="text-xs text-slate-400">
            {{ uploadedFiles.length > 0 ? `📁 Compiled: ${uploadedFiles.map(f => f.name).join(', ')}` : 'Drag & Drop PDF dossier files here or click to select' }}
          </span>
          <span class="text-[10px] text-slate-500 font-mono tracking-tight">
            (Required: Tax Certificates & Corporate Articles)
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 bg-[#FF8C00] hover:bg-[#E07B00] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition"
      >
        {{ loading ? 'ENCRYPTING COMPLIANCE METRIC...' : 'SUBMIT KYC DOSSIER FOR AUDIT' }}
      </button>
    </form>

    <div class="border-t border-slate-900/60 pt-4 text-center">
      <p class="text-xs text-slate-500">
        Already registered?
        <router-link to="/auth/login" class="text-indigo-400 font-semibold hover:underline">
          Security Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const companyName = ref('');
const managerName = ref('');
const rc = ref('');
const niu = ref('');
const rccm = ref('');
const legalAddress = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const loading = ref(false);

const dragOver = ref(false);
const uploadedFiles = ref([]);
const fileInput = ref(null);

function simulateFileInput() {
  fileInput.value.click();
}

function handleFileDrop(e) {
  dragOver.value = false;
  if (e.dataTransfer.files.length > 0) {
    saveFiles(e.dataTransfer.files);
  }
}

function handleFileSelected(e) {
  if (e.target.files.length > 0) {
    saveFiles(e.target.files);
  }
}

function saveFiles(fileList) {
  uploadedFiles.value = Array.from(fileList);
  toast.success(`Loaded ${uploadedFiles.value.length} document attachments.`);
}

async function handleRegisterSupplier() {
  if (loading.value) return;
  
  if (uploadedFiles.value.length === 0) {
    toast.error('You must attach corporate registers or fiscal status documents to pass compliance checks.');
    return;
  }

  loading.value = true;
  try {
    await authStore.registerSupplier({
      companyName: companyName.value,
      managerName: managerName.value,
      rc: rc.value,
      niu: niu.value,
      rccm: rccm.value,
      legalAddress: legalAddress.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      fiscalDocs: uploadedFiles.value.map(f => f.name).join(', ')
    });

    toast.success('KYC Submitted! Initiating email validation protocol...');
    router.push({ name: 'VerifyEmail' });
  } catch (err) {
    toast.error(err.message || 'Supply register rejected.');
  } finally {
    loading.value = false;
  }
}
</script>
