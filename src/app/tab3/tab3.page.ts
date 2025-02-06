import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonItem, IonInput, IonCheckbox } from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonModal, IonItem, IonInput, IonButton, IonButtons, IonCheckbox, FormsModule, CommonHeaderComponent],
})
export class Tab3Page implements OnInit {
  inventoryData: any = null;
  filteredData: any = null;
  savedInventory: any = null;
  currentUser: any = null;
  showTradeLinkModal: boolean = false;
  showFilteredDataModal: boolean = false;
  tradeLink: string = '';
  isEditingInventory: boolean = false;

  constructor(private authService: AuthService, private storage: Storage, private http: HttpClient) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.loadSavedInventory();
      }
    });
  }

  async loadSavedInventory() {
    if (this.currentUser) {
      const inventoryKey = `inventory_${this.currentUser.username}`;
      this.savedInventory = await this.storage.get(inventoryKey) || [];

      this.savedInventory = this.savedInventory.map((item: any) => {
        const storedItem = this.savedInventory.find((stored: any) => stored.icon_url === item.icon_url);
        return {
          ...item,
          selected: storedItem ? storedItem.selected : false,
        };
      });
    }
  }

  onImportInventory() {
    if (this.currentUser && !this.currentUser.tradeLink) {
      this.showTradeLinkModal = true;
      console.log('Modal opened');
    } else {
      console.log('Importing inventory');
      if (this.currentUser?.tradeLink) {
        const partnerParam = this.currentUser.tradeLink.split('?partner=')[1];
        if (partnerParam) {
          const partnerId = partnerParam.split('&')[0];
          console.log('Partner ID:', partnerId);

          const accountId = BigInt(partnerId);
          const steam64 = accountId + 76561197960265728n;
          this.fetchInventoryData(steam64.toString());
          this.showFilteredDataModal = true;
        }
      }
    }
  }

  fetchInventoryData(steam64: string) {
    const apiUrl = `/api/inventory/${steam64}/730/2?l=english&count=5000`;
    this.http.get(apiUrl).subscribe({
      next: (data) => {
        this.inventoryData = data;
        const inventoryData = data as { descriptions: any[] };
        this.filteredData = inventoryData.descriptions.filter((item: any) => 
          item.type.includes('Pistol') || 
          item.type.includes('Rifle') || 
          item.type.includes('SMG') ||
          item.type.includes('Knife') ||
          item.type.includes('Glove') ||
          item.type.includes('Shotgun')
        ).map(item => ({ ...item, selected: false }));

        this.filteredData = this.filteredData.filter((item: any) => 
          !this.savedInventory.some((savedItem: any) => savedItem.icon_url === item.icon_url)
        );

        console.log('Filtered inventory data:', this.filteredData);
      },
      error: (err) => console.error('API error', err)
    });
  }

  getExteriorTag(tags: any[]): string {
    const exteriorTag = tags.find(tag => tag.category === 'Exterior');
    return exteriorTag ? exteriorTag.localized_tag_name : 'Unknown';
  }

  getExteriorFloat(tags: any[]): number {
    const exteriorTag = tags.find(tag => tag.category === 'Exterior');
    if (exteriorTag) {
      const tag = exteriorTag.localized_tag_name;
      switch(tag) {
        case 'Factory New':
          return 0.035;
        case 'Minimal Wear':
          return 0.11;
        case 'Field-Tested':
          return 0.265;
        case 'Well-Worn':
          return 0.415;
        case 'Battle-Scarred':
          return 0.725;
        default:
          return tag;
      }
    }
    return 0;
  }

  getRarityColor(type: string): string {
    if (type.includes('Covert')) {
      return '#eb4b4b';
    } else if (type.includes('Classified')) {
      return '#d32ce6';
    } else if (type.includes('Restricted')) {
      return '#8847ff';
    } else if (type.includes('Mil-Spec')) {
      return '#4b69ff';
    } else if (type.includes('Consumer')) {
      return '#b0c3d9';
    } else if (type.includes('Industrial')) {
      return '#5e98d9';
    } else {
      return 'black';
    }
  }

  async submitTradeLinkModal() {
    if (this.currentUser) {
      this.currentUser.tradeLink = this.tradeLink;
      await this.updateUser();
    }
    this.showTradeLinkModal = false;
    console.log('Submitted trade link:', this.tradeLink);
  }

  async updateUser() {
    await this.storage.set('currentUser', this.currentUser);
    this.authService.updateCurrentUser(this.currentUser);
    
    const users = (await this.storage.get('users')) || [];
    const userIndex = users.findIndex((u: any) => u.username == this.currentUser.username);
    if (userIndex !== -1) {
      users[userIndex] = this.currentUser;
      await this.storage.set('users', users);
    }
    console.log("User information updated");
  }

  async saveSelectedSkins() {
    const selectedSkins = this.filteredData.filter((item: any) => item.selected);
    console.log('Selected skins:', selectedSkins);
  
    if (this.currentUser) {
      const inventoryKey = `inventory_${this.currentUser.username}`;
      const existingInventory = await this.storage.get(inventoryKey) || [];
  
      const mergedInventory = [...existingInventory, ...selectedSkins];

      mergedInventory.forEach((item: any) => {
        const selectedItem = selectedSkins.find((selected: any) => selected.icon_url === item.icon_url);
        item.selected = !!selectedItem;
      });
  
      await this.storage.set(inventoryKey, mergedInventory);
      console.log(`Inventory saved for user ${this.currentUser.username}`);
      this.loadSavedInventory();
    }
    
    this.filteredData.forEach((item: any) => item.selected = false);

  
    this.showFilteredDataModal = false;
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
  }

  async removeSelectedSkins() {
    const selectedSkins = this.savedInventory.filter((item: any) => item.selected);
    console.log('Selected skins:', selectedSkins);
  
    if (this.currentUser) {
      const inventoryKey = `inventory_${this.currentUser.username}`;
      const existingInventory = await this.storage.get(inventoryKey) || [];
  
      const updatedInventory = existingInventory.filter((item: any) => !selectedSkins.some((selectedItem: any) => selectedItem.icon_url === item.icon_url));

      // Save selected state to storage
      updatedInventory.forEach((item: any) => {
        item.selected = false;
      });
  
      await this.storage.set(inventoryKey, updatedInventory);
      console.log(`Inventory updated for user ${this.currentUser.username}`);
      this.loadSavedInventory();
    }
  
    this.isEditingInventory = false;
  }
}