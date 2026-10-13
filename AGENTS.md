# AGENTS.md — AI Development Rules for SiteKhata App

## Project Overview

**SiteKhata** is a React Native mobile app (Expo Router + NativeWind) for construction site management. It handles clients, sites, workers, and payments for site contractors.

---

## Core Rules for AI Agents

### 1. Search Before Creating
- **ALWAYS** search for existing functionality before writing new code.
- Check `src/components/ui/` for reusable UI primitives.
- Check `src/hooks/` for existing data-fetching / mutation hooks.
- Check `src/services/` for existing API service methods.
- Check `src/types/` for existing TypeScript types.
- Check `src/schema/` for existing Zod validation schemas.
- Check `src/routes/app.routes.ts` for existing route constants.

### 2. Prefer Reuse → Extend → Create
1. **Reuse** an existing component, hook, or service if it covers the need.
2. **Extend** it with a new prop/option if minor changes are required.
3. **Create new code only** when there is no suitable existing abstraction.

### 3. Follow Existing Architecture
- New API endpoints → add to `src/api/endpoints.ts` (`ENDPOINTS` object).
- New service methods → add to the relevant `src/services/*.service.ts`.
- New React Query hooks → add to the relevant `src/hooks/use*.ts`.
- New types → add to the relevant `src/types/*.types.ts` and re-export from `src/types/index.ts`.
- New Zod schemas → add to the relevant `src/schema/*.schema.ts`.
- New screens → add under `app/(home)/` or `app/(auth)/` following file-based routing.
- New reusable UI → add to `src/components/ui/`.
- New feature-scoped components → add to `src/components/<feature>/`.

### 4. Avoid Duplicates
- Do not create a second axios instance — always use `src/api/axios.instance.ts`.
- Do not create a second QueryClient — always use `src/lib/queryClient.ts`.
- Do not hardcode route strings — always use `AppRoutes` from `src/routes/app.routes.ts`.
- Do not create new storage keys as raw strings — add to `StorageKeys` in `src/storage/secure-storage.ts`.
- Do not create a second color palette — always import from `constants/Colors.ts`.

### 5. Minimal Changes
- Make the smallest change that achieves the goal.
- Do not refactor unrelated code unless explicitly asked.
- Do not add new dependencies without asking.

### 6. State Management Conventions
- **Jotai atoms** (`src/atoms/`) — for global, persistent UI state (auth session, client list).
- **Zustand store** (`src/store/`) — for transient, multi-step flow state (e.g., phone number passed between auth screens).
- **TanStack Query** — for all server data fetching and mutations.
- Do NOT use `useState` for data that belongs in an atom or query.

### 7. Error Handling
- Mutations use the global `MutationCache` in `src/lib/queryClient.ts` to show error toasts automatically.
- To suppress the global toast for a specific mutation, pass `meta: { suppressErrorToast: true }`.
- To customize the toast title, pass `meta: { errorTitle: "Custom Title" }`.
- Do NOT call `Toast.show` manually inside hooks that use `useMutation` — it's handled globally.

### 8. Styling
- Use **NativeWind** (Tailwind) class names for layout and typography.
- Use **`constants/Colors.ts`** for semantic color values in `StyleSheet.create()` or inline styles.
- Use the `cn()` utility from `src/lib/utils.ts` to merge conditional class names.
- Do NOT use hardcoded hex color strings — reference `Colors.*` instead.

### 9. Update Docs for Major Changes
When you add a major new feature, service, hook, or component, update the relevant file:
- `docs/ARCHITECTURE.md` — if data flow or layer responsibilities change.
- `docs/CODEBASE_MAP.md` — if a new domain/module is added.
- `docs/COMPONENTS.md` — if a new reusable component is added.
- `docs/UTILITIES.md` — if a new hook, service, or utility is added.
- `docs/DECISIONS.md` — if a new architectural decision or convention is established.

---

## Quick Navigation

| What you need | Where to look |
|---|---|
| API base URL & endpoint paths | `src/api/endpoints.ts` |
| HTTP client (axios) | `src/api/axios.instance.ts` |
| React Query client config | `src/lib/queryClient.ts` |
| Secure storage util | `src/storage/secure-storage.ts` |
| Route constants | `src/routes/app.routes.ts` |
| Color palette | `constants/Colors.ts` |
| Global types barrel | `src/types/index.ts` |
| Zod schemas | `src/schema/` |
| Enums | `src/enums/` |
| Auth atoms (session state) | `src/atoms/auth.atoms.ts` |
| Auth flow store (phone state) | `src/store/auth.store.ts` |
| Auth hooks | `src/hooks/useAuth.ts`, `src/hooks/useAuthMutations.ts` |
| Reusable UI components | `src/components/ui/` |
| Feature components | `src/components/<feature>/` |
| Screen files | `app/(home)/`, `app/(auth)/` |
| Toast components/config | `src/toast/` |

See `docs/` for detailed architecture and component reference.
