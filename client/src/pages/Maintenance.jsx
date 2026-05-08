import { Keyboard, Monitor, Mouse } from 'lucide-react';
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
                    <section className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-neon/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Keyboard className="text-neon" size={28} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-mono">Cleaning Mechanical Keyboards</h2>
                        </div>
                        <div className="text-white/70 font-mono leading-relaxed space-y-4 text-sm">
                            <p>Proper maintenance of your switches and keycaps ensures optimal actuation and longevity.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Disconnect the keyboard from the power source or host device.</li>
                                <li>Use a keycap puller to gently remove the keycaps. Wash keycaps in warm, soapy water and let them air dry completely.</li>
                                <li>Use compressed air to blow away dust and debris from the switch housing and plate.</li>
                                <li>For deep cleaning the plate, lightly dampen a microfiber cloth with isopropyl alcohol (90%+) and wipe the exposed areas. Do not let liquid enter the switch stems.</li>
                                <li>Allow the entire board to fully dry before reattaching the keycaps.</li>
                            </ol>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-neon/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Monitor className="text-neon" size={28} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-mono">Calibrating High-Refresh-Rate Monitors</h2>
                        </div>
                        <div className="text-white/70 font-mono leading-relaxed space-y-4 text-sm">
                            <p>To ensure tear-free visuals and maximum pixel response times, follow these calibration steps.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Ensure you are using the included DisplayPort 2.1 or HDMI 2.1 cable connected directly to your GPU.</li>
                                <li>In your OS display settings, verify the refresh rate is set to the maximum supported value (e.g., 240Hz or 360Hz).</li>
                                <li>Enable Adaptive Sync (G-Sync or FreeSync) in your GPU control panel.</li>
                                <li>Open the monitor's OSD (On-Screen Display) and set Overdrive to the "Optimal" or "Normal" setting to prevent inverse ghosting.</li>
                                <li>For color accuracy, load the ShadowGrid ICC profile available in the Protocols section.</li>
                            </ol>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <section className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-neon/30 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Mouse className="text-neon" size={28} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white font-mono">Updating Firmware for Gaming Mice</h2>
                        </div>
                        <div className="text-white/70 font-mono leading-relaxed space-y-4 text-sm">
                            <p>Keep your sensor tracking perfectly and debounce algorithms updated with the latest firmware.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>Connect the gaming mouse directly to your PC using the provided USB cable (do not update over wireless).</li>
                                <li>Download the latest firmware executable from the ShadowGrid Protocols library.</li>
                                <li>Close any background applications that might interrupt the USB connection.</li>
                                <li>Run the firmware updater as an Administrator and follow the on-screen prompts.</li>
                                <li>Do not unplug the mouse or shut down the computer until the update indicates it is 100% complete.</li>
                            </ol>
                        </div>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default Maintenance;
