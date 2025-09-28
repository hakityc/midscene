# Windows 平台支持

Midscene 现在支持 Windows 平台的自动化操作，通过 Mock 模式提供截屏和操作指令的模拟执行。

## 功能特性

- ✅ Windows Mock 设备支持
- ✅ 模拟截屏功能（使用预定义图片）
- ✅ 模拟操作指令执行（点击、输入、键盘按键等）
- ✅ 环境切换接口（Browser ↔ Windows）
- ✅ YAML 脚本支持
- ✅ WebSocket API 支持

## 快速开始

### 1. YAML 脚本配置

```yaml
# 配置 Windows 环境
windows:
  mockMode: true
  mockScreenshotDir: "./mock/screenshots"  # 可选，自定义截图目录
  output: "./output/windows-test-result.json"

tasks:
  - name: "Windows 操作测试"
    flow:
      - logScreenshot: "桌面截图"
      - aiAction: "点击开始菜单"
      - aiInput: 
          value: "notepad"
          locate: "搜索框"
      - aiKeyboardPress:
          keyName: "Enter"
```

### 2. 编程方式使用

```typescript
import { createWindowsAgent, WindowsAgent } from '@midscene/core'

// 创建 Windows Agent
const agent = await createWindowsAgent({
  mockOptions: {
    mockScreenshotDir: './custom/screenshots',
    defaultScreenshot: 'desktop-1'
  }
})

// 执行操作
await agent.aiAction('点击开始菜单')
await agent.aiInput('notepad', { locate: '搜索框' })
await agent.aiKeyboardPress('Enter')

// 获取截图
const screenshot = await agent.interface.screenshotBase64()

// 清理资源
await agent.destroy()
```

## 环境切换

### WebSocket API

通过 WebSocket 可以在运行时切换环境：

```javascript
// 切换到 Windows 环境
ws.send(JSON.stringify({
  meta: { messageId: 'msg-001' },
  payload: {
    action: 'switchEnvironment',
    environment: 'windows'
  }
}))

// 切换到 Browser 环境
ws.send(JSON.stringify({
  meta: { messageId: 'msg-002' },
  payload: {
    action: 'switchEnvironment',
    environment: 'browser'
  }
}))

// 获取当前环境状态
ws.send(JSON.stringify({
  meta: { messageId: 'msg-003' },
  payload: {
    action: 'getEnvironmentStatus'
  }
}))
```

### 服务端 API

```typescript
import { OperateService } from './services/operateService'

const service = OperateService.getInstance()

// 获取当前环境类型
const envType = service.getCurrentEnvironmentType() // 'browser' | 'windows'

// 获取当前环境的 Agent
const currentAgent = service.getCurrentAgent() // AgentOverChromeBridge | WindowsAgent | null
```

## Mock 截图配置

### 截图配置文件

在 `mock/screenshots/mock-images.json` 中配置模拟截图：

```json
{
  "desktop-1": {
    "name": "Windows Desktop",
    "description": "A typical Windows desktop with taskbar and icons",
    "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "width": 1920,
    "height": 1080
  },
  "notepad": {
    "name": "Notepad Application",
    "description": "Windows Notepad application window",
    "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "width": 800,
    "height": 600
  }
}
```

### 动态切换截图

```typescript
// 切换到特定的 mock 截图
await agent.switchMockScreenshot('notepad')

// 获取可用的截图列表
const screenshots = await agent.getAvailableScreenshots()
console.log(screenshots) // ['desktop-1', 'notepad', 'file-explorer', 'calculator']
```

## 支持的操作

Windows Mock 环境支持以下操作：

- `aiTap` - 模拟点击
- `aiDoubleClick` - 模拟双击
- `aiRightClick` - 模拟右键点击
- `aiHover` - 模拟鼠标悬停
- `aiInput` - 模拟文本输入
- `aiKeyboardPress` - 模拟键盘按键
- `aiScroll` - 模拟滚动
- `aiDragAndDrop` - 模拟拖拽

## 环境变量

```bash
# 自定义 Windows Mock 截图目录
WINDOWS_MOCK_SCREENSHOT_DIR=/path/to/custom/screenshots
```

## 示例项目

查看完整示例：
- [Windows Mock YAML 示例](./packages/core/examples/windows-mock-example.yaml)
- [WebSocket 环境切换示例](./examples/environment-switching/)

## 注意事项

1. **Mock 模式**: 当前 Windows 支持仅为 Mock 模式，所有操作都是模拟的，不会实际操作 Windows 系统
2. **截图循环**: Mock 截图会循环使用，每次截图会返回下一张预配置的图片
3. **操作延迟**: 为了模拟真实操作，每个操作都有 100-300ms 的随机延迟
4. **环境隔离**: Browser 和 Windows 环境是完全隔离的，切换环境不会影响另一个环境的状态

## 未来计划

- [ ] 真实 Windows 系统集成
- [ ] 更多 Windows 特定操作支持
- [ ] 自定义 Mock 行为配置
- [ ] 性能优化和错误处理改进
