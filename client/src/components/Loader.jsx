import { Terminal, Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = "Accessing Grid" }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen fixed inset-0 z-[100] bg-charcoal' : 'min-h-[400px] w-full'}`}>
            <div className="relative flex items-center justify-center">
                {/* Outer glowing ring */}
                <div className="absolute w-24 h-24 rounded-full border-2 border-neon/5 animate-[pulse_2s_infinite]"></div>
                
                {/* Rotating accent ring */}
                <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-neon animate-spin"></div>
                
                {/* Center icon */}
                <div className="absolute">
                    <Terminal size={24} className="text-neon/40" />
                </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon animate-pulse">
                    {text}
                </span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-neon rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-neon rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-neon rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export const ButtonLoader = ({ className = "" }) => (
    <Loader2 className={`animate-spin ${className}`} size={16} />
);

export default Loader;
