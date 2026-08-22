import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // Normalize user object across Supabase & backend
  const formatUser = (supabaseUser) => {
    if (!supabaseUser) return null;
    const meta = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name:
        meta.full_name ||
        meta.name ||
        supabaseUser.email?.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
        "Intelligence Analyst",
      avatar_url: meta.avatar_url || meta.picture || null,
      role: meta.role || "Analyst",
      workspace_name: meta.workspace_name || "TrackWise Workspace",
      is_active: true,
      raw: supabaseUser,
    };
  };

  // Sync token to API client
  const syncSessionToken = (activeSession) => {
    if (activeSession?.access_token) {
      api.setAuthToken(activeSession.access_token);
    } else {
      api.setAuthToken(null);
    }
  };

  // Initialize and listen to Supabase auth events
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session: initialSession }, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError) {
            console.warn("[AuthContext] Session fetch error:", sessionError.message);
          }

          if (isMounted) {
            if (initialSession) {
              setSession(initialSession);
              setUser(formatUser(initialSession.user));
              syncSessionToken(initialSession);
            } else {
              setSession(null);
              setUser(null);
              syncSessionToken(null);
            }
          }
        } else {
          console.warn("[AuthContext] Supabase not configured. Running in unauthenticated mode.");
          if (isMounted) {
            setSession(null);
            setUser(null);
            syncSessionToken(null);
          }
        }
      } catch (err) {
        console.error("[AuthContext] Auth initialization failed:", err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    // Subscribe to real-time auth state changes
    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;

        console.log(`[AuthContext] Supabase Auth Event: ${event}`);

        if (event === "PASSWORD_RECOVERY") {
          setIsPasswordRecovery(true);
        }

        if (newSession) {
          setSession(newSession);
          setUser(formatUser(newSession.user));
          syncSessionToken(newSession);
        } else {
          setSession(null);
          setUser(null);
          syncSessionToken(null);
        }

        setIsLoading(false);
      });
      subscription = data?.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  /**
   * Real Supabase Email + Password Sign In
   */
  const signIn = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Please check environment variables.");
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data?.session) {
        setSession(data.session);
        setUser(formatUser(data.user));
        syncSessionToken(data.session);
        return data.user;
      }
      throw new Error("Unable to sign in. Please verify your credentials.");
    } catch (err) {
      let friendlyMessage = "Unable to sign in. Please check your email and password.";
      if (err.message?.includes("Email not confirmed")) {
        friendlyMessage = "Your email address has not been confirmed. Please check your inbox for the verification email.";
      } else if (err.message?.includes("Invalid login credentials")) {
        friendlyMessage = "Invalid email or password. Please check your credentials.";
      } else if (err.message?.includes("Rate limit")) {
        friendlyMessage = "Too many failed login attempts. Please wait a moment and try again.";
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Real Supabase Email Sign Up with user metadata
   */
  const signUp = useCallback(async (email, password, { fullName } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Please check environment variables.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      const redirectUrl = typeof window !== "undefined" ? window.location.origin : undefined;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName?.trim() || normalizedEmail.split("@")[0],
            workspace_name: `${fullName?.trim() || "Analyst"}'s Workspace`,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if session was created immediately or confirmation is required
      if (data?.session) {
        setSession(data.session);
        setUser(formatUser(data.user));
        syncSessionToken(data.session);
      }

      return {
        user: data.user,
        session: data.session,
        needsEmailConfirmation: !data.session && Boolean(data.user && !data.user.confirmed_at),
      };
    } catch (err) {
      let friendlyMessage = err.message || "Failed to create account. Please try again.";
      if (err.message?.includes("User already registered")) {
        friendlyMessage = "An account with this email already exists. Please sign in instead.";
      } else if (err.message?.includes("Password should be")) {
        friendlyMessage = "Password is too weak. Please use at least 6 characters with letters and numbers.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Real Supabase Google OAuth Sign In
   */
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Please check environment variables.");
      }

      const redirectUrl = typeof window !== "undefined" ? window.location.origin : undefined;

      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (googleError) {
        throw googleError;
      }

      return data;
    } catch (err) {
      const msg = err.message || "Google authentication failed. Please try again.";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  /**
   * Real Supabase Password Reset Request (Forgot Password)
   */
  const resetPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured.");
      }

      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/#recovery` : undefined;

      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        throw resetError;
      }

      return data;
    } catch (err) {
      const msg = err.message || "Unable to send password reset link. Please verify the email address.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update Password after recovery
   */
  const updatePassword = useCallback(async (newPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setIsPasswordRecovery(false);
      return data;
    } catch (err) {
      const msg = err.message || "Failed to update password. Please try again.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update User Profile (Name, Avatar, Workspace)
   */
  const updateProfile = useCallback(async ({ name, avatar_url, workspace_name }) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured() && session) {
        const { data, error: updateError } = await supabase.auth.updateUser({
          data: {
            full_name: name,
            avatar_url: avatar_url,
            workspace_name: workspace_name,
          },
        });
        if (updateError) throw updateError;
        if (data?.user) {
          setUser(formatUser(data.user));
        }
      } else {
        setUser((prev) => ({
          ...prev,
          name: name || prev?.name,
          avatar_url: avatar_url !== undefined ? avatar_url : prev?.avatar_url,
          workspace_name: workspace_name || prev?.workspace_name,
        }));
      }
      return true;
    } catch (err) {
      const msg = err.message || "Failed to update profile.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [session]);



  /**
   * Real Supabase Sign Out
   */
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      await api.logout();
    } catch (err) {
      console.warn("[AuthContext] Logout error:", err);
    } finally {
      setSession(null);
      setUser(null);
      setError(null);
      syncSessionToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    session,
    isLoading,
    loading: isLoading,
    isAuthenticated: Boolean(user && session),
    error,
    isPasswordRecovery,
    setIsPasswordRecovery,
    login: signIn, // backward compatibility alias
    signIn,
    signUp,
    signInWithGoogle,
    logout: signOut, // backward compatibility alias
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
