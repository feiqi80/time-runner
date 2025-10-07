import React, {useState, useRef, useEffect, memo, CSSProperties} from "react";
import { isValidTime, getTimeDiff, countTime } from "./Tools";
import dayjs from "dayjs";
import "./aStyle.less";

/**
 * 翻转模式类型：
 *
 * card:   翻牌翻转
 * cube-v: 立方体上下翻转
 * cube-h: 立方体左右翻转
 *
 */
type TransMode = "card" | "cube-v"| "cube-h";
interface PropsType {
  mode?: TransMode;
  showType?: string;
  size?: number;
  className?: string;
  bgColor?: string;
  borderColor?: string;
}
interface RefType {
  t: number | null;
}

const f = "HH:mm:ss";
const delay = 900;


const TimeCountdown = (props: PropsType) => { 
  const { mode, showType = "default", size = 40, className, bgColor, borderColor } = props; 
  const [time, setTime] = useState(
    showType === "count" 
      ? countTime(0) 
      : (showType === "default"
          ? dayjs().format(f) 
          : getTimeDiff(showType)
        )
      );
  const aRef = useRef<RefType>({
    t: null
  })

  const cardStyle = {
    "--card-size": `${size}px`,
    "--card-w": `${size * 1.25}px`,
    "--card-h": `${size * 2}px`,
    // 下面两个必须是一个确定的数字，不能是表达式
    "--transx": `${-size * 1.25 / 2}px`,
    "--transy": `${-size}px`,
    "--delay": `${delay/1000}s`,
    "--bgColor": bgColor,
    "--borderColor": borderColor,
  } as CSSProperties;

  useEffect(() => {
    let startTime = Date.now();
    if (aRef.current.t) {
      clearInterval(aRef.current.t);
      aRef.current.t = null;
      startTime = Date.now();
    }
    aRef.current.t = setInterval(() => {
      let fn = () => "";
      if (showType === "count") {
        fn = () => countTime(Math.floor((Date.now() - startTime) / 1000));
      } else if (showType === "default") {
        fn = () => dayjs().format(f);
      } else {
        fn = () => getTimeDiff(showType)
      }
      setTime(fn());
    }, 1000);
  }, [showType])

  const cardDom = () => {
    if (!time) {
      return null;
    }

    const arr = time.split(":");
    const hList = arr[arr.length - 3].split("");
    const mList = arr[arr.length - 2].split("");
    const sList = arr[arr.length - 1].split("");
    const dList = arr.length === 4 ? arr[0].split("") : [];
    const isValidDate = isValidTime(showType);

    const dListDom = dList.map((ele: string, i: number) => {
      return <CardNumber key={i} mode={mode} time={+ele} limit={isValidDate ? -9 : 9} />
    })

    const seprator = <span>:</span>;

    return (
      <>
        {/* 天 */}
        {dListDom.length 
        ? <>{dListDom}{isValidDate ? <p>天</p> : seprator}</> 
        : null
        }        
        {/* 小时：十位数 */}
        <CardNumber mode={mode} time={+hList[0]} limit={isValidDate ? -2 : 2} />
        {/* 小时：个位数 */}
        <CardNumber mode={mode} time={+hList[1]} limit={isValidDate ? -9 : 9} />
        {isValidDate ? <p>小时</p> : seprator}
        {/* 分钟：十位数 */}
        <CardNumber mode={mode} time={+mList[0]} limit={isValidDate ? -5 : 5} />
        {/* 分钟：个位数 */}
        <CardNumber mode={mode} time={+mList[1]} limit={isValidDate ? -9 : 9} />
        {isValidDate ? <p>分</p> : seprator}
        {/* 秒：十位数 */}
        <CardNumber mode={mode} time={+sList[0]} limit={isValidDate ? -5 : 5} />
        {/* 秒：个位数 */}
        <CardNumber mode={mode} time={+sList[1]} limit={isValidDate ? -9 : 9} />
        {isValidDate && <p>秒</p>}
      </>      
    );
  }

  return (
    <div className={`time-countdown ${className || ""}`} style={cardStyle}>
      {cardDom()}
    </div>
  );
}

export default TimeCountdown;


/** ================================ 以下代码为单个数字组件 ================================== */

