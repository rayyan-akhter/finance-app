// Configuration system for easy switching between demo and production modes

export interface AppConfig {
  // App settings
  appName: string
  appUrl: string
  
  // Feature flags
  realtimeEnabled: boolean
  notificationsEnabled: boolean
  pwaEnabled: boolean
  
  // API settings
  apiUrl: string
  wsUrl: string
  
  // Authentication
  authEnabled: boolean
  
  // Demo mode settings
  demoMode: boolean
  demoData: {
    balance: number
    income: number
    expenses: number
    savings: number
    investments: number
  }
}

// Demo configuration (current mode)
const demoConfig: AppConfig = {
  appName: 'FinanceApp (Demo)',
  appUrl: 'http://localhost:3000',
  
  // Features enabled for demo
  realtimeEnabled: false, // Disabled for demo to avoid WebSocket complexity
  notificationsEnabled: true,
  pwaEnabled: false,
  
  // Local API
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3001',
  
  // Authentication
  authEnabled: true,
  
  // Demo mode
  demoMode: true,
  demoData: {
    balance: 45250.75,
    income: 8500.00,
    expenses: 3200.50,
    savings: 12500.00,
    investments: 28750.75
  }
}

// Production configuration (for future use)
const productionConfig: AppConfig = {
  appName: 'FinanceApp',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com',
  
  // Features enabled for production
  realtimeEnabled: true,
  notificationsEnabled: true,
  pwaEnabled: true,
  
  // Production API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://your-domain.com/api',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://your-domain.com',
  
  // Authentication
  authEnabled: true,
  
  // Demo mode
  demoMode: false,
  demoData: {
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    investments: 0
  }
}

// Function to get current configuration
export function getConfig(): AppConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  const forceDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  
  if (forceDemo || (!isProduction && process.env.NEXT_PUBLIC_DEMO_MODE !== 'false')) {
    return demoConfig
  }
  
  return productionConfig
}

// Export current config
export const config = getConfig()

// Helper functions
export const isDemoMode = () => config.demoMode
export const isRealtimeEnabled = () => config.realtimeEnabled
export const isNotificationsEnabled = () => config.notificationsEnabled

// Demo data helpers
export const getDemoData = () => config.demoData
export const getDemoBalance = () => config.demoData.balance
export const getDemoIncome = () => config.demoData.income
export const getDemoExpenses = () => config.demoData.expenses
export const getDemoSavings = () => config.demoData.savings
export const getDemoInvestments = () => config.demoData.investments

// Environment helpers
export const isDevelopment = () => process.env.NODE_ENV === 'development'
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isTest = () => process.env.NODE_ENV === 'test'

// Feature flags
export const features = {
  realtime: isRealtimeEnabled(),
  notifications: isNotificationsEnabled(),
  pwa: config.pwaEnabled,
  auth: config.authEnabled
}

// API endpoints
export const api = {
  baseUrl: config.apiUrl,
  auth: {
    login: `${config.apiUrl}/auth/login`,
    register: `${config.apiUrl}/auth/register`,
    logout: `${config.apiUrl}/auth/logout`
  },
  transactions: {
    list: `${config.apiUrl}/transactions`,
    create: `${config.apiUrl}/transactions`,
    update: (id: string) => `${config.apiUrl}/transactions/${id}`,
    delete: (id: string) => `${config.apiUrl}/transactions/${id}`
  }
}

// WebSocket configuration
export const websocket = {
  url: config.wsUrl,
  enabled: config.realtimeEnabled,
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  }
} 