import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonSpinner, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { PriceEmpireService } from '../pricempire.service';
import { CsApiService } from '../csapi.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    CommonHeaderComponent,
    IonItem,
    IonInput,
    FormsModule,
    IonSpinner,
    IonButton
  ],
})
export class Tab2Page implements OnInit {
  apiData: any = { descriptions: [] };
  searchTerm: string = '';
  randomWeapons: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 21;
  totalPages: number = 1;

  constructor(private priceEmpire: PriceEmpireService, private csapi: CsApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.priceEmpire.getData().subscribe({
      next: (data: unknown) => {
        const weapons: any[] = [];
        const exteriors = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
        const excluded = ['STICKER', 'MUSIC KIT', 'SEALED GRAFFITI', 'COLLECTION', 'PATCH'];
  
        for (const key in (data as Record<string, any>)) {
          if ((data as Record<string, any>).hasOwnProperty(key)) {
            if (excluded.some(word => key.toUpperCase().includes(word.toUpperCase()))) {
              continue;
            }
    
            let name = key;
            let type = '';
            if (key.includes('|')) {
              const parts = key.split('|');
              name = parts[0].trim();
              type = parts[1].trim();
            }
            weapons.push({
              name,
              type,
              icon_url: 'assets/icon/favicon.png',
              tags: [{
                category: 'Exterior',
                localized_tag_name: exteriors[Math.floor(Math.random() * exteriors.length)]
              }]
            });
          }
        }
    
        this.csapi.getSkinData().subscribe(apiData => {
          weapons.forEach(weapon => {
            const matchingKey = Object.keys(apiData).find(key =>
              key.includes(weapon.name) && key.includes(weapon.type)
            );
            if (matchingKey) {
              const skinDetails = apiData[matchingKey];
              weapon.icon_url = skinDetails.image;
              weapon.rarity = skinDetails.type;
            }
          });
          this.apiData = { descriptions: weapons };
          this.updateRandomWeapons(); // Update randomWeapons after data is processed
          console.log('Merged API data:', this.apiData);
        });
      },
      error: (err) => console.error('API error:', err)
    });
  }

  updateRandomWeapons() {
    this.randomWeapons = this.getRandomWeapons();
    this.totalPages = Math.ceil(this.randomWeapons.length / this.itemsPerPage);
  }

  getRandomWeapons(): any[] {
    if (!this.apiData || !this.apiData.descriptions) return [];
    let items = [...this.apiData.descriptions];
    if(this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
      );
    }
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
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
          return 0;
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

  getIconUrl(item: any): string {
    if (item.icon_url.startsWith('http')) {
      return item.icon_url;
    }
    return `http://cdn.steamcommunity.com/economy/image/${item.icon_url}`;
  }

  onSearchTermChange() {
    this.currentPage = 1;
    this.updateRandomWeapons();
  }

  getPaginatedWeapons(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.randomWeapons.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}