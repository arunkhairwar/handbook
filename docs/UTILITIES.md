# Utilities, Hooks & Services

Reusable logic layers. Always check here before writing new data-fetching or utility code.

---

## Hooks (`src/hooks/`)

### Auth Hooks

#### `useInitializeAuth` — `src/hooks/useAuth.ts`
One-shot app-start hook. Reads token from secure storage, verifies with API, and sets Jotai auth atoms. Called once in `SplashScreenLoader`.

#### `useSendOtp` — `src/hooks/useAuthMutations.ts`
TanStack mutation. Sends OTP to a phone number.
```ts
const { mutate: sendOtp, isPending } = useSendOtp();
sendOtp("+919876543210");
```

#### `useLogin` — `src/hooks/useAuthMutations.ts`
TanStack mutation. Verifies OTP, stores token, fetches profile, updates auth atoms.
```ts
const { mutate: login } = useLogin();
login({ phone: "+91...", otp: "123456" });
```

#### `useRegister` — `src/hooks/useAuthMutations.ts`
TanStack mutation. Registers a new user.

#### `useLogout` — `src/hooks/useAuthMutations.ts`
TanStack mutation. Clears secure storage and resets auth atoms.

---

### Site Hooks — `src/hooks/useSite.ts`

#### `useSites(params?)`
Infinite query for paginated site list. Supports `q` (search) and `limit`.
```ts
const { data, fetchNextPage, hasNextPage, isFetching } = useSites({ q: "bridge" });
// Pages: data.pages[n].data (array of Site)
```

#### `useSiteDetails(id)`
Query for a single site by ID.

#### `useCreateSite()`
Mutation. Invalidates `["sites"]` query on success.

#### `useUpdateSite()`
Mutation. Takes `{ id, data }`. Invalidates `["sites"]` and `["site", id]`.

#### `useDeleteSite()`
Mutation. Takes site `id`. Invalidates `["sites"]`.

---

### Client Hook — `src/hooks/useClient.ts`

#### `useClient()`
Returns `{ clients, isLoading, getAllClients, createClient, updateClient, deleteClient }`.
Uses Jotai `clientAtom` for state + manual loading. Older pattern — prefer TanStack Query for new features.

> **Note:** For new entity features, follow the `useSite.ts` TanStack Query pattern, not `useClient.ts`.

---

### Worker Hook — `src/hooks/useWorker.ts`

#### `useSearchWorkers(query)`
Infinite query for searching workers by query string.

---

### Utility Hooks

#### `useImagePicker` — `src/hooks/useImagePicker.ts`
Wraps `expo-image-picker`. Returns `{ pickImage, image, clearImage }`.

#### `useColorScheme` — `src/hooks/use-color-scheme.ts`
Returns current `"light"` | `"dark"` color scheme.

#### `useThemeColor` — `src/hooks/use-theme-color.ts`
Returns the correct color value for the current theme.

---

## Services (`src/services/`)

Services are plain async functions with no side-effects. They only call `axiosInstance` and return typed data.

### `authService` — `src/services/auth.service.ts`
| Method | Signature |
|---|---|
| `sendOtp(phone)` | Strips `+91`, calls `POST /auth/send-otp` |
| `register(data)` | Calls `POST /auth/register` |
| `login({ phone, otp })` | Calls `POST /auth/login`, normalizes token response |
| `getUserProfile()` | Calls `GET /users/me`, returns `ApiResponse<User>` |

### `clientService` — `src/services/client.service.ts`
Standard CRUD: `createClient`, `getAllClients`, `getClientById`, `updateClient`, `deleteClient`.

### `siteService` — `src/services/site.service.ts`
| Method | Notes |
|---|---|
| `getAllSites(params?)` | Supports `cursor`, `q`, `limit` for cursor pagination |
| `getSiteById(id)` | Returns `SiteDetailsResponse` |
| `createSite(data)` | Data typed via `createSiteSchema` |
| `updateSite(id, data)` | Partial update |
| `deleteSite(id)` | - |

### `workerService` — `src/services/worker.service.ts`
| Method | Notes |
|---|---|
| `searchWorker({ query })` | Search workers by query string |

---

## API Layer (`src/api/`)

### `axiosInstance` — `src/api/axios.instance.ts`
- Single shared Axios instance with `baseURL` from `ENDPOINTS`.
- **Request interceptor:** Reads `AUTH_TOKEN` from secure storage, attaches `Authorization: Bearer <token>`.
- **Response interceptor:** On 401 (non-auth endpoint) → calls `clearAuthStorage()` + redirects to login. Normalizes error shape into `ApiError`.

### `ENDPOINTS` — `src/api/endpoints.ts`
Centralized registry of all API paths. Dynamic paths are functions.
```ts
ENDPOINTS.SITE.GET_BY_ID("abc123") // → "/sites/abc123"
```

---

## Utilities (`src/lib/`)

### `cn(...classes)` — `src/lib/utils.ts`
Merges NativeWind class name strings, filtering falsy values.
```ts
cn("flex-1", isActive && "bg-green-500", undefined) // → "flex-1 bg-green-500"
```

### `queryClient` — `src/lib/queryClient.ts`
Configured `QueryClient` instance:
- Queries: 2 retries, 5-minute stale time.
- Mutations: no retry.
- `MutationCache`: global error toast handler. Uses `mutation.meta.errorTitle` for toast title; respects `mutation.meta.suppressErrorToast`.

---

## Storage (`src/storage/secure-storage.ts`)

Wrapper around `expo-secure-store` with typed keys.

| Export | Purpose |
|---|---|
| `StorageKeys` | Enum-like object: `AUTH_TOKEN`, `REFRESH_TOKEN`, `USER_ID`, `PAYOUT_DAY` |
| `setSecureValue(key, value)` | Store a value |
| `getSecureValue(key)` | Retrieve a value (returns `null` if missing) |
| `deleteSecureValue(key)` | Delete a single key |
| `clearAuthStorage()` | Deletes all auth keys (call on logout) |

---

## Schema Validation (`src/schema/`)

Zod schemas with exported inferred types:

| Export | Schema | Derived type |
|---|---|---|
| `registerSchema` | Registration form | `RegisterFormData` |
| `loginSchema` | Login form (phone) | `LoginFormData` |
| `verifyOtpSchema` | OTP verification | `VerifyOtpFormData` |
| `phoneValidation` | Reusable phone validator (Indian `+91`) | - |
| `createClientSchema` | New client | `CreateClientData` (in service) |
| `updateClientSchema` | Edit client | `UpdateClientData` (in service) |
| `createSiteSchema` | New site | `CreateSiteData` (in service) |

---

## Route Constants (`src/routes/app.routes.ts`)

`AppRoutes` — typed object with all screen paths. Always use this instead of raw strings.
```ts
import { AppRoutes } from "@/src/routes";
router.push(AppRoutes.SITE.DETAIL("abc123"));
```
