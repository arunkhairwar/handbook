# Architecture

## Overview

SiteKhata is a **React Native** mobile app built with **Expo SDK 56** and **Expo Router** (file-based navigation). It is a construction site management tool for contractors to manage clients, sites, workers, and payments.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 56 |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind CSS for RN) |
| Server state | TanStack React Query v5 |
| Global UI state | Jotai v2 (atoms) |
| Multi-step flow state | Zustand v5 |
| HTTP client | Axios (single shared instance) |
| Form validation | React Hook Form + Zod v4 |
| Secure storage | expo-secure-store |
| Toast notifications | react-native-toast-message |

---

## Directory Layout

```
app/                      ← Expo Router screens (file-based routes)
  _layout.tsx             ← Root layout: providers, splash, toast
  index.tsx               ← Redirect entry point
  (auth)/                 ← Auth screens (unauthenticated)
  (home)/                 ← Tab navigator (authenticated)
    dashboard.tsx
    clients/
    sites/
    workers/
    payments.tsx
    profile.tsx

src/
  api/                    ← Axios instance + endpoint registry
  atoms/                  ← Jotai atoms (global UI state)
  components/
    ui/                   ← Reusable design system primitives
    auth/                 ← Auth-specific components
    clients/              ← Client feature components
    sites/                ← Site feature components
    dashboard/            ← Dashboard feature components
  enums/                  ← TypeScript enums
  hooks/                  ← TanStack Query + Jotai hooks
  lib/                    ← Shared utilities (queryClient, cn)
  routes/                 ← Typed route constants
  schema/                 ← Zod validation schemas
  services/               ← API service layer (thin wrappers)
  storage/                ← Secure storage abstraction
  store/                  ← Zustand stores (transient state)
  toast/                  ← Toast component definitions
  types/                  ← TypeScript types + interfaces

constants/                ← App-wide constants (colors, images, theme)
store/                    ← (legacy root-level) mockStore.ts only
assets/                   ← Images and fonts
```

---

## Data Flow

```
Screen (app/)
  ↓  calls
Custom Hook (src/hooks/)         ← TanStack Query: useQuery / useMutation
  ↓  calls
Service (src/services/)          ← Plain async functions, no side-effects
  ↓  uses
axios instance (src/api/)        ← Auth token injection, 401 session expiry
  ↓  hits
Backend REST API                 ← Base URL in src/api/endpoints.ts
```

**Side effects on mutations:**
- Global `MutationCache` in `src/lib/queryClient.ts` automatically shows error toasts.
- Jotai atoms are updated inside `onSuccess` / `onError` mutation callbacks in hooks.
- Successful mutations call `queryClient.invalidateQueries()` to keep cache in sync.

---

## Authentication Flow

1. App starts → `SplashScreenLoader` renders.
2. `useInitializeAuth()` reads token from `expo-secure-store`.
3. If token exists → calls `GET /users/me` → sets Jotai `userAtom`, `authStatusAtom`.
4. `authStatusAtom` drives routing: `AUTHENTICATED` → `/(home)`, `UNAUTHENTICATED` → `/(auth)/login`.
5. Login flow: send OTP → verify OTP → token stored → atoms updated → redirected.
6. 401 response on any non-auth endpoint → `clearAuthStorage()` + redirect to login.

---

## Navigation

- **Root Layout** (`app/_layout.tsx`): Wraps everything in `QueryClientProvider` and renders `<Toast>`.
- **Home Layout** (`app/(home)/_layout.tsx`): Tab navigator for Dashboard, Clients, Sites, Workers, Payments.
- Sub-navigators for `clients/`, `sites/`, `workers/` use nested `Stack` layouts.
- Route strings are defined in `src/routes/app.routes.ts` as `AppRoutes.*` — never hardcode.

---

## State Management Summary

| State type | Tool | Location |
|---|---|---|
| Auth session (user, token, status) | Jotai atoms | `src/atoms/auth.atoms.ts` |
| Client list | Jotai atom | `src/atoms/client.atoms.ts` |
| Server data (sites, workers, etc.) | TanStack Query cache | managed by hooks in `src/hooks/` |
| Phone number across auth screens | Zustand | `src/store/auth.store.ts` |
| Form state | React Hook Form | local to each screen |
