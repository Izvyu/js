import React from 'react';
import { Button, Input, Box, Paper, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PF from "./_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "./reducers/app";

const AnnualReportRecords = () => {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const gridRef = React.useRef();
  const [columnDefs, setColumnDefs] = React.useState([]);
  const [rowData, setRowData] = React.useState([]);
  const [ID, setID] = React.useState('');
  const [customerInfo, setCustomerInfo] = React.useState({ Name: '', id: '', Birthday: '', Age: '' });

  const defaultColDef = { resizable: true, sortable: true, filter: true };
  const statusBar = React.useMemo(() => ({
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
      { statusPanel: 'agAggregationComponent' },
    ],
  }), []);

  const formatDate = (d) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}/${m}/${day}`;
  };

  const handleQuery = () => {
    if (ID === '' || ID.length !== 10) {
      enqueueSnackbar("請輸入正確身分證碼", { variant: "error", style: { whiteSpace: 'pre-line' } });
      return;
    }

    setOpen(true);
    PF.instance({
      method: "post",
      url: PF.url2 + "/AnnualReport/GetAnnualReport",
      data: Qs.stringify({ Action: "1", parameter: { ID } }),
      headers: { token: sessionStorage.token }
    })
      .then(response => {
        setOpen(false);
        const { TotalRecord, rows } = response.data;

        if (TotalRecord <= 0) {
          const msg = TotalRecord < 0 ? "錯誤" : "沒有資料";
          enqueueSnackbar(msg, { variant: TotalRecord < 0 ? "error" : "warning", style: { whiteSpace: 'pre-line' } });
          setRowData([]);
          setColumnDefs([]);
          setCustomerInfo({ Name: '', id: '', Birthday: '', Age: '' });
          return;
        }

        enqueueSnackbar(`成功: 找到 ${TotalRecord} 筆記錄`, { variant: "success", style: { whiteSpace: 'pre-line' } });

        const first = rows[0] || {};
        setCustomerInfo({
          Name: first.Name || '',
          id: first.id || '',
          Birthday: first.Birthday || '',
          Age: first.Age || ''
        });

        const dates = Array.from(new Set(rows.map(r => formatDate(r.SpecialCheckDate))))
          .filter(d => d !== null)
          .sort((a, b) => new Date(b) - new Date(a));

        // 生成 columns，關鍵：autoHeight: true
        const cols = [
          { field: 'ItemName', headerName: '項目名稱', width: 250, pinned: 'left', autoHeight: true, cellClass: 'wrap-text' },
          { field: 'Reference', headerName: '參考值', width: 260, pinned: 'left', autoHeight: true, cellClass: 'wrap-text' },
          ...dates.map(dateStr => ({
            field: dateStr,
            headerName: dateStr,
            width: 290,
            autoHeight: true,          // 🔹 必須加
            cellClass: 'wrap-text',
            cellStyle: params => {
              const style = {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                color: '#000000',
              };
              if (params.data?.ErrMap?.[dateStr] === true) {
                style.color = '#d32f2f';
                style.fontWeight = 'bold';
              }
              return style;
            }
          }))
        ];
        setColumnDefs(cols);

        const itemMap = {};
        rows.forEach(r => {
          const dateStr = formatDate(r.SpecialCheckDate);
          if (!itemMap[r.ItemName]) itemMap[r.ItemName] = { ItemName: r.ItemName, Reference: r.Reference || '', ErrMap: {} };
          itemMap[r.ItemName][dateStr] = r.Value;
          itemMap[r.ItemName].ErrMap[dateStr] = r.Err;
        });
        setRowData(Object.values(itemMap));
      })
      .catch(() => {
        setOpen(false);
        enqueueSnackbar("取得資料錯誤", { variant: "error" });
        setRowData([]);
        setColumnDefs([]);
        setCustomerInfo({ Name: '', id: '', Birthday: '', Age: '' });
      });
  };

  const handleInputChange = (e) => setID(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10));
  const handleKeyPress = (event) => { if (event.key === 'Enter') handleQuery(); };
  const handleLogout = () => {
    navigate(`/AnnualReportlogin`, { replace: true });
    dispatch(actions.UserInfo({}));
    dispatch(actions.TOKEN_SET(""));
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("token");
  };

  return (
    <Box sx={{ p: 0.5, backgroundColor: '#f5f5f5', minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>登出</Button>
      </Box>

      <Paper sx={{ p: 0.5, mb: 1 }} elevation={3}>
        <Typography variant="h6" gutterBottom>年度檢查紀錄查詢</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Input
            placeholder="輸入 ID"
            value={ID}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            sx={{ backgroundColor: '#fff', borderRadius: 1, px: 1, height: 28, lineHeight: 1.0 }}
          />
          <Button onClick={handleQuery} variant="contained" color="primary" sx={{ fontWeight: 'bold' }}>查詢</Button>
        </Box>
      </Paper>

      {(customerInfo.Name || customerInfo.id) && (
        <Paper sx={{ p: 1, mb: 1, backgroundColor: '#f0f0f0' }} elevation={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            姓名：{customerInfo.Name} &nbsp;&nbsp;&nbsp;
            身分證號：{customerInfo.id} &nbsp;&nbsp;&nbsp;
            生日：{customerInfo.Birthday} &nbsp;&nbsp;&nbsp;
            年齡：{customerInfo.Age}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ height: '85vh', p: 1 }} elevation={3}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="single"
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            statusBar={statusBar}
            // 🔹 移除 rowHeight 讓 autoHeight 生效
          />
        </div>
      </Paper>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AnnualReportRecords;
