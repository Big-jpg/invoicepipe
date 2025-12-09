// components/Stats.tsx
"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/stats";

export default function Stats() {
    return (
        <section className="border-b border-border/60 bg-gradient-to-br from-emerald-500/5 via-fuchsia-500/5 to-background">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <motion.div 
                    className="max-w-2xl mx-auto text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        Built on Real-World Experience
                    </h2>
                    <p className="text-muted-foreground">
                        Processing thousands of Australian invoices every month.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center space-y-3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex justify-center text-emerald-400">
                                {stat.icon}
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-foreground">
                                {stat.value}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}