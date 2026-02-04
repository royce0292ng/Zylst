"use client";
import { motion } from "framer-motion";

export const CelestialBackground = () => {
    return (
        <div className="fixed inset-0 z-0 bg-[#020617] overflow-hidden">
            {/* The Grain Overlay - Kills Pixelation */}
            <div className="absolute inset-0 z-[3] opacity-[0.05] pointer-events-none bg-grain" />

            {/* Animated Nebula 1 (Blue) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] z-[1]"
            />

            {/* Animated Nebula 2 (Purple) */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] z-[1]"
            />

            {/* Animated Nebula 3 (Deep Indigo) */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[20%] left-[20%] w-[80%] h-[80%] bg-indigo-900/5 rounded-full blur-[100px] z-[1]"
            />
        </div>
    );
};