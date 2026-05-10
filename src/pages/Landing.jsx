import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge, FileCheck2, Wand2, Users, Bell, X,
  Store, Building2, User, ChevronRight, ArrowLeft,
  Landmark, ShieldCheck, Sparkles,
} from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Common";
import { setToken, setRole, setUserId } from "../utils/helpers";

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const FEATURES = [
  { icon: Gauge, title: "Real-time Monitoring", desc: "Continuous oversight of your entire regulatory landscape — GST, labour, MCA, all in one feed." },
  { icon: FileCheck2, title: "Audit Readiness", desc: "Stay 100% prepared with automated document gathering and a full filing history log." },
  { icon: Wand2, title: "Multi-scheme Support", desc: "GST, MSME, Udyam, labour codes, credit subsidies, and state schemes — all matched to your profile." },
  { icon: Users, title: "Expert Connect", desc: "On-demand CA and compliance experts who see your full profile — no re-explaining needed." },
  { icon: Bell, title: "Automated Alerts", desc: "Smart notifications that surface only what's critical, before it becomes a penalty." },
  { icon: ShieldCheck, title: "Compliance Vault", desc: "Every document, filing, and approval — encrypted, timestamped, and audit-exportable." },
];

const BUSINESS_PRICING = [
  {
    name: "FREE",
    price: "₹0",
    period: "",
    badge: null,
    items: ["ARIA onboarding", "3 scheme recommendations", "Compliance calendar view", "Registration Hub access"],
    cta: "Start Free",
    variant: "outline",
    featured: false,
  },
  {
    name: "GROWTH",
    price: "₹249",
    period: "/month",
    badge: "MOST POPULAR",
    items: [
      "Everything in Free — zero ads",
      "VEDA — unlimited document uploads",
      "SCOUT — full scheme matching + form pre-fill",
      "Deadline alerts via WhatsApp & email",
      "PATHWAY smart scheduling",
      "SENTINEL regulation alerts",
      "1 CA consultation/month included",
      "Compliance Vault — 3 year storage",
      "20% discount for women-led enterprises",
    ],
    cta: "Upgrade Now",
    variant: "primary",
    featured: true,
  },
  {
    name: "PRO",
    price: "₹649",
    period: "/month",
    badge: null,
    items: [
      "Everything in Growth",
      "Multi-business profile management",
      "Priority PATHWAY scheduling",
      "Compliance Vault — 7 year + audit export",
      "Dedicated account manager",
      "API access for accountants",
      "30% discount for women-led enterprises",
    ],
    cta: "Go Pro",
    variant: "outline",
    featured: false,
  },
];

const CA_PRICING = [
  {
    name: "CA LITE",
    price: "₹749",
    period: "/month",
    badge: null,
    items: [
      "Manage up to 10 client profiles",
      "Shared compliance calendar per client",
      "Approve/reject scheme applications",
      "Annotate documents and flag issues",
      "14-day free trial",
    ],
    cta: "Start Free Trial",
    variant: "outline",
    featured: false,
  },
  {
    name: "CA PRO",
    price: "₹1,599",
    period: "/month",
    badge: "MOST POPULAR",
    items: [
      "Unlimited client profiles",
      "Priority consultation scheduling",
      "Full API access for your own tools",
      "Verified CA badge on directory listing",
      "Revenue dashboard — track your earnings",
      "White-label client reports",
    ],
    cta: "Get CA Pro",
    variant: "primary",
    featured: true,
  },
];

/* ─────────────────────────────────────────────
   DEMO LOGIN CONFIGS
───────────────────────────────────────────── */
const DEMO_USERS = {
  msme: { token: "demo-msme-token", role: "msme_owner", userId: "demo-msme", path: "/dashboard" },
  enterprise: { token: "demo-enterprise-token", role: "enterprise", userId: "demo-enterprise", path: "/dashboard" },
  individual: { token: "demo-individual-token", role: "individual", userId: "demo-individual", path: "/dashboard" },
  ca: { token: "demo-ca-token", role: "ca", userId: "demo-ca", path: "/ca-dashboard" },
};

