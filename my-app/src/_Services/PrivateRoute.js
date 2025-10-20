import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, loginPage }) => {
  const { UserInfo } = useSelector(state => ({
    UserInfo: state.app.UserInfo,
  }));
  const location = useLocation();

  // 嘗試從 Redux 或 localStorage 取得使用者資料
  const storedUser = JSON.parse(localStorage.getItem("UserInfo"));
  const isLoggedIn = UserInfo?.PersonalId !== undefined || storedUser?.PersonalId !== undefined;

  if (!isLoggedIn) {
    let targetLogin = loginPage;

    // 沒指定時，自動判斷該導向哪個登入頁
    if (!targetLogin) {
      const path = location.pathname.toLowerCase();

      if (path.startsWith("/tgid")) {
        targetLogin = "/QueryReportlogin";
      } else if (path.startsWith("/annualreport")) {
        targetLogin = "/AnnualReportlogin";
      } else {
        targetLogin = "/login"; // 預設登入頁
      }
    }

    // 未登入 → 導向登入頁，並保留來源頁
    return <Navigate to={targetLogin} replace state={{ from: location }} />;
  }

  // 已登入 → 顯示內容
  return children;
};

export default PrivateRoute;
