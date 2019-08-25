import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './service/shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient, StartEdit } from './store/shopping-list.action';
import { State } from './store/shopping-list.reducer';
import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    this.store.select('shoppingList').subscribe(values => {
      console.log(values);
    });
  }

  onEditItem(index: number) {
    console.log(index);
    this.store.dispatch(new StartEdit(index));
  }

}
