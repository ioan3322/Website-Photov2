type SupabaseErrorShape = {
  message: string;
  name: string;
  status?: number;
};

const SUPABASE_JWT_PREFIX = "eyJ";
const SUPABASE_PUBLISHABLE_PREFIX = "sb_publishable_";
const SUPABASE_SECRET_PREFIX = "sb_secret_";

function createNoopError(message: string): SupabaseErrorShape {
  return {
    message,
    name: "SupabaseUnavailableError",
  };
}

function isTruthyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidSupabaseUrl(value: unknown): value is string {
  if (!isTruthyString(value)) {
    return false;
  }

  return /^https:\/\/[a-z0-9-]+\.supabase\.(?:co|in)(?:\/.*)?$/i.test(value.trim());
}

export function isValidSupabaseJwtKey(value: unknown): value is string {
  return isTruthyString(value) && value.trim().startsWith(SUPABASE_JWT_PREFIX);
}

export function isValidSupabaseAnonKey(value: unknown): value is string {
  if (!isTruthyString(value)) {
    return false;
  }

  const key = value.trim();
  return key.startsWith(SUPABASE_JWT_PREFIX) || key.startsWith(SUPABASE_PUBLISHABLE_PREFIX);
}

export function isValidSupabaseServiceRoleKey(value: unknown): value is string {
  if (!isTruthyString(value)) {
    return false;
  }

  const key = value.trim();
  return key.startsWith(SUPABASE_JWT_PREFIX) || key.startsWith(SUPABASE_SECRET_PREFIX);
}

export function readSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  return {
    url,
    anonKey,
    serviceRoleKey,
    hasValidUrl: isValidSupabaseUrl(url),
    hasValidAnonKey: isValidSupabaseAnonKey(anonKey),
    hasValidServiceRoleKey: isValidSupabaseServiceRoleKey(serviceRoleKey),
  };
}

export function resolveSupabaseKey(options: {
  preferServiceRole?: boolean;
  env?: ReturnType<typeof readSupabaseEnv>;
}) {
  const env = options.env ?? readSupabaseEnv();

  if (options.preferServiceRole && env.hasValidServiceRoleKey) {
    return env.serviceRoleKey;
  }

  if (env.hasValidAnonKey) {
    return env.anonKey;
  }

  if (env.hasValidServiceRoleKey) {
    return env.serviceRoleKey;
  }

  return null;
}

function createNoopQuery(label: string) {
  const result = {
    data: null,
    error: createNoopError(label),
  };

  let proxy: any;

  const passthrough = () => proxy;

  proxy = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") {
          return undefined;
        }

        if (prop === "single" || prop === "maybeSingle") {
          return async () => result;
        }

        if (prop === "rpc") {
          return async () => result;
        }

        return passthrough;
      },
    },
  );

  return proxy;
}

function createNoopStorageBucket(label: string) {
  const errorResult = {
    data: null,
    error: createNoopError(label),
  };

  return {
    upload: async () => errorResult,
    remove: async () => errorResult,
    list: async () => ({ data: [], error: null }),
    download: async () => errorResult,
    createSignedUrl: async () => errorResult,
    getPublicUrl: () => ({
      data: { publicUrl: "" },
    }),
  };
}

function createNoopAuth(label: string) {
  return {
    async getUser() {
      return {
        data: { user: null },
        error: createNoopError(label),
      };
    },
    async getSession() {
      return {
        data: { session: null },
        error: createNoopError(label),
      };
    },
    onAuthStateChange() {
      return {
        data: {
          subscription: {
            unsubscribe() {
              return undefined;
            },
          },
        },
        error: null,
      };
    },
    async signOut() {
      return {
        error: createNoopError(label),
      };
    },
  };
}

export function createNoopSupabaseClient(label: string) {
  const query = createNoopQuery(label);
  const storageBucket = createNoopStorageBucket(label);
  const auth = createNoopAuth(label);
  let proxyClient: Record<string, unknown>;

  const baseClient = {
    auth,
    from() {
      return query;
    },
    storage: {
      from() {
        return storageBucket;
      },
    },
    rpc: async () => ({
      data: null,
      error: createNoopError(label),
    }),
    functions: {
      invoke: async () => ({
        data: null,
        error: createNoopError(label),
      }),
    },
    channel() {
      return {
        subscribe() {
          return {
            data: {
              subscription: {
                unsubscribe() {
                  return undefined;
                },
              },
            },
            error: null,
          };
        },
      };
    },
    removeChannel: async () => ({ data: true, error: null }),
    getChannels: () => [],
  };

  proxyClient = new Proxy(baseClient as Record<string, unknown>, {
    get(target, prop) {
      if (prop in target) {
        return target[prop as keyof typeof target];
      }

      if (prop === "then") {
        return undefined;
      }

      return (..._args: unknown[]) => proxyClient;
    },
  });

  return proxyClient;
}
