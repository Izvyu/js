import axios from "axios";
import _ from 'lodash';

const R = require("ramda");

const ArrayToObject = props => {
  return { ...props };
};

//const ObjectToArray = obj => Object.keys(obj).map(k => obj[k]);
const ObjectToArray = obj => R.values(obj);

const ObjectToArray0 = obj => obj[Object.keys(obj)[0]];
const ObjectToArray1 = obj => obj[Object.keys(obj)[1]];
const ArrayObject0ToArray = arr => {
  return R.map(ObjectToArray0, arr);
};
const ArrayObject1ToArray = arr => {
  return R.map(ObjectToArray1, arr);
};
const ArrayObjectToArray = arr => {
  return R.map(ObjectToArray, arr);
};
const ArrayRemoveByIndex = (arr, index) => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

let testurl = "https://localhost:44311"; //測試用1

const envPublicUrl = process.env.PUBLIC_URL;
// let iisurl = envPublicUrl.replace("/react", "/LH");

let iisurl2 = "https://mj.mornjoy.com.tw/purchase_api";   //測試用2
const iisurl = "https://mj.mornjoy.com.tw/exportexcel";

function ccyFormat2(num) {
  if (isNaN(num)) {
    //非數字的話，則直接返回
    return num;
  } else {
    //若為數字則保留兩位
    return `${Number(num).toLocaleString(undefined, {
      minimumFractionDigits: 2
    })}`;
  }
}
//顯示千分位
function ccyFormat(num, decimal) {
  if (isNaN(num)) {
    //非數字的話，則直接返回
    return num;
  } else {
    //若為數字則保留兩位
    return `${Number(num).toLocaleString(undefined, {
      minimumFractionDigits: decimal
    })}`;
  }
}
function dateFormat(json) {
  if (json === undefined) {
    return "";
  } else if (json === null) {
    return "";
  } else {
    let date = new Date(json);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
  }
}

function timeFormat(json) {
  if (json === undefined) {
    return "";
  } else if (json === null) {
    return "";
  } else {
    let date = new Date(json);
    return [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
  }
}

function NumAdd(accumulator, a) {
  if (!isNaN(a)) {
    //先檢查是否為數字
    return accumulator + parseFloat(a); //將字串轉換為數字
  } else {
    return accumulator;
  }
}
//
function returnToken() {
  return sessionStorage.token;
}
var instance = axios.create({
  // timeout: 1000,   //暫不設置timeout
  async: true,
  crossDomain: true,
  headers: {
    //"Access-Control-Allow-Origin": "*",
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    "X-Requested-With": "XMLHttpRequest", //for MVC Request.IsAjaxRequest()
    //"Access-Control-Expose-Headers":"token",
    // "Content-Type": "text/plain;charset=utf-8",
    // token: () => {
    //   return sessionStorage.token;
    // } //夾帶token
  }
});
function get_browser() {
  var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: (tem[1] || '') };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/)

    if (tem != null) {
      return { name: 'Opera', version: tem[1] };
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }

  return {
    browserName: M[0],
    browserVersion: M[1],
    dateLog: new Date().toLocaleString()
  };
}
function get_ip() {
  //var self=this;
  return axios({
    method: "get",
    url: "https://ipapi.co/json/"
    //data: Qs.stringify(user)
  })
    .then(response => {
      return response.data;
    })
}
//react-datasheet的資料格式每一個cell={value: 內容}
//react-datasheet的資料格式每一個cell={value: 內容}
let dataSheetGridFormat = (rows, columns) => {

  return [].concat(rows).map(obj => {

    return columns.map(key => {

      if (!_.isNil(obj[key]))


        return { value: obj[key] };
    }
    )
  });
};
//多條件，多值篩選，不支援like
//filters為一個物件
//Example
// var filters = {
//   name:['Leila', 'Jay'],
//   age:[]
// }
let multiFilter = (array, filters) => {
  const filterKeys = Object.keys(filters);
  // filters all elements passing the criteria
  return array.filter(item => {
    // dynamically validate all filter criteria
    return filterKeys.every(key => {
      //ignore when the filter is empty Anne
      if (!filters[key].length) return true;
      return !!~filters[key].indexOf(item[key]);
      // return ~filters[key].indexOf(item[key]);
    });
  });
};
let deepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};
let eitherList = R.reduce(R.either, R.isNil);
function swapArrayLocs(arr, index1, index2) {
  // console.log(arr)
  var temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
  return arr;
}

