import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/*
  errorInterceptor
  ----------------
  Centralised error handler for all HTTP requests.
  This ensures:
  - Consistent error formatting across the entire app
  - Cleaner components (no repeated try/catch logic)
  - Clear mapping of backend status codes to frontend-friendly messages
*/

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      /*
       -----------------------------
       400 — Bad Request (Validation errors)
       -----------------------------
       ASP.NET typically returns validation errors in:
       error.error.message and error.error.errors
      */
      if (error.status === 400) {
        return throwError(() => ({
          type: 'VALIDATION_ERROR',
          message: error.error?.message || 'Invalid input',
          details: error.error?.errors || null
        }));
      }

      /*
       -----------------------------
       401 — Unauthorized (Login failure)
       -----------------------------
       Triggered when credentials are incorrect or token is missing.
      */
      if (error.status === 401) {
        return throwError(() => ({
          type: 'AUTH_ERROR',
          message: 'Invalid email or password'
        }));
      }
      /*
        -----------------------------
        403 — Forbidden
        -----------------------------
        User is authenticated but not allowed to perform the action.
      */
      if (error.status === 403) {
        return throwError(() => ({
          type: 'FORBIDDEN',
          message: 'You do not have permission to perform this action'
        }));
      }

      
      /* 
        -----------------------------
        404 — Not Found
        -----------------------------
        Backend often returns a plain string like "User not found".
      */
      if (error.status === 404) {
        return throwError(() => ({
          type: 'NOT_FOUND',
          // error.error contains the "User not found" string from C#
          message: error.error || 'The requested resource was not found'
        }));
      }

      /*
        -----------------------------
        409 — Conflict
        -----------------------------
        Common for duplicate email/username during registration.
      */
      if (error.status === 409) {
        return throwError(() => ({
          type: 'CONFLICT',
          // error.error is the string "User with that email or username already exists"
          message: error.error || 'This account  already exists.' 
        }));
      }

      /*
        -----------------------------
        500+ — Server Errors
        -----------------------------
        Covers any unhandled backend exception.
      */
      if (error.status >= 500) {
        return throwError(() => ({
          type: 'SERVER_ERROR',
          message: 'Something went wrong on our side'
        }));
      }

      /*
        -----------------------------
        Fallback — Unknown Error
        -----------------------------
        Catches network failures, CORS issues, or unexpected responses.
      */
      return throwError(() => ({
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred'
      }));
    })
  );
};