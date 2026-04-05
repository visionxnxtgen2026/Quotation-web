import React, { useState } from "react";
import Sidebar from "./Sidebar"; 
import { 
  LifeBuoy, Mail, MessageCircle, FileText, 
  ChevronDown, Search, ExternalLink, ShieldQuestion 
} from "lucide-react";

export default function HelpSupport({ 
  user,
  goToDashboard,
  goToCreate,
  goToPreview,
  goToExport,
  goToSubscription,
  goToSettings,
  goToEditProfile,
  goToHelp // 🔥 இந்த Prop-ஐயும் சேர்த்துக் கொள்ளுங்கள்
}) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How many quotations can I create daily?",
      a: "On the Basic plan, you can create up to 20 quotations per day. The Pro plan offers a high limit of 500 quotations per month."
    },
    {
      q: "Is my data safe if I delete the app?",
      a: "If you are on the Basic plan, data is stored locally on your device. Deleting the app might result in data loss. For Pro users, all data is safely backed up on Amazon S3 cloud."
    },
    {
      q: "How to remove the watermark from PDF?",
      a: "The watermark is only included in the Basic plan. Upgrading to the PRO plan will give you clean, professional PDFs with your own branding."
    },
    {
      q: "Can I use the app on multiple devices?",
      a: "Basic plan users' data is limited to one device. Pro users can sync their data across multiple devices using cloud login."
    }
  ];

  const handleWhatsApp = () => {
    // 💡 உங்கள் WhatsApp நம்பரை இங்கே மாற்றவும் (எ.கா: 919876543210)
    window.open("https://wa.me/91XXXXXXXXXX?text=Hi VisionX Team, I need help with...", "_blank");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar 
          active="help" 
          user={user} 
          goToDashboard={goToDashboard}
          goToCreate={goToCreate}
          goToPreview={goToPreview}
          goToExport={goToExport}
          goToSubscription={goToSubscription}
          goToSettings={goToSettings}
          goToEditProfile={goToEditProfile}
          goToHelp={goToHelp} // 🔥 Sidebar-க்கு இதை பாஸ் பண்ண வேண்டும்
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-[250px] min-h-screen flex flex-col relative pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <LifeBuoy className="text-blue-600" /> Help Center
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">We're here to help you build professional quotations faster.</p>
          </div>
        </div>

        <div className="p-10 max-w-5xl mx-auto w-full">
          
          {/* SEARCH BOX */}
          <div className="relative mb-12">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for questions or topics..." 
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CONTACT CARDS */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-2">Direct Contact</h3>
              
              <div onClick={handleWhatsApp} className="bg-white border border-emerald-100 rounded-3xl p-6 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all group border-b-4 border-b-emerald-500">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                </div>
                <h4 className="font-bold text-lg text-gray-900">WhatsApp Support</h4>
                <p className="text-sm text-gray-500 mt-1 font-medium">Instant reply for critical issues and account help.</p>
                <div className="mt-4 flex items-center gap-1 text-emerald-600 font-bold text-sm">
                  Chat Now <ExternalLink size={14} />
                </div>
              </div>

              <div className="bg-white border border-blue-100 rounded-3xl p-6 cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group border-b-4 border-b-blue-500">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <h4 className="font-bold text-lg text-gray-900">Email Support</h4>
                <p className="text-sm text-gray-500 mt-1 font-medium">Send us your feedback or long enquiries.</p>
                <div className="mt-4 text-blue-600 font-bold text-sm">support@visionx.tech</div>
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-2">Common Questions</h3>
              
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all shadow-sm">
                    <button 
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-gray-800">{faq.q}</span>
                      <ChevronDown className={`text-gray-400 transition-transform duration-300 ${openFAQ === index ? 'rotate-180 text-blue-600' : ''}`} size={18} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-40' : 'max-h-0'}`}>
                      <div className="p-5 pt-0 text-sm text-gray-600 font-medium leading-relaxed bg-gray-50/50">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* QUICK LINKS */}
              <div className="mt-8 p-8 bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute right-0 bottom-0 opacity-10"><ShieldQuestion size={150} /></div>
                 <h4 className="text-xl font-black mb-2 relative z-10">Need a deep dive?</h4>
                 <p className="text-gray-400 text-sm mb-6 relative z-10 font-medium">Check our documentation for step-by-step video tutorials on how to use VisionX effectively.</p>
                 <button className="bg-white text-gray-900 font-black px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors relative z-10">
                   Watch Tutorials
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}