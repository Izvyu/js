import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Grid, Checkbox, FormGroup, FormControlLabel, Chip, Paper, FormControl, FormLabel, TextField, Button, Select, MenuItem, Input, InputLabel, IconButton, InputAdornment } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import _, { omit, pick } from 'lodash'
import PF from "../_Services/publicFunction";
import { useSnackbar } from "notistack";
import Qs from "qs";
import NumberFormat from 'react-number-format';

import { injectIntl, intlShape, useIntl, FormattedMessage } from 'react-intl';
import CommentIcon from '@mui/icons-material/Comment';
import { FixedSizeList } from 'react-window';
import CancelIcon from '@mui/icons-material/Clear';


const SingleItem = props => {
    const { open, setSingleOpen, checked, setChecked, CheckItem, setPersonItem, PersonItem } = props
    const [txt, setTxt] = React.useState("")
    const [CheckItemAry, setCheckItemAry] = React.useState(Array.from(CheckItem.values()))

    const [SelectItemAry, setSelectItemAry] = React.useState([])

    // let CheckItemAry = Array.from(CheckItem.values());
    // console.log(Array.from(CheckItem.values()))
    // setCheckItemAry(Array.from(CheckItem.values()))
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        // console.log(value)
        // console.log(currentIndex)
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            //若沒有則新增SelectItemAry
            setSelectItemAry([...SelectItemAry, CheckItem.get(value)])

        } else {
            newChecked.splice(currentIndex, 1);
            //若有則刪除SelectItemAry
            let x = _.remove(SelectItemAry, item => item.CheckNo !== value)
            setSelectItemAry(x)
        }

        setChecked(newChecked);
    };
    const handleCancelItem = CheckNo => {
        // console.log(CheckNo);

        const currentIndex = checked.indexOf(CheckNo);
        const newChecked = [...checked];
        if (currentIndex > 0) {
            newChecked.splice(currentIndex, 1);
            //若有則刪除SelectItemAry
            let x = _.remove(SelectItemAry, item => item.CheckNo !== CheckNo)
            setSelectItemAry(x)
            setChecked(newChecked);
        }

    }

    const handleClose = () => {
        setSingleOpen(false);   //關閉彈窗
        setChecked([]);         //清除所選
        setTxt("");             //清除搜尋
        setSelectItemAry([]);
    }

    const handleSave = () => {
        // console.log(PersonItem)
        let x = SelectItemAry.map(item => {
            if (PersonItem.findIndex(p => p.ItemNo === item.CheckNo) < 0) {
                return {
                    AutoInc: null, BarCodeStr: null,
                    Name: item.Name, TypeName: "加做", Type: 2, SchemeNo: null, CategoryNo: null,
                    ItemNo: item.CheckNo,
                    OtherItems: null,
                    PersonPrice: item.PublicExpense, DecItems: null
                }
            }
        });
        let y = _.remove(x, item => item !== undefined)
        // console.log(y)
        setPersonItem(prev => {
            return [...prev, ...y]
        })

        handleClose()
    }
    React.useEffect(() => {
        //初始化設定
        setCheckItemAry(Array.from(CheckItem.values()))
    }, [open])

    function renderRow(prop) {
        const { index, style } = prop;
        let item = CheckItemAry[index];
        return (
            <>
                <ListItem style={style} key={item.CheckNo} component="div" disablePadding>
                    <ListItemButton onClick={handleToggle(item.CheckNo)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.indexOf(item.CheckNo) !== -1}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemText primary={<><Chip color="success" label={item.CheckNo} /></>} />

                        </ListItemIcon>
                        <ListItemText primary={item.Name} />
                        <Typography variant="body2" color="text.secondary" textAlign="right" >{PF.ccyFormat(item.PublicExpense, 0)}</Typography>


                    </ListItemButton>
                </ListItem>
            </>
        );
    }
    const handleTxtChange = event => {
        const { value } = event.target;
        if (!_.isEmpty(value)) {
            setCheckItemAry(Array.from(CheckItem.values()).filter(item => item.CheckNo.includes(value) || item.Name.includes(value)));
            setTxt(value)
        } else {
            setCheckItemAry(Array.from(CheckItem.values()))
            setTxt("")
        }
    }
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl">
            <DialogTitle id="scroll-dialog-title">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }} >
                            <Typography variant="subtitle1" component="div" textAlign={'left'}>加項選擇</Typography>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">快速查詢</InputLabel>
                                <Input
                                    // type={values.showPassword ? 'text' : 'password'}
                                    value={txt}
                                    onChange={handleTxtChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    setTxt("");
                                                    setCheckItemAry(Array.from(CheckItem.values()));
                                                }}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>


                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 }, }} >
                            <TextField key={"選中加項數量"} label={"選中加項數量"} variant="filled" color="primary" style={{ width: 150 }} focused value={checked.length} />
                        </Box>

                    </Grid>
                </Grid>

            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <List sx={{ pt: 0 }}>
                            <FixedSizeList
                                height={400}
                                width={600}
                                itemSize={46}
                                itemCount={CheckItemAry.length}
                                overscanCount={5}
                            >
                                {renderRow}
                            </FixedSizeList>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper style={{ maxHeight: 400, width: 600, overflow: 'auto' }} elevation={3}>
                            <List sx={{ pt: 0 }}>
                                {SelectItemAry.map((item, index) => {
                                    return (
                                        <ListItem key={item.CheckNo} component="div" disablePadding>
                                            <ListItemButton onDoubleClick={event => handleCancelItem(item.CheckNo)}>
                                                <ListItemIcon>
                                                    <ListItemText primary={<><Chip color="primary" label={item.CheckNo} /></>} />
                                                </ListItemIcon>
                                                <ListItemText primary={item.Name} />
                                                <Typography variant="body2" color="text.secondary" textAlign="right" >{PF.ccyFormat(item.PublicExpense, 0)}</Typography>
                                            </ListItemButton>
                                        </ListItem>

                                    )
                                })}
                            </List>
                        </Paper>

                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained">放棄</Button>
                <Button onClick={handleSave} variant="contained" disabled={checked.length === 0}>加入</Button>
            </DialogActions>

        </Dialog >
    )

}
export default SingleItem;