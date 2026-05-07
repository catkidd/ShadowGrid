import React, { useEffect, useRef } from 'react';
import { Target, PenTool, Users } from 'lucide-react';

import FadeInUp from '../components/FadeInUp';

const About = () => {
    return (
        <main className="flex-1 bg-[#0A0A0A]">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center min-h-[60vh]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/10 rounded-full blur-[150px]" />
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <FadeInUp>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6 text-white font-mono">
                            The Intersection of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neon">Performance and Shadow</span>
                        </h1>
                    </FadeInUp>
                    <FadeInUp delay={200}>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto font-mono leading-relaxed">
                            ShadowGrid was founded to provide enthusiasts with <span className="text-neon font-bold">Obsessive-Level</span> computer peripherals. A Stealth-Wealth approach to technology—minimalist, powerful, and exclusive.
                        </p>
                    </FadeInUp>
                </div>
            </section>

            {/* The Philosophy */}
            <section className="py-24 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6">
                    <FadeInUp>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black tracking-widest uppercase italic text-white font-mono">Our Philosophy</h2>
                            <div className="w-16 h-1 bg-neon mx-auto mt-6 rounded-full" />
                        </div>
                    </FadeInUp>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FadeInUp delay={100}>
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/50 transition-colors group h-full">
                                <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Target size={32} className="text-neon" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4 font-mono">Quality</h3>
                                <p className="text-white/60 font-mono text-sm leading-relaxed">
                                    Uncompromising tactile feedback and pixel-perfect accuracy. Every switch and sensor is vetted for peak human-machine interaction.
                                </p>
                            </div>
                        </FadeInUp>

                        <FadeInUp delay={200}>
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/50 transition-colors group h-full">
                                <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <PenTool size={32} className="text-neon" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4 font-mono">Design</h3>
                                <p className="text-white/60 font-mono text-sm leading-relaxed">
                                    Visual fidelity that speaks without shouting. Industrial aesthetics designed for the modern stealth workspace.
                                </p>
                            </div>
                        </FadeInUp>

                        <FadeInUp delay={300}>
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/50 transition-colors group h-full">
                                <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users size={32} className="text-neon" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4 font-mono">Community</h3>
                                <p className="text-white/60 font-mono text-sm leading-relaxed">
                                    We build for those who know. An exclusive network of developers, designers, and digital operators pushing limits.
                                </p>
                            </div>
                        </FadeInUp>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
                        <FadeInUp delay={100}>
                            <div className="py-8 md:py-0">
                                <h4 className="text-5xl font-black text-neon mb-2 font-mono">8+</h4>
                                <p className="text-sm font-bold uppercase tracking-widest text-white/60">Curated Products</p>
                            </div>
                        </FadeInUp>
                        <FadeInUp delay={200}>
                            <div className="py-8 md:py-0">
                                <h4 className="text-5xl font-black text-neon mb-2 font-mono">100%</h4>
                                <p className="text-sm font-bold uppercase tracking-widest text-white/60">Quality Checked</p>
                            </div>
                        </FadeInUp>
                        <FadeInUp delay={300}>
                            <div className="py-8 md:py-0">
                                <h4 className="text-5xl font-black text-neon mb-2 font-mono">KTM</h4>
                                <p className="text-sm font-bold uppercase tracking-widest text-white/60">Kathmandu Based</p>
                            </div>
                        </FadeInUp>
                    </div>
                </div>
            </section>

            {/* Team/Founder Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <FadeInUp>
                        <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 p-12 rounded-3xl flex flex-col md:flex-row gap-12 items-center shadow-2xl shadow-neon/5">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/5 flex-shrink-0 relative group">
                                <div className="absolute inset-0 bg-neon/20 group-hover:bg-transparent transition-colors z-10" />
                                <img 
                                    src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2000&auto=format&fit=crop" 
                                    alt="Founder" 
                                    className="w-full h-full object-cover grayscale"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm text-neon font-bold uppercase tracking-widest mb-2 font-mono">The Architect</h3>
                                <h2 className="text-3xl font-black text-white italic tracking-tight mb-4">Operations Command</h2>
                                <p className="text-white/70 font-mono text-sm leading-relaxed mb-6">
                                    "We didn't set out to make just another peripheral brand. We wanted to build the tools we couldn't find anywhere else. The kind of gear that disappears into your workflow because it's precisely calibrated to human intuition."
                                </p>
                                <div className="font-bold text-white uppercase tracking-widest text-xs">
                                    — Founder, ShadowGrid
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>
            </section>
        </main>
    );
};

export default About;
