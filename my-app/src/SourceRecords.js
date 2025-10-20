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
import { DatePicker, Space } from 'antd';
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
const SourceRecords = props => {
    const { enqueueSnackbar } = useSnackbar();
    const statusBar = React.useMemo(() => {
        return {
            statusPanels: [
                // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                // { statusPanel: 'agFilteredRowCountComponent' },
                // { statusPanel: 'agSelectedRowCountComponent', align: 'right'  },
                { statusPanel: 'agAggregationComponent' },
            ],
        };
    }, []);
    const gridRef = React.useRef();
    const gridRef2 = React.useRef();

    const [columnDefs] = React.useState([
        { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'No' },
        { field: 'com_id', headerName: "公司", width: 140, tooltipField: 'com_id' },
        // { field: 'doc_typeno', headerName: "單號", width: 80, tooltipField: 'doc_typeno' },
        { field: 'doc_typenm', headerName: "單別", width: 120, tooltipField: 'doc_typenm' },
        { field: 'pur_req_doc_no', headerName: "請購單號", width: 140, tooltipField: 'pur_req_doc_no' },
        { field: 'doc_date', headerName: "請購日期", width: 110, tooltipField: 'doc_date' },
        { field: 'pur_supno', headerName: "供應商代號", width: 130, tooltipField: 'pur_supno' },
        { field: 'pur_supnm', headerName: "供應商", width: 170, tooltipField: 'pur_supnm' },
        { field: 'matno', headerName: "品號", width: 120, tooltipField: 'matno' },
        { field: 'mat_name', headerName: "品名", width: 120, tooltipField: 'mat_name' },
        { field: 'mat_specnm', headerName: "規格", width: 170, tooltipField: 'mat_specnm' },
        { field: 'unitnm', headerName: "單位", width: 80, tooltipField: 'unitnm' },
        { field: 'req_qty', headerName: "需求量", width: 100, tooltipField: 'req_qty' },
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


    const [CheckDate, setStartDate] = React.useState(new Date().toJSON().slice(0, 10).replace(/-/g, '/'))
    const [todayList, setTodayList] = React.useState([])
    const [historyList, setHistoryList] = React.useState([])
    const [historyPerson, setHistoryPerson] = React.useState([])

    const handleQuery = () => {

        if (CheckDate !== '') {
            // console.log("O")

            PF.instance({
                method: "post",
                url: PF.url2 + "/Source/GetcheckSource",
                data: Qs.stringify({
                    Action: "1",          
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
            enqueueSnackbar("請輸入日期", { variant: "error", style: { whiteSpace: 'pre-line' } });

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

export default SourceRecords