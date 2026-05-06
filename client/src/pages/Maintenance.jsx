import React from 'react';
import { Settings, Battery, Droplet } from 'lucide-react';
import FadeInUp from '../components/FadeInUp';

const Maintenance = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-4xl flex-1 bg-[#0A0A0A]">
            <FadeInUp>
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 font-mono text-white">Maintenance</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">High-End Hardware Care Guide</p>
                </div>
            </FadeInUp>
            
            <div className="space-y-12">
                <FadeInUp delay={100}>
                    <section className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#8B5CF6]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Droplet className="text-[#8B5CF6]" size={28} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-mono">Cleaning Mechanical Switches</h2>
                        </div>
                        <div className="text-white/70 font-mono leading-relaxed space-y-4 text-sm">
                            <p>Proper maintenance of your mechanical switches ensures optimal actuation and longevity.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Disconnect the keyboard from the power source or host device.</li>
                                <li>Use a keycap puller to gently remove the keycaps.</li>
                                <li>Use compressed air to blow away dust and debris from the switch housing.</li>
                                <li>For deep cleaning, lightly dampen a microfiber cloth with isopropyl alcohol (90%+) and wipe the exposed plate. Do not let liquid enter the switch stems.</li>
                                <li>Allow to fully air dry before reattaching keycaps.</li>
                            </ol>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#8B5CF6]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Settings className="text-[#8B5CF6]" size={28} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-mono">Updating Monitor Color Profiles</h2>
                        </div>
                        <div className="text-white/70 font-mono leading-relaxed space-y-4 text-sm">
                            <p>To maintain color accuracy, especially for creative workflows, regular profile updates are recommended.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Download the latest ICC profile from the Protocols page.</li>
                                <li>In Windows: Open Color Management, add the new ICC profile, and set it as Default.</li>
                                <li>In macOS: Open Displays settings, select the Color Profile dropdown, and choose the newly installed profile.</li>
                                <li>For hardware calibration, connect your compatible colorimeter and follow the SG-Display utility prompts.</li>
                            </ol>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <section className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#8B5CF6]/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Battery className="text-[#8B5CF6]" size={28} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-mono">Wireless Peripheral Battery Health</h2>
                        </div>
                        <div className="text-white/70 font-mono leading-relaxed space-y-4 text-sm">
                            <p>Extend the lifespan of the internal lithium-polymer batteries in your wireless gear.</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Avoid fully depleting the battery to 0%. Recharge when it hits 20%.</li>
                                <li>Do not leave devices plugged in continuously if they are fully charged.</li>
                                <li>Keep peripherals away from extreme heat sources to prevent battery degradation.</li>
                                <li>If storing for an extended period, charge the device to 50% beforehand.</li>
                            </ul>
                        </div>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default Maintenance;
