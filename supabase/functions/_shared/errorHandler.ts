/**
 * Centralized error handling for edge functions
 * Provides user-friendly error messages while logging details server-side
 */

interface ErrorResponse {
  error: string;
  code: string;
}

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVICE_ERROR = "SERVICE_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  PAYMENT_REQUIRED = "PAYMENT_REQUIRED",
}

// User-friendly error messages (safe to expose to clients)
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: "Invalid input provided. Please check your data and try again.",
  [ErrorCode.SERVICE_ERROR]: "Service temporarily unavailable. Please try again later.",
  [ErrorCode.RATE_LIMIT]: "Too many requests. Please wait a moment before trying again.",
  [ErrorCode.UNAUTHORIZED]: "Authentication required to access this resource.",
  [ErrorCode.NOT_FOUND]: "The requested resource was not found.",
  [ErrorCode.INTERNAL_ERROR]: "An unexpected error occurred. Please try again later.",
  [ErrorCode.PAYMENT_REQUIRED]: "Payment or credits required. Please check your account.",
};

// HTTP status codes for each error type
const STATUS_CODES: Record<ErrorCode, number> = {
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.SERVICE_ERROR]: 503,
  [ErrorCode.RATE_LIMIT]: 429,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.PAYMENT_REQUIRED]: 402,
};

/**
 * Logs error details server-side and returns a safe error response
 */
export function handleError(
  error: unknown,
  context: string,
  corsHeaders: Record<string, string>,
  errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR
): Response {
  // Log full error details server-side only
  console.error(`[${context}] Error occurred:`, {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    errorCode,
    timestamp: new Date().toISOString(),
  });

  // Return generic user-friendly message
  const responseBody: ErrorResponse = {
    error: ERROR_MESSAGES[errorCode],
    code: errorCode,
  };

  return new Response(JSON.stringify(responseBody), {
    status: STATUS_CODES[errorCode],
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles API errors from external services (OpenAI, Resend, etc.)
 */
export async function handleApiError(
  response: Response,
  context: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const statusCode = response.status;
  let errorCode = ErrorCode.SERVICE_ERROR;

  // Map common API status codes to our error codes
  if (statusCode === 429) {
    errorCode = ErrorCode.RATE_LIMIT;
  } else if (statusCode === 401 || statusCode === 403) {
    errorCode = ErrorCode.UNAUTHORIZED;
  } else if (statusCode === 402) {
    errorCode = ErrorCode.PAYMENT_REQUIRED;
  } else if (statusCode === 404) {
    errorCode = ErrorCode.NOT_FOUND;
  }

  // Log the full API error response server-side
  const errorText = await response.text();
  console.error(`[${context}] API Error:`, {
    status: statusCode,
    body: errorText,
    errorCode,
    timestamp: new Date().toISOString(),
  });

  // Return generic message to client
  const responseBody: ErrorResponse = {
    error: ERROR_MESSAGES[errorCode],
    code: errorCode,
  };

  return new Response(JSON.stringify(responseBody), {
    status: STATUS_CODES[errorCode],
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handles validation errors from Zod
 */
export function handleValidationError(
  validationError: unknown,
  context: string,
  corsHeaders: Record<string, string>
): Response {
  // Log validation details server-side
  console.error(`[${context}] Validation Error:`, {
    error: validationError,
    timestamp: new Date().toISOString(),
  });

  // Return generic validation error to client
  const responseBody: ErrorResponse = {
    error: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
    code: ErrorCode.VALIDATION_ERROR,
  };

  return new Response(JSON.stringify(responseBody), {
    status: STATUS_CODES[ErrorCode.VALIDATION_ERROR],
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
