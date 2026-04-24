import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import MobileBottomNavigation from './MobileBottomNavigation';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            bgcolor: 'background.default',
            overflow: 'hidden'
        }}>
            {!isMobile && <Sidebar />}

            <Box
                sx={{
                    flexGrow: 1,
                    flexShrink: 1,
                    width: '100%',
                    pb: isMobile ? '80px' : 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    position: 'relative'
                }}
            >
                <Box sx={{ flex: 1 }}>
                    {children}
                </Box>
                <Footer />
            </Box>

            {isMobile && <MobileBottomNavigation />}
        </Box>
    );
};

export default MainLayout;
