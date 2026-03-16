"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Swords, BarChart3, Shield, DollarSign, Zap, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Tournament System",
    description: "Create and join tournaments with automated brackets, live scoring, and real-time updates.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Guild Management",
    description: "Build your team, manage rosters, and track your guild&apos;s progress through the ranks.",
    color: "secondary",
  },
  {
    icon: Swords,
    title: "Scrim Finder",
    description: "Find practice matches against teams of similar skill level anytime, anywhere.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Live Leaderboards",
    description: "Track player and guild rankings updated in real-time based on performance.",
    color: "primary",
  },
  {
    icon: DollarSign,
    title: "Prize Pools",
    description: "Compete for real prizes with secure Stripe-powered tournament entry and payouts.",
    color: "accent",
  },
  {
    icon: MessageSquare,
    title: "Discord Integration",
    description: "Seamless Discord integration for notifications, team communication, and more.",
    color: "secondary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-primary">Compete</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              A complete esports ecosystem built for Mobile Legends players who take 
              competition seriously.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === "primary"
                    ? "bg-primary/20 text-primary"
                    : feature.color === "secondary"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-accent/20 text-accent"
                }`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
