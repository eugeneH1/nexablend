import type { ModuleKey } from "./entitlements";

export function requireModule<TCtx extends { entitlements: Set<ModuleKey> }>(
  m: ModuleKey,
  fn: (ctx: TCtx) => Promise<Response>
) {
  return async (ctx: TCtx) => {
    if (!ctx.entitlements.has(m)) {
      return new Response("Forbidden", { status: 403 });
    }
    return fn(ctx);
  };
}

