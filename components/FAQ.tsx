// components/FAQ.tsx
"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { motion } from "framer-motion";
import { faqs } from "@/data/faq";

export default function FAQ() {
    return (
        <section id="faq" className="border-b border-border/60">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <motion.div 
                    className="max-w-2xl mx-auto text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Everything you need to know about InvoicePipe.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Disclosure>
                                {({ open }) => (
                                    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
                                        <DisclosureButton className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-card/60 transition-colors">
                                            <span className="font-semibold pr-4">{faq.question}</span>
                                            {open ? (
                                                <BiMinus className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <BiPlus className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                            )}
                                        </DisclosureButton>
                                        <DisclosurePanel className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </DisclosurePanel>
                                    </div>
                                )}
                            </Disclosure>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <p className="text-muted-foreground mb-2">Still have questions?</p>
                    <a 
                        href="mailto:support@invoicepipe.com" 
                        className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                        Contact our support team →
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
