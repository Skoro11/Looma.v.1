import { toast } from "react-toastify";

export function handleApiError(error, defaultMsg = "Something went wrong") {
  if (error.response) {
    const message = error.response.data?.message || defaultMsg;
    toast.error(message);
  } else if (error.request) {
    toast.error("Server not reachable. Check your connection.");
  } else {
    toast.error(defaultMsg);
  }
}
