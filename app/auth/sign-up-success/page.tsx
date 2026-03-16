import Link from "next/link";
import { Gamepad2, Mail, ArrowLeft } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.20_0.12_145),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
            <Gamepad2 className="w-7 h-7 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Arena<span className="text-primary">Wars</span>
          </span>
        </Link>

        {/* Success Card */}
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-success" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent you a confirmation link to verify your email address. 
            Click the link in the email to activate your account.
          </p>

          <div className="p-4 rounded-xl bg-muted/30 text-sm text-muted-foreground mb-6">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
