import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDebug } from '@midscene/shared/logger';
import type { DeviceAction, Size } from '../types';
import type { AbstractInterface } from './index';
import {
  defineActionDoubleClick,
  defineActionDragAndDrop,
  defineActionHover,
  defineActionInput,
  defineActionKeyboardPress,
  defineActionRightClick,
  defineActionScroll,
  defineActionTap,
} from './index';

const debug = getDebug('windows-mock');

export interface WindowsMockOptions {
  mockScreenshotDir?: string;
  defaultScreenshot?: string;
}

interface MockImage {
  name: string;
  description: string;
  base64: string;
  width: number;
  height: number;
}

export class WindowsMockDevice implements AbstractInterface {
  interfaceType = 'windows-mock';
  private currentScreenshotIndex = 0;
  private mockImages: Record<string, MockImage> = {};
  private mockScreenshotDir: string;
  private defaultScreenshot: string;

  constructor(options: WindowsMockOptions = {}) {
    this.mockScreenshotDir =
      options.mockScreenshotDir || join(__dirname, '../mock/screenshots');
    this.defaultScreenshot = options.defaultScreenshot || 'desktop-1';
    this.loadMockImages();
  }

  private loadMockImages(): void {
    try {
      const mockImagesPath = join(this.mockScreenshotDir, 'mock-images.json');
      const mockImagesData = readFileSync(mockImagesPath, 'utf-8');
      this.mockImages = JSON.parse(mockImagesData);
      debug('Loaded mock images:', Object.keys(this.mockImages));
    } catch (error) {
      debug('Failed to load mock images:', error);
      // 提供默认的mock图片
      this.mockImages = {
        'desktop-1': {
          name: 'Windows Desktop',
          description: 'A typical Windows desktop',
          base64:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          width: 1920,
          height: 1080,
        },
      };
    }
  }

  async screenshotBase64(): Promise<string> {
    debug('Taking mock screenshot');

    // 循环使用不同的mock图片来模拟屏幕变化
    const imageKeys = Object.keys(this.mockImages);
    if (imageKeys.length === 0) {
      throw new Error('No mock images available');
    }

    const imageKey = imageKeys[this.currentScreenshotIndex % imageKeys.length];
    const mockImage = this.mockImages[imageKey];

    // 更新索引以便下次使用不同的图片
    this.currentScreenshotIndex++;

    debug(`Using mock image: ${imageKey} (${mockImage.name})`);

    // 返回base64数据，去掉data:image/png;base64,前缀
    return mockImage.base64.replace(/^data:image\/[a-z]+;base64,/, '');
  }

  async size(): Promise<Size> {
    const imageKeys = Object.keys(this.mockImages);
    const imageKey =
      imageKeys[this.currentScreenshotIndex % imageKeys.length] ||
      this.defaultScreenshot;
    const mockImage =
      this.mockImages[imageKey] ||
      this.mockImages[Object.keys(this.mockImages)[0]];

    return {
      width: mockImage.width,
      height: mockImage.height,
    };
  }

  async actionSpace(): Promise<DeviceAction[]> {
    return [
      defineActionTap(async (param) => {
        debug('Mock tap action:', param);
        // 模拟点击操作
        await this.simulateDelay();
      }),

      defineActionDoubleClick(async (param) => {
        debug('Mock double click action:', param);
        await this.simulateDelay();
      }),

      defineActionRightClick(async (param) => {
        debug('Mock right click action:', param);
        await this.simulateDelay();
      }),

      defineActionHover(async (param) => {
        debug('Mock hover action:', param);
        await this.simulateDelay();
      }),

      defineActionInput(async (param) => {
        debug('Mock input action:', param);
        await this.simulateDelay();
      }),

      defineActionKeyboardPress(async (param) => {
        debug('Mock keyboard press action:', param);
        await this.simulateDelay();
      }),

      defineActionScroll(async (param) => {
        debug('Mock scroll action:', param);
        await this.simulateDelay();
      }),

      defineActionDragAndDrop(async (param) => {
        debug('Mock drag and drop action:', param);
        await this.simulateDelay();
      }),
    ];
  }

  private async simulateDelay(): Promise<void> {
    // 模拟操作延迟，让操作看起来更真实
    const delay = Math.random() * 200 + 100; // 100-300ms随机延迟
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  describe(): string {
    return `Windows Mock Device (${Object.keys(this.mockImages).length} mock images available)`;
  }

  async beforeInvokeAction(actionName: string, param: any): Promise<void> {
    debug(`Before action: ${actionName}`, param);
  }

  async afterInvokeAction(actionName: string, param: any): Promise<void> {
    debug(`After action: ${actionName}`, param);
  }

  async destroy(): Promise<void> {
    debug('Destroying Windows mock device');
    // 清理资源
    this.mockImages = {};
  }

  // 添加方法来切换当前使用的mock图片
  setCurrentScreenshot(imageKey: string): void {
    if (this.mockImages[imageKey]) {
      const imageKeys = Object.keys(this.mockImages);
      this.currentScreenshotIndex = imageKeys.indexOf(imageKey);
      debug(`Switched to mock image: ${imageKey}`);
    } else {
      debug(`Mock image not found: ${imageKey}`);
    }
  }

  // 获取可用的mock图片列表
  getAvailableScreenshots(): string[] {
    return Object.keys(this.mockImages);
  }

  // 添加新的mock图片
  addMockImage(key: string, image: MockImage): void {
    this.mockImages[key] = image;
    debug(`Added mock image: ${key}`);
  }
}
