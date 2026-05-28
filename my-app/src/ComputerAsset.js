import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSnackbar } from 'notistack';
import Qs from 'qs';
import PF from './_Services/publicFunction';

const companyOptions = [
  { CompanyId: 1, CompanyCode: 'MJ', CompanyName: '晨悅公司' },
  { CompanyId: 2, CompanyCode: 'FH', CompanyName: '芙華公司' },
  { CompanyId: 3, CompanyCode: 'SW', CompanyName: '台中守葳公司' },
  { CompanyId: 4, CompanyCode: 'SH', CompanyName: '台北守葳公司' },
  { CompanyId: 5, CompanyCode: 'SC', CompanyName: '竹北守葳公司' },
];

const emptyAsset = {
  Id: '',
  CompanyId: 1,
  AssetType: '',
  AssetNo: '',
  FinanceAssetNo: '',
  ReceiveDate: '',
  Department: '',
  UserName: '',
  Area: '',
  CPU: '',
  Memory: '',
  Disk: '',
  GPU: '',
  Monitor: '',
  MACAddress: '',
  Status: 'Active',
  Remark: '',
  CreatedBy: '',
};

const assetFields = [
  { name: 'CompanyId', label: '公司', type: 'select', required: true },
  { name: 'AssetType', label: '資產類型', required: true },
  { name: 'AssetNo', label: '資產編號' },
  { name: 'FinanceAssetNo', label: '財產編號' },
  { name: 'ReceiveDate', label: '領用日期', type: 'date' },
  { name: 'Department', label: '部門' },
  { name: 'UserName', label: '使用者' },
  { name: 'Area', label: '區域' },
  { name: 'CPU', label: 'CPU' },
  { name: 'Memory', label: '記憶體' },
  { name: 'Disk', label: '硬碟' },
  { name: 'GPU', label: '顯示卡' },
  { name: 'Monitor', label: '螢幕' },
  { name: 'MACAddress', label: 'MAC 位址' },
  { name: 'Status', label: '狀態' },
  { name: 'Remark', label: '備註', multiline: true, xs: 12 },
];

