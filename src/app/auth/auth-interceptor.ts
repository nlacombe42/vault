import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private injector: Injector, private router: Router) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authService = this.injector.get(AuthService);

		let authToken = authService.getAuthToken();
		let authReq = req;

		if (authToken !== null)
			authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + authToken)});

		return next.handle(authReq).pipe(tap(() => {}, errorResponse => {
			if (errorResponse instanceof HttpErrorResponse && errorResponse.status == 401)
				this.router.navigate(['/login']);
		}));
	}

}
