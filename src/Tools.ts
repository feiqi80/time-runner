import dayjs from "dayjs";


const digital = 60;
const formats = [
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY-MM-DD HH:mm",
  "YYYY/MM/DD HH:mm",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
];

export const getTimeDiff = (endTime: string) => {
  if (!isValidTime(endTime)) {
    return "00:00:00";
  }

  const diffMs = dayjs(endTime).diff(dayjs());
  if (diffMs <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const t =`${days ? `${days}:` : ""}${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;

  return t;
}

export const countTime = (t: number) => {
  const fomatTime = (num: number) => `${num}`.padStart(2, "0");
  return `${fomatTime(Math.floor(t / digital / digital))}:${fomatTime(Math.floor(t / digital) % digital)}:${fomatTime(t % digital)}`;
}

export const isValidTime = (time: string) => {
  return formats.some((ele) => dayjs(time, ele, true).isValid());
}


/**
 * 根据两点坐标计算两条线段的长度、位置、角度。
 * 都是初中数学的知识，勾股定理，两点间的距离，弧度转角度等等，
 * 不经常用，都快忘得一干二净了，正好复习下。
 * 
 * @param dom 线段元素
 * @param x1  起点x坐标
 * @param y1  起点y坐标
 * @param x2  终点x坐标
 * @param y2  终点y坐标
 */
const drawLine = (
  dom: HTMLDivElement, 
  x1: number,
  y1: number, 
  x2: number, 
  y2: number,
) => {
  // x差值
  const dx = x2 - x1;
  // y差值
  const dy = y2 - y1;

  // 两点之间距离，用勾股定理。
  const length = Math.sqrt(dx * dx + dy * dy).toFixed(2);

  // 根据dx和dy计算角度，返回值是弧度，但是rotate是角度，所以需要转角度。
  // 这都是初中的几何知识，不经常用都快忘了。
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  // 两点之间的中心点坐标，确定线段的位置。
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  dom.style.left = `${centerX}px`;
  dom.style.top = `${centerY}px`;
  dom.style.height = `${length}px`;
  dom.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
}

/**
 * 分别给两个div设置clip-path属性，
 * 并根据polygon的x、y坐标计算两条线段的长度、位置、角度。
 * 
 * @param dom 外层dom
 */
export const getRandomClip = (dom: HTMLDivElement) => {
  const width = dom.clientWidth;
  const height = dom.clientHeight;

  // 0.竖切 1.横切
  const type = Math.floor(Math.random() * 2);

  let lPath = "";
  let rPath = "";

  // 移动时的距离，也就是宽度/高度最大的那条边长，
  // 这里如果没有强迫症的话，在下面返回时，translateX/Y使用100%(即：整个div的距离)也是可以的，不需要这两个变量了。
  let maxX = 0;
  let maxY = 0;
  
  const lLineDom = dom.querySelector('.l-line') as HTMLDivElement;
  const rLineDom = dom.querySelector('.r-line') as HTMLDivElement;

  // 竖切，
  // x坐标一个是随机值，另一个是100-x随机值；
  // y坐标一个是0，另一个是height。
  if (type === 0) {
    // 裁切时x坐标。注意，这里的值在polygon中是百分比。
    const topX = 5 + Math.random() * 90;
    // 过中心的线段，topX和另一个div的bottomX是相等的，所以自己的bottomX就是100-topX，下面的topY也是同理。
    const bottomX = 100 - topX;
    maxX = Math.max(topX, bottomX);    

    lPath = `
      polygon(
        0% 0%,
        ${topX}% 0%,
        ${bottomX}% 100%,
        0% 100%
      )`;

    rPath = `
      polygon(
        ${topX}% 0%,
        100% 0%,
        100% 100%,
        ${bottomX}% 100%
      )`;

    // 顶部的实际宽度，因为topX在polygon中是百分比，所以要转换成实际的值，给drawLine方法用。
    const x1 = width * topX / 100;
    const y1 = 0;

    // 底部的实际宽度，原理同上面的x1
    const x2 = width * bottomX / 100;
    const y2 = height;

    drawLine(lLineDom, x1, y1, x2, y2);
    drawLine(rLineDom, x1, y1, x2, y2);
  }

  // 横切
  // y坐标一个是随机值，另一个是100-y随机值；
  // x坐标一个是0，另一个是width。
  else {
    // 裁切时y坐标。注意，这里的值在polygon中是百分比。
    const leftY = 5 + Math.random() * 90;
    const rightY = 100 - leftY;
    maxY = Math.max(leftY, rightY); 

    lPath = `
      polygon(
        0% 0%,
        100% 0%,
        100% ${rightY}%,
        0% ${leftY}%
      )`;

    rPath = `
      polygon(
        0% ${leftY}%,
        100% ${rightY}%,
        100% 100%,
        0% 100%
      )`;
    
    const x1 = 0;
    // 左侧的实际高度，因为leftY在polygon中是百分比，所以要转换成实际的值，给drawLine方法用。
    const y1 = height * leftY / 100;


    const x2 = width;
    // 右侧的实际高度，原理同上面的y1
    const y2 = height * rightY / 100;

    drawLine(lLineDom, x1, y1, x2, y2);
    drawLine(rLineDom, x1, y1, x2, y2);
  }

  return {
    lPath,
    rPath,
    lTranslate: type === 0 ? `translateX(-${maxX}%)` : `translateY(-${maxY}%)`,
    rTranslate: type === 0 ? `translateX(${maxX}%)` : `translateY(${maxY}%)`,
  }
}

/**
 * 根据传入的颜色色值的深浅比例，返回一个较深或较浅的颜色色值。
 * 在0-255之间，就以128为分界线，大于128为亮色系，返回较深的色值，小于128为深色系，返回较浅的色值。
 * 因为传入的内容格式不固定，所以这里通过浏览器来获取最终的颜色色值，反正也都是在浏览器里运行，减少心智负担。
 * 
 * @param color 颜色值，
 * @param ratio 变化比例，越大，差别就越大。
 */
export const getMaskColor = (color: string, ratio = 0.3) => {
  const div = document.createElement("div");
  div.style.color = color;
  document.body.appendChild(div);
  const rgb = getComputedStyle(div).color;
  document.body.removeChild(div);

  const [r, g, b] = rgb.match(/\d+/g)!.slice(0, 3).map(Number);
  const brightness = 0.299*r + 0.587*g + 0.114*b;
  const isLight = brightness > 128;

  const fn = (v: number) => {
    if (isLight) {
      return Math.round(v * (1 - ratio));
    }

    return Math.round(v + (255 - v) * ratio);
  };

  return (
    "#" +
    [fn(r), fn(g), fn(b)]
      .map(v => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/**
 * 获取[0, 360]之间的随机角度
 */
export const getRandomDeg = () => {
  return Math.floor(Math.random() * 361);
}
