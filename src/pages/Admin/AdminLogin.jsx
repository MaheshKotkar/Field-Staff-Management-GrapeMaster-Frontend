import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    useTheme,
    Alert,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedButton from '../../components/animations/AnimatedButton';
import AnimatedCard from '../../components/animations/AnimatedCard';

const AdminLogin = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
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

        const result = await login(formData.email, formData.password, 'admin');

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                setError('Access denied. You do not have administrator privileges.');
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                {/* Floating Background Decorations */}
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ position: 'absolute', left: '10%', top: '20%', color: theme.palette.primary.light, zIndex: 0 }}
                >
                    <ShieldCheck size={48} strokeWidth={1.5} />
                </Box>
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 8, delay: 2, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ position: 'absolute', left: '85%', top: '15%', color: theme.palette.secondary.light, zIndex: 0 }}
                >
                    <LayoutDashboard size={48} strokeWidth={1.5} />
                </Box>
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 8, delay: 4, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ position: 'absolute', left: '80%', top: '70%', color: theme.palette.primary.main, zIndex: 0 }}
                >
                    <ShieldCheck size={48} strokeWidth={1.5} />
                </Box>
                <Box
                    component={motion.div}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, 15, -15, 0]
                    }}
                    transition={{ duration: 8, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                    sx={{ position: 'absolute', left: '15%', top: '75%', color: theme.palette.secondary.main, zIndex: 0 }}
                >
                    <LayoutDashboard size={48} strokeWidth={1.5} />
                </Box>

                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
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
                                        <ShieldCheck size={40} color={theme.palette.primary.main} />
                                    </Box>
                                </motion.div>
                                <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                                    Admin Portal
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Secure enterprise access only.
                                </Typography>
                            </Box>

                            {error && (
                                <Box mb={2}>
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                                </Box>
                            )}

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <TextField
                                    fullWidth
                                    label="Admin Email"
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
                                    label="Security Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
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
                                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                                    sx={{ py: 1.5, mt: 3, mb: 3 }}
                                >
                                    {loading ? 'Authorizing...' : 'Authorize Access'}
                                </AnimatedButton>

                                <Box textAlign="center" pt={2} borderTop="1px solid" borderColor="divider">
                                    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
                                        Enterprise Security Protocol
                                    </Typography>
                                </Box>
                            </Box>
                        </AnimatedCard>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminLogin;
