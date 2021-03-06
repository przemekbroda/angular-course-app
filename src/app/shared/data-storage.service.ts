import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/service/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
    constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put('https://ng-course-recipe-84edc.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        // return this.authService.userSubject.pipe(take(1), exhaustMap(user => {
        //     return this.http.get<Recipe[]>('https://ng-course-recipe-84edc.firebaseio.com/recipes.json', {
        //         params: {
        //             auth: user.token
        //         }
        //     });
        // }), map(recipes => {
        //     return recipes.map(recipe => {
        //         return {
        //             ...recipe,
        //             ingredients: recipe.ingredients ? recipe.ingredients : []
        //         };
        //     });
        // }),
        //     tap(recipes => {
        //         this.recipesService.setRecipes(recipes);
        //     }));

        return this.http.get<Recipe[]>('https://ng-course-recipe-84edc.firebaseio.com/recipes.json')
            .pipe(map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
                tap(recipes => {
                    this.recipesService.setRecipes(recipes);
                }));
    }
}
