import React, { Component } from "react";
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';

// import App from "../App";
// import Login from "../Login";
import Questionaire66th from "../Questionaire/66th";
import Questionaire67th from "../Questionaire/67th";
import Questionaire68th from "../Questionaire/68th";
import Questionaire69th from "../Questionaire/69th";
import Questionaire70th from "../Questionaire/70th";
import Questionaire80th from "../Questionaire/80th";
import UnderConstruction from "../Questionaire/UnderConstruction";
import Nopaper from "../Questionaire/Nopaper";


class QuestionType extends Component {
  components = {
    Nopaper: Nopaper,
    66: Questionaire66th,
    67: Questionaire67th,
    68: Questionaire68th,
    69: Questionaire69th,
    70: Questionaire70th,
    80: Questionaire80th,
    // 93:Login,
  };
  render() {
    //預設UserProfile
    const TagName = this.components[this.props.tag] || UnderConstruction;
    return <TagName {...this.props} />;
  }
}
//若出現名字不一樣的Component時(EX：大小寫不一致)
const notExist = () => {


  return (
    <>
      <BuildRoundedIcon />
      <div style={{ padding: "20px" }}>該問卷尚未設置完成，請致電 04-2255-2555 #168 企業健檢人員</div>
    </>
  )
};
export default QuestionType;
