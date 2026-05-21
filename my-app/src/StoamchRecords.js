import React, { useEffect,useMemo,useRef,useState,StrictMode, } from 'react';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, IconButton, MenuItem, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { actions } from "./reducers/app";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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
const StoamchRecords = props => {
    
    
    
    
    
    const [ProjectList, setProjectList] = React.useState([]);
    

    useEffect(()=>{
        PF.instance({
            method: "post",
            url: PF.url + "/CheckItem/GetData",
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
    const [openLogoutConfirm, setOpenLogoutConfirm] = React.useState(false);
   
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

     

    // function maskId(id) {
    //     // 只顯示前三碼和後三碼，中間的字符用星號遮擋
    //     if (id.length > 6) { // 至少需要 7 個字符才能保留前三碼和後三碼
    //         const visibleLength = 3; // 要顯示的字符數
    //         const maskedPart = '*'.repeat(id.length - (visibleLength * 2)); // 中間字符用星號遮擋
    //         const startPart = id.slice(0, visibleLength);
    //         const endPart = id.slice(-visibleLength);
    //         return startPart + maskedPart + endPart;
    //     }
    //     return id; // 如果長度不足 7 個字符，不進行遮擋
    // }

    const gridRef = React.useRef();
    const gridRef2 = React.useRef();

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const pageStyle = useMemo(() => ({
        minHeight: 'calc(100vh - 32px)',
        boxSizing: 'border-box',
        padding: '18px',
        borderRadius: '14px',
        background: '#f5f7fb',
    }), []);
    const gridShellStyle = useMemo(() => ({
        height: 'calc(100vh - 156px)',
        minHeight: 520,
        width: '100%',
        '--ag-font-size': '13px',
        '--ag-header-height': '42px',
        '--ag-row-hover-color': '#eef5ff',
        '--ag-selected-row-background-color': '#dcecff',
        '--ag-border-color': '#d7dee8',
        '--ag-header-background-color': '#f8fafc',
        '--ag-odd-row-background-color': '#fbfdff',
    }), []);
    // const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();

    const [columnDefs] = React.useState([
        // { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'No' },
        { field: 'id', headerName: "身份證號", width: 150, tooltipField: 'id'},//,valueFormatter: (params) => maskId(params.value)}, // 使用 valueFormatter 設置處理方式 
        { field: 'Name', headerName: "姓名", width: 180, tooltipField: 'Name' },
        { field: 'SpecialCheckDate', headerName: "體檢日", width: 150, tooltipField: 'SpecialCheckDate' },
        { field: 'Itemno', headerName: "項目", width: 150, tooltipField: 'Itemno' },
        { field: 'Err', headerName: "異常值", width: 150, tooltipField: 'Err' , valueFormatter: params => params.value === true ? 1 : 0}, // 格式化函数，根据字段值返回相应的显示值},
        { field: 'Value', headerName: "狀況", width: 780, tooltipField: 'Value'},
        // { field: 'sogi', headerName: "電話", width: 150, tooltipField: 'sogi' },
        // { field: 'sex', headerName: "性別", width: 150, tooltipField: 'sex' },
        // { field: 'OrderDate', headerName: "預約日", width: 150, tooltipField: 'OrderDate' },
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
    const dateFormat = 'YYYY/MM/DD'


    const [startDate, setStartDate] = React.useState('')
    const [endDate,   setEndDate] = React.useState('')
    const [Itemno, setItemno] = React.useState(''); // 使用 useState 初始化
    const [Value, setValue] = React.useState('');
    const [todayList, setTodayList] = React.useState([])
    const [historyList, setHistoryList] = React.useState([])
    const [historyPerson, setHistoryPerson] = React.useState([])

    const [inputValue, setInputValue] = React.useState(''); // 使用 useState 初始化

    const [settingObj, setSettingObj] = useState({
        CheckNo: {
          value: '', // 初始值
          error: false, // 初始错误状态
          helperText: '' // 初始帮助文本
        },
        Name:{
            value: '',
        }
      });

      const handleAutoCompleteChange = (event, newValue) => {
        setSettingObj((prevSettingObj) => ({
          ...prevSettingObj,
          CheckNo: {
            ...prevSettingObj.CheckNo,
            value: newValue
          }
        }));
        console.log(newValue)
        // setSettingObj(prevState => ({
        //    ...prevState,
        //     CheckNo: {...prevState.CheckNo,value:newValue.CheckNo}
        // })) 

        // setItemno(newValue.CheckNo)
        
      };

    useEffect(()=>{
        console.log(settingObj)
    },[settingObj])

    const handleQuery = () => {
        

        if (!startDate || startDate === '' || !endDate || endDate === '') {
            enqueueSnackbar('請輸入日期', { variant: 'error', style: { whiteSpace: 'pre-line' } });
            return;
        }
    
         if (inputValue.trim() === '') {
             enqueueSnackbar('請輸入 Itemno', { variant: 'error' });
             return;
         }
    
            setOpen(true);;
        let no = settingObj.CheckNo.value.CheckNo;
        console.log(no)
            PF.instance({
                method: "post",
                url: PF.url2 + "/stomach/Getstomachcheck",
                data: Qs.stringify({
                    Action: "1",
                    parameter: {
                        startDate: startDate,
                        endDate: endDate,
                        Itemno: no,
                        Value:  Value,
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

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleLogoutClick = () => {
        setOpenLogoutConfirm(true);
    };
    
    const confirmLogout = () => {
        setOpenLogoutConfirm(false);
        navigate(`/Login`, { replace: true });
        dispatch(actions.UserInfo({}));
        dispatch(actions.TOKEN_SET(""));
        localStorage.removeItem("UserInfo");
        localStorage.removeItem("token");
    };

    

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
        <div style={pageStyle}>
            {/* <DatePicker onChange={onChange}  format={dateFormat} />    */}
           
             {/* <RangePicker onChange={onChange} format={dateFormat} /> */}
             {/* <Input placeholder="Itemno" value={Itemno} onChange={(e) => setItemno(e.target.value)} style={{ width: '80px', marginRight: '5px', marginLeft: '3px' }} /> */}
            <Paper
                elevation={0}
                sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid #dde5ef',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 8px 24px rgba(20, 41, 70, 0.06)',
                }}
            >
                <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md="auto">
                        <RangePicker onChange={onChange} format={dateFormat} style={{ width: '100%', minWidth: 250, height: 40 }} />
        </Grid>
                    <Grid item xs={12} md="auto">
                        <FormControl fullWidth>
                <Autocomplete
                    value={settingObj.CheckNo.value || ""}
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={handleAutoCompleteChange}
                    inputValue={inputValue || ""}
                    onInputChange={(event, newInputValue, reason) => {
                        if (reason !== "clear") {
                            setInputValue(newInputValue);
                        }
                    }}
                    getOptionLabel={(option) => option.Name || ""}
                    filterOptions={(option, { inputValue }) => option.filter(item => item.CheckNo.toString().includes(inputValue) || item.Name.toString().includes(inputValue))}
                    renderOption={(props, option) => (
                        <li {...props} key={option.CheckNo}>
                            {'[' + option.CheckNo + ']'}
                            {option.Name}
                        </li>
                    )}
                    options={ProjectList}
                    sx={{
                        width: { xs: '100%', md: 300 },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fff',
                        },
                    }}
                    renderInput={(params) =>
                        <TextField {...params}
                            size="small"
                            error={settingObj.CheckNo.error || false}
                            helperText={settingObj.CheckNo.error ? settingObj.CheckNo.helperText : ""}
                            name={"CheckNo"}
                            required={true}
                            label="項目名稱" variant="outlined" />}
                />
            </FormControl>
        </Grid>
                    <Grid item xs={12} md>
                        <Input placeholder="Value" value={Value} onChange={(e) => setValue(e.target.value)} style={{ width: '100%', height: 40 }} />
        </Grid>
                    <Grid item xs={12} sm="auto" sx={{ '& .MuiButton-root': { minWidth: 96, height: 40, width: '100%', boxShadow: 'none' } }}>
            <Button onClick={handleQuery} variant="contained">查詢</Button>
        </Grid>
                    <Grid item xs={12} sm="auto" sx={{ ml: { md: 'auto' }, '& .MuiButton-root': { minWidth: 104, height: 40, width: '100%', boxShadow: 'none' } }}>
            <Button onClick={handleLogoutClick} variant="contained" startIcon={<ExitToAppIcon />}>登出</Button>
        </Grid>
                </Grid>
            </Paper>
           
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    border: '1px solid #dde5ef',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 8px 24px rgba(20, 41, 70, 0.05)',
                    overflow: 'hidden',
                }}
            >
            <Grid container spacing={0}>
                <Grid item xs={12}>
                <div style={containerStyle}>
                    <div className="ag-theme-alpine" style={gridShellStyle}>
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
            </Paper>



            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleQuery}>
            <CircularProgress color="inherit" />
            </Backdrop>
            
            <Dialog open={openLogoutConfirm} onClose={() => setOpenLogoutConfirm(false)}>
                <DialogTitle>確認登出</DialogTitle>
                <DialogContent>
                    <DialogContentText>確定要登出嗎？</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogoutConfirm(false)}>取消</Button>
                    <Button onClick={confirmLogout} variant="contained" color="error">確認登出</Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}

export default StoamchRecords 
