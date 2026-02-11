import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../animations/AnimatedButton';

const PublicNavbar = ({ showActions = true }) => {
    const navigate = useNavigate();

    return (
        <Box
            component="nav"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                px: { xs: 2, md: 6 },
                py: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <Box component="img" src="/grape_master_logo.png" sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, objectFit: 'contain' }} />
                <Typography
                    variant="h6"
                    fontWeight="900"
                    color="primary.main"
                    sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: -0.5 }}
                >
                    Grape Master
                </Typography>
            </motion.div>

            {showActions && (
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={() => navigate('/login')}
                        sx={{ fontWeight: 700, px: { xs: 1, sm: 3 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                        Sign In
                    </Button>
                    <AnimatedButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/register')}
                        sx={{ ml: { xs: 1, sm: 2 }, borderRadius: 3, px: { xs: 2, sm: 4 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                        Get Started
                    </AnimatedButton>
                </motion.div>
            )}
        </Box>
    );
};

export default PublicNavbar;
