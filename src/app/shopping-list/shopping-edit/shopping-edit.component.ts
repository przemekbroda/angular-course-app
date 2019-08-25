import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../service/shopping-list.service';
import { NgForm } from '@angular/forms';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredient } from '../store/shopping-list.action';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: true}) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editedIngredient = this.shoppingListService.getIngredient(this.editedItemIndex);
        this.editMode = true;
        this.form.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddItem(form: NgForm) {
    const value = form.value;

    const newIngredient = new Ingredient(value.name, value.amount);
    if (!this.editMode) {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new AddIngredient(newIngredient));
    } else {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    }

    this.editMode = false;
    form.reset();
  }

  onClearForm() {
    console.log('onClear');
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClearForm();
  }

}
