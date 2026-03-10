import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LandingPage } from "@/components/landing-page";
import { DashboardLoader } from "@/components/dashboard-loader";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <DashboardLoader />;
  }

  return <LandingPage />;
}
