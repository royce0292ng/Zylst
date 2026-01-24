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
    NavbarItem
} from "@heroui/react";
import {Camera, Gift, Rocket, Sparkles, Target, Users} from "lucide-react";

export default function HomePage() {


    return(
        <HeroUIProvider>
            <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-blue-500/30">

                {/* 1. CELESTIAL BACKGROUND OVERLAY */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-900/20 rounded-full blur-[120px]" />
                </div>

                {/* 2. NAVIGATION */}
                <Navbar isBordered className="bg-black/40 backdrop-blur-md border-white/10" maxWidth="xl">
                    <NavbarBrand>
                        <p className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-blue-400">
                            ZYLST
                        </p>
                    </NavbarBrand>
                    <NavbarContent className="hidden sm:flex gap-8" justify="center">
                        <NavbarItem><Link className="text-slate-400 hover:text-white transition-colors" href="#how-it-works">How it Works</Link></NavbarItem>
                        <NavbarItem><Link className="text-slate-400 hover:text-white transition-colors" href="#features">Features</Link></NavbarItem>
                        <NavbarItem><Link className="text-slate-400 hover:text-white transition-colors" href="#secret-santa">Secret Santa</Link></NavbarItem>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Button variant="flat" className="text-white bg-white/10 hover:bg-white/20">Login</Button>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>

                {/* 3. HERO SECTION */}
                <section className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-20 px-6 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                        <Sparkles size={14} /> <span>Redefining the Gifting Experience</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
                        Stop Guessing. <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-700">
            Gift at the Zenith.
          </span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                        The wishlist platform where your deepest desires meet their perfect match—without spoiling the surprise.
                    </p>

                    {/* LEAD CAPTURE */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            variant="bordered"
                            className="bg-black/20"
                            classNames={{ inputWrapper: "border-white/10 focus-within:border-blue-500/50" }}
                        />
                        <Button color="primary" size="lg" className="font-bold bg-blue-600 shadow-lg shadow-blue-500/20">
                            Join the Zenith
                        </Button>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">Early access users get the "Celestial" founder badge.</p>
                </section>

                {/* 4. THE PROBLEM & SOLUTION (Cards) */}
                <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-4">
                            <CardHeader className="flex gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Target size={24}/></div>
                                <p className="text-lg font-bold">1. Aim High</p>
                            </CardHeader>
                            <CardBody className="text-slate-400 text-sm">
                                Save any item from any corner of the web with the Zylst Scraper. One list to rule them all.
                            </CardBody>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-4">
                            <CardHeader className="flex gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Users size={24}/></div>
                                <p className="text-lg font-bold">2. Share the Map</p>
                            </CardHeader>
                            <CardBody className="text-slate-400 text-sm">
                                Send your private link to your circle. No more guessing games or awkward "what do you want?" texts.
                            </CardBody>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-4">
                            <CardHeader className="flex gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Sparkles size={24}/></div>
                                <p className="text-lg font-bold">3. Mystery Claim</p>
                            </CardHeader>
                            <CardBody className="text-slate-400 text-sm">
                                Items are marked as "Reserved" so you don't get duplicates, but the giver stays hidden until the big day.
                            </CardBody>
                        </Card>
                    </div>
                </section>

                {/* 5. GAMIFIED FEATURES */}
                <section className="relative z-10 bg-white/2 border-y border-white/5 py-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 italic">Engineered for Celebration</h2>
                            <p className="text-slate-400">Features that make giving as fun as receiving.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                                        <Rocket size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">The Lucky Wheel</h4>
                                        <p className="text-slate-400 leading-relaxed">Can't decide? Friends can spin a "fate wheel" of your top wishes to choose which one to grant.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-blue-500 text-white shadow-lg">
                                        <Camera size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Proof of Joy</h4>
                                        <p className="text-slate-400 leading-relaxed">Scan the Gift QR to instantly reveal the giver and post your reaction to the Blessings Board.</p>
                                    </div>
                                </div>
                            </div>
                            {/* PLACEHOLDER FOR AN IMAGE OR INTERACTIVE ELEMENT */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/20 blur-[80px] group-hover:bg-blue-500/30 transition-all" />
                                <Card className="bg-black/60 border-white/10 h-80 flex items-center justify-center overflow-hidden">
                                    <div className="text-center">
                                        <Gift size={80} className="text-blue-500/50 mb-4 mx-auto animate-bounce" />
                                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Zylst Interactive Preview</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. FOOTER */}
                <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center text-slate-600 text-sm">
                    <Divider className="mb-8 bg-white/5" />
                    <p>&copy; 2026 Zylst Inc. Reach the Zenith of Satisfaction.</p>
                </footer>

            </div>
        </HeroUIProvider>
    )

}
