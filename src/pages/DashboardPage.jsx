import React, { useState, useEffect } from "react";
import { 
  CreditCard, DollarSign, CheckCircle, XCircle, 
  TrendingUp, PieChart, Search, ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { maskCardNumber, maskCVV } from "../utils/mask";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://payment-assignment.onrender.com/transactions?page=1&limit=100");
      const result = await response.json();
      setTransactions(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalTransactions = transactions.length;
    const totalSuccessVolume = transactions
      .filter(t => t.status === "success")
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const totalSuccessCount = transactions.filter(t => t.status === "success").length;
    const totalFailedCount = transactions.filter(t => t.status === "failed" || t.status === "pending").length;
    return { totalTransactions, totalSuccessVolume, totalSuccessCount, totalFailedCount };
  };

  const getStatusBreakdown = () => {
    const success = transactions.filter(t => t.status === "success").length;
    const failed = transactions.filter(t => t.status === "failed").length;
    const pending = transactions.filter(t => t.status === "pending").length;
    return { success, failed, pending };
  };

  const getCurrencyDistribution = () => {
    const distribution = {};
    transactions.forEach(t => {
      const currency = t.currency || "USD";
      distribution[currency] = (distribution[currency] || 0) + parseFloat(t.amount || 0);
    });
    return distribution;
  };

  const getVolumeOverTime = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: 0
      });
    }
    transactions.forEach(t => {
      if (t.status === "success" && t.createdAt) {
        const txDate = new Date(t.createdAt);
        const dateStr = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayData = last7Days.find(d => d.date === dateStr);
        if (dayData) dayData.volume += parseFloat(t.amount || 0);
      }
    });
    return last7Days;
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = searchTerm === "" || 
      t.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cardHolderName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const metrics = calculateMetrics();
  const statusBreakdown = getStatusBreakdown();
  const currencyDistribution = getCurrencyDistribution();
  const volumeData = getVolumeOverTime();
  const maxVolume = Math.max(...volumeData.map(d => d.volume), 1);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case "success":
        return <span className="badge bg-emerald-50 text-emerald-700 border-none rounded-none px-3 py-2 text-xs font-medium">Success</span>;
      case "failed":
        return <span className="badge bg-rose-50 text-rose-700 border-none rounded-none px-3 py-2 text-xs font-medium">Failed</span>;
      case "pending":
        return <span className="badge bg-amber-50 text-amber-700 border-none rounded-none px-3 py-2 text-xs font-medium">Pending</span>;
      default:
        return <span className="badge bg-stone-50 text-stone-600 border-none rounded-none px-3 py-2 text-xs font-medium">{status || "Unknown"}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg" style={{ color: "#1a56db" }}></span>
          <p className="mt-4 text-stone-500 text-sm">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-400 mt-1">Payment activity overview</p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white border border-stone-200 p-12 text-center">
            <p className="text-stone-400 text-sm">No transactions found</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <CreditCard size={20} style={{ color: "#1a56db" }} />
                  <span className="text-2xl font-light text-stone-900">{metrics.totalTransactions.toLocaleString()}</span>
                </div>
                <p className="text-xs text-stone-400 tracking-wide">TOTAL TRANSACTIONS</p>
              </div>

              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign size={20} style={{ color: "#1a56db" }} />
                  <span className="text-2xl font-light text-stone-900">${metrics.totalSuccessVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-stone-400 tracking-wide">SUCCESS VOLUME</p>
              </div>

              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle size={20} style={{ color: "#1a56db" }} />
                  <span className="text-2xl font-light text-stone-900">{metrics.totalSuccessCount}</span>
                </div>
                <p className="text-xs text-stone-400 tracking-wide">SUCCESSFUL PAYMENTS</p>
              </div>

              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <XCircle size={20} style={{ color: "#1a56db" }} />
                  <span className="text-2xl font-light text-stone-900">{metrics.totalFailedCount}</span>
                </div>
                <p className="text-xs text-stone-400 tracking-wide">FAILED + PENDING</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              
              {/* Donut Chart */}
              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <PieChart size={16} style={{ color: "#1a56db" }} />
                  <h2 className="text-sm font-medium text-stone-700">Status breakdown</h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-36 h-36 mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e7e5e4" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8"
                        strokeDasharray={`${(statusBreakdown.success / transactions.length) * 283} 283`}
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="8"
                        strokeDasharray={`${(statusBreakdown.failed / transactions.length) * 283} 283`}
                        strokeDashoffset={`-${(statusBreakdown.success / transactions.length) * 283}`}
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#eab308" strokeWidth="8"
                        strokeDasharray={`${(statusBreakdown.pending / transactions.length) * 283} 283`}
                        strokeDashoffset={`-${((statusBreakdown.success + statusBreakdown.failed) / transactions.length) * 283}`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500"></div><span>Success ({statusBreakdown.success})</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-500"></div><span>Failed ({statusBreakdown.failed})</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-amber-500"></div><span>Pending ({statusBreakdown.pending})</span></div>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp size={16} style={{ color: "#1a56db" }} />
                  <h2 className="text-sm font-medium text-stone-700">Weekly volume</h2>
                </div>
                <div className="flex items-end justify-between h-40 gap-3 px-1">
                  {volumeData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full transition-all duration-300"
                        style={{ 
                          height: `${(item.volume / maxVolume) * 110}px`,
                          backgroundColor: "#1a56db",
                          opacity: item.volume === 0 ? 0.3 : 0.8,
                          minHeight: item.volume === 0 ? '4px' : 'auto'
                        }}
                      />
                      <p className="text-[10px] text-stone-400 mt-3 whitespace-nowrap">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Distribution */}
              <div className="bg-white border border-stone-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <DollarSign size={16} style={{ color: "#1a56db" }} />
                  <h2 className="text-sm font-medium text-stone-700">By currency</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(currencyDistribution).map(([currency, amount]) => (
                    <div key={currency}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-500">{currency}</span>
                        <span className="text-stone-700">${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5">
                        <div className="h-1.5" style={{ 
                          width: `${(amount / metrics.totalSuccessVolume) * 100}%`,
                          backgroundColor: "#1a56db"
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white border border-stone-200 shadow-sm">
              
              {/* Table Header */}
              <div className="p-5 border-b border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-sm font-medium text-stone-700">Transaction history</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search by name or order..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered rounded-none border-stone-200 text-sm h-9 pl-9 w-full sm:w-56"
                      />
                    </div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="select select-bordered rounded-none border-stone-200 text-sm h-9 w-full sm:w-28"
                    >
                      <option value="all">All status</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr className="text-left">
                      <th className="p-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                      <th className="p-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Cardholder</th>
                      <th className="p-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Card</th>
                      <th className="p-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Expiry</th>
                      <th className="p-4 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Amount</th>
                      <th className="p-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Currency</th>
                      <th className="p-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((tx, idx) => (
                      <tr key={tx.orderId || idx} className="border-b border-stone-50 hover:bg-stone-50/50">
                        <td className="p-4 text-xs font-mono text-stone-600">{tx.orderId?.slice(-12) || "—"}</td>
                        <td className="p-4 text-xs text-stone-600">{tx.cardHolderName || "—"}</td>
                        <td className="p-4 text-xs font-mono text-stone-500">{maskCardNumber(tx.cardNumber)}</td>
                        <td className="p-4 text-xs text-stone-500">{tx.expiryMonth && tx.expiryYear ? `${tx.expiryMonth}/${tx.expiryYear}` : "—"}</td>
                        <td className="p-4 text-xs text-right font-medium text-stone-700">${parseFloat(tx.amount || 0).toFixed(2)}</td>
                        <td className="p-4 text-xs text-stone-600">{tx.currency || "USD"}</td>
                        <td className="p-4">{getStatusBadge(tx.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-stone-100">
                {paginatedTransactions.map((tx, idx) => (
                  <div key={tx.orderId || idx} className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-stone-400">{tx.orderId?.slice(-12) || "—"}</span>
                      {getStatusBadge(tx.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-stone-400">Cardholder</span>
                      <span className="text-stone-600">{tx.cardHolderName || "—"}</span>
                      <span className="text-stone-400">Card</span>
                      <span className="font-mono text-stone-500">{maskCardNumber(tx.cardNumber)}</span>
                      <span className="text-stone-400">Amount</span>
                      <span className="font-medium text-stone-800">${parseFloat(tx.amount || 0).toFixed(2)} {tx.currency || "USD"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-stone-100 flex items-center justify-between">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="text-xs text-stone-500 hover:text-stone-700 disabled:opacity-40 flex items-center gap-1">
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <span className="text-xs text-stone-400">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs text-stone-500 hover:text-stone-700 disabled:opacity-40 flex items-center gap-1">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;