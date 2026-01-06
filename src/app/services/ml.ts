import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';

type YoloPluginType = {
  loadModel(options: { path: string }): Promise<{ ok: boolean }>;
  detect(options: { imageBase64: string }): Promise<any>;
};

const YoloPlugin = registerPlugin<YoloPluginType>('YoloPlugin');

@Injectable({ providedIn: 'root' })
export class MlService {
  private inited = false;

  async init() {
    if (this.inited) return;
    await YoloPlugin.loadModel({ path: 'models/yolo11n_float16.tflite' });
    this.inited = true;
  }

  async detect(imageBase64: string) {
    await this.init();
    return YoloPlugin.detect({ imageBase64 });
  }
}
