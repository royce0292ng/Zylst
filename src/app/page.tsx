"use client"

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    HeroUIProvider,
    Input,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem, NavbarMenu,
    NavbarMenuItem, NavbarMenuToggle
} from "@heroui/react";
import {Camera, Gift, Sparkles, Target, Users} from "lucide-react";
import {CelestialBackground} from "../components/CelestialBackGround";
import {useState} from "react";

export default function ZylstLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = ["How it Works", "Features", "Secret Santa", "Pricing"];

    return (
        <main className="relative min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden selection:bg-blue-500/30">

            {/* 🌌 Living Nebula Background */}
            <CelestialBackground />

            {/* 2. RESPONSIVE NAVIGATION */}
            <Navbar
                onMenuOpenChange={setIsMenuOpen}
                isBordered
                className="bg-black/40 backdrop-blur-md border-white/10 fixed top-0"
                maxWidth="xl"
            >
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden text-white"
                    />
                    <NavbarBrand>
                        <p className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                            ZYLST
                        </p>
                    </NavbarBrand>
                </NavbarContent>

                {/* Desktop Links */}
                <NavbarContent className="hidden sm:flex gap-8" justify="center">
                    {menuItems.map((item, index) => (
                        <NavbarItem key={index}>
                            <Link className="text-slate-400 hover:text-white text-sm transition-colors" href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
                                {item}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button variant="flat" size="sm" className="text-white bg-white/10 hover:bg-white/20">Login</Button>
                    </NavbarItem>
                </NavbarContent>

                {/* Mobile Menu Drawer */}
                <NavbarMenu className="bg-black/90 backdrop-blur-xl pt-6 border-t border-white/10">
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link className="w-full text-white text-xl py-2" href="#" size="lg">
                                {item}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                    <Button color="primary" className="mt-4 font-bold">Try Zylst Now</Button>
                </NavbarMenu>
            </Navbar>

            {/* 3. HERO SECTION - RESPONSIVE TYPOGRAPHY */}
            <section className="relative z-10 flex flex-col items-center justify-center text-center pt-32 md:pt-48 pb-20 px-6 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-medium mb-6 animate-pulse">
                    <Sparkles size={14} /> <span>Redefining the Gifting Experience</span>
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1] md:leading-[0.9]">
                    Stop Guessing. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-100 via-blue-400 to-blue-700 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            Gift at the Zenith.
          </span>
                </h1>

                <p className="text-slate-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed px-4">
                    The wishlist platform where your deepest desires meet their perfect match—without spoiling the surprise.
                </p>

                {/* RESPONSIVE INPUT GROUP */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-4">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        variant="bordered"
                        className="w-full"
                        classNames={{ inputWrapper: "border-white/10 bg-black/40" }}
                    />
                    <Button color="primary" size="lg" className="w-full sm:w-auto font-bold bg-blue-600 shadow-lg shadow-blue-500/20 shrink-0">
                        Join the Zenith
                    </Button>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-500">Early access users get the "Celestial" founder badge.</p>
            </section>

            {/* 4. THE STEPS - STACKS ON MOBILE */}
            <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Target />, title: "1. Aim High", desc: "Save any item from any corner of the web with the Zylst Scraper." },
                        { icon: <Users />, title: "2. Share the Map", desc: "Send your private link to your inner circle. No more awkward texts." },
                        { icon: <Sparkles />, title: "3. Mystery Claim", desc: "Items are reserved instantly, but the giver stays hidden until the reveal." }
                    ].map((step, i) => (
                        <Card key={i} className="bg-white/[0.03] border-white/10 backdrop-blur-md p-4 hover:border-blue-500/30 transition-all">
                            <CardHeader className="flex gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">{step.icon}</div>
                                <p className="text-lg text-white font-bold">{step.title}</p>
                            </CardHeader>
                            <CardBody className="text-slate-400 text-sm leading-relaxed">
                                {step.desc}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 5. GAMIFIED FEATURES - REVERSED STACKING */}
            <section id="features" className="relative z-10 bg-white/[0.01] border-y border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Engineered for Celebration</h2>
                        <p className="text-slate-500">Why settle for a boring list? Make it an event.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* TEXT SIDE */}
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="flex gap-6 items-start">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                    <Gift size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">The Lucky Wheel</h4>
                                    <p className="text-slate-400">Can't decide? Friends can spin a fate wheel of your wishes to decide which one to grant.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                                    <Camera size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">Proof of Joy</h4>
                                    <p className="text-slate-400">Scan the Gift QR to reveal the giver and unlock a barrage of confetti and digital blessings.</p>
                                </div>
                            </div>
                        </div>

                        {/* INTERACTIVE PREVIEW SIDE */}
                        <div className="relative order-1 lg:order-2">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px]" />
                            <Card className="bg-black/60 border-white/10 aspect-video flex items-center justify-center border-dashed border-2">
                                <div className="text-center p-8">
                                    <p className="text-xs uppercase tracking-widest text-blue-500 font-bold mb-2">Feature Preview</p>
                                    <p className="text-slate-500 text-sm">Interactive "Lucky Wheel" UI Coming to Beta</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center">
                <div className="text-slate-600 text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    &copy; 2026 ZYLST INC. Reach the Zenith of Satisfaction.
                </div>
            </footer>
        </main>
    );
}
