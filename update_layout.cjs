const fs = require('fs');
const file = 'c:/wamp64/www/projetSoutenanceV2.1/src/pages/public/ProductDetail.vue';
let content = fs.readFileSync(file, 'utf8');

// 1. Layout changes
content = content.replace('max-w-5xl mx-auto', 'max-w-[1600px] mx-auto');
content = content.replace(/md:col-span-5/g, 'lg:col-span-4');
content = content.replace(/md:col-span-7/g, 'lg:col-span-8');
content = content.replace(/md:grid-cols-12/g, 'lg:grid-cols-12');

// 2. Text size changes
content = content.replace(/text-\[9px\]/g, 'text-xs');
content = content.replace(/text-\[9\.5px\]/g, 'text-xs');
content = content.replace(/text-\[10px\]/g, 'text-sm');
content = content.replace(/text-\[10\.5px\]/g, 'text-sm');
content = content.replace(/text-\[11px\]/g, 'text-sm');
content = content.replace(/text-\[12px\]/g, 'text-base');

// 3. Script changes: Add otherProducts
if(!content.includes('const otherProducts =')) {
  content = content.replace('const similarProducts = computed(() => {', 
    'const otherProducts = computed(() => {\n  if (!product.value) return [];\n  return productsStore.products\n    .filter(p => p.categoryId !== product.value.categoryId && p.id !== product.value.id)\n    .sort(() => Math.random() - 0.5)\n    .slice(0, 8);\n});\n\nconst similarProducts = computed(() => {');
}

// 4. Template changes: Add Other Products Carousel
if(!content.includes('Autres Découvertes')) {
  const simBlock = `      <!-- SIMILAR RECOMMENDATIONS CAROUSEL (Horizontal Scroll) -->`;
  
  const otherBlock = `
      <!-- OTHER PRODUCTS CAROUSEL -->
      <div v-if="product && otherProducts.length > 0" class="pt-8 border-t border-[#F0EFEB] dark:border-[#0f2129] space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-sm font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block font-bold">DÉCOUVERTE</span>
            <h2 class="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white uppercase font-sans tracking-tight">🌟 Autres Produits à Découvrir</h2>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
          <div 
            v-for="op in otherProducts" 
            :key="op.id"
            @click="routeToSim(op.id)"
            class="bg-white dark:bg-[#091116] border border-[#F0EFEB] dark:border-slate-900/80 rounded-2xl p-4 hover:border-amber-500/50 dark:hover:border-amber-900/50 cursor-pointer group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <div class="space-y-3">
              <img :src="op.image" class="w-full h-40 object-cover rounded-xl border border-[#F0EFEB] dark:border-[#13252f]" />
              
              <div>
                <span class="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase font-bold">{{ op.sku }}</span>
                <h3 class="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white uppercase leading-normal mt-1 line-clamp-2 group-hover:text-amber-500 transition" :title="op.name">
                  {{ op.name }}
                </h3>
              </div>
            </div>

            <div class="pt-3 border-t border-[#F0EFEB] dark:border-slate-900/60 mt-4 flex justify-between items-center font-mono">
              <span class="text-emerald-600 dark:text-emerald-400 font-bold text-base">{{ formatCFA(op.price) }}</span>
              <span class="text-slate-500 font-sans text-xs">{{ op.stock }} {{ op.unit }}s</span>
            </div>
          </div>
        </div>
      </div>
`;
  content = content.replace(simBlock, simBlock + '\n' + otherBlock);
}

fs.writeFileSync(file, content, 'utf8');
console.log('ProductDetail.vue updated successfully.');
