import React, { useState, useEffect, useRef } from 'react';
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
    InputAdornment,
    IconButton,
    Chip,
    Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, MapPin, User, Camera, X, Images } from 'lucide-react';
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
        images: []   // Array of File objects
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        // Auto-sync visit date from the first image batch only
        const firstFile = files[0];
        const date = new Date(firstFile.lastModified);
        const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files],
            visitDate: prev.images.length === 0 ? isoString : prev.visitDate
        }));

        // Reset so same file can be re-selected
        e.target.value = '';
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create the visit record
            const response = await api.post('/visits', formData);
            const visitId = response.data._id;

            // 2. Upload all images in one multipart request
            if (formData.images.length > 0 && visitId) {
                const imageFormData = new FormData();
                formData.images.forEach((file) => {
                    imageFormData.append('images', file);
                });
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
                        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
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
                    <Box
                        component={motion.div}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                    >
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                            <Box>
                                <Typography variant="h6" fontWeight={800}>Field Photo Evidence</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Upload one or more photos from the field visit
                                </Typography>
                            </Box>
                            {formData.images.length > 0 && (
                                <Chip
                                    icon={<Images size={16} />}
                                    label={`${formData.images.length} photo${formData.images.length > 1 ? 's' : ''} added`}
                                    color="primary"
                                    variant="filled"
                                    sx={{ fontWeight: 700, borderRadius: 2 }}
                                />
                            )}
                        </Box>

                        {/* Upload Zone */}
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                border: '2px dashed',
                                borderColor: formData.images.length > 0 ? 'primary.main' : 'grey.300',
                                borderRadius: 4,
                                p: { xs: 3, sm: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                                bgcolor: formData.images.length > 0 ? 'primary.50' : 'grey.50',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'primary.50',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Camera size={28} color="#1976d2" />
                            </Box>
                            <Typography fontWeight={700} color="primary.main">
                                {formData.images.length === 0 ? 'Click to Add Photos' : 'Add More Photos'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                JPG, PNG, JPEG or WebP · Up to 20 images
                            </Typography>
                        </Box>

                        {/* Hidden multi-file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            multiple
                            onChange={handleAddImages}
                        />

                        {/* Thumbnail Grid */}
                        {formData.images.length > 0 && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(2, 1fr)',
                                        sm: 'repeat(3, 1fr)',
                                        md: 'repeat(4, 1fr)'
                                    },
                                    gap: 2,
                                }}
                            >
                                <AnimatePresence>
                                    {formData.images.map((file, index) => (
                                        <Box
                                            key={`${file.name}-${index}`}
                                            component={motion.div}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            sx={{
                                                position: 'relative',
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                aspectRatio: '1',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={URL.createObjectURL(file)}
                                                alt={`field-${index + 1}`}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                            {/* Hover overlay + remove button */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    bgcolor: 'rgba(0,0,0,0)',
                                                    transition: 'background 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'flex-end',
                                                    p: 0.75,
                                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.25)' },
                                                    '&:hover .rm-btn': { opacity: 1 },
                                                }}
                                            >
                                                <Tooltip title="Remove">
                                                    <IconButton
                                                        className="rm-btn"
                                                        size="small"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                                                        sx={{
                                                            bgcolor: 'error.main',
                                                            color: '#fff',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s',
                                                            '&:hover': { bgcolor: 'error.dark' },
                                                            width: 26,
                                                            height: 26,
                                                        }}
                                                    >
                                                        <X size={14} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            {/* Index badge */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 6,
                                                    left: 6,
                                                    bgcolor: 'rgba(0,0,0,0.55)',
                                                    color: '#fff',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    px: 0.75,
                                                    py: 0.25,
                                                    borderRadius: 1,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                #{index + 1}
                                            </Box>
                                        </Box>
                                    ))}
                                </AnimatePresence>
                            </Box>
                        )}

                        {formData.images.length > 0 && (
                            <Typography variant="caption" color="success.main" fontWeight={700} textAlign="center">
                                {'📅 Visit date auto-synced from first photo: ' + new Date(formData.visitDate).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                );

            case 4: {
                const selectedFarmer = farmers.find(f => f._id === formData.farmerId);
                return (
                    <Box component={motion.div} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} textAlign="center" p={3}>
                        <Typography variant="h6" gutterBottom>Review Visit Details</Typography>
                        <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 4, textAlign: 'left', border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1"><strong>Farmer:</strong> {selectedFarmer?.name}</Typography>
                            <Typography variant="body1"><strong>Location:</strong> {formData.locationAddress}</Typography>
                            <Typography variant="body1"><strong>Date:</strong> {new Date(formData.visitDate).toLocaleString()}</Typography>
                            <Typography variant="body1"><strong>Crop:</strong> {formData.cropType} ({formData.cropStage})</Typography>
                            {formData.images.length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="body2" color="primary" fontWeight={700} mb={1}>
                                        {'📸 ' + formData.images.length + ' photo' + (formData.images.length > 1 ? 's' : '') + ' attached'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {formData.images.slice(0, 5).map((file, i) => (
                                            <Box
                                                key={i}
                                                component="img"
                                                src={URL.createObjectURL(file)}
                                                alt={`preview-${i}`}
                                                sx={{ width: 52, height: 52, borderRadius: 2, objectFit: 'cover', border: '2px solid #e2e8f0' }}
                                            />
                                        ))}
                                        {formData.images.length > 5 && (
                                            <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="caption" fontWeight={800} color="text.secondary">+{formData.images.length - 5}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                        {errors.submit && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>{errors.submit}</Typography>
                        )}
                    </Box>
                );
            }
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
