import React from 'react';
import {
    Box,
    Typography,
    Container,
    Button,
    useTheme,
    Stack,
    IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Grape,
    Leaf,
    ShieldCheck,
    Smartphone,
    BarChart3,
    ArrowRight,
    MapPin,
    Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../../components/animations/AnimatedButton';
import AnimatedCard from '../../components/animations/AnimatedCard';
import Footer from '../../components/Layout/Footer';
import PublicNavbar from '../../components/Layout/PublicNavbar';
import ScrollToTop from '../../components/common/ScrollToTop';

const FeatureItem = ({ icon: Icon, title, description, delay }) => {
    const theme = useTheme();
    return (
        <AnimatedCard delay={delay} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Box
                sx={{
                    p: 2,
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    borderRadius: 4,
                    display: 'flex',
                    mb: 3,
                    boxShadow: '0 8px 16px rgba(100, 221, 23, 0.1)'
                }}
            >
                <Icon size={32} />
            </Box>
            <Typography variant="h6" fontWeight="800" mb={1}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{description}</Typography>
        </AnimatedCard>
    );
};

const Landing = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'white', overflowX: 'hidden' }}>
            <PublicNavbar />

            {/* Hero Section */}
            <Box
                sx={{
                    pt: { xs: 12, md: 25 },
                    pb: { xs: 8, md: 20 },
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f5f3ff 100%)',
                    position: 'relative'
                }}
            >
                {/* Floating Elements */}
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ position: 'absolute', top: '15%', right: '10%', opacity: 0.1 }}
                >
                    <Leaf size={120} color={theme.palette.primary.main} />
                </Box>
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ position: 'absolute', bottom: '20%', left: '5%', opacity: 0.1 }}
                >
                    <Grape size={100} color={theme.palette.secondary.main} />
                </Box>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack
                        direction={{ xs: 'column-reverse', md: 'row' }}
                        spacing={{ xs: 6, md: 8 }}
                        alignItems="center"
                    >
                        <Stack spacing={4} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }} sx={{ flex: 1, width: '100%' }}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Box
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        bgcolor: 'primary.50',
                                        color: 'primary.main',
                                        borderRadius: 50,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 1
                                    }}
                                >
                                    <ShieldCheck size={16} />
                                    <Typography variant="caption" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                        Agricultural Compliance Redefined
                                    </Typography>
                                </Box>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                        fontWeight: 900,
                                        lineHeight: { xs: 1.2, md: 1.1 },
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2
                                    }}
                                >
                                    Precision Management <br /> for Modern Agriculture
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                style={{ maxWidth: '600px' }}
                            >
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    fontWeight="400"
                                    sx={{
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                                    }}
                                >
                                    Grape Master bridges the gap between staff productivity and farmer success.
                                    Real-time visit tracking and expert recommendations.
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                style={{ width: '100%' }}
                            >
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={3}
                                    sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}
                                >
                                    <AnimatedButton
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            px: { xs: 4, sm: 6 },
                                            py: 2,
                                            borderRadius: 4,
                                            fontSize: '1.1rem',
                                            width: { xs: '100%', sm: 'auto' }
                                        }}
                                        endIcon={<ArrowRight size={20} />}
                                    >
                                        Launch Your Farm
                                    </AnimatedButton>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
                                        sx={{
                                            px: { xs: 4, sm: 6 },
                                            py: 2,
                                            borderRadius: 4,
                                            borderWeight: 2,
                                            fontSize: '1.1rem',
                                            width: { xs: '100%', sm: 'auto' }
                                        }}
                                    >
                                        Watch Demo
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Stack>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            style={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%' }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: { xs: '100%', sm: 450, md: 500 },
                                    aspectRatio: { xs: '4/3', sm: '1/1' },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '8%',
                                        left: '8%',
                                        right: '-4%',
                                        bottom: '-4%',
                                        border: '4px solid',
                                        borderColor: 'primary.light',
                                        borderRadius: { xs: 4, md: 8 },
                                        zIndex: 0,
                                        opacity: 0.2,
                                        display: { xs: 'none', sm: 'block' }
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/hero_grapes.png"
                                    alt="Grape Master Hero"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: { xs: 4, md: 8 },
                                        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                />
                            </Box>
                        </motion.div>
                    </Stack>
                </Container>
            </Box>

            {/* Feature Section */}
            <Box sx={{ py: 15, bgcolor: 'grey.50' }}>
                <Container maxWidth="lg">
                    <Stack spacing={8}>
                        <Box textAlign="center">
                            <Typography variant="h3" fontWeight="900" mb={2}>Advanced Field Intelligence</Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight="400">Everything you need to scale your field operations efficiently.</Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                            <FeatureItem
                                icon={Smartphone}
                                title="Mobile First Visit Logs"
                                description="Staff can log visits directly from the field with GPS tracking and offline capabilities."
                                delay={0.1}
                            />
                            <FeatureItem
                                icon={ShieldCheck}
                                title="Fraud Verification"
                                description="AI-powered image analysis and geolocation verification ensure logs are legitimate."
                                delay={0.2}
                            />
                            <FeatureItem
                                icon={BarChart3}
                                title="Enterprise Analytics"
                                description="Comprehensive dashboard for management to track staff performance and regional trends."
                                delay={0.3}
                            />
                            <FeatureItem
                                icon={MapPin}
                                title="Regional Mapping"
                                description="Visualize your entire operation footprint with interactive territory maps."
                                delay={0.4}
                            />
                            <FeatureItem
                                icon={Cpu}
                                title="Smart Recommendations"
                                description="Automated suggestions for fertilizer and pesticides based on crop health history."
                                delay={0.5}
                            />
                            <FeatureItem
                                icon={ShieldCheck}
                                title="Role-Based Security"
                                description="Specific access controls for Field Staff, Consultants, and System Administrators."
                                delay={0.6}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Footer */}
            <Footer />
            <ScrollToTop />
        </Box>
    );
};

export default Landing;
