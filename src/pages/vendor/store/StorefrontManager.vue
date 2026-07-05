<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <BuildingStorefrontIcon class="h-6 w-6 text-[var(--color-primary)]" />
          <span>Ma Boutique en Ligne (Marketplace)</span>
        </h1>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">Gérez votre présence sur la marketplace, publiez vos articles et configurez vos vitrines par glisser-déposer.</p>
      </div>
      <button 
        @click="openCreateStoreModal"
        class="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-90 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shadow-sm cursor-pointer"
      >
        <PlusIcon class="h-5 w-5" />
        <span>Créer un Magasin</span>
      </button>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-[var(--color-border)] space-x-6 text-sm font-semibold">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="pb-3 transition border-b-2 cursor-pointer"
        :class="activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- TAB 1: Mes Boutiques -->
    <div v-if="activeTab === 'stores'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="shop in stores" :key="shop.id" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 rounded-xl bg-[var(--color-primary-muted)] text-[var(--color-primary)] flex items-center justify-center font-bold text-lg">
              {{ shop.name.charAt(0) }}
            </div>
            <div>
              <h3 class="font-bold text-base text-[var(--color-text-primary)]">{{ shop.name }}</h3>
              <p class="text-xs text-[var(--color-text-secondary)]">Créé le : {{ formatDate(shop.createdAt) }}</p>
            </div>
          </div>
          <span 
            class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
            :class="shop.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'"
          >
            {{ shop.status === 'Active' ? 'Ouvert' : 'Brouillon/Fermé' }}
          </span>
        </div>

        <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">{{ shop.description }}</p>

        <!-- Warehouses and Stock feeds -->
        <div class="pt-4 border-t border-[var(--color-border)] space-y-2">
          <span class="text-xs font-bold uppercase text-[var(--color-text-muted)] tracking-wider block">Entrepôts de ravitaillement</span>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="whId in shop.warehouseIds" 
              :key="whId"
              class="px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] rounded-lg font-medium"
            >
              🏢 {{ getWarehouseName(whId) }}
            </span>
            <span v-if="shop.warehouseIds.length === 0" class="text-xs text-[var(--color-text-muted)] italic">Aucun entrepôt configuré.</span>
          </div>
        </div>

        <!-- Shop Actions -->
        <div class="flex justify-end space-x-2 pt-4">
          <button 
            @click="editStore(shop)"
            class="px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-xs font-bold rounded-lg text-[var(--color-text-primary)] transition cursor-pointer"
          >
            Modifier Info
          </button>
          <button 
            @click="activeTab = 'builder'; selectedStoreId = shop.id; initBuilder()"
            class="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Design Vitrine (No-Code) 🎨
          </button>
          <button 
            @click="activeTab = 'preview'; selectedStoreId = shop.id"
            class="px-3.5 py-1.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Aperçu Direct
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 2: Catalogue & Publications -->
    <div v-if="activeTab === 'catalog'" class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 class="font-bold text-base text-[var(--color-text-primary)]">Publications des Produits B2C</h3>
        <select v-model="filterStoreId" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-xs text-[var(--color-text-primary)] focus:outline-none">
          <option value="">Tous les produits</option>
          <option v-for="shop in stores" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
        </select>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase border-b border-[var(--color-border)]">
            <th class="p-4">Produit</th>
            <th class="p-4">Boutique Affectée</th>
            <th class="p-4 text-right">Prix</th>
            <th class="p-4 text-center">Images</th>
            <th class="p-4 text-center">État Publication</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-border)]">
          <tr v-for="prod in filteredCatalogProducts" :key="prod.id" class="hover:bg-[var(--color-surface-hover)]/30 text-sm">
            <td class="p-4">
              <div class="flex items-center space-x-3">
                <img :src="prod.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&q=80'" class="h-10 w-10 object-cover rounded-lg border border-[var(--color-border)] bg-slate-100" />
                <div>
                  <span class="font-bold text-[var(--color-text-primary)] block">{{ prod.name }}</span>
                  <span class="text-xs text-[var(--color-text-muted)]">{{ prod.category }}</span>
                </div>
              </div>
            </td>
            <td class="p-4 text-[var(--color-text-secondary)]">
              {{ getStoreName(prod.storeId) }}
            </td>
            <td class="p-4 text-right font-bold text-[var(--color-text-primary)]">
              {{ formatMoney(prod.price) }}
            </td>
            <td class="p-4 text-center text-xs text-[var(--color-text-secondary)]">
              {{ prod.images.length }} image(s)
            </td>
            <td class="p-4 text-center">
              <span 
                class="px-2.5 py-0.5 rounded-full text-xs font-bold border inline-block"
                :class="{
                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20': prod.status === 'Published',
                  'bg-amber-500/10 text-amber-500 border-amber-500/20': prod.status === 'Draft',
                  'bg-slate-500/10 text-slate-500 border-slate-500/20': prod.status === 'Retired'
                }"
              >
                {{ getStatusLabel(prod.status) }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button 
                v-if="prod.status !== 'Published'"
                @click="changeProductStatus(prod.id, 'Published')"
                class="text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
              >
                Publier
              </button>
              <button 
                v-if="prod.status === 'Published'"
                @click="changeProductStatus(prod.id, 'Retired')"
                class="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
              >
                Retirer
              </button>
              <button 
                @click="editProduct(prod)"
                class="text-xs font-bold text-[var(--color-primary)] hover:underline ml-2 cursor-pointer"
              >
                Gérer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TAB 3: Drag & Drop Builder -->
    <div v-if="activeTab === 'builder'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Toolbox Sidebar -->
      <div class="lg:col-span-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm space-y-6">
        <div>
          <h3 class="font-bold text-sm text-[var(--color-text-primary)]">Boîte à outils</h3>
          <p class="text-xs text-[var(--color-text-secondary)] mt-1">Faites glisser les composants ci-dessous vers la zone de construction.</p>
        </div>

        <div class="space-y-3">
          <div 
            v-for="widget in availableWidgets" 
            :key="widget.type"
            draggable="true"
            @dragstart="onDragStart($event, widget)"
            class="p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl text-xs font-semibold cursor-grab flex items-center space-x-2 transition"
          >
            <span class="text-lg">🧩</span>
            <span>{{ widget.name }}</span>
          </div>
        </div>

        <hr class="border-[var(--color-border)]" />

        <!-- Theme / Style settings -->
        <div class="space-y-4">
          <h4 class="font-bold text-xs uppercase text-[var(--color-text-muted)] tracking-wider">Style & Palette</h4>
          <div>
            <label class="block text-xs mb-1 text-[var(--color-text-secondary)]">Couleur Primaire</label>
            <input type="color" v-model="builderConfig.colors.primary" class="w-full h-8 rounded cursor-pointer" />
          </div>
          <div>
            <label class="block text-xs mb-1 text-[var(--color-text-secondary)]">Couleur Secondaire</label>
            <input type="color" v-model="builderConfig.colors.secondary" class="w-full h-8 rounded cursor-pointer" />
          </div>
          <div>
            <label class="block text-xs mb-1 text-[var(--color-text-secondary)]">Couleur du texte</label>
            <input type="color" v-model="builderConfig.colors.text" class="w-full h-8 rounded cursor-pointer" />
          </div>
          <div>
            <label class="block text-xs mb-1 text-[var(--color-text-secondary)]">Animation de Vitrine</label>
            <select v-model="builderConfig.animation" class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-xs text-[var(--color-text-primary)]">
              <option value="none">Aucune</option>
              <option value="pulse">Impulsion Légère</option>
              <option value="bounce">Animation de survol (Float)</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <button 
            @click="saveBuilderDesign" 
            class="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Sauvegarder la Vitrine 💾
          </button>
          <button 
            @click="generatePublicLink" 
            class="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Générer le lien public 🌐
          </button>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="lg:col-span-3 space-y-4">
        <div class="flex justify-between items-center bg-[var(--color-surface-elevated)] p-4 rounded-xl border border-[var(--color-border)]">
          <span class="text-xs font-bold text-[var(--color-text-secondary)]">
            Zone de Construction (Canvas) - Glissez-déposez ici pour ordonner vos sections
          </span>
          <span v-if="builderConfig.widgets.length === 0" class="text-xs text-amber-500 font-semibold animate-pulse">
            Canvas vide. Glissez un widget pour commencer !
          </span>
        </div>

        <!-- Canvas Body -->
        <div 
          class="min-h-[500px] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-background)] rounded-2xl p-6 space-y-4"
          @dragover.prevent
          @drop="onCanvasDrop($event)"
        >
          <!-- Mock Header for visual context -->
          <div 
            class="p-6 rounded-2xl text-center text-white relative shadow-lg"
            :style="{ background: `linear-gradient(135deg, ${builderConfig.colors.primary} 0%, ${builderConfig.colors.secondary} 100%)` }"
          >
            <h2 class="text-2xl font-black">{{ currentStore?.name }}</h2>
            <p class="text-xs opacity-90 mt-1">Aperçu de la bannière dynamique du site vitrine</p>
          </div>

          <!-- Dynamic Builder Widgets Render list -->
          <div 
            v-for="(w, idx) in builderConfig.widgets" 
            :key="w.id"
            class="p-4 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl relative group hover:border-[var(--color-primary)] transition"
          >
            <!-- Actions buttons for widget -->
            <div class="absolute right-3 top-3 space-x-1 opacity-0 group-hover:opacity-100 transition">
              <button @click="moveWidget(idx, -1)" :disabled="idx === 0" class="p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded hover:text-[var(--color-primary)] disabled:opacity-50 text-xs">▲</button>
              <button @click="moveWidget(idx, 1)" :disabled="idx === builderConfig.widgets.length - 1" class="p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded hover:text-[var(--color-primary)] disabled:opacity-50 text-xs">▼</button>
              <button @click="builderConfig.widgets.splice(idx, 1)" class="p-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs hover:bg-red-500 hover:text-white">🗑️</button>
            </div>

            <!-- Widget content customizer form depending on type -->
            <div class="space-y-2 pr-20">
              <div class="flex items-center space-x-2 text-xs font-bold text-[var(--color-primary)] uppercase">
                <span>{{ w.name }}</span>
              </div>

              <!-- Banner Widget Inputs -->
              <div v-if="w.type === 'hero'" class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <input type="text" v-model="w.title" placeholder="Surlignage (Ex: OFFRES EXCLUSIVES)" class="p-2 border rounded bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] border-[var(--color-border)] focus:outline-none" />
                <input type="text" v-model="w.subtitle" placeholder="Titre Principal" class="p-2 border rounded bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] border-[var(--color-border)] focus:outline-none" />
                <input type="text" v-model="w.description" placeholder="Description de l'offre" class="p-2 border rounded bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] border-[var(--color-border)] focus:outline-none md:col-span-2" />
              </div>

              <!-- Products Grid Title Input -->
              <div v-if="w.type === 'products'" class="mt-2">
                <input type="text" v-model="w.title" placeholder="Titre de la section produits (Ex: Notre Sélection)" class="w-full p-2 border rounded bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] border-[var(--color-border)] focus:outline-none" />
              </div>

              <!-- Rich Text Info Customizer -->
              <div v-if="w.type === 'info'" class="space-y-2 mt-2">
                <input type="text" v-model="w.title" placeholder="Titre de l'info" class="w-full p-2 border rounded bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] border-[var(--color-border)] focus:outline-none" />
                <textarea v-model="w.content" placeholder="Contenu explicatif..." rows="2" class="w-full p-2 border rounded bg-[var(--color-background)] text-xs text-[var(--color-text-primary)] border-[var(--color-border)] focus:outline-none"></textarea>
              </div>

              <!-- Contact Form Mockup -->
              <div v-if="w.type === 'contact'" class="mt-2 text-xs text-[var(--color-text-muted)] italic">
                Formulaire de demande de devis & messages clients (Généré automatiquement)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: Prévisualisation de la Boutique -->
    <div v-if="activeTab === 'preview'" class="space-y-6">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4 rounded-xl flex justify-between items-center text-sm">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-[var(--color-text-secondary)]">Boutique à prévisualiser :</span>
          <select v-model="selectedStoreId" class="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-xs text-[var(--color-text-primary)] focus:outline-none">
            <option v-for="shop in stores" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
          </select>
        </div>
        <button 
          @click="openExternalTab"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
        >
          <span>Ouvrir dans un onglet externe 🌐</span>
        </button>
      </div>

      <!-- Marketplace Store Mockup Page -->
      <div v-if="currentStore" class="border border-[var(--color-border)] rounded-2xl overflow-hidden bg-slate-950 text-white shadow-xl">
        <!-- Banner -->
        <div 
          class="h-48 relative p-8 flex items-end transition-all duration-500"
          :class="builderConfig.animation === 'pulse' ? 'animate-pulse' : ''"
          :style="{ background: `linear-gradient(135deg, ${builderConfig.colors.primary} 0%, ${builderConfig.colors.secondary} 100%)` }"
        >
          <div class="flex items-center space-x-4">
            <div class="h-16 w-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border-2 border-emerald-500">
              {{ currentStore.name.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight" :style="{ color: builderConfig.colors.text }">{{ currentStore.name }}</h2>
              <p class="text-sm opacity-90 mt-0.5" :style="{ color: builderConfig.colors.text }">Visiter la boutique • 📍 Cameroun</p>
            </div>
          </div>
        </div>

        <!-- Store Body -->
        <div class="p-8 space-y-6 bg-slate-900">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sidebar info -->
            <div class="space-y-4">
              <h4 class="font-bold text-xs uppercase text-slate-400 tracking-wider">À propos</h4>
              <p class="text-sm text-slate-300 leading-relaxed">{{ currentStore.description }}</p>
            </div>

            <!-- Products Grid mockup -->
            <div class="lg:col-span-2 space-y-4">
              <h4 class="font-bold text-xs uppercase text-slate-400 tracking-wider">Articles en vitrine</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="p in previewStoreProducts" :key="p.id" class="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <img :src="p.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&q=80'" class="h-32 w-full object-cover rounded-lg border border-slate-700 mb-3" />
                    <h5 class="font-bold text-sm text-white">{{ p.name }}</h5>
                    <p class="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{{ p.description }}</p>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="font-black text-indigo-400 text-sm">{{ formatMoney(p.price) }}</span>
                    <button class="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] rounded transition">
                      Acheter
                    </button>
                  </div>
                </div>
                <div v-if="previewStoreProducts.length === 0" class="col-span-2 py-8 text-center text-slate-500 text-xs italic">
                  Aucun article publié dans cette boutique.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Create / Edit Store Modal -->
    <div v-if="isStoreModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <h3 class="font-bold text-lg text-[var(--color-text-primary)]">
          {{ storeForm.id ? 'Modifier la Boutique' : 'Créer un Magasin Marketplace' }}
        </h3>
        
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Nom de la boutique *</label>
            <input 
              type="text" 
              v-model="storeForm.name" 
              required 
              placeholder="Ex : TechSupplies Akwa"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Description</label>
            <textarea 
              v-model="storeForm.description" 
              rows="3" 
              placeholder="Décrivez votre boutique e-commerce..."
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Statut du magasin</label>
            <select 
              v-model="storeForm.status"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)]"
            >
              <option value="Active">Ouvert / En Ligne</option>
              <option value="Draft">Fermé / Brouillon</option>
            </select>
          </div>

          <!-- Warehouses selection -->
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Entrepôts associés</label>
            <div class="space-y-1.5 max-h-24 overflow-y-auto border border-[var(--color-border)] p-2.5 rounded-lg bg-[var(--color-background)]">
              <label v-for="wh in mockWarehouses" :key="wh.id" class="flex items-center space-x-2 text-sm text-[var(--color-text-primary)]">
                <input 
                  type="checkbox" 
                  :value="wh.id" 
                  v-model="storeForm.warehouseIds"
                  class="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4"
                />
                <span>🏢 {{ wh.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-3">
          <button 
            @click="isStoreModalOpen = false"
            class="px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-xs font-bold rounded-lg text-[var(--color-text-primary)] transition"
          >
            Annuler
          </button>
          <button 
            @click="saveStore"
            class="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold rounded-lg transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Product Manage Modal -->
    <div v-if="isProductModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div class="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <h3 class="font-bold text-lg text-[var(--color-text-primary)]">
          Gérer la Publication : {{ productForm.name }}
        </h3>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Affectation Boutique</label>
            <select 
              v-model="productForm.storeId"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)]"
            >
              <option value="">Non affecté / Pas en boutique</option>
              <option v-for="shop in stores" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Statut de publication</label>
            <select 
              v-model="productForm.status"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)]"
            >
              <option value="Draft">Brouillon</option>
              <option value="Published">Publié sur la Marketplace</option>
              <option value="Retired">Retiré du catalogue</option>
            </select>
          </div>

          <!-- Product description -->
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Description Marketplace</label>
            <textarea 
              v-model="productForm.description"
              rows="3"
              class="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            ></textarea>
          </div>

          <!-- Multiple images list -->
          <div>
            <label class="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Images du produit (Choisir plusieurs URL)</label>
            <div class="space-y-2">
              <div v-for="(img, idx) in productForm.images" :key="idx" class="flex items-center space-x-2">
                <input 
                  type="text" 
                  v-model="productForm.images[idx]"
                  class="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-2 text-xs text-[var(--color-text-primary)]"
                />
                <button @click="productForm.images.splice(idx, 1)" class="text-red-500 hover:text-red-700 text-xs">
                  Retirer
                </button>
              </div>
              <button 
                type="button" 
                @click="productForm.images.push('')"
                class="text-xs text-[var(--color-primary)] font-bold hover:underline"
              >
                + Ajouter une image
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-3">
          <button 
            @click="isProductModalOpen = false"
            class="px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-xs font-bold rounded-lg text-[var(--color-text-primary)] transition"
          >
            Annuler
          </button>
          <button 
            @click="saveProduct"
            class="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold rounded-lg transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/modules/auth.js';
