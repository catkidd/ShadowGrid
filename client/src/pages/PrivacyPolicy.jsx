import React from 'react';
import FadeInUp from '../components/FadeInUp';

const PrivacyPolicy = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-4xl flex-1">
            <FadeInUp>
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">Privacy Policy</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Last Updated: May 2026</p>
                </div>
            </FadeInUp>
            
            <div className="space-y-12 text-white/70 font-medium leading-relaxed">
                <FadeInUp delay={100}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">1. Data Collection</h2>
                        <p>
                            ShadowGrid respects your privacy. We collect essential account information and order history necessary to process your hardware requests. This data remains strictly confidential and is secured within our encrypted database. We do not sell or trade your personal information.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">2. Hardware Preferences</h2>
                        <p>
                            To enhance your experience within the Grid, we store your hardware preferences. This allows us to tailor our boutique engineering offerings to your specific requirements, ensuring optimal precision and personalized recommendations for future loadouts.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">3. Cookies & Tracking</h2>
                        <p>
                            Our platform utilizes tracking tokens (cookies) to maintain session state, remember your cart items, and authenticate your access. These are strictly necessary for the seamless operation of the ShadowGrid interface and ensuring a frictionless user experience.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={400}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">4. Third-Party Payments</h2>
                        <p>
                            Transactions are processed securely through our verified financial partners, Stripe and PayPal. ShadowGrid does not directly store or process your raw payment credentials on our servers. All financial data is encrypted and handled in compliance with global security protocols.
                        </p>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
