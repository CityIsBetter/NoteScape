"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  useRouter().push("/Home");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    </main>
  );
}
