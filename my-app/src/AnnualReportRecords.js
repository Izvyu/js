import React from 'react';
import { Grid, Button, Input, Box, Paper, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PF from "./_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";   // 🔹 新增
import { useDispatch, useSelector } from "react-redux";
import { actions } from "./reducers/app";

const AnnualReportRecords = () => {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();   // 🔹 新增

  const statusBar = React.useMemo(() => ({
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
      { statusPanel: 'agAggregationComponent' },
    ],
  }), []);

  const gridRef = React.useRef();
  const [columnDefs, setColumnDefs] = React.useState([]);
  const [rowData, setRowData] = React.useState([]);
  const [ID, setID] = React.useState('');

  const [customerName, setCustomerName] = React.useState('');
  const [customerID, setCustomerID] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [age, setAge] = React.useState('');

  const defaultColDef = { resizable: true, sortable: true, filter: true };
  const rowHeight = 30;

  const formatDate = (d) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}/${m}/${day}`;
  };

  const handleQuery = () => {
    if (ID !== '' && ID.length === 10) {
      setOpen(true);

      PF.instance({
        method: "post",
        url: PF.url2 + "/AnnualReport/GetAnnualReport",
        data: Qs.stringify({
          Action: "1",
          parameter: { ID }
        }),
        headers: { token: sessionStorage.token }
      })
        .then(response => {
          setOpen(false);
          const { TotalRecord, rows } = response.data;

          if (TotalRecord < 0) {
            enqueueSnackbar("錯誤", { variant: "error", style: { whiteSpace: 'pre-line' } });
            setRowData([]);
            setColumnDefs([]);
            setCustomerName('');
            setCustomerID('');
          } else if (TotalRecord === 0) {
            enqueueSnackbar("沒有資料", { variant: "warning", style: { whiteSpace: 'pre-line' } });
            setRowData([]);
            setColumnDefs([]);
            setCustomerName('');
            setCustomerID('');
          } else {
            enqueueSnackbar(`成功: 找到 ${TotalRecord} 筆記錄`, { variant: "success", style: { whiteSpace: 'pre-line' } });

            if (rows.length > 0) {
              setCustomerName(rows[0].Name || '');
              setCustomerID(rows[0].id || '');
              setBirthday(rows[0].Birthday || '');
              setAge(rows[0].Age || '');
            } else {
              setCustomerName('');
              setCustomerID('');
              setBirthday('');
              setAge('');
            }

            const dateSet = new Set(rows.map(r => {
              try {
                return formatDate(r.SpecialCheckDate);
              } catch {
                return null;
              }
            }));
            const dates = Array.from(dateSet).filter(d => d !== null)
              .sort((a, b) => new Date(b) - new Date(a));

            const cols = [
              { field: 'ItemName', headerName: '項目名稱', width: 250, pinned: 'left' },
              { field: 'Reference', headerName: '參考值', width: 250, pinned: 'left' },
            ];
            dates.forEach(dateStr => {
              cols.push({
                field: dateStr,
                headerName: dateStr,
                width: 230,
                cellClass: 'number-cell',
                cellStyle: params => {
                  const currentDateField = params.colDef.field;
                  if (params.data?.ErrMap?.[currentDateField] === true) {
                    return { color: '#d32f2f', fontWeight: 'bold' };
                  }
                  return { color: '#0000000' };
                }
              });
            });
            setColumnDefs(cols);

            const itemMap = {};
            rows.forEach(r => {
              const dateStr = formatDate(r.SpecialCheckDate);
              if (!itemMap[r.ItemName]) {
                itemMap[r.ItemName] = {
                  ItemName: r.ItemName,
                  Reference: r.Reference || '',
                  ErrMap: {}
                };
              }
              itemMap[r.ItemName][dateStr] = r.Value;
              itemMap[r.ItemName].ErrMap[dateStr] = r.Err;
            });

            setRowData(Object.values(itemMap));
          }
        })
        .catch(() => {
          setOpen(false);
          enqueueSnackbar("取得資料錯誤", { variant: "error" });
          setRowData([]);
          setColumnDefs([]);
          setCustomerName('');
          setCustomerID('');
          setBirthday('');
          setAge('');
        });
    } else {
      enqueueSnackbar("請輸入正確身分證碼", { variant: "error", style: { whiteSpace: 'pre-line' } });
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    setID(inputValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') handleQuery();
  };

  // 🔹 登出處理
    const dispatch = useDispatch();
    const handleLogout = () => {
        navigate(`/AnnualReportlogin`, { replace: true });
        dispatch(actions.UserInfo({}));
        dispatch(actions.TOKEN_SET(""));
        localStorage.removeItem("UserInfo");
        localStorage.removeItem("token");
        // return redirect("/MinmaxLogin");
        // return <Navigate to="/MinmaxLogin" replace={true} />
    }

  return (
    <Box sx={{ p: 0.5, backgroundColor: '#f5f5f5', minHeight: '100vh', position: 'relative' }}>
      {/* 🔹 右上角登出按鈕 */}
      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          登出
        </Button>
      </Box>

      <Paper sx={{ p: 0.5, mb: 1 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          年度檢查紀錄查詢
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Input
            placeholder="輸入 ID"
            value={ID}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            sx={{ backgroundColor: '#fff', borderRadius: 1, px: 1, height: 28, lineHeight: 1.0 }}
          />
          <Button
            onClick={handleQuery}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            查詢
          </Button>
        </Box>
      </Paper>

      {(customerName || customerID || birthday || age) && (
        <Paper sx={{ p: 1, mb: 1, backgroundColor: '#f0f0f0' }} elevation={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            姓名：{customerName} &nbsp;&nbsp;&nbsp; 身分證號：{customerID} &nbsp;&nbsp;&nbsp;
            生日：{birthday} &nbsp;&nbsp;&nbsp; 年齡：{age}
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
            rowHeight={rowHeight}
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