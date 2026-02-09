import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Collapse,
    Avatar,
    CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Clock, ChevronRight, User } from 'lucide-react';

const TimelineItem = ({ item, index }) => {
    const [expanded, setExpanded] = useState(false);
    const visitDate = new Date(item.visitDate);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ marginBottom: '16px', position: 'relative' }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    left: 20,
                    top: 40,
                    bottom: -20,
                    width: 2,
                    bgcolor: 'grey.200',
                    display: index === 4 || !item ? 'none' : 'block'
                }}
            />

            <Box display="flex" gap={2}>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={{ zIndex: 1 }}
                >
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <User size={18} />
                    </Avatar>
                </motion.div>

                <Box sx={{ flexGrow: 1 }}>
                    <Box
                        onClick={() => setExpanded(!expanded)}
                        sx={{
                            p: 2,
                            bgcolor: 'white',
                            borderRadius: 3,
                            cursor: 'pointer',
                            border: expanded ? '1px solid rgba(100, 221, 23, 0.3)' : '1px solid transparent',
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: '#f1f5f9' }
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="subtitle1" fontWeight="700">
                                    {item.farmer?.name || 'Unknown Farmer'}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                                    <Clock size={14} />
                                    <Typography variant="caption">
                                        {visitDate.toLocaleDateString()} {visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            </Box>
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown size={20} color="#64748b" />
                            </motion.div>
                        </Box>

                        <Collapse in={expanded}>
                            <Box mt={2} pt={2} sx={{ borderTop: '1px dashed #e2e8f0' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {item.remarks || 'No remarks provided.'}
                                </Typography>
                                <Box display="flex" gap={2} mt={2}>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                        <MapPin size={14} color="#64dd17" />
                                        <Typography variant="caption" fontWeight="600">
                                            {item.locationAddress || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.disabled' }}>
                                    Logged by: {item.consultant?.name || 'Staff'}
                                </Typography>
                            </Box>
                        </Collapse>
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

const TimelineView = ({ visits, loading }) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (!visits || visits.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">No recent activities found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 2 }}>
            {visits.map((visit, index) => (
                <TimelineItem key={visit._id} item={visit} index={index} />
            ))}
        </Box>
    );
};

export default TimelineView;
