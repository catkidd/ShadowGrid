import { Truck, RotateCcw, ShieldCheck, Globe } from 'lucide-react';
import FadeInUp from '../components/FadeInUp';

const ShippingReturns = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-5xl flex-1 bg-[#0A0A0A]">
            <FadeInUp>
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 font-mono text-white">Shipping & Returns</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Delivery Logistics & Return Procedures</p>
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
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Domestic Shipping</h3>
                                <p>Orders are processed within 24–48 hours. Standard domestic delivery typically arrives within 2–5 business days.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">International Shipping</h3>
                                <p>We ship internationally via express carriers. Estimated delivery timeframes range from 7–14 business days depending on the destination.</p>
                            </div>
                            <div className="flex items-start gap-3 text-xs opacity-50 italic">
                                <Globe size={14} className="mt-0.5" />
                                <p>Customers are responsible for all applicable import duties, taxes, and customs clearance fees.</p>
                            </div>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 text-neon">
                            <RotateCcw size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Returns & Exchanges</h2>
                        </div>
                        <div className="space-y-6 text-white/60 font-mono text-sm leading-relaxed">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Return Policy</h3>
                                <p>Items may be returned within 14 days of receipt. Products must be in original condition, unused, and include all original packaging and seals.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2 uppercase tracking-tight">Return Merchandise Authorization (RMA)</h3>
                                <p>To initiate a return, contact our support team to request an RMA number. Please include your order number and the reason for return in your request.</p>
                            </div>
                            <div className="flex items-start gap-3 text-neon/80 text-xs font-bold uppercase">
                                <ShieldCheck size={14} className="mt-0.5" />
                                <p>Defective items are eligible for replacement upon verification.</p>
                            </div>
                        </div>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default ShippingReturns;
