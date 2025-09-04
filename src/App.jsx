import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, IndianRupee, UserPlus, Briefcase, ArrowLeft, Upload, X, Send } from "lucide-react";
import { PLATFORM_NAME, PLATFORM_UPI_ID, PLATFORM_QR_IMAGE, PLATFORM_PHONE } from "./config";

// Demo services
const DEFAULT_SERVICES = [
  { id: "s1", title: "Logo Design (Basic)", price: 499, desc: "Minimal logo delivered in PNG + SVG" },
  { id: "s2", title: "Social Media Post x5", price: 399, desc: "5 creatives for Instagram/Facebook" },
  { id: "s3", title: "Landing Page UI", price: 2499, desc: "Figma landing page, modern and responsive" },
  { id: "s4", title: "Business Card Design", price: 199, desc: "Front & back print-ready design" },
  { id: "s5", title: "Basic Video Edit (60s)", price: 799, desc: "Short edit with captions & music" },
];

// local DB helpers
const db = {
  getFreelancers: () => {
    try { return JSON.parse(localStorage.getItem("freelancers") || "[]"); } catch { return []; }
  },
  addFreelancer: (obj) => {
    const list = db.getFreelancers();
    list.push(obj);
    localStorage.setItem("freelancers", JSON.stringify(list));
  },
};

