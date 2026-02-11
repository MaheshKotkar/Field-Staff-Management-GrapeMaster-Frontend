import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Slide,
    CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    TrendingUp,
    MapPin,
    Bell,
    Search,
    Plus,
    PlusCircle,
    ArrowRight,
    TrendingDown,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AnimatedCard from '../../components/animations/AnimatedCard';
import TimelineView from './TimelineView';
import AdminAnalytics from './AdminAnalytics';
import ImageUpload from './ImageUpload';
import VisitStepper from '../FarmVisits/VisitStepper';
import FarmerRegistration from '../../components/farmers/FarmerRegistration';
import MainLayout from '../../components/layout/MainLayout';
import AnimatedButton from '../../components/animations/AnimatedButton';
import { useAuth } from '../../context/AuthContext';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DashboardStatCard = ({ title, value, icon: Icon, color, delay, trend, trendValue }) => (
    <AnimatedCard delay={delay} sx={{ height: '100%' }}>
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box sx={{ p: 1.5, bgcolor: `${color}.50`, color: `${color}.main`, borderRadius: 3, display: 'flex' }}>
                    <Icon size={24} />
                </Box>
                <Box sx={{ bgcolor: trend === 'up' ? 'success.50' : 'error.50', px: 1, py: 0.5, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {trend === 'up' ? <TrendingUp size={14} color="#10b981" /> : <TrendingDown size={14} color="#ef4444" />}
                    <Typography variant="caption" fontWeight="700" color={trend === 'up' ? 'success.main' : 'error.main'}>
                        {trendValue}%
                    </Typography>
                </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight="500">{title}</Typography>
            <Typography variant="h4" fontWeight="800" sx={{ my: 0.5 }}>{typeof value === 'number' ? value.toLocaleString() : value}</Typography>
        </Box>
    </AnimatedCard>
);

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [openStepper, setOpenStepper] = useState(false);
    const [openFarmerReg, setOpenFarmerReg] = useState(false);
    const [stats, setStats] = useState({
        farmers: 0,
        visits: 0,
        recommendations: 0,
        visitTrend: 0,
        loading: true
    });
    const [recentVisits, setRecentVisits] = useState([]);

    const fetchData = async () => {
        try {
            const [farmersRes, visitsRes] = await Promise.all([
                api.get('/farmers'),
                api.get('/visits')
            ]);

            const allVisits = visitsRes.data;
            const recCount = allVisits.filter(v => v.recommendation?.fertilizer || v.recommendation?.pesticide).length;

            // Simple trend calculation: visits in last 7 days vs previous 7 days
            const now = new Date();
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const prev7To14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

            const recentVisitsCount = allVisits.filter(v => new Date(v.createdAt) > last7Days).length;
            const olderVisitsCount = allVisits.filter(v => {
                const d = new Date(v.createdAt);
                return d > prev7To14Days && d <= last7Days;
            }).length;

            let trend = 0;
            if (olderVisitsCount > 0) {
                trend = Math.round(((recentVisitsCount - olderVisitsCount) / olderVisitsCount) * 100);
            } else if (recentVisitsCount > 0) {
                trend = 100;
            }

            setStats({
                farmers: farmersRes.data.length,
                visits: allVisits.length,
                recommendations: recCount,
                visitTrend: trend,
                loading: false
            });

            setRecentVisits(allVisits.slice(-5).reverse());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MainLayout>
            {/* Header */}
            <Box className="nav-blur" sx={{
                px: { xs: 2.5, md: 4 },
                py: { xs: 2, md: 2.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Typography variant="h5" fontWeight="900" color="text.primary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                    Overview
                </Typography>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, bgcolor: 'grey.100', borderRadius: 3, px: 2, py: 1, alignItems: 'center', gap: 1 }}>
                        <Search size={18} color="#64748b" />
                        <Box component="input" placeholder="Search data..." sx={{ border: 'none', bgcolor: 'transparent', outline: 'none', fontSize: '14px', width: 150 }} />
                    </Box>
                    <IconButton size="large" sx={{ display: { xs: 'none', sm: 'flex' } }}><Bell size={22} /></IconButton>
                    <AnimatedButton
                        variant="outlined"
                        startIcon={<PlusCircle size={20} />}
                        onClick={() => setOpenFarmerReg(true)}
                        sx={{
                            minWidth: { xs: '48px', md: 'auto' },
                            px: { xs: 1, md: 2.5 },
                            borderRadius: 3,
                            py: 1,
                            borderColor: 'divider',
                            '& .MuiButton-startIcon': { mr: { xs: 0, md: 1 } }
                        }}
                    >
                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, fontWeight: 700 }}>Register Farmer</Box>
                    </AnimatedButton>
                    <AnimatedButton
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => setOpenStepper(true)}
                        sx={{
                            minWidth: { xs: '48px', md: 'auto' },
                            px: { xs: 1, md: 2.5 },
                            borderRadius: 3,
                            py: 1,
                            '& .MuiButton-startIcon': { mr: { xs: 0, md: 1 } }
                        }}
                    >
                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, fontWeight: 700 }}>New Visit</Box>
                    </AnimatedButton>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 6 }}>
                {/* Welcome Section */}
                <Box mb={6} display="flex" justifyContent="space-between" alignItems="flex-end">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Typography variant="h3" fontWeight="900" sx={{ mb: 1 }}>Hello, {user?.name || 'Mahesh'}!</Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight="400">Everything looks great on the field today.</Typography>
                    </motion.div>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton onClick={() => setOpenStepper(true)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                            <Plus size={24} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} mb={6}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DashboardStatCard
                            title="Total Farmers"
                            value={stats.loading ? '...' : stats.farmers}
                            icon={Users}
                            color="primary"
                            delay={0.1}
                            trend="up"
                            trendValue={12}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DashboardStatCard
                            title="Farm Visits"
                            value={stats.loading ? '...' : stats.visits}
                            icon={Calendar}
                            color="secondary"
                            delay={0.2}
                            trend="up"
                            trendValue={8}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DashboardStatCard
                            title="Recommendations"
                            value={stats.loading ? '...' : stats.recommendations}
                            icon={TrendingUp}
                            color="primary"
                            delay={0.3}
                            trend="up"
                            trendValue={stats.loading ? 0 : Math.abs(stats.visitTrend)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DashboardStatCard
                            title="Recent Growth"
                            value={stats.loading ? '...' : `${stats.visitTrend}%`}
                            icon={MapPin}
                            color="secondary"
                            delay={0.4}
                            trend={stats.visitTrend >= 0 ? 'up' : 'down'}
                            trendValue={stats.loading ? 0 : Math.abs(stats.visitTrend)}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Main Analytics */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <AnimatedCard delay={0.5} sx={{ p: 4, mb: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                                <Box>
                                    <Typography variant="h6" fontWeight="800">Operational Sync</Typography>
                                    <Typography variant="caption" color="text.secondary">Weekly activity breakdown</Typography>
                                </Box>
                                <AnimatedButton variant="outlined" size="small">Export Data</AnimatedButton>
                            </Box>
                            <AdminAnalytics visits={recentVisits} />
                        </AnimatedCard>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <AnimatedCard delay={0.6} sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="800" mb={3}>Upload Media</Typography>
                                    <ImageUpload />
                                </AnimatedCard>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <AnimatedCard delay={0.7} sx={{ p: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                        <Typography variant="subtitle1" fontWeight="800">Quick Actions</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {[
                                            { label: 'Register New Farmer', color: '#64dd17', action: () => setOpenFarmerReg(true) },
                                            user?.role === 'staff' && { label: 'Submit Daily Summary', color: '#fbbf24', action: () => navigate('/daily-summary') },
                                            { label: 'View Weather Forecast', color: '#7c4dff', action: () => { } },
                                            { label: 'Sync Offline Data', color: '#64dd17', action: () => { } }
                                        ].filter(Boolean).map((btn, i) => (
                                            <motion.div key={i} whileHover={{ x: 8 }} transition={{ type: 'spring' }}>
                                                <Button
                                                    fullWidth
                                                    onClick={btn.action}
                                                    sx={{
                                                        justifyContent: 'space-between',
                                                        bgcolor: 'grey.50',
                                                        color: 'text.primary',
                                                        p: 2,
                                                        borderRadius: 3,
                                                        '&:hover': { bgcolor: 'primary.50', color: 'primary.main' }
                                                    }}
                                                    endIcon={<ArrowRight size={18} />}
                                                >
                                                    {btn.label}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </Box>
                                </AnimatedCard>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Activity Timeline */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <AnimatedCard delay={0.6} sx={{ p: 4, height: '100%' }}>
                            <Typography variant="h6" fontWeight="800" mb={4}>Recent Activity</Typography>
                            <TimelineView visits={recentVisits} loading={stats.loading} />
                            <AnimatedButton fullWidth variant="text" color="secondary" sx={{ mt: 2 }}>
                                View All Activity
                            </AnimatedButton>
                        </AnimatedCard>
                    </Grid>
                </Grid>
            </Container>

            {/* Farm Visit Stepper Modal */}
            <Dialog
                fullScreen
                open={openStepper}
                onClose={() => setOpenStepper(false)}
                TransitionComponent={Transition}
            >
                <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
                    <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
                        <IconButton onClick={() => setOpenStepper(false)}><Plus style={{ transform: 'rotate(45deg)' }} /></IconButton>
                        <Typography variant="h6" fontWeight="800">New Farm Visit</Typography>
                    </Box>
                    <Container maxWidth="md" sx={{ mt: 4 }}>
                        <VisitStepper onComplete={() => {
                            setOpenStepper(false);
                            fetchData();
                        }} />
                    </Container>
                </Box>
            </Dialog>

            {/* Farmer Registration Modal */}
            <FarmerRegistration
                open={openFarmerReg}
                onClose={() => setOpenFarmerReg(false)}
                onSuccess={() => fetchData()}
            />
        </MainLayout>
    );
};

export default Dashboard;
