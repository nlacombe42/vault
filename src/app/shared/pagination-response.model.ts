import {PaginationRequest} from "./pagination-request.model";

export class PaginationResponse<ElementType> {
	paginationRequest: PaginationRequest;
	elements: ElementType[];
	total: number;

	constructor(paginationRequest: PaginationRequest, total: number, elements: ElementType[]) {
		this.paginationRequest = paginationRequest;
		this.total = total;
		this.elements = elements;
	}
}
