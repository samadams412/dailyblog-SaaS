# DailyBlog Handoff

State of the codebase as of **2026-10-08**, after the audit and fixes in PR #14, plus a prioritized list of follow-up work. Nothing here contains secret values. Env var *names* only.

## 1. Current state

| Area | Version / status |
|---|---|
| Next.js | 14.2.35 (App Router). Latest is 16.x. One critical advisory remains and needs Next 15+ |
| React | 18.2 (19.x available) |
| `@supabase/ssr` | 0.12.7, cookie handlers on `getAll`/`setAll` |
| `@supabase/supabase-js` | 2.117.3 |
| Stripe | `stripe` 14.21, `@stripe/stripe-js` 3.0.10 (23.x and 10.x available) |
| Tailwind | 3.3.6 (4.x available; no fix for the remaining audit findings on 3.x) |
| Node | `engines.node` is `24.x` (Vercel discontinued 20.x) |
| Markdown | `react-markdown` 9.0.1 + `rehype-highlight` 7 |
| Hosting | Vercel project `sams-blog`, Supabase for DB/Auth, Stripe test mode |

Verified working on production after PR #14: GitHub/Google login and logout, editing blog title and body, non-admin Stripe test checkout to a premium post.

### How it fits together
- **Edit flow:** `EditForm.tsx` -> server action `updateBlogDetail` (`lib/actions/blog.ts`) -> updates `blog`, then `blog_content`, then `revalidatePath`.
- **Read flow:** `app/(home)/blog/[id]/page.tsx` fetches title/image from its own `/api/blog` route over HTTP using `PROD_URL`. The body is fetched separately in the browser by `BlogContent.tsx`, so RLS gates premium text.
- **Auth:** Supabase OAuth. `middleware.ts` guards `/dashboard/*` using `getUser()` and `user_metadata.role === "admin"`.
- **Payments:** Stripe Checkout, then the webhook at `app/api/stripe/webhook/route.ts` updates `users.subscriptions_status` through the service-role client.
- **Authorization in the DB:** RLS policies call `is_admin()`, `is_publish(id)`, `is_premium(blog_id)` and a subscription check. Policy SQL is **not in this repo**. See section 6.

### Env vars (all 9 exist in Vercel for Production, Preview, Development)
`PROD_URL`, `SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_SK_KEY`, `PRO_PRICE_ID`, `ENDPOINT_SECRET`, `SERVICE_ROLE`

## 2. Security (do these first)

| # | Item | Why | Effort |
|---|---|---|---|
| S1 | **Verify what `is_admin()` checks.** Run `select prosrc from pg_proc where proname = 'is_admin';` in the SQL editor. | The middleware reads `user_metadata.role`, which a signed-in user can change on their own account. If `is_admin()` also reads it, any user can write posts, and **that becomes stored XSS the moment MDX is enabled** (section 5). | Small |
| S2 | Move the admin role to `app_metadata` (or a `users.role` lookup) in both the middleware and `is_admin()`. | Closes S1. `app_metadata` is only writable with the service role. | Small-medium. Test login after |
| S3 | Upgrade Next to 15, then 16. | The remaining **critical** audit finding (SSRF in Server Actions, cache poisoning, DoS) has no fix on 14.x. | Large. See section 3 |
| S4 | Rotate Stripe keys, webhook secret, Supabase anon/service keys. | The Vercel env vars are about 900+ days old. | Small. Redeploy after |
| S5 | Give Preview its own Supabase project and Stripe test webhook. | Preview currently uses production's DB and `PROD_URL`, so a preview edit or checkout writes to production data. | Medium |
| S6 | Harden the Stripe webhook. | Type `req` instead of `any`; read the raw body with `await req.text()`; handle `checkout.session.completed`, `invoice.payment_failed`; make handlers idempotent. Status codes are already 400/500 as of PR #14, but that path is untested live. | Small-medium |
| S7 | Add row-count checks to `updateBlogById`, `createBlog` (second insert) and `deleteBlogById`. | Same silent-RLS-failure pattern fixed in `updateBlogDetail`. | Small |

## 3. Dependency upgrades

Run `npm outdated` and `npm audit --omit=dev` before each step. Do each as its own commit and test on a **preview deploy** before merging.

