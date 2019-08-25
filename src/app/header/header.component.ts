import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userSub = this.authService.userSubject.subscribe(user => {
      this.isAuthenticated = !!user;
      if (!this.isAuthenticated) {
        this.router.navigate(['/auth']);
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

}
