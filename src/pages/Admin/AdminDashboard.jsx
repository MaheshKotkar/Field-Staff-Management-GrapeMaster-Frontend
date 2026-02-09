import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    useTheme,
    CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Clock,
    UserCheck,
    TrendingUp
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import api from '../../services/api';
import MainLayout from '../../components/Layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';
import AnimatedButton from '../../components/animations/AnimatedButton';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
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

    if (loading) {
        return (
            <MainLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress size={60} thickness={4} />
                </Box>
            </MainLayout>
        );
    }

    const consultantData = {
        labels: metrics.consultantActivity.map(a => a.name),
        datasets: [{
            label: 'Visits',
            data: metrics.consultantActivity.map(a => a.visitCount),
            backgroundColor: theme.palette.primary.main,
            borderRadius: 8,
        }]
    };

    const regionalData = {
        labels: metrics.regionalCoverage.map(r => r.region),
        datasets: [{
            data: metrics.regionalCoverage.map(r => r.count),
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

    return (
        <MainLayout>
            <Box sx={{ px: 4, py: 3, bgcolor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <Box>
                    <Typography variant="h5" fontWeight="900">Admin Portal</Typography>
                    <Typography variant="caption" color="text.secondary">Corporate Oversight & Analytics</Typography>
                </Box>
                <AnimatedButton
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/admin/verify')}
                    startIcon={<UserCheck size={20} />}
                >
                    Verification Center
                </AnimatedButton>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 8 }}>
                <Grid container spacing={3} mb={4}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Total Staff" value={metrics.totals.staff} icon={Users} color="primary" delay={0.1} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Farmers" value={metrics.totals.farmers} icon={TrendingUp} color="secondary" delay={0.2} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Total Visits" value={metrics.totals.visits} icon={Calendar} color="primary" delay={0.3} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Pending Reports" value={metrics.totals.pending} icon={Clock} color="error" delay={0.4} />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <AnimatedCard delay={0.5} sx={{ p: 4, mb: 3 }}>
                            <Typography variant="h6" fontWeight="800" mb={4}>Consultant Activity</Typography>
                            <Box sx={{ height: 350 }}>
                                <Bar
                                    data={consultantData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                                    }}
                                />
                            </Box>
                        </AnimatedCard>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <AnimatedCard delay={0.6} sx={{ p: 4 }}>
                                    <Typography variant="subtitle1" fontWeight="800" mb={4}>Fertilizer Trends</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {metrics.recommendationTrends.fertilizers.map((f, i) => (
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
                                        {metrics.recommendationTrends.pesticides.map((p, i) => (
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
                                <Typography variant="subtitle2" fontWeight="800" mb={2}>Productivity Insights</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                    Current field operations are focused in <strong>{metrics.regionalCoverage.length}</strong> districts.
                                    Average visits per consultant is <strong>{(metrics.totals.visits / metrics.totals.staff).toFixed(1)}</strong>.
                                </Typography>
                            </Box>
                        </AnimatedCard>
                    </Grid>
                </Grid>
            </Container>
        </MainLayout>
    );
};

export default AdminDashboard;
