import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top scroll behavior
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <Zoom in={isVisible}>
            <Fab
                color="primary"
                size="medium"
                aria-label="scroll back to top"
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 20, md: 40 },
                    right: { xs: 20, md: 40 },
                    zIndex: 1000,
                    boxShadow: '0 8px 32px rgba(100, 221, 23, 0.3)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(100, 221, 23, 0.4)',
                    },
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <ArrowUp size={24} />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;
