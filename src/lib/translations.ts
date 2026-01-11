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

    // Login Page
    welcome: 'Welcome to',
    symphony: 'Symphony',
    signIn: 'Sign In',
    enterPlatform: 'Enter the platform',
    password: 'Password',
    loginButton: 'Enter the platform',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    register: 'Register',
    registerButton: 'Create Account',

    // Dashboard
    dashboard: 'Dashboard',
    briefing: 'Briefing',
    calendar: 'Calendar',
    comments: 'Comments',
    content: 'Content',
    references: 'References',
    reports: 'Reports',
    profile: 'Profile',

    // Success/Error
    saved: 'Saved successfully',
    error: 'An error occurred',
    loginError: 'Login error',
    userNotFound: 'User not found',
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

    // Login Page
    welcome: 'Bem-vindo à',
    symphony: 'Symphony',
    signIn: 'Entrar',
    enterPlatform: 'Entrar na plataforma',
    password: 'Senha',
    loginButton: 'Entrar na plataforma',
    forgotPassword: 'Esqueceu a senha?',
    noAccount: 'Não tem uma conta?',
    register: 'Registrar',
    registerButton: 'Criar Conta',

    // Dashboard
    dashboard: 'Painel',
    briefing: 'Briefing',
    calendar: 'Calendário',
    comments: 'Comentários',
    content: 'Conteúdo',
    references: 'Referências',
    reports: 'Relatórios',
    profile: 'Perfil',

    // Success/Error
    saved: 'Salvo com sucesso',
    error: 'Ocorreu um erro',
    loginError: 'Erro ao fazer login',
    userNotFound: 'Usuário não encontrado',
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

    // Login Page
    welcome: 'Bienvenido a',
    symphony: 'Symphony',
    signIn: 'Iniciar Sesión',
    enterPlatform: 'Entrar a la plataforma',
    password: 'Contraseña',
    loginButton: 'Entrar a la plataforma',
    forgotPassword: '¿Olvidó su contraseña?',
    noAccount: '¿No tiene una cuenta?',
    register: 'Registrarse',
    registerButton: 'Crear Cuenta',

    // Dashboard
    dashboard: 'Panel',
    briefing: 'Briefing',
    calendar: 'Calendario',
    comments: 'Comentarios',
    content: 'Contenido',
    references: 'Referencias',
    reports: 'Reportes',
    profile: 'Perfil',

    // Success/Error
    saved: 'Guardado exitosamente',
    error: 'Ocurrió un error',
    loginError: 'Error al iniciar sesión',
    userNotFound: 'Usuario no encontrado',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] || translations.en[key];
}
