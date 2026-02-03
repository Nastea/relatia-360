"use client";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const r = useRouter();
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4 text-neutral-900">
      <h1 className="text-2xl font-semibold">Consent</h1>
      <p>
        This course provides educational coaching, not therapy. Your inputs are processed to deliver
        lessons and improve the product. You can request deletion at any time.
      </p>
      <button
        className="px-4 py-2 rounded bg-black text-white"
        onClick={() => {
          document.cookie = "consented=1; path=/; max-age=31536000";
          r.push("/chat");
        }}
      >
        I agree
      </button>
    </main>
  );
}
