# Module Fournisseur - Documentation du Backoffice

Ce document décrit la structure, la logique métier et les fonctionnalités de chaque onglet du Backoffice Fournisseur, ainsi que les composants associés.

---

## Vue d'ensemble
Le module Fournisseur permet de gérer l'ensemble des opérations B2B d'un fournisseur ou d'un producteur. L'interface a été conçue pour être claire, moderne, et entièrement en français. 

Toute la navigation se fait via le composant `src/layouts/SupplierLayout.vue`, qui contient une barre latérale (Sidebar) rétractable permettant d'accéder aux différents modules du système.

---

## 1. Tableau de bord (Dashboard)
- **Composant(s)** : `src/pages/supplier/Dashboard.vue`
- **Logique** : Fournit une vue globale des performances de l'entreprise. Il affiche des métriques clés (chiffre d'affaires, commandes en attente, alertes de stock) via des graphiques et des cartes dynamiques pour une prise de décision rapide.

---

## 2. Commandes (Orders)
- **Composant principal** : `src/pages/supplier/Orders/Index.vue`
- **Sous-pages** : `Detail.vue`, `Prepare.vue`, `ShippingLabels.vue`
- **Logique** : 
  - Gérer les commandes B2B reçues.
  - La page **Index** liste les commandes avec leur statut (Nouveau, En Préparation, Prêt, Expédié).
  - La page **Prepare** permet d'attribuer des lots de produits spécifiques à une commande (Logique FIFO : le système suggère de prélever les produits dans les lots les plus anciens en premier pour éviter les péremptions).
  - La page **ShippingLabels** génère des étiquettes d'expédition pour faciliter le traitement logistique.

---

## 3. Logistique et Transport (Logistics)
- **Composant principal** : `src/pages/supplier/Logistics/Index.vue`
- **Sous-pages** : `Carriers.vue`, `Create.vue`
- **Logique** :
  - Centralise la gestion des expéditions et du suivi des colis.
  - Gère les différents transporteurs et partenaires logistiques, ainsi que les bordereaux d'expédition.

---

## 4. Entrepôts et Stocks (Warehouses)
- **Composant principal** : `src/pages/supplier/Warehouses/Index.vue`
- **Sous-pages** : `Stock.vue`, `Adjustments.vue`, `Transfers.vue`, `Create.vue`, `Detail.vue`
- **Logique** :
  - L'entrepôt est l'unité centrale de stockage physique.
  - Gère la localisation des stocks, la surveillance des lots (FIFO) pour prévenir l'expiration des produits, les ajustements de stock suite à des audits, et les transferts de marchandises entre plusieurs entrepôts d'un même fournisseur.

---

## 5. Boutiques et Points de Vente (Stores)
- **Composant principal** : `src/pages/supplier/Stores/Index.vue`
- **Sous-pages** : `POSConfig.vue`, `Sales.vue`, `Create.vue`, `Detail.vue`
- **Logique** :
  - Contrairement aux entrepôts, les "Boutiques" représentent des points de vente terminaux (POS).
  - Permet de gérer la configuration des vitrines virtuelles, les caisses physiques (si existantes) et le suivi des ventes au détail ou comptoir.

---

## 6. Achats et Approvisionnement (Purchases / Procurements)
- **Composant principal** : `src/pages/supplier/Purchases/Index.vue`
- **Sous-pages** : `Create.vue`, `Receive.vue`, `Returns.vue`
- **Logique** :
  - Sert à gérer les commandes de matières premières ou de marchandises auprès des sous-traitants/agriculteurs (Bons de commande / Purchase Orders).
  - Permet d'intégrer les stocks entrants dans le système FIFO (Réception).

---

## 7. Appels d'Offres (RFQ)
- **Composants** : `src/pages/supplier/RFQ/Create.vue`, `Offers.vue`, `Received.vue`, `Sent.vue`
- **Logique** :
  - Un système d'enchères/demandes de devis. Le fournisseur peut publier des appels d'offres pour obtenir les meilleurs prix de ses partenaires, ou répondre à des appels d'offres envoyés par de potentiels acheteurs sur la place de marché.

---

## 8. Finances et Trésorerie (Finance)
- **Composant principal** : `src/pages/supplier/Finance/Index.vue`, `Withdrawals.vue`
- **Sous-pages** : `Balance.vue`, `Commissions.vue`, `Invoices.vue`, `Transactions.vue`
- **Logique** :
  - Gère tout le flux monétaire : historiques de transactions, émission de factures, calcul des commissions de la plateforme.
  - La page **Retraits (Withdrawals)** permet de transférer l'argent disponible sur la plateforme vers un compte bancaire ou un portefeuille Mobile Money (MTN, Orange).

---

## 9. Dépenses Opérationnelles (Expenses)
- **Composant principal** : `src/pages/supplier/Expenses/Index.vue`
- **Sous-pages** : `Categories.vue`, `Create.vue`
- **Logique** :
  - Comptabilité des coûts de fonctionnement interne (salaires, loyers d'entrepôt, douane, carburant).
  - Fournit des indicateurs pour évaluer la rentabilité réelle.

---

## 10. Équipe et Utilisateurs (Users & Team)
- **Composant principal** : `src/pages/supplier/Users/Index.vue`, `src/pages/supplier/Team/Index.vue`
- **Sous-pages** : `Permissions.vue`, `Roles.vue`, `Create.vue`
- **Logique** :
  - Permet d'inviter de nouveaux collaborateurs (caissiers, magasiniers, managers).
  - Assignation fine des permissions (ex: restreindre un utilisateur à la simple expédition des colis, sans accès aux finances).

---

## 11. Paramètres (Settings)
- **Composant principal** : `src/pages/supplier/Settings/Index.vue`
- **Sous-pages** : `General.vue`, `Legal.vue`, `Payments.vue`, `Shipping.vue`, `Taxes.vue`
- **Logique** :
  - Centralise les configurations générales de l'entreprise : informations légales, validation KYC (Know Your Customer) pour la conformité, paramètres d'expédition et données de taxation (RCCM, NUI).
