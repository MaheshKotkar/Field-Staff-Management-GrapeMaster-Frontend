import React, { useState, useEffect } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    MenuItem,
    CircularProgress,
    Fade,
    InputAdornment
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, MapPin, ClipboardList, User } from 'lucide-react';
import api from '../../services/api';

const steps = ['Select Farmer', 'Visit Details', 'Confirmation'];

const VisitStepper = ({ onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [farmers, setFarmers] = useState([]);
    const [farmersLoading, setFarmersLoading] = useState(true);
    const [formData, setFormData] = useState({
        farmerId: '',
        locationAddress: '',
        remarks: '',
        visitDate: new Date().toISOString().slice(0, 16)
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const response = await api.get('/farmers');
                setFarmers(response.data);
            } catch (error) {
                console.error('Error fetching farmers:', error);
            } finally {
                setFarmersLoading(false);
            }
        };
        fetchFarmers();
    }, []);

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const validateStep = () => {
        const newErrors = {};
        if (activeStep === 0 && !formData.farmerId) newErrors.farmerId = 'Please select a farmer';
        if (activeStep === 1) {
            if (!formData.locationAddress) newErrors.locationAddress = 'Location is required';
            if (!formData.remarks) newErrors.remarks = 'Remarks are required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/visits', formData);
            setSuccess(true);
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 2000);
        } catch (error) {
            console.error('Error submitting visit:', error);
            setErrors({ submit: error.response?.data?.message || 'Submission failed' });
        } finally {
            setLoading(false);
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box component={motion.div} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <TextField
                            select
                            fullWidth
                            label="Select Farmer"
                            value={formData.farmerId}
                            onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                            error={!!errors.farmerId}
                            helperText={errors.farmerId}
                            disabled={farmersLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            {farmersLoading ? (
                                <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Loading farmers...</MenuItem>
                            ) : (
                                farmers.map((f) => (
                                    <MenuItem key={f._id} value={f._id}>{f.name} ({f.village})</MenuItem>
                                ))
                            )}
                        </TextField>
                    </Box>
                );
            case 1:
                return (
                    <Box component={motion.div} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Location Address"
                            value={formData.locationAddress}
                            onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                            error={!!errors.locationAddress}
                            helperText={errors.locationAddress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MapPin size={20} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type="datetime-local"
                            label="Visit Date & Time"
                            value={formData.visitDate}
                            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Remarks / Observations"
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            error={!!errors.remarks}
                            helperText={errors.remarks}
                        />
                    </Box>
                );
            case 2:
                const selectedFarmer = farmers.find(f => f._id === formData.farmerId);
                return (
                    <Box component={motion.div} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} textAlign="center" p={3}>
                        <Typography variant="h6" gutterBottom>Review Visit Details</Typography>
                        <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 4, textAlign: 'left', border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1"><strong>Farmer:</strong> {selectedFarmer?.name}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {formData.locationAddress}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {new Date(formData.visitDate).toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>"{formData.remarks}"</Typography>
                        </Box>
                        {errors.submit && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>{errors.submit}</Typography>
                        )}
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    if (success) {
        return (
            <Box
                component={motion.div}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={8}
            >
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                    <CheckCircle2 size={120} color="#64dd17" />
                </motion.div>
                <Typography variant="h4" fontWeight="900" mt={4} textAlign="center">Visit Logged Successfully!</Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>The field data has been synchronized.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', py: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-label': { fontWeight: 700 },
                                '& .Mui-active': { color: 'primary.main' }
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ minHeight: 300, mb: 4 }}>
                <AnimatePresence mode="wait">
                    {getStepContent(activeStep)}
                </AnimatePresence>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                    disabled={activeStep === 0 || loading}
                    onClick={handleBack}
                    startIcon={<ChevronLeft size={20} />}
                    sx={{ fontWeight: 700 }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ChevronRight size={20} />}
                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                >
                    {loading ? 'Processing...' : activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </Box>
    );
};

export default VisitStepper;
