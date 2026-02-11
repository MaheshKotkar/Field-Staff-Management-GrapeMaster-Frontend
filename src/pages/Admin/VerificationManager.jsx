import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    Dialog,
    DialogContent,
    useMediaQuery,
    useTheme,
    Stack,
    Paper,
    Divider,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Check,
    X,
    Clock,
    ShieldCheck,
    MapPin,
    Search,
    Filter,
    Maximize2,
    Calendar,
    Download,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';
import AnimatedButton from '../../components/animations/AnimatedButton';

const VerificationManager = () => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(true);
    const [visits, setVisits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [previewImage, setPreviewImage] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchVisits = async () => {
        try {
            const { data } = await api.get('/admin/visits');
            setVisits(data || []);
        } catch (error) {
            console.error('Error fetching admin visits:', error);
            setVisits([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = () => {
        const headers = ["Date", "ID", "Consultant", "Farmer", "Village", "Status", "Crop Type", "Crop Stage", "Remarks"];
        const csvRows = [headers.join(",")];

        filteredVisits.forEach(visit => {
            const row = [
                visit.visitDate ? new Date(visit.visitDate).toISOString().split('T')[0] : 'N/A',
                visit._id,
                `"${visit.consultant?.name || 'Unknown'}"`,
                `"${visit.farmer?.name || 'Unknown'}"`,
                `"${visit.farmer?.village || 'Unknown'}"`,
                visit.status,
                `"${visit.cropType || 'N/A'}"`,
                `"${visit.cropStage || 'N/A'}"`,
                `"${(visit.remarks || '').replace(/"/g, '""').replace(/\n/g, ' ')}"` // Escape quotes and newlines
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Visit_Reports_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/visits/${id}/verify`, { status });
            setSnackbar({
                open: true,
                message: `Report ${status === 'verified' ? 'verified' : 'rejected'} successfully!`,
                severity: status === 'verified' ? 'success' : 'error'
            });
            fetchVisits();
        } catch (error) {
            console.error('Error updating status:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update report status.',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const filteredVisits = Array.isArray(visits) ? visits.filter(visit => {
        const consultantName = visit?.consultant?.name?.toLowerCase() || '';
        const farmerName = visit?.farmer?.name?.toLowerCase() || '';
        const villageName = visit?.farmer?.village?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            consultantName.includes(search) ||
            farmerName.includes(search) ||
            villageName.includes(search);

        const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) : [];

    const getStatusChip = (status) => {
        switch (status) {
            case 'verified': return <Chip size="small" label="Verified" color="success" sx={{ fontWeight: 700 }} icon={<ShieldCheck size={14} />} />;
            case 'rejected': return <Chip size="small" label="Rejected" color="error" sx={{ fontWeight: 700 }} icon={<X size={14} />} />;
            default: return <Chip size="small" label="Pending" color="warning" sx={{ fontWeight: 700 }} icon={<Clock size={14} />} />;
        }
    };

    const MobileVisitCard = ({ visit }) => (
        <AnimatedCard delay={0.1} sx={{ mb: 2, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        ID: {visit._id ? visit._id.toString().slice(-6).toUpperCase() : 'UNKNOWN'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                        <Calendar size={14} color="#64748b" />
                        <Typography variant="body2" fontWeight="700">
                            {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                    </Box>
                </Box>
                {getStatusChip(visit.status)}
            </Box>

            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">Consultant</Typography>
                    <Typography variant="body2" fontWeight="700" noWrap>{visit?.consultant?.name || 'Unknown'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">Farmer</Typography>
                    <Typography variant="body2" fontWeight="700" noWrap>{visit?.farmer?.name || 'Unknown'}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <MapPin size={14} color="#64748b" />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {visit?.farmer?.village || 'Unknown'}, {visit?.farmer?.district || ''}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {visit.images && visit.images.length > 0 && (
                <Box display="flex" gap={1} mb={2} sx={{ overflowX: 'auto', pb: 1 }}>
                    {visit.images.map((img, i) => (
                        <Box
                            key={i}
                            component="img"
                            src={img}
                            sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                            onClick={() => setPreviewImage(img)}
                        />
                    ))}
                </Box>
            )}

            <Box display="flex" gap={1}>
                <AnimatedButton
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleUpdateStatus(visit._id, 'verified')}
                    disabled={visit.status === 'verified'}
                    startIcon={<Check size={16} />}
                >
                    Verify
                </AnimatedButton>
                <AnimatedButton
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleUpdateStatus(visit._id, 'rejected')}
                    disabled={visit.status === 'rejected'}
                    startIcon={<X size={16} />}
                >
                    Reject
                </AnimatedButton>
            </Box>
        </AnimatedCard>
    );

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
                gap: 2
            }}>
                <Typography variant="h5" fontWeight="900" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    Verification Center
                </Typography>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <Box sx={{ mr: 1, display: 'flex' }}>
                                        <Search size={18} color="#64748b" />
                                    </Box>
                                )
                            }
                        }}
                    />
                    <Box display="flex" gap={1.5}>
                        <TextField
                            select
                            size="small"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ minWidth: { xs: '50%', sm: 140 } }}
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Box sx={{ mr: 1, display: 'flex' }}>
                                            <Filter size={18} color="#64748b" />
                                        </Box>
                                    )
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="verified">Verified</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>
                        <AnimatedButton
                            variant="contained"
                            onClick={handleDownloadCSV}
                            sx={{
                                borderRadius: 3,
                                minWidth: { xs: '50%', sm: 'auto' },
                                px: { xs: 1, sm: 2 },
                                whiteSpace: 'nowrap'
                            }}
                            startIcon={<Download size={18} />}
                        >
                            Download
                        </AnimatedButton>
                    </Box>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, pb: 8, px: { xs: 2, md: 3 } }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress size={40} />
                    </Box>
                ) : filteredVisits.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px dashed #e2e8f0', bgcolor: 'transparent' }}>
                        <Typography color="text.secondary">No reports found.</Typography>
                    </Paper>
                ) : (
                    <>
                        {/* Desktop View */}
                        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <AnimatedCard sx={{ p: 0, overflow: 'hidden' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 800 }}>Visit Info</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Consultant</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Farmer</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Evidence</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredVisits.map((visit) => (
                                            <TableRow key={visit._id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Calendar size={16} color="#64748b" />
                                                        <Typography variant="body2" fontWeight="700">
                                                            {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {visit._id?.toString().slice(-6).toUpperCase()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="700">{visit?.consultant?.name || 'Unknown'}</Typography>
                                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 150 }}>{visit?.consultant?.email || ''}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="700">{visit?.farmer?.name || 'Unknown'}</Typography>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <MapPin size={12} color="#64748b" />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {visit?.farmer?.village || 'Unknown'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" gap={0.5}>
                                                        {visit.images?.map((img, i) => (
                                                            <Box
                                                                key={i}
                                                                component="img"
                                                                src={img}
                                                                sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                                                                onClick={() => setPreviewImage(img)}
                                                            />
                                                        )) || <Typography variant="caption" color="text.disabled">-</Typography>}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{getStatusChip(visit.status)}</TableCell>
                                                <TableCell align="right">
                                                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                                                        <IconButton size="small" onClick={() => handleUpdateStatus(visit._id, 'verified')} disabled={visit.status === 'verified'} color="success">
                                                            <Check size={18} />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleUpdateStatus(visit._id, 'rejected')} disabled={visit.status === 'rejected'} color="error">
                                                            <X size={18} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AnimatedCard>
                        </Box>

                        {/* Tablet/Mobile View */}
                        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                            <Stack spacing={2}>
                                {filteredVisits.map((visit) => (
                                    <MobileVisitCard key={visit._id} visit={visit} />
                                ))}
                            </Stack>
                        </Box>
                    </>
                )}
            </Container>

            {/* Image Preview Dialog */}
            <Dialog
                fullScreen={fullScreen}
                maxWidth="lg"
                open={!!previewImage}
                onClose={() => setPreviewImage(null)}
                sx={{ '& .MuiDialog-paper': { borderRadius: fullScreen ? 0 : 4, overflow: 'hidden' } }}
            >
                <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <IconButton
                        onClick={() => setPreviewImage(null)}
                        sx={{ position: 'absolute', top: 16, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
                    >
                        <X size={24} />
                    </IconButton>
                    <Box
                        component="img"
                        src={previewImage}
                        sx={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        icon={<CheckCircle size={20} />}
                        sx={{
                            borderRadius: 3,
                            bgcolor: snackbar.severity === 'success' ? 'primary.dark' : snackbar.severity === 'error' ? 'error.dark' : 'info.dark',
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            '& .MuiAlert-icon': { color: 'white' },
                            '& .MuiAlert-action': { color: 'white' }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </motion.div>
            </Snackbar>
        </MainLayout>
    );
};

export default VerificationManager;
