import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

//errorInterceptor handles incoming failures. 

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // Handle 400
      if (error.status === 400) {
        return throwError(() => ({
          type: 'VALIDATION_ERROR',
          message: error.error?.message || 'Invalid input',
          details: error.error?.errors || null
        }));
      }

      // Handle 401
      if (error.status === 401) {
        return throwError(() => ({
          type: 'AUTH_ERROR',
          message: 'Invalid email or password'
        }));
      }

      // Handle 403
      if (error.status === 403) {
        return throwError(() => ({
          type: 'FORBIDDEN',
          message: 'You do not have permission to perform this action'
        }));
      }

      // Handle 404
      if (error.status === 404) {
        return throwError(() => ({
          type: 'NOT_FOUND',
          // error.error contains the "User not found" string from C#
          message: error.error || 'The requested resource was not found'
        }));
      }

      // Handle 409 (ASP.NET returns conflict)
      if (error.status === 409) {
        return throwError(() => ({
          type: 'CONFLICT',
          // error.error is the string "User with that email or username already exists"
          message: error.error || 'This account  already exists.' 
        }));
      }

      // Handle 500+
      if (error.status >= 500) {
        return throwError(() => ({
          type: 'SERVER_ERROR',
          message: 'Something went wrong on our side'
        }));
      }

      // Fallback
      return throwError(() => ({
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred'
      }));
    })
  );
};