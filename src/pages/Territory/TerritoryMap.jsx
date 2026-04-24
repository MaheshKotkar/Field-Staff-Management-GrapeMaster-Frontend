import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { MapPin } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import AnimatedCard from '../../components/animations/AnimatedCard';

const TerritoryMap = () => {
    return (
        <MainLayout>
            <Box sx={{ px: 4, py: 2, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography variant="h5" fontWeight="800">Territory Insights</Typography>
            </Box>
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <AnimatedCard sx={{ p: 8, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Box sx={{ p: 3, bgcolor: 'secondary.50', color: 'secondary.main', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                        <MapPin size={40} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>Interactive Map Coming Soon</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                        We are working on integrating a high-precision GIS mapping system to help you track plot-level health and consultant territories in real-time.
                    </Typography>
                </AnimatedCard>
            </Container>
        </MainLayout>
    );
};

export default TerritoryMap;
