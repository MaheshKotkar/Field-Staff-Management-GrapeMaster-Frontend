import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#91ff35',
            main: '#64dd17',
            dark: '#1faa00',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#b39ddb',
            main: '#7c4dff',
            dark: '#3f1dcb',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Inter", "Outfit", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
        },
        h3: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h4: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(100, 221, 23, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #64dd17 0%, #33691e 100%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#f1f5f9',
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: '#64dd17',
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                            borderColor: '#64dd17',
                            boxShadow: '0 0 10px rgba(100, 221, 23, 0.1)',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
