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
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { X, UserPlus, MapPin, Phone, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import AnimatedButton from './animations/AnimatedButton';
import MotionPaper from './animations/MotionPaper';

const FarmerRegistration = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        village: '',
        taluka: '',
        district: '',
        state: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/farmers', formData);
            if (onSuccess) onSuccess();
            onClose();
            setFormData({
                name: '',
                contact: '',
                village: '',
                taluka: '',
                district: '',
                state: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register farmer');
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
                initial: { y: 50, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: 50, opacity: 0 },
                sx: { borderRadius: 4, p: 1 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ p: 1, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 2, display: 'flex' }}>
                        <UserPlus size={24} />
                    </Box>
                    <Typography variant="h6" fontWeight="800">New Farmer Registration</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'grey.500' }}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Box component="form" onSubmit={handleSubmit} id="farmer-reg-form">
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Farmer Name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Ramesh Kumar"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="contact"
                                required
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="10-digit number"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Village"
                                name="village"
                                required
                                value={formData.village}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Taluka"
                                name="taluka"
                                required
                                value={formData.taluka}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="District"
                                name="district"
                                required
                                value={formData.district}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                defaultValue="Maharashtra"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} variant="text" color="inherit" sx={{ fontWeight: 700 }}>
                    Cancel
                </Button>
                <AnimatedButton
                    type="submit"
                    form="farmer-reg-form"
                    variant="contained"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UserPlus size={20} />}
                    sx={{ px: 4, py: 1.2, borderRadius: 3 }}
                >
                    {loading ? 'Registering...' : 'Register Farmer'}
                </AnimatedButton>
            </DialogActions>
        </Dialog>
    );
};

export default FarmerRegistration;