const BUSINESS_TYPES = [
  {
    key: "msme",
    icon: Store,
    label: "MSME Owner",
    sub: "Shopkeeper, manufacturer, or service provider",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "enterprise",
    icon: Building2,
    label: "Enterprise",
    sub: "Multi-entity business or corporate group",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "individual",
    icon: User,
    label: "Individual / Freelancer",
    sub: "Solo professional or gig worker",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

/* ─────────────────────────────────────────────
   LOGIN MODAL
───────────────────────────────────────────── */
function LoginModal({ onClose, initialFlow }) {
  const navigate = useNavigate();
  // flow: "choose" | "ca" | "business_type" | "business_login"
  const [flow, setFlow] = useState(initialFlow || "choose");
  const [bizType, setBizType] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function demoLogin(key) {
    const u = DEMO_USERS[key];
    setToken(u.token);
    setRole(u.role);
    setUserId(u.userId);
    onClose();
    navigate(u.path);
  }

  const slide = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.22 } };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,25,0.72)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <div className="flex items-center gap-2">
            {flow !== "choose" && (
              <button
                onClick={() => flow === "business_login" ? setFlow("business_type") : setFlow("choose")}
                className="text-cs-400 hover:text-cs-700 mr-1"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <span className="font-bold text-cs-900 text-base">
              {flow === "choose" && "Welcome back"}
              {flow === "ca" && "CA Login"}
              {flow === "business_type" && "I am a…"}
              {flow === "business_login" && BUSINESS_TYPES.find(b => b.key === bizType)?.label}
            </span>
          </div>
          <button onClick={onClose} className="text-cs-400 hover:text-cs-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Choose role */}
            {flow === "choose" && (
              <motion.div key="choose" {...slide} className="flex flex-col gap-3">
                <p className="text-cs-500 text-sm mb-1">Who are you logging in as?</p>
                <button
                  onClick={() => setFlow("business_type")}
                  className="flex items-center justify-between border border-cs-100 rounded-xl px-4 py-3.5 hover:border-cs-400 hover:bg-cs-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cs-100 flex items-center justify-center text-cs-600">
                      <Store size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-cs-900 text-sm">Business Owner</p>
                      <p className="text-cs-400 text-xs">MSME, enterprise, or individual</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-cs-300 group-hover:text-cs-600 transition-colors" />
                </button>

                <button
                  onClick={() => setFlow("ca")}
                  className="flex items-center justify-between border border-cs-100 rounded-xl px-4 py-3.5 hover:border-cs-400 hover:bg-cs-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                      <Landmark size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-cs-900 text-sm">Chartered Accountant</p>
                      <p className="text-cs-400 text-xs">Manage clients and filings</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-cs-300 group-hover:text-cs-600 transition-colors" />
                </button>

                <div className="mt-2 pt-4 border-t border-cs-100 text-center text-xs text-cs-400">
                  New here?{" "}
                  <button
                    className="text-cs-700 font-semibold hover:underline"
                    onClick={() => { onClose(); navigate("/onboarding"); }}
                  >
                    Create an account →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1 — CA Login */}
            {flow === "ca" && (
              <motion.div key="ca" {...slide} className="flex flex-col gap-4">
                <p className="text-cs-500 text-sm">Enter your registered CA credentials.</p>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Email or Phone</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <Button variant="primary" size="md" className="w-full">Log In</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cs-100" /></div>
                  <div className="relative flex justify-center text-xs text-cs-400 bg-white px-2">or</div>
                </div>
                <button
                  onClick={() => demoLogin("ca")}
                  className="w-full border border-dashed border-cs-300 rounded-lg py-2.5 text-sm font-semibold text-cs-600 hover:bg-cs-50 transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> Try CA Demo Account
                </button>
                <p className="text-center text-xs text-cs-400">
                  Not a CA yet?{" "}
                  <button className="text-cs-700 font-semibold hover:underline" onClick={() => { onClose(); navigate("/ca-onboarding"); }}>
                    Register your practice →
                  </button>
                </p>
              </motion.div>
            )}

            {/* STEP 1 — Business type picker */}
            {flow === "business_type" && (
              <motion.div key="btype" {...slide} className="flex flex-col gap-3">
                <p className="text-cs-500 text-sm mb-1">Select the type that fits your business.</p>
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt.key}
                    onClick={() => { setBizType(bt.key); setFlow("business_login"); }}
                    className="flex items-center justify-between border border-cs-100 rounded-xl px-4 py-3.5 hover:border-cs-400 hover:bg-cs-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bt.bg} ${bt.color}`}>
                        <bt.icon size={18} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-cs-900 text-sm">{bt.label}</p>
                        <p className="text-cs-400 text-xs">{bt.sub}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-cs-300 group-hover:text-cs-600 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* STEP 2 — Business login form */}
            {flow === "business_login" && bizType && (
              <motion.div key="blogin" {...slide} className="flex flex-col gap-4">
                <p className="text-cs-500 text-sm">
                  Log in to your {BUSINESS_TYPES.find(b => b.key === bizType)?.label} account.
                </p>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Mobile Number or Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-cs-600 block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-cs-200 rounded-lg px-3 py-2.5 text-sm text-cs-900 focus:outline-none focus:border-cs-600 focus:ring-1 focus:ring-cs-600 transition"
                  />
                </div>
                <Button variant="primary" size="md" className="w-full">Log In</Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cs-100" /></div>
                  <div className="relative flex justify-center text-xs text-cs-400 bg-white px-2">or skip login</div>
                </div>
                <button
                  onClick={() => demoLogin(bizType)}
                  className="w-full border border-dashed border-cs-300 rounded-lg py-2.5 text-sm font-semibold text-cs-600 hover:bg-cs-50 transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  Try {BUSINESS_TYPES.find(b => b.key === bizType)?.label} Demo
                </button>
                <p className="text-center text-xs text-cs-400">
                  No account?{" "}
                  <button
                    className="text-cs-700 font-semibold hover:underline"
                    onClick={() => { onClose(); navigate("/onboarding"); }}
                  >
                    Register with ARIA →
                  </button>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PRICING SECTION
───────────────────────────────────────────── */
function PricingSection({ viewAs, navigate }) {
  const plans = viewAs === "ca" ? CA_PRICING : BUSINESS_PRICING;

  return (
    <section className="py-20 px-6 bg-cs-50">
      <div className="text-center mb-4">
        <p className="text-xs font-bold tracking-widest text-cs-500 uppercase mb-2">Pricing</p>
        <h2 className="text-3xl font-bold text-cs-900 mb-3">Predictable scale.</h2>
        <p className="text-cs-400 text-sm max-w-md mx-auto">
          {viewAs === "ca"
            ? "One flat fee for your practice. No per-client charges."
            : "Start free. Upgrade when you need more power."}
        </p>
      </div>

      {/* Women-led callout for business */}
      {viewAs !== "ca" && (
        <div className="max-w-4xl mx-auto mb-8 bg-pink-50 border border-pink-100 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <span className="text-lg">🌸</span>
          <p className="text-sm text-pink-800">
            <span className="font-semibold">Women-led enterprises</span> get 20% off Growth and 30% off Pro — automatically applied at checkout.
          </p>
        </div>
      )}

      <div className={`max-w-4xl mx-auto grid grid-cols-1 ${plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.18 }}
            className={`bg-white border rounded-2xl p-6 relative flex flex-col ${plan.featured ? "border-cs-800 shadow-lg" : "border-cs-100"
              }`}
          >
            {plan.badge && (
              <span className="absolute top-0 right-0 bg-cs-900 text-cs-50 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                {plan.badge}
              </span>
            )}
            <p className="text-xs font-bold text-cs-500 tracking-widest mb-1">{plan.name}</p>
            <div className="flex items-end gap-1 mb-5">
              <span className="text-4xl font-extrabold text-cs-900 tracking-tight leading-none">{plan.price}</span>
              {plan.period && <span className="text-sm font-normal text-cs-500 pb-1">{plan.period}</span>}
            </div>
            <ul className="text-cs-600 text-sm space-y-2 mb-6 flex-1">
              {plan.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={plan.featured ? "primary" : "outline"}
              size="md"
              className="w-full"
              onClick={() => navigate("/onboarding")}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING COMPONENT
───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [viewAs, setViewAs] = useState("business"); // "business" | "ca"
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFlow, setModalFlow] = useState("choose"); // pre-select flow

  function openModal(flow = "choose") {
    setModalFlow(flow);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-cs-50">
      {/* ── NAV ── */}
      <nav className="h-14 bg-white border-b border-cs-100 flex items-center justify-between px-8 sticky top-0 z-40">
        <span className="font-extrabold text-cs-900 text-lg tracking-tight">ComplianceOS</span>

        <div className="hidden md:flex items-center gap-8 text-cs-500 text-sm font-medium">
          <a className="hover:text-cs-900 cursor-pointer">Features</a>
          <a className="hover:text-cs-900 cursor-pointer">How it Works</a>
          <a className="hover:text-cs-900 cursor-pointer">Pricing</a>

          {/* Role toggle pill */}
          <div className="flex items-center bg-cs-100 rounded-full p-0.5 text-xs font-bold gap-0">
            <button
              onClick={() => setViewAs("business")}
              className={`px-3 py-1.5 rounded-full transition-all ${viewAs === "business" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"
                }`}
            >
              Business
            </button>
            <button
              onClick={() => setViewAs("ca")}
              className={`px-3 py-1.5 rounded-full transition-all ${viewAs === "ca" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"
                }`}
            >
              I'm a CA
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal(viewAs === "ca" ? "ca" : "choose")}
            className="text-cs-600 text-sm font-semibold hover:text-cs-900 transition-colors"
          >
            Log In
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => viewAs === "ca" ? openModal("ca") : navigate("/onboarding")}
          >
            {viewAs === "ca" ? "CA Sign Up" : "Get Started"}
          </Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-cs-900 text-cs-50 text-center px-6 py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewAs}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {viewAs === "ca" ? (
              <>
                <span className="inline-block bg-violet-900/60 text-violet-200 text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-6 uppercase border border-violet-700">
                  For Chartered Accountants
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mx-auto max-w-4xl mb-6">
                  One dashboard.<br className="hidden md:block" /> Every client sorted.
                </h1>
                <p className="text-cs-300 text-lg max-w-xl mx-auto mb-10">
                  See compliance calendars, approve filings, and catch deadlines across all your clients — without a single spreadsheet.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" size="lg" onClick={() => openModal("ca")}>
                    Start 14-Day Free Trial
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="!border-cs-600 !text-cs-200 hover:!bg-cs-800"
                    onClick={() => { setToken(DEMO_USERS.ca.token); setRole(DEMO_USERS.ca.role); setUserId(DEMO_USERS.ca.userId); navigate("/ca-dashboard"); }}
                  >
                    View CA Demo
                  </Button>
                </div>
              </>
            ) : (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mx-auto max-w-5xl mb-6"
                >
                  Automate your<br className="hidden md:block" /> compliance roadmap.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="text-cs-300 text-lg max-w-xl mx-auto mb-10"
                >
                  One app for GST, Udyam, schemes, loans, and every deadline — built for India's 6 crore small businesses.
                </motion.p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button variant="secondary" size="lg" onClick={() => navigate("/onboarding")}>
                    Get Started Free
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="!border-cs-600 !text-cs-200 hover:!bg-cs-800"
                    onClick={() => openModal("business_type")}
                  >
                    Try a Demo
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mock browser preview */}
        {viewAs === "business" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-16 max-w-3xl mx-auto bg-cs-50 rounded-t-xl overflow-hidden"
          >
            <div className="flex gap-1.5 p-3 bg-cs-100">
              <span className="w-2.5 h-2.5 rounded-full bg-cs-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-cs-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-cs-300" />
            </div>
            <div className="h-48 bg-gradient-to-br from-cs-700 to-cs-400 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 w-72 rotate-[-6deg]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`bg-white rounded-lg h-16 opacity-80 ${i === 0 || i === 3 ? "col-span-2" : ""}`} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ── ROLE PICKER (mobile-friendly banner) ── */}
      <section className="bg-white border-b border-cs-100 py-4 px-6 flex items-center justify-center gap-3 md:hidden">
        <span className="text-cs-500 text-sm font-medium">I am a</span>
        <div className="flex items-center bg-cs-100 rounded-full p-0.5 text-xs font-bold">
          <button
            onClick={() => setViewAs("business")}
            className={`px-4 py-1.5 rounded-full transition-all ${viewAs === "business" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"}`}
          >
            Business
          </button>
          <button
            onClick={() => setViewAs("ca")}
            className={`px-4 py-1.5 rounded-full transition-all ${viewAs === "ca" ? "bg-white text-cs-900 shadow-sm" : "text-cs-500"}`}
          >
            CA
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-16 flex justify-center gap-12 md:gap-24 flex-wrap">
        {viewAs === "ca"
          ? [["3,000+", "CAs on platform"], ["₹4.2Cr+", "Client penalties avoided"], ["14-day", "Free trial, no card"]].map(([n, l]) => (
            <div key={n} className="text-center">
              <p className="text-4xl font-extrabold text-cs-900 tracking-tight">{n}</p>
              <p className="text-cs-500 text-sm mt-1">{l}</p>
            </div>
          ))
          : [["6.3 Cr", "MSMEs — our target"], ["128+", "Compliances covered"], ["₹43,000", "Avg savings per user/year"]].map(([n, l]) => (
            <div key={n} className="text-center">
              <p className="text-4xl font-extrabold text-cs-900 tracking-tight">{n}</p>
              <p className="text-cs-500 text-sm mt-1">{l}</p>
            </div>
          ))
        }
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 bg-cs-50 text-center">
        <p className="text-xs font-bold tracking-widest text-cs-500 uppercase mb-2">Capabilities</p>
        <h2 className="text-3xl font-bold text-cs-900 mb-12">Engineered for precision.</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-cs-100 rounded-2xl p-6"
            >
              <div className="w-9 h-9 rounded-full bg-cs-100 flex items-center justify-center text-cs-600 mb-4">
                <f.icon size={18} />
              </div>
              <h3 className="font-bold text-cs-900 text-base mb-1">{f.title}</h3>
              <p className="text-cs-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-cs-900 mb-3">
          {viewAs === "ca" ? "How CAs use ComplianceOS" : "The Implementation Path"}
        </h2>
        <p className="text-cs-400 text-sm mb-14">
          {viewAs === "ca" ? "Three steps to managing all your clients in one place." : "Three steps to operational mastery."}
        </p>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-10 justify-center">
          {(viewAs === "ca"
            ? [["1", "CONNECT", "Add clients or let them invite you — they share their full profile."], ["2", "MONITOR", "One dashboard shows every client's calendar, filings, and risk status."], ["3", "APPROVE", "Review scheme applications, annotate documents, approve filings."],]
            : [["1", "CONNECT", "Link your GST, MSME, and document sources via VEDA."], ["2", "AUTOMATE", "ARIA and SCOUT map your profile to schemes and deadlines."], ["3", "REPORT", "Generate audit-ready reports and file through PATHWAY."],]
          ).map(([num, title, desc]) => (
            <div key={num} className="flex-1 flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-cs-900 text-cs-50 flex items-center justify-center font-bold text-sm mb-4">{num}</div>
              <p className="font-bold text-cs-900 text-xs tracking-widest mb-2">{title}</p>
              <p className="text-cs-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARIA ONBOARDING CALLOUT (business only) ── */}
      {viewAs === "business" && (
        <section className="py-16 px-6 bg-gradient-to-r from-cs-900 to-cs-700 text-center">
          <div className="max-w-xl mx-auto">
            <span className="inline-block bg-white/10 text-white text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-5 border border-white/20">
              POWERED BY ARIA AI
            </span>
            <h2 className="text-2xl font-bold text-white mb-3">Registration takes 5 minutes.</h2>
            <p className="text-cs-300 text-sm mb-7">
              ARIA asks you a few simple questions in Hindi or English, builds your business profile, and shows you exactly which compliances and schemes apply — before asking you to do anything.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="secondary" size="md" onClick={() => navigate("/onboarding")}>
                Start ARIA Onboarding →
              </Button>
              <Button
                variant="outline"
                size="md"
                className="!border-white/40 !text-white hover:!bg-white/10"
                onClick={() => openModal("business_type")}
              >
                Demo first
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING ── */}
      <PricingSection viewAs={viewAs} navigate={navigate} />

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-6 bg-cs-900 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          {viewAs === "ca" ? "Ready to streamline your practice?" : "Ready to stop worrying about compliance?"}
        </h2>
        <p className="text-cs-400 text-sm mb-7 max-w-sm mx-auto">
          {viewAs === "ca"
            ? "14 days free. No card required. Manage your first client in minutes."
            : "Start free. No credit card. ARIA sets you up in 5 minutes."}
        </p>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => viewAs === "ca" ? openModal("ca") : navigate("/onboarding")}
        >
          {viewAs === "ca" ? "Start Free CA Trial" : "Get Started Free →"}
        </Button>
      </section>

      <Footer dark />

      {/* ── LOGIN MODAL ── */}
      <AnimatePresence>
        {modalOpen && (
          <LoginModal
            onClose={() => setModalOpen(false)}
            initialFlow={modalFlow}
          />
        )}
      </AnimatePresence>
    </div>
  );
}