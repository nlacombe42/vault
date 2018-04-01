import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from "../shared/category.model";

@Component({
	selector: 'category-dropdown',
	templateUrl: './category-dropdown.component.html',
	styleUrls: ['./category-dropdown.component.scss']
})
export class CategoryDropdownComponent {

	_categories: Category[];

	@Output()
	selectedCategoryChange = new EventEmitter();

	constructor() {
	}

	selectCategory(category: Category) {
		if (this.selectedCategoryChange)
			this.selectedCategoryChange.emit(category);
	}

	@Input()
	get categories(): Category[] {
		return this._categories;
	}

	set categories(categories: Category[]) {
		this._categories = categories.sort(((a, b) => b.numberOfUses - a.numberOfUses));
	}
}
