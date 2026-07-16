import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, ExternalLink, Loader2, ShieldCheck, Trash2, RefreshCw, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type OAuthGrant = {
  client: { id: string; name: string; uri?: string; logo_uri?: string };
  scopes: string[];
  granted_at: string;
};

type OAuthNs = {
  listGrants: () => Promise<{ data: OAuthGrant[] | null; error: { message: string } | null }>;
  revokeGrant: (opts: { clientId: string }) => Promise<{ error: { message: string } | null }>;
};
const oauthNs = () => (supabase.auth as unknown as { oauth: OAuthNs }).oauth;

const MCP_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/mcp`;

export default function SettingsMcp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [grants, setGrants] = useState<OAuthGrant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      navigate("/login?next=" + encodeURIComponent("/settings/mcp"), { replace: true });
      return;
    }
    setEmail(sess.session.user.email ?? null);
    try {
      const { data, error } = await oauthNs().listGrants();
      if (error) throw new Error(error.message);
      setGrants(data ?? []);
    } catch (e) {
      setError((e as Error).message);
      setGrants([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function revoke(clientId: string, name: string) {
    if (!confirm(`Disconnect "${name}"? This app will lose access to your Bharat AI account.`)) return;
    setRevoking(clientId);
    const { error } = await oauthNs().revokeGrant({ clientId });
    setRevoking(null);
    if (error) {
      toast({ title: "Could not disconnect", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Disconnected", description: `${name} can no longer act as you.` });
    load();
  }

  async function copyEndpoint() {
    await navigator.clipboard.writeText(MCP_ENDPOINT);
    toast({ title: "Copied MCP endpoint" });
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-heading">
              <Link to="/" className="hover:text-primary">← Home</Link>
            </p>
            <h1 className="text-2xl font-heading font-bold mt-1">MCP & Agent Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage which AI assistants can act as you through Bharat AI's MCP server.
            </p>
          </div>
          {email && (
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          )}
        </header>

        {email && (
          <p className="text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{email}</span>
          </p>
        )}

        {/* Endpoint card */}
        <section className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-semibold text-sm">MCP Server Endpoint</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Paste this URL into ChatGPT, Claude, Cursor, or any MCP-compatible client.
            OAuth sign-in is required.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[11px] sm:text-xs bg-muted rounded-lg px-3 py-2 break-all font-mono">
              {MCP_ENDPOINT}
            </code>
            <button
              onClick={copyEndpoint}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
              aria-label="Copy endpoint"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-4 mt-3 text-[11px] text-muted-foreground">
            <span>Auth: OAuth 2.1</span>
            <span>•</span>
            <span>Tool: <code className="font-mono">ask_fasal_doctor</code></span>
          </div>
        </section>

        {/* Connected clients */}
        <section className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-sm">Connected Apps</h2>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          )}

          {!loading && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && grants && grants.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              No apps are connected yet. Paste the MCP endpoint above into an MCP client to connect one.
            </p>
          )}

          {!loading && grants && grants.length > 0 && (
            <ul className="divide-y divide-border">
              {grants.map((g) => (
                <li key={g.client.id} className="py-3 flex items-start gap-3">
                  {g.client.logo_uri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.client.logo_uri}
                      alt=""
                      className="h-8 w-8 rounded-lg bg-muted object-contain"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {g.client.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{g.client.name}</p>
                      {g.client.uri && (
                        <a
                          href={g.client.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Connected {new Date(g.granted_at).toLocaleDateString()} ·{" "}
                      {g.scopes.length > 0 ? g.scopes.join(", ") : "identity + tools"}
                    </p>
                  </div>
                  <button
                    onClick={() => revoke(g.client.id, g.client.name)}
                    disabled={revoking === g.client.id}
                    className="flex items-center gap-1 text-xs text-destructive hover:opacity-80 disabled:opacity-50"
                  >
                    {revoking === g.client.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Disconnect
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="text-[11px] text-muted-foreground mt-4">
            To reconnect a disconnected app, open it again and start a fresh MCP connection —
            you'll be redirected here to approve access.
          </p>
        </section>
      </div>
    </main>
  );
}
