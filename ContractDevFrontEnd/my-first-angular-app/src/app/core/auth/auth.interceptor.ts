import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';



 //auth interceptor handles (outgoing tokens) automatically attaches the JWT Bearer token to all outgoing API requests.
 //It also monitors incoming responses for 401 Unauthorized errors.
 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject services using 'inject' since this is a functional interceptor (not a class)
  const auth = inject(AuthService);
  const token = auth.getToken();

   //We clone the original request because HttpRequest objects are immutable.
   //If a token is found in localStorage/Cookie, we add the 'Authorization' header.
   // This is what your C# [Authorize] attribute looks for on the backend.
   
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  
  //response next(authReq) sends the request to the server.
  //We use .pipe() to "listen" to the response coming back from C# (backend).

  return next(authReq).pipe(
    catchError(error => {
       //401 unauthorized: The C# backend rejected the token (expired or manipulated).
       //This is where you should force a logout to clear the stale token from the browser.
  
      if (error.status === 401) {
        console.warn('Unauthorized request - Logging out user.');
        auth.logout(); // clear the state and redirect to login ppage
      }
      // Pass the error back to the component so 'loginError' signal can display it
      return throwError(() => error);
    })
  );
};