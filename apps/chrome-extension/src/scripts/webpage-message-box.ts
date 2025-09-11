/// <reference types="chrome" />

// 网页消息盒子 - 专注于消息获取和展示
class WebpageMessageBox {
  private container: HTMLElement | null = null;
  private messageList: HTMLElement | null = null;
  private messages: Array<{ content: string; time: string }> = [];

  constructor() {
    this.createMessageBox();
    this.setupMessageListener();
  }

  private createMessageBox() {
    // 创建消息盒子容器
    this.container = document.createElement('div');
    this.container.id = 'midscene-bridge-message-box';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 8px;
      padding: 12px;
      font-family: monospace;
      font-size: 12px;
      z-index: 999999;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // 创建标题
    const title = document.createElement('div');
    title.textContent = 'Bridge Messages';
    title.style.cssText = `
      font-weight: bold;
      margin-bottom: 8px;
      border-bottom: 1px solid #333;
      padding-bottom: 4px;
    `;

    // 创建消息列表容器
    this.messageList = document.createElement('div');
    this.messageList.style.cssText = `
      max-height: 350px;
      overflow-y: auto;
    `;

    this.container.appendChild(title);
    this.container.appendChild(this.messageList);
    document.body.appendChild(this.container);
  }

  private setupMessageListener() {
    // 监听来自background script的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateWebpageMessage') {
        this.addMessage(request.data);
        sendResponse({ success: true });
      }
    });
  }

  private addMessage(data: { content: string; time: string; type: string }) {
    // 添加消息到数组
    this.messages.push({
      content: data.content,
      time: data.time,
    });

    // 限制消息数量，保持性能
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(-50);
    }

    // 更新DOM
    this.updateMessageList();
  }

  private updateMessageList() {
    if (!this.messageList) return;

    // 清空现有内容
    this.messageList.innerHTML = '';

    // 渲染所有消息
    this.messages.forEach((msg) => {
      const messageElement = document.createElement('div');
      messageElement.style.cssText = `
        margin-bottom: 4px;
        padding: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        word-break: break-all;
      `;

      messageElement.innerHTML = `
        <div style="color: #888; font-size: 10px;">${msg.time}</div>
        <div>${msg.content}</div>
      `;

      this.messageList?.appendChild(messageElement);
    });

    // 滚动到底部
    if (this.messageList) {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }
  }
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WebpageMessageBox();
  });
} else {
  new WebpageMessageBox();
}
