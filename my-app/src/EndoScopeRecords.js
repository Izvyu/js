import React, { useMemo, useState } from 'react';
import { Grid, Button, Backdrop, CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSnackbar } from "notistack";
import Qs from "qs";
import { DatePicker } from 'antd';
import PF from "./_Services/publicFunction";

const { RangePicker } = DatePicker;

const EndoScopeRecords = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [todayList, setTodayList] = useState([]);
    const [dailyCounts, setDailyCounts] = useState({});
    const [dailyPersonCheckCounts, setDailyPersonCheckCounts] = useState({});

    const handleQuery = async () => {
        if (!startDate || !endDate) {
            enqueueSnackbar('請輸入日期', { variant: 'error', style: { whiteSpace: 'pre-line' } });
            return;
        }

        setOpen(true);
        try {
            const response = await PF.instance({
                method: "post",
                url: PF.url2 + "/EndoScope/GetEndoScope",
                data: Qs.stringify({
                    Action: "1",
                    parameter: { startDate, endDate }
                }),
                headers: { token: sessionStorage.token }
            });

            setOpen(false);
            const { TotalRecord, rows } = response.data;

            if (TotalRecord < 0) {
                enqueueSnackbar("錯誤", { variant: "error", style: { whiteSpace: 'pre-line' } });
                return;
            }

            if (TotalRecord === 0) {
                enqueueSnackbar("沒有資料", { variant: "warning", style: { whiteSpace: 'pre-line' } });
                setTodayList([]);
                setDailyCounts({});
                setDailyPersonCheckCounts({});
                return;
            }

            enqueueSnackbar(`成功: 找到 ${TotalRecord} 筆記錄`, { variant: "success", style: { whiteSpace: 'pre-line' } });
            
            const groupedData = {};
            rows.forEach(record => {
                const date = record.OrderDate;
                if (!groupedData[date]) {
                    groupedData[date] = { records: [], total: 0, enterpriseCheck: 0, individualCheck: 0 };
                }
                groupedData[date].records.push(record);
                groupedData[date].total += 1;
                if (record.person_check === "企檢") groupedData[date].enterpriseCheck += 1;
                if (record.person_check === "個檢") groupedData[date].individualCheck += 1;
            });

            const formattedData = Object.entries(groupedData).flatMap(([date, data]) => [
                ...data.records,
                {
                    OrderDate: date,
                    OrderTime: '',
                    ID: `總人數: ${data.total}`,
                    Name: '',
                    SEX: '',
                    Birthday: '',
                    OrderTimeRange: '',
                    person_check: '',
                    無痛胃鏡檢查: '',
                    無痛大腸鏡檢查: '',
                    胃鏡檢查: '',
                    大腸鏡檢查: '',
                    乙狀結腸: '',
                    內視鏡人次: '',
                    無痛內視鏡: '',
                    胃肉毒: '',
                    胃幽門快篩: '',
                }
            ]);

            setTodayList(formattedData);
            setDailyCounts(Object.fromEntries(Object.entries(groupedData).map(([date, data]) => [date, data.total])));
            setDailyPersonCheckCounts(Object.fromEntries(Object.entries(groupedData).map(([date, data]) => [date, { enterpriseCheck: data.enterpriseCheck, individualCheck: data.individualCheck }])));
        } catch (error) {
            setOpen(false);
            enqueueSnackbar("請求失敗", { variant: "error", style: { whiteSpace: 'pre-line' } });
        }
    };

    return (
        <>
            <RangePicker onChange={(dates, dateStrings) => {
                setStartDate(dateStrings[0]);
                setEndDate(dateStrings[1]);
            }} format="YYYY/MM/DD" style={{ marginBottom: '5px' }} />
            <Button onClick={handleQuery} variant="contained" style={{ marginLeft: '5px' }}>查詢</Button>

            <div style={{ marginTop: '5px' }}>
                <h5 style={{ fontSize: '16px' }}>每日就診人數</h5>
                <ul>
                    {Object.entries(dailyCounts).map(([date, count]) => (
                        <li key={date} style={{ fontSize: '15px' }}>
                            {date}: {count} 人次
                            {dailyPersonCheckCounts[date] && (
                                <>（企檢: {dailyPersonCheckCounts[date].enterpriseCheck} 人, 個檢: {dailyPersonCheckCounts[date].individualCheck} 人）</>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
                        <AgGridReact
                            rowData={todayList}
                            columnDefs={[
                                { field: 'OrderDate', headerName: "預約日", width: 120, tooltipField: 'OrderDate', cellStyle: { textAlign: 'left' }},
                                { field: 'OrderTime', headerName: "登錄日", width: 150, tooltipField: 'OrderTime', cellStyle: { textAlign: 'left' } },
                                { field: 'ID', headerName: "身分證號", width: 130, tooltipField: 'ID', cellStyle: { textAlign: 'left' } }, // ID欄位顯示總人數
                                { field: 'Name', headerName: "姓名", width: 100, tooltipField: 'Name', cellStyle: { textAlign: 'left' } },
                                { field: 'SEX', headerName: "性別", width: 80, tooltipField: 'SEX', cellStyle: { textAlign: 'left' } },
                                { field: 'Birthday', headerName: "生日", width: 120, tooltipField: 'Birthday' },
                                { field: 'OrderTimeRange', headerName: "預約時段", width: 120, tooltipField: 'OrderTimeRange' },
                                { field: 'person_check', headerName: "健檢類別", width: 120, tooltipField: 'person_check' },
                                { field: '無痛胃鏡檢查', headerName: "無痛胃", width: 100, tooltipField: '無痛胃鏡檢查' },
                                { field: '無痛大腸鏡檢查', headerName: "無痛腸", width: 100, tooltipField: '無痛大腸鏡檢查' },
                                { field: '胃鏡檢查', headerName: "胃鏡檢查", width: 110, tooltipField: '胃鏡檢查' },
                                { field: '大腸鏡檢查', headerName: "大腸鏡檢查", width: 120, tooltipField: '大腸鏡檢查' },
                                { field: '乙狀結腸', headerName: "乙狀結腸", width: 110, tooltipField: '乙狀結腸' },
                                { field: '內視鏡人次', headerName: "內視鏡人次", width: 120, tooltipField: '內視鏡人次' },
                                { field: '無痛內視鏡', headerName: "無痛內視鏡", width: 120, tooltipField: '抹無痛內視鏡' },
                                { field: '胃肉毒', headerName: "胃肉毒", width: 100, tooltipField: '胃肉毒' },
                                { field: '胃幽門快篩', headerName: "胃幽門快篩", width: 120, tooltipField: '胃幽門快篩' },
                            ]}
                            defaultColDef={{ resizable: true, sortable: true, filter: true }}
                        />
                    </div>
                </Grid>
            </Grid>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default EndoScopeRecords;
