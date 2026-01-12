"use client";

import Image from "next/image";

export function Navbar() {
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-2 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png" // 👈 apna logo yaha
            alt="Event Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>
      </div>
    </header>
  );
}
