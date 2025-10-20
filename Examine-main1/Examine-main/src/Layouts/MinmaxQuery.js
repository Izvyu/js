import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, AppBar, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
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
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Minmax from './MinmaxMobile';
import { indigo, grey } from '@mui/material/colors';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
// const useStyles = makeStyles((theme) => ({
//     root: {
//         width: '100%',
//     },

//     half_background: {
//         background: "linear-gradient(to top, yellow 50%, transparent 50%)"
//     },
//     backdrop: {
//         zIndex: theme.zIndex.drawer + 1,
//         color: '#fff',
//     },
//     closeButton: {
//         position: 'absolute',
//         right: theme.spacing(1),
//         top: theme.spacing(1),
//         color: theme.palette.grey[500],
//     },
//     chip: {
//         margin: theme.spacing(0.5),
//     },
// }));

const App = () => {
    const [url, seturl] = useState(null);
    // const classes = useStyles();
    const [QueryString, setQueryString] = React.useState('');
    const PicCategoryArray = ["超音波檢查", "數位斷層合成掃描", '胸部能量減影',
        , "一般X光"
        , "三連片"
        , "內視鏡"
        , "身體組成分析"
        , "心電圖"
        , "自律神經檢查"
        , "眼底攝影"];

    const CategoryArray05 = [
        { id2: "0501", title2: "超音波檢查" },
        { id2: "0502", title2: "數位斷層合成掃描" },
        { id2: "0503", title2: "一般X光" },
        { id2: "0504", title2: "三連片" },
        { id2: "0505", title2: "內視鏡" },
        { id2: "0506", title2: "身體組成分析" },
        { id2: "0507", title2: "心電圖" },
        { id2: "0508", title2: "自律神經檢查" },
        { id2: "0509", title2: "眼底攝影" },
        { id2: "0510", title2: "胸部能量減影" },
    ];

    const handleChange = event => {
        const { name, value } = event.target;
        setQueryString(value);
    }
    const { enqueueSnackbar } = useSnackbar();
    const gridRef = React.useRef();

    const [GaugeItem, setGaugeItem] = useState({})
    // const [LabItem, setLabItem] = useState({})

    const [PicObj, setPicObj] = useState({})
    const [Profile, setProfile] = useState({})
    const [Array02_1, setArray02_1] = useState([])
    const [Array02_2, setArray02_2] = useState([])
    const [Array02, setArray02] = useState([])
    const [Array03, setArray03] = useState([])
    const [Array04, setArray04] = useState([])
    const [Array06, setArray06] = useState([])

    const [items, setitems] = useState([{ id: '01', title: ' - 基本資料' }, { id: '02', title: ' - 異常項目' }, { id: '03', title: ' - 理學檢查', data: Array03 },
        // { id: '04', title: '04 - 檢驗', data: Array04 },
        // { id: '05', title: '05 - 影像檢查', data: GaugeItem },
        // { id: '06', title: '06 - 其他檢查', data: Array06 },
    ])

    const [subItems, setsubItems] = useState({
        '03': [{ id2: '0301', title2: '一般體格' }, { id2: '0302', title2: '醫生問診' }],
        '04': [],
        '05': []
    })
    const onRowDoubleClicked = (event) => {
        const { data } = event;
        console.log(data.barcode);

        getFullData(data.barcode)
        // handleQueryBarCodeStr(data.barcode);
        // setBarCodeStr(data.BarCodeStr);
        // handleClose();
        setOpen(true)

    }
    const [columnDefs] = React.useState([

        { field: 'barcode', headerName: "條碼號", width: 150 },
        { field: 'customerName', headerName: "專案名稱", width: 250 },
        { field: 'UserName', headerName: "姓名", width: 100 },
        { field: 'PersonalId', headerName: "身分證號", width: 150 },
        { field: 'sogi', headerName: "手機", width: 150 },
        { field: 'sex', headerName: "性別", width: 80 },
        { field: 'Birthday', headerName: "生日", width: 120 },
        { field: 'checkdate', headerName: "報到日", width: 120 },

    ])
    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
        setitems([{ id: '01', title: ' - 基本資料' }, { id: '02', title: ' - 異常項目' }, { id: '03', title: ' - 理學檢查', data: Array03 }]);
        setArray02([])
        setArray02_1([])
        setArray02_2([])
        setsubItems({
            '03': [{ id2: '0301', title2: '一般體格' }, { id2: '0302', title2: '醫生問診' }],
            '04': [],
            '05': []
        })
    };
    const [PersonItem, setPersonItem] = React.useState([])

    const handleQuery = e => {
        if (QueryString !== "") {
            PF.instance({
                method: "post",
                url: PF.url2 + "/Minmax/GetIDList",
                data: Qs.stringify({
                    Action: "1",
                    parameter: {
                        PersonalId: QueryString
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

    const getFullData = (BarCodeStr) => {
        PF.instance({
            method: "post",
            url: PF.url2 + "/Minmax/GetFullData",
            data: Qs.stringify({ Action: "none", parameter: { BarCodeStr } })
            // headers: { token: sessionStorage.token }
        })
            .then(function (response) {
                // alert("完成")
                const { TotalRecord, Profile, LabData, GaugeData } = response.data;
                if (TotalRecord > 0) {
                    const people = Profile[0]
                    // console.log(rows);
                    setProfile({
                        age: people.age,
                        PersonalId: people.PersonalId,
                        UserName: people.UserName,
                        sogi: people.sogi,
                        checkdate: people.checkdate,
                        chart: people.chart,
                        barcode: people.barcode,
                        sex: people.sex || ' 男',
                        birthday: people.birthday || '1900/01/01'
                    })
                    //解析圖片為JSON物件
                    let PicJson = JSON.parse(Profile[0]["pic"]);
                    // console.log(PicJson);

                    Object.keys(PicJson || {}).map(pic => {
                        // console.log(pic)
                        setPicObj(prev => ({
                            ...prev,
                            [pic]: PicJson[pic]?.split(',') || []
                        }))
                    });
                    //Lab
                    let ContentJson = JSON.parse(LabData[0]["content"]);
                    // console.log(PF.multiFilter(ContentJson, { Err: ['true'] }))
                    setArray02(prev => [...prev, ...ContentJson.filter(x => x.Err === 'true')])
                    // setArray02(prev => prev.concat(PF.multiFilter(ContentJson, { Err: ['true'] })))
                    setArray02_2(PF.multiFilter(ContentJson, { Err: ['true'] }))

                    // console.log(ContentJson);
                    setArray04(ContentJson)

                    const CategoryArray04 = [
                        { id2: "0401", title2: "尿液常規檢查" },
                        { id2: "0402", title2: "血液檢查" },
                        { id2: "0403", title2: "生化檢查" },
                        { id2: "0404", title2: "腫瘤標記" },
                        { id2: "0405", title2: "甲狀腺檢查" },
                        { id2: "0406", title2: "血清免疫檢查" },
                        { id2: "0407", title2: "賀爾蒙檢查" },
                        { id2: "0408", title2: "基因檢查" },
                        { id2: "0409", title2: "功能醫學" },

                    ];
                    if (ContentJson.length > 0) {

                        CategoryArray04.map(item => {
                            let y = ContentJson.filter(x => x.CheckCategory === item.title2)
                            // console.log(item)
                            if (y.length > 0) {
                                setsubItems(prev => ({
                                    ...prev,
                                    ['04']: [...prev['04'], { id2: item.id2, title2: item.title2 }]

                                }))
                            }

                        })
                        setitems(prev => [...prev, { id: '04', title: ' - 檢驗', data: ContentJson }])



                    }

                    //Gauge


                    let ContentJson2 = JSON.parse(GaugeData[0]["content"]);
                    // console.log(ContentJson);
                    setArray03(PF.multiFilter(ContentJson2, { CheckCategory: ['一般體格', '醫生問診'] }))
                    // setArray02_1(PF.multiFilter(ContentJson2, { Err: ['true'] }))
                    setArray02_1(prev => [...prev, ...ContentJson2.filter(x => x.Err === 'true')])
                    setArray02(prev => [...prev, ...ContentJson2.filter(x => x.Err === 'true')])
                    // setArray02(prev => [...Array02, ...PF.multiFilter(ContentJson, { Err: ['true'] })])
                    // arr02 = [...arr02, ...PF.multiFilter(ContentJson, { Err: ['true'] })]

                    // let Array03 = PF.multiFilter(ContentJson, { CheckCategory: ['醫生問診'] });
                    // console.log(ContentJson);
                    // console.log(PF.multiFilter(ContentJson, { Err: ['true'] }))

                    let ItemArray = PF.multiFilter(ContentJson2, { CheckCategory: PicCategoryArray });
                    let ItemArray2 = PF.multiFilter(ContentJson, { CheckCategory: PicCategoryArray });
                    if (ItemArray2.length > 0) {
                        ItemArray = [...ItemArray, ...ItemArray2]
                    }
                    // console.log(ContentJson2);
                    // console.log(ItemArray);
                    // console.log(ItemArray2);
                    let object = _.keyBy(ItemArray, 'CheckCategory');
                    // console.log(object);
                    let y = {}
                    Object.keys(object).map(CheckCategory => {
                        y[CheckCategory] = PF.multiFilter([...ContentJson2, ...ContentJson], { CheckCategory: CheckCategory })

                    })

                    // console.log(y);
                    setGaugeItem(y)

                    PicCategoryArray.map((item, index) => {
                        if (y[item]?.length > 0) {
                            // console.log(item)
                            let z = CategoryArray05.filter(x => x.title2 === item)

                            setsubItems(prev => ({
                                ...prev,
                                ['05']: [...prev['05'], { id2: z[0].id2, title2: z[0].title2 }]

                            }))
                        }
                    })

                    if (Object.keys(y).length > 0) {
                        setitems(prev => [...prev, { id: '05', title: ' - 影像檢查', data: y }])

                    }
                    let array6 = PF.multiFilter(ContentJson2, { CheckCategory: ['肺功能檢查'] })
                    setArray06(array6)

                    if (array6.length > 0) {
                        setitems(prev => [...prev, { id: '06', title: ' - 其他檢查', data: array6 }])
                    }





                }
                else {
                }
            })
    }
    return (
        <>
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
                        placeholder="請輸入身分證號"
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
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <DialogTitle style={{ backgroundColor: indigo[500], paddingBottom: 30 }}>

                    <IconButton style={{
                        position: 'absolute',
                        right: 5,
                        top: 5,

                    }}
                        onClick={handleClose}
                    >
                        <CloseIcon style={{ color: "white" }} />
                    </IconButton>
                </DialogTitle >
                <DialogContent dividers style={{ padding: 0 }}>
                    <Minmax Array02={Array02} items={items} Profile={Profile} Array03={Array03} Array04={Array04}
                        Array06={Array06} GaugeItem={GaugeItem} PicObj={PicObj} Array02_1={Array02_1} Array02_2={Array02_2} subItems={subItems} seturl={seturl} />
                </DialogContent>

            </Dialog>
        </>
    )
}

export default App