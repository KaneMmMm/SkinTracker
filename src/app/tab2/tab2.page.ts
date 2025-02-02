import { Component, OnInit } from '@angular/core'; // added OnInit import
import { CommonModule } from '@angular/common'; // added CommonModule import
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonHeaderComponent } from '../common-header/common-header.component';
import { PriceEmpireService } from '../pricempire.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonHeaderComponent] // added CommonModule here
})
export class Tab2Page implements OnInit {
  apiData: any;

  constructor(private priceEmpire: PriceEmpireService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.priceEmpire.getData().subscribe({
      next: (data) => {
        this.apiData = data;
        console.log('API data:', data);
      },
      error: (err) => console.error('API error:', err)
    });
  }
}