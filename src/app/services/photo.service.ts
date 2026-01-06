import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; 
// CHANGE: Add import
import type { Photo } from '@capacitor/camera';
// CHANGE: Add import
import { Filesystem, Directory } from '@capacitor/filesystem';
// CHANGE: Add import
import { Preferences } from '@capacitor/preferences';

// To distinguish the platform the app is running on 
import { Platform } from '@ionic/angular'; 
// Change: Add import
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
	public photos: UserPhoto[] = []; 
	
	// CHANGE: Add a key for photo storage
  private PHOTO_STORAGE: string = 'photos';
  
	// Property to distinguish the platform the app is running on 
	private platform: Platform; 
	
	// CHANGE: Update constructor to set `platform`
  constructor(platform: Platform) {
    this.platform = platform;
  }
  
	public async addNewToGallery() {
		const capturedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
		});

		// CHANGE: Add `savedImageFile`
		// Save the picture and add it to photo collection
		const savedImageFile = await this.savePicture(capturedPhoto);

		// CHANGE: Update argument to unshift array method
		this.photos.unshift(savedImageFile);
   		 
   // CHANGE: Add method to cache all photo data for future retrieval
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
	}
	
	// CHANGE: Add the `savePicture()` method
	private async savePicture(photo: Photo) {
		let base64Data: string | Blob;

		// Step 1: Check the platform the app is running on 
		if (this.platform.is('hybrid')) {
			// Step 2a: Read the file into base64 format 
			const file = await Filesystem.readFile({
				path: photo.path!
			}); 
			base64Data = file.data; 
		} else {
			// Step 2b: Fetch the photo, read as a blob, then convert to base64 format
			const response = await fetch(photo.webPath!);
			const blob = await response.blob();
			base64Data = (await this.convertBlobToBase64(blob)) as string;
		}
		
		// Write the file to the data directory
		const fileName = Date.now() + '.jpeg';
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: Directory.Data,
		});

		// CHANGE: Add platform check
		if (this.platform.is('hybrid')) {
			// Display the new image by rewriting the 'file://' path to HTTP
			return {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri),
			};
		} else {
			// Use webPath to display the new image instead of base64 since it's
			// already loaded into memory
			return {
				filepath: fileName,
				webviewPath: photo.webPath,
			};
    }
	}

	// CHANGE: Add the `convertBlobToBase64` method
	private convertBlobToBase64(blob: Blob) {
			return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onerror = reject;
					reader.onload = () => {
							resolve(reader.result);
					};
				reader.readAsDataURL(blob);
			});
	}

	// CHANGE: Add the method to load the photo data
  public async loadSaved() {
    // Retrieve cached photo array data
    const { value: photoList } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

    // CHANGE: Add platform check
		// If running on the web...
		if (!this.platform.is('hybrid')) {
			for (let photo of this.photos) {
				const readFile = await Filesystem.readFile({
						path: photo.filepath,
						directory: Directory.Data
				});

				// Web platform only: Load the photo as base64 data
				photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
			}
		}
  }
  	
}

export interface UserPhoto {
	filepath: string; 
	webviewPath?: string; 
}
