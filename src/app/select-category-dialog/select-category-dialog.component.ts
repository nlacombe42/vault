import {Component, OnInit} from "@angular/core";
import {Category} from "../shared/category.model";
import {CategoriesService} from "../shared/categories.service";

@Component({
	selector: 'select-category-dialog',
	templateUrl: './select-category-dialog.component.html',
})
export class SelectCategoryDialog implements OnInit {

	categories: Category[];

	constructor(private categoriesService: CategoriesService) {
		this.categories = [];
	}


	ngOnInit(): void {
		this.categoriesService.getUserCategories()
			.subscribe(category => {
				this.categories.push(category);
			});
	}
}