function dataFactory() {
  const rows = [];
  for (let i = 0; i < 10000; i++) {
    rows.push([]);
    for (let j = 0; j < 6; j++) {
      rows[i].push({
        value: `${i} - ${j}`
      });
    }
  }
  return rows;
}

let getWorkRange = (worktime) => {
  // console.log(worktime);
  let getWorkTimeStart = new Date("2020/1/1 " + worktime[0].WorkTimeStart);
  let getWorkTimeEnd = new Date("2020/1/1 " + worktime[0].WorkTimeEnd);
  let getRestTimeStart = new Date("2020/1/1 " + worktime[0].RestTimeStart);
  let getRestTimeEnd = new Date("2020/1/1 " + worktime[0].RestTimeEnd);

  //let isSameTime=+getRestTimeStart===+getRestTimeEnd  //若相等，只有時段一
  // if(isSameTime){
  //   //時段一開始
  //   let timeRange1Start = getWorkTimeStart;
  //   let timeRange1End = getWorkTimeEnd;
  //   return ({
  //     timeRange1Start,
  //     timeRange1End
  //   });
  // }else{
  //若不相等
  //時段一開始
  let timeRange1Start = getWorkTimeStart
  let timeRange1End = getRestTimeStart
  //時段二開始
  let timeRange2Start = getRestTimeEnd
  let timeRange2End = getWorkTimeEnd
  return ({
    timeRange1Start,
    timeRange1End,
    timeRange2Start,
    timeRange2End
  });
  // }
}
let isSameDate = (datetime1, datetime2) => {
  //判斷是否為同一天
  let date1Today = new Date(datetime1.getFullYear(), datetime1.getMonth(), datetime1.getDate())
  let date2Today = new Date(datetime2.getFullYear(), datetime2.getMonth(), datetime2.getDate())

  return +date1Today === +date2Today;
}

