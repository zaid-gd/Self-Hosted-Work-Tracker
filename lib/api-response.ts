export async function readApiPayload(response: Response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export function getApiErrorMessage(
  response: Response,
  payload: unknown,
  fallback: string
) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = payload.error
    if (typeof error === "string" && error.trim()) {
      return error
    }
  }

  if (response.status === 401) {
    return "Authentication failed. Check your Clerk environment keys and sign in again."
  }

  if (typeof payload === "string" && payload.trim().startsWith("<")) {
    return "The server returned HTML instead of JSON. This usually means authentication or environment configuration is broken."
  }

  return fallback
}
