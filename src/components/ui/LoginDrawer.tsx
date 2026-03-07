import { useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
    Input,
    Link
} from "@heroui/react";
import { Mail, Lock } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface LoginDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function LoginDrawer({ isOpen, onOpenChange }: LoginDrawerProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setIsSubmitting(true);
        setError("");
        try {
            const result = await login({ email, password });
            if (result.success) {
                onOpenChange(false);
                window.dispatchEvent(new Event('auth-change'));

                if (window.location.pathname.startsWith('/wishlists/')) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('auth');
                    router.replace(url.pathname + url.search);
                    router.refresh();
                } else {
                    router.push("/wishlists");
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("The stars are currently unreachable.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            backdrop="blur"
            className="bg-black/80 backdrop-blur-xl border-l border-white/10 text-white"
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 pt-8 px-8">
                            <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400">
                                Welcome Back
                            </h2>
                            <p className="text-slate-300 text-sm font-medium">
                                Sign in to access your Zenith desires.
                            </p>
                        </DrawerHeader>
                        <DrawerBody className="px-8 py-10 flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    labelPlacement="outside"
                                    type="email"
                                    variant="bordered"
                                    value={email}
                                    onValueChange={setEmail}
                                    classNames={{
                                        label: "text-slate-100 font-bold",
                                        inputWrapper: "border-white/20 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                        input: "text-white placeholder:text-slate-500",
                                    }}
                                    startContent={<Mail size={18} className="text-slate-300" />}
                                />
                                <Input
                                    label="Password"
                                    placeholder="Enter your password"
                                    labelPlacement="outside"
                                    type="password"
                                    variant="bordered"
                                    value={password}
                                    onValueChange={setPassword}
                                    classNames={{
                                        label: "text-slate-100 font-bold",
                                        inputWrapper: "border-white/20 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                        input: "text-white placeholder:text-slate-500",
                                    }}
                                    startContent={<Lock size={18} className="text-slate-300" />}
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-xs font-medium px-1 animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </p>
                            )}

                            <Button
                                className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white font-black py-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
                                size="lg"
                                onPress={handleLogin}
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                            >
                                Login to Zenith
                            </Button>

                            <div className="flex flex-col items-center gap-2 mt-4">
                                <Link href="#" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
                                    Forgot password?
                                </Link>
                                <p className="text-sm text-slate-300">
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-blue-400 font-black hover:underline"
                                        onPress={onClose}
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </DrawerBody>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