const calculateHours = (datetime1, datetime2, workRange, worktime, leaveRange) => {
  let hours = 0;
  // console.log(leaveRange);
  // console.log(leaveRange[0].isWorkday);

  if (isSameDate(datetime1, datetime2)) {
    //若同一天
    //前提：休息時間一定要落在工作時間內
    //08:00-14:00
    //11:00-18:00
    //改成今日
    let today = deepClone(workRange);
    // console.log(today)
    let { today_timeRange1Start = new Date(today.timeRange1Start),
      today_timeRange1End = new Date(today.timeRange1End),
      today_timeRange2Start = new Date(today.timeRange2Start),
      today_timeRange2End = new Date(today.timeRange2End) } = { ...today }
    //設定日期-Year
    today_timeRange1Start.setFullYear(datetime1.getFullYear());
    today_timeRange1End.setFullYear(datetime1.getFullYear());
    today_timeRange2Start.setFullYear(datetime1.getFullYear());
    today_timeRange2End.setFullYear(datetime1.getFullYear());
    //設定日期-Month
    today_timeRange1Start.setMonth(datetime1.getMonth());
    today_timeRange1End.setMonth(datetime1.getMonth());
    today_timeRange2Start.setMonth(datetime1.getMonth());
    today_timeRange2End.setMonth(datetime1.getMonth());
    //設定日期-Date
    today_timeRange1Start.setDate(datetime1.getDate());
    today_timeRange1End.setDate(datetime1.getDate());
    today_timeRange2Start.setDate(datetime1.getDate());
    today_timeRange2End.setDate(datetime1.getDate());

    ////輸入參數，workrange、 datetime1、 datetime2
    //let {timeRange1Start,timeRange1End,timeRange2Start,timeRange2End} = workRange

    //時間比較
    if (datetime1 <= today_timeRange1Start) {

      //若過早，重設早上起始時間為datetime1
      datetime1 = today_timeRange1Start;
    } else if (datetime1 >= today_timeRange2Start) {
      //若起始是在下午，重設時間下午起始時段為datetime1
      today_timeRange2Start = datetime1;
    }

    if (datetime2 >= today_timeRange2End) {
      //重設時間，若過晚
      datetime2 = today_timeRange2End
    } else if (datetime2 <= today_timeRange1End) {
      //重設時間，若結束是在早上
      today_timeRange1End = datetime2
    }




    let hoursRange1 = (today_timeRange1End - datetime1) / 3.6e6
    let hoursRange2 = (datetime2 - today_timeRange2Start) / 3.6e6
    // console.log(hoursRange1<0?0:hoursRange1);
    // console.log(hoursRange2<0?0:hoursRange2);
    hours = ((hoursRange1 < 0 ? 0 : hoursRange1) + (hoursRange2 < 0 ? 0 : hoursRange2)) * leaveRange[0].isWorkday;
    // console.log(hours);
    //如果 datetime1<=timeRange1Start且datetime2>=timeRange2End ，則計算 timeRange1Start~timeRange1End+timeRange2Start~timeRange2End
    //如果 datetime1<=timeRange1Start且timeRange1End<=datetime2<=timeRange2End ，則計算 timeRange1Start~timeRange1End+timeRange2Start~timeRange2End
    //如果 timeRange1Start <= datetime1<= timeRange1End ，則datetime1起始，timeRange1End結束 加上 timeRange2Start起始，比較datetime2結束
    //如果 timeRange1End<=datetime1<=timeRange2Start ，則改為 timeRange2Start
    //如果 timeRange2Start<=datetime1<=timeRange2End ，則改為 datetime1~timeRange2End或datetime1
    return hours;
  } else {
    //不同天
    let date1Today = new Date(datetime1.getFullYear(), datetime1.getMonth(), datetime1.getDate())
    let date2Today = new Date(datetime2.getFullYear(), datetime2.getMonth(), datetime2.getDate())
    // let days =Math.ceil((date2Today - date1Today) / (3.6e6*24)); //總小時
    // console.log(days);
    //取得time
    //let Firstday_timeRange1Start;

    const First = deepClone(workRange);
    let { Firstday_timeRange1Start = new Date(First.timeRange1Start),
      Firstday_timeRange1End = new Date(First.timeRange1End),
      Firstday_timeRange2Start = new Date(First.timeRange2Start),
      Firstday_timeRange2End = new Date(First.timeRange2End)
    } = { ...First };
    // const {Firstday_timeRange1Start,Firstday_timeRange1End,Firstday_timeRange2Start,Firstday_timeRange2End} =First
    // let Firstday_timeRange1Start=workRange.timeRange1Start;
    // let Firstday_timeRange1End=workRange.timeRange1End;
    // let Firstday_timeRange2Start=workRange.timeRange2Start;
    // let Firstday_timeRange2End=workRange.timeRange2End;
    //設定日期-Year
    Firstday_timeRange1Start.setFullYear(datetime1.getFullYear());
    Firstday_timeRange1End.setFullYear(datetime1.getFullYear());
    Firstday_timeRange2Start.setFullYear(datetime1.getFullYear());
    Firstday_timeRange2End.setFullYear(datetime1.getFullYear());
    //設定日期-Month
    Firstday_timeRange1Start.setMonth(datetime1.getMonth());
    Firstday_timeRange1End.setMonth(datetime1.getMonth());
    Firstday_timeRange2Start.setMonth(datetime1.getMonth());
    Firstday_timeRange2End.setMonth(datetime1.getMonth());
    //設定日期-Date
    Firstday_timeRange1Start.setDate(datetime1.getDate());
    Firstday_timeRange1End.setDate(datetime1.getDate());
    Firstday_timeRange2Start.setDate(datetime1.getDate());
    Firstday_timeRange2End.setDate(datetime1.getDate());

    //取得time
    const Last = deepClone(workRange);
    // console.log(Last);
    let { Lastday_timeRange1Start = new Date(Last.timeRange1Start),
      Lastday_timeRange1End = new Date(Last.timeRange1End),
      Lastday_timeRange2Start = new Date(Last.timeRange2Start),
      Lastday_timeRange2End = new Date(Last.timeRange2End)
    } = Last;

    // let Lastday_timeRange1Start=workRange.timeRange1Start;
    // let Lastday_timeRange1End=workRange.timeRange1End;
    // let Lastday_timeRange2Start=workRange.timeRange2Start;
    // let Lastday_timeRange2End=workRange.timeRange2End;
    //設定日期
    Lastday_timeRange1Start.setFullYear(datetime2.getFullYear());
    Lastday_timeRange1End.setFullYear(datetime2.getFullYear());
    Lastday_timeRange2Start.setFullYear(datetime2.getFullYear());
    Lastday_timeRange2End.setFullYear(datetime2.getFullYear());

    Lastday_timeRange1Start.setMonth(datetime2.getMonth());
    Lastday_timeRange1End.setMonth(datetime2.getMonth());
    Lastday_timeRange2Start.setMonth(datetime2.getMonth());
    Lastday_timeRange2End.setMonth(datetime2.getMonth());

    Lastday_timeRange1Start.setDate(datetime2.getDate());
    Lastday_timeRange1End.setDate(datetime2.getDate());
    Lastday_timeRange2Start.setDate(datetime2.getDate());
    Lastday_timeRange2End.setDate(datetime2.getDate());

    // console.log(datetime1,"datetime1")
    // console.log(Firstday_timeRange1Start,"Firstday_timeRange1Start")
    if (datetime1 <= Firstday_timeRange1Start) {
      //重設時間，若過早
      datetime1 = Firstday_timeRange1Start;
    } else if (datetime1 >= Firstday_timeRange2Start) {
      //重設時間，若起始是在下午    
      Firstday_timeRange2Start = datetime1
    }

    if (datetime2 >= Lastday_timeRange2End) {
      //重設時間，若過晚
      datetime2 = Lastday_timeRange2End
    } else if (datetime2 <= Lastday_timeRange1End) {
      //重設時間，若結束是在早上    
      Lastday_timeRange1End = datetime2
    }

    // console.log(datetime1,"datetime1")
    let FirstDayhoursRange1 = (Firstday_timeRange1End - datetime1) / 3.6e6
    // console.log(FirstDayhoursRange1,"FirstDayhoursRange1");
    let FirstDayhoursRange2 = (Firstday_timeRange2End - Firstday_timeRange2Start) / 3.6e6
    let FirstdayHours = ((FirstDayhoursRange1 < 0 ? 0 : FirstDayhoursRange1) + (FirstDayhoursRange2 < 0 ? 0 : FirstDayhoursRange2)) * leaveRange[0].isWorkday;
    // console.log(FirstdayHours);
    let LastDayhoursRange1 = (Lastday_timeRange1End - Lastday_timeRange1Start) / 3.6e6
    let LastDayhoursRange2 = (datetime2 - Lastday_timeRange2Start) / 3.6e6
    let LastdayHours = ((LastDayhoursRange1 < 0 ? 0 : LastDayhoursRange1) + (LastDayhoursRange2 < 0 ? 0 : LastDayhoursRange2)) * leaveRange[leaveRange.length - 1].isWorkday;
    // console.log(LastdayHours);
    // console.log((days-1)*worktime[0].workhours);
    leaveRange.splice(0, 1)  //去頭
    leaveRange.splice(leaveRange.length - 1, 1)  //去尾
    let intermediateHours = leaveRange.reduce(function (acc, obj) { return acc + obj.shouldHours; }, 0); //中間工作小時加總

    hours = intermediateHours + FirstdayHours + LastdayHours;
    // console.log(hours);

    return hours;
    //相差天數<=1
    //8*相差天數-1+第一天+最後一天
    //相差天數>=2
    //8*相差天數-1+第一天+最後一天

  }
}



