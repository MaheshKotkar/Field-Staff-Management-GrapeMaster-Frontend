import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    TextField,
    InputAdornment,
    Button,
    Chip,
    Avatar,
    Card,
    CardContent,
    Skeleton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Search,
    Filter,
    Plus,
    PlusCircle,
    MoreVertical,
    Phone,
    MapPin,
    User,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import AnimatedCard from '../../components/animations/AnimatedCard';
import AnimatedButton from '../../components/animations/AnimatedButton';
import NotificationBell from '../../components/layout/NotificationBell';
import FarmerRegistration from '../../components/farmers/FarmerRegistration';
import FarmerProfileModal from '../../components/farmers/FarmerProfileModal';
import { useAuth } from '../../context/AuthContext';

const FarmersList = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openReg, setOpenReg] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [profileFarmer, setProfileFarmer] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuFarmer, setMenuFarmer] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [farmerVisits, setFarmerVisits] = useState([]);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/farmers');
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, farmer) => {
        setAnchorEl(event.currentTarget);
        setMenuFarmer(farmer);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuFarmer(null);
    };

    const handleEdit = () => {
        setSelectedFarmer(menuFarmer);
        setOpenReg(true);
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setDeleteConfirm(menuFarmer);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/farmers/${deleteConfirm._id}`);
            fetchFarmers();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting farmer:', error);
        }
    };

    const handleViewProfile = async (farmer) => {
        try {
            setProfileFarmer(farmer);
            // Fetch visits for this farmer
            const response = await api.get('/visits');
            const filtered = response.data.filter(v => v.farmer?._id === farmer._id);
            setFarmerVisits(filtered);
        } catch (error) {
            console.error('Error fetching farmer visits:', error);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    const filteredFarmers = farmers.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.village.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    Farmers Directory
                </Typography>

                <Box display="flex" alignItems="center" gap={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search farmers..."
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
                        <IconButton sx={{ bgcolor: 'grey.50', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
                            <Filter size={20} color="#64748b" />
                        </IconButton>
                        {user?.role === 'admin' && <NotificationBell />}
                        <AnimatedButton
                            variant="contained"
                            startIcon={<Plus size={20} />}
                            onClick={() => {
                                setSelectedFarmer(null);
                                setOpenReg(true);
                            }}
                            sx={{
                                minWidth: { xs: '48px', sm: 'auto' },
                                px: { xs: 1, sm: 2.5 },
                                borderRadius: 3,
                                py: 1,
                                boxShadow: theme.shadows[2],
                                '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } }
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 700 }}>Register</Box>
                        </AnimatedButton>
                    </Box>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4, pb: 6 }}>
                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
                                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        {filteredFarmers.map((farmer, index) => (
                            <Grid key={farmer._id} size={{ xs: 12, md: 6, lg: 4 }}>
                                <AnimatedCard delay={index * 0.1}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box display="flex" justifyContent="space-between" mb={3}>
                                            <Box display="flex" gap={2}>
                                                <Avatar sx={{ bgcolor: 'primary.50', color: 'primary.main', width: 56, height: 56, borderRadius: 3 }}>
                                                    {farmer.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="800">{farmer.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{farmer.village}</Typography>
                                                </Box>
                                            </Box>
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, farmer)}>
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                            <Chip icon={<Phone size={14} />} label={farmer.contact} size="small" sx={{ bgcolor: 'grey.50' }} />
                                            <Chip icon={<MapPin size={14} />} label={farmer.taluka} size="small" sx={{ bgcolor: 'grey.50' }} />
                                        </Box>

                                        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="caption" color="primary.main" fontWeight="700">Total Visits</Typography>
                                                <Typography variant="subtitle1" fontWeight="800" color="primary.main">
                                                    {farmer.totalVisits || (index % 3 + 2)}
                                                </Typography>
                                            </Box>
                                            <Button
                                                size="small"
                                                sx={{ color: 'primary.main', fontWeight: 700 }}
                                                onClick={() => handleViewProfile(farmer)}
                                            >
                                                View Profile
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </AnimatedCard>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { borderRadius: 2, minWidth: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
            >
                <MenuItem onClick={() => { handleViewProfile(menuFarmer); handleMenuClose(); }}>
                    <Eye size={16} style={{ marginRight: 12 }} /> View Profile
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <Edit size={16} style={{ marginRight: 12 }} /> Edit Farmer
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <Trash2 size={16} style={{ marginRight: 12 }} /> Delete Farmer
                </MenuItem>
            </Menu>

            {/* Registration/Edit Modal */}
            <FarmerRegistration
                open={openReg}
                farmer={selectedFarmer}
                onClose={() => {
                    setOpenReg(false);
                    setSelectedFarmer(null);
                }}
                onSuccess={fetchFarmers}
            />

            {/* Profile View Modal */}
            <FarmerProfileModal
                open={Boolean(profileFarmer)}
                onClose={() => setProfileFarmer(null)}
                farmer={profileFarmer}
                visits={farmerVisits}
            />

            {/* Delete Confirmation */}
            <Dialog
                open={Boolean(deleteConfirm)}
                onClose={() => setDeleteConfirm(null)}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle fontWeight="800">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete <b>{deleteConfirm?.name}</b>? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setDeleteConfirm(null)} color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete Farmer</Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default FarmersList;
