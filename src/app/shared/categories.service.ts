import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/observable/empty";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import {Category} from "./category.model";

@Injectable()
export class CategoriesService {
	private readonly vaultCategoriesUrl: string = environment.apiBaseUrls.vaultWs + '/v1/categories';

	private categories: Category[];
	private categoriesById: Map<number, Category>;

	constructor(private http: HttpClient) {
		this.categories = undefined;
		this.categoriesById = new Map<number, Category>();
	}

	getUserCategories(): Observable<Category> {
		return new Observable(subscriber => {
			this.loadCategories().subscribe(undefined, undefined, () => {
				this.categories.forEach(category => subscriber.next(category));
				subscriber.complete();
			});
		});
	}

	getCategory(categoryId: number): Observable<Category> {
		return new Observable(subscriber => {
			this.loadCategories().subscribe(undefined, undefined, () => {
				subscriber.next(this.categoriesById.get(categoryId));
				subscriber.complete();
			});
		});
	}

	private loadCategories(): Observable<void> {
		if (this.categories !== undefined)
			return Observable.empty<void>();

		return new Observable<void>(subscriber => {
			this.http.get<Category[]>(this.vaultCategoriesUrl)
				.subscribe(categories => {
					this.categories = categories;
					this.categories.forEach(category => this.categoriesById.set(category.categoryId, category));
					subscriber.next();
					subscriber.complete();
				});
		});
	}
}
