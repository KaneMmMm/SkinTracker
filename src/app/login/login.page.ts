import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule, CommonHeaderComponent]
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private storage: Storage, private router: Router, private authService: AuthService) { }

  async ngOnInit() {
    await this.storage.create();
  }

  async onLogin() {
    const users: any[] = await this.storage.get('users') || [];
    const user = users.find(u => u.username === this.username);

    if (user) {
      const passwordMatch = await bcrypt.compare(this.password, user.password);
      if (passwordMatch) {
        console.log('Login successful');
        await this.authService.setCurrentUser(user);
        this.errorMessage = '';
        await this.storage.set('currentUser', user);
        this.router.navigateByUrl('/tabs/tab1');
      } else {
        console.error('Invalid credentials');
        this.errorMessage = 'Invalid username or password';
      }
    } else {
      console.error('No user registered');
      this.errorMessage = 'No registered user found. Please register first.';
    }
  }
}