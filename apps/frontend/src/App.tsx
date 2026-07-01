import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/auth.store'

// Pages
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import BookingCalendarPage from '@/pages/BookingCalendarPage'
import CustomersPage from '@/pages/CustomersPage'
import CustomerDetailPage from '@/pages/CustomerDetailPage'
import CourtsPage from '@/pages/CourtsPage'
import InvoicesPage from '@/pages/InvoicesPage'
import PrintInvoicePage from '@/pages/PrintInvoicePage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import InventoryPage from '@/pages/InventoryPage'
import VenuesPage from '@/pages/VenuesPage'
import ClientBookingPage from '@/pages/client/ClientBookingPage'
import ClientBookingSuccessPage from '@/pages/client/ClientBookingSuccessPage'
import ClientBookingLookupPage from '@/pages/client/ClientBookingLookupPage'
import ClientBookingDetailPage from '@/pages/client/ClientBookingDetailPage'
import { ADMIN_ROUTES, adminRoute } from '@/lib/routes'

// Layout
import { AppLayout } from '@/components/layout/AppLayout'

function LegacyCustomerRedirect() {
    const { id } = useParams<{ id: string }>()
    return <Navigate to={id ? ADMIN_ROUTES.customerDetail(id) : ADMIN_ROUTES.customers} replace />
}

function LegacyInvoicePrintRedirect() {
    const { id } = useParams<{ id: string }>()
    return <Navigate to={id ? ADMIN_ROUTES.invoicePrint(id) : ADMIN_ROUTES.invoices} replace />
}

function App() {
    const { isAuthenticated } = useAuthStore()
    const requireAdmin = (element: ReactNode) =>
        isAuthenticated ? element : <Navigate to={ADMIN_ROUTES.login} replace />

    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/"
                    element={<Navigate to="/book" replace />}
                />
                <Route
                    path="/book"
                    element={<ClientBookingPage />}
                />
                <Route
                    path="/book/success/:id"
                    element={<ClientBookingSuccessPage />}
                />
                <Route
                    path="/booking-lookup"
                    element={<ClientBookingLookupPage />}
                />
                <Route
                    path="/booking/:id"
                    element={<ClientBookingDetailPage />}
                />
                <Route
                    path={ADMIN_ROUTES.login}
                    element={isAuthenticated ? <Navigate to={ADMIN_ROUTES.dashboard} replace /> : <LoginPage />}
                />
                <Route
                    path={ADMIN_ROUTES.forgotPassword}
                    element={isAuthenticated ? <Navigate to={ADMIN_ROUTES.dashboard} replace /> : <ForgotPasswordPage />}
                />

                {/* Print routes - no layout */}
                <Route
                    path={adminRoute('/invoices/:id/print')}
                    element={requireAdmin(<PrintInvoicePage />)}
                />

                {/* Protected routes */}
                <Route
                    path="/admin/*"
                    element={
                        isAuthenticated ? (
                            <AppLayout>
                                <Routes>
                                    <Route index element={<DashboardPage />} />
                                    <Route path="calendar" element={<BookingCalendarPage />} />
                                    <Route path="customers" element={<CustomersPage />} />
                                    <Route path="customers/:id" element={<CustomerDetailPage />} />
                                    <Route path="courts" element={<CourtsPage />} />
                                    <Route path="invoices" element={<InvoicesPage />} />
                                    <Route path="inventory" element={<InventoryPage />} />
                                    <Route path="venues" element={<VenuesPage />} />
                                    <Route path="reports" element={<ReportsPage />} />
                                    <Route path="settings" element={<SettingsPage />} />
                                    <Route path="*" element={<Navigate to={ADMIN_ROUTES.dashboard} replace />} />
                                </Routes>
                            </AppLayout>
                        ) : (
                            <Navigate to={ADMIN_ROUTES.login} replace />
                        )
                    }
                />

                {/* Legacy admin route redirects */}
                <Route path="/login" element={<Navigate to={ADMIN_ROUTES.login} replace />} />
                <Route path="/forgot-password" element={<Navigate to={ADMIN_ROUTES.forgotPassword} replace />} />
                <Route path="/calendar" element={<Navigate to={ADMIN_ROUTES.calendar} replace />} />
                <Route path="/customers" element={<Navigate to={ADMIN_ROUTES.customers} replace />} />
                <Route path="/customers/:id" element={<LegacyCustomerRedirect />} />
                <Route path="/courts" element={<Navigate to={ADMIN_ROUTES.courts} replace />} />
                <Route path="/invoices" element={<Navigate to={ADMIN_ROUTES.invoices} replace />} />
                <Route path="/inventory" element={<Navigate to={ADMIN_ROUTES.inventory} replace />} />
                <Route path="/venues" element={<Navigate to={ADMIN_ROUTES.venues} replace />} />
                <Route path="/reports" element={<Navigate to={ADMIN_ROUTES.reports} replace />} />
                <Route path="/settings" element={<Navigate to={ADMIN_ROUTES.settings} replace />} />
                <Route path="/invoices/:id/print" element={<LegacyInvoicePrintRedirect />} />
            </Routes>
            <Toaster />
        </>
    )
}

export default App

