// In src/app/tab4/tab4.page.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonItem, IonInput, IonImg } from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, IonInput, IonItem, IonImg, CommonModule, FormsModule, CommonHeaderComponent]
})
export class Tab4Page implements OnInit {
  currentUser: any = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private authService: AuthService, private storage: Storage) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  goLogin() {
    this.router.navigateByUrl('/login');
  }

  goRegister() {
    this.router.navigateByUrl('/register');
  }

  async logOut() {
    await this.authService.removeCurrentUser();
    this.router.navigateByUrl('/tabs/tab4');
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        if (this.currentUser) {
          this.currentUser.profilePic = reader.result as string;
          await this.storage.set('currentUser', this.currentUser);
          this.authService.updateCurrentUser(this.currentUser);

          const users = (await this.storage.get('users')) || [];
          const userIndex = users.findIndex((u: any) => u.username === this.currentUser.username);
          if (userIndex !== -1) {
            users[userIndex].profilePic = this.currentUser.profilePic;
            await this.storage.set('users', users);
          }

          console.log('Profile picture updated');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async submitTradeLink() {
    if (this.currentUser) {
      this.currentUser.tradeLink = this.submitTradeLink;
      await this.updateUser();
    }
  }

  async submitEmail() {
    if (this.currentUser) {
      this.currentUser.email = this.submitEmail;
      await this.updateUser();
    }
  }

  async submitPhoneNumber() {
    if (this.currentUser) {
      this.currentUser.phoneNumber = this.submitPhoneNumber;
      await this.updateUser();
    }
  }

  async updateUser() {
    await this.storage.set('currentUser', this.currentUser);
    this.authService.updateCurrentUser(this.currentUser);

    const users = (await this.storage.get('users')) || [];
    const userIndex = users.findIndex((u: any) => u.username === this.currentUser.username);
    if (userIndex !== -1) {
      users[userIndex] = this.currentUser;
      await this.storage.set('users', users);
    }

    console.log('User information updated');
  }
}