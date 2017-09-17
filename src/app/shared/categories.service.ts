import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Category} from "./category.model";

@Injectable()
export class CategoriesService {
	private readonly vaultCategoriesUrl: string = environment.apiBaseUrls.vaultWs + '/v1/categories';

	constructor(private http: HttpClient) {
	}

	getUserCategories(): Observable<Category> {
		return this.http.get<Category[]>(this.vaultCategoriesUrl)
			.mergeMap(categories => Observable.from(categories));
	}
}
