import React, { useState, useEffect } from "react";
import { X, User, Mail, Shield, Building, Calendar, Key, CheckCircle2, Edit3, Save, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [workspaceName, setWorkspaceName] = useState(user?.workspace_name || "Primary Intelligence Desk");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarUrl(user.avatar_url || "");
      setWorkspaceName(user.workspace_name || "Primary Intelligence Desk");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ message: "", type: "" });

    try {
      if (updateProfile) {
        await updateProfile({
          name: name.trim(),
          avatar_url: avatarUrl.trim() || null,
          workspace_name: workspaceName.trim(),
        });
      }
      setFeedback({ message: "Profile updated successfully.", type: "success" });
      setIsEditing(false);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to update profile.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#0D0F16] border border-[#1A1F2C] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden space-y-5 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1F2C] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#240047] border border-purple-500/40 flex items-center justify-center text-purple-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Analyst Profile</h2>
              <p className="text-xs text-slate-400">TrackWise Intelligence Platform Identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#121520] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              feedback.type === "success"
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/70 border-red-500/40 text-red-300"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* User Card */}
        <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {avatarUrl || user?.avatar_url ? (
              <img
                src={avatarUrl || user?.avatar_url}
                alt={user?.name || "User"}
                className="w-14 h-14 rounded-2xl border-2 border-[#7C2CFF]/50 object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#240047] to-[#7C2CFF]/40 border-2 border-purple-500/40 flex items-center justify-center text-xl font-mono font-bold text-white shrink-0">
                {name ? name[0].toUpperCase() : "A"}
              </div>
            )}

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">{user?.name || "Intelligence Analyst"}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  ACTIVE
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{user?.email || "analyst@trackwise.ai"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span className="hidden sm:inline">{isEditing ? "View" : "Edit"}</span>
          </button>
        </div>

        {/* Edit Form or Details Grid */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Analyst Full Name"
                className="w-full bg-[#07080D] border border-[#1A1F2C] rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#7C2CFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Avatar URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#07080D] border border-[#1A1F2C] rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#7C2CFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Workspace Desk Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Desk Name"
                className="w-full bg-[#07080D] border border-[#1A1F2C] rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#7C2CFF]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#07080D] rounded-xl border border-[#1A1F2C] space-y-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Building className="w-3 h-3 text-[#00D9FF]" />
                <span>Workspace Desk</span>
              </div>
              <div className="font-semibold text-slate-200 truncate">{workspaceName}</div>
            </div>

            <div className="p-3 bg-[#07080D] rounded-xl border border-[#1A1F2C] space-y-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Auth Provider</span>
              </div>
              <div className="font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Supabase Auth</span>
              </div>
            </div>

            <div className="p-3 bg-[#07080D] rounded-xl border border-[#1A1F2C] space-y-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Key className="w-3 h-3 text-purple-400" />
                <span>User Identifier</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 truncate">{user?.id || "usr_session_active"}</div>
            </div>

            <div className="p-3 bg-[#07080D] rounded-xl border border-[#1A1F2C] space-y-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Session Security</span>
              </div>
              <div className="font-semibold text-slate-200">256-bit TLS Verified</div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        {!isEditing && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-semibold text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
