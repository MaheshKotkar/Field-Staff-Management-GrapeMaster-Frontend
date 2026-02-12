import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    TextField,
    InputAdornment,
    Chip,
    Avatar,
    CardContent,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Slide,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    DialogActions,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Search,
    Filter,
    Calendar,
    MapPin,
    User,
    Clipboard,
    Sprout,
    Stethoscope,
    Image as ImageIcon,
    Clock,
    Plus,
    Check,
    SortAsc,
    SortDesc,
    X
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import NotificationBell from '../../components/layout/NotificationBell';
import api from '../../services/api';
import AnimatedCard from '../../components/animations/AnimatedCard';
import AnimatedButton from '../../components/animations/AnimatedButton';
import VisitStepper from './VisitStepper';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

import { useAuth } from '../../context/AuthContext';

const VisitsList = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openStepper, setOpenStepper] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateSort, setDateSort] = useState('newest');
    const [detailVisit, setDetailVisit] = useState(null);

    const handleOpenDetail = (visit) => {
        setDetailVisit(visit);
    };

    const handleCloseDetail = () => {
        setDetailVisit(null);
    };

    const fetchVisits = async () => {
        try {
            setLoading(true);
            const response = await api.get('/visits');
            setVisits(response.data);
        } catch (error) {
            console.error('Error fetching visits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        handleFilterClose();
    };

    const handleDateSort = (sort) => {
        setDateSort(sort);
        handleFilterClose();
    };

    const filteredVisits = visits
        .filter(v =>
            (v.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.locationAddress?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (statusFilter === 'all' || v.status === statusFilter)
        )
        .sort((a, b) => {
            const dateA = new Date(a.visitDate);
            const dateB = new Date(b.visitDate);
            return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <MainLayout>
            <Box className="nav-blur" sx={{
                px: { xs: 2.5, md: 4 },
                py: { xs: 2, md: 2.5 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                gap: { xs: 2, sm: 2 },
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Typography variant="h5" fontWeight="900" color="text.primary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                    Visit Logs
                </Typography>

                <Box display="flex" alignItems="center" gap={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search visits..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color="#64748b" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{
                            flexGrow: 1,
                            width: { xs: 'auto', sm: 220, md: 300 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'grey.100',
                                borderRadius: 3,
                                '& fieldset': { border: 'none' },
                                '&:hover fieldset': { border: 'none' },
                                '&.Mui-focused fieldset': { border: 'none' }
                            }
                        }}
                    />
                    <Box display="flex" gap={1}>
                        <IconButton
                            onClick={handleFilterClick}
                            sx={{
                                bgcolor: anchorEl ? 'primary.50' : 'grey.50',
                                color: anchorEl ? 'primary.main' : 'inherit',
                                borderRadius: 2.5,
                                border: '1px solid',
                                borderColor: anchorEl ? 'primary.200' : '#e2e8f0',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Filter size={20} color={anchorEl ? theme.palette.primary.main : "#64748b"} />
                        </IconButton>
                        {user?.role === 'admin' && <NotificationBell />}

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleFilterClose}
                            PaperProps={{
                                sx: {
                                    mt: 1.5,
                                    borderRadius: 3,
                                    minWidth: 200,
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    border: '1px solid #f1f5f9'
                                }
                            }}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="caption" fontWeight="800" color="text.disabled" sx={{ textTransform: 'uppercase' }}>
                                    Sort By Date
                                </Typography>
                            </Box>
                            <MenuItem onClick={() => handleDateSort('newest')}>
                                <ListItemIcon><SortDesc size={18} /></ListItemIcon>
                                <ListItemText primary="Newest First" primaryTypographyProps={{ variant: 'body2', fontWeight: dateSort === 'newest' ? 700 : 500 }} />
                                {dateSort === 'newest' && <Check size={16} color={theme.palette.primary.main} />}
                            </MenuItem>
                            <MenuItem onClick={() => handleDateSort('oldest')}>
                                <ListItemIcon><SortAsc size={18} /></ListItemIcon>
                                <ListItemText primary="Oldest First" primaryTypographyProps={{ variant: 'body2', fontWeight: dateSort === 'oldest' ? 700 : 500 }} />
                                {dateSort === 'oldest' && <Check size={16} color={theme.palette.primary.main} />}
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="caption" fontWeight="800" color="text.disabled" sx={{ textTransform: 'uppercase' }}>
                                    Status
                                </Typography>
                            </Box>
                            <MenuItem onClick={() => handleStatusFilter('all')}>
                                <ListItemText primary="All Visits" primaryTypographyProps={{ variant: 'body2', fontWeight: statusFilter === 'all' ? 700 : 500 }} />
                                {statusFilter === 'all' && <Check size={16} color={theme.palette.primary.main} />}
                            </MenuItem>
                            <MenuItem onClick={() => handleStatusFilter('pending')}>
                                <ListItemText primary="Pending" primaryTypographyProps={{ variant: 'body2', fontWeight: statusFilter === 'pending' ? 700 : 500 }} />
                                {statusFilter === 'pending' && <Check size={16} color={theme.palette.primary.main} />}
                            </MenuItem>
                            <MenuItem onClick={() => handleStatusFilter('verified')}>
                                <ListItemText primary="Verified" primaryTypographyProps={{ variant: 'body2', fontWeight: statusFilter === 'verified' ? 700 : 500 }} />
                                {statusFilter === 'verified' && <Check size={16} color={theme.palette.primary.main} />}
                            </MenuItem>
                            <MenuItem onClick={() => handleStatusFilter('rejected')}>
                                <ListItemText primary="Rejected" primaryTypographyProps={{ variant: 'body2', fontWeight: statusFilter === 'rejected' ? 700 : 500 }} />
                                {statusFilter === 'rejected' && <Check size={16} color={theme.palette.primary.main} />}
                            </MenuItem>
                        </Menu>
                        <AnimatedButton
                            variant="contained"
                            startIcon={<Plus size={20} />}
                            onClick={() => setOpenStepper(true)}
                            sx={{
                                minWidth: { xs: '48px', sm: 'auto' },
                                px: { xs: 1, sm: 2.5 },
                                borderRadius: 3,
                                py: 1,
                                '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } }
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 700 }}>Schedule</Box>
                        </AnimatedButton>
                    </Box>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 6 }}>
                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3].map((i) => (
                            <Grid key={i} size={{ xs: 12 }}>
                                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {filteredVisits.map((visit, index) => (
                            <AnimatedCard key={visit._id} delay={index * 0.05}>
                                <CardContent sx={{ p: 0 }}>
                                    <Grid container>
                                        <Grid size={{ xs: 12, md: 3 }} sx={{ p: 3, bgcolor: 'grey.50', borderRight: { md: '1px solid #e2e8f0' } }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                                                        <User size={20} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="800">{visit.farmer?.name || 'Unknown'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Farmer</Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={visit.status || 'pending'}
                                                    size="small"
                                                    color={visit.status === 'verified' ? 'success' : visit.status === 'rejected' ? 'error' : 'warning'}
                                                    sx={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '10px' }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Clock size={14} color="#64748b" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(visit.visitDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <MapPin size={14} color="#64748b" />
                                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                                                        {visit.locationAddress}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 9 }} sx={{ p: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <Sprout size={16} color="#4ade80" />
                                                        <Typography variant="subtitle2" fontWeight="700">Crop Analysis</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">Type: {visit.cropType || 'N/A'}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Stage: {visit.cropStage || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <Stethoscope size={16} color="#7c4dff" />
                                                        <Typography variant="subtitle2" fontWeight="700">Recommendations</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '100%'
                                                    }}>F: {visit.recommendation?.fertilizer || 'None'}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '100%'
                                                    }}>P: {visit.recommendation?.pesticide || 'None'}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                        <Clipboard size={16} color="#64748b" />
                                                        <Typography variant="subtitle2" fontWeight="700">Remarks</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {visit.remarks || 'No remarks provided.'}
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleOpenDetail(visit)}
                                                        sx={{
                                                            mt: 0.5,
                                                            p: 0,
                                                            minWidth: 'auto',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            color: 'primary.main',
                                                            textTransform: 'none',
                                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        View Full Details
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </AnimatedCard>
                        ))}
                    </Box>
                )}
            </Container>

            <Dialog
                fullScreen
                open={openStepper}
                onClose={() => setOpenStepper(false)}
                TransitionComponent={Transition}
            >
                <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
                    <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
                        <IconButton onClick={() => setOpenStepper(false)}><Plus style={{ transform: 'rotate(45deg)' }} /></IconButton>
                        <Typography variant="h6" fontWeight="800">Log New Visit</Typography>
                    </Box>
                    <Container maxWidth="md" sx={{ mt: 4 }}>
                        <VisitStepper onComplete={() => {
                            setOpenStepper(false);
                            fetchVisits();
                        }} />
                    </Container>
                </Box>
            </Dialog>

            {/* Visit Details Modal */}
            <Dialog
                open={Boolean(detailVisit)}
                onClose={handleCloseDetail}
                maxWidth="sm"
                fullWidth
                disableRestoreFocus
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                {detailVisit && (
                    <>
                        <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Box sx={{ p: 1, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 2, display: 'flex' }}>
                                    <Clipboard size={24} />
                                </Box>
                                <Typography variant="h6" fontWeight="800">Visit Details</Typography>
                            </Box>
                            <IconButton onClick={handleCloseDetail}><X size={20} /></IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                                            <User size={24} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="800">{detailVisit.farmer?.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Visit Date: {new Date(detailVisit.visitDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid size={12}>
                                    <Typography variant="subtitle2" fontWeight="800" color="primary.main" gutterBottom>
                                        FERTILIZER RECOMMENDATION
                                    </Typography>
                                    <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                                        {detailVisit.recommendation?.fertilizer || 'None recorded'}
                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="800" color="secondary.main" gutterBottom>
                                        PESTICIDE RECOMMENDATION
                                    </Typography>
                                    <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                                        {detailVisit.recommendation?.pesticide || 'None recorded'}
                                    </Typography>

                                    <Typography variant="subtitle2" fontWeight="800" color="text.primary" gutterBottom>
                                        GENERAL REMARKS
                                    </Typography>
                                    <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        {detailVisit.remarks || 'No remarks provided'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={handleCloseDetail}
                                variant="contained"
                                fullWidth
                                autoFocus
                                sx={{ borderRadius: 2, py: 1.2, fontWeight: 700 }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </MainLayout>
    );
};

export default VisitsList;
