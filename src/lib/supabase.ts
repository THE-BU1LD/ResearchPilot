import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type MockUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type MockSession = {
  user: MockUser;
};

const SESSION_KEY = "__research_muse_mock_session__";
const PROJECT_KEY = "__research_muse_mock_project_states__";
const SIGNED_OUT_KEY = "__research_muse_mock_signed_out__";

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getStoredSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  const session = safeJsonParse<MockSession | null>(window.localStorage.getItem(SESSION_KEY), null);
  if (session?.user) return session;
  if (window.localStorage.getItem(SIGNED_OUT_KEY) === "1") return null;
  return { user: makeMockUser() };
}

function setStoredSession(session: MockSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.localStorage.removeItem(SIGNED_OUT_KEY);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.setItem(SIGNED_OUT_KEY, "1");
  }
}

function makeMockUser(email?: string, fullName?: string): MockUser {
  const cleanEmail = (email || "demo@researchmuse.local").trim();
  return {
    id: `mock_${cleanEmail.replace(/[^a-z0-9]/gi, "_") || "user"}`,
    email: cleanEmail,
    user_metadata: {
      full_name: fullName || cleanEmail.split("@")[0] || "Demo User",
    },
  };
}

function projectStore() {
  if (typeof window === "undefined") return [];
  return safeJsonParse<any[]>(window.localStorage.getItem(PROJECT_KEY), []);
}

function saveProjectStore(rows: any[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECT_KEY, JSON.stringify(rows));
}

function createMockTable(table: string) {
  const filters: Record<string, any> = {};
  return {
    select() {
      return this;
    },
    eq(column: string, value: any) {
      filters[column] = value;
      return this;
    },
    maybeSingle: async () => {
      const rows = projectStore().filter((row) =>
        Object.entries(filters).every(([k, v]) => row?.[k] === v)
      );
      if (rows.length === 0) return { data: null, error: null };
      return { data: rows[0], error: null };
    },
    upsert: async (payload: any[]) => {
      if (table !== "project_states") return { data: null, error: null };
      const rows = projectStore();
      for (const entry of payload || []) {
        const idx = rows.findIndex(
          (row) => row.user_id === entry.user_id && row.project_id === entry.project_id
        );
        const next = idx >= 0 ? { ...rows[idx], ...entry } : entry;
        if (idx >= 0) rows[idx] = next;
        else rows.push(next);
      }
      saveProjectStore(rows);
      return { data: payload, error: null };
    },
  };
}

function createMockSupabase() {
  const listeners = new Set<(event: string, session: MockSession | null) => void>();

  return {
    auth: {
      getUser: async () => {
        const session = getStoredSession();
        return { data: { user: session?.user ?? null }, error: null };
      },
      onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
        listeners.add(callback);
        const session = getStoredSession();
        setTimeout(() => callback("INITIAL_SESSION", session), 0);
        return {
          data: { subscription: { unsubscribe: () => listeners.delete(callback) } },
          subscription: { unsubscribe: () => listeners.delete(callback) },
        } as any;
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const user = makeMockUser(email);
        const session = { user };
        setStoredSession(session);
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user, session }, error: null };
      },
      signUp: async ({ email, options }: { email: string; options?: { data?: any } }) => {
        const user = makeMockUser(email, options?.data?.full_name);
        const session = { user };
        setStoredSession(session);
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { user, session }, error: null };
      },
      signInWithOAuth: async ({ provider }: { provider: string }) => {
        const user = makeMockUser(`${provider}@oauth.local`, provider);
        const session = { user };
        setStoredSession(session);
        listeners.forEach((cb) => cb("SIGNED_IN", session));
        return { data: { provider, session }, error: null };
      },
      signOut: async () => {
        setStoredSession(null);
        listeners.forEach((cb) => cb("SIGNED_OUT", null));
        return { error: null };
      },
    },
    from: (table: string) => createMockTable(table),
    functions: {
      invoke: async () => ({
        data: null,
        error: new Error("Supabase functions are not configured in this local demo build."),
      }),
    },
  } as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();
