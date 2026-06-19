import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FormField } from "../components/FormField.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api, getErrorMessage } from "../services/api.js";

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  useEffect(() => { api.get("/dashboard").then(({ data }) => setStats(data)).catch(() => {}); }, []);

  const submitProfile = async (event) => {
    event.preventDefault();
    const { data } = await api.put("/users/profile", form);
    updateUser(data.user);
    toast.success("Profile updated");
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    try {
      await api.put("/users/password", password);
      setPassword({ currentPassword: "", newPassword: "" });
      toast.success("Password changed");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" description="Update your profile, avatar, password, and view personal statistics." />
      <div className="grid gap-4 md:grid-cols-2"><StatCard label="Chats" value={stats.totalChats} /><StatCard label="Messages" value={stats.totalMessages} /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-lg p-5">
          <h2 className="mb-4 font-black text-slate-950 dark:text-white">Profile</h2>
          <form className="space-y-4" onSubmit={submitProfile}>
            <FormField label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="Avatar URL"><input className="input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} /></FormField>
            <button className="btn-primary" type="submit">Update Profile</button>
          </form>
        </section>
        <section className="glass-panel rounded-lg p-5">
          <h2 className="mb-4 font-black text-slate-950 dark:text-white">Change Password</h2>
          <form className="space-y-4" onSubmit={submitPassword}>
            <FormField label="Current Password"><input className="input" type="password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} required /></FormField>
            <FormField label="New Password"><input className="input" type="password" minLength={8} value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} required /></FormField>
            <button className="btn-primary" type="submit">Change Password</button>
          </form>
        </section>
      </div>
    </>
  );
};
