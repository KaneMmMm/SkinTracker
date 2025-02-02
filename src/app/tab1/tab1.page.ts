import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonImg, IonIcon } from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonImg, IonIcon, CommonHeaderComponent],
})
export class Tab1Page implements OnInit, OnDestroy {
  currentUser: any;
  subscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateToTab2() {
    this.router.navigateByUrl('/tabs/tab2');
  }

  navigateToTab3() {
    this.router.navigateByUrl('/tabs/tab3');
  }
}