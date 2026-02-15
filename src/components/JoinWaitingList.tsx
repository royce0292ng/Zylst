"use client";
import React, {useEffect, useState} from "react";
import { Form, Input, Button } from "@heroui/react";
import {motion, AnimatePresence, useMotionValue, useTransform, animate} from "framer-motion";
import { CheckCircle2, Sparkles, Star } from "lucide-react";
import {joinWaitlist, WaitlistResponse} from "@/app/actions/waitlist";

export default function JoinWaitingList() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. SECURITY CHECK: The Honeypot Trap
    // If this field is filled, it's almost certainly a bot.
    if (honeypot.length > 0) {
        console.warn("Bot detected. Silently ignoring submission.");
        setSubmitted(true); // "Success" for the bot, but no DB call is made.
        return;
    }

    setLoading(true);
    setError(null);

      // 2. ACTUAL LOGIC
      // Replace with your real API call: await fetch('/api/subscribe', ...)
      const result: WaitlistResponse = await joinWaitlist(email);

      if (result.success) {
          console.log("Saving email to the constellation:", email);
          console.log(result.message)
          setSubmitted(true);
      } else {
          setError(result.error);
      }

      setLoading(false);
  };

  return (
      <div className="w-full max-w-md px-4">
        <AnimatePresence mode="wait">
          {!submitted ? (
              <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Form
                    onSubmit={onSubmit}
                    className="flex flex-col sm:flex-row gap-3 w-full"
                >
                  <Input
                      isRequired
                      type="email"
                      placeholder="Enter your email"
                      variant="bordered"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      classNames={{
                        inputWrapper: "border-white/10 bg-black/40 backdrop-blur-md",
                      }}
                  />
                    {/* This field is hidden from humans but visible to bots */}
                    <div className="hidden" aria-hidden="true">
                        <input
                            type="text"
                            name="favorite_galaxy"
                            tabIndex={-1}
                            autoComplete="off"
                            onChange={(e) => setHoneypot(e.target.value)}
                        />
                    </div>
                  <Button
                      color="primary"
                      size="lg"
                      type="submit"
                      isLoading={loading}
                      className="w-full sm:w-auto font-bold bg-blue-600 shadow-lg shadow-blue-500/20 shrink-0"
                  >
                      {loading ? "Syncing..." : "Join the Zenith"}
                  </Button>
                </Form>
                  <AnimatePresence mode="wait">
                      {error && (
                          <motion.div
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="mt-4 overflow-hidden"
                          >
                              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-[11px] font-medium flex items-center justify-center gap-2">
                                  <span className="shrink-0 animate-pulse">⚠️</span>
                                  {error}
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-[10px] text-center uppercase tracking-widest text-slate-500"
                >
                  Early access users get the "Celestial" founder badge.
                </motion.p>
              </motion.div>
          ) : (
              <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="flex flex-col items-center text-center"
              >
                {/* CELESTIAL SUCCESS ICON */}
                <div className="relative mb-4">
                  <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 text-blue-500/30 blur-sm"
                  >
                    <Sparkles size={48} />
                  </motion.div>
                  <div className="relative bg-blue-600/20 p-4 rounded-full border border-blue-500/30 text-blue-400">
                    <CheckCircle2 size={32} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">You're in the Constellation.</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Welcome to <strong>Zylst</strong>. We've reserved your spot at the Zenith. Keep an eye on the stars (and your inbox) for your invite.
                </p>

                {/* FOUNDER BADGE PREVIEW */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5"
                >
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] uppercase tracking-tighter text-slate-300 font-semibold">
                Celestial Badge Reserved for {email}
              </span>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

export function RollingCounter({ target }: { target: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        // Animate to the target number over 2 seconds
        const controls = animate(count, target, { duration: 2, ease: "easeOut" });
        return controls.stop;
    }, [target]);

    return <motion.span>{rounded}</motion.span>;
}