import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import _, { omit, pick, round, slice } from 'lodash';
// import { useDispatch, useSelector } from "react-redux";





const PrivateRoute = ({ component: Component, ...rest }) => {
  // const { token } = useSelector(state => ({
  //     token: state.app.token,
  //   }));
  return (
    <Route {...rest} render={props => (
      sessionStorage.getItem('token')//!_.isEmpty(token)
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/Login', state: { from: props.location } }} />
    )} />)
}

export default PrivateRoute;