Recommended order:
1. **Next 14 -> 15** (`npx @next/codemod@latest upgrade`). Breaking changes that apply here:
   - `cookies()` and `headers()` become async (used in `lib/supabase/index.ts`, `app/auth/callback/route.ts`, `app/api/stripe/webhook/route.ts`).
   - `fetch` and GET route handlers are **no longer cached by default**. This changes the caching behavior behind the original stale-content investigation, so re-check the blog page.
   - `params` becomes a Promise in pages and `generateMetadata`.
2. **React 18 -> 19**, together with `@types/react` and `@types/react-dom`. Check Radix and `react-hook-form` compatibility.
3. **Next 15 -> 16** once 15 is stable. Re-read the caching docs; this release reworked caching again.
4. **Stripe SDK 14 -> 23** and `@stripe/stripe-js` 3 -> 10. Pin `apiVersion` explicitly and re-test checkout plus webhook events using the Stripe CLI.
5. **Tailwind 3 -> 4.** Config format changes. There are currently two config files, `tailwind.config.js` and `tailwind.config.ts`; delete the unused one first.
6. **zod 3 -> 4**, `zustand 4 -> 5`, `lucide-react 0.x -> 1.x`, `next-themes 0.2 -> 0.4`, `@hookform/resolvers 3 -> 5` (must match zod). Minor/patch bumps for Radix, `react-hook-form`, `clsx`, `tailwind-merge`, `typescript` (5.9, not 7) are low risk and can be batched.
7. `react-markdown` 9 -> 10 **removes the `className` prop**, which `MarkdownPreview.tsx` uses. Fold this into the MDX work rather than upgrading it on its own.

Keep these accepted until the above lands: the remaining `braces`, `chokidar`, `micromatch`, `tailwindcss`, `tailwindcss-animate` and `postcss-selector-parser` findings are build-time tooling.

## 4. Code refactoring backlog

**High value**
- **Blog page fetches its own API over HTTP** (`page.tsx`, `generateMetadata`, `generateStaticParams` all call `PROD_URL + "/api/blog"`). Read Supabase directly in the server component instead. Builds currently fail if production is unreachable, and `generateStaticParams` is limited to 10 posts (`.limit(10)` in `app/api/blog/route.ts`).
- **Make `updateBlogDetail` atomic.** It writes two tables sequentially, so one can succeed while the other fails. Wrap both in a Postgres function called with `supabase.rpc(...)`, or write `blog_content` first.
- **Generate Supabase types** with `supabase gen types typescript` instead of the hand-maintained `lib/types/supabase.ts`. The hand-written file already drifted (for example the category list).
- **Track RLS/SQL in the repo** with the Supabase CLI (`supabase/migrations`). The `blog_content` UPDATE policy added during PR #14 lives only in the dashboard.

**Medium**
- `BlogContent.tsx` loads text with `useEffect` + a browser client (the TODO in the file suggests React Query). Consider a server component that reads under the user's session, which RLS still enforces. It also has a known 406 for non-subscribers; handle it explicitly.
- Category list is defined in three places (`schema/index.tsx`, the `<select>` in `BlogForm.tsx`, the metadata keywords). "Design" is allowed by the schema but missing from the dropdown. Use one shared constant.
- `Session-provider.tsx` and several components each construct their own browser client. Create one helper.
- Remove the commented-out Supabase client block at the top of `lib/actions/blog.ts` and the unused `createServerClient` / `cookies` imports.
- `deleteBlogById` and `updateBlogById` revalidate inconsistently. Pick one pattern (path or tag) and use it everywhere.

**Low**
- Several `any` types (`SwitchForm`, webhook `req`, `e: any`).
- README has a stale "Upcoming changes" section.

## 5. Migrating react-markdown to MDX

**Goal:** richer posts (custom components, callouts, embeds, interactive demos) in the existing reading and editing flow.

