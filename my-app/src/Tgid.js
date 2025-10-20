import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";              // ✅ 新增
import { actions } from "./reducers/app";               // ✅ 新增

import PurchaseRecords from "./PurchaseRecords";
import ReceipttimeRecords from "./ReceipttimeRecords";
import StockRecords from "./StockRecords";
import GeneralStockRecords from "./GeneralStockRecords";
import PickinglistRecords from "./PickinglistRecords";
import PayableRecords from "./PayableRecords";

const tabConfig = {
  PurchaseRecords: { label: "請購未轉採購報表", component: <PurchaseRecords /> },
  ReceipttimeRecords: { label: "收貨時間報表", component: <ReceipttimeRecords /> },
  StockRecords: { label: "庫存查詢報表", component: <StockRecords /> },
  GeneralStockRecords: { label: "總務庫存查詢報表", component: <GeneralStockRecords /> },
  PickinglistRecords: { label: "領料查詢報表", component: <PickinglistRecords /> },
  PayableRecords: { label: "應付憑單報表", component: <PayableRecords /> },
};

export default function MainWithTabs() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();                       // ✅ 新增

  const drawerWidth = 220;
  const tabHeight = 48;

  const handleOpenTab = (key) => {
    if (!tabs.includes(key)) {
      setTabs([...tabs, key]);
    }
    setActiveTab(key);
    if (isSmallScreen) setDrawerOpen(false);
  };

  const handleCloseTab = (key) => {
    const newTabs = tabs.filter((k) => k !== key);
    setTabs(newTabs);
    if (key === activeTab && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  };

  // ✅ 登出動作（含 Redux 重設）
  const confirmLogout = () => {
    // 清除 Redux 狀態
    dispatch(actions.UserInfo({}));
    dispatch(actions.TOKEN_SET(""));

    // 清除本地儲存
    localStorage.removeItem("token");
    localStorage.removeItem("UserInfo");

    // 關閉對話框 + 導回登入頁
    setLogoutDialogOpen(false);
    navigate("/QueryReportlogin", { replace: true });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Drawer 側邊選單 */}
      <Drawer
        variant={isSmallScreen ? "temporary" : "persistent"}
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #61c2eb, #8ebdeb)",
            color: "#fff",
          },
        }}
      >
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          {!isSmallScreen && (
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        <List>
          <ListItemText
            primary="採購報表"
            sx={{ px: 2, pt: 1, fontWeight: "bold", color: "#000" }}
          />
          <ListItemButton onClick={() => handleOpenTab("PurchaseRecords")}>
            <ListItemText primary="請購未轉採購報表" />
          </ListItemButton>
          <ListItemButton onClick={() => handleOpenTab("ReceipttimeRecords")}>
            <ListItemText primary="收貨時間報表" />
          </ListItemButton>

          <ListItemText
            primary="庫存報表"
            sx={{ px: 2, pt: 2, fontWeight: "bold", color: "#000" }}
          />
          <ListItemButton onClick={() => handleOpenTab("StockRecords")}>
            <ListItemText primary="庫存查詢報表" />
          </ListItemButton>
          <ListItemButton onClick={() => handleOpenTab("GeneralStockRecords")}>
            <ListItemText primary="總務庫存查詢報表" />
          </ListItemButton>
          <ListItemButton onClick={() => handleOpenTab("PickinglistRecords")}>
            <ListItemText primary="領料查詢報表" />
          </ListItemButton>

          <ListItemText
            primary="應付報表"
            sx={{ px: 2, pt: 2, fontWeight: "bold", color: "#000" }}
          />
          <ListItemButton onClick={() => handleOpenTab("PayableRecords")}>
            <ListItemText primary="應付憑單查詢報表" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* 主內容區 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s",
          display: "flex",
          flexDirection: "column",
          width:
            drawerOpen && !isSmallScreen
              ? `calc(100% - ${drawerWidth}px)`
              : "100%",
          marginLeft: drawerOpen && !isSmallScreen ? 0 : `${-drawerWidth}px`,
        }}
      >
        {/* 上方 AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            marginLeft: drawerOpen && !isSmallScreen ? `${drawerWidth}px` : 0,
            width:
              drawerOpen && !isSmallScreen
                ? `calc(100% - ${drawerWidth}px)`
                : "100%",
            transition: "all 0.3s",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              minHeight: "48px",
              px: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              {(!drawerOpen || isSmallScreen) && (
                <IconButton
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ minHeight: "48px" }}
              >
                {tabs.map((key) => (
                  <Tab
                    key={key}
                    value={key}
                    sx={{
                      color: "#fff",
                      "&.Mui-selected": { color: "#fff" },
                      textTransform: "none",
                      fontSize: "13px",
                    }}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title={tabConfig[key]?.label} arrow>
                          <span>{tabConfig[key]?.label}</span>
                        </Tooltip>
                        <IconButton
                          size="small"
                          sx={{ ml: 1, color: "#fff" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseTab(key);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Box>

            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => setLogoutDialogOpen(true)}
              sx={{
                ml: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              登出
            </Button>
          </Toolbar>
        </AppBar>

        {/* 內容區 */}
        <Box
          sx={{
            marginTop: "48px",
            flexGrow: 1,
            overflow: "auto",
            padding: 2,
            backgroundColor: "#fff",
          }}
        >
          {tabs.map((key) => (
            <Box key={key} sx={{ display: key === activeTab ? "block" : "none" }}>
              {tabConfig[key]?.component}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ✅ 登出確認對話框 */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>登出確認</DialogTitle>
        <DialogContent>
          <Typography>確定要登出系統嗎？</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="inherit">
            取消
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            確定登出
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