const ComputerAsset = () => {
  const { enqueueSnackbar } = useSnackbar();
  const gridRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [companyId, setCompanyId] = React.useState(1);
  const [rowData, setRowData] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState('create');
  const [formData, setFormData] = React.useState({ ...emptyAsset });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const columnDefs = React.useMemo(() => [
    {
      field: 'CompanyId',
      headerName: '公司',
      width: 120,
      tooltipField: 'CompanyId',
      valueFormatter: params => {
        const company = companyOptions.find(item => item.CompanyId === Number(params.value));
        return company ? company.CompanyName : params.value;
      },
    },
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

  const normalizeDateValue = value => {
    if (!value) {
      return '';
    }

    return String(value).slice(0, 10).replace(/\//g, '-');
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setFormData({
      ...emptyAsset,
      CompanyId: Number(companyId),
    });
    setDialogOpen(true);
  };

  const openEditDialog = row => {
    setDialogMode('edit');
    setFormData({
      ...emptyAsset,
      ...row,
      CompanyId: Number(row.CompanyId || companyId),
      ReceiveDate: normalizeDateValue(row.ReceiveDate),
    });
    setDialogOpen(true);
  };

  const closeAssetDialog = () => {
    setDialogOpen(false);
    setDeleteConfirmOpen(false);
  };

  const handleFieldChange = event => {
    const { name, value } = event.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'CompanyId' ? Number(value) : value,
    }));
  };

  const buildPayload = () => ({
    ...formData,
    Id: Number(formData.Id || 0),
    CompanyId: Number(formData.CompanyId || companyId),
    ReceiveDate: formData.ReceiveDate || null,
  });

  const saveAsset = () => {
    if (!formData.CompanyId) {
      enqueueSnackbar('請選擇公司', { variant: 'error', style: { whiteSpace: 'pre-line' } });
      return;
    }

    if (!formData.AssetType) {
      enqueueSnackbar('請輸入資產類型', { variant: 'error', style: { whiteSpace: 'pre-line' } });
      return;
    }

    const isCreate = dialogMode === 'create';
    const payload = buildPayload();
    setOpen(true);

    PF.instance({
      method: 'post',
      url: PF.url2 + `/ComputerAsset/${isCreate ? 'Insert' : 'Update'}`,
      data: Qs.stringify({
        Action: '1',
        parameter: payload,
      }),
      headers: { token: sessionStorage.token },
    })
      .then(response => {
        setOpen(false);
        const { TotalRecord } = response.data;

        if (TotalRecord < 0) {
          enqueueSnackbar(isCreate ? '新增失敗' : '修改失敗', { variant: 'error', style: { whiteSpace: 'pre-line' } });
          return;
        }

        enqueueSnackbar(isCreate ? '新增成功' : '修改成功', { variant: 'success', style: { whiteSpace: 'pre-line' } });
        closeAssetDialog();

        const nextCompanyId = Number(payload.CompanyId || companyId);

        if (!isCreate) {
          setRowData(prevRows => {
            if (nextCompanyId !== Number(companyId)) {
              return prevRows.filter(row => Number(row.Id) !== Number(payload.Id));
            }

            return prevRows.map(row => (
              Number(row.Id) === Number(payload.Id) ? { ...row, ...payload } : row
            ));
          });
        }

        setCompanyId(nextCompanyId);
        handleQuery(nextCompanyId);
      })
      .catch(() => {
        setOpen(false);
        enqueueSnackbar(isCreate ? '新增電腦資產資料失敗' : '修改電腦資產資料失敗', {
          variant: 'error',
          style: { whiteSpace: 'pre-line' },
        });
      });
  };

  const deleteAsset = () => {
    if (!formData.Id) {
      enqueueSnackbar('找不到要刪除的資料 ID', { variant: 'error', style: { whiteSpace: 'pre-line' } });
      return;
    }

    setOpen(true);
    PF.instance({
      method: 'post',
      url: PF.url2 + '/ComputerAsset/Delete',
      data: Qs.stringify({
        Action: '1',
        parameter: {
          Id: Number(formData.Id),
        },
      }),
      headers: { token: sessionStorage.token },
    })
      .then(response => {
        setOpen(false);
        const { TotalRecord } = response.data;

        if (TotalRecord < 0) {
          enqueueSnackbar('刪除失敗', { variant: 'error', style: { whiteSpace: 'pre-line' } });
          return;
        }

        enqueueSnackbar('刪除成功', { variant: 'success', style: { whiteSpace: 'pre-line' } });
        closeAssetDialog();
        setRowData(prevRows => prevRows.filter(row => Number(row.Id) !== Number(formData.Id)));
        handleQuery(companyId);
      })
      .catch(() => {
        setOpen(false);
        enqueueSnackbar('刪除電腦資產資料失敗', { variant: 'error', style: { whiteSpace: 'pre-line' } });
      });
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
              重整
            </Button>
            <Button
              onClick={openCreateDialog}
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              sx={{ height: 40, px: 2.5, fontWeight: 700, borderRadius: 1.5 }}
            >
              新增
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
            onRowClicked={event => openEditDialog(event.data)}
          />
        </div>
      </Paper>

      <Dialog open={dialogOpen} onClose={closeAssetDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#174a7c' }}>
          {dialogMode === 'create' ? '新增電腦資產' : '修改電腦資產'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {assetFields.map(field => (
              <Grid item xs={field.xs || 12} sm={field.xs || 6} key={field.name}>
                <TextField
                  fullWidth
                  select={field.type === 'select'}
                  size="small"
                  type={field.type === 'date' ? 'date' : 'text'}
                  name={field.name}
                  label={field.label}
                  value={formData[field.name] || ''}
                  onChange={handleFieldChange}
                  required={field.required}
                  multiline={field.multiline}
                  minRows={field.multiline ? 3 : undefined}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                >
                  {field.type === 'select' && companyOptions.map(company => (
                    <MenuItem key={company.CompanyId} value={company.CompanyId}>
                      {company.CompanyName}（{company.CompanyCode}）
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Box>
            {dialogMode === 'edit' && (
              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                刪除
              </Button>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button onClick={closeAssetDialog} variant="outlined">
              取消
            </Button>
            <Button onClick={saveAsset} variant="contained" color={dialogMode === 'create' ? 'success' : 'primary'}>
              {dialogMode === 'create' ? '新增' : '確認修改'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#d32f2f' }}>確認刪除</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#333', mt: 1 }}>
            確定要刪除這筆電腦資產資料嗎？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined">
            取消
          </Button>
          <Button onClick={deleteAsset} variant="contained" color="error">
            確認刪除
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ComputerAsset;
