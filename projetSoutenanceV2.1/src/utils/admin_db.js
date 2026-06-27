import { ref, watch } from 'vue';

const KEY_ADMIN_PORTAL = 'admin_portal_db_v1';

const defaultDisputes = [
  {
    id: 'dsp_1',
    disputeRef: 'DISP-2026-001',
    orderId: 'ord_1',
    orderRef: 'B2B-ORD-2026-6-00018',
    buyer: 'Alpha Retail Ltd',
    supplier: 'Société Camerounaise de Cacao (Soca-Cacao)',
    product: 'Cacao Noir Brut Supérieur Sangmélima',
    amount: 1540000,
    category: 'Product Quality',
    description: 'The batch was received with humidity levels exceeding the agreed B2B tolerance threshold of 7%. Laboratory tests in Douala Port show 11.4% humidity which may compromise conservation.',
    status: 'open', // 'open', 'under_review', 'resolved', 'frozen', 'dismissed'
    createdAt: '2026-06-12T14:24:00Z',
    comments: [
      { id: '1', author: 'Buyer', text: 'We require a 30% discount refund or a full replacement of this batch.', date: '2026-06-12T14:30:00Z' },
      { id: '2', author: 'Supplier', text: 'We dried the fèves for 6 full days. The humidity might be due to transit sealing conditions by third-party logistics.', date: '2026-06-13T09:15:00Z' }
    ]
  },
  {
    id: 'dsp_2',
    disputeRef: 'DISP-2026-002',
    orderId: 'ord_5',
    orderRef: 'B2B-ORD-2026-6-00045',
    buyer: 'Spar Douala Mall Procurement',
    supplier: 'Centrale Solaire du Cameroun',
    product: 'Kit Solaire Domestique 250W + Ampoules',
    amount: 5800000,
    category: 'Damaged Goods',
    description: '3 solar controller modules (MPPT units) out of 40 are completely non-responsive on startup. Looks like physical impact on the LCD screens during road shipping.',
    status: 'under_review',
    createdAt: '2026-06-14T08:12:00Z',
    comments: [
      { id: '1', author: 'Buyer', text: 'The packages were marked fragile but showed forklift scratches on the crate.', date: '2026-06-14T08:20:00Z' }
    ]
  },
  {
    id: 'dsp_3',
    disputeRef: 'DISP-2026-003',
    orderId: 'ord_12',
    orderRef: 'B2B-ORD-2026-5-00112',
    buyer: 'Dovv Supermarchés S.A.',
    supplier: 'Poivre Blanc de Penja Premium Coop',
    product: 'Poivre Blanc de Penja Premium',
    amount: 8500000,
    category: 'Delayed Delivery',
    description: 'Delivery is delayed by 18 days. The supplier claims administrative blockage at Bafoussam scale checkpoint. Escrow needs to be frozen.',
    status: 'frozen',
    createdAt: '2026-06-15T11:00:00Z',
    comments: [
      { id: '1', author: 'System Admin', text: 'Escrow payouts frozen by Supervisor until logistics waybill tracking proof is uploaded.', date: '2026-06-15T11:05:00Z' }
    ]
  },
  {
    id: 'dsp_4',
    disputeRef: 'DISP-2026-004',
    orderId: 'ord_24',
    orderRef: 'B2B-ORD-2026-5-00234',
    buyer: 'Kribi Fishmongers Union',
    supplier: 'Établissements Mbouda Frères & Cie',
    product: 'Huile de Palme Rouge Pure Socapalm',
    amount: 1200000,
    category: 'Missing Quantity',
    description: 'Ordered 10 barrels of 200L palm oil. Received only 8 barrels. Delivery agent claims they only received 8 drums at warehouse dispatch.',
    status: 'resolved',
    createdAt: '2026-06-10T16:45:00Z',
    comments: [
      { id: '1', author: 'Buyer', text: 'We confirmed 8 items delivered on the waybill signature card.', date: '2026-06-10T16:50:00Z' },
      { id: '2', author: 'System Admin', text: 'Partial refund of 240,000 XAF approved. Remaining 960,000 XAF released to supplier.', date: '2026-06-11T14:02:00Z' }
    ]
  }
];

