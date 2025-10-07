/*!
 * @feiqi/time-runner v1.0.1
 * (c) 2025 Fei Qi/费祺
 * Released under the MIT License.
 */
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
   */
  mode?: TransMode;
  /** 尺寸，默认40 */
  size?: number;
  /** 自定义样式类名 */
  className?: string;
  /** 背景颜色 */
  bgColor?: string;
  /** 边框颜色 */
  borderColor?: string;
  /** 倒计时结束后执行的方法 */
  finishCountFn?: Function;
}
interface RefType {
  t: number | null;
}

const f = "HH:mm:ss";
const delay = 900;


const TimeCountdown = (props: PropsType) => { 
  const { mode, showType = "default", size = 40, className, bgColor, borderColor, finishCountFn } = props; 
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

  useEffect(() => {    
    isValidTime(showType) && time === "00:00:00" && finishCountFn && setTimeout(() => {
      finishCountFn();
    }, 1000);
  }, [time, showType, finishCountFn])

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
    <div className={`time-runner ${className || ""}`} style={cardStyle}>
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
   * 翻牌模式下，当翻转从180变为0时，山寨谷歌浏览器（搜狗、360、qq、猎豹等），会顺时针返回，而不是原路返回，所以设置成179.9，从而能让这些浏览器按原路返回。
   * 
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
