import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../service/shopping-list.service';
import { NgForm } from '@angular/forms';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient, UpdateIngredient, DeleteIngredient, StopEdit } from '../store/shopping-list.action';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: true}) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.form.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount});
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  onAddItem(form: NgForm) {
    const value = form.value;

    const newIngredient = new Ingredient(value.name, value.amount);
    if (!this.editMode) {
      this.store.dispatch(new AddIngredient(newIngredient));
    } else {
      this.store.dispatch(new UpdateIngredient(this.editedIngredient));
    }

    this.editMode = false;
    form.reset();
  }

  onClearForm() {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new StopEdit());
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient(this.editedItemIndex));
    this.onClearForm();
  }

}
