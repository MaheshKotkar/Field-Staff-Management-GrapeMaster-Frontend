import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const BarItem = ({ label, value, max, color, delay }) => {
    const percentage = (value / max) * 100;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 1 }}>
            <Tooltip
                title={`${value} units`}
                arrow
                slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: { offset: [0, -10] },
                            },
                        ],
                    },
                }}
                TransitionComponent={motion.div}
                TransitionProps={{
                    initial: { opacity: 0, scale: 0.5 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.5 }
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', height: 200, bgcolor: 'grey.50', borderRadius: 2, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1.5, delay, ease: "easeOut" }}
                        style={{
                            width: '100%',
                            background: color,
                            borderRadius: '4px 4px 0 0'
                        }}
                    />
                </Box>
            </Tooltip>
            <Typography variant="caption" fontWeight="600" color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
};

const AdminAnalytics = () => {
    const data = [
        { label: 'Mon', value: 45, color: '#64dd17' },
        { label: 'Tue', value: 80, color: '#7c4dff' },
        { label: 'Wed', value: 65, color: '#64dd17' },
        { label: 'Thu', value: 90, color: '#7c4dff' },
        { label: 'Fri', value: 55, color: '#64dd17' },
        { label: 'Sat', value: 30, color: '#64dd17' },
        { label: 'Sun', value: 20, color: '#64dd17' },
    ];

    const max = Math.max(...data.map(d => d.value));

    return (
        <Box sx={{ py: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ height: 240, gap: 1 }}>
                {data.map((item, index) => (
                    <BarItem
                        key={item.label}
                        {...item}
                        max={max + 10}
                        delay={index * 0.1}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default AdminAnalytics;
