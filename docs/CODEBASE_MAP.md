# Codebase Map

Where major features, screens, hooks, services, and types live.

---

## Screens (`app/`)

### Auth Group — `app/(auth)/`
| File | Purpose |
|---|---|
| `login.tsx` | Phone number entry, sends OTP |
| `register.tsx` | New user registration form |
| `verify-otp.tsx` | OTP verification, completes login |

### Home Group — `app/(home)/`
| File | Purpose |
|---|---|
| `dashboard.tsx` | Home tab: active sites, financial summary, workforce |
| `payments.tsx` | Payments tab: payment list and management |
| `profile.tsx` | User profile screen |
| `clients/index.tsx` | Client list |
| `clients/[id].tsx` | Client detail (stub) |
| `sites/index.tsx` | Sites list with infinite scroll & search |
| `sites/[id].tsx` | Site detail view |
| `sites/add.tsx` | Create new site form |
| `workers/index.tsx` | Worker list with search |
| `workers/[id].tsx` | Worker detail |

---

## Components (`src/components/`)

### Reusable UI Primitives — `src/components/ui/`
See `docs/COMPONENTS.md` for full details.

### Feature Components

**Auth** — `src/components/auth/`
- `AuthWrapper` — Shared layout shell for all auth screens.

**Clients** — `src/components/clients/`
- `AddClientModal` — Modal form to create a client.
- `ClientTile` — List item card for a client.

**Sites** — `src/components/sites/`
- `AddSiteModal` — Modal form to create a site.
- `SiteTile` — List item card for a site.

**Dashboard** — `src/components/dashboard/`
- `ActiveSitesList` — List of currently active sites.
- `DashboardHeader` — Top header with greeting.
- `FinancialSummary` — Total earnings/expenses summary.
- `PayoutDayModal` — Modal for setting payout day.
- `SiteCard` — Site card for dashboard view.
- `StatCard` — Single stat number card.
- `TodayWorkforce` — Today's worker count.
- `WeeklyPayoutAlert` — Alert banner for upcoming payouts.

---

## Hooks (`src/hooks/`)

| Hook file | Exports | Domain |
|---|---|---|
| `useAuth.ts` | `useInitializeAuth` | Bootstrap auth on app start |
| `useAuthMutations.ts` | `useSendOtp`, `useLogin`, `useRegister`, `useLogout` | Auth mutations |
| `useClient.ts` | `useClient` (getAllClients, createClient, updateClient, deleteClient) | Client CRUD |
| `useSite.ts` | `useSites`, `useSiteDetails`, `useCreateSite`, `useUpdateSite`, `useDeleteSite` | Site CRUD |
| `useWorker.ts` | `useSearchWorkers` | Worker search |
| `useImagePicker.ts` | `useImagePicker` | Camera/gallery picker |
| `use-color-scheme.ts` | `useColorScheme` | Theme detection |
| `use-theme-color.ts` | `useThemeColor` | Themed color values |

> **Note:** `useClient` uses Jotai + manual state (older pattern). `useSite` and `useWorker` use TanStack Query (preferred pattern for new hooks).

---

## Services (`src/services/`)

| File | Object | Methods |
|---|---|---|
| `auth.service.ts` | `authService` | `sendOtp`, `register`, `login`, `getUserProfile` |
| `client.service.ts` | `clientService` | `createClient`, `getAllClients`, `getClientById`, `updateClient`, `deleteClient` |
| `site.service.ts` | `siteService` | `createSite`, `getAllSites`, `getSiteById`, `updateSite`, `deleteSite` |
| `worker.service.ts` | `workerService` | `searchWorker` |

---

## API Layer (`src/api/`)

| File | Purpose |
|---|---|
| `axios.instance.ts` | Singleton Axios instance: Bearer auth header injection, 401 → session expiry |
| `endpoints.ts` | `ENDPOINTS` object with all route strings; `API_BASE_URL` |

---

## State (`src/atoms/` + `src/store/`)

| File | Type | Contents |
|---|---|---|
| `src/atoms/auth.atoms.ts` | Jotai | `authLoadingAtom`, `tokenAtom`, `userAtom`, `authStatusAtom` |
| `src/atoms/client.atoms.ts` | Jotai | `clientAtom` (client list) |
| `src/store/auth.store.ts` | Zustand | `useAuthFlowStore` (phone number for auth multi-step flow) |

---

## Types (`src/types/`)

| File | Key Types |
|---|---|
| `shared/api.types.ts` | `ApiResponse<T>`, `CursorPaginatedResponse<T>`, `PaginatedResponse<T>` |
| `user.type.ts` | `User`, `UserProfile`, `Address` |
| `auth.types.ts` | `LoginResponse`, `RegisterResponse`, `VerifyResponse` |
| `site.types.ts` | `Site`, `SiteDetails`, `SiteAddressDetail`, `CursorPaginatedSitesResponse`, `SiteDetailsResponse` |
| `client.types.ts` | `Client` |
| `worker.types.ts` | `WorkerSearchQuery` |
| `error.types.ts` | `ApiError` |
| `index.ts` | Barrel export for all types |

---

## Schemas (`src/schema/`)

| File | Schemas |
|---|---|
| `auth.schema.ts` | `registerSchema`, `loginSchema`, `verifyOtpSchema`, `phoneValidation` |
| `client.schema.ts` | `createClientSchema`, `updateClientSchema` |
| `sites.schema.ts` | `createSiteSchema` |

---

## Enums (`src/enums/`)

| File | Enum |
|---|---|
| `auth.enum.ts` | `AuthStatus` (IDLE, LOADING, AUTHENTICATED, UNAUTHENTICATED, ERROR) |

---

## Constants (`constants/`)

| File | Purpose |
|---|---|
| `Colors.ts` | Design token color palette (primary, accent, background, tiles per entity) |
| `theme.ts` | Extended theme values |
| `images.ts` | Image asset references |

---

## Routing (`src/routes/`)

`app.routes.ts` exports `AppRoutes` — typed route constants for all screens.
Always import from here instead of writing route strings inline.

---

## Storage (`src/storage/`)

`secure-storage.ts` — wraps `expo-secure-store` with typed keys via `StorageKeys` constant.
Functions: `setSecureValue`, `getSecureValue`, `deleteSecureValue`, `clearAuthStorage`.

---

## Toast (`src/toast/`)

| File | Purpose |
|---|---|
| `toastConfig.ts` | `getToastConfig(isDark)` — registers custom toast components |
| `toastStyles.ts` | Shared toast style constants |
| `ErrorToast.tsx` | Custom error toast UI |
| `SuccessToast.tsx` | Custom success toast UI |
| `InfoToast.tsx` | Custom info toast UI |
