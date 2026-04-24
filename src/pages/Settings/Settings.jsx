import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Settings as SettingsIcon } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';

const SettingsPage = () => {
    return (
        <MainLayout>
            <Box sx={{ px: 4, py: 2, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography variant="h5" fontWeight="800">System Settings</Typography>
            </Box>
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <AnimatedCard sx={{ p: 8, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Box sx={{ p: 3, bgcolor: 'primary.50', color: 'primary.main', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                        <SettingsIcon size={40} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>Settings Portal</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                        Manage your profile, notification preferences, and application themes here. This module is currently under active development.
                    </Typography>
                </AnimatedCard>
            </Container>
        </MainLayout>
    );
};

export default SettingsPage;
