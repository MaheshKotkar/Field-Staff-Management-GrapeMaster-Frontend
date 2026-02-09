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
} from '@mui/material';
import { Check, X, Clock, ShieldCheck, MapPin } from 'lucide-react';
import api from '../../services/api';
import MainLayout from '../../components/Layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';

const VerificationManager = () => {
    const [loading, setLoading] = useState(true);
    const [visits, setVisits] = useState([]);

    const fetchVisits = async () => {
        try {
            const { data } = await api.get('/admin/visits');
            setVisits(data);
        } catch (error) {
            console.error('Error fetching admin visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/visits/${id}/verify`, { status });
            fetchVisits();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const getStatusChip = (status) => {
        switch (status) {
            case 'verified': return <Chip size="small" label="Verified" color="success" icon={<ShieldCheck size={14} />} />;
            case 'rejected': return <Chip size="small" label="Rejected" color="error" icon={<X size={14} />} />;
            default: return <Chip size="small" label="Pending" color="warning" icon={<Clock size={14} />} />;
        }
    };

    return (
        <MainLayout>
            <Box sx={{ px: 4, py: 3, bgcolor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" fontWeight="900">Verification Center</Typography>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 8 }}>
                <AnimatedCard delay={0.1} sx={{ p: 0, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>Visit Date</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Consultant</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Farmer / Village</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Images</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={40} />
                                    </TableCell>
                                </TableRow>
                            ) : visits.map((visit) => (
                                <TableRow key={visit._id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                        {new Date(visit.visitDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="700">{visit.consultant.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{visit.consultant.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="700">{visit.farmer.name}</Typography>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <MapPin size={12} color="#64748b" />
                                            <Typography variant="caption" color="text.secondary">{visit.farmer.village}, {visit.farmer.district}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            {visit.images && visit.images.length > 0 ? (
                                                visit.images.map((img, i) => (
                                                    <Box
                                                        key={i}
                                                        component="img"
                                                        src={img}
                                                        sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover' }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">No images</Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{getStatusChip(visit.status)}</TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            <Tooltip title="Verify Report">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleUpdateStatus(visit._id, 'verified')}
                                                    sx={{ color: 'success.main', bgcolor: 'success.50' }}
                                                    disabled={visit.status === 'verified'}
                                                >
                                                    <Check size={18} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject Report">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleUpdateStatus(visit._id, 'rejected')}
                                                    sx={{ color: 'error.main', bgcolor: 'error.50' }}
                                                    disabled={visit.status === 'rejected'}
                                                >
                                                    <X size={18} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AnimatedCard>
            </Container>
        </MainLayout>
    );
};

export default VerificationManager;
