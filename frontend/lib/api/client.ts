// frontend/src/lib/api/client.ts

/**
 * Base URL for the OrderFlow API.
 *
 * Example:
 * NEXT_PUBLIC_API_URL=http://localhost:3001
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

/**
 * Generic API error.
 *
 * Keeps HTTP status information available to the caller instead
 * of converting every failure into a generic Error.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic HTTP client for the OrderFlow API.
 *
 * This function is intentionally unaware of any specific API
 * resource such as orders.
 */
export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const body = await response.json();

      if (
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      // Response does not contain a JSON error body.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
