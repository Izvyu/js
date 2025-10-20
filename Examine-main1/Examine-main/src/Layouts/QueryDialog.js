
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import _, { omit, pick } from 'lodash'
import PF from "../_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import NumberFormat from 'react-number-format';

import { injectIntl, intlShape, useIntl, FormattedMessage } from 'react-intl';
import { F } from 'ramda';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

const QueryDialog = props => {
    const { open, setDialogQueryOpen, handleQueryBarCodeStr, setBarCodeStr } = props;

    const { enqueueSnackbar } = useSnackbar();
    const gridRef = React.useRef();
    const onRowDoubleClicked = (event) => {
        const { data } = event
        handleQueryBarCodeStr(data.BarCodeStr);
        setBarCodeStr(data.BarCodeStr);
        handleClose();

    }
    const [columnDefs] = React.useState([

        { field: 'BarCodeStr', headerName: "條碼號", width: 120 },
        { field: 'ProjectName', headerName: "專案名稱", width: 250 },
        { field: 'Name', headerName: "姓名", width: 100 },
        { field: 'ID', headerName: "身分證號", width: 120 },
        { field: 'Sogi', headerName: "手機", width: 120 },
        { field: 'Sex', headerName: "性別", width: 80 },
        { field: 'OrderDate', headerName: "預約日", width: 120 },
        { field: 'SpecialCheckDate', headerName: "報到日", width: 120 },
        { field: 'EMail', headerName: "Email", width: 200 },

    ])
    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };
    const [PersonItem, setPersonItem] = React.useState([])
    const handleClose = () => {
        //清空減項
        setPersonItem([])
        setQueryString("")
        setDialogQueryOpen(false);



    }
    const handleSelect = () => {
        const selectedRows = gridRef.current.api.getSelectedRows();
        if (selectedRows.length > 0) {
            handleQueryBarCodeStr(selectedRows[0].BarCodeStr);
            setBarCodeStr(selectedRows[0].BarCodeStr);
            handleClose();
        }

    }
    const [QueryString, setQueryString] = React.useState('');
    const handleChange = event => {
        const { name, value } = event.target;
        setQueryString(value);
    }
    const handleQuery = e => {
        if (QueryString !== "") {
            PF.instance({
                method: "post",
                url: PF.url + "/CheckProjectNameList/GetData",
                data: Qs.stringify({
                    Action: "",
                    parameter: {
                        QueryString: QueryString
                    }
                }),
                headers: { token: sessionStorage.token }
            })
                .then(function (response) {
                    // console.log(response.data)
                    const { TotalRecord, rows } = response.data
                    if (TotalRecord <= 0) {
                        // alert("問卷提交出錯\r\n" + ErrorMessage + "請致電 04-2255-2555 #168 企業健檢")
                        enqueueSnackbar("查無資料", { variant: "error", style: { whiteSpace: 'pre-line' } });
                    } else {
                        enqueueSnackbar("Success", { variant: "success", style: { whiteSpace: 'pre-line' } });
                        // console.log(rows)
                        setPersonItem(rows);
                    }
                })
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={'xl'}
            fullWidth={true}
        >

            <DialogTitle>
                <form onSubmit={handleQuery}>
                    <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                    >

                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            value={QueryString}
                            onChange={handleChange}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault(); //會Refresh
                                    handleQuery();
                                }
                            }}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={handleQuery}>
                            <SearchIcon />
                        </IconButton>

                    </Paper>
                </form>

            </DialogTitle>
            <DialogContent dividers={true}>
                <div className="ag-theme-alpine" style={{ height: 400, width: 1200 }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={PersonItem}
                        columnDefs={columnDefs}
                        rowSelection='single'
                        defaultColDef={defaultColDef}
                        // rowMultiSelectWithClick={true}
                        onRowDoubleClicked={onRowDoubleClicked}
                        // enableCellTextSelection={true}
                        // ensureDomOrder={true}
                        // groupSelectsFiltered={true}
                        // suppressRowClickSelection={true}
                        enableRangeSelection={true}


                    >
                    </AgGridReact>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained">放棄</Button>
                <Button onClick={handleSelect} variant="contained">選擇</Button>
            </DialogActions>


        </Dialog>
    )
}

export default QueryDialog;