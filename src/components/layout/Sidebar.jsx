import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Home,
    Users,
    Calendar,
    MapPin,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    ClipboardCheck,
    ClipboardList
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ icon: Icon, label, path, expanded, active }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ position: 'relative', px: 2, mb: 1 }}>
            {active && (
                <motion.div
                    layoutId="active-nav"
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        backgroundColor: '#64dd17',
                        borderRadius: '0 4px 4px 0'
                    }}
                />
            )}
            <motion.div
                whileHover={{ x: expanded ? 4 : 0 }}
                whileTap={{ scale: 0.98 }}
            >
                <IconButton
                    onClick={() => navigate(path)}
                    sx={{
                        width: '100%',
                        borderRadius: 3,
                        justifyContent: expanded ? 'flex-start' : 'center',
                        gap: 2,
                        bgcolor: active ? 'primary.50' : 'transparent',
                        color: active ? 'primary.main' : 'text.secondary',
                        '&:hover': {
                            bgcolor: active ? 'primary.50' : 'grey.100',
                            color: active ? 'primary.main' : 'primary.main',
                        },
                        py: 1.5
                    }}
                >
                    <motion.div whileHover={{ scale: 1.2 }}>
                        <Icon size={22} />
                    </motion.div>
                    {expanded && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                            {label}
                        </motion.span>
                    )}
                </IconButton>
            </motion.div>
        </Box>
    );
};

const Sidebar = () => {
    const [expanded, setExpanded] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Farmers', path: '/farmers' },
        { icon: Calendar, label: 'Visits', path: '/visits' },
    ];

    if (user?.role === 'staff') {
        menuItems.push({ icon: ClipboardCheck, label: 'Daily Summary', path: '/daily-summary' });
    }

    if (user?.role === 'admin') {
        menuItems.push({ icon: BarChart3, label: 'Admin Portal', path: '/admin' });
        menuItems.push({ icon: ClipboardList, label: 'Daily Reports', path: '/admin/reports' });
    }

    menuItems.push({ icon: Settings, label: 'Settings', path: '/settings' });

    const handleLogout = () => {
        const isAdmin = user?.role === 'admin';
        logout();
        if (isAdmin) {
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <motion.div
            animate={{
                width: expanded ? 240 : 80,
                minWidth: expanded ? 240 : 80,
                maxWidth: expanded ? 240 : 80
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
                backgroundColor: 'white',
                borderRight: '1px solid #e2e8f0',
                height: '100vh',
                position: 'sticky',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
                flexShrink: 0,
                zIndex: 1000
            }}
        >
            <Box sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: expanded ? 'flex-start' : 'center', gap: 2 }}>
                <Box component="img" src="/grape_master_logo.png" sx={{ width: 32, height: 32, objectFit: 'contain' }} />
                {expanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Typography variant="h6" fontWeight="800" color="primary.main">Grape Master</Typography>
                    </motion.div>
                )}
                {expanded && (
                    <IconButton onClick={() => setExpanded(!expanded)} size="small" sx={{ ml: 'auto', bgcolor: 'grey.50' }}>
                        <ChevronLeft size={18} />
                    </IconButton>
                )}
                {!expanded && (
                    <IconButton onClick={() => setExpanded(!expanded)} size="small" sx={{ bgcolor: 'grey.50' }}>
                        <ChevronRight size={18} />
                    </IconButton>
                )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <NavItem
                        key={item.path}
                        {...item}
                        expanded={expanded}
                        active={location.pathname === item.path}
                    />
                ))}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
                <Box sx={{ position: 'relative', px: 2, mb: 1 }}>
                    <motion.div
                        whileHover={{ x: expanded ? 4 : 0 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                width: '100%',
                                borderRadius: 3,
                                justifyContent: expanded ? 'flex-start' : 'center',
                                gap: 2,
                                color: 'text.secondary',
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                    color: 'error.main',
                                },
                                py: 1.5
                            }}
                        >
                            <motion.div whileHover={{ scale: 1.2 }}>
                                <LogOut size={22} />
                            </motion.div>
                            {expanded && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ fontSize: '14px', fontWeight: 600 }}
                                >
                                    Logout
                                </motion.span>
                            )}
                        </IconButton>
                    </motion.div>
                </Box>
            </Box>
        </motion.div>
    );
};

export default Sidebar;
