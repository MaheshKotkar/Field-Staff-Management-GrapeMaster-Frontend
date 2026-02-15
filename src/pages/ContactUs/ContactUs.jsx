import React, { useState } from 'react';
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
    Button,
    TextField,
    Alert,
    CircularProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    User,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';
import AnimatedCard from '../../components/animations/AnimatedCard';

const ContactInfoItem = ({ icon: Icon, title, content, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
    >
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
            <Box sx={{
                p: 2,
                bgcolor: 'primary.50',
                color: 'primary.main',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'fit-content',
                boxShadow: '0 8px 16px rgba(100, 221, 23, 0.1)'
            }}>
                <Icon size={24} />
            </Box>
            <Box>
                <Typography variant="subtitle2" fontWeight="900" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="body1" fontWeight="700" sx={{ fontSize: '1.1rem' }}>
                    {content}
                </Typography>
            </Box>
        </Box>
    </motion.div>
);

const ContactUs = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/contact', formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: response.data.message });
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Something went wrong. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
            {/* Header / Back Button */}
            <Box sx={{
                position: 'absolute',
                top: 20,
                left: { xs: 10, md: 40 },
                zIndex: 100
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
                pt: { xs: 15, md: 20 },
                pb: { xs: 15, md: 25 },
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '60%',
                    height: '100%',
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
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
                            GET IN TOUCH
                        </Typography>
                        <Typography variant="h1" sx={{
                            fontSize: { xs: '3rem', md: '5rem' },
                            fontWeight: 900,
                            mb: 3,
                            lineHeight: 1.1
                        }}>
                            Let's Connect and <br />
                            <span style={{ color: theme.palette.primary.light }}>Grow Together</span>
                        </Typography>
                        <Typography variant="h5" sx={{ maxWidth: 700, opacity: 0.9, fontWeight: 400 }}>
                            Have questions about our programs or services? Our team of experts is dedicated to providing the support you need.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -12, position: 'relative', zIndex: 10 }}>
                <Grid2 container spacing={4}>
                    {/* Contact Info */}
                    <Grid2 size={{ xs: 12, md: 5 }}>
                        <AnimatedCard delay={0.2} sx={{ p: 6, height: '100%', bgcolor: 'white' }}>
                            <Typography variant="h4" fontWeight="900" mb={5}>Contact Information</Typography>

                            <ContactInfoItem
                                icon={MapPin}
                                title="Visit Us"
                                content="Flat No 204, Padmalaya Apartment, Nashik, Maharashtra - 422002"
                                delay={0.3}
                            />
                            <ContactInfoItem
                                icon={Phone}
                                title="Call Us"
                                content="+91 7972371656"
                                delay={0.4}
                            />
                            <ContactInfoItem
                                icon={Mail}
                                title="Email Us"
                                content="admin@grapemaster.org"
                                delay={0.5}
                            />

                        </AnimatedCard>
                    </Grid2>

                    {/* Contact Form */}
                    <Grid2 size={{ xs: 12, md: 7 }}>
                        <AnimatedCard delay={0.4} sx={{ p: 6, bgcolor: 'white' }}>
                            <Typography variant="h4" fontWeight="900" mb={2}>Send a Message</Typography>
                            <Typography variant="body1" color="text.secondary" mb={5}>
                                Fill out the form below and we'll get back to you within 24 hours.
                            </Typography>

                            <AnimatePresence>
                                {status.type && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ marginBottom: '24px' }}
                                    >
                                        <Alert
                                            severity={status.type}
                                            icon={status.type === 'success' ? <CheckCircle2 size={20} /> : undefined}
                                            sx={{ borderRadius: 3, fontWeight: 600 }}
                                        >
                                            {status.message}
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit}>
                                <Grid2 container spacing={3}>
                                    <Grid2 size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Your Name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            variant="filled"
                                            InputProps={{
                                                startAdornment: <User size={18} style={{ marginRight: 12, opacity: 0.5 }} />,
                                                disableUnderline: true,
                                                sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            variant="filled"
                                            InputProps={{
                                                startAdornment: <Mail size={18} style={{ marginRight: 12, opacity: 0.5 }} />,
                                                disableUnderline: true,
                                                sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            variant="filled"
                                            InputProps={{
                                                startAdornment: <MessageSquare size={18} style={{ marginRight: 12, opacity: 0.5 }} />,
                                                disableUnderline: true,
                                                sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Your Message"
                                            name="message"
                                            required
                                            multiline
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            variant="filled"
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: { borderRadius: 3, bgcolor: '#f8fafc', p: 2 }
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            type="submit"
                                            disabled={loading}
                                            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                                            sx={{
                                                py: 2,
                                                borderRadius: 4,
                                                fontSize: '1.1rem',
                                                fontWeight: 800,
                                                boxShadow: '0 12px 24px rgba(100, 221, 23, 0.3)',
                                                '&:hover': {
                                                    boxShadow: '0 8px 16px rgba(100, 221, 23, 0.2)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {loading ? 'Sending Message...' : 'Send Message'}
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </form>
                        </AnimatedCard>
                    </Grid2>
                </Grid2>
            </Container>

        </Box>
    );
};

export default ContactUs;
