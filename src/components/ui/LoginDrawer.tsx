"use client"

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

interface LoginDrawerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function LoginDrawer({ isOpen, onOpenChange }: LoginDrawerProps) {
    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            backdrop="blur"
            className="bg-black/60 backdrop-blur-xl border-l border-white/10 text-white"
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 pt-8 px-8">
                            <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400">
                                Welcome Back
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
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
                                    classNames={{
                                        label: " font-bold",
                                        inputWrapper: "border-white/10 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                        input: "text-white placeholder:text-slate-600",
                                    }}
                                    startContent={<Mail size={18} className="text-slate-500" />}
                                />
                                <Input
                                    label="Password"
                                    placeholder="Enter your password"
                                    labelPlacement="outside"
                                    type="password"
                                    variant="bordered"
                                    classNames={{
                                        label: "text-slate-300 font-bold",
                                        inputWrapper: "border-white/10 hover:border-blue-500/50 focus-within:!border-blue-500 transition-colors bg-white/5",
                                        input: "text-white placeholder:text-slate-600",
                                    }}
                                    startContent={<Lock size={18} className="text-slate-500" />}
                                />
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
                                size="lg"
                            >
                                Login to Zenith
                            </Button>

                            <div className="flex flex-col items-center gap-2 mt-4">
                                <Link href="#" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                                    Forgot password?
                                </Link>
                                <p className="text-sm text-slate-400">
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-blue-400 font-bold hover:underline"
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
