import {PaginationRequest} from "./pagination-request.model";

export class SearchTransactionsRequest {
	paginationRequest: PaginationRequest;
	categorizedOnly: boolean;
}
