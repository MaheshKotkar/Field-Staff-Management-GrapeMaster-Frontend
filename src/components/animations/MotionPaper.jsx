import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * A wrapper for motion.div that filters out transition coordination props
 * passed by MUI (e.g., Dialog, Slide, Fade) to prevent React 19 console warnings.
 */
const MotionPaper = forwardRef(({
    // Filter out these MUI transition coordination props
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    ownerState,
    direction,
    appear,
    enter,
    exit,
    ...props
}, ref) => (
    <motion.div ref={ref} {...props} />
));

export default MotionPaper;
