// components/EnhancedCTA.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function EnhancedCTA() {
    return (
        <section className="border-b border-border/60">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <motion.div 
                    className="relative rounded-3xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Grid background pattern */}
                    <div className="absolute inset-0 bg-[#0a0a0a] bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_4rem]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_500px,#1a0a2e,transparent)]"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-20 text-center">
                        <motion.h2 
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Ready to automate your invoice processing?
                        </motion.h2>
                        
                        <motion.p 
                            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Start with 100 free invoices per month. No credit card required.
                        </motion.p>

                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link href="/register">
                                <Button size="lg" className="px-8 py-6 text-base">
                                    Get started for free
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="px-8 py-6 text-base bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                    Try a demo
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.p 
                            className="mt-6 text-sm text-gray-400"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Join 100+ teams already using InvoicePipe
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}