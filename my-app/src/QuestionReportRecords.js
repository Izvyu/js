import React, { useEffect,useMemo,useRef,useState,StrictMode, } from 'react';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, IconButton, MenuItem, Stack } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';

import { createRoot } from 'react-dom/client';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import _, { omit, pick } from 'lodash'
import PF from "./_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import { DatePicker, Space,Input } from 'antd';
import moment from 'moment';
import { and } from 'ramda';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import dayjs from 'dayjs';
// import { DatePicker2 } from "@progress/kendo-react-dateinputs";
// import {
//     IntlProvider,
//     load,
//     loadMessages,
//     LocalizationProvider,
// } from "@progress/kendo-react-intl";

// import 'antd/dist/antd.css';
import Autocomplete from '@mui/material/Autocomplete';





const { RangePicker } = DatePicker;
const QuestionReportRecords  = props => {
    const [ProjectList, setProjectList] = React.useState([]);
    

    useEffect(()=>{
        PF.instance({
            method: "post",
            url: PF.url + "/CheckProject/GetData",
            data: Qs.stringify({ Action: "1" }),
            // headers: { token: sessionStorage.token }
        })
            .then(function (response) {
                // alert("完成")
                const { TotalRecord, rows } = response.data;
                // console.log(rows)
                if (TotalRecord > 0) {
                    // enqueueSnackbar("查詢成功", { variant: "success", style: { whiteSpace: 'pre-line' } });
                    setProjectList(rows)
                    // console.log(rows)

                }
                else {
                    enqueueSnackbar("查無資料", { variant: "warning", style: { whiteSpace: 'pre-line' } });
                }
            })


    },[])
    
    

    const [open, setOpen] = React.useState(false);
   
    const { enqueueSnackbar } = useSnackbar();
    const statusBar = React.useMemo(() => {
        return {
            statusPanels: [
                 { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                //  { statusPanel: 'agFilteredRowCountComponent' },
                 { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
                 { statusPanel: 'agAggregationComponent' },
            ],
        };
    }, []);

     

   

    const gridRef = React.useRef();
    const gridRef2 = React.useRef();
    const gridRef3 = React.useRef();

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    // const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState([]);
    const [QuestionNo, setQuestionNo] = React.useState('');
    const [columnDefs, setColumnDefs] = useState([]);

    const [fatigueColumns] = React.useState([
        // { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'No' },
        { field: '條碼號', headerName: "條碼號", width: 150, tooltipField: '條碼號', cellStyle: { textAlign: 'left' }}, 
        { field: '姓名', headerName: "姓名", width: 150, tooltipField: '姓名', cellStyle: { textAlign: 'left' } },
        { field: '說明：本量表所列舉的問題是為協助您瞭解您的身心適應狀況，請您仔細回想在最近一星期中(包括今天)，這些問題使您感到困擾或苦惱的程度，然後圈選一個您認為最能代表您感覺的答案。', headerName: "說明：本量表所列舉的問題是為協助您瞭解您的身心適應狀況，請您仔細回想在最近一星期中(包括今天)，這些問題使您感到困擾或苦惱的程度，然後圈選一個您認為最能代表您感覺的答案。", width: 200, tooltipField: '說明：本量表所列舉的問題是為協助您瞭解您的身心適應狀況，請您仔細回想在最近一星期中(包括今天)，這些問題使您感到困擾或苦惱的程度，然後圈選一個您認為最能代表您感覺的答案。', cellStyle: { textAlign: 'left' } },
        { field: '你常覺得疲勞嗎?', headerName: "你常覺得疲勞嗎?", width: 200, tooltipField: '你常覺得疲勞嗎?', cellStyle: { textAlign: 'left' } },
        { field: '你常覺得身體上體力透支嗎?', headerName: "你常覺得身體上體力透支嗎?", width: 200, tooltipField: '你常覺得身體上體力透支嗎?', cellStyle: { textAlign: 'left' } },
        { field: '你常覺得情緒上心力交瘁嗎?', headerName: "你常覺得情緒上心力交瘁嗎?", width: 200, tooltipField: '你常覺得情緒上心力交瘁嗎?', cellStyle: { textAlign: 'left' } },
        { field: '你常會覺得，「我快要撐不下去了」嗎?', headerName: "你常會覺得，「我快要撐不下去了」嗎?", width: 200, tooltipField: '你常會覺得，「我快要撐不下去了」嗎?', cellStyle: { textAlign: 'left' } },
        { field: '你常覺得精疲力竭嗎?', headerName: "你常覺得精疲力竭嗎?", width: 200, tooltipField: '你常覺得精疲力竭嗎?', cellStyle: { textAlign: 'left' } },
        { field: '你常常覺得虛弱，好像快要生病了嗎?', headerName: "你常常覺得虛弱，好像快要生病了嗎?", width: 200, tooltipField: '你常常覺得虛弱，好像快要生病了嗎?', cellStyle: { textAlign: 'left' } },
        { field: '你的工作會令人情緒上心力交瘁嗎？', headerName: "你的工作會令人情緒上心力交瘁嗎？", width: 200, tooltipField: '你的工作會令人情緒上心力交瘁嗎？', cellStyle: { textAlign: 'left' } },
        { field: '你的工作會讓你覺得快要累垮了嗎?', headerName: "你的工作會讓你覺得快要累垮了嗎?", width: 220, tooltipField: '你的工作會讓你覺得快要累垮了嗎?', cellStyle: { textAlign: 'left' }},
        { field: '你的工作會讓你覺得挫折嗎?', headerName: "你的工作會讓你覺得挫折嗎?", width: 220, tooltipField: '你的工作會讓你覺得挫折嗎?', cellStyle: { textAlign: 'left' } },
        { field: '工作一整天之後，你覺得精疲力竭嗎?', headerName: "工作一整天之後，你覺得精疲力竭嗎?", width: 220, tooltipField: '工作一整天之後，你覺得精疲力竭嗎?', cellStyle: { textAlign: 'left' } },
        { field: '上班之前只要想到又要工作一整天，你就覺得沒力嗎?', headerName: "上班之前只要想到又要工作一整天，你就覺得沒力嗎?", width: 220, tooltipField: '上班之前只要想到又要工作一整天，你就覺得沒力嗎?' , cellStyle: { textAlign: 'left' }},
        { field: '上班時你會覺得每一刻都很難熬嗎?', headerName: "上班時你會覺得每一刻都很難熬嗎?", width: 220, tooltipField: '上班時你會覺得每一刻都很難熬嗎?', cellStyle: { textAlign: 'left' } },
        { field: '不工作的時候，你有足夠的精力陪朋友或家人嗎?', headerName: "不工作的時候，你有足夠的精力陪朋友或家人嗎?", width: 220, tooltipField: '不工作的時候，你有足夠的精力陪朋友或家人嗎?', cellStyle: { textAlign: 'left' } },
        // {  field: '單價', headerName: "單價", width: 200, tooltipField: '單價', 
        // valueFormatter: (params) => {
        //     return params.value ? parseFloat(params.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';},},
        // { field: '單價', headerName: "單價", width: 120, tooltipField: '單價' },
        // { field: '生效日', headerName: "生效日", width: 220, tooltipField: '生效日' },
        // { field: '失效日', headerName: "失效日", width: 150, tooltipField: '失效日' },
        // { field: '補檢', headerName: "補檢", width: 100, tooltipField: '補檢' },
        // { field: '腸胃', headerName: "腸胃", width: 100, tooltipField: '腸胃' },
        // { field: '抹片', headerName: "抹片", width: 100, tooltipField: '抹片' },
    ])
    const [moodColumns] = React.useState([
        // { headerName: '', valueGetter: 'node.rowIndex + 1', width: 30, pinned: 'left', tooltipField: 'No' },
        { field: '條碼號', headerName: "條碼號", width: 150, tooltipField: '條碼號' },
        { field: '姓名', headerName: "姓名", width: 150, tooltipField: '姓名' },
        { field: '說明：本量表所列舉的問題是為協助您瞭解您的心情狀況，請您仔細回想在一星期中，這些問題發生幾天，然後圈選一個您認為最能代表您感覺的答案。『沒有或極少』1天以下/週，『有時候』1~2天/週，『時常』3~4天/週，『常常或總是』5~7天/週', headerName: "說明：本量表所列舉的問題是為協助您瞭解您的心情狀況，請您仔細回想在一星期中，這些問題發生幾天，然後圈選一個您認為最能代表您感覺的答案。『沒有或極少』1天以下/週，『有時候』1~2天/週，『時常』3~4天/週，『常常或總是』5~7天/週", width: 120, tooltipField: '說明：本量表所列舉的問題是為協助您瞭解您的心情狀況，請您仔細回想在一星期中，這些問題發生幾天，然後圈選一個您認為最能代表您感覺的答案。『沒有或極少』1天以下/週，『有時候』1~2天/週，『時常』3~4天/週，『常常或總是』5~7天/週' },
        { field: '我常常覺得想哭', headerName: "我常常覺得想哭", width: 100, tooltipField: '我常常覺得想哭' },
        { field: '我覺得心情不好', headerName: "我覺得心情不好", width: 100, tooltipField: '我覺得心情不好' },
        { field: '我覺得比以前容易發脾氣', headerName: "我覺得比以前容易發脾氣", width: 100, tooltipField: '我覺得比以前容易發脾氣' },
        { field: '我睡不好', headerName: "我睡不好", width: 100, tooltipField: '我睡不好' },
        { field: '我覺得不想吃東西', headerName: "我覺得不想吃東西", width: 100, tooltipField: '我覺得不想吃東西' },
        { field: '我覺得胸口悶悶的', headerName: "我覺得胸口悶悶的", width: 100, tooltipField: '我覺得胸口悶悶的' },
        { field: '我覺得不輕鬆、不舒服', headerName: "我覺得不輕鬆、不舒服", width: 100, tooltipField: '我覺得不輕鬆、不舒服' },
        { field: '我覺得身體疲勞虛弱無力', headerName: "我覺得身體疲勞虛弱無力", width: 100, tooltipField: '我覺得身體疲勞虛弱無力' },
        { field: '我覺得很煩', headerName: "我覺得很煩", width: 100, tooltipField: '我覺得很煩' },
        { field: '我覺得記憶力不好', headerName: "我覺得記憶力不好", width: 100, tooltipField: '我覺得記憶力不好' },
        { field: '我覺得做事時無法專心', headerName: "我覺得做事時無法專心", width: 100, tooltipField: '我覺得做事時無法專心' },
        { field: '我覺得想事情或做事時比平常要緩慢', headerName: "我覺得想事情或做事時比平常要緩慢", width: 100, tooltipField: '我覺得想事情或做事時比平常要緩慢' },
        { field: '我覺得比以前沒信心', headerName: "我覺得比以前沒信心", width: 100, tooltipField: '我覺得比以前沒信心' },
        { field: '我覺得比較會往壞處想', headerName: "我覺得比較會往壞處想", width: 100, tooltipField: '我覺得比較會往壞處想' },
        { field: '我覺得想不開，甚至想死', headerName: "我覺得想不開，甚至想死", width: 100, tooltipField: '我覺得想不開，甚至想死' },
        { field: '我覺得對什麼事都失去興趣', headerName: "我覺得對什麼事都失去興趣", width: 100, tooltipField: '我覺得對什麼事都失去興趣' },
        { field: '我覺得身體不舒服', headerName: "我覺得身體不舒服", width: 100, tooltipField: '我覺得身體不舒服' },
        { field: '我覺得自己很沒用', headerName: "我覺得自己很沒用", width: 100, tooltipField: '我覺得自己很沒用' },
    ])

    const [muscleColumns] = React.useState([
        // { headerName: '', valueGetter: 'node.rowIndex + 1', width: 30, pinned: 'left', tooltipField: 'No' },
        { field: '條碼號', headerName: "條碼號", width: 150, tooltipField: '條碼號' },
        { field: '姓名', headerName: "姓名", width: 150, tooltipField: '姓名' },
        { field: '下列任何部位請以酸痛不適與影響關節活動評斷。任選分數高者。酸痛不適程度與關節活動能力：（以肩關節為例）', headerName: "下列任何部位請以酸痛不適與影響關節活動評斷。任選分數高者。酸痛不適程度與關節活動能力：（以肩關節為例）", width: 100, tooltipField: '下列任何部位請以酸痛不適與影響關節活動評斷。任選分數高者。酸痛不適程度與關節活動能力：（以肩關節為例）' },
        { field: '您平常使用電腦、滑鼠慣用手為？', headerName: "您平常使用電腦、滑鼠慣用手為？", width: 100, tooltipField: '您平常使用電腦、滑鼠慣用手為？' },
        { field: '您在過去的1年內，身體是否有長達2星期以上的疲勞、酸痛、發麻、刺痛等不舒服，或關節活動受到限制？', headerName: "您在過去的1年內，身體是否有長達2星期以上的疲勞、酸痛、發麻、刺痛等不舒服，或關節活動受到限制？", width: 100, tooltipField: '您在過去的1年內，身體是否有長達2星期以上的疲勞、酸痛、發麻、刺痛等不舒服，或關節活動受到限制？' },
        { field: '下表的身體部位酸痛、不適或影響關節活動之情形持續多久時間？', headerName: "下表的身體部位酸痛、不適或影響關節活動之情形持續多久時間？", width: 100, tooltipField: '下表的身體部位酸痛、不適或影響關節活動之情形持續多久時間？' },
        { field: '痠痛症狀調查(請對應位置，在量化後的分數欄位中點選)：0表示『不痛』;1表示『痛可忽略』;2表示『可能影響工作』;3表示『影響工作』;4表示『影響自主活動功能』;5表示『完全無法自主活動』', headerName: "痠痛症狀調查(請對應位置，在量化後的分數欄位中點選)：0表示『不痛』;1表示『痛可忽略』;2表示『可能影響工作』;3表示『影響工作』;4表示『影響自主活動功能』;5表示『完全無法自主活動』", width: 100, tooltipField: '痠痛症狀調查(請對應位置，在量化後的分數欄位中點選)：0表示『不痛』;1表示『痛可忽略』;2表示『可能影響工作』;3表示『影響工作』;4表示『影響自主活動功能』;5表示『完全無法自主活動』' },
        { field: '頸部', headerName: "頸部", width: 100, tooltipField: '頸部' },
        { field: '上背部', headerName: "上背部", width: 100, tooltipField: '上背部' },
        { field: '下背部', headerName: "下背部", width: 100, tooltipField: '下背部' },
        { field: '左肩部', headerName: "左肩部", width: 100, tooltipField: '左肩部' },
        { field: '右肩部', headerName: "右肩部", width: 100, tooltipField: '右肩部' },
        { field: '左手肘/左前臂', headerName: "左手肘/左前臂", width: 100, tooltipField: '左手肘/左前臂' },
        { field: '右手肘/右前臂', headerName: "右手肘/右前臂", width: 100, tooltipField: '右手肘/右前臂' },
        { field: '左手/左手腕', headerName: "左手/左手腕", width: 100, tooltipField: '左手/左手腕' },
        { field: '右手/右手腕', headerName: "右手/右手腕", width: 100, tooltipField: '右手/右手腕' },
        { field: '左臀/左大腿', headerName: "左臀/左大腿", width: 100, tooltipField: '左臀/左大腿' },
        { field: '右臀/右大腿', headerName: "右臀/右大腿", width: 100, tooltipField: '右臀/右大腿' },
        { field: '左膝', headerName: "左膝", width: 100, tooltipField: '左膝' },
        { field: '右膝', headerName: "右膝", width: 100, tooltipField: '右膝' },
        { field: '左腳踝/左腳', headerName: "左腳踝/左腳", width: 100, tooltipField: '左腳踝/左腳' },
        { field: '右腳踝/右腳', headerName: "右腳踝/右腳", width: 100, tooltipField: '右腳踝/右腳' },
        { field: '其他症狀、病史說明', headerName: "其他症狀、病史說明", width: 100, tooltipField: '其他症狀、病史說明' },
    ])
    const columnMap = useMemo(() => ({
        '67': fatigueColumns,
        '68': moodColumns,
        '69': muscleColumns,
      }), [fatigueColumns, moodColumns, muscleColumns]);
      
      useEffect(() => {
        if (rowData && rowData.length > 0) {
          const keys = Object.keys(rowData[0]);
      
          let questionNo = '';
          if (keys.includes('你常覺得疲勞嗎?')) {
            questionNo = '67';
          } else if (keys.includes('我常常覺得想哭')) {
            questionNo = '68';
          } else if (keys.includes('您平常使用電腦、滑鼠慣用手為？')) {
            questionNo = '69';
          }
      
          console.log('Guessed QuestionNo:', questionNo);
      
          const newColumnDefs = columnMap[questionNo] || [];
          setColumnDefs(newColumnDefs);
        }
      }, [rowData, columnMap]);
    // useEffect(() => {
    //     if (rowData && rowData.length > 0) {
    //       const questionNo = rowData[0].QuestionNo; // 確保根據條件設定欄位
    //       switch (questionNo) {
    //         case '67':
    //           setColumnDefs(fatigueColumns); // 設定相應的欄位
    //           break;
    //         case '68':
    //           setColumnDefs(moodColumns);
    //           break;
    //         case '69':
    //           setColumnDefs(muscleColumns);
    //           break;
    //         default:
    //           setColumnDefs([]);
    //       }
    //     }
    //   }, [rowData]); // 依賴於 rowData 更新
 
    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };


    
    const dateFormat = 'YYYY/MM/DD'


    const [startDate, setStartDate] = React.useState('')
    const [endDate,   setEndDate] = React.useState('')
    const [Itemno, setItemno] = React.useState(''); // 使用 useState 初始化
    const [Value, setValue] = React.useState('');
    
    const [projectNo, setprojectNo] = React.useState('')
    const [todayList, setTodayList] = React.useState([])
    const [historyList, setHistoryList] = React.useState([])
    const [historyPerson, setHistoryPerson] = React.useState([])
    const [history, setHistory] = React.useState([])

    const [inputValue, setInputValue] = React.useState(''); // 使用 useState 初始化

    const [settingObj, setSettingObj] = useState({
        ProjectNo: {
          value: '', // 初始值
          error: false, // 初始错误状态
          helperText: '' // 初始帮助文本
        },
        Name:{
            value: '',
        }
      });

      const handleAutoCompleteChange = (event, newValue) => {
        if (newValue) {
            setSettingObj((prevSettingObj) => ({
                ...prevSettingObj,
                ProjectNo: {
                    ...prevSettingObj.ProjectNo,
                    value: newValue
                }
            }));
        } else {
            // 可以設定為一個空對象或空字串，根據需求
            setSettingObj((prevSettingObj) => ({
                ...prevSettingObj,
                ProjectNo: {
                    ...prevSettingObj.ProjectNo,
                    value: ""
                }
            }));
        }
    };
        // console.log(newValue)
        // setSettingObj(prevState => ({
        //    ...prevState,
        //     CheckNo: {...prevState.ProjectNo,value:newValue.ProjectNo}
        // })) 

        // setItemno(newValue.ProjectNo)
        
    //   };

    // useEffect(()=>{
    //     console.log(settingObj)
    // },[settingObj])

    const handleQuery = () => {
        

        if (!startDate || startDate === '' || !endDate || endDate === '') {
            enqueueSnackbar('請輸入日期', { variant: 'error', style: { whiteSpace: 'pre-line' } });
            return;
        }
    
        if (settingObj.ProjectNo.value === "" || settingObj.ProjectNo.value === null) {
            enqueueSnackbar('請選擇專案', { variant: 'error', style: { whiteSpace: 'pre-line' }, autoHideDuration: 3000 });
            return;
        }
    
            setOpen(true);;
        let no = settingObj.ProjectNo.value.ProjectNo;
        // console.log(no)
            PF.instance({
                method: "post",
                url: PF.url2 + "/QuestionReport/GetQuestionReport",
                data: Qs.stringify({
                    Action: "1",
                    parameter: {
                        startDate: startDate,
                        endDate: endDate,
                        ProjectNo: no,
                        QuestionNo:QuestionNo,
                    }
                }),
                headers: { token: sessionStorage.token }
            })
                .then(function (response) {
                    setOpen(false);
                    // console.log(response.data)
                    const { TotalRecord, rows, rows2 } = response.data
                    console.log(rows)
                    // console.log(rows2)
                    
                    

                    if (TotalRecord < 0) {
                        enqueueSnackbar("錯誤", { variant: "error", style: { whiteSpace: 'pre-line' } });
                    } else if (TotalRecord === 0) {
                        enqueueSnackbar("沒有資料", { variant: "warning", style: { whiteSpace: 'pre-line' } });
                        setRowData([]);
                        setHistoryList([]);
                        // setQuestionNo([]);
                    } else {
                        enqueueSnackbar(`成功: 找到 ${TotalRecord} 筆記錄`, { variant: "success", style: { whiteSpace: 'pre-line' } });
                        setRowData(rows);
                        setHistoryList(rows2);
                        // setQuestionNo(rows2);

                        // setRowData(rows);
                        

                        
                        // setHistoryList(rows2);
                        // const x = rows.map(item => {
                        //     return { ...item, "歷史筆數": rows2.filter(x=>x.ID === item.ID),"歷史腸胃"： }
                        // })
                        // console.log(x)
                        // setSelectListGroup(rowsGroup);
                        


                    }
                })
        // } else {
        //     enqueueSnackbar("請輸入日期", { variant: "error", style: { whiteSpace: 'pre-line' } });

        // }


    }
    
    const handleRowClick = event => {
        const { data } = event;
        // console.log(data)

        // const x = historyList.filter(x => x.ID === data.ID)
        // // 放資料到表二
        // setHistoryPerson(x)

    }
    const onChange = (date, dateString) => {
        console.log( dateString);
        setStartDate(dateString[0]);
        setEndDate(dateString[1]);

    };

    const rowHeight = 30;

    

    // const locales = [
    //     {
    //         language: "en-US",
    //         locale: "en",
    //     },
    //     {
    //         language: "es-ES",
    //         locale: "es",
    //     },
    // ];
    // const [locale, setLocale] = React.useState(locales[0]);

    return (
        <>
            {/* <DatePicker onChange={onChange}  format={dateFormat} />    */}
           
            <RangePicker onChange={onChange} format={dateFormat}style={{ marginBottom: '5px', height: '40px', marginTop: '5px' }}    inputStyle={{ height: '20px' }}  />
             {/* <Input placeholder="Itemno" value={Itemno} onChange={(e) => setItemno(e.target.value)} style={{ width: '80px', marginRight: '5px', marginLeft: '3px' }} /> */}
             <FormControl style={{ marginRight: '8px', marginLeft: '3px', marginTop: '6px', marginBottom: '4px' }}>
                        <Autocomplete
                            value={settingObj.ProjectNo.value || ""}
                            isOptionEqualToValue={(option, value) => option === value}
                            onChange={handleAutoCompleteChange}
                            inputValue={inputValue || ""}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason !== "clear") {
                                    setInputValue(newInputValue);
                                }
                            }}
                            getOptionLabel={(option) => option.ProjectName || ""}
                            filterOptions={(option, { inputValue }) => option.filter(item => item.ProjectNo.toString().includes(inputValue) || item.ProjectName.toString().includes(inputValue))}
                            renderOption={(props, option) => (
                                <li {...props} key={option.ProjectNo}>
                                    {'[' + option.ProjectNo + ']'}
                                    {option.ProjectName}
                                </li>
                            )}
                            options={ProjectList}
                            sx={{ width: 280 }}
                            renderInput={(params) =>
                                <TextField {...params}
                                    size="small"
                                    // error={settingObj.ProjectNo.error || false}
                                    // helperText={settingObj.ProjectNo.error ? settingObj.ProjectNo.helperText : ""}
                                    name={"ProjectNo"}
                                    required={true}
                                    label="專案名稱" variant="outlined" />}
                        />
                    </FormControl>
                    
                    <TextField
                        label="QuestionNo"
                        variant="outlined"
                        value={QuestionNo}
                        onChange={(e) => setQuestionNo(e.target.value)}
                        style={{ marginRight: '10px', width: '90px', marginTop: '5px' }} // Adjusted top margin
                        InputProps={{
                            style: {
                                height: '40px', // Adjusted height
                            },
                        }}
                    />
             {/* <Input placeholder="Value" value={Value} onChange={(e) => setValue(e.target.value)} style={{ width: '400px',height: '45px', marginRight: '5px',marginTop: '3px' }} />            */}
             <Button onClick={handleQuery} variant="contained" style={{ marginLeft: '5px' }}>查詢</Button>
           
             <Grid container spacing={0}>
                <Grid item xs={12}>
                    <div style={containerStyle}>
                        <div className="ag-theme-alpine" style={{ height: 670, width: 1515 }}>
                            <AgGridReact
                            ref={gridRef}
                            rowData={rowData} // 根據條件設置 rowData
                            columnDefs={columnDefs} // 動態改變欄位
                            rowSelection={'multiple'}
                            defaultColDef={defaultColDef}
                            enableRangeSelection={true}
                            onRowClicked={handleRowClick}
                            rowHeight={rowHeight}
                            enableStatusBar={true}
                            statusBar={statusBar}
                            />
                        </div>
                    </div>
                </Grid>
            </Grid>



            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleQuery}>
            <CircularProgress color="inherit" />
            </Backdrop>
        </>

    )
}

export default QuestionReportRecords