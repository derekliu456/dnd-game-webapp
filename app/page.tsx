'use client'

import Link from 'next/link'
import { Sword, Bot, Dices, Sparkles, ArrowRight, Shield, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        
        {/* Header Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
            <Sparkles size={12} />
            Next Gen Roleplaying
          </span>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={item}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
          >
            Your Story, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
              Forged by Intelligence
            </span>
          </motion.h1>

          <motion.p 
            variants={item}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Experience infinite adventures with the world's most advanced AI Dungeon Master. 
            Create unique heroes, roll real dice, and rewrite destiny.
          </motion.p>

          <motion.div 
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background ease-out"
            >
              <span className="mr-2">Enter the Tavern</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]" />
            </Link>
            
            <Link
              href="/about" // Placeholder link
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Read the lore
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={container}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
          >
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-accent" />}
              title="Hero Creation"
              description="Build deep, complex characters with unique backstories generated instantly."
            />
            <FeatureCard 
              icon={<Bot className="w-8 h-8 text-primary" />}
              title="AI Dungeon Master"
              description="A narrator that adapts to your choices, improvises, and never runs out of ideas."
            />
            <FeatureCard 
              icon={<Dices className="w-8 h-8 text-purple-400" />}
              title="True Combat"
              description="Strategic turn-based battles with real mechanics, rolls, and consequences."
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Footer minimal */}
      <footer className="absolute bottom-4 w-full text-center text-muted-foreground text-sm opacity-50">
        <p>© 2026 D&D AI Tavern. Powered by Gemini.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
      }}
      className="p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-white/5 hover:border-primary/30 hover:bg-card/60 transition-all duration-300 group"
    >
      <div className="mb-4 p-3 bg-background/50 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-serif text-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
