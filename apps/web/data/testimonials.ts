// data/testimonials.ts

export interface ITestimonial {
    name: string;
    role: string;
    company: string;
    message: string;
    avatar: string;
}

export const testimonials: ITestimonial[] = [
    {
        name: "Sarah Mitchell",
        role: "Finance Manager",
        company: "Regional Healthcare Provider",
        message: "We went from hours of manual keying to a 30-second upload. InvoicePipe has completely transformed our AP workflow.",
        avatar: "/avatars/avatar-1.jpg"
    },
    {
        name: "David Chen",
        role: "Automation Lead",
        company: "Tech Startup",
        message: "The API integration was seamless. We're now processing hundreds of invoices daily with near-perfect accuracy.",
        avatar: "/avatars/avatar-2.jpg"
    },
    {
        name: "Emma Rodriguez",
        role: "Small Business Owner",
        company: "Retail Chain",
        message: "Finally got my evenings back! InvoicePipe handles all our supplier invoices while I focus on growing the business.",
        avatar: "/avatars/avatar-3.jpg"
    }
];