import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    en: {
      welcome: 'Welcome to Enterprise Control Center',
    },
    fr: {
      welcome: "Bienvenue sur le Centre de Contrôle d'Entreprise",
    }
  }
});

export default i18n;