import { useProductsStore } from '@/store/modules/products.js';
import { useToast } from 'vue-toastification';
import { BuildingStorefrontIcon, PlusIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const productsStore = useProductsStore();
const toast = useToast();

const tabs = [
  { id: 'stores', name: 'Mes Boutiques' },
  { id: 'catalog', name: 'Catalogue & Publications' },
  { id: 'builder', name: 'Design & Vitrine (No-Code) 🎨' },
  { id: 'preview', name: 'Aperçu Marketplace' }
];

const activeTab = ref('stores');
const selectedStoreId = ref('');
const filterStoreId = ref('');

// Dynamic Design builder state
const builderConfig = ref({
  colors: {
    primary: '#4f46e5',
    secondary: '#312e81',
    text: '#ffffff'
  },
  animation: 'none',
  widgets: []
});

const availableWidgets = [
  { name: 'Bannière Héro Promos', type: 'hero', title: 'OFFRES EXCLUSIVES', subtitle: 'La technologie à portée de main', description: 'Profitez de nos remises de gros et livraisons express.' },
  { name: 'Grille des Produits', type: 'products', title: 'Articles Recommandés' },
  { name: 'Bloc d\'Informations', type: 'info', title: 'Qualité & Support de Proximité', content: 'Tous nos articles sont sous garantie fabricant officielle.' },
  { name: 'Formulaire de Contact / Devis', type: 'contact' },
  { name: 'Pied de page (Réassurance B2B)', type: 'footer', features: [{ title: 'Livraison 48h', desc: 'Sur tout le territoire' }, { title: 'Paiement Sécurisé', desc: 'Mobile Money & Cash' }, { title: 'Garantie SAV', desc: 'Retour sous 7 jours' }] }
];

// Drag and drop helper state
const draggedWidget = ref(null);

const onDragStart = (evt, widget) => {
  draggedWidget.value = widget;
};

const onCanvasDrop = (evt) => {
  if (draggedWidget.value) {
    // Add copies to avoid references
    builderConfig.value.widgets.push({
      ...draggedWidget.value,
      id: draggedWidget.value.type + '_' + Date.now()
    });
    draggedWidget.value = null;
    toast.success("Widget ajouté au canvas !");
  }
};

const moveWidget = (idx, direction) => {
  const newIdx = idx + direction;
  if (newIdx >= 0 && newIdx < builderConfig.value.widgets.length) {
    const temp = builderConfig.value.widgets[idx];
    builderConfig.value.widgets[idx] = builderConfig.value.widgets[newIdx];
    builderConfig.value.widgets[newIdx] = temp;
  }
};

const initBuilder = () => {
  const saved = localStorage.getItem(`store_design_${selectedStoreId.value}`);
  if (saved) {
    try {
      builderConfig.value = JSON.parse(saved);
    } catch(e) {
      console.error(e);
    }
  } else {
    // Default initial template config
    builderConfig.value = {
      colors: {
        primary: '#4f46e5',
        secondary: '#312e81',
        text: '#ffffff'
      },
      animation: 'none',
      widgets: [
        { id: 'w_hero', type: 'hero', title: 'OFFRES EXCLUSIVES', subtitle: 'La technologie à portée de main', description: 'Profitez de nos remises de gros et livraisons express.' },
        { id: 'w_prod', type: 'products', title: 'Articles Recommandés' }
      ]
    };
  }
};

const saveBuilderDesign = () => {
  localStorage.setItem(`store_design_${selectedStoreId.value}`, JSON.stringify(builderConfig.value));
  toast.success("Structure et styles de la boutique enregistrés !");
};

const generatePublicLink = () => {
  // Sync current list of products to session storage so external preview can access it
  sessionStorage.setItem('products_vendor', JSON.stringify(publishedProducts.value));
  saveBuilderDesign();
  toast.info(`Lien généré : /store/external/${selectedStoreId.value}`);
};

const openExternalTab = () => {
  generatePublicLink();
  const routeUrl = `/store/external/${selectedStoreId.value}`;
  window.open(routeUrl, '_blank');
};

// Mock stores for current vendor
const stores = ref([
  {
    id: 'store_vendor_1_main',
    name: 'TechSupplies Cameroun Shop',
    description: 'Boutique officielle TechSupplies SARL pour la vente d\'ordinateurs HP ProBook, souris sans fil et accessoires informatiques.',
    status: 'Active',
    warehouseIds: ['wh_vendor_1'],
    createdAt: new Date().toISOString()
  }
]);

// Mock Warehouses for vendor
const mockWarehouses = [
  { id: 'wh_vendor_1', name: 'Entrepôt Vendeur Akwa' }
];

const getWarehouseName = (id) => {
  const wh = mockWarehouses.find(x => x.id === id);
  return wh ? wh.name : id;
};

const getStoreName = (id) => {
  const s = stores.value.find(x => x.id === id);
  return s ? s.name : 'Non affecté';
};

const currentStore = computed(() => {
  return stores.value.find(s => s.id === selectedStoreId.value) || stores.value[0];
});

// Seed default selectedStoreId if empty
if (stores.value.length > 0) {
  selectedStoreId.value = stores.value[0].id;
}

// Published/Draft products list matching current vendor products
const publishedProducts = ref(
  productsStore.products
    .filter(p => p.supplierId === authStore.user?.id || p.supplierId === 'usr_vendor_1')
    .map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description || 'Description standard de l\'article.',
      storeId: 'store_vendor_1_main',
      images: [
        p.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80'
      ],
      status: 'Published'
    }))
);

