import React, { useState, useEffect, useCallback } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Button,
    CircularProgress,
} from '@mui/material';
import { Bell, UserPlus, MapPin, ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (!user || user.role !== 'admin') return;
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user, fetchNotifications]);

    if (!user || user.role !== 'admin') return null;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        handleMarkAsRead(notification._id);
        handleClose();

        switch (notification.type) {
            case 'farmer':
                navigate('/farmers');
                break;
            case 'visit':
                navigate('/visits');
                break;
            case 'report':
                navigate('/admin/reports');
                break;
            default:
                break;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'farmer': return <UserPlus size={18} />;
            case 'visit': return <MapPin size={18} />;
            case 'report': return <ClipboardList size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'farmer': return 'primary.main';
            case 'visit': return 'secondary.main';
            case 'report': return 'info.main';
            default: return 'grey.500';
        }
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{
                    bgcolor: open ? 'grey.100' : 'transparent',
                    transition: 'all 0.2s'
                }}
            >
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                    <Bell size={22} color={unreadCount > 0 ? "#10b981" : "#64748b"} />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: '100%',
                        maxWidth: { xs: 'calc(100vw - 32px)', sm: 360 },
                        maxHeight: 480,
                        borderRadius: 3,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #f1f5f9',
                        overflow: 'hidden'
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" fontWeight="800">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            onClick={handleMarkAllAsRead}
                            sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'none' }}
                        >
                            Mark all as read
                        </Button>
                    )}
                </Box>
                <Divider />

                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Bell size={40} color="#e2e8f0" style={{ marginBottom: 8 }} />
                            <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
                        </Box>
                    ) : (
                        notifications.map((notification) => (
                            <React.Fragment key={notification._id}>
                                <ListItem
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: notification.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.04)',
                                        '&:hover': { bgcolor: 'grey.50' },
                                        transition: 'background-color 0.2s',
                                        py: 1.5
                                    }}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: getColor(notification.type), color: 'white', width: 40, height: 40 }}>
                                            {getIcon(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={notification.isRead ? 600 : 800}>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="caption" color="text.primary" display="block" sx={{ mb: 0.5 }}>
                                                    {notification.message}
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <Clock size={12} color="#94a3b8" />
                                                    <Typography variant="caption" color="text.disabled">
                                                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        secondaryTypographyProps={{ component: 'div' }}
                                    />
                                    {!notification.isRead && (
                                        <Box sx={{ width: 8, height: 8, bgcolor: 'error.main', borderRadius: '50%', ml: 1 }} />
                                    )}
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>

                {notifications.length > 0 && (
                    <Box sx={{ p: 1.5, textAlign: 'center' }}>
                        <Button fullWidth size="small" variant="text" sx={{ fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}>
                            View all activity
                        </Button>
                    </Box>
                )}
            </Popover>
        </>
    );
};

export default NotificationBell;
