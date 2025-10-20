import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './Layouts/Main';
import MedicalRecords from './Layouts/MedicalRecords';
// import Minmax from './Layouts/Minmax';
// import Minmax from './Layouts/MinmaxMobile';
// import MinmaxQuery from './Layouts/MinmaxQuery';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider, useSnackbar } from "notistack";
import { BrowserRouter as Router, Route, Routes, Redirect, HashRouter } from "react-router-dom";
import { Provider, useSelector, connect } from "react-redux";
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { createBrowserHistory, createHashHistory } from "history";

const root = ReactDOM.createRoot(document.getElementById('root'));
const history = createBrowserHistory();

const notistackRef = React.createRef();
const onClickDismiss = key => () => {
  notistackRef.current.closeSnackbar(key);
}
root.render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      ref={notistackRef}
      action={key => (
        <IconButton onClick={onClickDismiss(key)}>
          <ClearIcon />
        </IconButton>
      )}
    >

      <Router history={history} basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/MedicalRecords" element={<MedicalRecords />} />
          {/* <Route path="/" element={<App />} /> */}
          {/* <Route path="/Minmax" element={<Minmax />} /> */}
          {/* <Route path="/MinmaxQuery" element={<MinmaxQuery />} /> */}
        </Routes>
      </Router>
    </SnackbarProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