const publicFunction = {
  //attribute
  testurl: testurl, //VS2015直接建置
  iisurl: iisurl, // 晨悅https
  iisurl2: iisurl2, //IIS-開發
  //統一變動窗口
  get url() {
    return window.location.host === 'localhost:3000' ? this.testurl : iisurl;
  },
  get url2() {
    return window.location.host === 'localhost:3000' ? this.testurl : iisurl2;
  },
  instance: instance,
  get_browser: get_browser,
  get_ip: get_ip,
  //function
  ArrayToObject: ArrayToObject,
  ObjectToArray: ObjectToArray,
  ObjectToArray0: ObjectToArray0,
  ArrayObject0ToArray: ArrayObject0ToArray,
  ArrayObject1ToArray: ArrayObject1ToArray,
  ArrayObjectToArray: ArrayObjectToArray,
  ArrayRemoveByIndex: ArrayRemoveByIndex,
  dateFormat: dateFormat,
  timeFormat: timeFormat,
  ccyFormat2: ccyFormat2,
  ccyFormat: ccyFormat,
  NumAdd: NumAdd,
  dataSheetGridFormat: dataSheetGridFormat,
  multiFilter: multiFilter,
  deepClone: deepClone,
  eitherList: eitherList,
  returnToken: returnToken,
  getWorkRange: getWorkRange,
  isSameDate: isSameDate,
  calculateHours: calculateHours,
  swapArrayLocs: swapArrayLocs,
};

export default publicFunction;