interface PropsOwn {
  /** 时间数字 */
  time: number;
  /** 最大值 */
  limit: number;
  /** 翻转模式 */
  mode: TransMode;
}

interface RefType {
  /** 暂存时间数字，翻牌结束后，跟随 trans 变量一起更新 */
  t: number
}


const CardItem = (props: PropsOwn): React.ReactNode => {
  const { time, limit, mode } = props;
  const [trans, setTrans] = useState(false);
  const tRef = useRef<RefType>({
    t: time
  });

  /**
   * 跳过首次渲染
   */
  useEffect(() => {
    if (time !== tRef.current!.t) {
      setTrans(true);
    }
  }, [time]);

  /**
   * 执行翻牌动作，在翻牌结束后，更新数字，这个新的数字跟随trans变量一起更新。
   * 延时时间尽量和样式中的时间接近，最好是相同，但不要超过1秒。 
   */
  useEffect(() => {
    if (trans) {
      setTimeout(() => {
        tRef.current!.t = time;
        setTrans(false);
      }, delay);
    }
  }, [trans, time]);


  /**
   * 生成卡片
   * 
   * 翻牌关键点：
   * 1. 总共需要设置4张卡片。
   * 2. 通过line-height使两个数字组合成一个数字，上半张设置成居中（即：卡片的总高度），下半张设置成0即可拼接成一个数字。
   * 3. 前面的卡片默认展开，执行翻牌时，上半张往下翻转180度；后面的卡片，下半张默认先往上翻转180度，执行翻牌时，再展开。
   * 4. 当翻转从180度变为0时，山寨谷歌浏览器（搜狗、360、qq、猎豹等），会顺时针返回，而不是原路返回，所以设置成179.9，从而能让这些浏览器按原路返回。详见样式文件中的设置。
   * 5. 当结束翻牌时，赋值新的数字。
   * 6. 本例，在卡片翻转时设置了backface-visibility: hidden; 使其在翻转时背面不可见，达到隐藏的效果，且不用设置过多的层级来控制；否则需要根据翻转的状态设置不同的层级，比较复杂。
   * 7. 有两个样式需要兼容edge浏览器，详见样式文件。
   * 
   * 立方体关键点：
   * 1. 旋转的是外层整体元素的x轴，而不是旋转内部的两个元素。需要设置：transform-style: preserve-3d; 否则翻转无效。
   * 2. 需要把两张卡片拼成立方体。
   * 3. 由于旋转的是外层元素的x轴，所以就是以卡片的一半高度进行旋转，所以顶部卡片的初始位置也要往上移动一半的高度，然后旋转90度。
   * 
   * 带透视旋转关键点：
   * 1. 需要在外面套一层元素，并设置透视值。
   * 2. 要翻转的数字，需要设置定位，如果不设置定位，元素虽然已翻转，但是仍然占据着80的高度空间。
   * 3. 第一个元素不用设置top:0，如果将第二个元素设置为要翻转的数字，那么需要设置top:0，否则翻转时就翻转到后面去了。
   */
  const makeDom = () => {
    const { t } = tRef.current!;
    let nextT = t;
    if (limit > 0) {
      nextT = t >= limit ? 0 : (t + 1);
    } else {
      nextT = t <= 0 ? Math.abs(limit) : (t - 1);
    }

    switch (mode) {
      case "card": {
        return (
          <div className="clock-card">      
            <div className={`clock-b ${trans ? "run" : ""}`}>
              <p>{nextT}</p>
              <p>{nextT}</p>
            </div>
            <div className={`clock-f ${trans ? "run" : ""}`}>
              <p>{t}</p>
              <p>{t}</p>
            </div>
          </div>
        );
      }
      case "cube-v": {
        return (
          <div className={`clock-cube-3d-v ${trans ? "run" : ""}`}>
            <div>              
              <p>{nextT}</p>
              <p>{t}</p>
            </div>
          </div>
        );
      }
      case "cube-h": {
        return (
          <div className={`clock-cube-3d-h ${trans ? "run" : ""}`}>
            <div>
              <p>{nextT}</p>
              <p>{t}</p>
            </div>
          </div>
        );
      }
      default: {
        return (
          <div>
            <p>{t}</p>
          </div>
        )
      }
    }
  }

  return <>{makeDom()}</>

}

const CardNumber = memo(CardItem);
