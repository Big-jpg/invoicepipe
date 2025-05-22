// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ClientDashboard from "./ClientDashboard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/sign-in");

    return <ClientDashboard />;
}
