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
const AttendanceRecords = props => {
    
    // const [ProjectList, setProjectList] = React.useState([]);

    // useEffect(()=>{
    //     PF.instance({
    //         method: "post",
    //         url: PF.url + "/CheckItem/GetData",
    //         data: Qs.stringify({ Action: "1" }),
    //         // headers: { token: sessionStorage.token }
    //     })
    //         .then(function (response) {
    //             // alert("完成")
    //             const { TotalRecord, rows } = response.data;
    //             // console.log(rows)
    //             if (TotalRecord > 0) {
    //                 // enqueueSnackbar("查詢成功", { variant: "success", style: { whiteSpace: 'pre-line' } });
    //                 setProjectList(rows)
    //                 // console.log(rows)

    //             }
    //             else {
    //                 enqueueSnackbar("查無資料", { variant: "warning", style: { whiteSpace: 'pre-line' } });
    //             }
    //         })


    // },[])
    
    

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

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    // const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();

    const [columnDefs] = React.useState([
        // { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'No' },
        { field: 'work_mon', headerName: "考勤月份", width: 120, tooltipField: 'work_mon' },
        { field: 'personnel_code', headerName: "工號", width: 100, tooltipField: 'personnel_code' },
        { field: 'personnel_name', headerName: "姓名", width: 100, tooltipField: 'personnel_name' },
        { field: 'dept_name', headerName: "部門", width: 120, tooltipField: 'dept_name', cellStyle: { textAlign: 'left' }},
        { field: 'alldays', headerName: "總天數", width: 100, tooltipField: 'alldays' },
        { field: 'restdays', headerName: "休息日天數", width: 120, tooltipField: 'restdays' },
        { field: 'vacationdays', headerName: "節假日天數", width: 120, tooltipField: 'vacationdays' },
        { field: 'exvacationdays', headerName: "例假日天數", width: 120, tooltipField: 'exvacationdays' },
        { field: 'workdays', headerName: "應出勤天數", width: 120, tooltipField: 'workdays' },
        { field: 'workhours', headerName: "應出勤時數", width: 120, tooltipField: 'workhours' },
        { field: 'realworkdays', headerName: "實出勤天數", width: 120, tooltipField: 'realworkdays' },
        { field: 'realworkhours', headerName: "實出勤時數", width: 120, tooltipField: 'realworkhours' },
        { field: 'leavehours', headerName: "請假時數", width: 120, tooltipField: 'leavehours' },
        { field: 'resthours', headerName: "休假時數", width: 120, tooltipField: 'resthours' },
        { field: 'late_count', headerName: "遲到次數", width: 120, tooltipField: 'late_count' },
        { field: 'late_mis', headerName: "遲到分鐘", width: 120, tooltipField: 'late_mis' },
        { field: 'leftearly_count', headerName: "早退次數", width: 120, tooltipField: 'leftearly_count' },
        { field: 'leftearly_mis', headerName: "早退分鐘", width: 120, tooltipField: 'leftearly_mis' },
        { field: 'absentwork_count', headerName: "曠工次數", width: 120, tooltipField: 'absentwork_count' },
        { field: 'absentwork_hour', headerName: "曠工時數", width: 120, tooltipField: 'absentwork_hour' },
        { field: 'downtime_hours', headerName: "輪休時數", width: 120, tooltipField: 'downtime_hours' },
        { field: 'realextrahours', headerName: "加班計薪時數", width: 130, tooltipField: 'realextrahours' },
        { field: 'rest_extra', headerName: "加班計調休時數", width: 150, tooltipField: 'rest_extra' },
        { field: 'workday_extra', headerName: "平日加班時數", width: 130, tooltipField: 'workday_extra' },
        { field: 'restday_extra', headerName: "休息日加班時數", width: 150, tooltipField: 'restday_extra' },
        { field: 'holiday_extra', headerName: "例假日加班時數", width: 150, tooltipField: 'holiday_extra' },
        { field: 'festival_extra', headerName: "節日加班時數", width: 130, tooltipField: 'festival_extra' },
        { field: 'workday_pbonus', headerName: "平日生產獎金時數", width: 160, tooltipField: 'workday_pbonus' },
        { field: 'restday_pbonus', headerName: "休息日生產獎金時數", width:170, tooltipField: 'restday_pbonus' },
        { field: 'holiday_pbonus', headerName: "例假日生產獎金時數", width: 170, tooltipField: 'holiday_pbonus' },
        { field: 'festival_pbonus', headerName: "節日生產獎金時數", width: 160, tooltipField: 'festival_pbonus' },
        // {  field: '單價', headerName: "單價", width: 200, tooltipField: '單價', 
        // valueFormatter: (params) => {
        //     return params.value ? parseFloat(params.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';},},
        // { field: '單價', headerName: "單價", width: 120, tooltipField: '單價' },
        // { field: '失效日', headerName: "失效日", width: 150, tooltipField: '失效日' },
        // { field: '補檢', headerName: "補檢", width: 100, tooltipField: '補檢' },
        // { field: '腸胃', headerName: "腸胃", width: 100, tooltipField: '腸胃' },
        // { field: '抹片', headerName: "抹片", width: 100, tooltipField: '抹片' },
    ])
    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };


    // const [columnDefs2] = React.useState([
    //     { headerName: '', valueGetter: 'node.rowIndex + 1', width: 30, pinned: 'left', tooltipField: 'No' },
    //     // { field: 'BarCodeStr', headerName: "條碼號", width: 130, tooltipField: 'BarCodeStr' },
    //     { field: 'ID', headerName: "身份證號", width: 130, tooltipField: 'ID' },
    //     { field: 'Birthday', headerName: "生日", width: 120, tooltipField: 'Birthday' },
    //     { field: 'personName', headerName: "姓名", width: 100, tooltipField: 'personName' },
    //     { field: 'SpecialCheckDate', headerName: "健檢日", width: 120, tooltipField: 'SpecialCheckDate' },
    //     { field: 'OrderDate', headerName: "預約日", width: 120, tooltipField: 'OrderDate' },
    //     { field: '腸胃', headerName: "腸胃", width: 80, tooltipField: '腸胃' },
    //     { field: '抹片', headerName: "抹片", width: 80, tooltipField: '抹片' },
    // ])
    const dateFormat = 'YYYY/MM'


    const [startDate, setStartDate] = React.useState('')
    const [endDate,   setEndDate] = React.useState('')
    const [Itemno, setItemno] = React.useState(''); // 使用 useState 初始化
    const [Value, setValue] = React.useState('');
    const [todayList, setTodayList] = React.useState([])
    const [historyList, setHistoryList] = React.useState([])
    const [historyPerson, setHistoryPerson] = React.useState([])

    const [inputValue, setInputValue] = React.useState(''); // 使用 useState 初始化

    // const [settingObj, setSettingObj] = useState({
    //     CheckNo: {
    //       value: '', // 初始值
    //       error: false, // 初始错误状态
    //       helperText: '' // 初始帮助文本
    //     },
    //     Name:{
    //         value: '',
    //     }
    //   });

    //   const handleAutoCompleteChange = (event, newValue) => {
    //     setSettingObj((prevSettingObj) => ({
    //       ...prevSettingObj,
    //       CheckNo: {
    //         ...prevSettingObj.CheckNo,
    //         value: newValue
    //       }
    //     }));
    //     console.log(newValue)
    //     // setSettingObj(prevState => ({
    //     //    ...prevState,
    //     //     CheckNo: {...prevState.CheckNo,value:newValue.CheckNo}
    //     // })) 

    //     // setItemno(newValue.CheckNo)
        
    //   };

    // useEffect(()=>{
    //     console.log(settingObj)
    // },[settingObj])

    const handleQuery = () => {
        

        if (!startDate || startDate === '' || !endDate || endDate === '') {
            enqueueSnackbar('請輸入日期', { variant: 'error', style: { whiteSpace: 'pre-line' } });
            return;
        }
    
        // if (inputValue.trim() === '') {
        //     enqueueSnackbar('請輸入 Itemno', { variant: 'error' });
        //     return;
        // }
    
            setOpen(true);;
        // let no = settingObj.CheckNo.value.CheckNo;
        // console.log(no)
            PF.instance({
                method: "post",
                url: PF.url2 + "/Attendance/GetAttendance",
                data: Qs.stringify({
                    Action: "1",
                    parameter: {
                        startDate: startDate,
                        endDate: endDate,
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
                        setTodayList([]);
                        setHistoryList([]);
                    } else {
                        enqueueSnackbar(`成功: 找到 ${TotalRecord} 筆記錄`, { variant: "success", style: { whiteSpace: 'pre-line' } });
                        setTodayList(rows);
                        setHistoryList(rows2);

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
           
             <RangePicker picker="month" onChange={onChange} format={dateFormat} style={{ marginBottom: '5px' }} />
             {/* <Input placeholder="Itemno" value={Itemno} onChange={(e) => setItemno(e.target.value)} style={{ width: '80px', marginRight: '5px', marginLeft: '3px' }} /> */}
             {/* <FormControl style={{  marginRight: '5px', marginLeft: '3px',marginTop: '6px',marginBottom: '4px' }}>
                            <Autocomplete
                                value={settingObj.CheckNo.value || ""}
                                isOptionEqualToValue={(option, value) => option === value}
                                onChange={handleAutoCompleteChange}
                                inputValue={inputValue || ""}
                                onInputChange={(event, newInputValue, reason) => {
                                    if (reason !== "clear") {
                                        setInputValue(newInputValue);
                                    }
                                    // console.log(newInputValue, 'i')
                                }}
                                getOptionLabel={(option) => option.Name ||""} //大小寫須一致
                                filterOptions={(option, { inputValue }) => option.filter(item => item.CheckNo.toString().includes(inputValue) || item.Name.toString().includes(inputValue))}
                                renderOption={(props, option) => (//表達格式
                                    <li {...props} key={option.CheckNo}>
                                        {'[' + option.CheckNo + ']'}
                                        {option.Name}
                                    </li>
                                )}
                                options={ProjectList}
                                sx={{ width: 280 }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        size="small"
                                        error={settingObj.CheckNo.error || false}
                                        helperText={settingObj.CheckNo.error ? settingObj.CheckNo.helperText : ""}
                                        name={"CheckNo"}
                                        required={true}
                                        label="項目名稱" variant="outlined" />}
                                        />
             </FormControl> */}
             {/* <Input placeholder="Value" value={Value} onChange={(e) => setValue(e.target.value)} style={{ width: '400px',height: '45px', marginRight: '5px',marginTop: '3px' }} />            */}
             <Button onClick={handleQuery} variant="contained" style={{ marginLeft: '5px' }}>查詢</Button>
           
            <Grid container spacing={0}>
                <Grid item xs={12} md={6} textAlign="right">
                <div style={containerStyle}>
                    <div  className="ag-theme-alpine" style={{ height: 670, width: 1518 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={todayList}
                            columnDefs={columnDefs}
                            rowSelection={'multiple'}
                            defaultColDef={defaultColDef}
                            enableRangeSelection={true}
                            onRowClicked={handleRowClick}
                            rowHeight={rowHeight}
                            enableStatusBar={true}
                            statusBar={statusBar}
                        // onSelectionChanged={handleSelectionChanged}
                        // rowMultiSelectWithClick={true}
                        // onRowDoubleClicked={onRowDoubleClicked}
                        // enableCellTextSelection={true}
                        // ensureDomOrder={true}
                        // groupSelectsFiltered={true}
                        // suppressRowClickSelection={true}
                        >
                        </AgGridReact>
                    </div>
                 </div> 
                </Grid>
                {/* <Grid item xs={12} md={6}>
                    <div className="ag-theme-alpine" style={{ height: 950, width: 780 }}>
                        <AgGridReact
                            ref={gridRef2}
                            rowData={historyPerson}
                            columnDefs={columnDefs2}
                            rowSelection='single'
                            defaultColDef={defaultColDef}
                            enableRangeSelection={true}
                            statusBar={statusBar}
                            onRowClicked={handleRowClick}
                            rowHeight={rowHeight}

                        >
                        </AgGridReact>

                    </div>

                </Grid> */}
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

export default AttendanceRecords 