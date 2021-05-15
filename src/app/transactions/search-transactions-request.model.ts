import {PaginationRequest} from "../shared/pagination-request.model";

export interface SearchTransactionsRequest {
	paginationRequest: PaginationRequest;
	categorizedOnly: boolean;
}
