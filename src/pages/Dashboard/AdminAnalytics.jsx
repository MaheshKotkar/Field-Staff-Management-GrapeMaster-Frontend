import { Box, Typography, Tooltip, Fade } from '@mui/material';
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
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
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

const AdminAnalytics = ({ visits = [] }) => {
    // Group visits by day of week for the last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    // Initialize last 7 days with 0
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        last7Days.push({
            label: days[d.getDay()],
            fullDate: d.toDateString(),
            value: 0,
            color: i % 2 === 0 ? '#64dd17' : '#7c4dff'
        });
    }

    // Fill with actual data
    visits.forEach(visit => {
        const visitDate = new Date(visit.createdAt).toDateString();
        const dayMatch = last7Days.find(d => d.fullDate === visitDate);
        if (dayMatch) {
            dayMatch.value += 1;
        }
    });

    const max = Math.max(...last7Days.map(d => d.value), 5); // Minimum max of 5 for better scale

    return (
        <Box sx={{ py: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ height: 240, gap: 1 }}>
                {last7Days.map((item, index) => (
                    <BarItem
                        key={index}
                        {...item}
                        max={max + 1}
                        delay={index * 0.1}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default AdminAnalytics;
