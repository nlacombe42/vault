export class RestException {
	errorCode: string;
	message: string;

	constructor(errorCode: string, message: string) {
		this.errorCode = errorCode;
		this.message = message;
	}
}

export enum RestExceptionErrorCodes {
	NOT_FOUND = "not-found"
}

export function isRestException(object): object is RestException {
	let restException = new RestException("", "");

	for (let prop in restException)
		if (!(prop in object))
			return false;

	return true;
}
