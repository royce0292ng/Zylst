"use client"

import { Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion"; // Import motion
import { Camera, Gift, Sparkles, Target, Users } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import CelestialBackground from "@/components/CelestialBackGround";
import JoinWaitingList, {RollingCounter} from "@/components/JoinWaitingList";
import { Footer } from "@/components/ui/Footer";
import {getWaitlistCount} from "@/app/actions/waitlist";
import {useEffect, useState} from "react";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40, transition: { type: "spring", damping: 20, stiffness: 100 }},
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
};


const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

export default function ZylstLanding() {

    const [totalWaitlist, setTotalWaitlist] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const count = await getWaitlistCount();
            setTotalWaitlist(count);
        };
        fetchCount();
    }, []);

    return (
        <main className="relative min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden selection:bg-blue-500/30">
            <CelestialBackground />
            <Navbar />

            {/* 3. HERO SECTION - ENTRANCE ANIMATION */}
            <section className="relative z-10 flex flex-col items-center justify-center text-center pt-32 md:pt-48 pb-20 px-6 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-medium mb-6 animate-pulse"
                >
                    <Sparkles size={14} /> <span>Redefining the Gifting Experience</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1] md:leading-[0.9]"
                >
                    Stop Guessing. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-100 via-blue-400 to-blue-700 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                        Gift at the Zenith.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-slate-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed px-4"
                >
                    The wishlist platform where your deepest desires meet their perfect match—without spoiling the surprise.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex -space-x-2">
                        {/* Optional: Add small avatar circles here for effect */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-slate-400 font-medium">
                        Join <span className="text-blue-400 font-bold">
                      <RollingCounter target={totalWaitlist} />+
                    </span> others reaching the Zenith.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <JoinWaitingList />
                </motion.div>
            </section>

            {/* 4. THE STEPS - STAGGERED SCROLL REVEAL */}
            <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { icon: <Target />, title: "1. Aim High", desc: "Save any item from any corner of the web with the Zylst Scraper." },
                        { icon: <Users />, title: "2. Share the Map", desc: "Send your private link to your inner circle. No more awkward texts." },
                        { icon: <Sparkles />, title: "3. Mystery Claim", desc: "Items are reserved instantly, but the giver stays hidden until the reveal." }
                    ].map((step, i) => (
                        <motion.div key={i} variants={fadeInUp}>
                            <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md p-4 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all group duration-500">
                                <CardHeader className="flex gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/40 transition-transform">
                                        {step.icon}
                                    </div>
                                    <p className="text-lg text-white font-bold">{step.title}</p>
                                </CardHeader>
                                <CardBody className="text-slate-400 text-sm leading-relaxed">
                                    {step.desc}
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* 5. GAMIFIED FEATURES - VIEWPORT ANIMATION */}
            <section id="features" className="relative z-10 bg-white/[0.01] border-y border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Engineered for Celebration</h2>
                        <p className="text-slate-500">Why settle for a boring list? Make it an event.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-10 order-2 lg:order-1"
                        >
                            <FeatureItem
                                icon={<Gift />}
                                color="bg-blue-600"
                                title="The Lucky Wheel"
                                desc="Can't decide? Friends can spin a fate wheel of your wishes to decide which one to grant."
                            />
                            <FeatureItem
                                icon={<Camera />}
                                color="bg-purple-600"
                                title="Proof of Joy"
                                desc="Scan the Gift QR to reveal the giver and unlock a barrage of confetti and digital blessings."
                            />
                        </motion.div>

                        {/* INTERACTIVE PREVIEW - FLOATING ANIMATION */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative order-1 lg:order-2"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px]" />
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Card className="bg-black/60 border-white/10 aspect-video flex items-center justify-center border-dashed border-2 backdrop-blur-xl">
                                    <div className="text-center p-8">
                                        <motion.div
                                            animate={{ rotate: [-15, 15] }}
                                            transition={{ duration: 2 , repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                            className="mb-4 inline-block"
                                        >
                                            <Sparkles className="text-blue-500 opacity-50" size={40} />
                                        </motion.div>
                                        <p className="text-xs uppercase tracking-widest text-blue-500 font-bold mb-2">Feature Preview</p>
                                        <p className="text-slate-500 text-sm font-medium italic">Interactive "Lucky Wheel" UI Coming to Beta</p>
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Sub-component for clean code and reused variants
function FeatureItem({ icon, color, title, desc }: { icon: any, color: string, title: string, desc: string }) {
    return (
        <motion.div variants={fadeInUp} className="flex gap-6 items-start group">
            <div className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{title}</h4>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
}