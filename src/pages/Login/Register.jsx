import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Link,
    useTheme,
    Alert,
    CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Grape, Mail, Lock, Eye, EyeOff, ArrowRight, User, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedButton from '../../components/animations/AnimatedButton';
import AnimatedCard from '../../components/animations/AnimatedCard';
import Footer from '../../components/layout/Footer';
import PublicNavbar from '../../components/layout/PublicNavbar';

const FloatingIcon = ({ icon: Icon, delay, initialX, initialY, color }) => (
    <motion.div
        initial={{ x: initialX, y: initialY, opacity: 0 }}
        animate={{
            y: [initialY, initialY - 40, initialY],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 15, -15, 0]
        }}
        transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        style={{
            position: 'absolute',
            color,
            zIndex: 0
        }}
    >
        <Icon size={48} strokeWidth={1.5} />
    </motion.div>
);

const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: { xs: 12, md: 16 },
                    pb: 8,
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #f5f3ff 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <PublicNavbar showActions={false} />
                {/* Floating Background Decorations */}
                <FloatingIcon icon={Leaf} delay={0} initialX="10%" initialY="20%" color={theme.palette.primary.light} />
                <FloatingIcon icon={Grape} delay={2} initialX="85%" initialY="15%" color={theme.palette.secondary.light} />
                <FloatingIcon icon={Leaf} delay={4} initialX="80%" initialY="70%" color={theme.palette.primary.main} />
                <FloatingIcon icon={Grape} delay={1} initialX="15%" initialY="75%" color={theme.palette.secondary.main} />

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <AnimatedCard sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, position: 'relative' }}>
                            <IconButton
                                onClick={() => navigate('/')}
                                sx={{
                                    position: 'absolute',
                                    top: { xs: 8, md: 16 },
                                    left: { xs: 8, md: 16 },
                                    bgcolor: 'grey.50',
                                    '&:hover': { bgcolor: 'primary.50', color: 'primary.main' }
                                }}
                            >
                                <ChevronLeft size={20} />
                            </IconButton>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            bgcolor: 'white',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            mb: 2,
                                            boxShadow: '0 8px 32px rgba(100, 221, 23, 0.2)',
                                            border: '2px solid',
                                            borderColor: 'primary.light'
                                        }}
                                    >
                                        <Box component="img" src="/grape_master_logo.png" sx={{ width: 48, height: 48, objectFit: 'contain' }} />
                                    </Box>
                                </motion.div>
                                <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                                    Join Grape Master
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Start managing your farm visits today.
                                </Typography>
                            </Box>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    margin="normal"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <User size={20} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    margin="normal"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail size={20} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    margin="normal"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={20} color={theme.palette.text.secondary} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <AnimatedButton
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading}
                                    color="secondary"
                                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                                    sx={{ py: 1.5, mb: 3, mt: 3 }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </AnimatedButton>

                                <Box textAlign="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Already have an account?{' '}
                                        <Link
                                            component="button"
                                            type="button"
                                            onClick={() => navigate('/login')}
                                            color="primary"
                                            sx={{ fontWeight: 700, textDecoration: 'none', border: 'none', background: 'none', p: 0, cursor: 'pointer' }}
                                        >
                                            Sign In
                                        </Link>
                                    </Typography>
                                </Box>
                            </Box>
                        </AnimatedCard>
                    </motion.div>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default Register;
