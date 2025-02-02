import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, CommonModule, FormsModule, CommonHeaderComponent]
})
export class RegisterPage implements OnInit {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  profilePic: string = '';
  constructor(private storage: Storage, private router: Router) { }
  
  async ngOnInit() {
    await this.storage.create();
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePic = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      console.error(this.errorMessage);
      return;
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);

    const newUser = { 
      username: this.username, 
      email: this.email, 
      tradeLink: '',
      phoneNumber: '',
      password: hashedPassword,
      profilePic: this.profilePic 
    };

    const users = (await this.storage.get('users')) || [];

    users.push(newUser);

    await this.storage.set('users', users);

    console.log('Saved:', newUser);
    this.router.navigateByUrl('/tabs/tab4');
  }
}