import { BadgeGenerator } from "@/components/badge-generator";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <BadgeGenerator />
    </main>
  );
}
