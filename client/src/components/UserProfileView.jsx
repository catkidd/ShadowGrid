import { 
    User, Package, Key, LogOut, 
    ShoppingBag, CreditCard, ChevronRight,
    Mail, Shield, ArrowRight, X,
    MapPin, Box, Download
} from 'lucide-react';
import { ButtonLoader } from './Loader';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const UserProfileView = ({ 
    user, 
    orders, 
    isLoadingOrders, 
    activeTab, 
    setActiveTab, 
    handleLogout, 
    handlePasswordUpdate, 
    currentPassword, 
    setCurrentPassword, 
    newPassword, 
    setNewPassword, 
    isUpdatingPassword,
    getStatusColor 
}) => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const numberToWords = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        const convert = (n) => {
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
            if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
            if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
            return 'Large Amount';
        };

        const dollars = Math.floor(num);
        const cents = Math.round((num - dollars) * 100);
        
        let result = convert(dollars) + ' Dollars';
        if (cents > 0) result += ' and ' + convert(cents) + ' Cents';
        return result + ' Only';
    };
    
    const downloadOrderReport = () => {
        if (!orders || orders.length === 0) return;

        const doc = new jsPDF();
        
        // Add ShadowGrid Branding
        doc.setFillColor(13, 13, 13); // Charcoal background for header
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(0, 255, 170); // Neon Green
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("SHADOWGRID", 20, 25);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("OFFICIAL PURCHASE REPORT", 20, 32);
        doc.text(`DATE: ${new Date().toLocaleDateString()}`, 150, 25);
        doc.text(`ACCOUNT: ${user.email.toUpperCase()}`, 150, 32);

        // Summary Section
        doc.setTextColor(13, 13, 13);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("PURCHASE SUMMARY", 20, 55);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Transactions: ${orders.length}`, 20, 65);
        doc.text(`Total Expenditure: $${totalSpent.toFixed(2)}`, 20, 72);
        doc.text(`Status: Verified Account`, 20, 79);

        // Prepare Table Data (Item-based for detailed tax-like report)
        const tableColumn = ["Date", "Order ID", "Description", "Rate", "Qty", "Disc %", "Total"];
        const tableRows = [];

        orders.forEach(order => {
            order.items.forEach(item => {
                // Calculate item discount if stored, or default to 0
                const itemDisc = item.discount || 0;
                const itemRate = item.price;
                const itemTotal = itemRate * item.quantity;
                
                tableRows.push([
                    new Date(order.createdAt).toLocaleDateString(),
                    order._id.toUpperCase().slice(-8),
                    item.name.toUpperCase(),
                    `$${itemRate.toFixed(2)}`,
                    item.quantity.toString(),
                    `${itemDisc}%`,
                    `$${itemTotal.toFixed(2)}`
                ]);
            });
        });

        // Add a Summary Row at the bottom
        tableRows.push([
            { content: 'GRAND TOTAL EXPENDITURE', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } },
            { content: `$${totalSpent.toFixed(2)}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [0, 150, 100] } }
        ]);

        // Generate Table
        autoTable(doc, {
            startY: 90,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { 
                fillColor: [13, 13, 13], 
                textColor: [0, 255, 170],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 25 },
                2: { cellWidth: 'auto' },
                3: { halign: 'right', cellWidth: 22 },
                4: { halign: 'center', cellWidth: 12 },
                5: { halign: 'center', cellWidth: 15 },
                6: { halign: 'right', cellWidth: 22 }
            },
            bodyStyles: {
                fontSize: 8,
                textColor: [40, 40, 40]
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            },
            margin: { top: 90 }
        });

        // Add "Amount in Words" Section
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(13, 13, 13);
        doc.text("TOTAL AMOUNT IN WORDS:", 20, finalY + 15);
        
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text(numberToWords(totalSpent).toUpperCase(), 20, finalY + 22);

        // Signature Section
        const sigY = finalY + 50;
        
        // Ensure signature doesn't go off page
        const checkPageHeight = (y) => y > 270;
        if (checkPageHeight(sigY)) {
            doc.addPage();
            // Reset sigY for new page
            var currentSigY = 50;
        } else {
            var currentSigY = sigY;
        }

        doc.setFont("helvetica", "bold");
        doc.text("__________________________", 20, currentSigY);
        doc.text("AUTHORIZED REPRESENTATIVE", 20, currentSigY + 7);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("SHADOWGRID MANAGEMENT", 20, currentSigY + 12);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("__________________________", 130, currentSigY);
        doc.text("CUSTOMER SIGNATURE", 130, currentSigY + 7);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(user.email.toUpperCase(), 130, currentSigY + 12);

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Purchase History Report - Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
            doc.text("This is a computer-generated document and does not require a physical signature.", 105, 290, { align: "center" });
        }

        doc.save(`ShadowGrid_Report_${user.email.split('@')[0]}.pdf`);
        toast.success("Report downloaded successfully.");
    };
    
    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const metrics = [
        { label: 'Shopping History', value: `$${totalSpent.toFixed(2)}`, sub: `${orders.length} total orders`, icon: ShoppingBag, color: 'text-neon', tab: 'orders' },
        { label: 'Account Status', value: 'Verified', sub: `Member since ${memberSince}`, icon: Shield, color: 'text-blue-500', tab: 'account' },
    ];

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 min-h-screen">
            {/* User Hero Section */}
            <div className="flex flex-col lg:flex-row gap-12 mb-16">
                <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
                    <div className="relative group mb-6">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative w-32 h-32 rounded-full bg-charcoal border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-neon/10 to-transparent"></div>
                            <User size={48} className="text-white/20" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2 text-center lg:text-left">
                        {user.email.split('@')[0]}
                    </h2>
                    <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] mb-8">Verified Customer Profile</p>
                    
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                                activeTab === 'account' 
                                ? 'bg-neon text-charcoal neon-glow' 
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={14} />
                                Security & Password
                            </div>
                            <ChevronRight size={14} />
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                                activeTab === 'orders' 
                                ? 'bg-neon text-charcoal neon-glow' 
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={14} />
                                Order History
                            </div>
                            <ChevronRight size={14} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-4 mt-4 bg-red-500/5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {metrics.map((metric, i) => (
                        <div 
                            key={i} 
                            onClick={() => setActiveTab(metric.tab)}
                            className={`glass-card p-6 border-l-2 hover:translate-y-[-4px] transition-all cursor-pointer group shadow-xl ${
                                activeTab === metric.tab ? 'border-l-neon shadow-neon/5' : 'border-l-white/10'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${metric.color}`}>
                                    <metric.icon size={20} />
                                </div>
                                <ArrowRight size={14} className={`transition-colors ${activeTab === metric.tab ? 'text-neon' : 'text-white/20 group-hover:text-white'}`} />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{metric.label}</h4>
                            <p className="text-xl font-black italic tracking-tight mb-1">{metric.value}</p>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">{metric.sub}</p>
                        </div>
                    ))}
                </div>

                    {/* Content Section */}
                    <div className="glass-card min-h-[400px] overflow-hidden">
                        {activeTab === 'account' ? (
                            <div className="p-8 space-y-12 animate-fade-in">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <Mail className="text-neon" size={16} />
                                        Account Information
                                    </h3>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 block">Primary Email</label>
                                        <p className="text-sm font-bold tracking-wide text-white/80">{user.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <Key className="text-neon" size={16} />
                                        Change Password
                                    </h3>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/5"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/5"
                                                placeholder="MIN 8 CHARACTERS"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className="w-full md:w-auto px-10 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-glow"
                                        >
                                            {isUpdatingPassword ? (
                                                <>
                                                    <ButtonLoader />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    Update Password
                                                    <ArrowRight size={14} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 animate-fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                        <ShoppingBag className="text-neon" size={16} />
                                        Order History
                                    </h3>
                                    {orders.length > 0 && (
                                        <button 
                                            onClick={downloadOrderReport}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-neon hover:border-neon/30 transition-all group"
                                        >
                                            <Download size={14} className="group-hover:scale-110 transition-transform" />
                                            Download Full Report
                                        </button>
                                    )}
                                </div>
                                
                                {isLoadingOrders ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                                        <Package size={32} className="text-white/10 mb-4" />
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">No transactions recorded</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div 
                                                key={order._id} 
                                                onClick={() => setSelectedOrder(order)}
                                                className="glass-card p-4 border-l-2 border-l-neon flex justify-between items-center group hover:bg-white/[0.02] transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-neon/10 rounded-lg text-neon">
                                                        <Box size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                                                        <p className="text-xs font-bold uppercase tracking-wide">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-6">
                                                    <div className="hidden md:block">
                                                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-1">Items</p>
                                                        <p className="text-xs font-bold">{order.items.length}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-neon mb-1">${order.total.toFixed(2)}</p>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={14} className="text-white/10 group-hover:text-neon group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Order Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
                    <div className="relative w-full max-w-2xl glass-card border-neon/20 overflow-hidden shadow-2xl shadow-neon/10 animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-white/5 border-b border-white/5 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                    <ShoppingBag className="text-neon" size={16} />
                                    Order Details
                                </h3>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Order ID: {selectedOrder._id.toUpperCase()}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                                        <MapPin size={12} /> Shipping Address
                                    </h4>
                                    <div className="text-xs space-y-1 text-white/70">
                                        <p className="font-bold text-white text-sm">{selectedOrder.shippingAddress.fullName}</p>
                                        <p>{selectedOrder.shippingAddress.address}</p>
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                        <p className="uppercase tracking-widest text-[10px] pt-1">{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right md:text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 md:justify-start justify-end">
                                        <CreditCard size={12} /> Payment Method
                                    </h4>
                                    <div className="text-xs space-y-1 text-white/70">
                                        <p className="font-bold text-white text-sm uppercase">{selectedOrder.paymentMethod || 'Secure Card'}</p>
                                        <p>Transaction ID: SG-{selectedOrder._id.slice(-6).toUpperCase()}</p>
                                        <div className="pt-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Ordered Items</h4>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="w-16 h-16 rounded-lg bg-charcoal overflow-hidden border border-white/5 flex-shrink-0">
                                                <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate uppercase tracking-wide">{item.name}</p>
                                                <p className="text-[10px] font-mono text-white/40 mt-1">QTY: {item.quantity} × ${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-neon">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-white/5 border-t border-white/5 px-8 py-6 flex items-center justify-between">
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                Timestamp: {new Date(selectedOrder.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Order Total</p>
                                <p className="text-2xl font-black italic tracking-tighter text-neon shadow-neon/20 shadow-lg">${selectedOrder.total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileView;
