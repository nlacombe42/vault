import {PaginationRequest} from "../shared/pagination-request.model";

export class SearchTransactionsRequest {
	paginationRequest: PaginationRequest;
	categorizedOnly: boolean;
}
