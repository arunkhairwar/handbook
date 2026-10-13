# Components

Reusable components in `src/components/ui/`. Always check here before building new UI.

---

## Layout & Screen Shell

### `SafeAreaWrapper`
**Path:** `src/components/ui/SafeAreaWrapper.tsx`
Combines `SafeAreaView` + `KeyboardAvoidingView`. Use on every screen.
```tsx
<SafeAreaWrapper className="bg-white" scrollable>
  {children}
</SafeAreaWrapper>
```
Props: `className`, `scrollable`, `style`, `edges`

### `ScreenHeader`
**Path:** `src/components/ui/ScreenHeader.tsx`
Header bar with optional back button and right element. Use on stack screens instead of the default expo-router header.
```tsx
<ScreenHeader label="Site Details" rightElement={<AddButton />} />
```
Props: `label` (required), `showBackButton`, `onBack`, `rightElement`, `alignLabel`

### `KeyboardAvoidingWrapper`
**Path:** `src/components/ui/KeybardAvoidingWrapper.tsx`
Alternative wrapper with keyboard avoidance + optional scroll.

---

## Interactive Controls

### `Button`
**Path:** `src/components/ui/Button.tsx`
Primary CTA button with variants and loading state.
```tsx
<Button title="Save" onPress={handleSave} variant="primary" isLoading={isPending} />
```
Variants: `primary` | `secondary` | `outline` | `danger`
Props: `title`, `onPress`, `variant`, `isLoading`, `disabled`, `style`

### `Input`
**Path:** `src/components/ui/Input.tsx`
Styled text input, typically used with React Hook Form.

### `DateTimePicker`
**Path:** `src/components/ui/DateTimePicker.tsx`
Wraps `@react-native-community/datetimepicker` with consistent styling.

### `ValuePickerModal`
**Path:** `src/components/ui/ValuePickerModal.tsx`
Generic scrollable picker modal for selecting from a list of values.

### `FloatingActionButton`
**Path:** `src/components/ui/FloatingActionButton.tsx`
Floating `+` button for list screens.

---

## Feedback & Status

### `EmptyState`
**Path:** `src/components/ui/EmptyState.tsx`
Shown when a list is empty. Renders an icon, title, and optional description.
```tsx
<EmptyState title="No sites yet" iconName="business-outline" />
```
Props: `title`, `description`, `iconName` (Ionicons), `iconSize`, `className`

### `LoadingSpinner`
**Path:** `src/components/ui/LoadingSpinner.tsx`
Centered activity indicator.

### `FullScreenLoader`
**Path:** `src/components/ui/FullScreenLoader.tsx`
Full-screen overlay loader.

### `Badge`
**Path:** `src/components/ui/Badge.tsx`
Status badge / pill label with color variants.

---

## Media & Avatar

### `ProfilePicture`
**Path:** `src/components/ui/ProfilePicture.tsx`
Displays a user/entity profile picture with upload support.

### `ProfilePictureActionModal`
**Path:** `src/components/ui/ProfilePictureActionModal.tsx`
Bottom sheet for choosing camera vs. gallery when updating a profile picture.

### `Avatar`
**Path:** `src/components/ui/Avatar.tsx`
Small circular avatar shown in the tab bar header.

### `FullScreenMediaView`
**Path:** `src/components/ui/FullScreenMediaView.tsx`
Displays an image or media in a full-screen overlay.

---

## Navigation

### `BackButton`
**Path:** `src/components/ui/BackButton.tsx`
Standalone back button for use in custom headers.

---

## Utility Display

### `Card`
**Path:** `src/components/ui/Card.tsx`
Generic card container with consistent shadow and rounding.

### `Divider`
**Path:** `src/components/ui/Divider.tsx`
Horizontal rule / separator.

### `SelectClient`
**Path:** `src/components/ui/SelectClient.tsx`
Dropdown/picker for selecting a client from the client list.

### `collapsible`
**Path:** `src/components/ui/collapsible.tsx`
Expandable/collapsible section container.

---

## Auth-Scoped

### `AuthWrapper`
**Path:** `src/components/auth/AuthWrapper.tsx`
Shell for all auth screens. Renders app logo, title, and optional description above children.
```tsx
<AuthWrapper title="Sign In" description="Enter your phone number">
  <LoginForm />
</AuthWrapper>
```
Props: `title`, `description`, `scrollable`, `children`

---

## Icons

### `icon-symbol`
**Path:** `src/components/ui/icon-symbol.tsx` (Android) / `icon-symbol.ios.tsx` (iOS)
Platform-specific icon renderer. Prefer `@expo/vector-icons` `Ionicons` directly in most cases.

---

## Splash

### `SplashScreenLoader`
**Path:** `src/components/SplashScreenLoader.tsx`
Animated splash screen shown while auth is initializing. Calls `onFinish` when done.
