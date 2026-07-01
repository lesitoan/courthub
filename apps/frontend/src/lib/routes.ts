export const ADMIN_BASE = '/admin'
export const ADMIN_LOGIN = `${ADMIN_BASE}/login`
export const ADMIN_FORGOT_PASSWORD = `${ADMIN_BASE}/forgot-password`

export const adminRoute = (path = '') => {
    if (!path || path === '/') return ADMIN_BASE
    return `${ADMIN_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

export const ADMIN_ROUTES = {
    dashboard: ADMIN_BASE,
    login: ADMIN_LOGIN,
    forgotPassword: ADMIN_FORGOT_PASSWORD,
    calendar: adminRoute('/calendar'),
    customers: adminRoute('/customers'),
    customerDetail: (id: string) => adminRoute(`/customers/${id}`),
    courts: adminRoute('/courts'),
    venues: adminRoute('/venues'),
    invoices: adminRoute('/invoices'),
    invoicePrint: (id: string) => adminRoute(`/invoices/${id}/print`),
    inventory: adminRoute('/inventory'),
    reports: adminRoute('/reports'),
    settings: adminRoute('/settings'),
    notifications: adminRoute('/notifications'),
} as const
