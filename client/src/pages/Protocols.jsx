import React from 'react';
import { Download, Bluetooth, Settings, Monitor, Keyboard } from 'lucide-react';
import FadeInUp from '../components/FadeInUp';

const Protocols = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-6xl flex-1 bg-[#0A0A0A]">
            <FadeInUp>
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 font-mono text-white">Protocols</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Technical Library & Documentation</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Devices */}
                <FadeInUp delay={100}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:border-[#8B5CF6]/50 transition-colors h-full">
                        <div className="flex items-center gap-4 mb-6 text-[#8B5CF6]">
                            <Keyboard size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Input Devices</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3 font-mono">
                                    <Download size={16} className="text-[#8B5CF6]" />
                                    Firmware Downloads
                                </h3>
                                <ul className="text-white/60 font-mono text-sm space-y-2 list-disc list-inside">
                                    <li>SG-Mech V2 - v2.4.1 (Stable)</li>
                                    <li>SG-Mouse Pro - v1.8.0 (Latest)</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3 font-mono">
                                    <Bluetooth size={16} className="text-[#8B5CF6]" />
                                    Device Pairing Instructions
                                </h3>
                                <ol className="text-white/60 font-mono text-sm space-y-2 list-decimal list-inside">
                                    <li>Hold pairing button for 3 seconds.</li>
                                    <li>Wait for the Electric Violet LED indicator.</li>
                                    <li>Select "ShadowGrid Device" in host settings.</li>
                                </ol>
                            </section>
                        </div>
                    </div>
                </FadeInUp>

                {/* Output Devices */}
                <FadeInUp delay={200}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 hover:border-[#8B5CF6]/50 transition-colors h-full">
                        <div className="flex items-center gap-4 mb-6 text-[#8B5CF6]">
                            <Monitor size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Output Devices</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3 font-mono">
                                    <Download size={16} className="text-[#8B5CF6]" />
                                    Firmware Downloads
                                </h3>
                                <ul className="text-white/60 font-mono text-sm space-y-2 list-disc list-inside">
                                    <li>SG-Display 27" - v1.1.0</li>
                                    <li>SG-Display 32" Ultrawide - v1.0.5</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3 font-mono">
                                    <Settings size={16} className="text-[#8B5CF6]" />
                                    Driver Compatibility
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-white/60 font-mono border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-white">
                                                <th className="py-2">OS</th>
                                                <th className="py-2">Status</th>
                                                <th className="py-2">Version Requirement</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/5">
                                                <td className="py-2">Windows 11</td>
                                                <td className="py-2 text-[#8B5CF6]">Supported</td>
                                                <td className="py-2">22H2+</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-2">macOS</td>
                                                <td className="py-2 text-[#8B5CF6]">Supported</td>
                                                <td className="py-2">13.0+</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2">Linux</td>
                                                <td className="py-2 text-white/80">Beta</td>
                                                <td className="py-2">Kernel 6.0+</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </div>
                </FadeInUp>
            </div>
        </main>
    );
};

export default Protocols;
