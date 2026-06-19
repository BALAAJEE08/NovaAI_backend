import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import { FormField } from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const AuthScreen = ({ title, subtitle, children }) => (
  <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#101216,#172033,#111827)] px-4 py-10">
    <div className="glass-panel w-full max-w-md rounded-lg p-6">
      <Link className="mb-6 flex items-center gap-3" to="/"><span className="grid h-11 w-11 place-items-center rounded-lg bg-nova-600 text-white"><Bot className="h-6 w-6" /></span><span className="text-xl font-black text-white">Nova AI</span></Link>
      <h1 className="text-2xl font-black text-white">{title}</h1>
      <p className="mb-6 mt-2 text-sm text-slate-300">{subtitle}</p>
      {children}
    </div>
  </div>
);

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); await login(form); navigate("/chat"); };
  return (
    <AuthScreen title="Welcome back" subtitle="Continue your AI conversations.">
      <form className="space-y-4" onSubmit={submit}>
        <FormField label="Email"><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></FormField>
        <FormField label="Password"><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></FormField>
        <button className="btn-primary w-full" disabled={loading} type="submit">Sign In</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-300">New to Nova? <Link className="font-bold text-nova-500" to="/register">Create account</Link></p>
    </AuthScreen>
  );
};
