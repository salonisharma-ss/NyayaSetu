import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50">
      <Nav />
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-navy"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <AuthForm flow="signUp" />
        </div>
      </main>
    </div>
  );
}
