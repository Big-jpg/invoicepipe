// data/stats.tsx

import { FaFileInvoice, FaClock, FaCheckCircle, FaUsers } from "react-icons/fa";

export interface IStat {
    icon: JSX.Element;
    value: string;
    label: string;
}

export const stats: IStat[] = [
    {
        icon: <FaFileInvoice className="w-8 h-8" />,
        value: "10,000+",
        label: "Invoices Processed"
    },
    {
        icon: <FaCheckCircle className="w-8 h-8" />,
        value: "98.3%",
        label: "Average Accuracy"
    },
    {
        icon: <FaClock className="w-8 h-8" />,
        value: "5-16s",
        label: "Processing Time"
    },
    {
        icon: <FaUsers className="w-8 h-8" />,
        value: "100+",
        label: "Active Users"
    }
];
