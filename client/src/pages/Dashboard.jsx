import { Archive, Heart, MessageSquare, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { api } from "../services/api.js";
import { shortDate, titleCase } from "../utils/formatters.js";

export const Dashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard").then(({ data }) => setData(data)).catch(() => setData({ totalChats: 0, totalMessages: 0, favoriteChats: 0, archivedChats: 0, recentConversations: [] })); }, []);
  if (!data) return <LoadingSkeleton rows={5} />;
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Dashboard" description="Track your AI usage, favorite chats, archived chats, and recent conversations." actions={<Link className="btn-primary" to="/chat">Open Chat</Link>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Chats" value={data.totalChats} icon={MessageSquare} />
        <StatCard label="Messages" value={data.totalMessages} icon={MessagesSquare} tone="bg-mint/15 text-green-600" />
        <StatCard label="Favorites" value={data.favoriteChats} icon={Heart} tone="bg-rose-500/15 text-rose-500" />
        <StatCard label="Archived" value={data.archivedChats} icon={Archive} tone="bg-violet/15 text-violet" />
      </div>
      <section className="glass-panel mt-6 rounded-lg p-5">
        <h2 className="text-lg font-black text-slate-950 dark:text-white">Recent Conversations</h2>
        <div className="mt-4 space-y-3">
          {data.recentConversations.length ? data.recentConversations.map((conversation) => (
            <Link className="block rounded-lg bg-white/70 p-4 transition hover:bg-white dark:bg-slate-950/60 dark:hover:bg-slate-950" to="/chat" key={conversation._id}>
              <p className="font-bold text-slate-950 dark:text-white">{conversation.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{titleCase(conversation.mode)} | {shortDate(conversation.lastMessageAt)}</p>
            </Link>
          )) : <p className="text-sm text-slate-500 dark:text-slate-400">No conversations yet.</p>}
        </div>
      </section>
    </>
  );
};
