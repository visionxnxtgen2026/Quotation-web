import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
// 🔥 IMPORT THE NEW MODAL
import DeleteAccountModal from "../../components/settings/DeleteAccountModal"; 
import { 
  Building2, FileText, DownloadCloud, 
  CheckCircle2, Save, ToggleLeft, ToggleRight,
  AlertTriangle, Trash2
} from "lucide-react";

export default function Settings({
  user,
  goToDashboard,
  goToCreate,
  goToPreview,
  goToExport,
  goToSettings,
  goToEditProfile,
  goToSubscription,
  goToHelp // 🔥 NEW: Added Help Prop here
}) {
  const [saved, setSaved] = useState(false);
  
  // 🔥 MODAL STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔥 CORE SETTINGS STATE
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    quotePrefix: "QT-",
    validity: "30",
    tax: "18",
    currency: "INR (₹)",
    terms: `1. This quotation is valid for 30 days from the date of issue.\n2. Payment terms: 50% advance, 50% upon completion.\n3. Prices are exclusive of applicable taxes unless otherwise stated.\n4. Delivery timelines will be confirmed upon order confirmation.\n5. Any changes to the scope of work may result in revised pricing.`,
    pageSize: "A4",
    showPageNumbers: true,
    showSignatures: true,
    emailAlerts: true,
    dailySummary: false,
  });

  useEffect(() => {
    const savedData = localStorage.getItem("quotation_settings");
    if (savedData) {
      setForm(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const CustomToggle = ({ name, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <label className="cursor-pointer relative">
        <input 
          type="checkbox" 
          name={name} 
          checked={form[name]} 
          onChange={handleChange} 
          className="sr-only peer"
        />
        {form[name] ? (
          <ToggleRight className="text-blue-600 w-10 h-10 transition-all" />
        ) : (
          <ToggleLeft className="text-gray-300 w-10 h-10 transition-all" />
        )}
      </label>
    </div>
  );

  const handleSave = () => {
    localStorage.setItem("quotation_settings", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // 🚨 EXECUTE DELETE ACCOUNT (Triggered by Modal)
  const executeDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete("http://localhost:5000/api/auth/user/delete", {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen font-sans selection:bg-blue-100">

      {/* 🔥 RENDER DELETE MODAL HERE */}
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={executeDeleteAccount}
        isDeleting={isDeleting}
      />

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-20 shadow-md">
        <Sidebar
          active="settings"
          user={user} 
          goToDashboard={goToDashboard}
          goToCreate={goToCreate}
          goToPreview={goToPreview}
          goToExport={goToExport}
          goToSettings={goToSettings}
          goToSubscription={goToSubscription}
          goToHelp={goToHelp} // 🔥 PERFECTLY PASSED TO SIDEBAR
          goToEditProfile={goToEditProfile} 
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px]">

        <div className="flex justify-between items-center px-8 py-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Manage your company profile and quotation defaults
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

        {saved && (
          <div className="px-8 mt-6 animate-fade-in">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
              <CheckCircle2 size={18} /> ✅ Settings updated successfully!
            </div>
          </div>
        )}

        <div className="p-8 space-y-8 max-w-5xl pb-24 mx-auto">

          {/* 1. COMPANY PROFILE */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <Building2 className="text-blue-500" size={20} /> Company Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                <input type="text" name="companyName" placeholder="Enter company name" value={form.companyName} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" name="email" placeholder="billing@company.com" value={form.email} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="text" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website</label>
                <input type="text" name="website" placeholder="www.company.com" value={form.website} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Address</label>
              <textarea name="address" placeholder="Enter full business address" value={form.address} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" rows={3} />
            </div>
          </div>

          {/* 2. QUOTATION DEFAULTS */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <FileText className="text-indigo-500" size={20} /> Quotation Defaults
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quote Prefix</label>
                <input type="text" name="quotePrefix" value={form.quotePrefix} onChange={handleChange} placeholder="e.g., QT-" className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Validity (Days)</label>
                <input type="number" name="validity" value={form.validity} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Tax (%)</label>
                <input type="number" name="tax" value={form.tax} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium bg-white">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>AED (د.إ)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Terms & Conditions</label>
              <textarea name="terms" value={form.terms} onChange={handleChange} className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium leading-relaxed" rows={4} />
            </div>
          </div>

          {/* 3. APP PREFERENCES */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <DownloadCloud className="text-emerald-500" size={20} /> App Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CustomToggle name="showPageNumbers" label="Show Page Numbers" description="Include page numbers at the bottom of the PDF." />
                <CustomToggle name="showSignatures" label="Include Signature Block" description="Show authorized signatory fields by default." />
              </div>
              <div className="space-y-4">
                <CustomToggle name="emailAlerts" label="Email Alerts" description="Get notified when a client views your quotation." />
                <CustomToggle name="dailySummary" label="Daily Summary" description="Receive a daily email of your total created quotes." />
              </div>
            </div>
          </div>

          {/* 4. DANGER ZONE */}
          <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100 shadow-sm mt-12">
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2 border-b border-red-200 pb-4">
              <AlertTriangle size={20} /> Danger Zone
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="font-bold text-gray-800">Delete Account</p>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  Once you delete your account, there is no going back. All your personal data and saved quotations will be permanently erased.
                </p>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-100 hover:bg-red-600 text-red-600 hover:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors border border-red-200 shrink-0"
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}