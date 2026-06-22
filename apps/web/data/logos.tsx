// data/logos.tsx

import { SiXero, SiQuickbooks } from "react-icons/si";
import { FaFileExcel, FaDatabase, FaCloud, FaMicrosoft } from "react-icons/fa";
import { JSX } from "react";

export interface ILogo {
    name: string;
    icon: JSX.Element;
}

export const logos: ILogo[] = [
    {
        name: "Microsoft Azure",
        icon: <FaMicrosoft className="w-full h-full" />
    },
    {
        name: "Xero",
        icon: <SiXero className="w-full h-full" />
    },
    {
        name: "QuickBooks",
        icon: <SiQuickbooks className="w-full h-full" />
    },
    {
        name: "Excel",
        icon: <FaFileExcel className="w-full h-full" />
    },
    {
        name: "Database",
        icon: <FaDatabase className="w-full h-full" />
    },
    {
        name: "Cloud",
        icon: <FaCloud className="w-full h-full" />
    }
];