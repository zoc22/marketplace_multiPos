<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--color-background)] py-12">
    <!-- Background image and overlay -->
    <div class="absolute inset-0 z-0 fixed">
      <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920" alt="Marketplace Background" class="w-full h-full object-cover opacity-60 mix-blend-overlay dark:opacity-40" />
      <div class="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-[#0a1017]/80 to-emerald-950/90"></div>
    </div>

    <!-- Return to marketplace button -->
    <router-link to="/" class="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/70 hover:text-[#C8A96E] transition-colors font-medium">
      <ArrowLeftIcon class="h-5 w-5" />
      Retour à la marketplace
    </router-link>

    <div class="relative z-10 w-full max-w-4xl p-8 sm:p-14 bg-[var(--color-surface)]/95 border border-[var(--color-border)] shadow-2xl rounded-[2.5rem] backdrop-blur-md mx-4 transition-all duration-500">
      
      <div class="text-center mb-10">
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-text-primary)] uppercase">
          S'INSCRIRE
        </h2>
        <p v-if="step === 1" class="text-sm mt-3 text-[var(--color-text-secondary)] leading-relaxed px-4 font-medium italic">
          "Inscrivez-vous pour rejoindre le premier hub d'affaires B2B au Cameroun. Propulsez votre activité au sommet."
        </p>
        <p v-else class="text-sm mt-3 text-[var(--color-text-secondary)] font-medium">
          Veuillez recopier le code de sécurité affiché ci-dessous pour vérifier que vous n'êtes pas un robot.
        </p>
      </div>

      <!-- Toggle Acheteur / Fournisseur (Only visible on step 1) -->
      <div v-show="step === 1" class="flex p-1.5 bg-[var(--color-background)] rounded-2xl mb-10 border border-[var(--color-border)] relative shadow-inner overflow-hidden max-w-2xl mx-auto">
        <div 
          class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[var(--color-surface-elevated)] shadow-md rounded-xl transition-transform duration-500 ease-in-out border border-[var(--color-border)]"
          :style="{ transform: isSupplier ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }"
        ></div>
        
        <button 
          @click="isSupplier = false"
          class="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors relative z-10 duration-300"
          :class="!isSupplier ? 'text-[#C8A96E]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'"
        >
          Acheteur
        </button>
        <button 
          @click="isSupplier = true"
          class="flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors relative z-10 duration-300"
          :class="isSupplier ? 'text-[#C8A96E]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'"
        >
          Fournisseur
        </button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleFormSubmit" class="relative overflow-hidden">
        
        <!-- STEP 1: REGISTRATION DETAILS -->
        <div 
          class="transition-all duration-700 ease-in-out"
          :class="step === 1 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 -translate-x-full absolute w-full top-0 pointer-events-none'"
        >
          <div class="space-y-6">
            
            <!-- CHAMPS COMMUNS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Nom du responsable</label>
                <input type="text" v-model="formData.name" required class="form-input rounded-2xl py-4" placeholder="Ex: Jean Dupont" />
              </div>
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Nom de l'entreprise</label>
                <input type="text" v-model="formData.company" required class="form-input rounded-2xl py-4" placeholder="Ex: Ma Société" />
              </div>
            </div>

            <!-- LOCALISATION AVEC AUTOCOMPLÉTION (DATALIST) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Continent</label>
                <input list="continents-list" v-model="formData.continentName" @input="onContinentInput" required class="form-input rounded-2xl py-4" placeholder="Saisir un continent..." />
                <datalist id="continents-list">
                  <option v-for="c in geoContinents" :key="c" :value="c"></option>
                </datalist>
              </div>
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Pays</label>
                <input list="countries-list" v-model="formData.countryName" @input="onCountryInput" required :disabled="!formData.continentName" class="form-input rounded-2xl py-4 disabled:opacity-50" placeholder="Saisir un pays..." />
                <datalist id="countries-list">
                  <option v-for="c in availableCountries" :key="c.code" :value="c.name"></option>
                </datalist>
              </div>
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Ville</label>
                <input list="cities-list" v-model="formData.city" required :disabled="!formData.countryName" class="form-input rounded-2xl py-4 disabled:opacity-50" placeholder="Saisir une ville..." />
                <datalist id="cities-list">
                  <option v-for="city in availableCities" :key="city" :value="city"></option>
                </datalist>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Adresse E-mail</label>
                <input type="email" v-model="formData.email" required class="form-input rounded-2xl py-4" placeholder="contact@masociete.com" />
              </div>
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Téléphone</label>
                <div class="flex">
                  <span class="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] font-mono font-bold">
                    {{ phonePrefix || '+' }}
                  </span>
                  <input type="tel" v-model="formData.phone" required class="flex-1 form-input rounded-l-none rounded-r-2xl py-4" placeholder="6 12 34 56 78" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Mot de passe</label>
                <input type="password" v-model="formData.password" required class="form-input rounded-2xl py-4" placeholder="••••••••" />
              </div>
              <!-- Placeholder just to balance the grid for common fields, no 2FA here anymore -->
              <div class="flex items-center pt-8">
                <input type="checkbox" id="remember-me" class="h-5 w-5 text-[#C8A96E] bg-[var(--color-background)] border-[var(--color-border)] rounded focus:ring-[#C8A96E]" />
                <label for="remember-me" class="ml-3 block text-sm font-medium text-[var(--color-text-secondary)]">Se souvenir de moi</label>
              </div>
            </div>

            <!-- SECTION FOURNISSEUR SPECIFIQUE -->
            <div v-if="isSupplier" class="space-y-6 animate-fade-in border-t border-[var(--color-border)] pt-8 mt-8">
              <h3 class="text-xl font-black tracking-wide text-[#C8A96E] uppercase">Informations Légales & Fournisseur</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Type d'activité</label>
                  <select v-model="formData.resellerType" required class="form-input rounded-2xl py-4">
                    <option value="" disabled>Sélectionner le type</option>
                    <option value="retail">Revendeur en détail</option>
                    <option value="wholesale">Revendeur en gros</option>
                    <option value="industrial">Fournisseur industriel</option>
                    <option value="raw_materials">Fournisseur matière première</option>
                  </select>
                </div>
                <div class="flex items-center h-full pt-8">
                  <input type="checkbox" id="manage-users" v-model="formData.manageUsers" class="h-5 w-5 text-[#C8A96E] bg-[var(--color-background)] border-[var(--color-border)] rounded focus:ring-[#C8A96E]" />
                  <label for="manage-users" class="ml-3 block text-sm font-medium text-[var(--color-text-secondary)]">
                    Voulez-vous gérer vos utilisateurs ? (Active l'ERP)
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Registre Commerce (RC)</label>
                  <input type="text" v-model="formData.rc" required class="form-input rounded-2xl py-4" placeholder="RC-..." />
                </div>
                <div>
                  <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Numéro Fiscal (NIU)</label>
                  <input type="text" v-model="formData.niu" required class="form-input rounded-2xl py-4" placeholder="N000..." />
                </div>
                <div>
                  <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">RCCM</label>
                  <input type="text" v-model="formData.rccm" required class="form-input rounded-2xl py-4" placeholder="RCCM-..." />
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Adresse Légale (Siège)</label>
                <input type="text" v-model="formData.legalAddress" required class="form-input rounded-2xl py-4" placeholder="Adresse complète" />
              </div>

              <!-- Zone KYC Compliance (Optionnelle) -->
              <div class="bg-[var(--color-surface-elevated)] p-6 rounded-3xl border border-[var(--color-border)] mt-4">
                <h4 class="text-sm font-black uppercase tracking-wide text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <DocumentCheckIcon class="h-6 w-6 text-[#C8A96E]" />
                  Documents KYC (Optionnel - Pour badge officiel)
                </h4>
                <p class="text-xs text-[var(--color-text-tertiary)] mb-6">Ajoutez vos documents (Kbis, Statuts, Pièce d'identité) un par un.</p>
                
                <ul v-if="formData.documents.length > 0" class="mb-6 space-y-3">
                  <li v-for="(doc, index) in formData.documents" :key="index" class="flex items-center justify-between bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] text-sm shadow-sm">
                    <span class="flex items-center gap-3 truncate text-[var(--color-text-secondary)] font-medium">
                      <DocumentIcon class="h-5 w-5 text-[#C8A96E]" /> {{ doc.name }}
                    </span>
                    <div class="flex items-center gap-4">
                      <button type="button" @click="previewDoc(doc)" class="text-[#C8A96E] hover:underline text-xs font-bold uppercase">Aperçu</button>
                      <button type="button" @click="removeDoc(index)" class="text-rose-500 hover:text-rose-400 bg-rose-500/10 p-2 rounded-lg transition hover:scale-105">
                        <XMarkIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                </ul>

                <div class="flex items-center justify-center w-full">
                  <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-40 border-2 border-[var(--color-border)] border-dashed rounded-2xl cursor-pointer bg-[var(--color-background)] hover:bg-[var(--color-surface-elevated)] hover:border-[#C8A96E] transition-all">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <ArrowUpTrayIcon class="h-8 w-8 text-[var(--color-text-tertiary)] mb-3" />
                      <p class="mb-2 text-sm text-[var(--color-text-secondary)]"><span class="font-bold">Cliquez pour ajouter</span> ou glissez un fichier</p>
                      <p class="text-xs text-[var(--color-text-tertiary)] uppercase font-bold tracking-wide mt-2">PDF, PNG, JPG (Max. 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" @change="handleAddDocument" />
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- STEP 2: 2FA CODE -->
        <div 
          class="transition-all duration-700 ease-in-out pt-6"
          :class="step === 2 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full absolute w-full top-0 pointer-events-none'"
        >
          <div class="space-y-6">
            <!-- CAPTCHA BOX DISPLAY -->
            <div class="bg-[var(--color-surface-elevated)] p-5 rounded-2xl border border-[var(--color-border)] flex flex-col items-center justify-center max-w-sm mx-auto">
              <span class="text-xs text-[var(--color-text-secondary)] uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheckIcon class="h-4 w-4 text-[#C8A96E]" />
                Code de sécurité anti-robot
              </span>
              <div class="text-4xl font-mono font-black text-[#C8A96E] tracking-[0.5em] pl-4 select-none bg-[var(--color-background)]/50 px-6 py-4 rounded-xl border border-[var(--color-border)] shadow-inner">
                {{ generatedCode }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide text-center">
                Recopiez le code ici
              </label>
              <div class="relative flex items-center justify-center">
                <input 
                  type="text" 
                  v-model="twoFactorCode" 
                  :required="step === 2"
                  class="w-full max-w-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl py-5 text-[var(--color-text-primary)] tracking-[1em] text-center text-3xl font-mono font-black focus:ring-2 focus:ring-[#C8A96E] focus:border-transparent transition-all placeholder-[var(--color-text-tertiary)]"
                  placeholder="----" 
                  maxlength="4"
                  ref="twoFactorInput"
                />
              </div>
              <p class="text-sm text-[var(--color-text-tertiary)] mt-4 text-center">
                Cette étape remplace le Captcha pour sécuriser la création de compte.
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-10">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-[#C8A96E]/20 text-lg font-black uppercase text-black bg-[#C8A96E] hover:bg-[#d4b983] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A96E] transition-all disabled:opacity-50 hover:scale-[1.02] duration-300"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-6 w-6 text-black" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ loading ? 'Veuillez patienter...' : (step === 1 ? 'Continuer' : 'Valider mon compte') }}
          </button>
          
          <button 
            v-if="step === 2"
            type="button"
            @click="step = 1"
            class="w-full mt-5 flex justify-center items-center py-3 px-4 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            &larr; Retour aux informations
          </button>
        </div>

      </form>

      <!-- Social Logins (Only Step 1) -->
      <div class="mt-10 transition-opacity duration-500" :class="step === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[var(--color-border)]"></div>
          </div>
          <div class="relative flex justify-center text-sm font-bold">
            <span class="px-4 bg-[var(--color-surface)] text-[var(--color-text-tertiary)] uppercase tracking-widest">Ou s'inscrire avec</span>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-4 gap-4">
          <button @click="handleSocial('Google')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[var(--color-text-primary)]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </button>
          <button @click="handleSocial('Facebook')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button @click="handleSocial('LinkedIn')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </button>
          <button @click="handleSocial('TikTok')" class="flex justify-center items-center py-3.5 px-4 border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface-elevated)] transition-colors shadow-sm hover:-translate-y-1 duration-300">
            <svg class="h-6 w-6 text-[var(--color-text-primary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </button>
        </div>
      </div>

      <div class="mt-8 text-center" v-show="step === 1">
        <p class="text-sm text-[var(--color-text-secondary)] font-medium">
          Vous avez déjà un compte ?
          <router-link to="/auth/login" class="font-bold text-[#C8A96E] hover:underline uppercase tracking-wide ml-1">
            Se connecter
          </router-link>
        </p>
      </div>

      <!-- SECRET PRESETS BUTTON -->
      <button 
        type="button"
        @click="showPresets = !showPresets"
        class="absolute bottom-6 right-6 p-2 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[#C8A96E] hover:text-emerald-400 opacity-20 hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
        title="Outils de test"
      >
        <KeyIcon class="w-5 h-5" />
      </button>

      <!-- PRESETS MENU -->
      <div v-if="showPresets" class="absolute bottom-16 right-6 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-4 text-sm w-56 z-50 animate-fade-in">
        <h4 class="font-black text-[var(--color-text-primary)] mb-3 uppercase tracking-wider text-[11px] text-center border-b border-[var(--color-border)] pb-2">Tests Rapides</h4>
        <div class="space-y-2">
          <button @click="fillPreset('buyer')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-emerald-500 font-bold transition-colors">Nouveau Acheteur</button>
          <button @click="fillPreset('supplier')" class="w-full text-left px-3 py-2 hover:bg-[var(--color-background)] rounded-lg text-cyan-500 font-bold transition-colors">Nouveau Fournisseur</button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.js';
import { useToast } from 'vue-toastification';
import { 
  ArrowLeftIcon,
  DocumentCheckIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DevicePhoneMobileIcon,
  KeyIcon
} from '@heroicons/vue/24/outline';
import { continents as geoContinents, countries as geoCountries, citiesByCountry as geoCities } from '@/utils/geo_data.js';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const step = ref(1);
const isSupplier = ref(false);
const loading = ref(false);
const showPresets = ref(false);

const twoFactorCode = ref('');
const twoFactorInput = ref(null);
const generatedCode = ref('');

const formData = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  password: '',
  continentName: '',
  countryName: '',
  city: '',
  // Supplier Specifics
  resellerType: '',
  manageUsers: false,
  rc: '',
  niu: '',
  rccm: '',
  legalAddress: '',
  documents: []
});

// Geo Computed & Logic
// Geo Computed & Logic
const availableCountries = computed(() => {
  if (!formData.value.continentName) return [];
  return geoCountries.filter(c => c.continent === formData.value.continentName);
});

const selectedCountryCode = computed(() => {
  const match = availableCountries.value.find(c => c.name === formData.value.countryName);
  return match ? match.code : null;
});

const availableCities = computed(() => {
  if (!formData.value.countryName) return [];
  return geoCities[formData.value.countryName] || ["Capitale", "Ville Principale 1"];
});

const phonePrefix = computed(() => {
  const match = geoCountries.find(c => c.name === formData.value.countryName);
  return match ? match.dial_code : '';
});

function onContinentInput() {
  formData.value.countryName = '';
  formData.value.city = '';
}

function onCountryInput() {
  formData.value.city = '';
}

// KYC Document Handling
function handleAddDocument(event) {
  const file = event.target.files[0];
  if (file) {
    formData.value.documents.push({
      name: file.name,
      file: file,
      previewUrl: URL.createObjectURL(file)
    });
    toast.success(`${file.name} ajouté à la liste KYC.`);
  }
  event.target.value = null;
}

function removeDoc(index) {
  formData.value.documents.splice(index, 1);
}

function previewDoc(doc) {
  if (doc.previewUrl) window.open(doc.previewUrl, '_blank');
}

function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
}

async function handleFormSubmit() {
  if (loading.value) return;
  loading.value = true;
  
  try {
    if (step.value === 1) {
      // Étape 1 : Simulation vérification avant envoi email
      await new Promise(r => setTimeout(r, 500));

      // Générer le code 2FA et l'afficher (Captcha mode)
      generatedCode.value = generateRandomCode();
      toast.info(`[SÉCURITÉ] Veuillez recopier le code affiché à l'écran.`, { timeout: 5000 });
      
      // Passer à l'étape 2
      step.value = 2;
      loading.value = false;
      
      await nextTick();
      if(twoFactorInput.value) twoFactorInput.value.focus();

    } else if (step.value === 2) {
      // Étape 2 : Vérification du 2FA et Création du compte
      if (twoFactorCode.value !== generatedCode.value) {
        throw new Error("Code de sécurité invalide.");
      }

      const fullPhone = `${phonePrefix.value} ${formData.value.phone}`;

      if (!isSupplier.value) {
        await authStore.registerBuyer({
          name: formData.value.name,
          company: formData.value.company,
          email: formData.value.email,
          phone: fullPhone,
          password: formData.value.password
        });
        await authStore.verifyEmail(authStore.verificationCode);
        
        toast.success('Compte acheteur créé avec succès !');
        router.push({ name: 'BuyerDashboard' });
        
      } else {
        const docNames = formData.value.documents.map(d => d.name).join(', ');
        await authStore.registerSupplier({
          companyName: formData.value.company,
          managerName: formData.value.name,
          rc: formData.value.rc,
          niu: formData.value.niu,
          rccm: formData.value.rccm,
          legalAddress: `${formData.value.legalAddress}, ${formData.value.city}, ${formData.value.countryName}`,
          email: formData.value.email,
          phone: fullPhone,
          password: formData.value.password,
          fiscalDocs: docNames || 'Aucun document'
        });
        await authStore.verifyEmail(authStore.verificationCode);

        toast.success('Compte fournisseur créé ! Validation requise par un administrateur.');
        router.push({ name: 'Login' });
      }
    }
  } catch (err) {
    toast.error(err.message || 'Erreur lors de la création du compte.');
    loading.value = false;
  }
}

async function handleSocial(provider) {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await authStore.socialLogin(provider);
    toast.success(`Inscription via ${provider} réussie.`);
    router.push({ name: 'BuyerDashboard' });
  } catch(err) {
    toast.error(err.message);
  } finally {
    loading.value = false;
  }
}

function fillPreset(role) {
  if (role === 'buyer') {
    formData.value.name = 'John Acheteur';
    formData.value.company = 'John SARL';
    formData.value.email = 'newbuyer@enterprise.local';
    formData.value.phone = '690000000';
    formData.value.password = 'password';
    formData.value.continentName = 'Afrique';
    formData.value.countryName = 'Cameroun';
    formData.value.city = 'Douala';
    isSupplier.value = false;
  } else if (role === 'supplier') {
    formData.value.name = 'Paul Vendeur';
    formData.value.company = 'Paul Indus';
    formData.value.email = 'newsupplier@enterprise.local';
    formData.value.phone = '691111111';
    formData.value.password = 'password';
    formData.value.continentName = 'Afrique';
    formData.value.countryName = 'Cameroun';
    formData.value.city = 'Yaoundé';
    formData.value.resellerType = 'wholesale';
    formData.value.manageUsers = true;
    formData.value.rc = 'RC/DLA/2026/A/1234';
    formData.value.niu = 'M012345678901Y';
    formData.value.rccm = 'RCCM-CM-DLA-2026-B-5678';
    formData.value.legalAddress = 'Bonanjo, Rue Silo';
    isSupplier.value = true;
  }
  showPresets.value = false;
  toast.success(`Formulaire pré-rempli pour ${role}.`);
}
</script>

<style scoped>
.form-input {
  width: 100%;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 1rem 1.25rem;
  color: var(--color-text-primary);
  transition: all 0.2s;
  font-size: 1rem;
}
.form-input:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px #C8A96E;
}

/* Chrome native datalist arrow fix */
input::-webkit-calendar-picker-indicator {
  opacity: 100;
  cursor: pointer;
}
[data-theme="dark"] input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
