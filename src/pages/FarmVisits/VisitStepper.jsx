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

const steps = ['Select Farmer', 'Visit Details', 'Recommendations', 'Image Evidence', 'Confirmation'];

const VisitStepper = ({ onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [farmers, setFarmers] = useState([]);
    const [farmersLoading, setFarmersLoading] = useState(true);
    const [formData, setFormData] = useState({
        farmerId: '',
        locationAddress: '',
        remarks: '',
        visitDate: new Date().toISOString().slice(0, 16),
        cropType: '',
        cropStage: '',
        fieldCondition: '',
        recommendation: {
            fertilizer: '',
            pesticide: '',
            notes: ''
        },
        image: null
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
            if (!formData.cropType) newErrors.cropType = 'Crop Type is required';
            if (!formData.cropStage) newErrors.cropStage = 'Crop Stage is required';
        }
        // Step 2 (Recommendations) is optional
        // Step 3 (Image) is optional but recommended - enforcing for now? Let's make it optional for flexibility

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create Visit Record
            const response = await api.post('/visits', formData);
            const visitId = response.data._id;

            // 2. Upload Image if exists
            if (formData.image && visitId) {
                // Determine import dynamically or use the named export
                // Since we need to import it, let's just use the api instance we have and adding the function to the file was good practice but we can also do it inline or better yet, import it. 
                // Actually I added it as a named export to api.js, so I need to import it or just use api.post here to avoid import issues if I didn't update imports.
                // Let's use the helper I just created. But I need to update imports first? 
                // To be safe and avoid import errors in this step without seeing the top of the file, I'll use the api instance directly here which is safer.

                const imageFormData = new FormData();
                imageFormData.append('image', formData.image);
                imageFormData.append('visitId', visitId);

                await api.post('/upload', imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

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
                            type="datetime-local"
                            label="Visit Date & Time"
                            value={formData.visitDate}
                            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
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

                        <Box display="flex" gap={2}>
                            <TextField
                                fullWidth
                                label="Crop Type"
                                value={formData.cropType}
                                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                                error={!!errors.cropType}
                                helperText={errors.cropType}
                                placeholder="e.g. Grapes, Cotton"
                            />
                            <TextField
                                fullWidth
                                select
                                label="Crop Stage"
                                value={formData.cropStage}
                                onChange={(e) => setFormData({ ...formData, cropStage: e.target.value })}
                                error={!!errors.cropStage}
                                helperText={errors.cropStage}
                            >
                                {['Sowing', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting'].map((stage) => (
                                    <MenuItem key={stage} value={stage}>{stage}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Field Conditions"
                            value={formData.fieldCondition}
                            onChange={(e) => setFormData({ ...formData, fieldCondition: e.target.value })}
                            placeholder="Describe soil moisture, pests, disease signs..."
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="General Remarks"
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box component={motion.div} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Typography variant="h6" color="primary">Advisory & Recommendations</Typography>
                        <TextField
                            fullWidth
                            label="Fertilizer Recommendation"
                            value={formData.recommendation.fertilizer}
                            onChange={(e) => setFormData({ ...formData, recommendation: { ...formData.recommendation, fertilizer: e.target.value } })}
                            placeholder="e.g. NPK 19:19:19"
                        />
                        <TextField
                            fullWidth
                            label="Pesticide / Treatment"
                            value={formData.recommendation.pesticide}
                            onChange={(e) => setFormData({ ...formData, recommendation: { ...formData.recommendation, pesticide: e.target.value } })}
                            placeholder="e.g. Neem Oil spray"
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Special Instructions / Notes"
                            value={formData.recommendation.notes}
                            onChange={(e) => setFormData({ ...formData, recommendation: { ...formData.recommendation, notes: e.target.value } })}
                        />
                    </Box>
                );
            case 3:
                return (
                    <Box component={motion.div} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} textAlign="center" py={4}>
                        <Typography variant="h6" gutterBottom>Capture Field Evidence</Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Upload a photo of the crop. The system will automatically detect the visit date and time from the image.
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ p: 4, border: '2px dashed #cbd5e1', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            {formData.image ? (
                                <Box component="img" src={URL.createObjectURL(formData.image)} sx={{ width: '100%', maxHeight: 250, objectFit: 'contain', borderRadius: 2 }} />
                            ) : (
                                <>
                                    <MapPin size={48} color="#94a3b8" />
                                    <Typography>Click to Upload or Capture</Typography>
                                </>
                            )}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // Auto-fetch date from lastModified
                                        const date = new Date(file.lastModified);
                                        const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

                                        setFormData({
                                            ...formData,
                                            image: file,
                                            visitDate: isoString // Auto-update date
                                        });
                                    }
                                }}
                            />
                        </Button>
                        {formData.image && (
                            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 2, fontWeight: 'bold' }}>
                                Date auto-synced from image: {new Date(formData.visitDate).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                );
            case 4:
                const selectedFarmer = farmers.find(f => f._id === formData.farmerId);
                return (
                    <Box component={motion.div} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} textAlign="center" p={3}>
                        <Typography variant="h6" gutterBottom>Review Visit Details</Typography>
                        <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 4, textAlign: 'left', border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1"><strong>Farmer:</strong> {selectedFarmer?.name}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {formData.locationAddress}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {new Date(formData.visitDate).toLocaleString()}</Typography>
                            <Typography variant="body1"><strong>Crop:</strong> {formData.cropType} ({formData.cropStage})</Typography>
                            {formData.image && <Typography variant="body2" color="primary" sx={{ mt: 1 }}>📸 Image attached</Typography>}
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
