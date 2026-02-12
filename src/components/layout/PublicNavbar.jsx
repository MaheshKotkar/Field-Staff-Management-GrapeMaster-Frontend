import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Drawer,
    useTheme,
    useMediaQuery,
    Stack
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AnimatedButton from '../animations/AnimatedButton';

const PublicNavbar = ({ showActions = true, showAbout = false }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navLinks = [
        ...(showAbout ? [
            { label: 'About Us', path: '/about' },
            { label: 'Contact Us', path: '/contact' }
        ] : []),
    ];

    const drawer = (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box component="img" src="/grape_master_logo.png" sx={{ width: 32, height: 32 }} />
                    <Typography variant="h6" fontWeight="900" color="primary.main">
                        Grape Master
                    </Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}>
                    <X />
                </IconButton>
            </Box>
            <Stack spacing={2}>
                {navLinks.map((link) => (
                    <Button
                        key={link.label}
                        fullWidth
                        variant="text"
                        onClick={() => {
                            navigate(link.path);
                            handleDrawerToggle();
                        }}
                        sx={{
                            justifyContent: 'flex-start',
                            fontWeight: 700,
                            color: 'text.primary',
                            py: 1.5
                        }}
                    >
                        {link.label}
                    </Button>
                ))}

                {showActions && (
                    <>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                navigate('/login');
                                handleDrawerToggle();
                            }}
                            sx={{ fontWeight: 700, py: 1.5, borderRadius: 3 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                navigate('/register');
                                handleDrawerToggle();
                            }}
                            sx={{ fontWeight: 800, py: 1.5, borderRadius: 3 }}
                        >
                            Get Started
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );

    return (
        <>
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
                        variant="h5"
                        fontWeight="900"
                        color="primary.main"
                        sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: -0.5 }}
                    >
                        Grape Master
                    </Typography>
                </motion.div>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 32 }}
                    >
                        {navLinks.map((link) => (
                            <Button
                                key={link.label}
                                variant="text"
                                color="inherit"
                                onClick={() => navigate(link.path)}
                                sx={{
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}

                        {showActions && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button
                                    variant="text"
                                    color="inherit"
                                    onClick={() => navigate('/login')}
                                    sx={{ fontWeight: 700, px: 3 }}
                                >
                                    Sign In
                                </Button>
                                <AnimatedButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/register')}
                                    sx={{ borderRadius: 3, px: 4 }}
                                >
                                    Get Started
                                </AnimatedButton>
                            </Box>
                        )}
                    </motion.div>
                )}

                {/* Mobile Menu Icon */}
                {isMobile && (showActions || navLinks.length > 0) && (
                    <IconButton onClick={handleDrawerToggle} color="primary">
                        <Menu size={28} />
                    </IconButton>
                )}
            </Box>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                    sx: { width: '80%', maxWidth: 300, borderRadius: '20px 0 0 20px' }
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default PublicNavbar;
