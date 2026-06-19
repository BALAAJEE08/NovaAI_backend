import { Download, Moon, Sun, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { api, getErrorMessage } from "../services/api.js";

export const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const exportHistory = async () => {
    const { data } = await api.get("/users/export");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nova-ai-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete your account and all chats?")) return;
    try {
      await api.delete("/users/account");
      logout();
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader eyebrow="Preferences" title="Settings" description="Switch themes, export your chat history, or delete your account." />
      <div className="grid gap-4 lg:grid-cols-3">
        <button className="glass-panel rounded-lg p-5 text-left" onClick={toggleTheme} type="button">
          {darkMode ? <Sun className="h-6 w-6 text-nova-500" /> : <Moon className="h-6 w-6 text-nova-600" />}
          <h2 className="mt-4 font-black text-slate-950 dark:text-white">{darkMode ? "Light Mode" : "Dark Mode"}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Toggle the Nova AI interface theme.</p>
        </button>
        <button className="glass-panel rounded-lg p-5 text-left" onClick={exportHistory} type="button">
          <Download className="h-6 w-6 text-mint" />
          <h2 className="mt-4 font-black text-slate-950 dark:text-white">Export Chat History</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Download conversations and messages as JSON.</p>
        </button>
        <button className="glass-panel rounded-lg p-5 text-left" onClick={deleteAccount} type="button">
          <Trash2 className="h-6 w-6 text-rose-500" />
          <h2 className="mt-4 font-black text-slate-950 dark:text-white">Delete Account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Permanently delete account data and chat history.</p>
        </button>
      </div>
    </>
  );
};
