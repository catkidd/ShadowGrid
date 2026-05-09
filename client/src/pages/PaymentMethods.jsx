import { CreditCard, ShieldCheck, Zap, Lock } from 'lucide-react';
import FadeInUp from '../components/FadeInUp';

const PaymentMethods = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-5xl flex-1 bg-[#0A0A0A]">
            <FadeInUp>
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 font-mono text-white">Payment Security</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Secure Transaction Standards</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <FadeInUp delay={100}>
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 text-neon">
                            <CreditCard size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Accepted Methods</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-neon/30 transition-colors">
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold uppercase font-mono tracking-tight">Credit & Debit</h3>
                                    <p className="text-white/40 text-xs font-mono">Visa, Mastercard, American Express</p>
                                </div>
                                <div className="flex gap-3">
                                    <img src="https://api.iconify.design/logos:visa.svg" className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all" alt="Visa" />
                                    <img src="https://api.iconify.design/logos:mastercard.svg" className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all" alt="Mastercard" />
                                </div>
                            </div>

                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-neon/30 transition-colors">
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold uppercase font-mono tracking-tight">Digital Wallets</h3>
                                    <p className="text-white/40 text-xs font-mono">PayPal, Apple Pay, Google Pay</p>
                                </div>
                                <div className="flex gap-3">
                                    <img src="https://api.iconify.design/logos:paypal.svg" className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all" alt="PayPal" />
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-neon/50">
                                <p className="text-white/60 font-mono text-xs italic">All transactions are processed via secure, PCI-compliant payment gateways using 256-bit SSL encryption.</p>
                            </div>
                        </div>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 text-neon">
                            <ShieldCheck size={32} />
                            <h2 className="text-2xl font-bold uppercase tracking-widest font-mono text-white">Security Standards</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4">
                                <div className="p-2 bg-neon/10 rounded-lg h-fit">
                                    <Lock size={20} className="text-neon" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-1">Data Encryption</h4>
                                    <p className="text-white/40 text-xs font-mono leading-relaxed">We use end-to-end encryption for all sensitive payment data to ensure secure transactions and prevent data leaks.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4">
                                <div className="p-2 bg-neon/10 rounded-lg h-fit">
                                    <Zap size={20} className="text-neon" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-1">Fraud Prevention</h4>
                                    <p className="text-white/40 text-xs font-mono leading-relaxed">Our payment providers utilize real-time anti-fraud protocols to detect and prevent unauthorized transactions.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default PaymentMethods;
