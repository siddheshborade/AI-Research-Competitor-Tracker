import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Search,
} from "lucide-react";

export function LoginPage({ onSuccess }) {
  const { login, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState("analyst@nexus.ai");
  const [password, setPassword] = useState("nexus2026");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid corporate email address.";
    }

    if (!password) {
      errs.password = "Please enter your password.";
    } else if (password.length < 4) {
      errs.password = "Password must be at least 4 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isAuthLoading) return;

    setServerError("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const msg =
        err?.status === 401 || err?.status === 400
          ? "Invalid corporate email or password."
          : err?.data?.error?.message ||
            "Unable to connect to the intelligence service. Please verify server status.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || isAuthLoading;

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      {/* Subtle Ambient Lighting Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-[#7C2CFF]/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#00D9FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: TrackWise Branding & Value Prop */}
        <div className="lg:col-span-6 space-y-8 text-left py-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#240047]/60 border border-purple-500/30 text-[#A855F7] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>TRACKWISE // AGENT PLATFORM</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C2CFF] to-[#240047] flex items-center justify-center text-white font-mono font-bold text-base shadow-nexus-glow border border-purple-400/40">
                TW
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-mono">
                TrackWise
              </h1>
            </div>

            <p className="text-lg text-slate-300 font-medium leading-snug">
              AI-powered research & competitor tracking.
            </p>

            <blockquote className="text-sm text-slate-400 italic border-l-2 border-[#7C2CFF] pl-3 py-1 font-sans">
              "TrackWise helps you discover research, patents, competitor activity and market signals through autonomous AI-powered investigation."
            </blockquote>
          </div>

          {/* Key Value Pillars */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-5 h-5 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Autonomous Research & ReAct Execution</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-5 h-5 rounded-lg bg-[#7C2CFF]/15 border border-[#7C2CFF]/30 flex items-center justify-center text-[#A855F7] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Evidence-Based Multi-Source Intelligence</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-5 h-5 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Dynamic Tool Selection & Verification Gate</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#0D0F16] rounded-3xl p-7 sm:p-9 border border-[#1A1F2C] shadow-2xl relative">
            <div className="space-y-2 mb-6">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A855F7]">
                Enterprise Access
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Sign in to continue to your intelligence workspace.
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
                >
                  Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="analyst@nexus.ai"
                    className={`w-full bg-[#07080D] border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-[#1A1F2C] focus:border-[#7C2CFF] focus:ring-1 focus:ring-[#7C2CFF]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-sans pl-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="••••••••"
                    className={`w-full bg-[#07080D] border rounded-xl py-3 pl-10 pr-11 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-[#1A1F2C] focus:border-[#7C2CFF] focus:ring-1 focus:ring-[#7C2CFF]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-400 font-sans pl-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`w-full py-3.5 px-5 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isButtonDisabled
                      ? "bg-[#240047]/60 text-purple-300 cursor-not-allowed border border-purple-500/30"
                      : "bg-gradient-to-r from-[#7C2CFF] to-purple-600 hover:from-purple-500 hover:to-[#7C2CFF] text-white shadow-nexus-glow hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  {isSubmitting || isAuthLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Credentials Footer */}
            <div className="mt-6 pt-4 border-t border-[#1A1F2C] text-center">
              <span className="text-[11px] font-mono text-slate-500">
                Demo Credentials: <strong className="text-slate-400">analyst@nexus.ai</strong> / <strong className="text-slate-400">nexus2026</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
