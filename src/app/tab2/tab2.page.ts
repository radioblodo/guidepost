import { Component } from '@angular/core';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
	constructor(public photoService: PhotoService) {} 

  // CHANGE: Add call to `loadSaved()` when navigating to the Photos tab
  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  
  addPhotoToGallery() {
	  this.photoService.addNewToGallery();
	}

}
