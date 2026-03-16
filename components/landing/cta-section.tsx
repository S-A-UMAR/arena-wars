"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.22_0.12_290),transparent_70%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Ready to Prove You&apos;re the Best?
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Join thousands of players competing in Mobile Legends tournaments every week. 
            Create your account, build your team, and start your journey to the top.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-base px-10">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/tournaments">
              <Button variant="outline" size="lg" className="text-base px-10">
                Browse Tournaments
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="mt-8 text-sm text-muted-foreground">
            Free to join. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
