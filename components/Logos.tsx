// components/Logos.tsx
"use client";

import { motion } from "framer-motion";
import { logos } from "@/data/logos";

export default function Logos() {
    return (
        <section className="border-b border-border/60 bg-card/30">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <motion.p 
                    className="text-center text-sm text-muted-foreground mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Integrates with your existing tools
                </motion.p>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
                    {logos.map((logo, index) => (
                        <motion.div
                            key={logo.name}
                            className="w-12 h-12 text-muted-foreground hover:text-foreground transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            title={logo.name}
                        >
                            {logo.icon}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