const defaultSupportTickets = [
  {
    id: 'tkt_1',
    ticketRef: 'SUPP-9812',
    user: 'Amadou Fotso (Soca-Cacao)',
    email: 'contact@socacacao.cm',
    role: 'Supplier',
    subject: 'Cannot upload RCCM certificate validation pdf',
    message: 'The system gives error 500 when uploading our corporate tax certificate file from Yaoundé. The pdf size is 4.8MB. Is there an upload file size ceiling limit?',
    category: 'Technical',
    priority: 'high',
    status: 'open', // 'open', 'in_progress', 'resolved', 'closed'
    createdAt: '2026-06-16T15:30:00Z',
    assignedTo: 'Jean-Pierre Admin',
    replies: [
      { id: '1', author: 'Support Agent', text: 'Hello Amadou, there is indeed a 2MB ceiling on PDF uploads to optimize storage index speeds. Please compress or optimize the PDF and try uploading again.', date: '2026-06-16T16:04:00Z' }
    ]
  },
  {
    id: 'tkt_2',
    ticketRef: 'SUPP-9813',
    user: 'Yolande Bella (Spar Procurement)',
    email: 'procure@sparkdouala.com',
    role: 'Buyer',
    subject: 'MTN Mobile Money webhook delay',
    message: 'We paid 2,500,000 XAF via MoMo, the money was debited but the order is still flagged as Held in Escrow and not paid on the dashboard. Please verify our reference standard MOMO-PAY-983020.',
    category: 'Billing',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: '2026-06-17T09:12:00Z',
    assignedTo: 'Marie-Therese Finance',
    replies: []
  },
  {
    id: 'tkt_3',
    ticketRef: 'SUPP-9814',
    user: 'Pierre Kamdem (GIC Moungo)',
    email: 'kamdem@moungocoffee.cm',
    role: 'Supplier',
    subject: 'Warehouse FIFO dispatch sorting order',
    message: 'We noticed the FIFO batch dispatch printed list suggests the newer batch b_2 if both were updated on the same day. How is the timestamp split calculated?',
    category: 'Inventory',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2026-06-15T10:00:00Z',
    assignedTo: 'Alizeta Intern',
    replies: [
      { id: '1', author: 'Support Agent', text: 'Hi Pierre, the sorting fallback uses batch entry order IDs if timestamps are identical. We have adjusted your batch IDs to ensure perfect chronological sorting.', date: '2026-06-15T14:22:00Z' }
    ]
  },
  {
    id: 'tkt_4',
    ticketRef: 'SUPP-9815',
    user: 'Robert Kane (Cashier)',
    email: 'cashier@ouagasuper.local',
    role: 'POS Staff',
    subject: 'POS print ticket margin layout alignment',
    message: 'Printed 80mm thermal tickets have their right border cut off when outputted to our Star Micronics USB cashier printer. Content overlaps.',
    category: 'Technical',
    priority: 'low',
    status: 'open',
    createdAt: '2026-06-17T16:20:00Z',
    assignedTo: null,
    replies: []
  }
];

const defaultSystemLogs = [
  { id: 'log_1', action: 'SYSTEM_STARTUP', details: 'Root Admin Console fully loaded. Port 3000 reverse proxy verified. Core nodes synchronized.', author: 'SYSTEM', date: '2026-06-18T05:00:00Z', level: 'info' },
  { id: 'log_2', action: 'DB_AUTO_OPTIMIZE', details: 'Drizzle indexes optimized. Cache cleared. 820 stock entries verified under FIFO sequence.', author: 'CRON_ENGINE', date: '2026-06-18T05:05:00Z', level: 'debug' },
  { id: 'log_3', action: 'USER_LOGIN', details: 'Active login from IP 195.24.120.12 (Douala, CM) utilizing authority key usr_admin.', author: 'Platform Admin Supervisor', date: '2026-06-18T06:56:00Z', level: 'security' },
];

const defaultBackups = [
  { id: 'bak_1', name: 'PLATFORM_FULL_SNAP_20260617_2359.tar.gz', date: '2026-06-17T23:59:00Z', size: '1.45 GB', status: 'Healthy', author: 'CRON_DOCKER' },
  { id: 'bak_2', name: 'PLATFORM_DB_ONLY_20260618_0600.sql', date: '2026-06-18T06:00:00Z', size: '256 MB', status: 'Healthy', author: 'CRON_ENGINE' },
  { id: 'bak_3', name: 'PLATFORM_MEDIA_FILES_20260615_1200.tar.gz', date: '2026-06-15T12:00:00Z', size: '4.12 GB', status: 'Healthy', author: 'Admin Super' }
];

const saved = localStorage.getItem(KEY_ADMIN_PORTAL);
const parsed = saved ? JSON.parse(saved) : {};

export const disputes = ref(parsed.disputes || defaultDisputes);
export const supportTickets = ref(parsed.supportTickets || defaultSupportTickets);
export const systemLogs = ref(parsed.systemLogs || defaultSystemLogs);
export const backups = ref(parsed.backups || defaultBackups);

export const commissionRate = ref(parsed.commissionRate || 3.5); // 3.5% commission by default
export const payoutSettings = ref(parsed.payoutSettings || {
  minWithdrawal: 10000,
  maxWithdrawalDaily: 5000000,
  autoApprovePayouts: false,
  securityLockHours: 24
});

watch(
  [disputes, supportTickets, systemLogs, backups, commissionRate, payoutSettings],
  () => {
    const serialized = {
      disputes: disputes.value,
      supportTickets: supportTickets.value,
      systemLogs: systemLogs.value,
      backups: backups.value,
      commissionRate: commissionRate.value,
      payoutSettings: payoutSettings.value
    };
    localStorage.setItem(KEY_ADMIN_PORTAL, JSON.stringify(serialized));
  },
  { deep: true }
);

// Logging Helper
export function writeAuditLog(action, details, author = 'Admin Supervisor', level = 'info') {
  const newLog = {
    id: `log_${Date.now()}`,
    action: action.toUpperCase(),
    details,
    author,
    date: new Date().toISOString(),
    level
  };
  systemLogs.value.unshift(newLog);
}
