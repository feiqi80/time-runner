# 时间/计时/倒计时组件

![时间/计时/倒计时组件](https://showscene.oss-cn-shanghai.aliyuncs.com/time-countdown.gif)

这是一个展示时间、计时、倒计时的组件。
基于 React 开发。 主要功能包括：
- 展示当前时间
- 展示显示计时（电脑锁屏、笔记本盒盖不中断计时）
- 展示倒计时
- 些许动画效果


## 安装
```bash
npm i time-runner
```
或者
```bash
yarn add time-runner
```

## 页面引入
```jsx
import { TimeRunner } from "time-runner";
import "time-runner/dist/time-runner.css";
```

## 使用说明
```jsx

// 当前时间
<TimeRunner />
// 计时器
<TimeRunner showType="count" />
// 倒计时
<TimeRunner showType="2025-10-31" />

// 当前时间 + 翻牌效果
<TimeRunner mode="card" />
// 计时器 + 翻牌效果
<TimeRunner mode="card" showType="count" />
// 倒计时 + 翻牌效果
<TimeRunner mode="card" showType="2025-10-31" />

// 当前时间 + 翻转（左右）
<TimeRunner mode="cube-h" />
// 计时器 + 翻转（左右）
<TimeRunner mode="cube-h" showType="count" />
// 倒计时 + 翻转（左右）
<TimeRunner mode="cube-h" showType="2025-10-31" />

// 当前时间 + 翻转（上下）
<TimeRunner mode="cube-v" />
// 计时器 + 翻转（上下）
<TimeRunner mode="cube-v" showType="count" />
// 倒计时 + 翻转（上下）
<TimeRunner mode="cube-v" showType="2025-10-31" />


```

### 组件属性（props）
```jsx
/** 
 * 显示模式，默认：default
 * default: 当前时间  
 * count: 计时器  
 * 指定时间：倒计时。
 */
showType?: string;
/** 
 * 动画模式，
 * card：卡片  
 * cube-v：上下翻转  
 * cube-h：左右翻转
 * drift：漂浮
 */
mode?: TransMode;
/** 倒计时结束后执行的方法 */
finishCountFn?: Function;
/** 尺寸，默认40 */
size?: number;
/** 自定义样式类名 */
className?: string;
/** 背景颜色 */
bgColor?: string;
/** 边框颜色 */
borderColor?: string;
```

### 倒计时传入日期的格式
```
"YYYY-MM-DD",
"YYYY/MM/DD",
"YYYY-MM-DD HH:mm",
"YYYY/MM/DD HH:mm",
"YYYY-MM-DD HH:mm:ss",
"YYYY/MM/DD HH:mm:ss",
```

### React版本
```
"react": ">=16.8.0",
"react-dom": ">=16.8.0"
```


# 更新日志

## [1.0.2] - 2025-10-11
### 更新内容
- 增加 mode = "drift" 效果
- 更新Readme内容

## [1.0.1] - 2025-10-07
### 更新内容
- 更新readme内容


## [1.0.0] - 2025-10-07
### 首次发布
