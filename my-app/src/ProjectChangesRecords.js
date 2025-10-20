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
// import dayjs from 'dayjs';
// import { DatePicker2 } from "@progress/kendo-react-dateinputs";
// import {
//     IntlProvider,
//     load,
//     loadMessages,
//     LocalizationProvider,
// } from "@progress/kendo-react-intl";

// import 'antd/dist/antd.css';
const ProjectChangesRecords = props => {
    const { enqueueSnackbar } = useSnackbar();
    const statusBar = React.useMemo(() => {
        return {
            statusPanels: [
                // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                // { statusPanel: 'agFilteredRowCountComponent' },
                // { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' },
            ],
        };
    }, []);
    const gridRef = React.useRef();
    const gridRef2 = React.useRef();

    const [columnDefs] = React.useState([
        { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'No' },
        { field: 'DoType', headerName: "操作行為", width: 120, tooltipField: 'DoType' },
        { field: 'UpTime', headerName: "時間", width: 120, tooltipField: 'UpTime' },
        { field: 'Hostname', headerName: "操作者", width: 120, tooltipField: 'Hostname' },
        { field: 'BarCodeStr', headerName: "BarCodeStr", width: 130, tooltipField: 'BarCodeStr' },
        { field: 'Type', headerName: "(0套餐 1特殊 2單項)", width: 180, tooltipField: 'Type' },
        { field: 'SchemeNo', headerName: "套餐代號", width: 120, tooltipField: 'SchemeNo' },
        { field: 'CategoryNo', headerName: "特殊作業", width: 120, tooltipField: 'CategoryNo' },
        { field: 'ItemNo', headerName: "增加單項", width: 120, tooltipField: 'ItemNo' },
        // { field: 'OtherItems', headerName: "OtherItems", width: 120, tooltipField: 'OtherItems' },
        // { field: 'PersonPrice', headerName: "PersonPrice", width: 150, tooltipField: 'PersonPrice' },
        // { field: 'CommanyPrice', headerName: "CommanyPrice", width: 100, tooltipField: 'CommanyPrice' },
        { field: 'SchemeItems', headerName: "套餐項目", width: 120, tooltipField: 'SchemeItems' },
        { field: 'SchemeProjectNo', headerName: "客戶專案代號", width: 150, tooltipField: 'SchemeProjectNo' },
        { field: 'DecItems', headerName: "刪除項目", width: 110, tooltipField: 'DecItems' },
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
    const [barcoder, setbarcoder] = React.useState('');
    const [historyList, setHistoryList] = React.useState([])
    const [historyPerson, setHistoryPerson] = React.useState([])

    const handleQuery = () => {

        if (barcoder !== '') {
            // console.log("O")

            PF.instance({
                method: "post",
                url: PF.url2 + "/ProjectChanges/GetProjectChanges",
                data: Qs.stringify({
                    Action: "1", 
                    parameter: {
                        barcoder: barcoder,
                    }         
                }),
                headers: { token: sessionStorage.token }
            })
                .then(function (response) {
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
                        enqueueSnackbar("Success", { variant: "success", style: { whiteSpace: 'pre-line' } });
                        // const x = rows.map(item => {
                        //     return { ...item, "歷史筆數": rows2.filter(x=>x.ID === item.ID),"歷史腸胃"： }
                        // })
                        // console.log(x)
                        setTodayList(rows);
                        setHistoryList(rows2);
                        // setSelectListGroup(rowsGroup);


                    }
                })
        } else {
            enqueueSnackbar("請輸入barcoder", { variant: "error", style: { whiteSpace: 'pre-line' } });

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

    return (
        <>

            {/* <DatePicker onChange={onChange} defaultValue={moment(moment(), dateFormat)} format={dateFormat} /> */}
            <Input placeholder="barcoder" value={barcoder} onChange={(e) => setbarcoder(e.target.value)} style={{ width: '120px', marginRight: '5px' }}/>
            <Button onClick={handleQuery} variant="contained" >查詢</Button>
            <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                    <div className="ag-theme-alpine" style={{ height: 680, width: 1500 }}>
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
        </>

    )
}

export default ProjectChangesRecords