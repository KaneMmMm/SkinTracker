import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, notificationsOutline, homeOutline, bagOutline, searchOutline, personOutline, personCircleOutline, helpCircleOutline, chatbubbleEllipsesOutline, fileTrayFullOutline, checkmark, checkmarkOutline, closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ 
      triangle, 
      ellipse, 
      square, 
      notificationsOutline, 
      searchOutline, 
      homeOutline, 
      bagOutline, 
      personOutline, 
      personCircleOutline, 
      helpCircleOutline, 
      chatbubbleEllipsesOutline, 
      fileTrayFullOutline,
      checkmarkOutline,
      closeCircleOutline,
      checkmarkCircleOutline
     });
  }
}