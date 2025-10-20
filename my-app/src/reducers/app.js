//語系檔
import React from "react";
import messagesMap from "../i18n/index";
import { v4 } from "uuid";
// import ComponentType from "../_Services/index";
// import PF from "/_Services/publicFunction";
import { omit, pick } from 'lodash'
export const APP_types = {
  token: "APP/token",
  language: "APP/language",
  userInfo: "APP/userInfo"
};

const Types = {
  LANG_SET: "LANG_SET",
  THEME_SET: "THEME_SET",
  USER_SET: "USER_SET",
  QUESTS_SET: "QUESTS_SET",
  TAB_ADD: "TAB_ADD",
  TAB_REMOVE: "TAB_REMOVE",
  TAB_REMOVEAll: "TAB_REMOVEAll",
  TAB_REMOVEOthers: "TAB_REMOVEOthers",
  TAB_EDIT: "TAB_EDIT",
  TABLIST_SET: "TABLIST_SET",
  TOKEN_SET: "TOKEN_SET"
};

//action
export const actions = {
  TOKEN_SET: token => ({ type: Types.TOKEN_SET, token }),
  LANG_SET: locale => {
    return {
      type: Types.LANG_SET,
      locale: locale
    }
  },
  THEME_SET: theme => {
    return {
      type: Types.THEME_SET,
      theme: theme.theme
    }
  },
  UserInfo: user => ({
    type: Types.USER_SET,
    UserName: user.UserName,
    CustName: user.CustName,
    PersonalId: user.PersonalId,
    BirthDate: user.BirthDate,
    BarCodeStr: user.BarCodeStr,
    Email: user.Email,

  }),
  QUESTS_SET: rows => ({
    type: Types.QUESTS_SET, rows
  }),
  TAB_EDIT: tab => ({
    type: Types.TAB_EDIT,
    key: tab.key,
    isEditing: tab.editing,
  }),
  TAB_ADD: tab => ({
    type: Types.TAB_ADD,
    key: v4(),
    isEditing: false,   //
    done: false,
    isSubmit: false,
    tabName: tab.funcName || "unknow",
    componentName: tab.componentName,
    // tabContent: (
    //   <ComponentType 
    //     tag={tab.componentName} 
    //     // auth={tab.auth} 
    //           />
    // )
  }),
  TAB_REMOVE: key => ({
    type: Types.TAB_REMOVE,
    key
  }),
  TAB_REMOVEOthers: key => ({
    type: Types.TAB_REMOVEOthers,
    key
  }),
  TAB_REMOVEAll: key => ({
    type: Types.TAB_REMOVEAll,
  })
};
//暫時沒有initialState
//reducers
// const appReducers = (state = {}, action) => {
//   switch (action.type) {
//     case APP_types.token:
//       return { state };
//     case APP_types.language:
//       return { state };
//     default:
//       return state;
//   }
// };
const initialState = {
  token: "",
  UserInfo: {},
  tabList: {},
  dark: false,
  questionaireList: [],
  isAllDone: false,
  i18n: { locale: "zh-tw", messages: messagesMap["zh-tw"] } //預設語系
};
const appReducers = (state = initialState, action) => {
  switch (action.type) {
    //app.i18n
    case Types.LANG_SET:
      return {
        ...state,
        i18n: {
          locale: action.locale,
          messages: messagesMap[action.locale],
        }
      };
    case Types.THEME_SET:
      return {
        ...state,
        dark: action.theme
      };
    //app.UserInfo
    case Types.USER_SET:
      return {
        ...state,
        UserInfo: {
          UserName: action.UserName,
          CustName: action.CustName,
          PersonalId: action.PersonalId,
          BirthDate: action.BirthDate,
          BarCodeStr: action.BarCodeStr,
          Email: action.Email,
        }
      };
    //app.token
    case Types.TOKEN_SET:
      return {
        ...state,
        token: action.token
      };
    case Types.QUESTS_SET:
      return {
        ...state,
        questionaireList: action.rows
      };
    //app.tabList
    case Types.TAB_ADD:
      return {
        ...state,
        tabList: { ...state.tabList, [action.componentName]: tab({}, action) }
      };
    case Types.TAB_EDIT:
      return {
        ...state,
        tabList: {
          ...state.tabList,
          [action.key]: { ...state.tabList[action.key], isEditing: action.isEditing }
        }
      };
    case Types.TAB_REMOVE:
      return {
        ...state,
        tabList: omit(state.tabList, action.key)
      }    //default
    case Types.TAB_REMOVEOthers:
      // let cloneState = PF.deepClone(state);
      // console.log(_.pick(obj, ['x', 'y']));
      // Object.keys(cloneState.tabList).forEach((item)=>{ delete cloneState.tabList[action.key] })
      return {
        ...state,
        tabList: pick(state.tabList, [action.key, "homepage"])
      }
    case Types.TAB_REMOVEAll:
      // let cloneState = PF.deepClone(state);
      // console.log(_.pick(obj, ['x', 'y']));
      // Object.keys(cloneState.tabList).forEach((item)=>{ delete cloneState.tabList[action.key] })
      return {
        ...state,
        tabList: { ...state.tabList.homepage }
      }
    default:
      return state;
  }
};

export const tab = (state, action) => {
  switch (action.type) {
    case Types.TAB_ADD:
      return {
        key: action.key,
        isEditing: action.isEditing,
        tabName: action.tabName,
        componentName: action.componentName,
        tabContent: action.tabContent
      };
    case Types.TAB_EDIT:
      return state.key !== action.key
        ? state
        : {
          ...state,
          editing: action.editing
        };
    default:
      return state;
  }
};

// export const tabList = (state, action) => {
//   switch (action.type) {
//     case Types.TAB_ADD:
//       return [...state, action[key]:{tab({}, action)}];

//     case Types.TAB_EDIT:
//       return state.map(item => {
//         return tab(item, action);
//       });
//     case Types.TAB_REMOVE:
//       return state.filter(item => item.id !== action.id);
//     default:
//       return state;
//   }
// };

export default appReducers;
