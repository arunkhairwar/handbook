export enum Routes {
  // Auth routes
  LOGIN = "/(auth)/login",
  REGISTER = "/(auth)/register",

  // App routes
  ADMIN_DASHBOARD = "/(admin)/dashboard",
  WORKER_DASHBOARD = "/(worker)/dashboard",
}

export enum RouteGroups {
  AUTH = "(auth)",
  ADMIN = "(admin)",
  WORKER = "(worker)",
}
