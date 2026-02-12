import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Stack,
    IconButton,
    useTheme,
    Divider
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Github
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'grey.50',
                pt: 10,
                pb: 6,
                borderTop: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={8}>
                    {/* Brand Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    component="img"
                                    src="/grape_master_logo.png"
                                    sx={{ width: 40, height: 40, objectFit: 'contain' }}
                                />
                                <Typography variant="h5" fontWeight="900" color="primary.main">
                                    Grape Master
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, lineHeight: 1.8 }}>
                                Empowering agriculture through precision data and real-time insights.
                                We help farmers and field staff achieve more together.
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {[Twitter, Facebook, Instagram, Linkedin, Github].map((Icon, index) => (
                                    <IconButton
                                        key={index}
                                        size="small"
                                        sx={{
                                            bgcolor: 'white',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            color: 'text.secondary',
                                            '&:hover': { bgcolor: 'primary.main', color: 'white' }
                                        }}
                                    >
                                        <Icon size={18} />
                                    </IconButton>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight="800" mb={3}>Quick Links</Typography>
                        <Stack spacing={2}>
                            <Link
                                href="/"
                                underline="none"
                                color="text.secondary"
                                sx={{ '&:hover': { color: 'primary.main' } }}
                            >
                                Home
                            </Link>
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Contact Us', path: '/contact' },
                                { name: 'Admin Portal', path: '/admin/login' }
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    component={RouterLink}
                                    to={link.path}
                                    underline="none"
                                    color="text.secondary"
                                    sx={{ '&:hover': { color: 'primary.main' } }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact Info */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight="800" mb={3}>Contact Info</Typography>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <MapPin size={24} color={theme.palette.primary.main} style={{ flexShrink: 0, marginTop: '4px' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    Flat No 204, Padmalaya Apartment, Lane No 1, New Pandit Colony, Sharanpur Road, Nashik, Maharashtra - 422002
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Phone size={24} color={theme.palette.primary.main} style={{ flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary">
                                    +91 7972371656
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Mail size={24} color={theme.palette.primary.main} style={{ flexShrink: 0 }} />
                                <Typography variant="body2" color="text.secondary">
                                    admin@grapemaster.org
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Grape Master Agriculture. All rights reserved.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Built with ❤️ for modern farmers.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
