import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<any>(null);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const user = await this.storage.get('currentUser');
    this.currentUser$.next(user);
  }

  async setCurrentUser(user: any) {
    await this.storage.set('currentUser', user);
    this.currentUser$.next(user);
  }

  async removeCurrentUser() {
    await this.storage.remove('currentUser');
    this.currentUser$.next(null);
  }

  async updateCurrentUser(user: any) {
    await this.storage.set('currentUser', user);
    this.currentUser$.next(user);
  }
}