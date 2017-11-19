import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Category} from "./category.model";
import "rxjs/add/operator/share";

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

	private createCategoriesObservable(): Observable<Category> {
		let getCategoriesObservable =
			this.http.get<Category[]>(this.vaultCategoriesUrl)
				.flatMap(categories => Observable.from(categories))
				.share();

		getCategoriesObservable.toArray().subscribe(categories => this.categories = categories);

		return getCategoriesObservable;
	}
}
