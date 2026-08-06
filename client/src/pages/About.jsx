import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calendar, CheckCircle2, Globe2, Headphones, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const sectionMotion = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

export default function About() {
  return (
    <section className="bg-navy text-white">
      <div className="container-pad grid gap-16 py-20 lg:grid-cols-[1.1fr_.9fr]">
        <motion.div initial="hidden" animate="show" variants={sectionMotion}>
          <p className="section-label text-blue-300">About Reliable Drives</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A premium marketplace for trusted pre-owned cars.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Reliable Drives makes buying a second-hand car simple and transparent. Every listing is curated for quality, supported by clear pricing, vehicle history details, and direct customer service.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Trusted inspections", description: "Every car is reviewed for condition and service readiness before it reaches the market." },
              { icon: Globe2, title: "Transparent pricing", description: "We display clear pricing with no hidden fees so every decision is informed." },
              { icon: Headphones, title: "Premium support", description: "Dedicated assistance for every enquiry, test drive, and purchase step." },
              { icon: CheckCircle2, title: "Customer-first approach", description: "We focus on honest advice, convenient viewing, and confident ownership." }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-blue-300/40 hover:bg-white/10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric text-navy shadow-lg shadow-electric/20"><Icon size={22} /></span>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={sectionMotion} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_40%)]" />
          <div className="relative z-10 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-navy/60 p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Our vision</p>
              <p className="mt-4 text-2xl font-black leading-tight">To be the most trusted digital destination for premium used cars.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Our mission</p>
              <p className="mt-4 text-base leading-7 text-white/75">We build confidence through clear details, personal support, and a premium browsing experience for every car buyer.</p>
            </div>
            <div className="rounded-[1.5rem] bg-electric/10 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-electric">Why choose us</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
                <li>Hand-selected inventory from reliable sources.</li>
                <li>Modern experience with honest information and support.</li>
                <li>Private expert assistance for every enquiry.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-pad grid gap-16 py-24 lg:grid-cols-[1fr_1fr]">
        <motion.div initial="hidden" animate="show" variants={sectionMotion} className="space-y-5">
          <p className="section-label text-blue-300">Company story</p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Built to make used car buying feel premium, honest, and effortless.</h2>
          <p className="max-w-3xl text-lg leading-8 text-white/70">Reliable Drives was created to reshape pre-owned car search with curated listings, verified inventory, and direct access to personal support. Our private admin workflow means inventory is managed securely and always reflects the latest available vehicles.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Our journey</p>
              <p className="mt-3 text-sm leading-7 text-white/70">From a simple idea to a polished digital showroom, we focused on quality, transparency, and trust.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Our promise</p>
              <p className="mt-3 text-sm leading-7 text-white/70">You’ll find the essential details you need, an easy browse experience, and support for every enquiry.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={sectionMotion} className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">What we deliver</p>
            <h2 className="mt-4 text-3xl font-black">A premium experience with every step.</h2>
            <div className="mt-8 grid gap-4">
              {[
                { icon: BadgeCheck, title: "Verified inventory", description: "Each vehicle is reviewed for listing accuracy and condition." },
                { icon: Calendar, title: "Future-ready search", description: "Search by year, transmission, fuel, ownership and more." },
                { icon: TrendingUp, title: "Trusted pricing", description: "Clear pricing with better value and no surprises." }
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-navy/10 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric text-navy"><Icon size={20} /></div>
                  <h3 className="mt-4 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/70">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <section className="container-pad py-20">
        <motion.div initial="hidden" animate="show" variants={sectionMotion} className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl">
            <p className="section-label text-blue-300">Trusted inspections</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Inspection and condition you can trust.</h2>
            <p className="mt-5 text-lg leading-8 text-white/70">We present the key car details clearly and back it with modern imagery, status badges, and factual information so you can compare with confidence.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Detailed condition breakdown", "Clear ownership history", "Actual photograph previews", "Verified availability status"].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-navy/10 p-5 text-sm leading-7 text-white/75">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-xl">
            <p className="section-label text-blue-300">Transparent pricing</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Clear value for every car.</h2>
            <p className="mt-5 text-lg leading-8 text-white/70">Pricing is shown with full transparency, so you can compare cars by features, availability, and condition without hidden costs.</p>
            <div className="mt-8 grid gap-3">
              {[
                "No hidden fees.",
                "Price shown up front.",
                "Simple comparisons.",
                "Reliable customer support."
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-navy/10 p-4 text-sm text-white/70">
                  <CheckCircle2 size={18} className="text-teal" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container-pad py-20">
        <motion.div initial="hidden" animate="show" variants={sectionMotion} className="rounded-[2rem] bg-gradient-to-r from-electric to-blue-600 p-10 text-navy shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="section-label text-white/80">Ready to explore</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Let’s find the right car for your next drive.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">Discover the latest vehicles, compare options, and speak with our team when you are ready to move forward.</p>
            </div>
            <Link to="/cars" className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-navy shadow-lg shadow-white/20 transition hover:-translate-y-0.5">
              Browse inventory <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </section>
  );
}
