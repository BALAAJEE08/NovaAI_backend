import { ArrowRight, Bot, Code2, FileText, MessageSquareText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-ink text-white">
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#476fe6_0%,transparent_34%),linear-gradient(135deg,#101216_0%,#172033_50%,#111827_100%)]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
          <Link className="flex items-center gap-3" to="/"><span className="grid h-11 w-11 place-items-center rounded-lg bg-nova-600"><Bot className="h-6 w-6" /></span><span className="text-xl font-black">Nova AI</span></Link>
          <Link className="btn-primary" to={isAuthenticated ? "/chat" : "/login"}>Open App <ArrowRight className="h-4 w-4" /></Link>
        </nav>
        <div className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl content-center px-4 pb-16 md:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-5xl font-black leading-tight md:text-7xl">Nova AI</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">A production-ready AI chat workspace for general chat, coding, debugging, writing, resume review, interview preparation, and career guidance.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" to="/register">Start Chatting</Link><Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20" to="/login">Sign In</Link></div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-4 md:grid-cols-4 md:px-8">
            {[{ icon: MessageSquareText, label: "Multiple chats" }, { icon: Code2, label: "Code highlighting" }, { icon: FileText, label: "Export history" }, { icon: Sparkles, label: "Gemini powered" }].map((item) => <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"><item.icon className="h-5 w-5 text-nova-500" /><p className="mt-2 font-bold">{item.label}</p></div>)}
          </div>
        </div>
      </section>
    </div>
  );
};
