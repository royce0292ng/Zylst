"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Button,
    Input,
    Checkbox,
    Card,
    CardBody,
    Select,
    SelectItem,
    Progress
} from "@heroui/react";
import {
    Mail,
    Lock,
    User,
    PlusCircle,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Search
} from "lucide-react";
import CelestialBackground from "@/components/CelestialBackGround";
import { useRouter } from "next/navigation";

const steps = [
    { id: 1, title: "Identity", icon: <User size={18} /> },
    { id: 2, title: "Persona", icon: <PlusCircle size={18} /> },
    { id: 3, title: "Insights", icon: <Search size={18} /> },
    { id: 4, title: "Zenith", icon: <CheckCircle2 size={18} /> }
];

const interests = [
    "Tech & Gadgets", "Fashion & Style", "Home & Living",
    "Experience & Travel", "Books & Media", "Art & Design"
];

const marketingSources = [
    "Social Media", "Friend/Referral", "Search Engine",
    "News/Blog", "Other"
];

export default function SignupPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        interests: new Set([]),
        source: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.email) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

            if (!formData.password) newErrors.password = "Password is required";
            else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        } else if (currentStep === 2) {
            if (!formData.username) newErrors.username = "Username is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        setErrors({}); // Clear errors when going back
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for the field when typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleComplete = () => {
        // Here you would typically call a server action
        router.push("/");
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <main className="relative min-h-screen bg-[#020617] text-slate-50 overflow-hidden selection:bg-blue-500/30">
            <CelestialBackground />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400 mb-4">
                        REACH THE ZENITH
                    </h1>
                    <p className="text-slate-200 font-medium">Join the elite circle of purposeful givers.</p>
                </motion.div>

                {/* Stepper */}
                <div className="w-full max-w-xl mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentStep >= step.id ? "text-blue-400" : "text-slate-400"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900/50"
                                    } shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                                    {step.icon}
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-widest">{step.title}</span>
                            </div>
                        ))}
                    </div>
                    <Progress
                        value={(currentStep / steps.length) * 100}
                        className="h-1 shadow-2xl"
                        classNames={{
                            indicator: "bg-gradient-to-r from-blue-600 to-blue-400"
                        }}
                    />
                </div>

                {/* Form Container */}
                <div className="w-full max-w-xl min-h-[450px] relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={currentStep}>
                        <motion.div
                            key={currentStep}
                            custom={currentStep}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Card className="bg-black/60 backdrop-blur-xl border border-white/20 p-2 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                <CardBody className="overflow-visible">
                                    {currentStep === 1 && (
                                        <div className="flex flex-col gap-6">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-bold">Secure Your Identity</h3>
                                                <p className="text-slate-300 text-sm">The foundation of your Zylst experience.</p>
                                            </div>
                                            <div className="space-y-4">
                                                <Input
                                                    label="Email"
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    variant="bordered"
                                                    value={formData.email}
                                                    onValueChange={(val) => handleInputChange("email", val)}
                                                    isInvalid={!!errors.email}
                                                    errorMessage={errors.email}
                                                    classNames={{
                                                        label: "text-slate-100 font-bold",
                                                        inputWrapper: "border-white/20 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                                        input: "text-white"
                                                    }}
                                                    startContent={<Mail size={18} className="text-slate-300" />}
                                                />
                                                <Input
                                                    label="Password"
                                                    placeholder="Create a strong password"
                                                    type="password"
                                                    variant="bordered"
                                                    value={formData.password}
                                                    onValueChange={(val) => handleInputChange("password", val)}
                                                    isInvalid={!!errors.password}
                                                    errorMessage={errors.password}
                                                    classNames={{
                                                        label: "text-slate-100 font-bold",
                                                        inputWrapper: "border-white/20 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                                        input: "text-white"
                                                    }}
                                                    startContent={<Lock size={18} className="text-slate-300" />}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="flex flex-col gap-6">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-bold">Craft Your Persona</h3>
                                                <p className="text-slate-300 text-sm">Tell us what ignites your passion.</p>
                                            </div>
                                            <div className="space-y-6">
                                                <Input
                                                    label="Username"
                                                    placeholder="Choose a unique name"
                                                    variant="bordered"
                                                    value={formData.username}
                                                    onValueChange={(val) => handleInputChange("username", val)}
                                                    isInvalid={!!errors.username}
                                                    errorMessage={errors.username}
                                                    classNames={{
                                                        label: "text-slate-100 font-bold",
                                                        inputWrapper: "border-white/20 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                                        input: "text-white"
                                                    }}
                                                    startContent={<User size={18} className="text-slate-300" />}
                                                />
                                                <div className="space-y-3">
                                                    <label className="text-sm font-bold text-slate-100">Interests (Optional)</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {interests.map((interest) => (
                                                            <div
                                                                key={interest}
                                                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors cursor-pointer group"
                                                            >
                                                                <Checkbox
                                                                    size="sm"
                                                                    className="group-hover:scale-110 transition-transform"
                                                                    isSelected={formData.interests.has(interest as never)}
                                                                    onValueChange={(isSelected) => {
                                                                        const newInterests = new Set(formData.interests);
                                                                        if (isSelected) newInterests.add(interest as never);
                                                                        else newInterests.delete(interest as never);
                                                                        handleInputChange("interests", newInterests);
                                                                    }}
                                                                />
                                                                <span className="text-xs text-slate-300 group-hover:text-blue-300">{interest}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="flex flex-col gap-6">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-bold">Marketing Context</h3>
                                                <p className="text-slate-300 text-sm">Help us grow our constellation.</p>
                                            </div>
                                            <div className="space-y-6">
                                                <Select
                                                    label="How did you hear about Zylst?"
                                                    placeholder="Select an option"
                                                    variant="bordered"
                                                    selectedKeys={formData.source ? [formData.source] : []}
                                                    onSelectionChange={(keys) => handleInputChange("source", Array.from(keys)[0])}
                                                    classNames={{
                                                        label: "text-slate-100 font-bold",
                                                        trigger: "border-white/20 hover:border-blue-500/50 focus:!border-blue-500 transition-colors bg-white/5",
                                                        value: "text-white"
                                                    }}
                                                >
                                                    {marketingSources.map((source) => (
                                                        <SelectItem key={source} className="text-slate-900">
                                                            {source}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="flex flex-col items-center justify-center py-8 text-center gap-6">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                                className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                                            >
                                                <Sparkles size={48} />
                                            </motion.div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black italic">ASCENSION COMPLETE</h3>
                                                <p className="text-slate-200 max-w-xs mx-auto">Welcome to the Zenith. Your account is ready for exploration.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between mt-12 gap-4">
                                        {currentStep > 1 && currentStep < 4 && (
                                            <Button
                                                variant="light"
                                                className="text-slate-200 font-bold"
                                                startContent={<ChevronLeft size={18} />}
                                                onPress={prevStep}
                                            >
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            className={`flex-1 font-black py-6 rounded-xl transition-all shadow-xl ${currentStep === 4
                                                ? "bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                                : "bg-gradient-to-r from-blue-700 to-blue-400 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                                }`}
                                            endContent={currentStep < 4 ? <ChevronRight size={18} /> : null}
                                            onPress={currentStep === 4 ? handleComplete : nextStep}
                                        >
                                            {currentStep === 1 ? "Begin Ascension" :
                                                currentStep < 3 ? "Continue" :
                                                    currentStep === 3 ? "Finalize Profile" : "Enter Zylst"}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
