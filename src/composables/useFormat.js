import { formatCurrency, formatDate } from '@/utils/formatters.js';

export function useFormat() {
  return {
    formatCurrency,
    formatDate,
  };
}
