import { NgModule } from '@angular/core';
import {RouterModule, Router, Routes} from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesResolver } from './recipes/recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
        {path: '', component: RecipeStartComponent},
        {path: 'new', component: RecipeEditComponent},
        {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolver]},
        {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolver]}
    ]},
    {path: 'shopping-list', component: ShoppingListComponent},
    {path: 'auth', component: AuthComponent},
    {path: '**', redirectTo: '/recipes'}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRouterModule {

}
