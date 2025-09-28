import { getDebug } from '@midscene/shared/logger';
import {
  WindowsMockDevice,
  type WindowsMockOptions,
} from '../device/windows-mock';
import type { AgentOpt } from '../types';
import { Agent } from './agent';

const debug = getDebug('windows-agent');

export interface WindowsAgentOpt extends AgentOpt {
  mockOptions?: WindowsMockOptions;
}

export class WindowsAgent extends Agent<WindowsMockDevice> {
  constructor(device: WindowsMockDevice, opt?: WindowsAgentOpt) {
    super(device, opt);
    debug('Windows agent created');
  }

  // 添加Windows特有的方法
  async switchMockScreenshot(imageKey: string): Promise<void> {
    this.interface.setCurrentScreenshot(imageKey);
    debug(`Switched to mock screenshot: ${imageKey}`);
  }

  async getAvailableScreenshots(): Promise<string[]> {
    return this.interface.getAvailableScreenshots();
  }
}

// 工厂函数，用于创建Windows Agent
export async function createWindowsAgent(
  opt?: WindowsAgentOpt,
): Promise<WindowsAgent> {
  const device = new WindowsMockDevice(opt?.mockOptions);
  return new WindowsAgent(device, opt);
}
