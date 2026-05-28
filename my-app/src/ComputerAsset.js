import React from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSnackbar } from 'notistack';
import Qs from 'qs';
import PF from './_Services/publicFunction';

const companyOptions = [
  { CompanyId: 1, CompanyCode: 'MJ', CompanyName: '晨悅' },
];

const ComputerAsset = () => {
  const { enqueueSnackbar } = useSnackbar();
  const gridRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [companyId, setCompanyId] = React.useState(1);
  const [rowData, setRowData] = React.useState([]);

  const columnDefs = React.useMemo(() => [
    { field: 'CompanyId', headerName: '公司', width: 90, tooltipField: 'CompanyId' },
    { field: 'AssetType', headerName: '資產類型', width: 120, tooltipField: 'AssetType' },
    { field: 'AssetNo', headerName: '資產編號', width: 140, tooltipField: 'AssetNo' },
    { field: 'FinanceAssetNo', headerName: '財產編號', width: 140, tooltipField: 'FinanceAssetNo' },
    { field: 'ReceiveDate', headerName: '領用日期', width: 120, tooltipField: 'ReceiveDate' },
    { field: 'Department', headerName: '部門', width: 140, tooltipField: 'Department' },
    { field: 'UserName', headerName: '使用者', width: 120, tooltipField: 'UserName' },
    { field: 'Area', headerName: '區域', width: 120, tooltipField: 'Area' },
    { field: 'CPU', headerName: 'CPU', width: 170, tooltipField: 'CPU' },
    { field: 'Memory', headerName: '記憶體', width: 120, tooltipField: 'Memory' },
    { field: 'Disk', headerName: '硬碟', width: 160, tooltipField: 'Disk' },
    { field: 'GPU', headerName: '顯示卡', width: 160, tooltipField: 'GPU' },
    { field: 'Monitor', headerName: '螢幕', width: 160, tooltipField: 'Monitor' },
    { field: 'MACAddress', headerName: 'MAC 位址', width: 170, tooltipField: 'MACAddress' },
    { field: 'Status', headerName: '狀態', width: 110, tooltipField: 'Status' },
    { field: 'Remark', headerName: '備註', width: 220, tooltipField: 'Remark' },
    { field: 'CreateTime', headerName: '建立時間', width: 150, tooltipField: 'CreateTime' },
    { field: 'UpdateTime', headerName: '更新時間', width: 150, tooltipField: 'UpdateTime' },
  ], []);

  const defaultColDef = React.useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  const statusBar = React.useMemo(() => ({
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agSelectedRowCountComponent', align: 'right' },
      { statusPanel: 'agAggregationComponent' },
    ],
  }), []);

  const selectedCompany = React.useMemo(
    () => companyOptions.find(item => item.CompanyId === Number(companyId)) || companyOptions[0],
    [companyId]
  );

  const handleQuery = React.useCallback((queryCompanyId = companyId) => {
    setOpen(true);

    PF.instance({
      method: 'post',
      url: PF.url2 + '/ComputerAsset/GetList',
      data: Qs.stringify({
        Action: '1',
        parameter: {
          CompanyId: Number(queryCompanyId),
        },
      }),
      headers: { token: sessionStorage.token },
    })
      .then(response => {
        setOpen(false);
        const { TotalRecord, rows } = response.data;

        if (TotalRecord < 0) {
          enqueueSnackbar('查詢失敗', { variant: 'error', style: { whiteSpace: 'pre-line' } });
          setRowData([]);
          return;
        }

        if (TotalRecord === 0) {
          enqueueSnackbar('查無資料', { variant: 'warning', style: { whiteSpace: 'pre-line' } });
          setRowData([]);
          return;
        }

        enqueueSnackbar(`查詢成功：共 ${TotalRecord} 筆`, {
          variant: 'success',
          style: { whiteSpace: 'pre-line' },
        });
        setRowData(rows || []);
      })
      .catch(() => {
        setOpen(false);
        enqueueSnackbar('查詢電腦資產資料失敗', { variant: 'error', style: { whiteSpace: 'pre-line' } });
        setRowData([]);
      });
  }, [companyId, enqueueSnackbar]);

  React.useEffect(() => {
    handleQuery(companyId);
  }, [companyId, handleQuery]);

  const handleCompanyChange = event => {
    setCompanyId(Number(event.target.value));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#eef3f8', p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          mb: 2,
          borderLeft: '4px solid #1976d2',
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#174a7c' }}>
              電腦資產查詢
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7a90', mt: 0.5 }}>
              目前顯示 {selectedCompany.CompanyName}（{selectedCompany.CompanyCode}）公司的電腦相關資料
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <FormControl sx={{ minWidth: 220 }}>
              <TextField
                select
                size="small"
                label="公司"
                value={companyId}
                onChange={handleCompanyChange}
              >
                {companyOptions.map(company => (
                  <MenuItem key={company.CompanyId} value={company.CompanyId}>
                    {company.CompanyName}（{company.CompanyCode}）
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Button
              onClick={() => handleQuery(companyId)}
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{ height: 40, px: 2.5, fontWeight: 700, borderRadius: 1.5 }}
            >
              查詢
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ height: 'calc(100vh - 150px)', p: 1.5, borderRadius: 2, backgroundColor: '#ffffff' }}>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="multiple"
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            enableStatusBar={true}
            statusBar={statusBar}
            rowHeight={30}
          />
        </div>
      </Paper>

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ComputerAsset;
