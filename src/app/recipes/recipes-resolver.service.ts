import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './service/recipe.service';

@Injectable()
export class RecipesResolver implements Resolve<Recipe[]> {

    constructor(private dataStorageService: DataStorageService, private recipesService: RecipeService) { }

    resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): any[] | import("rxjs").Observable<any[]> | Promise<any[]> {
       const recipes = this.recipesService.getRecipes();
       if (recipes.length === 0) {
        return this.dataStorageService.fetchRecipes();
       }
    }

}