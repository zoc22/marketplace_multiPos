<template>
  <div class="space-y-6 max-w-5xl mx-auto" id="buyer-loyalty">
    <!-- Header -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">Points de Fidélité</h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-1">Cumulez des points à chaque commande et échangez-les contre des cadeaux ou réductions.</p>
    </div>

    <!-- Points Card & Tier Progress -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Balance Card -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <span class="text-xs uppercase font-mono text-[var(--color-text-secondary)] font-bold">Mon Solde Actuel</span>
          <div class="text-4xl font-black text-amber-500 font-mono mt-2">1 250 PTS</div>
        </div>
        <div class="pt-4 border-t border-[var(--color-border)] mt-4 flex items-center space-x-2">
          <span class="px-2 py-0.5 bg-amber-500/10 text-amber-600 font-bold text-[10px] rounded-full uppercase">Statut Or</span>
          <span class="text-xs text-[var(--color-text-secondary)]">Multiplicateur x1.25</span>
        </div>
      </div>

      <!-- Progression to Next Tier -->
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm md:col-span-2 space-y-4">
        <h3 class="font-bold text-sm text-[var(--color-text-primary)]">Prochain Niveau : Statut Platine</h3>
        <p class="text-xs text-[var(--color-text-secondary)]">Gagnez encore 750 points pour débloquer le Statut Platine et profitez de la livraison gratuite illimitée.</p>
        
        <!-- Progress bar -->
        <div class="space-y-1">
          <div class="w-full bg-[var(--color-background)] h-3 rounded-full overflow-hidden border border-[var(--color-border)]">
            <div class="bg-amber-500 h-full rounded-full" style="width: 62.5%;"></div>
          </div>
          <div class="flex justify-between text-[10px] font-mono text-[var(--color-text-secondary)] font-bold">
            <span>Or (1 000 pts)</span>
            <span>Platine (2 000 pts)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Points Ledger History -->
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
        <h3 class="font-bold text-xs uppercase text-[var(--color-text-primary)] tracking-wider">Historique de mes Points</h3>
      </div>
      <div class="overflow-x-auto text-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-semibold uppercase">
              <th class="p-4">Transaction / Action</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border)]">
            <tr v-for="log in pointsHistory" :key="log.id" class="hover:bg-[var(--color-surface-hover)]/40 transition">
              <td class="p-4">
                <span class="font-bold text-[var(--color-text-primary)] block">{{ log.action }}</span>
                <span class="text-xs text-[var(--color-text-muted)]">Réf: {{ log.refId }}</span>
              </td>
              <td class="p-4 text-[var(--color-text-secondary)] font-mono">{{ log.date }}</td>
              <td class="p-4 text-right font-bold text-emerald-500 font-mono">+ {{ log.points }} pts</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pointsHistory = ref([
  {
    id: 1,
    action: 'Achat validé - Intrants agricoles Zama-Agro',
    refId: 'B2B-PO-2026-0812-25',
    date: '18 juin 2026',
    points: 250
  },
  {
    id: 2,
    action: 'Avis validé sur Nylon Packaging Douala',
    refId: 'REV-00192',
    date: '12 mai 2026',
    points: 50
  },
  {
    id: 3,
    action: 'Achat validé - Commande Emballages Nylon Packaging',
    refId: 'B2C-00109',
    date: '10 mai 2026',
    points: 120
  }
]);
</script>
