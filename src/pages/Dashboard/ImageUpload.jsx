import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, X, Image as ImageIcon } from 'lucide-react';
import AnimatedButton from '../../components/animations/AnimatedButton';

const ImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const simulateUpload = () => {
        setUploading(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    setShowSnackbar(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                simulateUpload();
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: 4,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
                }}
            >
                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload-input"
                                onChange={handleFile}
                            />
                            <label htmlFor="image-upload-input" style={{ cursor: 'pointer' }}>
                                <Camera size={48} color="#94a3b8" />
                                <Typography mt={2} variant="body1" fontWeight="600">Capture Farm Image</Typography>
                                <Typography variant="caption" color="text.secondary">PNG, JPG up to 10MB</Typography>
                            </label>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            sx={{ position: 'relative' }}
                        >
                            <Box
                                component="img"
                                src={preview}
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => setPreview(null)}
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                                }}
                            >
                                <X size={16} />
                            </IconButton>
                        </motion.div>
                    )}
                </AnimatePresence>

                {uploading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '16px' }}
                    >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="caption" fontWeight="700">Uploading...</Typography>
                            <Typography variant="caption" fontWeight="700">{progress}%</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: 'linear-gradient(90deg, #64dd17 0%, #33691e 100%)'
                                }
                            }}
                        />
                    </motion.div>
                )}
            </Box>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <Alert
                        severity="success"
                        icon={<CheckCircle size={20} />}
                        sx={{
                            borderRadius: 3,
                            bgcolor: 'primary.dark',
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                        }}
                    >
                        Image uploaded successfully!
                    </Alert>
                </motion.div>
            </Snackbar>
        </Box>
    );
};

export default ImageUpload;