const GradientBG = ({ children }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="blur-3xl opacity-30 w-[40rem] h-[40rem] bg-purple-600 rounded-full absolute -top-40 -left-20" />
      <div className="blur-3xl opacity-20 w-[35rem] h-[35rem] bg-cyan-500 rounded-full absolute -bottom-40 -right-10" />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const GlassCard = ({ className = "", children }) => (
  <div className={`backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}>{children}</div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/10 text-xs uppercase tracking-wider">
    {children}
  </span>
);

function Hero({ onGoFreelancer, onGoServices }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-3xl">
        <Pill><CheckCircle className="w-4 h-4" /> Premium Freelance Hub</Pill>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
          Hire Smarter. Pay via <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">UPI</span>.
        </h1>
        <p className="mt-4 text-white/80 text-lg">{PLATFORM_NAME} bridges clients and freelancers. Simple escrow-style flow with 2% fee.</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onGoFreelancer} className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold inline-flex items-center gap-2"><UserPlus className="w-5 h-5" /> I'm a Freelancer</button>
          <button onClick={onGoServices} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold inline-flex items-center gap-2"><Briefcase className="w-5 h-5" /> Browse Services</button>
        </div>
      </motion.div>
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        {[
          ["100+", "Verified freelancers"],
          ["₹100–₹3000", "Starter-friendly prices"],
          ["2%", "Low platform fee"],
          ["UPI", "Direct & fast payments"],
        ].map(([big, small], i) => (
          <GlassCard key={i} className="p-5 text-center">
            <div className="text-2xl font-bold">{big}</div>
            <div className="text-white/70 text-sm mt-1">{small}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function FreelancerPage({ onBack }) {
  const [form, setForm] = useState({ name: "", skills: "", price: "", bio: "", contact: "", photo: "", upi: "" });
  const [saved, setSaved] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => { setList(db.getFreelancers()); }, []);
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target?.result || "" }));
      reader.readAsDataURL(files[0]);
    } else setForm((f) => ({ ...f, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.skills) return alert("Please fill name & skills");
    const freelancer = { ...form, id: crypto.randomUUID(), createdAt: Date.now() };
    db.addFreelancer(freelancer);
    setSaved(true);
    setList((prev) => [freelancer, ...prev]);
    setForm({ name: "", skills: "", price: "", bio: "", contact: "", photo: "", upi: "" });
  }
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-white/80 hover:text-white"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold">Create your freelancer profile</h2>
          <p className="text-white/70 mb-4">Show clients what you can do. Profiles are stored locally (MVP).</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/80">Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Sagar Gaur" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-white/80">Primary Rate (₹)</label>
                <input name="price" value={form.price} onChange={handleChange} type="number" min="100" max="3000" placeholder="e.g., 999" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/80">Skills (comma separated)</label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="Logo, UI/UX, Video Editing" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-white/80">Short Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Tell clients about your experience" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/80">Contact (Email/Phone)</label>
                <input name="contact" value={form.contact} onChange={handleChange} placeholder="email@domain.com" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-white/80">Your UPI ID</label>
                <input name="upi" value={form.upi} onChange={handleChange} placeholder="name@upi" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/80">Profile Photo</label>
              <div className="mt-1 flex items-center gap-3">
                {form.photo ? (<img src={form.photo} alt="preview" className="w-12 h-12 rounded-xl object-cover" />) : (<div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10" />)}
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input type="file" name="photo" onChange={handleChange} className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold">Save Profile</button>
            {saved && (<div className="flex items-center gap-2 text-emerald-400"><CheckCircle className="w-4 h-4" /> Profile saved!</div>)}
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-2">Recently added freelancers</h3>
          {list.length === 0 ? (<p className="text-white/70">No profiles yet. Be the first!</p>) : (
            <div className="grid gap-4 max-h-[28rem] overflow-auto pr-1">
              {list.map((f) => (
                <div key={f.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <img src={f.photo || `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(f.name)}`} alt={f.name} className="w-14 h-14 rounded-xl object-cover bg-white/10" />
                  <div className="flex-1">
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-white/70 text-sm">{f.skills}</div>
                  </div>
                  <div className="flex items-center gap-1 font-semibold"><IndianRupee className="w-4 h-4" />{f.price || "—"}</div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function ServicesPage({ onBack, onPay }) {
  const [query, setQuery] = useState("");
  const services = DEFAULT_SERVICES;
  const filtered = services.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()) || s.desc.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-white/80 hover:text-white"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-white/70">Starter-friendly pricing. Pay via UPI, fast & secure.</p>
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services..." className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <GlassCard key={s.id} className="p-5 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-white/70 text-sm mt-1 min-h-[3rem]">{s.desc}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-1 font-bold"><IndianRupee className="w-4 h-4" /> {s.price}</div>
              <button onClick={() => onPay(s)} className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold">Pay via UPI</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function QRSVG({ size = 220 }) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="rounded-2xl bg-white p-4" style={{ width: size, height: size }}>
        <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1">
          {[...Array(25)].map((_, i) => (<div key={i} className={`w-full h-full ${i%2===0 ? "bg-slate-900" : "bg-white"}`} />))}
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ open, service, onClose }) {
  const [utr, setUtr] = useState("");
  const upiLink = useMemo(() => {
    if (!service) return "";
    const params = new URLSearchParams({ pa: PLATFORM_UPI_ID, pn: PLATFORM_NAME, am: String(service.price), cu: "INR", tn: service.title });
    return `upi://pay?${params.toString()}`;
  }, [service]);

  useEffect(() => { if (!open) setUtr(""); }, [open]);
  if (!open || !service) return null;

  function submitUTR() {
    if (!utr || utr.length < 6) return alert("Please enter a valid UTR / Transaction ID");
    const records = JSON.parse(localStorage.getItem("payments") || "[]");
    records.push({ id: crypto.randomUUID(), serviceId: service.id, title: service.title, amount: service.price, utr, upi: PLATFORM_UPI_ID, createdAt: Date.now() });
    localStorage.setItem("payments", JSON.stringify(records));
    alert("Payment details submitted! We will verify and assign a freelancer.");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <GlassCard className="relative w-full max-w-xl p-6">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 bg-white/10 rounded-lg border border-white/10"><X className="w-4 h-4" /></button>
        <h3 className="text-xl font-bold">Pay via UPI</h3>
        <p className="text-white/70">You're paying for <span className="font-semibold text-white">{service.title}</span></p>
        <div className="mt-4 grid md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="text-sm text-white/80">Amount</div>
            <div className="text-2xl font-bold inline-flex items-center gap-1"><IndianRupee className="w-5 h-5" />{service.price}</div>
            <div className="text-sm text-white/80">Pay to UPI ID</div>
            <div className="font-mono bg-white/10 border border-white/10 px-3 py-2 rounded-lg w-fit">{PLATFORM_UPI_ID}</div>
            <a href={upiLink} className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold" target="_blank" rel="noreferrer"><Send className="w-4 h-4" /> Open in UPI app</a>
            <div className="text-xs text-white/60">Tip: On mobile, the button opens GPay/PhonePe/Paytm with prefilled amount.</div>
          </div>
          <div className="space-y-3">
            {PLATFORM_QR_IMAGE ? (<img src={PLATFORM_QR_IMAGE} alt="UPI QR" className="w-full rounded-xl border border-white/10" />) : (<QRSVG />)}
            <div className="text-center text-xs text-white/70">Scan & pay using any UPI app</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm text-white/80 mb-1">Enter Transaction ID (UTR) after payment</div>
          <input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g., 12345678ABCDEF" className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none" />
          <button onClick={submitUTR} className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold">Submit UTR for Verification</button>
          <div className="mt-2 text-xs text-white/70">We verify & assign a freelancer. On completion, payout is sent to freelancer minus 2% fee.</div>
          <div className="mt-1 text-xs text-white/50">Support: {PLATFORM_PHONE}</div>
        </div>
      </GlassCard>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState("home");
  const [paying, setPaying] = useState(null);
  useEffect(() => { document.documentElement.classList.add("antialiased"); }, []);
  return (
    <GradientBG>
      <header className="flex items-center justify-between px-5 md:px-8 py-5">
        <div className="font-bold text-lg md:text-xl tracking-wide"><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">{PLATFORM_NAME}</span></div>
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          <button onClick={() => setRoute("home")} className={`hover:text-white ${route === "home" ? "text-white" : ""}`}>Home</button>
          <button onClick={() => setRoute("services")} className={`hover:text-white ${route === "services" ? "text-white" : ""}`}>Services</button>
          <button onClick={() => setRoute("freelancer")} className={`hover:text-white ${route === "freelancer" ? "text-white" : ""}`}>Freelancer</button>
        </nav>
        <a href={`mailto:support@${PLATFORM_NAME.toLowerCase().replace(/\s+/g,'')}.com`} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm">Contact</a>
      </header>
      <main>
        <AnimatePresence mode="wait">
          {route === "home" && (<motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Hero onGoFreelancer={() => setRoute("freelancer")} onGoServices={() => setRoute("services")} /></motion.section>)}
          {route === "freelancer" && (<motion.section key="freelancer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><FreelancerPage onBack={() => setRoute("home")} /></motion.section>)}
          {route === "services" && (<motion.section key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><ServicesPage onBack={() => setRoute("home")} onPay={(s) => setPaying(s)} /></motion.section>)}
        </AnimatePresence>
      </main>
      <footer className="px-5 md:px-8 py-10 text-white/60 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved.</div>
          <div className="flex items-center gap-6"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a></div>
        </div>
      </footer>
      <PaymentModal open={!!paying} service={paying} onClose={() => setPaying(null)} />
    </GradientBG>
  );
}