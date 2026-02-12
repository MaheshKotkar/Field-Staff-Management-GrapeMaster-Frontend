import React from 'react';
import {
    Box,
    Typography,
    Container,
    Button,
    useTheme,
    Stack,
    IconButton,
    Grid
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
import { useInView } from 'framer-motion';
import { useSpring, useTransform, animate } from 'framer-motion';
import AnimatedButton from '../../components/animations/AnimatedButton';
import AnimatedCard from '../../components/animations/AnimatedCard';
import Footer from '../../components/layout/Footer';
import PublicNavbar from '../../components/layout/PublicNavbar';
import ScrollToTop from '../../components/common/ScrollToTop';

const Counter = ({ value, suffix = '', delay = 0 }) => {
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        if (inView) {
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
            const controls = animate(0, numericValue, {
                duration: 3.5,
                delay: delay,
                ease: "easeOut",
                onUpdate: (latest) => setDisplayValue(Math.floor(latest))
            });
            return () => controls.stop();
        }
    }, [inView, value, delay]);

    return (
        <span ref={ref}>
            {displayValue.toLocaleString()}{suffix || (value.includes('+') ? '+' : value.includes('%') ? '%' : '')}
        </span>
    );
};

const FeatureItem = ({ icon: Icon, title, description, delay }) => {
    const theme = useTheme();
    return (
        <AnimatedCard
            delay={delay}
            sx={{
                p: { xs: 4, md: 5 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    borderColor: 'primary.light'
                }
            }}
        >
            <Box
                sx={{
                    p: 2.5,
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    borderRadius: 4,
                    display: 'flex',
                    mb: 3,
                    boxShadow: '0 8px 16px rgba(100, 221, 23, 0.15)',
                    transition: 'all 0.3s ease'
                }}
            >
                <Icon size={34} />
            </Box>
            <Typography variant="h6" fontWeight="900" mb={1.5} sx={{ letterSpacing: -0.2 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, opacity: 0.85 }}>{description}</Typography>
        </AnimatedCard>
    );
};

const Landing = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'white', overflowX: 'hidden' }}>
            <PublicNavbar showAbout={true} />

            {/* Hero Section */}
            <Box
                sx={{
                    pt: { xs: 15, md: 28 },
                    pb: { xs: 10, md: 22 },
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #f5f3ff 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Glass Shapes */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-5%',
                        width: '40vw',
                        height: '40vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(100, 221, 23, 0.08) 0%, rgba(255,255,255,0) 70%)',
                        filter: 'blur(60px)',
                        zIndex: 0
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '5%',
                        left: '-10%',
                        width: '35vw',
                        height: '35vw',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124, 77, 255, 0.08) 0%, rgba(255,255,255,0) 70%)',
                        filter: 'blur(60px)',
                        zIndex: 0
                    }}
                />
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
                        direction={{ xs: 'column', md: 'row' }}
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
                                        fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.5rem' },
                                        fontWeight: 900,
                                        lineHeight: { xs: 1.15, md: 1.05 },
                                        letterSpacing: '-0.02em',
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 3
                                    }}
                                >
                                    Field Management <br /> System
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
                                        fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.45rem' },
                                        opacity: 0.8
                                    }}
                                >
                                    The definitive platform for field staff orchestration and farmer prosperity.
                                    Real-time tracking, AI verification, and seamless communication.
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
                                            py: 2.2,
                                            borderRadius: 4,
                                            fontSize: '1.2rem',
                                            fontWeight: 800,
                                            width: { xs: '100%', sm: 'auto' },
                                            boxShadow: '0 12px 24px rgba(100, 221, 23, 0.3)'
                                        }}
                                        endIcon={<ArrowRight size={22} />}
                                    >
                                        Get Started Now
                                    </AnimatedButton>
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
                                    maxWidth: { xs: '100%', sm: 480, md: 550 },
                                    aspectRatio: '1/1',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '10%',
                                        left: '10%',
                                        right: '-5%',
                                        bottom: '-5%',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                                        borderRadius: { xs: 4, md: 8 },
                                        zIndex: 0,
                                        opacity: 0.15,
                                        filter: 'blur(20px)',
                                        display: { xs: 'none', sm: 'block' }
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/hero_grapes.png"
                                    alt="Field Management System"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: { xs: 4, md: 8 },
                                        boxShadow: '0 32px 64px rgba(0,0,0,0.12)',
                                        position: 'relative',
                                        zIndex: 1,
                                        border: '1px solid rgba(255,255,255,0.8)'
                                    }}
                                />
                                {/* Small Floating Details */}
                                <Box
                                    component={motion.div}
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                                        zIndex: 2,
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    <Grape size={32} color={theme.palette.primary.main} />
                                </Box>
                            </Box>
                        </motion.div>
                    </Stack>
                </Container>
            </Box>

            {/* Impact/Stats Section */}
            <Box sx={{ py: 10, bgcolor: 'white', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { label: 'Active Farmers', value: '1,200', suffix: '+' },
                            { label: 'Visits Logged', value: '5,500', suffix: '+' },
                            { label: 'Verification Accuracy', value: '99', suffix: '%' },
                            { label: 'Regional Coverage', value: '24', suffix: ' Districts' }
                        ].map((stat, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <Box textAlign="center">
                                    <Typography variant="h3" fontWeight="900" color="primary.main" gutterBottom sx={{ fontSize: { xs: '2.4rem', md: '3.5rem' } }}>
                                        <Counter value={stat.value} suffix={stat.suffix} delay={i * 0.1} />
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: { xs: '0.7rem', md: '0.85rem' } }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Feature Section */}
            <Box sx={{ py: 20, bgcolor: 'grey.50', position: 'relative' }}>
                <Container maxWidth="lg">
                    <Stack spacing={10}>
                        <Box textAlign="center">
                            <Typography variant="h2" fontWeight="900" mb={3} sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
                                Advanced Field Intelligence
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight="400" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.8 }}>
                                Deploy state-of-the-art technology to orchestrate your entire agricultural operation from a single, unified command center.
                            </Typography>
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
