import React from 'react';
import { Card } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

const AnimatedCard = ({ children, delay = 0, sx, ...props }) => {
    return (
        <MotionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.1, 0.25, 1.0]
            }}
            whileHover={{
                y: -6,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                borderColor: "rgba(100, 221, 23, 0.5)"
            }}
            sx={{
                border: '1px solid rgba(226, 232, 240, 0.8)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                ...sx,
            }}
            {...props}
        >
            {children}
        </MotionCard>
    );
};

export default AnimatedCard;
