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
import PurchaseReceiveReportRecords from "./PurchaseReceiveReportRecords";

const tabConfig = {
  PurchaseRecords: { label: "請購未轉採購報表", component: <PurchaseRecords /> },
  ReceipttimeRecords: { label: "收貨時間報表", component: <ReceipttimeRecords /> },
  StockRecords: { label: "庫存查詢報表", component: <StockRecords /> },
  GeneralStockRecords: { label: "總務庫存查詢報表", component: <GeneralStockRecords /> },
  PickinglistRecords: { label: "領料查詢報表", component: <PickinglistRecords /> },
  PayableRecords: { label: "應付憑單報表", component: <PayableRecords /> },
  PurchaseReceiveReportRecords: { label: "資材採購查詢報表", component: <PurchaseReceiveReportRecords /> },
};

export default function MainWithTabs() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [draggedTab, setDraggedTab] = useState(null);    // ✅ 新增
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // ✅ 拖拽排序 Handler - HTML5 原生 API
  const handleDragStart = (e, key) => {
    setDraggedTab(key);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    if (!draggedTab || draggedTab === targetKey) {
      setDraggedTab(null);
      return;
    }

    const draggedIndex = tabs.indexOf(draggedTab);
    const targetIndex = tabs.indexOf(targetKey);

    const newTabs = Array.from(tabs);
    newTabs.splice(draggedIndex, 1);
    newTabs.splice(targetIndex, 0, draggedTab);
    setTabs(newTabs);
    setDraggedTab(null);
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
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
            background: "linear-gradient(180deg, #1e3a5f 0%, #2c5aa0 100%)",
            color: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Toolbar sx={{ justifyContent: "flex-end", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
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
            sx={{ px: 2, pt: 2, pb: 1, fontWeight: "bold", color: "rgba(255,255,255,0.7)", fontSize: "12px", letterSpacing: "0.5px" }}
          />
          <ListItemButton 
            onClick={() => handleOpenTab("PurchaseRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
            <ListItemText primary="請購未轉採購報表" />
          </ListItemButton>
          <ListItemButton 
            onClick={() => handleOpenTab("ReceipttimeRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
            <ListItemText primary="收貨時間報表" />
          </ListItemButton>
          <ListItemButton 
            onClick={() => handleOpenTab("PurchaseReceiveReportRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
            <ListItemText primary="資材採購報表查詢" />
          </ListItemButton>

          <ListItemText
            primary="庫存報表"
            sx={{ px: 2, pt: 2, pb: 1, fontWeight: "bold", color: "rgba(255,255,255,0.7)", fontSize: "12px", letterSpacing: "0.5px" }}
          />
          <ListItemButton 
            onClick={() => handleOpenTab("StockRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
            <ListItemText primary="庫存查詢報表" />
          </ListItemButton>
          <ListItemButton 
            onClick={() => handleOpenTab("GeneralStockRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
            <ListItemText primary="總務庫存查詢報表" />
          </ListItemButton>
          <ListItemButton 
            onClick={() => handleOpenTab("PickinglistRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
            <ListItemText primary="領料查詢報表" />
          </ListItemButton>

          <ListItemText
            primary="應付報表"
            sx={{ px: 2, pt: 2, pb: 1, fontWeight: "bold", color: "rgba(255,255,255,0.7)", fontSize: "12px", letterSpacing: "0.5px" }}
          />
          <ListItemButton 
            onClick={() => handleOpenTab("PayableRecords")}
            sx={{
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
                paddingLeft: "24px",
              },
            }}
          >
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
            background: "linear-gradient(90deg, #0f2744 0%, #1e5a96 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
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
                sx={{ minHeight: "48px", flex: 1 }}
              >
                {tabs.map((key) => (
                  <Tab
                    key={key}
                    value={key}
                    draggable                           // ✅ 可拖拽
                    onDragStart={(e) => handleDragStart(e, key)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, key)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      color: "#fff",
                      "&.Mui-selected": { 
                        color: "#fff",
                        textShadow: "0 0 10px rgba(255,255,255,0.3)",
                        borderBottom: "2px solid #fff",
                      },
                      textTransform: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                      opacity: draggedTab === key ? 0.5 : 1,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "grab",
                      "&:active": { cursor: "grabbing" },
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "8px 8px 0 0",
                      },
                      borderRadius: "8px 8px 0 0",
                      padding: "4px 12px",
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
                fontSize: "14px",
                padding: "6px 16px",
                borderRadius: "6px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(255,59,48,0.15)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255,59,48,0.25)",
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
            backgroundColor: "#f5f7fa",
            backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e8f0f8 100%)",
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
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }
        }}
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
