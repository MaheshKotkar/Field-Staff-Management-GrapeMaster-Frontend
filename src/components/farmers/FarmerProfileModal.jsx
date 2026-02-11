import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Avatar,
    Grid,
    Divider,
    Chip,
    Button
} from '@mui/material';
import { X, User, Phone, MapPin, Calendar, Clock, Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';
import MotionPaper from './animations/MotionPaper';

const FarmerProfileModal = ({ open, onClose, farmer, visits = [] }) => {
    if (!farmer) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                component: MotionPaper,
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.9, opacity: 0 },
                sx: { borderRadius: 4 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="800">Farmer Profile</Typography>
                <IconButton onClick={onClose}><X size={20} /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, pt: 0 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 4 }}>
                            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
                                {farmer.name.charAt(0)}
                            </Avatar>
                            <Typography variant="h5" fontWeight="800">{farmer.name}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{farmer.village}</Typography>
                            <Chip label="Active Farmer" color="success" size="small" sx={{ mt: 1, fontWeight: 700 }} />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="700" gutterBottom>CONTACT INFORMATION</Typography>
                        <Box display="flex" flexDirection="column" gap={2} mb={4}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Phone size={18} color="#64748b" />
                                <Typography variant="body1">{farmer.contact}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <MapPin size={18} color="#64748b" />
                                <Typography variant="body1">{farmer.taluka}, {farmer.district}, {farmer.state}</Typography>
                            </Box>
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary" fontWeight="700" gutterBottom>SYSTEM DETAILS</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Calendar size={18} color="#64748b" />
                                <Typography variant="body2">Registered on: {new Date(farmer.createdAt).toLocaleDateString()}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={2}>
                                <User size={18} color="#64748b" />
                                <Typography variant="body2">Consultant: {farmer.createdBy?.name || 'Admin'}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" fontWeight="800" gutterBottom>Recent Visits</Typography>
                {visits.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 3 }}>
                        <Typography color="text.secondary">No visits recorded for this farmer yet.</Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {visits.map((visit) => (
                            <Box key={visit._id} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="800">{new Date(visit.visitDate).toLocaleDateString()}</Typography>
                                    <Typography variant="caption" color="text.secondary">{visit.cropType} - {visit.cropStage}</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Clock size={14} color="#64748b" />
                                    <Typography variant="caption" fontWeight="700" color="success.main">Completed</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FarmerProfileModal;
