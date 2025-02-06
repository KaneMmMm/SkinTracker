import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonModal, IonItem, IonLabel, IonInput, IonTextarea} from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { Storage } from '@ionic/storage-angular';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonButtons, 
    IonIcon, 
    IonModal, 
    IonLabel, 
    IonItem,
    IonInput,
    IonTextarea,
    IonList,
    CommonModule, FormsModule, CommonHeaderComponent]
})
export class Tab5Page implements OnInit {
  isModalOpen: boolean = false;
  supportFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  tickets: any[] = [];
  currentUser: any = null;
  private storageInitialized: Promise<void>;

  constructor(private storage: Storage) {
    this.storageInitialized = this.initStorage();
   }

  async ngOnInit() {
    await this.storageInitialized;
    this.currentUser = await this.storage.get('currentUser');
    const savedTickets = await this.storage.get('tickets');
    if (savedTickets) {
      this.tickets = (this.currentUser && this.currentUser.username) ? savedTickets.filter((ticket: any) => ticket.owner === this.currentUser.username) : [];
    }
  }

  async initStorage() {
    await this.storage.create();
  }

  openModal() {
    this.isModalOpen = true;
    console.log('Modal opened');
  }

  generateTicketID(user: string): string {
    const data = user + Date.now().toString();
    const hash = bcrypt.hashSync(data, 10);
    let digits = hash.replace(/\D/g, '').substring(0, 10);
    if (digits.length < 10) {
      digits = digits.padEnd(10, '0');
    }
    return digits;
  }

  async submitSupportForm() {
    const subjectRegex = /^[A-Za-z]{1,12}$/;
    if(!subjectRegex.test(this.supportFormData.subject)) {
      alert('Subject must be between 1 and 12 characters long and contain only letters');
      return;
    }

    const userIdentifier = (this.currentUser && this.currentUser.username) || 'GUEST';
    const ticketID = this.generateTicketID(userIdentifier);
    const newTicket = {
      ticketID,
      date: new Date(),
      solved: false,
      owner: userIdentifier,
      ...this.supportFormData
    };

    let globalTickets = await this.storage.get('tickets') || [];
    globalTickets.push(newTicket);
    await this.storage.set('tickets', globalTickets);

    this.tickets = globalTickets.filter((ticket: any) => ticket.owner === userIdentifier);

    console.log('New ticket created:', newTicket);

    this.supportFormData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    this.isModalOpen = false;
  }

}
