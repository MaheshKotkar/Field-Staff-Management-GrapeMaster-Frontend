import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    Alert,
    CircularProgress,
    Chip,
    IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import MotionPaper from '../animations/MotionPaper';

const CROP_STAGES = ['Sowing', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting'];

const RejectedVisitEditDialog = ({ open, onClose, visit, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        locationAddress: visit?.locationAddress || '',
        cropType: visit?.cropType || '',
        cropStage: visit?.cropStage || '',
        fieldCondition: visit?.fieldCondition || '',
        remarks: visit?.remarks || '',
        visitDate: visit?.visitDate
            ? new Date(visit.visitDate).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        recommendation: {
            fertilizer: visit?.recommendation?.fertilizer || '',
            pesticide: visit?.recommendation?.pesticide || '',
            notes: visit?.recommendation?.notes || ''
        }
    });

    // Sync form when visit prop changes
    React.useEffect(() => {
        if (visit) {
            setForm({
                locationAddress: visit.locationAddress || '',
                cropType: visit.cropType || '',
                cropStage: visit.cropStage || '',
                fieldCondition: visit.fieldCondition || '',
                remarks: visit.remarks || '',
                visitDate: visit.visitDate
                    ? new Date(visit.visitDate).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                recommendation: {
                    fertilizer: visit.recommendation?.fertilizer || '',
                    pesticide: visit.recommendation?.pesticide || '',
                    notes: visit.recommendation?.notes || ''
                }
            });
        }
    }, [visit]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleRecChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            recommendation: { ...prev.recommendation, [field]: value }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.patch(`/visits/${visit._id}`, form);
            toast.success('Visit resubmitted for review!');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resubmit visit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                component: MotionPaper,
                initial: { y: 40, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: 40, opacity: 0 },
                sx: { borderRadius: 4, p: 1 }
            }}
        >
            <DialogTitle component="div" sx={{ m: 0, p: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                        <Box sx={{ p: 1, bgcolor: 'error.50', color: 'error.main', borderRadius: 2, display: 'flex' }}>
                            <RefreshCw size={22} />
                        </Box>
                        <Typography variant="h6" fontWeight={800}>
                            Edit & Resubmit Visit
                        </Typography>
                    </Box>
                    <Chip
                        icon={<AlertTriangle size={13} />}
                        label={`Rejected — Reason: ${visit?.rejectionReason || 'No reason given'}`}
                        color="error"
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                    />
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'grey.500', mt: 0.5 }}>
                    <X size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, pt: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={2.5}>
                    Farmer: <strong>{visit?.farmer?.name || '—'}</strong> &nbsp;|&nbsp; Update the details below and resubmit for admin review.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Visit Date & Time"
                        value={form.visitDate}
                        onChange={e => handleChange('visitDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Location Address"
                        value={form.locationAddress}
                        onChange={e => handleChange('locationAddress', e.target.value)}
                        required
                    />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Crop Type"
                                value={form.cropType}
                                onChange={e => handleChange('cropType', e.target.value)}
                                placeholder="e.g. Grapes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Crop Stage"
                                value={form.cropStage}
                                onChange={e => handleChange('cropStage', e.target.value)}
                            >
                                {CROP_STAGES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Field Conditions"
                        value={form.fieldCondition}
                        onChange={e => handleChange('fieldCondition', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="General Remarks"
                        value={form.remarks}
                        onChange={e => handleChange('remarks', e.target.value)}
                    />

                    <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="caption" fontWeight={800} color="primary.main">RECOMMENDATIONS</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            label="Fertilizer"
                            value={form.recommendation.fertilizer}
                            onChange={e => handleRecChange('fertilizer', e.target.value)}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Pesticide / Treatment"
                            value={form.recommendation.pesticide}
                            onChange={e => handleRecChange('pesticide', e.target.value)}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            label="Notes"
                            value={form.recommendation.notes}
                            onChange={e => handleRecChange('notes', e.target.value)}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleSubmit}
                    disabled={loading || !form.locationAddress}
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <RefreshCw size={18} />}
                    sx={{ px: 3, borderRadius: 3, fontWeight: 700 }}
                >
                    {loading ? 'Resubmitting...' : 'Resubmit for Review'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectedVisitEditDialog;
