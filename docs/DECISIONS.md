# Architectural Decisions & Conventions

Key decisions already present in the codebase that future agents must respect and follow.

---

## 1. Single Axios Instance

**Decision:** One shared `axiosInstance` in `src/api/axios.instance.ts`.

**Why:** Centralizes auth token injection, error normalization, and session expiry handling in one place.

**Convention:** Never create a second Axios instance or call `axios.get()` directly. Always import `axiosInstance`.

---

## 2. Centralized Endpoint Registry

**Decision:** All API paths live in `ENDPOINTS` in `src/api/endpoints.ts`.

**Why:** Prevents string duplication and makes API path changes a single-file update.

**Convention:** Add new endpoints to the appropriate object in `ENDPOINTS`. Dynamic paths must be functions: `GET_BY_ID: (id: string) => \`/resource/${id}\``.

---

## 3. Two-Layer State Management

**Decision:** Jotai for global UI/session state, Zustand for transient multi-screen flow state.

**Why:**
- Jotai atoms are fine-grained and reactive — ideal for auth session that many components read.
- Zustand is ergonomic for shared ephemeral state (e.g., phone number passed between auth screens) without persisting to storage.
- TanStack Query handles all server state; it must not be duplicated in atoms.

**Convention:**
- Auth session state (user, token, status) → Jotai atoms in `src/atoms/auth.atoms.ts`.
- Multi-step flow state → Zustand in `src/store/`.
- Server data (paginated lists, entity details) → TanStack Query only.

---

## 4. Global Mutation Error Toast via MutationCache

**Decision:** Error toasts for all mutations are handled globally in `src/lib/queryClient.ts` via `MutationCache`.

**Why:** Eliminates repetitive `try/catch` + `Toast.show()` in every mutation callback.

**Convention:**
- Set `meta: { errorTitle: "..." }` to customize the toast title.
- Set `meta: { suppressErrorToast: true }` to opt out.
- Do NOT call `Toast.show()` inside `useMutation` hooks for errors.
- Success toasts are still handled manually in the calling screen.

---

## 5. TanStack Query is the Preferred Data Pattern

**Decision:** `useSite.ts` (TanStack Query) is the correct pattern; `useClient.ts` (Jotai + useState) is the older pattern.

**Why:** TanStack Query provides caching, background refetch, and invalidation out of the box. The `useClient` pattern predates this.

**Convention:** All new entity data hooks must use TanStack Query (`useQuery` / `useInfiniteQuery` / `useMutation`). Do not copy the `useClient.ts` pattern.

---

## 6. Cursor-Based Pagination for Lists

**Decision:** List endpoints use cursor-based pagination via `useInfiniteQuery`.

**Why:** Server returns `nextCursor` in `meta.pagination` — offset pagination is not supported.

**Convention:** Use `useInfiniteQuery` for any list that may exceed one page. Response type is `CursorPaginatedResponse<T>` from `src/types/shared/api.types.ts`.

---

## 7. Zod Schemas Colocated with Service Types

**Decision:** Each service file imports its Zod schema and exports `CreateXData` / `UpdateXData` types inferred from it.

**Why:** Keeps the source of truth for payload shapes close to the service that uses them.

**Convention:**
```ts
// In service file
import { z } from "zod";
import { createFooSchema } from "../schema/foo.schema";
export type CreateFooData = z.infer<typeof createFooSchema>;
```

---

## 8. Typed Route Constants

**Decision:** `AppRoutes` in `src/routes/app.routes.ts` is the single source of route strings.

**Why:** Prevents typos and makes route refactors a single-file change.

**Convention:** Never use raw string route literals like `"/(home)/sites"`. Always use `AppRoutes.SITE.DETAIL(id)`.

---

## 9. Typed Secure Storage Keys

**Decision:** `StorageKeys` in `src/storage/secure-storage.ts` defines all storage key names.

**Why:** Prevents key typos and makes storage key changes auditable.

**Convention:** Add new storage keys to `StorageKeys`. Never use raw strings with `SecureStore` directly.

---

## 10. NativeWind (Tailwind) + StyleSheet Hybrid

**Decision:** NativeWind class names are used for layout and typography. `StyleSheet.create()` or inline styles with `Colors.*` are used for semantic color values.

**Why:** NativeWind does not support all dynamic color tokens at runtime; `Colors.ts` provides a typed, design-system-aware palette.

**Convention:**
- Layout, spacing, flex → NativeWind classes.
- Colors → `Colors.*` from `constants/Colors.ts`.
- Class merging → `cn()` from `src/lib/utils.ts`.

---

## 11. Auth Screens Share `AuthWrapper`

**Decision:** All auth screens (login, register, verify-otp) use `AuthWrapper` as their outer shell.

**Why:** Consistent logo placement, title, and layout across auth flow without duplication.

**Convention:** Any new auth screen must use `<AuthWrapper title="...">`.

---

## 12. Phone Number Format

**Decision:** Phone numbers are stored and transmitted with `+91` country code. The service layer strips the prefix before sending to the API.

**Why:** Backend expects `countryCode: "+91"` and `mobile: "9876543210"` as separate fields. The app stores and validates the full `+91XXXXXXXXXX` format.

**Convention:** Validate with `phoneValidation` from `src/schema/auth.schema.ts`. Strip in the service layer, not in the UI.
