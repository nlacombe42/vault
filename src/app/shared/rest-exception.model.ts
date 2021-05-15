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

export function isRestException(object: unknown): object is RestException {
	const restException = new RestException("", "");

    if (typeof object !== 'object') {
        return false;
    }

    if (!object) {
        return false;
    }

	for (let prop in restException)
		if (!(prop in object))
			return false;

	return true;
}