### Key constraint
Posts are stored as strings in Supabase (`blog_content.content`), not as files. That rules out the file-based `@next/mdx` approach. MDX must be **compiled at runtime from a string**. Options (check each package's current docs before choosing; APIs change):

| Option | Notes |
|---|---|
| `next-mdx-remote` (RSC `MDXRemote`) | Best fit for DB strings and server rendering. Compile happens on the server; custom components passed via a `components` map. |
| `@mdx-js/mdx` `evaluate` | Lower level. Works in the browser, which is what the **live editor preview** needs. |
| Keep markdown + a custom rehype/remark pipeline (`remark-directive`) | "MDX-lite": custom blocks without executable JS. Safest if you do not need real JSX. |

### Security (blocker)
MDX **executes JavaScript** (expressions, imports, JSX). With `react-markdown`, raw HTML is not rendered, so a malicious post is harmless. With MDX, a post can run code on the server (server compile/render) or in every reader's browser (client compile).
1. Complete **S1 and S2** first so only a real admin can write post content.
2. Compile on the server where possible, and only allow components from a fixed map. Do not allow `import`/`export` in posts, and disable JS expressions if the library supports it.
3. Never evaluate content from `user_metadata`-gated writers.

### Compatibility audit before switching
Plain Markdown is not always valid MDX. Characters like `{`, `}` and `<` outside code fences, raw HTML, HTML comments (`<!-- -->`) and autolinks (`<https://...>`) fail to compile.
- Write a one-off script that loads every row from `blog_content`, runs it through the MDX compiler, and lists posts that fail.
- Fix those posts, or render failures with `react-markdown` as a fallback during the migration.

### Plan
1. **Preconditions:** S1/S2 done, Next on a stable version, PR #14 deployed.
2. **Add the compile path** behind a feature flag or per-post toggle (for example a `format` column: `md` or `mdx`, default `md`). Existing posts stay on `react-markdown`.
3. **Port the component map** from `components/markdown/MarkdownPreview.tsx` into MDX `components`:
   - `h1/h2/h3`: the current file renders **h2 and h3 as `<h1>`**. Fix it to real `h2`/`h3`.
   - `code`: MDX renders fenced code as `<pre><code>`, so restructure the code-block wrapper around `pre`. Keep `rehype-highlight`, which works as a rehype plugin in MDX.
   - **Code-block filename/meta:** the current code reads `node.data.meta`. MDX needs a small rehype plugin to pass the meta string through as a prop.
   - **`CopyButton` id bug:** ids are `Math.floor(Math.random() * 100) + 1`, so only 100 values and collisions copy the wrong block. Use `useId()` or a ref instead of `getElementById`.
4. **Add `remark-gfm`.** The current setup has no remark plugins, so tables, task lists and strikethrough do not render today.
5. **Editor preview** (`BlogForm.tsx` renders `MarkdownPreview` client-side): either compile client-side with `@mdx-js/mdx` (lazy-loaded to keep client JS down) or call a server action that returns compiled output. Show compile errors inline instead of crashing the form.
6. **Performance:** compiling per request costs CPU. Consider compiling on save and storing the compiled output in a new column (`content_compiled`), then rendering that. RLS-gated premium content must still be fetched through the user's session.
7. **Test:** premium gating (non-subscriber sees the paywall), an MDX post with a custom component, a post that fails compile, the editor preview, and mobile layout.
8. **Cutover:** migrate posts in batches by setting `format = 'mdx'`. Keep the `react-markdown` path until every post is converted, then remove it. That also removes the `react-markdown` 10 `className` breakage from section 3.

## 6. Things that live outside the repo

- **Supabase RLS policies.** Current set: `blog` (select, insert, update, delete via `is_admin()` / `is_publish()`), `blog_content` (select, insert, **update added in PR #14**: `using (is_admin()) with check (is_admin())`). `blog_content` has no DELETE policy. Cascade deletes from `blog` bypass RLS. Export these into migrations (section 4).
- **Supabase auth settings:** redirect URLs must include any preview domain you want to sign in from. Vercel preview URLs are behind Vercel auth, so test in a normal logged-in browser, not incognito.
- **Stripe:** webhook endpoint points at the production URL. Preview deploys never receive events. To test locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- **Vercel:** project `sams-blog`; Node 24.x set via `engines`; `.vercel` is gitignored.

## 7. Working conventions

- Plain conventional commits (`fix:`, `chore:`, `refactor:`), one logical change per commit, no trailers or co-author lines.
- Work on a branch, push, **test on the preview deploy, then merge**. Never push untested auth or cookie changes straight to `main`.
- Before every merge: `npx tsc --noEmit`, `npx next lint`, `npx next build`.
- After any auth, middleware or cookie change: log out, log in, open `/dashboard`, edit a post, log in as a non-admin and open a premium post.
- After any Stripe change: check the webhook delivery log in the Stripe dashboard for 2xx responses.