const filteredCatalogProducts = computed(() => {
  if (!filterStoreId.value) return publishedProducts.value;
  return publishedProducts.value.filter(p => p.storeId === filterStoreId.value);
});

const previewStoreProducts = computed(() => {
  return publishedProducts.value.filter(p => p.storeId === currentStore.value?.id && p.status === 'Published');
});

// Create/Edit Store state
const isStoreModalOpen = ref(false);
const storeForm = ref({
  id: '',
  name: '',
  description: '',
  status: 'Active',
  warehouseIds: []
});

const openCreateStoreModal = () => {
  storeForm.value = {
    id: '',
    name: '',
    description: '',
    status: 'Active',
    warehouseIds: []
  };
  isStoreModalOpen.value = true;
};

const editStore = (shop) => {
  storeForm.value = { ...shop };
  isStoreModalOpen.value = true;
};

const saveStore = () => {
  if (!storeForm.value.name) {
    toast.error("Le nom du magasin est requis.");
    return;
  }

  if (storeForm.value.id) {
    const idx = stores.value.findIndex(s => s.id === storeForm.value.id);
    if (idx > -1) {
      stores.value[idx] = { ...storeForm.value };
      toast.success("Boutique mise à jour avec succès !");
    }
  } else {
    const newStore = {
      ...storeForm.value,
      id: 'store_vendor_1_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    stores.value.push(newStore);
    selectedStoreId.value = newStore.id;
    toast.success("Magasin marketplace créé avec succès !");
  }

  isStoreModalOpen.value = false;
};

// Manage Product Publication state
const isProductModalOpen = ref(false);
const productForm = ref({
  id: '',
  name: '',
  storeId: '',
  status: 'Draft',
  description: '',
  images: []
});

const editProduct = (prod) => {
  productForm.value = { ...prod, images: [...prod.images] };
  isProductModalOpen.value = true;
};

const saveProduct = () => {
  const idx = publishedProducts.value.findIndex(p => p.id === productForm.value.id);
  if (idx > -1) {
    publishedProducts.value[idx] = { ...productForm.value };
    toast.success("Statut de publication de l'article mis à jour !");
  }
  isProductModalOpen.value = false;
};

const changeProductStatus = (id, newStatus) => {
  const prod = publishedProducts.value.find(p => p.id === id);
  if (prod) {
    prod.status = newStatus;
    toast.success(`Le produit a été ${newStatus === 'Published' ? 'publié' : 'retiré'} !`);
  }
};

const getStatusLabel = (status) => {
  if (status === 'Published') return 'Publié';
  if (status === 'Draft') return 'Brouillon';
  if (status === 'Retired') return 'Retiré';
  return status;
};

const formatMoney = (val) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(val).replace('XAF', 'FCFA');
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

onMounted(() => {
  if (stores.value.length > 0) {
    selectedStoreId.value = stores.value[0].id;
    initBuilder();
  }
});
</script>
