import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthScreen } from "./Login.jsx";

export const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); await register(form); navigate("/chat"); };
  return (
    <AuthScreen title="Create account" subtitle="Build your personal AI workspace.">
      <form className="space-y-4" onSubmit={submit}>
        <FormField label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Email"><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></FormField>
        <FormField label="Password"><input className="input" type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></FormField>
        <FormField label="Avatar URL"><input className="input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} /></FormField>
        <button className="btn-primary w-full" disabled={loading} type="submit">Create Account</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-300">Already registered? <Link className="font-bold text-nova-500" to="/login">Sign in</Link></p>
    </AuthScreen>
  );
};
