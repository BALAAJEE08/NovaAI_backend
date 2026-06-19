import { Archive, Bot, Copy, Edit3, Heart, MessageSquarePlus, RefreshCw, Search, Send, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MarkdownMessage } from "../components/MarkdownMessage.jsx";
import { api, getErrorMessage } from "../services/api.js";
import { shortDate, titleCase } from "../utils/formatters.js";

const modes = [
  ["general", "General Chat"],
  ["coding", "Coding Assistant"],
  ["bug-fix", "Bug Fix"],
  ["writing", "Content Writing"],
  ["resume", "Resume Review"],
  ["interview", "Interview Prep"],
  ["career", "Career Guidance"]
];

export const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("general");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const activeConversation = useMemo(() => conversations.find((item) => item._id === activeId), [conversations, activeId]);

  const loadConversations = async () => {
    const { data } = await api.get(`/conversations?archived=false${search ? `&search=${encodeURIComponent(search)}` : ""}`);
    setConversations(data);
    if (!activeId && data[0]) setActiveId(data[0]._id);
  };

  const loadMessages = async (id) => {
    if (!id) return;
    const { data } = await api.get(`/conversations/${id}`);
    setMessages(data.messages);
    setMode(data.conversation.mode);
  };

  useEffect(() => { loadConversations().catch(() => {}); }, [search]);
  useEffect(() => { loadMessages(activeId).catch(() => {}); }, [activeId]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const createChat = async () => {
    const { data } = await api.post("/conversations", { title: "New Chat", mode });
    setConversations((current) => [data, ...current]);
    setActiveId(data._id);
    setMessages([]);
  };

  const updateConversation = async (id, payload) => {
    const { data } = await api.put(`/conversations/${id}`, payload);
    setConversations((current) => current.map((item) => (item._id === id ? data : item)));
  };

  const rename = async (conversation) => {
    const title = window.prompt("Rename chat", conversation.title);
    if (title) await updateConversation(conversation._id, { title });
  };

  const remove = async (id) => {
    await api.delete(`/conversations/${id}`);
    const next = conversations.filter((item) => item._id !== id);
    setConversations(next);
    setActiveId(next[0]?._id || null);
    setMessages([]);
  };

  const send = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    let conversationId = activeId;
    setLoading(true);
    setTyping(true);
    try {
      if (!conversationId) {
        const { data } = await api.post("/conversations", { title: prompt.slice(0, 48), mode });
        conversationId = data._id;
        setActiveId(data._id);
        setConversations((current) => [data, ...current]);
      } else if (activeConversation?.mode !== mode) {
        await updateConversation(conversationId, { mode });
      }

      const optimistic = { _id: `tmp-${Date.now()}`, role: "user", content: prompt, createdAt: new Date().toISOString() };
      setMessages((current) => [...current, optimistic]);
      const content = prompt;
      setPrompt("");
      const { data } = await api.post(`/messages/${conversationId}`, { content });
      setMessages((current) => [...current.filter((item) => item._id !== optimistic._id), data.userMessage, data.assistantMessage]);
      setConversations((current) => current.map((item) => (item._id === data.conversation._id ? data.conversation : item)));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setTyping(false);
      setLoading(false);
    }
  };

  const regenerate = async () => {
    if (!activeId) return;
    setTyping(true);
    try {
      const { data } = await api.post(`/messages/${activeId}/regenerate`);
      setMessages((current) => [...current, data]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setTyping(false);
    }
  };

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <div className="grid h-[calc(100vh-112px)] gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="glass-panel flex min-h-0 flex-col rounded-lg">
        <div className="border-b border-slate-200 p-3 dark:border-white/10">
          <button className="btn-primary w-full" type="button" onClick={createChat}><MessageSquarePlus className="h-4 w-4" /> New Chat</button>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {conversations.map((conversation) => (
            <button key={conversation._id} className={`mb-2 w-full rounded-lg p-3 text-left transition ${activeId === conversation._id ? "bg-nova-600 text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"}`} onClick={() => setActiveId(conversation._id)} type="button">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{conversation.title}</p>
                  <p className={`mt-1 text-xs ${activeId === conversation._id ? "text-white/75" : "text-slate-500 dark:text-slate-400"}`}>{titleCase(conversation.mode)} | {shortDate(conversation.lastMessageAt)}</p>
                </div>
                {conversation.isFavorite && <Heart className="h-4 w-4 fill-current" />}
              </div>
            </button>
          ))}
        </div>
      </aside>
      <section className="glass-panel flex min-h-0 flex-col rounded-lg">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3 dark:border-white/10">
          <select className="input max-w-48" value={mode} onChange={(e) => setMode(e.target.value)}>
            {modes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          <div className="ml-auto flex flex-wrap gap-2">
            {activeConversation && <>
              <button className="btn-secondary !p-2" onClick={() => rename(activeConversation)} type="button" aria-label="Rename"><Edit3 className="h-4 w-4" /></button>
              <button className="btn-secondary !p-2" onClick={() => updateConversation(activeConversation._id, { isFavorite: !activeConversation.isFavorite })} type="button" aria-label="Favorite"><Heart className={`h-4 w-4 ${activeConversation.isFavorite ? "fill-current text-rose-500" : ""}`} /></button>
              <button className="btn-secondary !p-2" onClick={() => updateConversation(activeConversation._id, { isArchived: true })} type="button" aria-label="Archive"><Archive className="h-4 w-4" /></button>
              <button className="btn-secondary !p-2" onClick={() => remove(activeConversation._id)} type="button" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </>}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {!messages.length && (
            <div className="mx-auto grid h-full max-w-2xl place-items-center text-center">
              <div>
                <Bot className="mx-auto h-12 w-12 text-nova-600 dark:text-nova-500" />
                <h1 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">How can Nova help?</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ask for code, writing help, bug fixes, interview practice, resume review, or career guidance.</p>
              </div>
            </div>
          )}
          <div className="mx-auto max-w-4xl space-y-5">
            {messages.map((message) => (
              <article key={message._id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-lg p-4 ${message.role === "user" ? "bg-nova-600 text-white" : "bg-white/90 text-slate-900 dark:bg-slate-950/80 dark:text-white"}`}>
                  {message.role === "assistant" ? <MarkdownMessage content={message.content} /> : <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>}
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs opacity-70">
                    <span>{shortDate(message.createdAt)}</span>
                    <button className="inline-flex items-center gap-1" type="button" onClick={() => copy(message.content)}><Copy className="h-3 w-3" /> Copy</button>
                  </div>
                </div>
              </article>
            ))}
            {typing && <div className="inline-flex rounded-lg bg-white/90 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300">Nova is typing...</div>}
            <div ref={endRef} />
          </div>
        </div>
        <form className="border-t border-slate-200 p-3 dark:border-white/10" onSubmit={send}>
          <div className="mx-auto flex max-w-4xl gap-2">
            <textarea className="input min-h-12 resize-none" rows={1} placeholder="Message Nova AI..." value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) send(e); }} />
            <button className="btn-secondary !px-3" type="button" onClick={regenerate} disabled={!activeId || typing}><RefreshCw className="h-4 w-4" /></button>
            <button className="btn-primary !px-3" type="submit" disabled={loading}><Send className="h-4 w-4" /></button>
          </div>
        </form>
      </section>
    </div>
  );
};
