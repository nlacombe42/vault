import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, of, from, empty, throwError} from "rxjs";
import {Category} from "./category.model";
import {filter, flatMap, mergeMap, share, shareReplay, toArray} from "rxjs/operators";
import {CategoryCreationRequest} from "./category-creation-request";

@Injectable()
export class CategoriesService {
	private readonly vaultCategoriesUrl: string = environment.apiBaseUrls.vaultWs + '/v1/categories';

	private categoriesById: Map<number, Category> | undefined;
	private categoriesObservable: Observable<Category[]>;

	constructor(private http: HttpClient) {
	    this.categoriesObservable = this.http.get<Category[]>(this.vaultCategoriesUrl).pipe(shareReplay(1));
	}

	getUserCategories(): Observable<Category> {
		return this.categoriesObservable.pipe(
		    mergeMap(categories => of(...categories)),
        );
	}

	getCategory(categoryId: number): Observable<Category> {
	    return this.getUserCategories().pipe(
	        toArray(),
            mergeMap(categories => {
                const category = categories.find(c => c.categoryId === categoryId);

                return category ? of(category) : throwError('category with id not found: ' + categoryId);
            }),
        );
	}

    getCategoryOrUndefinedIfArgumentUndefined(categoryId: number | undefined): Observable<Category | undefined> {
        return !categoryId ? of(undefined) : this.getCategory(categoryId);
    }

	createCategory(newCategoryName: string) {
		let categoryCreationRequest: CategoryCreationRequest = {
			name: newCategoryName
		};

		return this.http.post<void>(this.vaultCategoriesUrl, categoryCreationRequest);
	}
}
