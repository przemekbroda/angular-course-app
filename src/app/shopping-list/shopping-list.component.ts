import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './service/shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient } from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    this.store.select('shoppingList').subscribe(values => {
      console.log(values);
    })
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

}
