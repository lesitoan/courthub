import { Routes, Route, Navigate } from 'react-router-dom'
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

// Layout
import { AppLayout } from '@/components/layout/AppLayout'

function App() {
    const { isAuthenticated } = useAuthStore()

    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
                />
                <Route
                    path="/forgot-password"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
                />

                {/* Print routes - no layout */}
                <Route
                    path="/invoices/:id/print"
                    element={isAuthenticated ? <PrintInvoicePage /> : <Navigate to="/login" replace />}
                />

                {/* Protected routes */}
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <AppLayout>
                                <Routes>
                                    <Route path="/" element={<DashboardPage />} />
                                    <Route path="/calendar" element={<BookingCalendarPage />} />
                                    <Route path="/customers" element={<CustomersPage />} />
                                    <Route path="/customers/:id" element={<CustomerDetailPage />} />
                                    <Route path="/courts" element={<CourtsPage />} />
                                    <Route path="/invoices" element={<InvoicesPage />} />
                                    <Route path="/inventory" element={<InventoryPage />} />
                                    <Route path="/venues" element={<VenuesPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </AppLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
            <Toaster />
        </>
    )
}

export default App

