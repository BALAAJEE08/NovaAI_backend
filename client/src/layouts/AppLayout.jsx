import { Bot, LayoutDashboard, LogOut, Menu, MessageSquare, Moon, Settings, Sun, User, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const links = [
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings }
];

export const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/");
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-ink p-4 text-white">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-nova-600 text-white"><Bot className="h-6 w-6" /></div>
        <div><p className="text-xl font-black">Nova AI</p><p className="text-xs text-slate-400">{user?.email}</p></div>
      </div>
      <nav className="mt-8 flex-1 space-y-1">
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${isActive ? "bg-nova-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
            <item.icon className="h-4 w-4" /> {item.label}
          </NavLink>
        ))}
      </nav>
      <button className="btn-secondary border-white/10 bg-white/5 text-white hover:bg-white/10" type="button" onClick={signOut}><LogOut className="h-4 w-4" /> Logout</button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f7f8fb_0%,#eef6ff_54%,#f5f0ff_100%)] dark:bg-[linear-gradient(135deg,#101216_0%,#172033_58%,#111827_100%)]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-label="Close menu" /><div className="relative h-full">{sidebar}</div></div>}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink/85">
          <div className="flex items-center gap-3">
            <button className="btn-secondary !p-2 lg:hidden" type="button" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <div className="min-w-0"><p className="truncate text-sm font-black text-slate-950 dark:text-white">{user?.name}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">AI workspace ready</p></div>
            <button className="btn-secondary !p-2 ml-auto" type="button" onClick={toggleTheme} aria-label="Toggle theme">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <button className="btn-secondary !p-2 lg:hidden" type="button" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8"><Outlet /></main>
      </div>
    </div>
  );
};
