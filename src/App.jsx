import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Lazy load pages for performance
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Login/Register'));
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const VerificationManager = lazy(() => import('./pages/Admin/VerificationManager'));
const ProtectedAdminRoute = lazy(() => import('./components/layout/ProtectedAdminRoute'));
const FarmersList = lazy(() => import('./pages/Farmers/FarmersList'));
const VisitsList = lazy(() => import('./pages/FarmVisits/VisitsList'));
const SettingsPage = lazy(() => import('./pages/Settings/Settings'));
const DailySummary = lazy(() => import('./pages/Dashboard/DailySummary'));
const AdminReports = lazy(() => import('./pages/Admin/AdminReports'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs'));

const App = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Suspense fallback={
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress color="primary" />
                </Box>
            }>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/farmers"
                        element={
                            <ProtectedRoute>
                                <FarmersList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/visits"
                        element={
                            <ProtectedRoute>
                                <VisitsList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/daily-summary"
                        element={
                            <ProtectedRoute>
                                <DailySummary />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedAdminRoute>
                                <AdminDashboard />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/verify"
                        element={
                            <ProtectedAdminRoute>
                                <VerificationManager />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/reports"
                        element={
                            <ProtectedAdminRoute>
                                <AdminReports />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/" element={<Landing />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Box>
    );
};

export default App;
