import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Redirect to the main page since we've moved the content there
export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Otherwise redirect to root page which now has the main content
  redirect("/");
}
