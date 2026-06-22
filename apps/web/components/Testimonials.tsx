// components/Testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
    return (
        <section id="testimonials" className="border-b border-border/60">
            <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
                <motion.div 
                    className="max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        What Our Users Say
                    </h2>
                    <p className="text-muted-foreground">
                        Real feedback from teams using InvoicePipe every day.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
                                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                &ldquo;{testimonial.message}&rdquo;
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}