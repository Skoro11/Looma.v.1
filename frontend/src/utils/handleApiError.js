/**
 * Extracts a clear, user-friendly error message from an Axios or generic error object.
 * Use this in your services to normalize all backend/network errors before throwing.
 */
export function handleApiError(
  error,
  defaultMsg = "An unexpected error occurred."
) {
  // Network / CORS / Timeout issues
  if (error.code === "ECONNABORTED") {
    return "The request took too long — please try again later.";
  }

  if (error.message?.includes("Network Error")) {
    return "Network error — please check your internet connection.";
  }

  // Backend responded but with an error
  if (error.response) {
    const status = error.response.status;
    const serverMsg = error.response.data?.message || null;

    switch (status) {
      case 400:
        return serverMsg || "Bad request — please check your input.";
      case 401:
        return serverMsg || "Unauthorized — please log in again.";
      case 403:
        return serverMsg || "You don’t have permission to perform this action.";
      case 404:
        return serverMsg || "Resource not found — it may have been deleted.";
      case 409:
        return serverMsg || "Conflict — this resource already exists.";
      case 422:
        return serverMsg || "Validation failed — please review your data.";
      case 429:
        return "Too many requests — please slow down.";
      case 500:
        return "Server error — we’re working on it. Try again later.";
      case 503:
        return "Service unavailable — please try again in a few minutes.";
      default:
        return serverMsg || `Unexpected error (${status}) — please try again.`;
    }
  }

  // No response at all (server unreachable)
  if (error.request) {
    return "No response from server — please check your connection or try again later.";
  }

  // Unknown error
  return error.message || defaultMsg;
}
