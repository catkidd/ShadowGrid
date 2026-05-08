import { useState } from "react";
import { Send, MessageSquare, Mail, MapPin } from "lucide-react";
import FadeInUp from '../components/FadeInUp';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Reset form
    setFormData({ name: "", email: "", orderNumber: "", message: "" });
  };

  return (
    <main className="container mx-auto px-6 py-20 max-w-4xl flex-1 relative bg-[#0A0A0A]">
      <FadeInUp>
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 font-mono text-white">
            Contact Support
          </h1>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
            Transmit secure comms to ShadowGrid Ops
          </p>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <FadeInUp delay={100}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon transition-colors font-mono text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon transition-colors font-mono text-sm"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="orderNumber" className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                  Order Number (Optional)
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon transition-colors font-mono text-sm"
                  placeholder="SG-109284"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-white/60 font-mono">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-neon transition-colors font-mono text-sm resize-none"
                  placeholder="Describe your issue or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-neon hover:bg-neon/80 text-charcoal font-bold uppercase tracking-widest text-sm px-8 py-3 rounded transition-colors font-mono"
              >
                <Send size={18} />
                Transmit Signal
              </button>
            </form>
          </FadeInUp>
        </div>

        <div className="space-y-8">
          <FadeInUp delay={200}>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-neon" size={24} />
                <h3 className="font-bold uppercase tracking-widest text-white font-mono">
                  Community
                </h3>
              </div>
              <p className="text-white/60 font-mono text-sm mb-4">
                Join the grid and connect with other users in our Discord server.
              </p>
              <a
                href="#"
                className="text-neon hover:text-white transition-colors font-mono text-sm underline decoration-white/20 underline-offset-4"
              >
                discord.gg/shadowgrid
              </a>
            </div>
          </FadeInUp>

          <FadeInUp delay={300}>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-neon" size={24} />
                <h3 className="font-bold uppercase tracking-widest text-white font-mono">
                  Direct Email
                </h3>
              </div>
              <p className="text-white/60 font-mono text-sm mb-4">
                For urgent or highly sensitive communications.
              </p>
              <a
                href="mailto:support@shadowgrid.io"
                className="text-neon hover:text-white transition-colors font-mono text-sm underline decoration-white/20 underline-offset-4"
              >
                support@shadowgrid.io
              </a>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Location Map */}
      <FadeInUp delay={400}>
        <div className="mt-16 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4 px-2">
            <h3 className="font-bold uppercase tracking-widest text-white font-mono flex items-center gap-2">
                <MapPin className="text-neon" size={24} />
                ShadowGrid HQ
            </h3>
            </div>
            <div className="w-full h-[350px] rounded-lg overflow-hidden border border-white/5">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.19256950239!2d85.309489!3d27.708960!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190038844853%3A0x6bd6c747cf948c25!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1715012345678!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-500"
            ></iframe>
            </div>
        </div>
      </FadeInUp>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-neon text-charcoal px-6 py-4 rounded shadow-lg flex items-center gap-3 animate-bounce z-50">
          <Send size={20} />
          <div>
            <h4 className="font-bold uppercase text-sm tracking-widest font-mono">
              Signal Sent
            </h4>
            <p className="text-xs font-mono opacity-80">
              Your message has been received.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Contact;
