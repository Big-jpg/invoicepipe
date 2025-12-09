// data/faq.ts

export interface IFAQ {
    question: string;
    answer: string;
}

export const faqs: IFAQ[] = [
    {
        question: "How accurate is the invoice extraction?",
        answer: "InvoicePipe achieves 98%+ accuracy on Australian tax invoices. Our system is built on Azure Document Intelligence and fine-tuned specifically for local invoice formats, GST calculations, and ABN detection."
    },
    {
        question: "What file formats do you support?",
        answer: "We currently support PDF files, which covers the vast majority of supplier invoices. Support for scanned images (JPEG, PNG) and email attachments is coming soon."
    },
    {
        question: "How long does processing take?",
        answer: "Most invoices are processed in 5-16 seconds from upload to structured data. Processing time depends on document complexity and current system load."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All uploads are encrypted in transit and at rest. We use Azure's enterprise-grade security infrastructure and comply with Australian data protection standards. Processed invoices are automatically deleted after 30 days unless you choose to retain them."
    },
    {
        question: "Can I integrate InvoicePipe with my existing systems?",
        answer: "Yes! You can export data as CSV or JSON, or use our API (coming soon) to integrate directly with your accounting software, RPA tools, or custom workflows."
    },
    {
        question: "What happens after I exceed the free tier?",
        answer: "Our Starter plan includes 100 invoices per month for free. Higher-volume plans for teams and API access are currently in development. Contact us if you need to process more than 100 invoices monthly."
    },
    {
        question: "Do you support credit notes and purchase orders?",
        answer: "Yes! InvoicePipe can process tax invoices, credit notes, statements, and purchase orders. The system automatically detects document type and extracts relevant fields."
    },
    {
        question: "Can I customize the fields you extract?",
        answer: "Currently, we extract standard fields (vendor, ABN, totals, GST, dates, line items, etc.). Custom field extraction for enterprise clients is on our roadmap. Let us know what you need!"
    }
];
