<template>
  <div class="space-y-6">

    <!-- HEADER BLOCK -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 shrink-0">
      <div>
        <h1 class="text-xl font-bold font-mono text-[var(--color-text-primary)] flex items-center gap-2">
          <HeartIcon class="w-5 h-5 text-[var(--color-primary)]" />
          <span>Moniteurs d'État et de Santé du Cluster de Nœuds</span>
        </h1>
        <p class="text-xs text-[var(--color-text-secondary)]">Effectuez des diagnostics de télémétrie de cluster en temps réel, vérifiez la latence du serveur et surveillez la santé des conteneurs.</p>
      </div>
      
      <span class="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono text-[9px] uppercase font-bold border border-emerald-500/20 rounded-md">
        Score de Santé Global du Moteur : 98%
      </span>
    </div>

    <!-- SYSTEM ALERTS / STATUS METRICS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Status Card 1 -->
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase font-bold">Disponibilité du Registre</span>
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] block">99,98%</span>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-1 font-mono">30 derniers jours opérationnels</p>
        </div>
      </div>

      <!-- Status Card 2 -->
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase font-bold">Taille de la File d'Attente</span>
          <span class="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] block">12 en attente</span>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-1 font-mono">Emails sortants & Webhooks</p>
        </div>
      </div>

      <!-- Status Card 3 -->
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase font-bold">État des Sauvegardes</span>
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] block">Nominal</span>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-1 font-mono">Dernier instantané il y a 2h</p>
        </div>
      </div>

      <!-- Status Card 4 -->
      <div class="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase font-bold">Sockets Actifs</span>
          <span class="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
        </div>
        <div>
          <span class="text-2xl font-bold font-mono text-[var(--color-text-primary)] block">402 actifs</span>
          <p class="text-[10px] text-[var(--color-text-secondary)] mt-1 font-mono">Connexions WebSockets ouvertes</p>
        </div>
      </div>

    </div>

    <!-- METRICS GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
      <div class="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
        <span class="text-[var(--color-text-secondary)] uppercase">Serveur de Base de Données</span>
        <span class="text-sm font-bold text-[var(--color-text-primary)] mt-2 block">SLA PostgreSQL : 99,9%</span>
        <span class="text-emerald-500 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Connecté (3ms)</span>
        </span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
        <span class="text-[var(--color-text-secondary)] uppercase">Hôte Applicatif Central</span>
        <span class="text-sm font-bold text-[var(--color-text-primary)] mt-2 block">Charge CPU : 12,1%</span>
        <span class="text-emerald-500 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Équilibré (2 nœuds)</span>
        </span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
        <span class="text-[var(--color-text-secondary)] uppercase">Sockets Orange & MTN</span>
        <span class="text-sm font-bold text-[var(--color-text-primary)] mt-2 block">Webhooks actifs</span>
        <span class="text-emerald-500 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Écoute en temps réel</span>
        </span>
      </div>
      <div class="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col justify-between">
        <span class="text-[var(--color-text-secondary)] uppercase">Moteur de Génération PDF</span>
        <span class="text-sm font-bold text-[var(--color-text-primary)] mt-2 block">Nœud Worker Wasm</span>
        <span class="text-emerald-500 text-[10px] mt-1 block flex items-center space-x-1">
          <span class="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
          <span>Inactif (nominal)</span>
        </span>
      </div>
    </div>

    <!-- SCHEMATIC GRAPH -->
    <div class="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-4">
      <h2 class="text-sm font-bold font-mono text-[var(--color-text-primary)] uppercase">Topologie Logique des Nœuds et Matrice Ping</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-2">
          <span class="text-[var(--color-primary)] font-bold flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-[var(--color-primary)] rounded-full"></span>
            <span>Nœud A - Hôte Centre Douala</span>
          </span>
          <p class="text-[var(--color-text-secondary)] text-[11px]">Routeur principal. Gère les transactions Orange Money & met en cache les tarifs B2B.</p>
          <span class="text-emerald-500 block text-[10px]">Ping : SLA 8ms</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-2">
          <span class="text-[var(--color-primary)] font-bold flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-[var(--color-primary)] rounded-full"></span>
            <span>Nœud B - Hôte de Secours Yaoundé</span>
          </span>
          <p class="text-[var(--color-text-secondary)] text-[11px]">Miroir d'état symétrique. Active le mode veille instantanément en cas de panne du Nœud A.</p>
          <span class="text-emerald-500 block text-[10px]">SLA de secours actif</span>
        </div>
        <div class="p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl space-y-2">
          <span class="text-[var(--color-primary)] font-bold flex items-center space-x-1">
            <span class="h-1.5 w-1.5 bg-[var(--color-primary)] rounded-full"></span>
            <span>Nœud Worker C - Générateur de Documents</span>
          </span>
          <p class="text-[var(--color-text-secondary)] text-[11px]">Microservice autonome traitant les rapports PDF de bordereaux et d'étiquettes de transaction.</p>
          <span class="text-emerald-500 block text-[10px]">Ping : SLA 12ms</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline';
</script>
