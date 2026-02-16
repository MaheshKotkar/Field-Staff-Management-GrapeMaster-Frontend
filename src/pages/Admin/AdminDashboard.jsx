import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    useTheme,
    CircularProgress,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Paper,
    TableRow,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Clock,
    UserCheck,
    TrendingUp,
    Map,
    BarChart3,
    Activity,
    ClipboardList,
    Trash2,
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import NotificationBell from '../../components/layout/NotificationBell';
import AnimatedCard from '../../components/animations/AnimatedCard';
import AnimatedButton from '../../components/animations/AnimatedButton';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <AnimatedCard delay={delay} sx={{ height: '100%' }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ p: 2, bgcolor: `${color}.50`, color: `${color}.main`, borderRadius: 4, display: 'flex' }}>
                <Icon size={28} />
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600">{title}</Typography>
                <Typography variant="h4" fontWeight="800">{value}</Typography>
            </Box>
        </Box>
    </AnimatedCard>
);

const AdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    const fetchMetrics = async () => {
        try {
            const { data } = await api.get('/admin/metrics');
            setMetrics(data);
        } catch (error) {
            console.error('Error fetching admin metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/admin/users/${userToDelete._id}`);

            // Update local state
            setMetrics(prev => ({
                ...prev,
                consultantStats: prev.consultantStats.filter(u => u._id !== userToDelete._id),
                totals: {
                    ...prev.totals,
                    staff: Math.max(0, (prev.totals?.staff || 0) - 1)
                }
            }));

            // Also remove from consultant activity if present
            fetchMetrics(); // simpler to just refetch to get all derived stats correct

            // Show success message
            setSnackbar({
                open: true,
                message: 'Consultant deleted successfully',
                severity: 'error' // User asked for "red alert", error severity is red in MUI
            });

        } catch (error) {
            console.error('Error deleting user:', error);
            // You might want to show an error notification here
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress size={60} thickness={4} />
                </Box>
            </MainLayout>
        );
    }

    if (!metrics) {
        return (
            <MainLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <Typography color="error">Failed to load admin metrics. Please refresh.</Typography>
                </Box>
            </MainLayout>
        );
    }

    const consultantData = {
        labels: (metrics.consultantActivity || []).map(a => a.name || 'Unknown'),
        datasets: [{
            label: 'Visits',
            data: (metrics.consultantActivity || []).map(a => a.visitCount || 0),
            backgroundColor: theme.palette.primary.main,
            borderRadius: 8,
        }]
    };

    const regionalData = {
        labels: (metrics.regionalCoverage || []).map(r => r.region || 'Unknown'),
        datasets: [{
            data: (metrics.regionalCoverage || []).map(r => r.count || 0),
            backgroundColor: [
                '#64dd17',
                '#7c4dff',
                '#00b0ff',
                '#ffab00',
                '#ff5252'
            ],
            borderWidth: 0,
        }]
    };

    const trendData = {
        labels: (metrics.visitTrends || []).map(t => t._id || ''),
        datasets: [{
            label: 'Daily Visits',
            data: (metrics.visitTrends || []).map(t => t.count || 0),
            fill: true,
            borderColor: theme.palette.primary.main,
            backgroundColor: 'rgba(100, 221, 23, 0.1)',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: theme.palette.primary.main,
        }]
    };

    return (
        <MainLayout>
            <Box sx={{
                px: { xs: 2, md: 4 },
                py: { xs: 2.5, md: 3 },
                bgcolor: 'white',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                position: 'sticky',
                top: 0,
                zIndex: 10,
                gap: 2
            }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h5" fontWeight="900">Admin Portal</Typography>
                    <Typography variant="caption" color="text.secondary">Corporate Oversight & Analytics</Typography>
                </Box>
                <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} alignItems="center" gap={2} flexWrap="wrap">
                    <NotificationBell />
                    <AnimatedButton
                        variant="outlined"
                        onClick={() => navigate('/admin/reports')}
                        startIcon={<ClipboardList size={20} />}
                        sx={{ borderRadius: 3, px: 3, color: 'secondary.main', borderColor: 'secondary.main', '&:hover': { bgcolor: 'secondary.50', borderColor: 'secondary.main' } }}
                    >
                        Daily Reports
                    </AnimatedButton>
                    <AnimatedButton
                        fullWidth={tabValue === 0}
                        variant="contained"
                        onClick={() => navigate('/admin/verify')}
                        startIcon={<UserCheck size={20} />}
                        sx={{ borderRadius: 3, px: 3 }}
                    >
                        Verification Center
                    </AnimatedButton>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, pb: 8, px: { xs: 2, md: 4 } }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 3, md: 4 } }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, v) => setTabValue(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 64,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }
                        }}
                    >
                        <Tab icon={<BarChart3 size={18} />} iconPosition="start" label="Overview" />
                        <Tab icon={<Users size={18} />} iconPosition="start" label="Staff Tracking" />
                        <Tab icon={<Map size={18} />} iconPosition="start" label="Regional Trends" />
                    </Tabs>
                </Box>

                {tabValue === 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Grid container spacing={3} mb={4}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard title="Total Staff" value={metrics.totals?.staff || 0} icon={Users} color="primary" delay={0.1} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard title="Farmers" value={metrics.totals?.farmers || 0} icon={TrendingUp} color="secondary" delay={0.2} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard title="Total Visits" value={metrics.totals?.visits || 0} icon={Calendar} color="primary" delay={0.3} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard title="Pending Reports" value={metrics.totals?.pending || 0} icon={Clock} color="error" delay={0.4} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, lg: 8 }}>
                                <AnimatedCard delay={0.5} sx={{ p: 4, mb: 3 }}>
                                    <Typography variant="h6" fontWeight="800" mb={4}>Visit Performance Trend</Typography>
                                    <Box sx={{ height: 350 }}>
                                        <Line
                                            data={trendData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false } },
                                                scales: {
                                                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                                    x: { grid: { display: false } }
                                                }
                                            }}
                                        />
                                    </Box>
                                </AnimatedCard>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <AnimatedCard delay={0.6} sx={{ p: 4 }}>
                                            <Typography variant="subtitle1" fontWeight="800" mb={4}>Fertilizer Trends</Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {(metrics.recommendationTrends?.fertilizers || []).map((f, i) => (
                                                    <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="text.secondary">{f._id}</Typography>
                                                        <Typography variant="body2" fontWeight="700">{f.count} recs</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </AnimatedCard>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <AnimatedCard delay={0.7} sx={{ p: 4 }}>
                                            <Typography variant="subtitle1" fontWeight="800" mb={4}>Pesticide Trends</Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {(metrics.recommendationTrends?.pesticides || []).map((p, i) => (
                                                    <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="text.secondary">{p._id}</Typography>
                                                        <Typography variant="body2" fontWeight="700">{p.count} recs</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </AnimatedCard>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12, lg: 4 }}>
                                <AnimatedCard delay={0.6} sx={{ p: 4, height: '100%' }}>
                                    <Typography variant="h6" fontWeight="800" mb={4}>Region Coverage</Typography>
                                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                        <Doughnut
                                            data={regionalData}
                                            options={{
                                                plugins: { legend: { position: 'bottom' } },
                                                cutout: '70%'
                                            }}
                                        />
                                    </Box>
                                    <Box mt={4}>
                                        <Typography variant="subtitle2" fontWeight="800" mb={2}>Quick Insights</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Activity size={18} color={theme.palette.primary.main} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Average <strong>{((metrics.totals?.visits || 0) / (metrics.totals?.staff || 1)).toFixed(1)}</strong> visits per consultant.
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Map size={18} color={theme.palette.secondary.main} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Active in <strong>{(metrics.regionalCoverage || []).length}</strong> distinct districts.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </AnimatedCard>
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {tabValue === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <AnimatedCard sx={{ p: 0, overflow: 'hidden' }}>
                            <Box p={3} borderBottom="1px solid #e2e8f0">
                                <Typography variant="h6" fontWeight="800">Staff Performance</Typography>
                            </Box>
                            <Box sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 800 }}>
                                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Consultant</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Visits</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Farmers</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Avg. Recs</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="right">Last Active</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(metrics.consultantStats || []).map((staff, i) => (
                                            <TableRow key={i} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={2}>
                                                        <Avatar sx={{ bgcolor: theme.palette.primary.main, fontWeight: 700 }}>
                                                            {staff.name ? staff.name[0] : '?'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="700">{staff.name || 'Unknown'}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{staff.email || ''}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" fontWeight="700">{staff.visitCount || 0}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" fontWeight="700">{staff.uniqueFarmers || 0}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" fontWeight="700">{staff.averageRecs || 0}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">
                                                        {staff.lastVisitDate ? new Date(staff.lastVisitDate).toLocaleDateString() : 'Never'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={() => handleDeleteClick(staff)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <Trash2 size={18} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </AnimatedCard>
                    </motion.div>
                )}

                {tabValue === 2 && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <AnimatedCard sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight="800" mb={4}>Visit Distribution by Consultant</Typography>
                                    <Box sx={{ height: 400 }}>
                                        <Bar
                                            data={consultantData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false } },
                                                scales: {
                                                    y: { beginAtZero: true, grid: { display: false } },
                                                    x: { grid: { display: false } }
                                                }
                                            }}
                                        />
                                    </Box>
                                </AnimatedCard>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <AnimatedCard sx={{ p: 4, height: '100%' }}>
                                    <Typography variant="h6" fontWeight="800" mb={4}>District Breakdown</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {(metrics.regionalCoverage || []).map((r, i) => (
                                            <Box key={i}>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" fontWeight="600">{r.region}</Typography>
                                                    <Typography variant="body2" color="primary.main" fontWeight="700">{r.count} Farmers</Typography>
                                                </Box>
                                                <Box sx={{ height: 8, bgcolor: 'grey.100', borderRadius: 4, overflow: 'hidden' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(r.count / (metrics.totals?.farmers || 1)) * 100}%` }}
                                                        style={{ height: '100%', background: theme.palette.primary.main }}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </AnimatedCard>
                            </Grid>
                        </Grid>
                    </motion.div>
                )}
            </Container>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove <strong>{userToDelete?.name}</strong>?
                        This action cannot be undone and will prevent them from accessing the system.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }} autoFocus>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
                    >
                        Delete Consultant
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 700 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
};

export default AdminDashboard;
