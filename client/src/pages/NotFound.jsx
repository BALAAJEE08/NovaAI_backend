import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="grid min-h-screen place-items-center bg-ink px-4 text-white">
    <div className="glass-panel max-w-md rounded-lg p-8 text-center">
      <h1 className="text-4xl font-black">404</h1>
      <p className="mt-2 text-slate-300">Page not found.</p>
      <Link className="btn-primary mt-6" to="/chat">Go to Chat</Link>
    </div>
  </div>
);
