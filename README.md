English | [中文](./README.zh-CN.md)

# Time / Timer / Countdown Component

![Time/Timer/Countdown Component](https://showscene.oss-cn-shanghai.aliyuncs.com/time-countdown.gif)

Demo：[Live Demo](http://showscene.cn/react-demo/clock)

This is a component used to display current time, timer, and countdown.

It is built with React and provides the following features：
- Display the current time
- Display a timer (continues counting even if the computer is locked or the laptop lid is closed)
- Display a countdown timer
- Includes several animation effects


## Installation
```bash
npm i time-runner
```
or
```bash
yarn add time-runner
```

## Import
```jsx
import { TimeRunner } from "time-runner";
// Starting from version 1.0.3, CSS import is no longer required
// import "time-runner/dist/time-runner.css";
```

## Usage
```jsx

// Current time
<TimeRunner />
// Timer
<TimeRunner showType="count" />
// Countdown
<TimeRunner showType="2026-10-31" />

// Current time + flip card
<TimeRunner mode="card" />
// Timer + flip card
<TimeRunner mode="card" showType="count" />
// Countdown + flip card
<TimeRunner mode="card" showType="2026-10-31" />

// Current time + horizontal flip
<TimeRunner mode="cube-h" />
// Timer + horizontal flip
<TimeRunner mode="cube-h" showType="count" />
// Countdown + horizontal flip
<TimeRunner mode="cube-h" showType="2026-10-31" />

// Current time + vertical flip
<TimeRunner mode="cube-v" />
// Timer + vertical flip
<TimeRunner mode="cube-v" showType="count" />
// Countdown + vertical flip
<TimeRunner mode="cube-v" showType="2026-10-31" />

// Current time + drift
<TimeRunner mode="drift" />
// Timer + drift
<TimeRunner mode="drift" showType="count" />
// Countdown + drift
<TimeRunner mode="drift" showType="2026-10-31" />


```

### Component Props
```jsx
/**
 * Display type (default: current time)
 *
 * default: show current time
 * count: timer
 * specific time: countdown
 */
showType?: string;
/**
 * Animation mode
 *
 * card:   flip card
 * cube-v: vertical flip
 * cube-h: horizontal flip
 * drift:  floating
 */
mode?: TransMode;
/** Callback function executed when countdown finishes */
finishCountFn?: Function;
/** Component size (default: 40) */
size?: number;
/** Custom class name */
className?: string;
/** Background color */
bgColor?: string;
/** Border color */
borderColor?: string;
/** Text shadow color */
textShadowColor?: string;
```

### Countdown Date Format
```
"YYYY-MM-DD",
"YYYY/MM/DD",
"YYYY-MM-DD HH:mm",
"YYYY/MM/DD HH:mm",
"YYYY-MM-DD HH:mm:ss",
"YYYY/MM/DD HH:mm:ss",
```

### React Version
```
"react": ">=16.8.0",
"react-dom": ">=16.8.0"
```


# Changelog

## [1.1.4] - 2026-03-07
### Changes
- Added English README

## [1.1.3] - 2026-02-26
### Changes
- Fixed an issue where the numeric font was not applied correctly

## [1.1.2] - 2026-02-25
### Changes
- Updated font and reference paths

## [1.1.1] - 2026-02-24
### Changes
- Fixed the numeric font reference path issue

## [1.1.0] - 2026-02-20
### Changes
- Added numeric font

## [1.0.5] - 2025-11-16
### Changes
- Updated README content

## [1.0.4] - 2025-11-16
### Changes
- Updated README content

## [1.0.3] - 2025-11-16
### Changes【Breaking Change】
- Removed the time-runner/dist/time-runner.css import
- Added textShadowColor prop
- Updated README and added demo link


## [1.0.2] - 2025-10-11
### Changes
- Added mode = "drift" animation
- Updated README content


## [1.0.1] - 2025-10-07
### Changes
- Updated README content


## [1.0.0] - 2025-10-07
### Initial release
