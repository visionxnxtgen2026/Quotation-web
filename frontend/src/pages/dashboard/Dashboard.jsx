import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import DeleteModal from "../../components/DeleteModal"; // Import the custom Delete Modal
import { 
  Plus, ArrowRight, FileText, IndianRupee, Clock, 
  TrendingUp, Sparkles, FileSearch, MoreVertical, 
  Download, Eye, Lightbulb, CheckCircle2, Trash2, Edit3, Save as SaveIcon
} from "lucide-react";

// ==============================
// API SETUP (Axios with Token)
// ==============================
const API = axios.create({
  baseURL: "http://localhost:5000/api/quotations",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getDashboardStats = () => API.get("/stats");
export const getAllQuotations = () => API.get("/");
export const getQuotationById = (id) => API.get(`/${id}`);
export const createQuotation = (data) => API.post("/", data);
export const updateQuotation = (id, data) => API.put(`/${id}`, data);
export const deleteQuotation = (id) => API.delete(`/${id}`);

// ==============================
// DASHBOARD COMPONENT
// ==============================
export default function Dashboard({
  user, 
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
  goToSubscription, 
  goToSettings, 
  goToHelp,     
  goToEditProfile, 
  setQuotationId 
}) {
  // Main Data States
  const [stats, setStats] = useState({ total: 0, value: 0, lastCreated: "None" });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI Interaction States
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [openDropdownId, setOpenDropdownId] = useState(null); 

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to show temporary toast messages
  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // ==============================
  // DATA FETCHING
  // ==============================
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, quotesRes] = await Promise.all([
        getDashboardStats(),
        getAllQuotations()
      ]);

      if (statsRes && quotesRes) {
        setStats(statsRes.data);
        setRecentQuotes(quotesRes.data.slice(0, 8)); // Display only the 8 most recent
      }
    } catch (error) {
      console.error("Backend fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Close dropdown menu if user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ==============================
  // ACTION HANDLERS
  // ==============================
  
  const handleStartNewQuote = () => {
    if (setQuotationId) setQuotationId(null); // Clear active quotation ID
    localStorage.removeItem("previewDraft");  // Clear any existing draft data
    goToCreate();                             // Navigate to Create page
  };

  const handleEdit = (id, rawData, e) => {
    e.stopPropagation();
    if(setQuotationId) setQuotationId(id); 
    if(rawData) {
      localStorage.setItem("previewDraft", JSON.stringify(rawData)); 
    }
    goToCreate();
  };

  const handleDownload = (id, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/api/export/pdf/${id}?token=${token}`, "_blank");
  };

  // Triggers the custom Delete Modal
  const handleDeleteClick = (quote, e) => {
    e.stopPropagation(); 
    setOpenDropdownId(null); // Close the dropdown menu
    setQuoteToDelete(quote); // Set the target quotation
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Executes the actual API deletion call (Triggered from Modal)
  const executeDelete = async () => {
    if (!quoteToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteQuotation(quoteToDelete._id);
      if (res.data.success) {
        setRecentQuotes((prev) => prev.filter((q) => q._id !== quoteToDelete._id));
        showToast("Quotation deleted permanently.");
        fetchDashboardData(); 
      }
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete. Backend error.", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setQuoteToDelete(null);
    }
  };

  const handleMarkAsSaved = async (id, rawData, e) => {
    e.stopPropagation();
    setOpenDropdownId(null);

    try {
      const updatedData = { ...rawData, status: "Saved" };
      await updateQuotation(id, updatedData);
      showToast("Quotation marked as Permanently Saved!");
      fetchDashboardData(); 
    } catch (error) {
      showToast("Failed to update status.", "error");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-20 right-8 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          <CheckCircle2 size={18} />
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* CUSTOM DELETE MODAL */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        quoteName={quoteToDelete?.client || "this quotation"}
        isLoading={isDeleting}
      />

      {/* SIDEBAR NAVIGATION */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100">
        <Sidebar 
          active="dashboard" 
          user={user} 
          goToCreate={handleStartNewQuote} 
          goToDashboard={goToDashboard} 
          goToPreview={goToPreview} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription}
          goToSettings={goToSettings} 
          goToHelp={goToHelp}         
          goToEditProfile={goToEditProfile} 
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="ml-[250px] h-screen flex flex-col relative">
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your quotations and track business performance.</p>
          </div>

          <button onClick={handleStartNewQuote} className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="w-4 h-4" /> New Quotation
          </button>
        </div>

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl mx-auto w-full pb-24">

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Quotations</p>
                  <h3 className="text-3xl font-black text-gray-800 mt-2">{isLoading ? "..." : stats.total}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-6 h-6" /></div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                <TrendingUp className="w-3.5 h-3.5" /> Active Pipeline
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
                  <h3 className="text-3xl font-black text-gray-800 mt-2">{isLoading ? "..." : formatCurrency(stats.value)}</h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><IndianRupee className="w-6 h-6" /></div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-gray-500">Combined pipeline value</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Activity</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-3 truncate max-w-[150px]">{isLoading ? "..." : stats.lastCreated}</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Clock className="w-6 h-6" /></div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-500">Time of last creation</div>
            </div>
          </div>

          {/* RECENT QUOTATIONS TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible relative">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Recent Quotations</h2>
            </div>

            {isLoading ? (
              <div className="p-10 text-center text-gray-400 font-bold animate-pulse">Loading data...</div>
            ) : recentQuotes.length > 0 ? (
              <div className="overflow-visible pb-20">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Quote ID</th>
                      <th className="px-6 py-4">Client & Project</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 relative">
                    {recentQuotes.map((quote) => (
                      <tr key={quote._id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-900">{quote.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{quote.client}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{quote.project}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{quote.date}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{formatCurrency(quote.value)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                            ${quote.status === 'Saved' || quote.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                              quote.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 
                              'bg-gray-100 text-gray-600'}`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center relative">
                          <div className="flex items-center justify-center gap-2">
                            
                            <button onClick={(e) => handleEdit(quote._id, quote.raw, e)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit & Preview">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            
                            <button onClick={(e) => handleDownload(quote._id, e)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download PDF">
                              <Download className="w-4 h-4" />
                            </button>
                            
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  setOpenDropdownId(openDropdownId === quote._id ? null : quote._id);
                                }} 
                                className={`p-2 rounded-lg transition-colors ${openDropdownId === quote._id ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'}`}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {openDropdownId === quote._id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-fade-in">
                                  <div className="py-1">
                                    <button 
                                      onClick={(e) => handleMarkAsSaved(quote._id, quote.raw, e)}
                                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium flex items-center gap-2 transition-colors"
                                    >
                                      <SaveIcon className="w-4 h-4" /> Permanent Save
                                    </button>
                                    
                                    {/* DELETE TRIGGER */}
                                    <button 
                                      onClick={(e) => handleDeleteClick(quote, e)}
                                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" /> Delete Quotation
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // EMPTY STATE
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5 border-8 border-white shadow-sm">
                  <FileSearch className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No quotations yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">Start by creating your first professional quotation.</p>
                <button onClick={handleStartNewQuote} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all">+ Create First Quotation</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}