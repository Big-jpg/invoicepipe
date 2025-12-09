// data/logos.tsx

import { SiMicrosoft, SiXero, SiQuickbooks } from "react-icons/si";
import { FaFileExcel, FaDatabase, FaCloud } from "react-icons/fa";

export interface ILogo {
    name: string;
    icon: JSX.Element;
}

export const logos: ILogo[] = [
    {
        name: "Microsoft Azure",
        icon: <SiMicrosoft className="w-full h-full" />
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
