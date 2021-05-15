import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";

declare const gapi: any;

export interface GoogleUser {
	jwt: string;
}

interface RawGoogleUser {
    getAuthResponse(): RawGoogleUserAuthResponse
}

interface RawGoogleUserAuthResponse {
    id_token: string;
}

interface GoogleAuth2 {

}

@Injectable()
export class GoogleAuthService {

	private googleAuth2Observable: Observable<any>;

	constructor(private ngZone: NgZone) {
		this.googleAuth2Observable = this.getGoogleAuth2Observable();
	}

	isUserLoggedInGoogle(): Observable<boolean> {
		return this.googleAuth2Observable.pipe(map((auth2) => {
			return auth2.isSignedIn.get();
		}));
	}

	getCurrentGoogleUser(): Observable<GoogleUser> {
		return this.googleAuth2Observable.pipe(map((auth2) => {
			let rawGoogleUser = auth2.currentUser.get();

			return this.mapRawGoogleUserToGoogleUser(rawGoogleUser);
		}));
	}

	loginGoogleUser(): Observable<GoogleUser> {
		return new Observable(observer => {
			this.googleAuth2Observable.subscribe(auth2 => {
                auth2.signIn().then((rawGoogleUser: RawGoogleUser) => {
                    this.ngZone.run(() => {
                        observer.next(this.mapRawGoogleUserToGoogleUser(rawGoogleUser));
                        observer.complete();
                    });
                }, (errorResponse: unknown) => {
                    this.ngZone.run(() => {
                        observer.error(errorResponse);
                    });
                });

				let googleUser = auth2.currentUser.get();

				return {
					jwt: googleUser.getAuthResponse().id_token
				};
			});
		});
	}

	logoutGoogleUser(): Observable<void> {
		return new Observable(observer => {
			this.googleAuth2Observable.subscribe(auth2 => {
				auth2.signOut().then(() => {
					this.ngZone.run(() => {
						observer.next();
						observer.complete();
					});
				}, (error: unknown) => {
					this.ngZone.run(() => {
						observer.error(error);
					});
				});
			}, (error) => {
				observer.error(error);
			});
		});
	}

	private mapRawGoogleUserToGoogleUser(rawGoogleUser: RawGoogleUser): GoogleUser {
		return {
			jwt: rawGoogleUser.getAuthResponse().id_token
		};
	}

	private getGoogleAuth2Observable(): Observable<GoogleAuth2> {
		return new Observable<GoogleAuth2>(observer => {
			gapi.load('auth2', () => {
				gapi.auth2.init({
					client_id: environment.googleOauthClientId,
					cookiepolicy: 'single_host_origin',
					scope: 'profile email'
				}).then((auth2: GoogleAuth2) => {
					this.ngZone.run(() => {
						observer.next(auth2);
						observer.complete();
					});
				}, (error: unknown) => {
					this.ngZone.run(() => {
						observer.error(error);
					});
				});
			});
		}).pipe(shareReplay(1));
	}
}
