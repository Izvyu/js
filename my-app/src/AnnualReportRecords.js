import React from 'react';
import { Button, Input, Box, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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
import LogoutIcon from '@mui/icons-material/Logout';

const AnnualReportRecords = () => {
  const [open, setOpen] = React.useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = React.useState(false);
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
  
  const handleLogoutClick = () => {
    setOpenLogoutConfirm(true);
  };
  
  const confirmLogout = () => {
    setOpenLogoutConfirm(false);
    navigate(`/AnnualReportlogin`, { replace: true });
    dispatch(actions.UserInfo({}));
    dispatch(actions.TOKEN_SET(""));
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("token");
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#e8eef5', minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogoutClick}
          startIcon={<LogoutIcon />}
          sx={{ 
            fontWeight: 700, 
            textTransform: 'none', 
            fontSize: '15px', 
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': { 
              boxShadow: '0 6px 20px rgba(211, 47, 47, 0.5)',
              transform: 'translateY(-2px)',
              backgroundColor: '#d32f2f'
            }
          }}
        >
          登出
        </Button>
      </Box>

      <Paper 
        sx={{ 
          p: 2.5, 
          mb: 2, 
          backgroundColor: '#fff',
          borderLeft: '4px solid #1976d2'
        }} 
        elevation={4}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ fontWeight: 700, color: '#1565c0', mb: 2 }}
        >
          年度檢查紀錄查詢
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            placeholder="輸入身分證號 (10碼)"
            value={ID}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            sx={{ 
              backgroundColor: '#f5f5f5', 
              borderRadius: 1.5, 
              px: 1.5, 
              height: 40, 
              lineHeight: 1.0,
              flex: '0 0 200px',
              fontSize: '14px',
              '&:hover': { backgroundColor: '#e8e8e8' },
              '&:focus': { backgroundColor: '#fff' }
            }}
          />
          <Button 
            onClick={handleQuery} 
            variant="contained" 
            color="primary" 
            sx={{ 
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '16px',
              px: 3,
              height: 40,
              borderRadius: 1.5,
              '&:hover': { boxShadow: 3 }
            }}
          >
            查詢
          </Button>
        </Box>
      </Paper>

      {(customerInfo.Name || customerInfo.id) && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2, 
            backgroundColor: '#e3f2fd',
            borderRadius: 2,
            border: '1px solid #90caf9'
          }} 
          elevation={2}
        >
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>姓名</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1565c0' }}>{customerInfo.Name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>身分證號</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1565c0' }}>{customerInfo.id}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>生日</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1565c0' }}>{customerInfo.Birthday}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>年齡</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1565c0' }}>{customerInfo.Age}</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      <Paper sx={{ height: '82vh', p: 2, backgroundColor: '#fff' }} elevation={4}>
        <div className="ag-theme-alpine" style={{ height: '98%', width: '98%' }}>
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

      <Dialog open={openLogoutConfirm} onClose={() => setOpenLogoutConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f', fontSize: '18px' }}>確認登出</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#333', fontSize: '15px', mt: 1 }}>
            確定要登出嗎？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenLogoutConfirm(false)}
            variant="outlined"
            sx={{ textTransform: 'none', fontSize: '14px' }}
          >
            取消
          </Button>
          <Button 
            onClick={confirmLogout} 
            variant="contained" 
            color="error"
            sx={{ textTransform: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            確認登出
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnualReportRecords;
