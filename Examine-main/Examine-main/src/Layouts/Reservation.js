
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



/*
ProjectNo:2022040801
B方案7000(女)
*/

const App = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { open, scroll, setOpen, handleClickOpen, CheckItem, SelectList, SelectListGroup, setPersonItem, PersonItem
        , Main, setMain, DeductItem, setDeductItem, ProjectItem, setProjectItem, DynamicItem, setDynamicItem, DynamicState, setDynamicState } = props;
    // const [open, setOpen] = React.useState(false);
    // const [scroll, setScroll] = React.useState('paper');

    // const handleClickOpen = (scrollType) => () => {
    //     setOpen(true);
    //     setScroll(scrollType);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };
    // const [CheckItem, setCheckItem] = React.useState(new Map())


    // const [dense, setDense] = React.useState(true);
    const [secondary, setSecondary] = React.useState(false);
    const handleMoveDeduct = (e, item) => {

        setDeductItem({
            ...DeductItem,
            [item.CheckNo]: item
        })

    }
    const handleCancelDeduct = (e, item) => {
        setDeductItem(omit(DeductItem, [item.CheckNo]))
    }
    // useEffect(() => {


    // }, [])

    const handleDynamicChecked = (e, prop, GroupNo) => {
        // console.log(prop)
        // console.log(GroupNo)
        setDynamicState(prev => ({
            ...prev, [GroupNo]: {
                ...prev[GroupNo], [prop]: e.target.checked
            }
        }))

    }

    const handleSave = () => {
        if (PersonItem.findIndex(p => p.SchemeNo === Main.SchemeNo) < 0) {
            console.log(Main)
            let y = {
                AutoInc: null, BarCodeStr: null,
                Name: Main.Name, TypeName: "套餐", Type: 0, SchemeNo: Main.SchemeNo, CategoryNo: null,
                ChargeType: Main.ChargeType,
                SchemeItems: Main.FixItems,
                ItemNo: null,
                OtherItems: Object.values(DynamicState).reduce((a, b) => a + Object.keys(b).filter(item => b[item] === true) + ',', "").slice(0, -1),
                PersonPrice: Main.PublicExpense, DecItems: Object.keys(DeductItem).join(","),
                OwnExpense: Main.OwnExpense,
            }
            setPersonItem(prev => {
                return [...prev, y]
            })
        } else {
            if (window.confirm("是否覆蓋?")) {
                let y = {
                    AutoInc: null, BarCodeStr: null,
                    Name: Main.Name, TypeName: "套餐", Type: 0, SchemeNo: Main.SchemeNo, CategoryNo: null,
                    ItemNo: null,
                    OtherItems: Object.values(DynamicState).reduce((a, b) => a + Object.keys(b).filter(item => b[item] === true) + ',', "").slice(0, -1),
                    PersonPrice: Main.PublicExpense, DecItems: Object.keys(DeductItem).join(","),
                    OwnExpense: Main.OwnExpense,
                }
                setPersonItem(
                    PersonItem.map(item => {
                        console.log(item.SchemeNo)
                        console.log(Main.SchemeNo)

                        return item.SchemeNo == Main.SchemeNo ? y : item
                    })
                )
            }
        }

        handleClose()
    }
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
                prefix="$"
                style={{ textAlign: 'right' }}
            />
        );
    });
    const handleSelectChange = (event) => {
        //清空減項
        setDeductItem({})
        // console.log(event.target.value)
        let main = SelectList.find(x => x.SchemeNo === event.target.value);
        console.log(main)
        setMain(main);

        //改變中間項次
        let P = main.FixItems.split(",").reduce((a, v) => ({ ...a, [v]: CheckItem?.get(v) }), {})
        // console.log(P)
        setProjectItem(P);


        let x = SelectListGroup.filter(x => x.SchemeNo === event.target.value);
        setDynamicItem(x);
        console.log(x)

        let y = {}
        x.map(item => {
            y[item.GroupNo] = item.Items.split(",").reduce((a, v) => ({ ...a, [v]: false }), {})
        })
        setDynamicState(y);


    }
    const handleClose = () => {
        setOpen(false);
        //清空減項
        setDeductItem({})
        setMain({ ProjectNo: "", Name: "", PublicExpense: "", SchemeNo: "", Type: "" });
        setProjectItem({})
        setDynamicItem([])
        setDynamicState({})

    }
    return (
        <>
            {/* <Button onClick={handleClickOpen('paper')}>加入套餐</Button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                maxWidth={'lg'}
            >
                <DialogTitle id="scroll-dialog-title">
                    <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }} >
                        <FormControl variant="filled" style={{ width: 500 }} focused>
                            <InputLabel color="success" focused>套餐選擇</InputLabel>
                            <Select
                                value={Main.Name}
                                onChange={handleSelectChange}
                                color="success"
                                focused
                                renderValue={(selected) => selected}
                            >
                                {SelectList.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.SchemeNo}>
                                            <ListItemIcon key={0}>{item.SchemeNo}</ListItemIcon>
                                            <ListItemText key={1}>{item.Name}</ListItemText>
                                            <Typography variant="body2" color="text.secondary">{PF.ccyFormat(item.PublicExpense, 0)}</Typography>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </ FormControl>

                        <TextField key={"專案代碼"} label={"專案代碼"} variant="filled" color="success" style={{ width: 150 }} focused value={Main.ProjectNo} />
                        <TextField key={"方案代號"} label={"方案代號"} variant="filled" color="success" style={{ width: 100 }} focused value={Main.SchemeNo} />
                        <TextField key={"方案價格"} label={"方案價格"} variant="filled" color="success" style={{ width: 100 }} focused value={Main.PublicExpense} InputProps={{ inputComponent: NumberFormatCustom, }} />
                    </Box>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={secondary}
                                        onChange={(event) => setSecondary(event.target.checked)}
                                    />
                                }
                                label="顯示單項價格"
                            />
                        </FormGroup>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                                    套餐可選項目
                                </Typography>
                                {DynamicItem.map((item, index) => {
                                    // console.log(Object.values(DynamicState[item.GroupNo]).filter(v => v).length)
                                    return (
                                        <FormControl
                                            required
                                            error={Object.values(DynamicState[item.GroupNo]).filter(v => v).length !== item.ItemExplain * 1}
                                            component="fieldset"
                                            sx={{ m: 3 }}
                                            variant="standard"
                                            key={index}
                                            name={item.GroupNo}
                                            style={{ marginTop: 0 }}
                                        >
                                            <FormLabel component="legend">{item.Name}</FormLabel>
                                            <FormGroup >
                                                {item.Items.split(",").map((prop, i) => {
                                                    return (
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox checked={DynamicState[item.GroupNo][prop] || false} onChange={e => handleDynamicChecked(e, prop, item.GroupNo)} name={prop} />
                                                            }
                                                            label={"[" + prop + "] " + CheckItem.get(prop).Name}
                                                            key={i}
                                                        />)
                                                })}

                                            </FormGroup>
                                        </FormControl>
                                    )
                                })}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                                    套餐項目
                                </Typography>
                                <Paper style={{ maxHeight: 350, overflow: 'auto' }} elevation={3}>
                                    <List dense={true} >
                                        {Object.keys(ProjectItem).sort().map((item, index) => {
                                            return (
                                                <>
                                                    <ListItemButton key={index} onDoubleClick={(e) => handleMoveDeduct(e, ProjectItem[item])}>
                                                        <ListItemText
                                                            primary={
                                                                <>
                                                                    <Chip color="success" label={ProjectItem[item].CheckNo} /><>{ProjectItem[item].Name}</>
                                                                </>
                                                            }
                                                            secondary={secondary ? <Typography textAlign={'right'}>{'$ ' + PF.ccyFormat(ProjectItem[item].PublicExpense, 0)}</Typography> : null}
                                                        />
                                                    </ListItemButton>
                                                    <Divider />
                                                </>
                                            )
                                        })}

                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                                    減項項目
                                </Typography>
                                <Paper style={{ maxHeight: 350, overflow: 'auto' }} elevation={3}>
                                    <List dense={true} >
                                        {Object.keys(DeductItem).sort().map((item, index) => {
                                            return (
                                                <>
                                                    <ListItemButton key={index} onDoubleClick={(e) => handleCancelDeduct(e, DeductItem[item])}>
                                                        <ListItemText
                                                            primary={

                                                                <>
                                                                    <Chip color="error" label={DeductItem[item].CheckNo} /><>{DeductItem[item].Name}</>
                                                                </>

                                                            }
                                                            secondary={secondary ? <Typography textAlign={'right'}>{'$ ' + PF.ccyFormat(DeductItem[item].PublicExpense, 0)}</Typography> : null}
                                                        />
                                                    </ListItemButton>
                                                    <Divider />

                                                </>
                                            )
                                        })}

                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>

                    </Box >

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">放棄</Button>
                    <Button onClick={handleSave} variant="contained" disabled={Main.ProjectNo === ""}>加入</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default App;
