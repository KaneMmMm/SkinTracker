import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonImg]
})
export class CommonHeaderComponent implements OnInit, OnDestroy {
  currentUser: any;
  subscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goTab1() {
    this.router.navigateByUrl('/tabs/tab1');
  }
  
  goTab4() {
    this.router.navigateByUrl('/tabs/tab4');
  }
}