import { authStatusAtom, userAtom } from "@/src/atoms/auth.atoms";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { AuthStatus, Routes } from "@/src/enums";
import { Role } from "@/src/types";
import { Redirect } from "expo-router";
import { useAtomValue } from "jotai";

export default function Index() {
  const authStatus = useAtomValue(authStatusAtom);
  const user = useAtomValue(userAtom);

  // Show loading while checking auth state
  if (authStatus === AuthStatus.LOADING) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // Redirect based on auth status and role
  if (authStatus === AuthStatus.AUTHENTICATED && user) {
    if (user.role === Role.WORKER) {
      return <Redirect href={Routes.WORKER_DASHBOARD} />;
    }
    return <Redirect href={Routes.ADMIN_DASHBOARD} />;
  }

  return <Redirect href={Routes.LOGIN} />;
}
