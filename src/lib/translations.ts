export type Language = 'en' | 'pt' | 'es';

export const translations = {
  en: {
    // Navigation
    settings: 'Settings',
    general: 'General',
    preferences: 'Preferences',
    integrations: 'Integrations',

    // Settings Page
    settingsTitle: 'Settings',
    settingsDescription: 'Manage your preferences, integrations and account information',
    sections: 'Sections',

    // Tabs
    generalConfig: 'General Configuration',
    generalDesc: 'General information and account',
    preferencesDesc: 'Customize your experience',
    integrationsDesc: 'Connect platforms',

    // General Settings
    accountInfo: 'Account Information',
    email: 'Email',
    fullName: 'Full Name',
    language: 'Language',
    theme: 'Theme',
    notification: 'Notifications',
    save: 'Save',
    logout: 'Logout',

    // Theme
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',

    // Notifications
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    enabled: 'Enabled',
    disabled: 'Disabled',

    // Success/Error
    saved: 'Saved successfully',
    error: 'An error occurred',
  },
  pt: {
    // Navigation
    settings: 'Configurações',
    general: 'Geral',
    preferences: 'Preferências',
    integrations: 'Integrações',

    // Settings Page
    settingsTitle: 'Configurações',
    settingsDescription: 'Gerencie suas preferências, integrações e informações de conta',
    sections: 'Seções',

    // Tabs
    generalConfig: 'Configuração Geral',
    generalDesc: 'Informações gerais e conta',
    preferencesDesc: 'Personalize sua experiência',
    integrationsDesc: 'Conecte plataformas',

    // General Settings
    accountInfo: 'Informações da Conta',
    email: 'Email',
    fullName: 'Nome Completo',
    language: 'Idioma',
    theme: 'Tema',
    notification: 'Notificações',
    save: 'Salvar',
    logout: 'Sair',

    // Theme
    light: 'Claro',
    dark: 'Escuro',
    auto: 'Automático',

    // Notifications
    emailNotifications: 'Notificações por Email',
    pushNotifications: 'Notificações Push',
    enabled: 'Ativado',
    disabled: 'Desativado',

    // Success/Error
    saved: 'Salvo com sucesso',
    error: 'Ocorreu um erro',
  },
  es: {
    // Navigation
    settings: 'Configuración',
    general: 'General',
    preferences: 'Preferencias',
    integrations: 'Integraciones',

    // Settings Page
    settingsTitle: 'Configuración',
    settingsDescription: 'Administra tus preferencias, integraciones e información de cuenta',
    sections: 'Secciones',

    // Tabs
    generalConfig: 'Configuración General',
    generalDesc: 'Información general y cuenta',
    preferencesDesc: 'Personaliza tu experiencia',
    integrationsDesc: 'Conecta plataformas',

    // General Settings
    accountInfo: 'Información de la Cuenta',
    email: 'Correo Electrónico',
    fullName: 'Nombre Completo',
    language: 'Idioma',
    theme: 'Tema',
    notification: 'Notificaciones',
    save: 'Guardar',
    logout: 'Cerrar Sesión',

    // Theme
    light: 'Claro',
    dark: 'Oscuro',
    auto: 'Automático',

    // Notifications
    emailNotifications: 'Notificaciones por Correo',
    pushNotifications: 'Notificaciones Push',
    enabled: 'Habilitado',
    disabled: 'Deshabilitado',

    // Success/Error
    saved: 'Guardado exitosamente',
    error: 'Ocurrió un error',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] || translations.en[key];
}
