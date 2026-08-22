import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Zap,
} from "lucide-react";

import { TrackWiseLogo } from "../components/common/TrackWiseLogo";

export function LoginPage({ onSuccess }) {
  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    isLoading: isAuthLoading,
    isPasswordRecovery,
  } = useAuth();

  // Mode: "login" | "signup" | "forgot" | "update_password"
  const [mode, setMode] = useState(isPasswordRecovery ? "update_password" : "login");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  useEffect(() => {
    if (isPasswordRecovery) {
      setMode("update_password");
    }
  }, [isPasswordRecovery]);

  // Check URL hash for recovery state
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("update_password");
    }
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError("");
    setSuccessMessage("");
    setSignupComplete(false);
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === "signup" && !fullName.trim()) {
      errs.fullName = "Please enter your full name.";
    }

    if (mode !== "update_password") {
      if (!email.trim()) {
        errs.email = "Please enter your email address.";
      } else if (!emailRegex.test(email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    if (mode === "login" || mode === "signup" || mode === "update_password") {
      if (!password) {
        errs.password = "Please enter a password.";
      } else if (password.length < 6) {
        errs.password = "Password must be at least 6 characters.";
      }
    }

    if (mode === "signup" || mode === "update_password") {
      if (password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isAuthLoading) return;

    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
        if (onSuccess) onSuccess();
      } else if (mode === "signup") {
        const result = await signUp(email.trim(), password, { fullName: fullName.trim() });
        if (result.needsEmailConfirmation) {
          setSignupComplete(true);
          setSuccessMessage(
            "Your TrackWise account has been created. Please verify your email before signing in."
          );
        } else {
          if (onSuccess) onSuccess();
        }
      } else if (mode === "forgot") {
        await resetPassword(email.trim());
        setSuccessMessage("Password reset link sent. Please check your email inbox.");
      } else if (mode === "update_password") {
        await updatePassword(password);
        setSuccessMessage("Password updated successfully! You can now sign in.");
        setTimeout(() => switchMode("login"), 2000);
      }
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isSubmitting) return;
    setServerError("");
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setServerError(err.message || "Google sign-in could not be completed.");
      setIsGoogleLoading(false);
    }
  };

  const isFormBusy = isSubmitting || isAuthLoading || isGoogleLoading;

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
              <span>TRACKWISE // AI RESEARCH & COMPETITOR TRACKING</span>
            </div>

            <div className="pt-2">
              <TrackWiseLogo size="xl" showTagline={true} />
            </div>

            <blockquote className="text-sm text-slate-400 italic border-l-2 border-[#7C2CFF] pl-3 py-1 font-sans">
              "Track the signals that matter. Research smarter. Monitor competitors. Act earlier."
            </blockquote>
          </div>

          {/* Key Value Pillars */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-5 h-5 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Autonomous Surveillance & Competitor Tracking</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-5 h-5 rounded-lg bg-[#7C2CFF]/15 border border-[#7C2CFF]/30 flex items-center justify-center text-[#A855F7] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Stateful Multi-Agent LangGraph Orchestration</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="w-5 h-5 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Secure Production Supabase Authentication</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Auth Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#0D0F16] rounded-3xl p-7 sm:p-9 border border-[#1A1F2C] shadow-2xl relative">
            <div className="space-y-2 mb-6">
              <div className="lg:hidden pb-3 mb-2 border-b border-[#1A1F2C]">
                <TrackWiseLogo size="md" showTagline={true} />
              </div>

              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A855F7]">
                {mode === "login" && "Enterprise Access"}
                {mode === "signup" && "New Analyst Registration"}
                {mode === "forgot" && "Account Recovery"}
                {mode === "update_password" && "Security Reset"}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {mode === "login" && "Welcome back to TrackWise"}
                {mode === "signup" && "Create your TrackWise Account"}
                {mode === "forgot" && "Reset your password"}
                {mode === "update_password" && "Set new password"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                {mode === "login" && "Research smarter. Monitor competitors. Act earlier."}
                {mode === "signup" && "Start discovering intelligence and tracking competitors."}
                {mode === "forgot" && "Enter your email to receive a password recovery link."}
                {mode === "update_password" && "Enter a new secure password for your account."}
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{serverError}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Email Confirmation Notice (Sign Up Completed) */}
            {signupComplete ? (
              <div className="space-y-5 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Check your email</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your TrackWise account has been created. Please verify your email address to complete registration and sign in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="w-full py-3 px-4 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Full Name Field (Signup Mode only) */}
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                        }}
                        placeholder="Alex Vance"
                        className={`w-full bg-[#07080D] border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans ${
                          errors.fullName
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#1A1F2C] focus:border-[#7C2CFF]"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[11px] text-red-400 font-sans pl-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                {mode !== "update_password" && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Email Address
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
                        placeholder="analyst@trackwise.ai"
                        className={`w-full bg-[#07080D] border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#1A1F2C] focus:border-[#7C2CFF]"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-400 font-sans pl-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                {(mode === "login" || mode === "signup" || mode === "update_password") && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
                      >
                        {mode === "update_password" ? "New Password" : "Password"}
                      </label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                        placeholder="••••••••"
                        className={`w-full bg-[#07080D] border rounded-xl py-3 pl-10 pr-11 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#1A1F2C] focus:border-[#7C2CFF]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] text-red-400 font-sans pl-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password Field (Signup or Update Password) */}
                {(mode === "signup" || mode === "update_password") && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                        }}
                        placeholder="••••••••"
                        className={`w-full bg-[#07080D] border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans ${
                          errors.confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : "border-[#1A1F2C] focus:border-[#7C2CFF]"
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-400 font-sans pl-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isFormBusy}
                    className={`w-full py-3.5 px-5 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                      isFormBusy
                        ? "bg-[#240047]/60 text-purple-300 cursor-not-allowed border border-purple-500/30"
                        : "bg-gradient-to-r from-[#7C2CFF] to-purple-600 hover:from-purple-500 hover:to-[#7C2CFF] text-white shadow-nexus-glow hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>
                          {mode === "login" && "Signing you in..."}
                          {mode === "signup" && "Creating your account..."}
                          {mode === "forgot" && "Sending reset link..."}
                          {mode === "update_password" && "Updating password..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === "login" && "Sign In"}
                          {mode === "signup" && "Create Account"}
                          {mode === "forgot" && "Send Reset Link"}
                          {mode === "update_password" && "Update Password"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Google OAuth Section (Login and Signup Modes) */}
                {(mode === "login" || mode === "signup") && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="h-px bg-[#1A1F2C] flex-1" />
                      <span className="text-[11px] font-mono text-slate-500 uppercase">Or continue with</span>
                      <div className="h-px bg-[#1A1F2C] flex-1" />
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isFormBusy}
                      className="w-full py-3 px-4 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    >
                      {isGoogleLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                          <span>Connecting to Google...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Continue with Google</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Mode Switchers */}
                <div className="pt-3 text-center text-xs text-slate-400">
                  {mode === "login" && (
                    <p>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("signup")}
                        className="text-purple-400 hover:text-purple-300 font-semibold underline-offset-2 hover:underline transition-colors"
                      >
                        Create account
                      </button>
                    </p>
                  )}

                  {mode === "signup" && (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="text-purple-400 hover:text-purple-300 font-semibold underline-offset-2 hover:underline transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  )}

                  {mode === "forgot" && (
                    <p>
                      Remember your password?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="text-purple-400 hover:text-purple-300 font-semibold underline-offset-2 hover:underline transition-colors"
                      >
                        Back to sign in
                      </button>
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* Security Footer */}
            <div className="mt-6 pt-4 border-t border-[#1A1F2C] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Supabase Auth Protected
              </span>
              <span>256-bit TLS Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
