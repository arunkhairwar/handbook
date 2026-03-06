import { AuthStatus, Routes } from "@/src/enums";
import { Redirect } from "expo-router";
import { useAtomValue } from "jotai";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { authStatusAtom } from "@/src/atoms/auth.atoms";

export default function Index() {
  const authStatus = useAtomValue(authStatusAtom);

  // Show loading while checking auth state
  if (authStatus === AuthStatus.LOADING) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // Redirect based on auth status
  if (authStatus === AuthStatus.AUTHENTICATED) {
    return <Redirect href={Routes.ADMIN_DASHBOARD} />;
  }

  return <Redirect href={Routes.LOGIN} />;
}
