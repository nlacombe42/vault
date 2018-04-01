import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Category} from "./category.model";
import 'rxjs/add/observable/of';
import "rxjs/add/observable/from";
import "rxjs/add/observable/empty";
import {mergeMap, share, toArray} from "rxjs/operators";
import {CategoryCreationRequest} from "./category-creation-request";

@Injectable()
export class CategoriesService {
	private readonly vaultCategoriesUrl: string = environment.apiBaseUrls.vaultWs + '/v1/categories';

	private categories: Category[];
	private categoriesById: Map<number, Category>;
	private categoriesObservable: Observable<Category>;

	constructor(private http: HttpClient) {
	}

	getUserCategories(): Observable<Category> {
		if (this.categories !== undefined)
			return Observable.from(this.categories);

		if (this.categoriesObservable === undefined)
			this.categoriesObservable = this.createCategoriesObservable();

		return this.categoriesObservable;
	}

	getCategory(categoryId: number): Observable<Category> {
		if (this.categoriesById !== undefined)
			return Observable.of(this.categoriesById.get(categoryId));

		let categoriesById = new Map<number, Category>();

		return new Observable(observer => {
			this.getUserCategories()
				.subscribe(category => categoriesById.set(category.categoryId, category),
					observer.error,
					() => {
						this.categoriesById = categoriesById;
						observer.next(this.categoriesById.get(categoryId));
						observer.complete();
					});
		});
	}

	createCategory(newCategoryName: string) {
		let categoryCreationRequest: CategoryCreationRequest = {
			name: newCategoryName
		};

		return this.http.post<void>(this.vaultCategoriesUrl, categoryCreationRequest);
	}

	private createCategoriesObservable(): Observable<Category> {
		let getCategoriesObservable =
			this.http.get<Category[]>(this.vaultCategoriesUrl)
				.pipe(
					mergeMap((categories: Category[]) => Observable.from(categories)),
					share());

		getCategoriesObservable.pipe(toArray()).subscribe((categories: Category[]) => this.categories = categories);

		return getCategoriesObservable;
	}
}
