import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const MotionButton = motion.create(Button);

const AnimatedButton = ({ children, sx, ...props }) => {
    return (
        <MotionButton
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            sx={{
                borderRadius: '12px',
                ...sx,
            }}
            {...props}
        >
            {children}
        </MotionButton>
    );
};

export default AnimatedButton;
