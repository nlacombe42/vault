import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private injector: Injector) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authService = this.injector.get(AuthService);
		let authToken = authService.getAuthToken();

		let authReq = req;

		if (authToken !== null)
			authReq = req.clone({headers: req.headers.set('Authorization', 'auth-token ' + authToken)});

		return next.handle(authReq);
	}

}
