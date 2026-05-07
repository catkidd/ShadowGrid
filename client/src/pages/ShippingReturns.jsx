import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Globe } from 'lucide-react';
import FadeInUp from '../components/FadeInUp';

const ShippingReturns = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-5xl flex-1 bg-[#0A0A0A]">
            <FadeInUp>
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 font-mono text-white">Grid Dispatch</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Shipping & Return Protocols</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <FadeInUp delay={100}>
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 text-neon">
                            <Truck size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Shipping Logistics</h2>
                        </div>
                        <div className="space-y-6 text-white/60 font-mono text-sm leading-relaxed">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Domestic Dispatch (NP)</h3>
                                <p>Orders are processed within 24 standard cycles. Delivery via local grid nodes typically takes 2-4 business days.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Global Transmission</h3>
                                <p>International units are shipped via expedited logistics partners. Estimated arrival: 7-14 solar days depending on terminal location.</p>
                            </div>
                            <div className="flex items-start gap-3 text-xs opacity-50 italic">
                                <Globe size={14} className="mt-0.5" />
                                <p>Customs and import protocols are the responsibility of the receiving operator.</p>
                            </div>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 text-neon">
                            <RotateCcw size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Unit Exchange</h2>
                        </div>
                        <div className="space-y-6 text-white/60 font-mono text-sm leading-relaxed">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Return Policy</h3>
                                <p>Units may be returned within 14 days of acquisition. Units must be in original uncompromised state with all seals intact.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">RMA Protocol</h3>
                                <p>To initiate a Return Merchandise Authorization (RMA), contact Ops via the terminal. Include your unit ID and transaction log.</p>
                            </div>
                            <div className="flex items-start gap-3 text-neon/80 text-xs font-bold uppercase">
                                <ShieldCheck size={14} className="mt-0.5" />
                                <p>DOA units are prioritized for immediate hot-swap replacement.</p>
                            </div>
                        </div>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default ShippingReturns;
