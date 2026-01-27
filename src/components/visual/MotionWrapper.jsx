"use client";

import { motion } from "framer-motion";

export default function MotionWrapper({children, index}){
    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    )
}