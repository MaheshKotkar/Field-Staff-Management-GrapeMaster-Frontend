import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Avatar,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Search, Calendar, MapPin, ClipboardList, X, Info } from 'lucide-react';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDetails = (report) => {
        setSelectedReport(report);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTimeout(() => setSelectedReport(null), 300);
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/reports/admin');
            setReports(data);
        } catch (error) {
            console.error('Error fetching admin reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report =>
        report.consultant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <Box sx={{
                px: { xs: 2, md: 4 },
                py: { xs: 2, md: 3 },
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
                <Box>
                    <Typography variant="h5" fontWeight="900">Staff Daily Reports</Typography>
                    <Typography variant="caption" color="text.secondary">Review End-of-Day submissions from consulting staff</Typography>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search by staff or summary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: { xs: '100%', md: 300 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, pb: 6 }}>
                {/* Desktop View: Table */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <AnimatedCard sx={{ p: 0, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'grey.50' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Consultant</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }} align="center">Visits</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }} align="center">Distance</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Summary</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }} align="right">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReports.map((report) => (
                                    <TableRow key={report._id} hover>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.8rem' }}>
                                                    {report.consultant?.name?.[0]}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="700">
                                                    {report.consultant?.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Calendar size={14} color="#64748b" />
                                                <Typography variant="body2">
                                                    {new Date(report.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${report.visitCount} visits`}
                                                size="small"
                                                sx={{ fontWeight: 700, bgcolor: 'secondary.50', color: 'secondary.main' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                                <MapPin size={14} color="#64748b" />
                                                <Typography variant="body2" fontWeight="700">
                                                    {report.totalKm} KM
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    lineHeight: 1.5
                                                }}>
                                                    {report.summary || 'No summary provided.'}
                                                </Typography>
                                                {report.summary?.length > 60 && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleOpenDetails(report)}
                                                        sx={{
                                                            p: 0,
                                                            minWidth: 'auto',
                                                            fontSize: '0.7rem',
                                                            mt: 0.5,
                                                            fontWeight: 700,
                                                            color: 'primary.main',
                                                            '&:hover': { background: 'transparent', textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        View Full Summary
                                                    </Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={report.status}
                                                size="small"
                                                color={report.status === 'verified' ? 'success' : 'primary'}
                                                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AnimatedCard>
                </Box>

                {/* Mobile View: Card List */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                    {filteredReports.map((report, index) => (
                        <AnimatedCard key={report._id} delay={index * 0.1}>
                            <Box sx={{ p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                            {report.consultant?.name?.[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="800">
                                                {report.consultant?.name}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <Calendar size={12} color="#64748b" />
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(report.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={report.status}
                                        size="small"
                                        color={report.status === 'verified' ? 'success' : 'primary'}
                                        sx={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                                    />
                                </Box>

                                <Grid container spacing={1} mb={2}>
                                    <Grid size={6}>
                                        <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">VISITS</Typography>
                                            <Typography variant="body2" fontWeight="800" color="primary.main">{report.visitCount}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={6}>
                                        <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">DISTANCE</Typography>
                                            <Typography variant="body2" fontWeight="800" color="secondary.main">{report.totalKm} KM</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" fontWeight="800" color="text.secondary" display="block" mb={0.5}>SUMMARY</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: 1.5,
                                        fontSize: '0.85rem'
                                    }}>
                                        {report.summary || 'No summary provided.'}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        size="small"
                                        onClick={() => handleOpenDetails(report)}
                                        sx={{
                                            mt: 1.5,
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            bgcolor: 'primary.50',
                                            color: 'primary.main',
                                            '&:hover': { bgcolor: 'primary.100' }
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Box>
                        </AnimatedCard>
                    ))}
                </Box>

                {filteredReports.length === 0 && (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <ClipboardList size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
                        <Typography color="text.secondary">No reports found matching your criteria.</Typography>
                    </Box>
                )}
            </Container>

            {/* Report Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                disableRestoreFocus
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                {selectedReport && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                    <Info size={18} />
                                </Avatar>
                                <Typography variant="h6" fontWeight="800">Report Details</Typography>
                            </Box>
                            <IconButton onClick={handleCloseDialog} size="small">
                                <X size={20} />
                            </IconButton>
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{ py: 3 }}>
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontSize: '1.2rem' }}>
                                            {selectedReport.consultant?.name?.[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="800">
                                                {selectedReport.consultant?.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Submitted on {new Date(selectedReport.date).toLocaleDateString()} at {new Date(selectedReport.createdAt).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
                                            Visits Done
                                        </Typography>
                                        <Typography variant="h5" fontWeight="900" color="primary.main">
                                            {selectedReport.visitCount}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={6}>
                                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
                                            Distance Covered
                                        </Typography>
                                        <Typography variant="h5" fontWeight="900" color="secondary.main">
                                            {selectedReport.totalKm} KM
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid size={12}>
                                    <Typography variant="subtitle2" fontWeight="800" color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ClipboardList size={16} /> Daily Summary
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        sx={{
                                            bgcolor: '#f8fafc',
                                            p: 2.5,
                                            borderRadius: 2,
                                            lineHeight: 1.7,
                                            border: '1px solid #e2e8f0',
                                            whiteSpace: 'pre-line',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {selectedReport.summary || 'No summary was provided for this day.'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2 }}>
                            <Button
                                onClick={handleCloseDialog}
                                variant="contained"
                                autoFocus
                                sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </MainLayout>
    );
};

export default AdminReports;
