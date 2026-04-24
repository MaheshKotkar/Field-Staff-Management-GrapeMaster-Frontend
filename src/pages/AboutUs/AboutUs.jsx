import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    useTheme,
    Paper,
    Avatar,
    Stack,
    Divider,
    IconButton,
    Button
} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    Rocket,
    History,
    Users,
    ChevronLeft,
    Search,
    Database,
    Cpu,
    CheckCircle,
    TrendingUp,
    Globe,
    Shield,
    ArrowLeft
} from 'lucide-react';
import AnimatedCard from '../../components/animations/AnimatedCard';

const ProcessStep = ({ number, title, description, icon: Icon, delay }) => (
    <AnimatedCard
        delay={delay}
        sx={{
            height: '100%',
            p: 3,
            position: 'relative',
            overflow: 'visible', // Fix: allow the number circle to overflow
            mt: 2 // Add top margin to prevent clipping against container bounds
        }}
    >
        <Box sx={{
            position: 'absolute',
            top: -15,
            right: 20,
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: '900',
            boxShadow: '0 4px 12px rgba(100, 221, 23, 0.4)',
            zIndex: 10
        }}>
            {number}
        </Box>
        <Box sx={{ mb: 2, color: 'primary.main' }}>
            <Icon size={32} />
        </Box>
        <Typography variant="h6" fontWeight="800" mb={1}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            {description}
        </Typography>
    </AnimatedCard>
);

const AboutUs = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const processes = [
        { title: "Consultation", description: "Thorough consultation to understand specific goals, challenges, and requirements.", icon: Search },
        { title: "Data Collection", description: "Gathering soil samples, climate info, market trends, and regulatory data.", icon: Database },
        { title: "Custom Solutions", description: "Devising tailored crop management plans and irrigation strategies.", icon: Cpu },
        { title: "Implementation", description: "Executing planting schedules and managing pest/disease control.", icon: CheckCircle },
        { title: "Performance", description: "Regular monitoring and assessment of implemented strategies.", icon: TrendingUp },
        { title: "Global Logistics", description: "Managing compliance, quality standards, and international distribution.", icon: Globe }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header / Back Button */}
            <Box sx={{
                position: 'absolute',
                top: 20,
                left: { xs: 10, md: 40 },
                zIndex: 100,
                display: 'flex',
                alignItems: 'center'
            }}>
                <Button
                    onClick={() => navigate('/')}
                    startIcon={<ArrowLeft size={20} />}
                    sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        fontWeight: 700,
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)',
                            transform: 'translateX(-4px)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Back to Home
                </Button>
            </Box>

            {/* Hero Section */}
            <Box sx={{
                bgcolor: 'primary.dark',
                color: 'white',
                pt: { xs: 15, md: 20 }, // Increased pt to accommodate back button
                pb: { xs: 10, md: 15 },
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 100%)',
                    zIndex: 1
                }
            }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 700, opacity: 0.8 }}>
                            ESTABLISHED EXCELLENCE
                        </Typography>
                        <Typography variant="h1" sx={{
                            fontSize: { xs: '3rem', md: '5rem' },
                            fontWeight: 900,
                            mb: 3,
                            lineHeight: 1.1
                        }}>
                            Cultivating Success <br />
                            <span style={{ color: theme.palette.primary.light }}>Building Values</span>
                        </Typography>
                        <Typography variant="h5" sx={{ maxWidth: 700, opacity: 0.9, fontWeight: 400, transform: 'translateX(2px)' }}>
                            Grace Master Organic Farmer Producer Company is your trusted partner in agriculture consulting services,
                            dedicated to empowering farmers and bridging the gap to global markets.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 10, pb: 15 }}>
                {/* Vision & Mission Cards */}
                <Grid2 container spacing={4} mb={10}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <AnimatedCard delay={0.2} sx={{ p: 5, height: '100%', bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 3 }}>
                                    <Target size={32} />
                                </Box>
                                <Typography variant="h4" fontWeight="900">Our Vision</Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                We specialize in providing comprehensive consulting services for agricultural products.
                                Our visionary approach combines deep-rooted industry expertise with innovative strategies,
                                ensuring that farmers optimize their yields and quality while effectively reaching international markets.
                            </Typography>
                        </AnimatedCard>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <AnimatedCard delay={0.4} sx={{ p: 5, height: '100%', bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'secondary.50', color: 'secondary.main', borderRadius: 3 }}>
                                    <Rocket size={32} />
                                </Box>
                                <Typography variant="h4" fontWeight="900">Our Mission</Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                                To foster sustainable agricultural practices while bridging the gap between farmers and global markets.
                                We empower farmers with knowledge and tools to optimize productivity through personalized guidance,
                                innovative techniques, and the latest agricultural research.
                            </Typography>
                        </AnimatedCard>
                    </Grid2>
                </Grid2>

                {/* History Section */}
                <Box mb={15}>
                    <Grid2 container spacing={8} alignItems="center">
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <Typography variant="h3" fontWeight="900" mb={4}>Our Journey</Typography>
                                <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
                                    We started as a Farmer Producer Company linked directly to grower members. Our primary objective was to provide scientific knowledge to farmers at a reasonable price, increasing productivity by controlling losses and saving production costs.
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    As we moved forward, we expanded into exports to create a robust value chain for our member growers, ensuring that excellence in the field translates to premium recognition in global markets.
                                </Typography>
                                <Box sx={{ mt: 5, display: 'flex', gap: 4 }}>
                                    <Box>
                                        <Typography variant="h4" color="primary.main" fontWeight="900">100%</Typography>
                                        <Typography variant="caption" fontWeight="700">ORGANIC FOCUS</Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box>
                                        <Typography variant="h4" color="primary.main" fontWeight="900">DIRECT</Typography>
                                        <Typography variant="caption" fontWeight="700">FARMER LINK</Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{
                                    width: '100%',
                                    height: 400,
                                    borderRadius: 10,
                                    bgcolor: 'grey.200',
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1000")',
                                    backgroundSize: 'cover',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                }} />
                                <Paper sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    right: -20,
                                    p: 3,
                                    borderRadius: 4,
                                    bgcolor: 'white',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    display: { xs: 'none', sm: 'block' }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <Shield size={20} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="900">Certified Quality</Typography>
                                            <Typography variant="caption" color="text.secondary">Global Standards Met</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>

                {/* Working Process */}
                <Box textAlign="center" mb={6}>
                    <Typography variant="overline" color="primary.main" fontWeight="900" sx={{ letterSpacing: 2 }}>
                        HOW WE WORK
                    </Typography>
                    <Typography variant="h3" fontWeight="900" mt={1}>A Seamless Value Chain</Typography>
                </Box>
                <Grid2 container spacing={3}>
                    {processes.map((step, idx) => (
                        <Grid2 key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                            <ProcessStep
                                number={idx + 1}
                                title={step.title}
                                description={step.description}
                                icon={step.icon}
                                delay={0.1 * idx}
                            />
                        </Grid2>
                    ))}
                </Grid2>
            </Container>
        </Box>
    );
};

export default AboutUs;
