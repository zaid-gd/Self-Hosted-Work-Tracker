export function getPrismaErrorMessage(
  error: unknown,
  fallback = "A database error occurred"
) {
  if (!(error instanceof Error)) {
    return fallback
  }

  const message = error.message

  if (message.includes("P1001")) {
    return "Database connection failed. Check your Supabase DATABASE_URL and DIRECT_URL values in Vercel."
  }

  if (message.includes("P1012") || message.includes("Environment variable not found")) {
    return "Database environment variables are missing. Set DATABASE_URL and DIRECT_URL before using the app."
  }

  if (message.includes("P2021")) {
    return "Database schema is not ready yet. Run Prisma migrations against the production database."
  }

  return fallback
}

export function getPrismaErrorStatus(error: unknown) {
  if (!(error instanceof Error)) {
    return 500
  }

  const message = error.message

  if (
    message.includes("P1001") ||
    message.includes("P1012") ||
    message.includes("Environment variable not found")
  ) {
    return 503
  }

  if (message.includes("P2021")) {
    return 500
  }

  return 500
}
