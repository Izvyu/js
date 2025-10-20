import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MedicalRecords from './MedicalRecords'
import reportWebVitals from './reportWebVitals';
import PurchaseRecords from './PurchaseRecords';
import StoamchRecords from './StoamchRecords';
import ProjectChangesRecords from './ProjectChangesRecords';
import Test from './Test';
import Tgid from './Tgid';
import RepairRecords from './RepairRecords';
import RepairOrderRecords from './RepairOrderRecords';
import QuotationRecords from './QuotationRecords';
import ItemlogCheckRecords from './ItemlogCheckRecords';
import EmployeeDetailRecords from './EmployeeDetailRecords';
import AttendanceRecords from './AttendanceRecords';
import SourceRecords from './SourceRecords';
import Login from './Login';
import MedRecords from './MedRecords';
import EndoScopeRecords from './EndoScopeRecords';
import QuestionReportRecords from './QuestionReportRecords';
import ReceipttimeRecords from './ReceipttimeRecords';
import Weblink from './Weblink';
import StockRecords from './StockRecords';
import GeneralStockRecords from './GeneralStockRecords';
import PickinglistRecords from './PickinglistRecords';
import Layout from './Layout';
import AnnualReportRecords from './AnnualReportRecords';
import AnnualReportlogin from './AnnualReportlogin';
import PayableRecords from './PayableRecords';
import QueryReportlogin from './QueryReportlogin';




import { BrowserRouter as Router, Route, Routes, Redirect, HashRouter } from "react-router-dom";
import { createBrowserHistory, createHashHistory } from "history";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PrivateRoute from './_Services/PrivateRoute';
import app_reducers from "./reducers/app";
import logger from "redux-logger";
import { configureStore } from '@reduxjs/toolkit'
import { Provider, useSelector, connect } from "react-redux";
import LayoutOrPage from './LayoutOrPage';






const onClickDismiss = key => () => {
  notistackRef.current.closeSnackbar(key);
}
const notistackRef = React.createRef();
const root = ReactDOM.createRoot(document.getElementById('root'));
const history = createBrowserHistory();

const rootReducer = (state = {}, action) => {
  return {
    app: app_reducers(state.app, action)
  };
};
// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, logger)));  //logger要放在最後
//不允許上一頁
window.addEventListener("popstate", () => {
  history.go(1);
});
//不允許手動修改localStorage
window.addEventListener("storage", (e) => {
  localStorage.setItem(e.key, e.oldValue)
});
const store = configureStore({
  reducer: rootReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});  //logger要放在最後




const Init=()=>{
  console.log(process.env.PUBLIC_URL)
  return(
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          ref={notistackRef}
          action={key => (
            <IconButton onClick={onClickDismiss(key)}>
              <ClearIcon />
            </IconButton>
          )} >
          <Router history={history} basename={process.env.PUBLIC_URL}>
            <Routes>
            {/* <Route element={<LayoutOrPage />}> */}
              <Route index element={<QueryReportlogin />} />
              {/* <Route path="/PurchaseRecords" element={<PurchaseRecords />} />
              <Route path="/ReceipttimeRecords" element={<ReceipttimeRecords />} />
              <Route path="/StockRecords" element={<StockRecords />} />
              <Route path="/GeneralStockRecords" element={<GeneralStockRecords />} />
              <Route path="/PickinglistRecords" element={<PickinglistRecords />} />
              <Route path="/PayableRecords" element={<PayableRecords />} /> */}
            {/* </Route> */}
            {/* <Route path="/PurchaseRecords" element={<PurchaseRecords />} /> */}
            <Route path="/" element={<PurchaseRecords />} />
            {/* <Route path="/StoamchRecords" element={<StoamchRecords />} /> */}
            <Route path="/StoamchRecords" element={<PrivateRoute><StoamchRecords /></PrivateRoute>} /> 
            {/* {`${process.env.PUBLIC_URL}` === '/PurchaseRecords' ? <Route path="/StoamchRecords" element={<PrivateRoute><StoamchRecords /></PrivateRoute>} /> : null} */}
            <Route path="/ProjectChangesRecords" element={<ProjectChangesRecords />} />
            <Route path="/RepairRecords" element={<RepairRecords />} />
            <Route path="/RepairOrderRecords" element={<RepairOrderRecords />} />
            <Route path="/QuotationRecords" element={<QuotationRecords />} />
            <Route path="/EndoScopeRecords" element={<EndoScopeRecords />} />
            <Route path="/ItemlogCheckRecords" element={<ItemlogCheckRecords />} />
            <Route path="/EmployeeDetailRecords" element={<EmployeeDetailRecords />} />
            <Route path="/AttendanceRecords" element={<AttendanceRecords />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Weblink" element={<Weblink />} />
            <Route path="/MedRecords" element={<MedRecords />} />
            <Route path="/SourceRecords" element={<SourceRecords />} />
            <Route path="/QuestionReportRecords" element={<QuestionReportRecords />} />
            {/* <Route path="/AnnualReportRecords" element={<AnnualReportRecords />} /> */}
            {/* <Route path="/ReceipttimeRecords" element={<ReceipttimeRecords />} />
            <Route path="/StockRecords" element={<StockRecords />} />
            <Route path="/GeneralStockRecords" element={<GeneralStockRecords />} /> */}
            {/* <Route path="/Tgid" element={<Tgid />} /> */}
            <Route path="/AnnualReportlogin" element={<AnnualReportlogin />} />
            <Route path="/AnnualReportRecords" element={<PrivateRoute><AnnualReportRecords /></PrivateRoute>} />
            <Route path="/QueryReportlogin" element={<QueryReportlogin />} />
            <Route path="/Tgid" element={<PrivateRoute><Tgid/></PrivateRoute>} />
            {/* {`${process.env.PUBLIC_URL}` === '/PurchaseRecords' ? <Route path="/AnnualReportRecords" element={<PrivateRoute><AnnualReportRecords /></PrivateRoute>} /> : null} */}
             
              {/* {`${process.env.PUBLIC_URL}` === '/examineAdmin' ? <Route path="/AdminLogin" element={<AdminLogin />} /> : null} */}
              {/* {`${process.env.PUBLIC_URL}` === '/examineAdmin' ? <Route path="/MinmaxQuery" element={<MinmaxQuery />} /> : null} */}
              {/* {`${process.env.PUBLIC_URL}` === '/examineAdmin' ? <Route path="/MinmaxQuery" element={<PrivateRoute><MinmaxQuery /></PrivateRoute>} /> : null} */}
            </Routes>
          </Router> 
          </SnackbarProvider>)
}
      


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Init />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
