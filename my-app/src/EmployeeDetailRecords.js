import React, { useEffect } from 'react';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, IconButton, MenuItem, Stack } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import _, { omit, pick } from 'lodash'
import PF from "./_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import { DatePicker, Space ,Input } from 'antd';
import moment from 'moment';
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

const EmployeeDetailRecords = props => {
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

    const [columnDefs] = React.useState([
        // { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'No' },
        { field: 'onjob_flag_name', headerName: "員工狀態", width: 110, tooltipField: 'onjob_flag_name' },
        { field: 'com_id', headerName: "公司", width: 90, tooltipField: 'com_id' },
        { field: 'personnel_code', headerName: "工號", width: 110, tooltipField: 'personnel_code' },
        { field: 'personnel_name', headerName: "姓名", width: 100, tooltipField: 'personnel_name' },
        { field: 'idno', headerName: "身分證號", width: 120, tooltipField: 'idno' },
        { field: 'birth', headerName: "生日", width: 130, tooltipField: 'birth' },
        { field: 'gender_name', headerName: "性別", width: 80, tooltipField: 'gender_name' },
        { field: 'dept_name', headerName: "組別", width: 110, tooltipField: 'dept_name' },
        { field: 'position_name', headerName: "職稱", width: 100, tooltipField: 'position_name' },
        { field: 'entry_date', headerName: "入職日", width: 120, tooltipField: 'entry_date' },
        { field: 'seniority_date', headerName: "年資起算日", width: 120, tooltipField: 'seniority_date' },
        { field: 'dimission_date', headerName: "離職日", width: 120, tooltipField: 'dimission_date' },
        { field: 'contact_add1', headerName: "地址", width: 100, tooltipField: 'contact_add1' },
        { field: 'tel2', headerName: "手機", width: 120, tooltipField: 'tel2' },
        { field: 'email1', headerName: "信箱", width: 120, tooltipField: 'email1' },
        { field: 'urgencyman', headerName: "緊急連絡人", width: 120, tooltipField: 'urgencyman' },
        { field: 'urgencytel', headerName: "聯絡人手機", width: 120, tooltipField: 'urgencytel' },
        { field: 'remark', headerName: "證照", width: 100, tooltipField: 'remark' },
        { field: 'dimissiontype_name', headerName: "離職類型", width: 120, tooltipField: 'dimissiontype_name' },
        { field: 'dscause_name', headerName: "離職原因", width: 120, tooltipField: 'dscause_name' },
        { field: 'dscomment', headerName: "轉廠", width: 100, tooltipField: 'dscomment' },
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


    const [CheckDate, setStartDate] = React.useState(new Date().toJSON().slice(0, 10).replace(/-/g, '/'))
    const [todayList, setTodayList] = React.useState([])
    const [BarCodeStr, setBarCodeStr] = React.useState('');
    const [historyList, setHistoryList] = React.useState([])
    const [historyPerson, setHistoryPerson] = React.useState([])

    const handleQuery = () => {

        if (CheckDate !== '') {
            // console.log("O")
            setOpen(true);

            PF.instance({
                method: "post",
                url: PF.url2 + "/EmployeeDetail/GetEmployeeDetail",
                data: Qs.stringify({
                    Action: "1", 
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
                        // const x = rows.map(item => {
                        //     return { ...item, "歷史筆數": rows2.filter(x=>x.ID === item.ID),"歷史腸胃"： }
                        // })
                        // console.log(x)
                        // setTodayList(rows);
                        // setHistoryList(rows2);
                        // setSelectListGroup(rowsGroup);


                    }
                })
        } else {
            enqueueSnackbar("請輸入資料", { variant: "error", style: { whiteSpace: 'pre-line' } });

        }


    }
    const handleRowClick = event => {
        const { data } = event;
        // console.log(data)

        // const x = historyList.filter(x => x.ID === data.ID)
        // // 放資料到表二
        // setHistoryPerson(x)

    }
    const onChange = (date, dateString) => {
        console.log(gridRef);
        setStartDate(dateString);

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

    // const handleKeyPress = (event) => {
    //     if (event.key === 'Enter') {
    //         // 按下 Enter 鍵時觸發查詢
    //         handleQuery();
    //     }
    // };
    // const handleInputChange = (e) => {
    //     const inputValue = e.target.value;
      
    //     // 在輸入完整詞語後進行檢查
    //     if (/^\d*$/.test(inputValue)) {
    //       // 移除非數字字符
    //       const numericInput = inputValue.replace(/[^\d]/g, '');
      
    //       // 截斷為10個字符
    //       const truncatedInput = numericInput.slice(0, 10);
      
    //       // 更新狀態
    //       setBarCodeStr(truncatedInput);
    //     }
    //   };
      

 

    return (
        <>

            {/* <DatePicker onChange={onChange} defaultValue={moment(moment(), dateFormat)} format={dateFormat} /> */}
            {/* <Input
                placeholder="barcoder"
                value={BarCodeStr}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress} 
                style={{ width: '120px', marginRight: '5px' }}
            /> */}
            <Button onClick={handleQuery} variant="contained" >查詢</Button>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <div className="ag-theme-alpine" style={{ height: 680, width: 1515 }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={todayList}
                            columnDefs={columnDefs}
                            rowSelection='single'
                            defaultColDef={defaultColDef}
                            enableRangeSelection={true}
                            statusBar={statusBar}
                            onRowClicked={handleRowClick}
                            rowHeight={rowHeight}
                        // rowMultiSelectWithClick={true}
                        // onRowDoubleClicked={onRowDoubleClicked}
                        // enableCellTextSelection={true}
                        // ensureDomOrder={true}
                        // groupSelectsFiltered={true}
                        // suppressRowClickSelection={true}


                        >
                        </AgGridReact>
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

export default EmployeeDetailRecords