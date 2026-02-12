import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    TextField,
    Button,
    Paper,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ClipboardCheck, Send } from 'lucide-react';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';
import { useAuth } from '../../context/AuthContext';

const DailySummary = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState({ visitCount: 0, isSubmitted: false, report: null });
    const [formData, setFormData] = useState({ totalKm: '', summary: '' });
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const fetchDailyStats = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/reports/daily-stats');
            setStats(data);
            if (data.report) {
                setFormData({
                    totalKm: data.report.totalKm.toString(),
                    summary: data.report.summary || ''
                });
            }
        } catch (error) {
            console.error('Error fetching daily stats:', error);
            setNotification({
                open: true,
                message: 'Failed to fetch daily stats',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyStats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.totalKm) return;

        try {
            setSubmitting(true);
            await api.post('/reports', {
                totalKm: Number(formData.totalKm),
                summary: formData.summary,
                visitCount: stats.visitCount
            });
            setNotification({
                open: true,
                message: 'Daily report submitted successfully!',
                severity: 'success'
            });
            fetchDailyStats();
        } catch (error) {
            setNotification({
                open: true,
                message: error.response?.data?.message || 'Failed to submit report',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress color="primary" />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container maxWidth="md" sx={{ mt: 4, pb: 6 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Box mb={4}>
                        <Typography variant="h4" fontWeight="900" gutterBottom>Daily Summary</Typography>
                        <Typography variant="body1" color="text.secondary">
                            Review your day's work and submit your end-of-day report.
                        </Typography>
                    </Box>

                    <Grid container spacing={3} mb={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <AnimatedCard delay={0.1}>
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Box sx={{ p: 1.5, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 3, display: 'inline-flex', mb: 2 }}>
                                        <Calendar size={24} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">Date</Typography>
                                    <Typography variant="h6" fontWeight="800">{new Date().toLocaleDateString()}</Typography>
                                </Box>
                            </AnimatedCard>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <AnimatedCard delay={0.2}>
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Box sx={{ p: 1.5, bgcolor: 'secondary.50', color: 'secondary.main', borderRadius: 3, display: 'inline-flex', mb: 2 }}>
                                        <ClipboardCheck size={24} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">Total Visits</Typography>
                                    <Typography variant="h6" fontWeight="800">{stats.visitCount}</Typography>
                                </Box>
                            </AnimatedCard>
                        </Grid>
                    </Grid>

                    <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                        {stats.isSubmitted ? (
                            <Box textAlign="center" py={4}>
                                <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
                                    Your report for today has already been submitted.
                                </Alert>
                                <Typography variant="h6" fontWeight="800" gutterBottom>Report Details</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography color="text.secondary">Total Kilometers Covered:</Typography>
                                    <Typography fontWeight="700">{stats.report?.totalKm} KM</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                    <Typography color="text.secondary">Day Summary:</Typography>
                                    <Typography mt={1}>{stats.report?.summary || 'No summary provided.'}</Typography>
                                </Box>
                            </Box>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <Typography variant="h6" fontWeight="800" mb={3}>Submit EOD Report</Typography>
                                <Box display="flex" flexDirection="column" gap={3}>
                                    <TextField
                                        label="Total Kilometers Covered"
                                        variant="outlined"
                                        type="number"
                                        required
                                        fullWidth
                                        value={formData.totalKm}
                                        onChange={(e) => setFormData({ ...formData, totalKm: e.target.value })}
                                        InputProps={{
                                            startAdornment: <MapPin size={20} style={{ marginRight: 10, color: '#64748b' }} />,
                                            endAdornment: <Typography variant="body2" color="text.secondary">KM</Typography>
                                        }}
                                    />
                                    <TextField
                                        label="Summary of the day"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        placeholder="Briefly describe your activities and any challenges faced..."
                                        fullWidth
                                        value={formData.summary}
                                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={submitting}
                                        startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Final Report'}
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Paper>
                </motion.div>
            </Container>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
};


export default DailySummary;
