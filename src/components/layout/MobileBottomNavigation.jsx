import React from 'react';
import {
    Box,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Home, Users, Calendar, BarChart3, ClipboardCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNavigation = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const getValue = () => {
        if (location.pathname.includes('dashboard')) return 0;
        if (location.pathname.includes('farmers')) return 1;
        if (location.pathname.includes('visits')) return 2;
        if (location.pathname.includes('admin')) return 3;
        return 0;
    };

    const menuItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Users, label: 'Farmers', path: '/farmers' },
        { icon: Calendar, label: 'Visits', path: '/visits' },
    ];

    if (user?.role === 'staff') {
        menuItems.push({ icon: ClipboardCheck, label: 'EOD', path: '/daily-summary' });
    }

    if (user?.role === 'admin') {
        menuItems.push({ icon: BarChart3, label: 'Admin', path: '/admin' });
    }

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: { md: 'none' },
                zIndex: 1000,
                borderRadius: '20px 20px 0 0',
                overflow: 'hidden',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={getValue()}
                onChange={(event, newValue) => {
                    navigate(menuItems[newValue].path);
                }}
                sx={{ bgcolor: 'transparent', height: 70 }}
            >
                {menuItems.map((item, index) => {
                    const isActive = getValue() === index;
                    return (
                        <BottomNavigationAction
                            key={index}
                            label={item.label}
                            icon={
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        y: isActive ? -4 : 0,
                                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <item.icon size={22} />
                                </motion.div>
                            }
                            sx={{
                                '& .MuiBottomNavigationAction-label': {
                                    fontSize: '11px',
                                    fontWeight: isActive ? 700 : 500,
                                    opacity: isActive ? 1 : 0.7,
                                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary
                                }
                            }}
                        />
                    );
                })}
            </BottomNavigation>
        </Paper>
    );
};

export default MobileBottomNavigation;
