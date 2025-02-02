import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon} from '@ionic/angular/standalone';
import { CommonHeaderComponent } from '../common-header/common-header.component';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, CommonModule, FormsModule, CommonHeaderComponent]
})
export class Tab5Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
