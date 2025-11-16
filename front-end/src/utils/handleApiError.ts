interface ApiError {
  data?: {
    msg?: string;
    message?: string;
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  );
}

export function handleApiError(error: unknown) {
  if (isApiError(error)) {
    const msg = error.data?.msg || error.data?.message;
    if (msg) return msg;
  }
  return "Something went wrong!";
}
