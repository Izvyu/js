
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, IconButton, MenuItem, Stack } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import _, { omit, pick } from 'lodash'
import PF from "../_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import NumberFormat from 'react-number-format';
import { injectIntl, intlShape, useIntl, FormattedMessage } from 'react-intl';
import SearchIcon from '@mui/icons-material/Search';
import ProjectItemDialog from './Reservation';
import SingleItem from './SingleItem';
import QueryDialog from './QueryDialog';


import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PersonAdd from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import Edit from '@mui/icons-material/Edit';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import { blue } from '@mui/material/colors';
// import blue from '@mui/core/colors/blue';
// import { makeStyles } from '@mui/styles';
// import { createTheme, ThemeProvider } from '@mui/core/styles';

// const useStyles = makeStyles(theme => ({
//     root: {
//         // maxWidth: 600,
//         //   flex: 1
//     },

// }));

const handleAdd = e => {
    console.log("add")
}
const actions = [
    { icon: <PersonAdd />, name: '新增', function: handleAdd },
    { icon: <Edit />, name: '變更', function: f => f },
    { icon: <SaveIcon />, name: '保存', function: f => f },
    { icon: <PrintIcon />, name: '列印', function: f => f },

];


const App = () => {
    // const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();
    const [SingleChecked, setSingleChecked] = React.useState([]);
    const [CheckItem, setCheckItem] = React.useState(new Map())
    const [ProjectList, setProjectList] = React.useState([]);

    const [BackOpen, setBackOpen] = React.useState(false);
    const [BarCodeStr, setBarCodeStr] = React.useState('');
    const [DialogQueryOpen, setDialogQueryOpen] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const [SingleOpen, setSingleOpen] = React.useState(false);

    const [scroll, setScroll] = React.useState('paper');
    const [SelectList, setSelectList] = React.useState([])
    const [SelectListGroup, setSelectListGroup] = React.useState([])

    const [PersonItem, setPersonItem] = React.useState([
        // { AutoInc: "000000", BarCodeStr: '', Name: "XXXCCCCCCCCCCCCCCCCCCCCCC", TypeName: "加做", Type: 2, SchemeNo: 0
        //, CategoryNo: null, ItemNo: null, OtherItems: null, PersonPrice: 2000 }
    ])
    const [inputValue, setInputValue] = React.useState(""); //AutoComplete過濾字串

    const [Main, setMain] = React.useState({
        ProjectNo: "", Name: "", PublicExpense: "", SchemeNo: "", Type: ""
    })
    const [DeductItem, setDeductItem] = React.useState({})
    const [DynamicItem, setDynamicItem] = React.useState([])
    const [DynamicState, setDynamicState] = React.useState({})

    const [ProjectItem, setProjectItem] = React.useState({
    })
    const [formState, setFormState] = React.useState('Query')

    const handleChangeBarCodeStr = event => {
        if (formState !== 'Query') {
            const { name, value } = event.target;
            // console.log(name, value)
            setBarCodeStr(value)
        }
    }
    const gridRef = React.useRef();

    const [columnDefs] = React.useState([
        { headerName: '', valueGetter: 'node.rowIndex + 1', width: 60, pinned: 'left', tooltipField: 'ItemNo' },
        { field: 'TypeName', headerName: "類型", width: 80, tooltipField: 'DecItems' },
        { field: 'Name', headerName: "名稱", width: 230, tooltipField: 'Name' },
        { field: 'OtherItems', headerName: "其他", width: 100, tooltipField: 'OtherItems' },
        { field: 'PersonPrice', headerName: "價格", width: 100, tooltipField: 'PersonPrice', type: 'rightAligned', cellRenderer: item => { return '$' + PF.ccyFormat(item.value, 0) } }
    ])
    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
    };
    const handleAutoCompleteChange = (e, v, reason) => {            //清空、選擇都會進來
        // console.log(v?.ProjectNo)
        // console.log(settingObj.projectNo.value.ProjectNo)
        if (formState !== 'Query') {
            if (reason === 'clear') {
                if (window.confirm("清除專案，已挑選套餐是否一併清除?")) {
                    setObj(prevState => ({
                        ...prevState,
                        projectNo: { ...prevState.projectNo, value: v === null ? { ProjectName: "" } : v }
                    }))

                    let x = _.remove(PersonItem, item => item.Type !== 0)
                    setPersonItem(x)

                }
            } else if (settingObj.projectNo.value.ProjectNo !== undefined && v?.ProjectNo !== settingObj.projectNo.value.ProjectNo) {
                if (window.confirm("切換專案，已挑選套餐是否一併清除?")) {
                    setObj(prevState => ({
                        ...prevState,
                        projectNo: { ...prevState.projectNo, value: v === null ? { ProjectName: "" } : v }
                    }))
                    let x = _.remove(PersonItem, item => item.Type !== 0)
                    setPersonItem(x)
                }
            }
            else {
                setObj(prevState => ({
                    ...prevState,
                    projectNo: { ...prevState.projectNo, value: v === null ? { ProjectName: "" } : v }
                }))
                if (!_.isNil(v)) {
                    PF.instance({
                        method: "post",
                        url: PF.url + "/CheckProjectScheme/GetData",
                        data: Qs.stringify({
                            Action: "",
                            parameter: {
                                ProjectNo: v.ProjectNo
                            }
                        }),
                        headers: { token: sessionStorage.token }
                    })
                        .then(function (response) {
                            // console.log(response.data)
                            const { TotalRecord, rows, rowsGroup } = response.data
                            if (TotalRecord <= 0) {
                                // alert("問卷提交出錯\r\n" + ErrorMessage + "請致電 04-2255-2555 #168 企業健檢")
                                enqueueSnackbar("Fail", { variant: "error", style: { whiteSpace: 'pre-line' } });
                            } else {
                                enqueueSnackbar("Success", { variant: "success", style: { whiteSpace: 'pre-line' } });
                                //先寫死
                                //套餐
                                setSelectList(rows);
                                setSelectListGroup(rowsGroup);


                            }
                        })
                }

            }
        }
        // console.log()


    }

    //查詢條件
    const [settingObj, setObj] = React.useState({
        startDate: { label: "健檢日期(起)", name: "startDate", format: "date", required: true, disableFuture: true, value: null },
        endDate: { label: "健檢日期(迄)", name: "endDate", format: "date", required: true, disableFuture: true, placeholder: "2000/01/01", value: null },
        projectNo: { label: "專案名稱", name: "projectNo", format: "text", required: true, value: { ProjectName: "" } },
        gender: { label: "性別", name: "gender", format: "toggle", required: true, value: "男" },
        personName: { label: "姓名", name: "personName", format: "text", required: true, value: "" },
        cellPhone: { label: "手機", name: "cellPhone", format: "text", required: true, value: "" },
        id: { label: "身分證號", name: "id", format: "text", required: true, value: "" },
        email: { label: "email", name: "email", format: "email", required: true, value: "" },
        birthDate: { label: "birthDate", name: "birthDate", format: "date", required: true, value: "" },
        age: { label: "age", name: "age", format: "text", required: true, value: "" },
        premiumCharge: { label: "優待金額", name: "premiumCharge", format: "text", required: true, value: 0 },
        remitCharge: { label: "匯款金額", name: "remitCharge", format: "text", required: true, value: 0 },
        reocrdCharge: { label: "記帳金額", name: "reocrdCharge", format: "text", required: true, value: 0 },
        address: { label: "地址", name: "address", format: "text", required: true, value: '' },
        premiumNote: { label: "地址", name: "premiumNote", format: "text", value: '' },
        Type0Charge: { label: "套餐費用", name: "Type0Charge", format: "text", value: 0 },
        // Type1Charege: { label: "地址", name: "Type1Charege", format: "text", value: 0 },
        Type2Charge: { label: "加做費用", name: "Type2Charge", format: "text", value: 0 },
        cost: { label: "成本金額", name: "cost", format: "text", value: 0 },
        profit: { label: "毛利金額", name: "profit", format: "text", value: 0 },
        profitRate: { label: "毛利率", name: "profitRate", format: "text", value: 0 },
    })
    const [Amt, setAmt] = React.useState({
        cost: 0,
        profit: 0,
        Type0Charge: 0,
        Type2Charge: 0,
        profitRate: 0
    })

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const onRowDoubleClicked = (event) => {
        // console.log(event)
        const { data } = event
        // console.log(data)
        if (data.TypeName === "套餐") {
            setOpen(true);
            setScroll('paper');
            //顯示表頭
            let main = SelectList.find(x => x.SchemeNo === data.SchemeNo);
            setMain(main);

            //顯示主要內容
            let P = main.FixItems.split(",").reduce((a, v) => ({ ...a, [v]: CheckItem?.get(v) }), {})
            setProjectItem(P);

            console.log(data.DecItems)
            if (!_.isEmpty(data.DecItems)) {
                data.DecItems.split(',').forEach(element => {
                    setDeductItem(prev => ({
                        ...prev,
                        [element]: CheckItem.get(element)
                    }))
                });
            } else {
                setDeductItem({})
            }
            //顯示減項
            // if (data.DecItems.split(',').length > 0) {

            // }

            //顯示動態清單，若有
            let x = SelectListGroup.filter(x => x.SchemeNo === data.SchemeNo);
            // console.log(x)
            setDynamicItem(x);


            let OtherItems = data.OtherItems?.split(',');

            let y = {}
            x.map(item => {
                y[item.GroupNo] = item.Items.split(",").reduce((a, v) => ({ ...a, [v]: OtherItems.indexOf(v) >= 0 ? true : false }), {})
            })
            setDynamicState(y);




        } else {
            enqueueSnackbar("請挑選套餐", { variant: "error", style: { whiteSpace: 'pre-line' } });
        }

    }


    // const handleClose = () => {
    //     setOpen(false);
    // };
    useEffect(() => {
        PF.instance({
            method: "post",
            url: PF.url + "/CheckItem/GetData",
            data: Qs.stringify({
                Action: "1",
                parameter: {
                    ProjectNo: "2022040801"
                }
            }),
            headers: { token: sessionStorage.token }
        })
            .then(function (response) {
                let map1 = new Map();
                // console.log(response.data)
                const { TotalRecord, rows } = response.data
                if (TotalRecord <= 0) {
                    // alert("問卷提交出錯\r\n" + ErrorMessage + "請致電 04-2255-2555 #168 企業健檢")
                    enqueueSnackbar("Fail", { variant: "error", style: { whiteSpace: 'pre-line' } });
                } else {
                    enqueueSnackbar("Success", { variant: "success", style: { whiteSpace: 'pre-line' } });
                    map1 = new Map(
                        rows.map(object => {
                            return [object.CheckNo, object];
                        }),
                    );
                    console.log(map1)
                    setCheckItem(map1)

                }
            })


        PF.instance({
            method: "post",
            url: PF.url + "/CheckProject/GetLiveData",
            data: Qs.stringify({ Action: "1", parameter: { projectName: "" } }),
            // headers: { token: sessionStorage.token }
        })
            .then(function (response) {
                // alert("完成")
                const { TotalRecord, rows } = response.data;
                // console.log(rows)
                if (TotalRecord > 0) {
                    enqueueSnackbar("查詢成功", { variant: "success", style: { whiteSpace: 'pre-line' } });
                    setProjectList(rows)
                    // console.log(rows)

                }
                else {
                    enqueueSnackbar("查無資料", { variant: "warning", style: { whiteSpace: 'pre-line' } });
                }
            })




    }, [])
    const handleSingleItemOpen = () => {
        setSingleOpen(true);
    }
    const handleDeleteSelectedItem = () => {
        let selectedRows = gridRef.current.api.getSelectedRows()
        // console.log(selectedRows)
        // console.log(PersonItem)

        const results = PersonItem.filter(({ Name: id1 }) => !selectedRows.some(({ Name: id2 }) => id2 === id1));
        // console.log(results)
        setPersonItem(results)

        // gridRef.current.api.applyTransactionAsync({ remove: selectedRows })

    }
    // React.useEffect(() => {
    //     console.log(PersonItem)
    // }, [PersonItem])
    // React.useEffect(() => {
    //     console.log(DeductItem)
    // }, [DeductItem])
    const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <NumberFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                isNumericString
                // prefix="$"
                style={{ textAlign: 'right' }}
            />
        );
    });


    const handleQueryBarCodeStr = e => {
        // console.log(e)

        PF.instance({
            method: "post",
            url: PF.url + "/CheckProjectPersonItem/GetData",
            data: Qs.stringify({
                Action: "",
                parameter: {
                    BarCodeStr: e    //先寫死
                }
            }),
            headers: { token: sessionStorage.token }
        })
            .then(function (response) {
                // console.log(response.data)
                const { TotalRecord, rows, PersonItemRows } = response.data
                if (TotalRecord <= 0) {
                    // alert("問卷提交出錯\r\n" + ErrorMessage + "請致電 04-2255-2555 #168 企業健檢")
                    enqueueSnackbar("Fail", { variant: "error", style: { whiteSpace: 'pre-line' } });
                } else {
                    enqueueSnackbar("Success", { variant: "success", style: { whiteSpace: 'pre-line' } });

                    console.log(rows[0])
                    const { Sex, Name, Sogi, ID, Age, EMail, Address, Birthday, PremiumNote, Type0Charge, Type2Charge, PremiumCharge } = rows[0]
                    setObj(prev => ({
                        ...prev,
                        gender: { ...prev.gender, value: Sex },
                        personName: { ...prev.personName, value: Name },
                        cellPhone: { ...prev.cellPhone, value: Sogi },
                        id: { ...prev.id, value: ID },
                        age: { ...prev.age, value: Age },
                        email: { ...prev.email, value: EMail },
                        address: { ...prev.address, value: Address },
                        birthDate: { ...prev.birthDate, value: Birthday },
                        premiumNote: { ...prev.premiumNote, value: PremiumNote },
                        // Type0Charge: { ...prev.personName, value: Type0Charge },
                        // Type2Charge: { ...prev.personName, value: Type2Charge },
                        premiumCharge: { ...prev.premiumCharge, value: PremiumCharge },
                    }))
                    setAmt(prev => ({
                        ...prev,
                        Type0Charge: Type0Charge,
                        Type2Charge: Type2Charge,
                    }))



                    //套餐
                    setPersonItem(PersonItemRows);
                    // setSelectListGroup(rowsGroup);

                    // console.log(rows[0].ProjectNo)
                    return rows[0]
                }
            }).then(ProjectObj => {
                // console.log(ProjectObj)
                PF.instance({
                    method: "post",
                    url: PF.url + "/CheckProjectScheme/GetData",
                    data: Qs.stringify({
                        Action: "",
                        parameter: {
                            ProjectNo: ProjectObj.ProjectNo
                        }
                    }),
                    headers: { token: sessionStorage.token }
                })
                    .then(function (response) {
                        // console.log(response.data)
                        const { TotalRecord, rows, rowsGroup } = response.data
                        if (TotalRecord <= 0) {
                            // alert("問卷提交出錯\r\n" + ErrorMessage + "請致電 04-2255-2555 #168 企業健檢")
                            enqueueSnackbar("Fail", { variant: "error", style: { whiteSpace: 'pre-line' } });
                        } else {
                            enqueueSnackbar("Success", { variant: "success", style: { whiteSpace: 'pre-line' } });
                            //先寫死
                            //套餐
                            setSelectList(rows);
                            setSelectListGroup(rowsGroup);


                            // setInputValue('晨悅員工抽血');
                            setObj(prevState => ({
                                ...prevState,
                                projectNo: { ...prevState.projectNo, value: ProjectObj }

                            }))

                        }
                    })

            })
    }
    //正德項目
    const ExcludeCheckItem = ['7089', '7099', '7101', '7100', '7102', '7103', '7105', '7106', '7107', '7108', '7109', '7110', '7111', '7112', '7113', '7114', '7115', '7116', '7117']

    const handlePriceCalculate = () => {
        let mealItem = PersonItem.filter(item => item.TypeName === '套餐')
        let addItem = PersonItem.filter(item => item.TypeName === '加做')
        //套餐金額加總
        let Type0Charge = mealItem.reduce((a, b) => a + b.PersonPrice, 0)
        //加作金額加總
        let Type2Charge = addItem.reduce((a, b) => a + b.PersonPrice, 0)
        console.log(Type0Charge)




        setAmt(prev => ({
            ...prev,
            Type2Charge: Type2Charge,
            Type0Charge: Type0Charge,
            // Price:
        }))
    }

    const handleCostCalculate = () => {
        let cost = {}
        let remove = []

        // let mealItem = PersonItem.filter(item => item.TypeName === '套餐')
        let mealItem0 = PersonItem.filter(item => item.TypeName === '套餐' && item.ChargeType === 0);
        // console.log(mealItem0)
        if (mealItem0.length > 0) {
            mealItem0.map(item => {
                // console.log(item);
                if (!_.isNil(item.SchemeItems)) {
                    item.SchemeItems.split(",").map(i => {
                        cost[i] = CheckItem.get(i);
                    })
                    remove = [...remove, ...item.DecItems.split(",")]
                }
            })
            remove = remove.filter(x => x !== '')
        }
        //移除減項

        var result = _.omit(cost, remove);
        // console.log(ExcludeCheckItem.findIndex(item => item === '1000'))
        // console.log(Object.values(result).reduce((a, b) => a + b.OwnExpense : 0 || 0, 0))
        // console.log(_.some(['7027', '7029'], _.partial(_.has, result)))
        // console.log(Object.keys(result).some((element) => element === '7027' || element === '7029'))
        //再含加項
        let addItem = PersonItem.filter(item => item.TypeName === '加做')
        addItem.map(item => {
            result[item.ItemNo] = CheckItem.get(item.ItemNo)
        })
        //最後再整體(套餐+加項)移除正德項目
        result = _.omit(result, ExcludeCheckItem);
        console.log(result)
        //自費套餐
        let mealItem1 = PersonItem.filter(item => item.TypeName === '套餐' && item.ChargeType === 1);

        console.log(mealItem1)
        // console.log(mealItem1.reduce((a, b) => a + b.OwnExpense, 0))
        // console.log(mealItem1.reduce((a, b) => a + b.OwnExpense, 0))
        let costValue = (Object.keys(result).length > 0 ? Object.values(result).reduce((a, b) => a + b.OwnExpense || 0, 0) : 0)
            + mealItem1.reduce((a, b) => a + b.OwnExpense || 0, 0)
            + (_.some(['7029', '7030'], _.partial(_.has, result)) ? 3000 : 0)                           //有麻醉項目+3000
            + (_.every(['6030', '6031', '6032', '6033', '6034'], _.partial(_.has, result)) ? 550 : 0)   //女性賀爾蒙
            + (_.every(['5005', '6032', '6035', '6061', '6062'], _.partial(_.has, result)) ? 685 : 0)   //男性賀爾蒙
            - (_.every(['7058', '7059'], _.partial(_.has, result)) ? 250 : 0)                           //新柏氏抹片+HPV
        // console.log(costValue)

        setAmt(prev => ({
            ...prev,
            cost: costValue,
            profit: (prev.Type0Charge + prev.Type2Charge - settingObj.premiumCharge.value - costValue),
            profitRate: ((prev.Type0Charge + prev.Type2Charge - settingObj.premiumCharge.value - costValue) / (prev.Type0Charge + prev.Type2Charge - settingObj.premiumCharge.value)).toFixed(4)
        }))
    }
    React.useEffect(() => {
        handlePriceCalculate()
        handleCostCalculate()
        console.log(PersonItem)
    }, [PersonItem])
    //

    // const actions = [
    //     { icon: <FileCopyIcon />, name: 'Barcode' },
    //     { icon: <SaveIcon />, name: 'Id' },
    //     { icon: <PrintIcon />, name: 'Name' },
    //     { icon: <ShareIcon />, name: 'Phone' },
    // ];

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
    return (
        <>
            <Backdrop open={BackOpen} />
            <Grid container spacing={0}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>

                        <Button onClick={() => setDialogQueryOpen(true)} variant="contained">選擇器</Button>
                        <TextField size="small" label={'BarCodeStr'} value={BarCodeStr} onChange={handleChangeBarCodeStr} />
                        {/* <TextField label={"專案名稱"} value={""} /> */}
                        <FormControl style={{ display: "inline-block" }}>
                            <Autocomplete
                                value={settingObj.projectNo.value || ""}
                                onChange={handleAutoCompleteChange}
                                inputValue={inputValue || ""}
                                onInputChange={(event, newInputValue, reason) => {
                                    if (reason !== "clear") {
                                        setInputValue(newInputValue);
                                    }
                                    // console.log(newInputValue, 'i')
                                }}
                                getOptionLabel={(option) => option.ProjectName} //大小寫須一致
                                filterOptions={(option, { inputValue }) => option.filter(item => item.ProjectNo.toString().includes(inputValue) || item.ProjectName.toString().includes(inputValue))}
                                renderOption={(props, option) => (//表達格式
                                    <li {...props} key={option.ProjectNo}>
                                        {'[' + option.ProjectNo + ']'}
                                        {option.ProjectName}
                                    </li>
                                )}
                                options={ProjectList}
                                sx={{ width: 500 }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        size="small"
                                        error={settingObj.projectNo.error || false}
                                        helperText={settingObj.projectNo.error ? settingObj.projectNo.helperText : ""}
                                        name={"projectNo"}
                                        required={true}
                                        label="專案名稱" variant="outlined" />}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>
                        <TextField size="small" label={"身分證號"} value={settingObj.id.value} name={settingObj.id.name} required={true} autoComplete='off' style={{ backgroundColor: blue[50] }} />
                        <TextField size="small" label={"姓名"} value={settingObj.personName.value} name={settingObj.personName.name} required={true} autoComplete='off' />
                        <TextField size="small" label={"手機"} value={settingObj.cellPhone.value} name={settingObj.cellPhone.name} required={true} autoComplete='off' />
                        <ToggleButtonGroup
                            // color="primary"
                            value={settingObj.gender.value}
                            exclusive
                            onChange={(e, newValue) => {
                                if (formState !== 'Query') {
                                    if (newValue !== null) {
                                        setObj(prev => ({
                                            ...prev,
                                            gender: { ...prev.gender, value: newValue }
                                        }))
                                    }

                                }


                            }}
                        >
                            <ToggleButton value="男" color="primary"><ManIcon /></ToggleButton>
                            <ToggleButton value="女" color="secondary"><WomanIcon /></ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>
                        <TextField size="small" label={"Email"} value={settingObj.email.value} name={settingObj.email.name} style={{ width: '50%' }} autoComplete='off' />
                        <TextField size="small" label={"地址"} value={settingObj.address.value} name={settingObj.address.name} style={{ width: '50%' }} autoComplete='off' />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>
                        <TextField size="small" label={"生日"} value={settingObj.birthDate.value} name={settingObj.birthDate.name} required={true} autoComplete='off' />
                        <TextField size="small" label={"年齡"} value={settingObj.age.value} name={settingObj.age.name} style={{ width: 100 }} InputProps={{
                            readOnly: true,
                        }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>
                        <TextField size="small" multiline rows={2} label={"優待說明/收費備註"} value={settingObj.premiumNote.value} name={settingObj.premiumNote.name} fullWidth autoComplete='off' />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>
                        <fieldset style={{ width: "100%", }}>
                            <legend align="left" style={{ fontWeight: "bold" }}>報價資訊</legend>
                            <Box >
                                <TextField size="small" focused label={"套餐費用"} value={Amt.Type0Charge} name={settingObj.Type0Charge.name} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                                <IconButton>+</IconButton>
                                <TextField size="small" focused label={"加項費用"} value={Amt.Type2Charge} name={settingObj.Type2Charge.name} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                                <IconButton>=</IconButton>
                                <TextField size="small" focused label={"應收金額"} value={settingObj.Type0Charge.value + settingObj.Type2Charge.value} name={"ARCharge"} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                                <IconButton>-</IconButton>
                                <TextField size="small" focused label={"匯款金額"} value={settingObj.remitCharge.value} name={settingObj.remitCharge.name} variant="filled" style={{ width: 100 }} InputProps={{ inputComponent: NumberFormatCustom }} />
                                <IconButton>-</IconButton>
                                <TextField size="small" focused label={"優待金額"} value={settingObj.premiumCharge.value} name={settingObj.premiumCharge.name} variant="filled" style={{ width: 100 }} InputProps={{ inputComponent: NumberFormatCustom }} />
                                <IconButton>-</IconButton>
                                <TextField size="small" focused label={"記帳金額"} value={settingObj.reocrdCharge.value} name={settingObj.reocrdCharge.name} variant="filled" style={{ width: 100 }} InputProps={{ inputComponent: NumberFormatCustom }} />
                                <IconButton>=</IconButton>
                                <TextField size="small" focused label={"實收金額"} variant="filled" style={{ width: 100 }}
                                    value={Amt.Type0Charge + Amt.Type2Charge - settingObj.remitCharge.value - settingObj.premiumCharge.value - settingObj.reocrdCharge.value}
                                    name={settingObj.reocrdCharge.name}
                                    InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }}>
                                <TextField size="small" focused label={"銷售金額"} value={Amt.Type0Charge + Amt.Type2Charge - settingObj.premiumCharge.value} name={"ARCharge"} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                                <IconButton>-</IconButton>
                                <TextField size="small" focused label={"成本金額"} value={Amt.cost} name={settingObj.cost.name} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                                <IconButton>=</IconButton>
                                <TextField size="small" focused label={"毛利"} value={Amt.profit} name={settingObj.profit.name} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                                <IconButton>=</IconButton>
                                <TextField size="small" focused label={"毛利率"} value={Amt.profitRate * 100 + '%'} name={settingObj.profitRate.name} variant="filled" style={{ width: 100 }} InputProps={{ readOnly: true, inputComponent: NumberFormatCustom }} />
                            </Box>
                        </fieldset>
                    </Box>
                    {/* <Box>
                        <Button onClick={() => setDialogQueryOpen(true)} variant="contained" color="error" >售價計算</Button>
                    </Box> */}

                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2} direction="row">
                        <Button onClick={handleClickOpen('paper')} variant="contained" disabled={_.isNil(settingObj.projectNo.value.ProjectNo)}>加入套餐</Button>
                        <Button onClick={handleSingleItemOpen} variant="contained" >加入單項</Button>
                        <Button onClick={handleDeleteSelectedItem} variant="contained" color="error" >刪除所選</Button>
                    </Stack>
                    {/* <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>類型</TableCell>
                                    <TableCell >名稱</TableCell>
                                    <TableCell >其他</TableCell>
                                    <TableCell align="center">價格</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {PersonItem.map((item, index) => {

                                })}
                            </TableBody>

                        </Table>
                    </TableContainer> */}

                    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
                        <AgGridReact
                            ref={gridRef}
                            rowData={PersonItem}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection={'multiple'}
                            rowMultiSelectWithClick={true}
                            onRowDoubleClicked={onRowDoubleClicked}
                            enableRangeSelection={true}
                            enableRangeHandle={true}
                            statusBar={statusBar}
                        // groupSelectsChildren={true}
                        // groupSelectsFiltered={true}
                        // suppressAggFuncInHeader={true}
                        // suppressRowClickSelection={true}
                        >
                        </AgGridReact>
                    </div>

                </Grid>
            </Grid>
            <ProjectItemDialog
                open={open}
                scroll={scroll}
                setOpen={setOpen}
                handleClickOpen={handleClickOpen}
                CheckItem={CheckItem}
                SelectList={SelectList}
                SelectListGroup={SelectListGroup}
                setPersonItem={setPersonItem}
                PersonItem={PersonItem} //比對已有項目，若已有則不加入
                Main={Main}
                setMain={setMain}
                DeductItem={DeductItem}
                setDeductItem={setDeductItem}
                ProjectItem={ProjectItem}
                setProjectItem={setProjectItem}
                DynamicItem={DynamicItem}
                setDynamicItem={setDynamicItem}
                DynamicState={DynamicState}
                setDynamicState={setDynamicState}
            />
            <SingleItem
                CheckItem={CheckItem}
                open={SingleOpen}
                setSingleOpen={setSingleOpen}
                checked={SingleChecked}
                setChecked={setSingleChecked}
                setPersonItem={setPersonItem}
                PersonItem={PersonItem} //比對已有項目，若已有則不加入
            />
            <QueryDialog
                open={DialogQueryOpen}
                setDialogQueryOpen={setDialogQueryOpen}
                setBarCodeStr={setBarCodeStr}
                handleQueryBarCodeStr={handleQueryBarCodeStr}
            // handleChangeBarCodeStr={handleChangeBarCodeStr}
            />
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, left: 16 }}
                icon={<SpeedDialIcon />}
                direction={'right'}
                open={BackOpen}
                onClose={() => { setBackOpen(false) }}
                onOpen={() => { setBackOpen(true) }}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.function}
                    />
                ))}
            </SpeedDial>
        </>
    )
}
export default App;
