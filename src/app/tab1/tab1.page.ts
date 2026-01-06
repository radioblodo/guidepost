import { Component } from '@angular/core';
import { MlService } from '../services/ml'; // adjust path

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(private ml: MlService) {}

  async test() {
    const res = await this.ml.init();
    console.log('loadModel result:', res);
  }
}
