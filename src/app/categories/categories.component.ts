import {Component, OnInit} from '@angular/core';
import {Category} from "./category.model";
import {CategoriesService} from "./categories.service";
import {isRestException} from "../shared/rest-exception.model";

@Component({
	selector: 'categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

	categories: Category[];
	newCategoryName: string;
	createCategoryInProgress: boolean;
	errorMessage: string;

	constructor(private categoriesService: CategoriesService) {
		this.categories = [];
		this.createCategoryInProgress = false;
		this.errorMessage = undefined;
	}

	ngOnInit() {
		this.loadCategories();
	}

	createCategory() {
		this.createCategoryInProgress = true;

		this.categoriesService.createCategory(this.newCategoryName)
			.subscribe(() => {
					this.newCategoryName = "";
					this.errorMessage = undefined;
					this.loadCategories();
				},
				(errorResponse) => {
					if (isRestException(errorResponse.error))
						this.errorMessage = errorResponse.error.message;
					else
						this.errorMessage = "Unknown error";
				},
				() => this.createCategoryInProgress = false);
	}

	private loadCategories() {
		this.categories = [];

		this.categoriesService.getUserCategories()
			.subscribe(category => this.categories.push(category),
				undefined,
				() => this.categories = this.categories.sort(((a, b) => b.numberOfUses - a.numberOfUses)));
	}
}
