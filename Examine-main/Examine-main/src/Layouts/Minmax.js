import { createContext, useContext, Children, cloneElement, React, useState, useEffect, useRef } from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image, Svg, BlobProvider, Link, Line } from '@react-pdf/renderer';
// import MicrosoftBlack from './MicrosoftBlack.ttf';
// import MicrosoftBlack from './kaiu.ttf';
import FistPage from '../Pictures/page-front-bg.jpg';
import LastPage from '../Pictures/page-back-bg.jpg';
import LOGO from '../Pictures/logo-inner.png';
import LOGOPNG from '../Pictures/logo.png';

import Header_1 from '../Pictures/page-1-header.jpg';
import Header_2 from '../Pictures/page-2-header.jpg';
import Header_3 from '../Pictures/page-3-header.jpg';
import Header_4 from '../Pictures/page-4-header.jpg';
import Header_5 from '../Pictures/page-5-header.jpg';
import Males from '../Pictures/males.png';
import { Table, TableBody, TableHeader, TableCell, DataTableCell } from '@david.kucsai/react-pdf-table';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Stamp from '../Pictures/stamp.jpg';
import PF from "../_Services/publicFunction";
import Qs from "qs";
import _, { omit, pick } from 'lodash'
import Noto from '../Pictures/NotoSansTC-Regular.otf';
import NotoBold from '../Pictures/NotoSansTC-Bold.otf';
import { color } from "@mui/system";

// //註冊中文：微軟正黑體
// Font.register({
//     family: 'MicrosoftBlack',
//     src: MicrosoftBlack,
// });


Font.register({
    family: 'Noto',
    fonts: [
        {
            src: Noto,
        },
        {
            src: NotoBold,
            fontWeight: 'bold',
        },
        //   {
        //     src: 'https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf',
        //     fontWeight: 'normal',
        //     fontStyle: 'italic',
        //   },
    ],
});
//中文自動換行
Font.registerHyphenationCallback((word) =>
    Array.from(word).flatMap((char) => [char, ''])
)

const Context = createContext();

export function ProvidePageReferences({ children }) {
    // use ref so we don't create a new map every render
    const ref = useRef();
    if (!ref.current) {
        ref.current = new Map();
    }
    return <Context.Provider value={ref.current}>{children}</Context.Provider>;
}

export function usePageReferences() {
    return useContext(Context);
}

// use this as a component in the react-pdf document tree
export function PageReference({ id }) {
    const references = usePageReferences();
    return references && id ? (
        <View
            wrap={false}
            render={({ pageNumber }) => {
                references.set(id, pageNumber);
            }}
        />
    ) : null;
}
function Toc({ items, subItems }) {
    const references = usePageReferences();
    // console.log(subItems)
    return (
        <View style={[styles.section, { marginTop: 0 }]} >
            {items.map((item, index) => {
                const { id, title } = item;
                return (
                    <View>
                        <View key={index} style={[styles.row, { padding: 10, borderTop: index !== 0 ? "2 solid #dcdcdc" : "" }]} >
                            <Link src={`#${id}`} style={{ color: "#ff8b3c", textDecoration: 'none' }}>
                                <Text>0{index + 1} {title}</Text>
                            </Link>
                            <View style={styles.line} />
                            <Text src={`#${id}`}
                                render={() => {
                                    const page = references.get(id);
                                    return page == null ? '##' : String(page);
                                }}
                            />
                        </View>
                        {subItems[id]?.length > 0 ? subItems[id].map((prop, i) => {
                            const { id2, title2 } = prop;
                            // console.log(id2);
                            // 
                            return (
                                <View key={i} style={[styles.row, { fontSize: 12, paddingLeft: 10, paddingRight: 10 }]}>
                                    <Link src={`#${id2}`} style={{ color: "#000000", textDecoration: 'none', paddingLeft: 40 }}>
                                        <Text>{title2}</Text>
                                    </Link>
                                    <View style={styles.line2} />
                                    <Text src={`#${id2}`}
                                        style={{ fontSize: 18 }}
                                        render={() => {
                                            const page = references.get(id2);
                                            return page == null ? '##' : String(page);
                                        }}
                                    />
                                </View>
                            )

                        }) : null}
                    </View>
                );
            })}
        </View>
    );
}

// function genItems(count) {
//     const items = [];
//     for (let i = 0; i < count; i++) {
//         items.push({
//             id: `item-${i}`,
//             title: `Item ${i}`,
//         });
//     }
//     return items;
// }

// function ItemContent({ item, break: pageBreak }) {
//     const { id, title } = item;
//     return (
//         <View break={pageBreak} >
//             <Text id={id}>{title}</Text>
//             <PageReference id={id} />
//             <Text
//                 render={({ pageNumber, totalPages }) =>
//                     `${pageNumber} / ${totalPages}`
//                 }
//             />
//         </View>
//     );
// }

// function newPage(chance) {
//     return Math.random() < chance;
// }
// Create styles
const styles = StyleSheet.create({

    page: {
        // flexDirection: 'row',
        fontFamily: 'Noto',
        backgroundColor: 'white',
        // paddingBottom: 0
        borderColor: '#22618F',
        borderWidth: 0,
        paddingBottom: 50

    },
    section: {
        margin: 10,
        padding: 10,
        // flex: 1,
        // maxWidth: 1050
        // flexGrow: 1,
    },
    imgHeader: {
        width: 130,
        padding: 20
    },
    imgTitle: {
        // padding: 0,
        // left: 0,
        // margin: 0,
        position: 'absolute', zIndex: -1, top: 0, width: '100%'
    },
    txtHeader: {
        paddingBottom: 50,
    },
    txtNo1: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#ff8b3c",
    },
    txtNo2: {
        fontSize: 20,
        fontWeight: "bold"
    },
    txtTitle: {
        paddingTop: 0,
        top: 0,
        paddingLeft: 45,
        paddingBottom: 50,

    }
    ,
    header: {
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        // backgroundColor: '#3f51b5',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
        color: '#FFFFFF',
        opacity: 0.6,
        fontWeight: "bold"
    },
    header01: {
        padding: 5,
        paddingLeft: 5,
        paddingTop: 20,
        borderLeft: '1px solid #dcdcdc',
        fontSize: 8,

    },
    //尾部頁碼
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    table: {
        // display: "table",
        // width: "auto",
        // borderStyle: "solid",
        // borderWidth: 1,
        // borderRightWidth: 0,
        // borderBottomWidth: 0
    },
    tableRow: {
        // margin: "auto",
        // flexDirection: "row"
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    },
    TableBorder: {
        padding: 5,
        textAlign: "left",
        fontSize: 8,
        borderWidth: 0,
        borderTopWidth: 0,

    }, column: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
    },
    line: {
        flexGrow: 1,
        borderBottomStyle: 'dotted',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        marginHorizontal: 2,
        height: 11,
    },
    line2: {
        flexGrow: 1,
        borderBottomStyle: 'dashed solid',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        marginHorizontal: 2,
        height: 11,
    },
    txtOverView: {
        fontSize: 12, paddingTop: 10,
        width: 350, textAlign: 'left',
        paddingLeft: 50
    },
    txtOverView2: {
        fontSize: 12, paddingTop: 10,
        width: 130, textAlign: 'left'
    },
    txtOverView3: {
        fontSize: 12, paddingTop: 10,
        width: 200, textAlign: 'left'
    },
    // page: {
    //     textAlign: 'right',
    //     textOverflow: 'hidden',
    // },
});


// const TableContext = createContext({});
const ContentHeader = props => {

    const { Profile } = props;

    return (
        <View style={styles.header} fixed>
            <Image src={LOGOPNG} style={styles.imgHeader}></Image>
            <View style={styles.header01} >
                <Text>姓名: {Profile.UserName}</Text>
                <Text>性別: {Profile.sex}</Text>
            </View>
            <View style={styles.header01} >
                <Text>生日: {Profile.birthday}</Text>
                <Text>年齡: {Profile.age}</Text>
            </View>
            <View style={styles.header01} >
                <Text>身分證字號: {Profile.PersonalId}</Text>
                <Text>手機: {Profile.sogi}</Text>
            </View>
            <View style={styles.header01} >
                <Text>體檢日期: {Profile.checkdate}</Text>
                <Text>體檢編號: {Profile.chart}</Text>
            </View>
        </View>
    )
}
// const Table = ({ children, sizes }) => (
//     <TableContext.Provider value={{ sizes }}>
//         <View style={{ borderBottom: 1, borderRight: 1 }}>{children}</View>
//     </TableContext.Provider>
// );

// const Row = ({ children }) => {
//     const { sizes } = useContext(TableContext);
//     if (!sizes) throw Error("add sizes prop to Table component");
//     return (
//         <View style={{ flexDirection: "row" }}>
//             {Children.map(children, (child, index) =>
//                 cloneElement(child, { size: sizes[index] })
//             )}
//         </View>
//     );
// };

// const Cell = ({ children, size }) => (
//     <View
//         style={{
//             padding: "5 10",
//             flex: `0 0 ${size}%`,
//             borderTop: 1,
//             borderLeft: 1,
//         }}
//     >
//         <Text>{children}</Text>
//     </View>
// );
// Create Document Component


const MyDocument = (props) => {
    const { items, Profile, Array03, Array04, Array06, Array05, PicObj, Array02, subItems } = props;
    // console.log(Array05)
    // console.log(PF.multiFilter(Array02, { system_name: ['頭頸部與心血管系統'] }))

    // console.log(Array05)
    // console.log(PF.multiFilter(Array04, { CheckCategory: ['血液檢查'] }))

    const PicCategoryArray = ["超音波檢查", "數位斷層合成掃描", '胸部能量減影',
        , "一般X光"
        , "三連片"
        , "內視鏡"
        , "身體組成分析"
        , "心電圖"
        , "自律神經檢查"
        , "眼底攝影"];

    const ErrItem = ['7008', '7010', '7012', '7013', '7014', '7015', '7016', '7023', '7028', '7029', '7030', '7058', '7070', '7076', '7092'];    //二欄式錯誤清單
    const FirstPageInfo = ['2008', '2031', '2013'];
    let ErrArray02_1 = Array02.filter(x => !ErrItem.includes(x.ItemNo));
    // console.log(Array04)

    const Description = {
        7091: "骨質疏鬆症是世界衛生組織認定的全球重要疾病，骨鬆可能造成骨折進而影響生活自理能力與生活品質，積極的骨鬆防治可以降低骨折風險。本院採用中軸型雙能量X光吸收儀（DXA）為骨質密度檢測之黃金標準。利用雙能量X光吸收儀（DXA）掃描身體骨質較易流失的中軸部位骨頭，也是最易發生骨鬆性骨折的腰椎或髖關節之骨質密度。",
        7060: "人體的體重由四大要素組成，身體總水重、蛋白質、礦物質、體脂肪。各成分間需維持一定的比率，以確保健康，反之，則可能產生各種病癥，如：脂肪過多而肥胖、蛋白質不足而營養不良、身體總水量過低、細胞內水份流失會導致老化、礦物質流失可能骨質疏鬆。",
        7008: "心臟疾病診斷及治療中最基本檢查之一，它除了可能表現心臟結構功能異常，優於聽診器辨別心跳，可以檢測出心律不整、心房心室肥厚或心肌缺氧、狹心症、肺動脈栓塞，甚至心肌梗塞。",
        7042: "心率變異分析（縮寫為HRV），是一種量測連續心跳速率變化程度的方法。因為心臟除了本身的節律性放 電引發的跳動之外，也受到自律神經系統的影響。調節我們的心率、血壓、呼吸和消化，它被分為兩大部分：交感神經和副交感神經系統，所以HRV目前除了被廣泛運用在心臟相關的疾病醫療上，也同時是檢視自律神經系統的重要指標。",
        7041: "藉由紅外線直接檢測手指末梢微血管循環與彈性狀況，測量其血液循環時速率變異，分析檢測波形再 轉換成數據，將血管彈性分為七等級，進而評估血管彈性、老化、心臟血管、腦部血管、周邊血管之疾病風險。",
        7023: "眼底檢查可以看到視網膜的色澤、視網膜的血管、黃斑部的顏色、以及視神經乳頭的形狀、顏色、乳頭凹陷的情形。最重要的意義是檢測出眼底(視網膜、脈絡膜、視神經乳頭)是否有病變，如:視網膜剝離、黃斑部病變、青光眼、視神經炎、脈絡膜腫瘤等。眼睛是全身唯一可以透過肉眼就觀察到血管的地方，因此，在臨床上有許多案例是在眼底檢查中才發現患者還有全身性的疾病，像是高血壓、糖尿病、自體免疫疾病等。",
        7029: "利用內視鏡檢查病人的結腸內可能的病兆(如潰瘍性結 腸炎、出血源、瘜肉、阻塞等情形)，可評估病灶的外表性徵，必要時，醫師能夠在觀察的同時施行組織切片分析，以進一步檢查。確定安排檢查後，醫護人員會向您解釋治療目的、過程及應配合事項後，安排檢查時間，並由病人或家屬簽署檢查治療同意書。",
        7030: "胃鏡除了胃部，還能夠察看是否有食道癌、胃潰瘍、十二指腸潰瘍、逆流性食道炎等。",
        7054: "X光管球以不同的角度旋轉拍攝二至四張影像並自動合成，分為全脊椎攝影及下肢攝影。全脊椎攝影可檢查頸椎、胸椎及腰椎是否有側彎、骨刺等。下肢攝影可檢查長短腳、骨盆左右傾斜等。",
        7033: "X光檢查是一種簡單快速可以初步判斷受檢部位是否有明顯異常的檢查項目，以胸腔X光為例，如肺炎、肺結核、肺氣腫、肺積水、氣胸等肺部病變，常可見其典型的影像呈現，是一種迅速又無痛的檢查方式。其他常見應用於診斷脊椎側彎、骨刺、鈣化、結石等。",
        7014: "可檢查甲狀腺是否有病變，如：腫大、結節或鈣化等。",
        7011: "可檢查攝護腺及膀胱是否有病變，如：囊腫、鈣化、良性攝護腺肥大等。",
        7010: "可檢查肝臟、膽囊、胰臟、脾臟、腎臟等器官是否有病變，如：脂肪肝、囊腫、血管瘤、瘜肉、膽結石或腎臟結石或腫塊等。",
        7049: "胸部雙能量減影透過高低能量之X光技術，將骨頭及軟組織分離，避免病灶被遮蔽，較容易判斷肺部病灶位置。",
        7012: "可檢查乳房是否有病變，如：纖維囊腫、腺瘤、腫瘤或腋下淋巴結腫大等。",
        7013: "骨盆腔超音波稱婦科超音波，可檢查子宮、卵巢等器官是否有病變，如：囊腫、子宮肌瘤、子宮內膜增厚、腫塊等。",
        7015: "可檢查頸總動脈及內頸動脈、外頸動脈血管內部是否有病變，如：鈣化、斑塊或動脈內膜-中層厚度(IMT)增厚等。",
        7016: "可觀察心臟腔室的大小、心室的收縮與舒張功能、心肌有無受損、瓣膜異常的種類及嚴重程度、肺高壓、腔室內血流的異常與心包膜疾病。 適應症: 1.心雜音 2.瓣膜狹窄與逆流 3.心包膜疾病 4.冠狀動脈疾病 5.心臟腫塊 6.肺高壓。",
        7021: "骨質疏鬆症是世界衛生組織認定的全球重要疾病，骨鬆可能造成骨折進而影響生活自理能力與生活品質，積極的骨鬆防治可以降低骨折風險。本院採用中軸型雙能量X光吸收儀（DXA）為骨質密度檢測之黃金標準。利用雙能量X光吸收儀（DXA）掃描身體骨質較易流失的中軸部位骨頭，也是最易發生骨鬆性骨折的腰椎或髖關節之骨質密度。",
    }


    // const CategoryArray04 = ["尿液常規檢查", "血液檢查", "生化檢查", "腫瘤標記", "甲狀腺檢查"]
    const CategoryArray04 = [
        { id2: "0401", title2: "尿液常規檢查" },
        { id2: "0402", title2: "血液檢查" },
        { id2: "0403", title2: "生化檢查" },
        { id2: "0404", title2: "腫瘤標記" },
        { id2: "0405", title2: "甲狀腺檢查" },
        { id2: "0406", title2: "血清免疫檢查" },
        { id2: "0407", title2: "賀爾蒙檢查" },
        { id2: "0408", title2: "基因檢查" },
        { id2: "0409", title2: "功能醫學" },

    ];
    const CategoryArray05 = [
        { id2: "0501", title2: "超音波檢查" },
        { id2: "0502", title2: "數位斷層合成掃描" },
        { id2: "0503", title2: "一般X光" },
        { id2: "0504", title2: "三連片" },
        { id2: "0505", title2: "內視鏡" },
        { id2: "0506", title2: "身體組成分析" },
        { id2: "0507", title2: "心電圖" },
        { id2: "0508", title2: "自律神經檢查" },
        { id2: "0509", title2: "眼底攝影" },
        { id2: "0510", title2: "胸部能量減影" },
    ];

    // console.log(7041PicObj)
    return (
        < >
            <Page size="A4" style={styles.page} key={"01"}>
                <PageReference id={'01'} />

                <ContentHeader Profile={Profile} />
                <View style={styles.txtHeader} id={'01'} >
                    <Image src={Header_1} style={styles.imgTitle} ></Image>
                </View>
                <View style={styles.txtTitle}>
                    <Text style={styles.txtNo1}>01</Text>
                    <Text style={styles.txtNo2}>基本資料</Text>
                    <Text>Basic Assessment</Text>
                </View>
                <View style={styles.section}>
                    <Text>個人基本資料</Text>
                    <Table
                        style={{ padding: 0 }}
                        data={[
                            { firstName: "姓名", lastName: Profile.UserName, dob: "身份證字號", country: Profile.PersonalId },
                            { firstName: "出生年月日", lastName: Profile.birthday, dob: "體檢號", country: Profile.chart },
                            { firstName: "年齡", lastName: Profile.age, dob: "體檢日期", country: Profile.checkdate },
                            { firstName: "性別", lastName: Profile.sex, dob: "", country: "" }
                        ]}
                    >
                        <TableHeader textAlign={"center"}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                            style={{ borderBottom: "2pt solid #a76f1f" }}
                        >

                        </TableHeader>
                        <TableBody
                            style={{ borderBottom: "1pt solid #a76f1f", borderTop: "1 solid #a76f1f" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <DataTableCell getContent={(r) => r.firstName} style={{ fontSize: 14, backgroundColor: "#e1deeb", textAlign: "center", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />
                            <DataTableCell getContent={(r) => r.lastName} style={{ fontSize: 14, backgroundColor: "#f8f7fa", justifyContent: "center", paddingLeft: 10, padding: 10, borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />
                            <DataTableCell getContent={(r) => r.dob.toLocaleString()} style={{ fontSize: 14, backgroundColor: "#e1deeb", textAlign: "center", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />
                            <DataTableCell getContent={(r) => r.country} style={{ fontSize: 14, backgroundColor: "#f8f7fa", justifyContent: "center", paddingLeft: 10, borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />

                        </TableBody>
                    </Table>

                </View>
                <View style={styles.section}>
                    <Text style={{ fontWeight: 900, fontSize: 20 }} >問診資訊</Text>
                    <Table
                        style={{ padding: 0 }}
                        data={PF.multiFilter(Array03, { ItemNo: FirstPageInfo })}
                    >
                        <TableHeader textAlign={"center"}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                            style={{ borderBottom: "2pt solid #a76f1f" }}
                        >
                        </TableHeader>
                        <TableBody
                            style={{ borderBottom: "1pt solid #a76f1f", borderTop: "1 solid #a76f1f" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <DataTableCell getContent={(r) => r.ItemName} weighting={0.3}
                                style={{ fontSize: 12, backgroundColor: "#e1deeb", textAlign: "center", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />
                            <DataTableCell getContent={(r) => r.Value} style={{ fontSize: 12, backgroundColor: "#f8f7fa", justifyContent: "center", paddingLeft: 10, padding: 10, borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />

                        </TableBody>
                    </Table>

                </View>
                <View style={{
                    width: 90, height: 50, left: 450
                }}><Image src={Stamp} /></View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => {

                    return (
                        `${'01.基本資料'} ${pageNumber} / ${totalPages}`
                    )
                }
                } fixed />
            </Page>
            <Page size="A4" style={styles.page} wrap key={"02"}>
                <PageReference id={'02'} />
                <ContentHeader Profile={Profile} />
                <View style={styles.txtHeader} id={'02'}>
                    <Image src={Header_2} style={styles.imgTitle} ></Image>
                </View>
                <View style={styles.txtTitle} >
                    <Text style={styles.txtNo1}>02</Text>
                    <Text style={styles.txtNo2}>異常清單&建議事項</Text>
                    <Text>Abnormality List & Suggestions</Text>
                </View>

                <View style={styles.section}>
                    <Text style={{ fontSize: 12 }}>
                        總評醫師綜合所有檢驗數據及影像檢查結果，為您詳細列出本次健檢所發現的異常項目，提供完整的異常清單及建議事項。
                    </Text>
                </View>
                <View style={styles.section} >
                    <Table
                        data={ErrArray02_1.length > 0 ? ErrArray02_1 : [{ ItemName: "無", Ref: "-", Suggest: "-", Value: "-" }]}
                    >
                        <TableHeader
                            style={{ borderWidth: 0, padding: 10, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034", border: "2 solid #619034", backgroundColor: "#e1f1d4" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.25}>
                                項目
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.2}>
                                數值
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.25}>
                                參考值
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.3}>
                                建議事項
                            </TableCell>
                        </TableHeader>
                        <TableBody
                            style={{ borderBottom: "1pt solid #a76f1f", borderTop: "1 solid #a76f1f" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <DataTableCell getContent={(r) => r.ItemName} weighting={0.25} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#f2f8f0", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} />
                            <DataTableCell getContent={
                                (r) => (
                                    <Text style={{ color: r.Err === 'true' ? 'red' : '' }}>
                                        {r.Value.replaceAll("\r\n", "\n")}
                                    </Text>
                                )

                            }
                                weighting={0.2}
                                style={{ fontSize: 14, backgroundColor: "#f2f8f0", justifyContent: "center", paddingLeft: 10, padding: 10, borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }}
                            >
                            </DataTableCell>
                            <DataTableCell getContent={(r) => r.Ref} weighting={0.25} style={{ fontSize: 14, backgroundColor: "#f2f8f0", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} />
                            <DataTableCell getContent={(r) => r.Suggest} weighting={0.3} style={{ fontSize: 14, backgroundColor: "#f2f8f0", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} />
                        </TableBody>
                    </Table>
                </View>
                {PF.multiFilter(Array02, { ItemNo: ErrItem }).length > 0 ? <View style={styles.section} break={true}>
                    <Table
                        data={PF.multiFilter(Array02, { ItemNo: ErrItem })}
                    >
                        <TableHeader
                            style={{ borderWidth: 0, padding: 10, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034", border: "2 solid #619034", backgroundColor: "#e1f1d4" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.4}>
                                項目
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.6}>
                                數值
                            </TableCell>
                        </TableHeader>
                        <TableBody
                            style={{ borderBottom: "1pt solid #a76f1f", borderTop: "1 solid #a76f1f" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <DataTableCell getContent={(r) => r.ItemName} weighting={0.4} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#f2f8f0", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} />
                            <DataTableCell getContent={
                                (r) => (
                                    <Text style={{ color: r.Err === 'true' ? 'red' : '' }}>
                                        {r.Value.replaceAll("\r\n", "\n")}
                                    </Text>
                                )

                            }
                                weighting={0.6}
                                style={{ fontSize: 14, backgroundColor: "#f2f8f0", justifyContent: "center", paddingLeft: 10, padding: 10, borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }}
                            >
                            </DataTableCell>
                        </TableBody>
                    </Table>
                </View> : null}

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => {
                    return (
                        `${'02.異常清單&建議事項'} ${pageNumber} / ${totalPages}`
                    )
                }} fixed />
            </Page >
            <Page size="A4" style={styles.page} wrap >
                <PageReference id={'03'} />

                <ContentHeader Profile={Profile} />
                <View style={styles.txtHeader} id={'03'}>
                    <Image src={Header_3} style={styles.imgTitle} ></Image>
                </View>
                <View style={styles.txtTitle} >
                    <Text style={styles.txtNo1}>03</Text>
                    <Text style={styles.txtNo2}>理學檢查</Text>
                    <Text>Physical Examination</Text>
                </View>

                <View style={styles.section} >
                    <View style={styles.row} id={"0301"}>
                        <Text>一般體格</Text>
                        <View style={styles.line} />
                    </View>
                    <PageReference id={'0301'} />

                    <Table
                        data={PF.multiFilter(Array03, { CheckCategory: ['一般體格'] })}
                    >
                        <TableHeader
                            style={{ borderWidth: 0, padding: 5 }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.4}>
                                項目
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.2}>
                                數值
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.4}>
                                參考值
                            </TableCell>

                        </TableHeader>

                        <TableBody
                            style={{ borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <DataTableCell getContent={(r) => r.ItemName} weighting={0.4} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#ebf4fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} />
                            <DataTableCell getContent={
                                (r) => (
                                    <Text style={{ color: r.err === 1 ? 'red' : '' }}>
                                        {r.Value.replaceAll("\r\n", "\n")}
                                    </Text>
                                )
                            }
                                weighting={0.2}
                                style={{ fontSize: 14, backgroundColor: "#ebf4fa", justifyContent: "center", paddingLeft: 10, padding: 0, borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                            >
                            </DataTableCell>
                            <DataTableCell getContent={(r) => r.Ref} weighting={0.4} style={{ fontSize: 14, backgroundColor: "#ebf4fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} />

                        </TableBody>
                    </Table>
                </View>
                <View style={styles.section} break={true}>
                    <View style={styles.row} id={"0302"}>
                        <Text>醫生問診</Text>
                        <View style={styles.line} />
                    </View>
                    <PageReference id={'0302'} />

                    <Table
                        data={PF.multiFilter(Array03, { CheckCategory: ['醫生問診'] })}
                    >
                        <TableHeader
                            style={{ borderWidth: 0, padding: 5 }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.4}>
                                項目
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.2}>
                                數值
                            </TableCell>
                            <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.4}>
                                參考值
                            </TableCell>

                        </TableHeader>

                        <TableBody
                            style={{ borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                            includeBottomBorder={false}
                            includeTopBorder={false}
                            includeRightBorder={false}
                            includeLeftBorder={false}
                        >
                            <DataTableCell getContent={(r) => r.ItemName} weighting={0.4} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#ebf4fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} />
                            <DataTableCell getContent={
                                (r) => (
                                    <Text style={{ color: r.err === 1 ? 'red' : '' }}>
                                        {r.Value.replaceAll("\r\n", "\n")}
                                    </Text>
                                )
                            }
                                weighting={0.2}
                                style={{ fontSize: 14, backgroundColor: "#ebf4fa", justifyContent: "center", paddingLeft: 10, padding: 0, borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                            >
                            </DataTableCell>
                            <DataTableCell getContent={(r) => r.Ref} weighting={0.4} style={{ fontSize: 14, backgroundColor: "#ebf4fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} />

                        </TableBody>
                    </Table>
                </View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => {
                    return (
                        `${'03.理學檢查'} ${pageNumber} / ${totalPages}`
                    )
                }} fixed />
            </Page>


            {Array04.length > 0 ? (<Page size="A4" style={styles.page} wrap key={"04"}>
                <PageReference id={'04'} />
                <ContentHeader Profile={Profile} />
                <View style={styles.txtHeader} id={'04'}>
                    <Image src={Header_4} style={styles.imgTitle} ></Image>
                </View>
                <View style={styles.txtTitle} >
                    <Text style={styles.txtNo1}>0{items.findIndex(x => x.id === '04') + 1}</Text>
                    <Text style={styles.txtNo2}>檢驗</Text>
                    <Text>Examine</Text>
                </View>
                {CategoryArray04.map((item, i) => {
                    // console.log(item)
                    return (
                        PF.multiFilter(Array04, { CheckCategory: [item.title2] }).length > 0 ?
                            <View style={styles.section} break={i === 0 ? false : true} >
                                <View style={styles.row} id={item.id2}>
                                    <Text>{item.title2}</Text>
                                    <View style={styles.line} />
                                </View>
                                <PageReference id={item.id2} />
                                <Table
                                    data={PF.multiFilter(Array04, { CheckCategory: [item.title2] })}
                                >
                                    <TableHeader
                                        style={{ borderWidth: 0, padding: 10 }}
                                        includeBottomBorder={false}
                                        includeTopBorder={false}
                                        includeRightBorder={false}
                                        includeLeftBorder={false}
                                    >
                                        <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#e1deeb", borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} weighting={0.3}>
                                            項目
                                        </TableCell>
                                        <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#e1deeb", borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} weighting={0.3}>
                                            數值
                                        </TableCell>
                                        <TableCell style={{ borderWidth: 0, padding: 5, backgroundColor: "#e1deeb", borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} weighting={0.4}>
                                            參考值
                                        </TableCell>
                                    </TableHeader>
                                    <TableBody
                                        style={{ borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                                        includeBottomBorder={false}
                                        includeTopBorder={false}
                                        includeRightBorder={false}
                                        includeLeftBorder={false}
                                    >
                                        <DataTableCell getContent={(r) => r.ItemName} weighting={0.3} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#f8f7fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />
                                        <DataTableCell getContent={
                                            (r) => (
                                                <Text style={{ color: r.Err === "true" ? 'red' : '' }}>
                                                    {r.Value.replaceAll("\r\n", "\n")}
                                                </Text>
                                            )
                                        }
                                            weighting={0.3}
                                            style={{ fontSize: 14, backgroundColor: "#f8f7fa", justifyContent: "center", paddingLeft: 10, padding: 5, borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }}
                                        >
                                        </DataTableCell>
                                        <DataTableCell getContent={(r) => r.Ref} weighting={0.4} style={{ fontSize: 14, backgroundColor: "#f8f7fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #8a80b0", borderTop: "1 solid #8a80b0" }} />
                                    </TableBody>
                                </Table>
                            </View> : null)
                })}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => {
                    let no = items.findIndex(x => x.id === '04');
                    return (
                        `${'0'}${no + 1}${'.檢驗'} ${pageNumber} / ${totalPages}`
                    )
                }} fixed />
            </Page>) : null}

            <Page size="A4" style={styles.page} wrap key={"05"}>
                <PageReference id={'05'} />

                <ContentHeader Profile={Profile} />
                <View style={styles.txtHeader} id={'05'}>
                    <Image src={Header_5} style={styles.imgTitle} ></Image>
                </View>
                <View style={styles.txtTitle} >
                    <Text style={styles.txtNo1}>0{items.findIndex(x => x.id === '05') + 1}</Text>
                    <Text style={styles.txtNo2}>影像檢查</Text>
                    <Text>Image Study</Text>
                </View>
                {PicCategoryArray.map((item, index) => {
                    if (Array05[item]?.length > 0) {
                        return (
                            <>
                                <View key={index} style={styles.section} break={index === 0 ? false : true}>
                                    <View style={styles.row} id={CategoryArray05.filter(x => x.title2 === item)[0].id2}>
                                        <Text>{item}</Text>
                                        <View style={styles.line} />
                                    </View>
                                    <PageReference id={CategoryArray05.filter(x => x.title2 === item)[0].id2} />

                                    {Array05[item].map((i, no) => {
                                        // console.log(i.ItemNo, i.ItemName)
                                        // console.log(PicObj["pic_" + i.ItemNo])

                                        return (
                                            <>
                                                <View key={no} style={styles.section} break={no === 0 ? false : true}>
                                                    <View style={[styles.row, { borderLeft: "2pt solid #8a80b0" }]}>
                                                        <Text style={{ paddingLeft: 5 }}>{i.ItemName}</Text>

                                                    </View>
                                                    <View style={{ fontSize: 12, paddingTop: 10, paddingBottom: 5 }}>
                                                        <Text>{Description[i.ItemNo]}</Text>
                                                    </View>

                                                    <Table
                                                        data={[{ ItemName: i.ItemName, Value: i.Value, Err: i.Err }]}
                                                    >
                                                        <TableHeader
                                                            style={{ borderWidth: 0, padding: 10 }}
                                                            includeBottomBorder={false}
                                                            includeTopBorder={false}
                                                            includeRightBorder={false}
                                                            includeLeftBorder={false}
                                                        >
                                                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.4}>
                                                                項目
                                                            </TableCell>
                                                            <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#d2e6f5", borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} weighting={0.6}>
                                                                判讀結果
                                                            </TableCell>
                                                        </TableHeader>

                                                        <TableBody
                                                            style={{ borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                                                            includeBottomBorder={false}
                                                            includeTopBorder={false}
                                                            includeRightBorder={false}
                                                            includeLeftBorder={false}
                                                        >
                                                            <DataTableCell getContent={(r) => r.ItemName} weighting={0.4} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#ebf4fa", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }} />
                                                            <DataTableCell getContent={
                                                                (r) => (
                                                                    <Text style={{ color: r.Err === 'true' ? 'red' : '' }}>
                                                                        {r.Value.replaceAll("\r\n", "\n")}
                                                                    </Text>
                                                                )
                                                            }
                                                                weighting={0.6}
                                                                style={{ fontSize: 14, backgroundColor: "#ebf4fa", justifyContent: "center", paddingLeft: 10, padding: 10, borderWidth: 0, borderBottom: "1pt solid #3d93d2", borderTop: "1 solid #3d93d2" }}
                                                            >
                                                            </DataTableCell>

                                                        </TableBody>
                                                    </Table>

                                                </View>
                                                <View key={no} style={styles.section} break={true}>

                                                    {PicObj["pic_" + i.ItemNo]?.map((img, imgIndex) => {
                                                        let count = PicObj["pic_" + i.ItemNo]
                                                        if (count.length <= 2) {
                                                            return (
                                                                // <Image style={{ height: '630', width: '100%' }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures" + decodeURI(img)}></Image>


                                                                i.ItemNo === "7023" ? <View style={{ height: '330', width: "450", padding: 1 }} >
                                                                    <Image style={{ width: 'auto', height: 'auto' }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures" + decodeURI(img) + '?Height=330'} />
                                                                </View> : <View style={{ height: '650', width: '500' }}>
                                                                    <Image style={{ width: 'auto', height: 'auto' }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures" + decodeURI(img) + '?Width=1000'} />
                                                                </View>)
                                                        } else if (count.length > 2) {
                                                            // console.log(decodeURI(img))
                                                            if (imgIndex % 2 === 0) {
                                                                return (
                                                                    <View style={styles.row}>
                                                                        <Image style={{ height: 200, width: 250, padding: 2 }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures" + decodeURI(PicObj["pic_" + i.ItemNo][imgIndex]) + '?Width=1000'}></Image>
                                                                        {PicObj["pic_" + i.ItemNo][imgIndex + 1] !== undefined ? <Image style={{ height: 200, width: 250, padding: 2 }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures" + decodeURI(PicObj["pic_" + i.ItemNo][imgIndex + 1]) + '?Width=1000'}></Image> : null}
                                                                    </View>
                                                                )

                                                            }




                                                        }



                                                    })}

                                                </View>
                                            </>
                                        )
                                    })}

                                </View>
                            </>

                        )

                    }
                })}

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => {
                    let no = items.findIndex(x => x.id === '05');
                    return (
                        `${'0'}${no + 1}${'.影像檢查'} ${pageNumber} / ${totalPages}`
                    )
                }} fixed />
            </Page>
            {
                Array06.length > 0 ?
                    <Page size="A4" style={styles.page} wrap key={"06"}>
                        <PageReference id={'06'} />
                        <ContentHeader Profile={Profile} />
                        <View style={styles.txtHeader} id={'06'}>
                            <Image src={Header_2} style={styles.imgTitle} ></Image>
                        </View>
                        <View style={styles.txtTitle} >
                            <Text style={styles.txtNo1}>0{items.findIndex(x => x.id === '06') + 1}</Text>
                            <Text style={styles.txtNo2}>其他檢查</Text>
                            <Text>Other Examination</Text>
                        </View>
                        <View style={styles.section}>

                            <View style={styles.row}>
                                <Text style={{ fontWeight: "bold" }}>肺功能檢查</Text>
                                <View style={styles.line} />
                            </View>
                        </View>
                        <View style={styles.section}>
                            <Text style={{ fontSize: 12 }}>
                                肺功能檢查是最方便、快速、安全又無侵襲性的檢查，可了解是否有呼吸道阻塞情形，肺活量有無異常，肺泡與微血管氣體交換的能力等，能協助醫師診斷及鑑別疾病、評估肺部疾病的嚴重度、評估病程進展及治療後的反應。                    </Text>
                        </View>
                        <View style={styles.section} >

                            <Table
                                data={Array06}
                            >
                                <TableHeader
                                    style={{ borderWidth: 0, padding: 10, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034", border: "2 solid #619034", backgroundColor: "#e1f1d4" }}
                                    includeBottomBorder={false}
                                    includeTopBorder={false}
                                    includeRightBorder={false}
                                    includeLeftBorder={false}
                                >
                                    <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.3}>
                                        項目
                                    </TableCell>
                                    <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.3}>
                                        數值
                                    </TableCell>
                                    <TableCell style={{ borderWidth: 0, padding: 10, backgroundColor: "#e1f1d4", borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} weighting={0.4}>
                                        參考值
                                    </TableCell>

                                </TableHeader>
                                <TableBody
                                    style={{ borderBottom: "1pt solid #a76f1f", borderTop: "1 solid #a76f1f" }}
                                    includeBottomBorder={false}
                                    includeTopBorder={false}
                                    includeRightBorder={false}
                                    includeLeftBorder={false}
                                >
                                    <DataTableCell getContent={(r) => r.ItemName} weighting={0.3} style={{ fontSize: 14, paddingLeft: 10, backgroundColor: "#f2f8f0", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} />
                                    <DataTableCell getContent={
                                        (r) => (
                                            <Text style={{ color: r.Err === "true" ? 'red' : '' }}>
                                                {r.Value.replaceAll("\r\n", "\n")}
                                            </Text>
                                        )

                                    }
                                        weighting={0.3}
                                        style={{ fontSize: 14, backgroundColor: "#f2f8f0", justifyContent: "center", paddingLeft: 10, padding: 10, borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }}
                                    >
                                    </DataTableCell>
                                    <DataTableCell getContent={(r) => r.Ref} weighting={0.4} style={{ fontSize: 14, backgroundColor: "#f2f8f0", justifyContent: "center", borderWidth: 0, borderBottom: "1pt solid #619034", borderTop: "1 solid #619034" }} />

                                </TableBody>
                            </Table>
                        </View>

                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => {
                            let no = items.findIndex(x => x.id === '06');
                            return (
                                `${'0'}${no + 1}${'.其他檢查'} ${pageNumber} / ${totalPages}`
                            )
                        }} fixed />
                    </Page >
                    : null
            }

        </ >

    )
};



const App = (props) => {
    // const items = genItems(50);
    const { Array02, items, Profile, Array03, Array04, Array06, GaugeItem, PicObj, Array02_1, Array02_2, subItems } = props;

    // const getBarcodeGaugeItem = (BarCodeStr) => {
    //     PF.instance({
    //         method: "post",
    //         url: PF.url2 + "/Minmax/GetGaugeData",
    //         data: Qs.stringify({ Action: "none", parameter: { BarCodeStr } })
    //         // headers: { token: sessionStorage.token }
    //     })
    //         .then(function (response) {
    //             // alert("完成")
    //             const { TotalRecord, rows } = response.data;
    //             if (TotalRecord > 0) {
    //                 // console.log(rows);
    //                 let ContentJson = JSON.parse(rows[0]["content"]);
    //                 // console.log(ContentJson);
    //                 setArray03(PF.multiFilter(ContentJson, { CheckCategory: ['一般體格', '醫生問診'] }))

    //                 setArray06(PF.multiFilter(ContentJson, { CheckCategory: ['肺功能檢查'] }))
    //                 setArray02_1(PF.multiFilter(ContentJson, { Err: ['true'] }))

    //                 // setArray02(prev => [...Array02, ...PF.multiFilter(ContentJson, { Err: ['true'] })])
    //                 // arr02 = [...arr02, ...PF.multiFilter(ContentJson, { Err: ['true'] })]

    //                 // let Array03 = PF.multiFilter(ContentJson, { CheckCategory: ['醫生問診'] });
    //                 // console.log(ContentJson);
    //                 // console.log(PF.multiFilter(ContentJson, { Err: ['true'] }))

    //                 let ItemArray = PF.multiFilter(ContentJson, { CheckCategory: PicCategoryArray });
    //                 // console.log(ItemArray);
    //                 let object = _.keyBy(ItemArray, 'CheckCategory');
    //                 // console.log(object);
    //                 let y = {}
    //                 Object.keys(object).map(CheckCategory => {
    //                     y[CheckCategory] = PF.multiFilter(ContentJson, { CheckCategory: CheckCategory })
    //                 })
    //                 // console.log(y);
    //                 setGaugeItem(y)
    //             }
    //             else {
    //             }
    //         })
    // }
    // const getBarcodeLabItem = (BarCodeStr) => {
    //     PF.instance({
    //         method: "post",
    //         url: PF.url2 + "/Minmax/GetLabData",
    //         data: Qs.stringify({ Action: "none", parameter: { BarCodeStr } })
    //         // headers: { token: sessionStorage.token }
    //     })
    //         .then(function (response) {
    //             // alert("完成")
    //             const { TotalRecord, rows } = response.data;
    //             if (TotalRecord > 0) {
    //                 // console.log(rows);
    //                 let ContentJson = JSON.parse(rows[0]["content"]);
    //                 // console.log(PF.multiFilter(ContentJson, { Err: ['true'] }))
    //                 setArray02(prev => [...Array02, ...PF.multiFilter(ContentJson, { Err: ['true'] })])
    //                 // setArray02(prev => prev.concat(PF.multiFilter(ContentJson, { Err: ['true'] })))
    //                 setArray02_2(PF.multiFilter(ContentJson, { Err: ['true'] }))

    //                 // console.log(ContentJson);
    //                 setArray04(ContentJson)
    //             }
    //             else {
    //             }
    //         })
    // }
    // const getBarcode = (qc_id) => {
    //     PF.instance({
    //         method: "post",
    //         url: PF.url2 + "/Minmax/QueryBarcode",
    //         data: Qs.stringify({ Action: "none", parameter: { qc_id } })
    //         // headers: { token: sessionStorage.token }
    //     })
    //         .then(function (response) {
    //             // alert("完成")
    //             const { TotalRecord, rows } = response.data;
    //             if (TotalRecord > 0) {
    //                 const people = rows[0]
    //                 // console.log(rows);
    //                 setProfile({
    //                     age: people.age,
    //                     PersonalId: people.PersonalId,
    //                     UserName: people.UserName,
    //                     sogi: people.sogi,
    //                     checkdate: people.checkdate,
    //                     chart: people.chart,
    //                     barcode: people.barcode,
    //                     sex: people.sex || ' 男',
    //                     birthday: people.birthday || '1900/01/01'
    //                 })
    //                 //解析圖片為JSON物件
    //                 let PicJson = JSON.parse(rows[0]["pic"]);
    //                 // console.log(PicJson);

    //                 Object.keys(PicJson || {}).map(pic => {
    //                     // console.log(pic)
    //                     setPicObj(prev => ({
    //                         ...prev,
    //                         [pic]: PicJson[pic]?.split(',') || []
    //                     }))
    //                 });


    //             }
    //             else {
    //             }
    //         })
    // }
    // const getFullData = (BarCodeStr) => {
    //     PF.instance({
    //         method: "post",
    //         url: PF.url2 + "/Minmax/GetFullData",
    //         data: Qs.stringify({ Action: "none", parameter: { BarCodeStr } })
    //         // headers: { token: sessionStorage.token }
    //     })
    //         .then(function (response) {
    //             // alert("完成")
    //             const { TotalRecord, Profile, LabData, GaugeData } = response.data;
    //             if (TotalRecord > 0) {
    //                 const people = Profile[0]
    //                 // console.log(rows);
    //                 setProfile({
    //                     age: people.age,
    //                     PersonalId: people.PersonalId,
    //                     UserName: people.UserName,
    //                     sogi: people.sogi,
    //                     checkdate: people.checkdate,
    //                     chart: people.chart,
    //                     barcode: people.barcode,
    //                     sex: people.sex || ' 男',
    //                     birthday: people.birthday || '1900/01/01'
    //                 })
    //                 //解析圖片為JSON物件
    //                 let PicJson = JSON.parse(Profile[0]["pic"]);
    //                 // console.log(PicJson);

    //                 Object.keys(PicJson || {}).map(pic => {
    //                     // console.log(pic)
    //                     setPicObj(prev => ({
    //                         ...prev,
    //                         [pic]: PicJson[pic]?.split(',') || []
    //                     }))
    //                 });
    //                 //Lab
    //                 let ContentJson = JSON.parse(LabData[0]["content"]);
    //                 // console.log(PF.multiFilter(ContentJson, { Err: ['true'] }))
    //                 setArray02(prev => [...prev, ...ContentJson.filter(x => x.Err === 'true')])
    //                 // setArray02(prev => prev.concat(PF.multiFilter(ContentJson, { Err: ['true'] })))
    //                 setArray02_2(PF.multiFilter(ContentJson, { Err: ['true'] }))

    //                 // console.log(ContentJson);
    //                 setArray04(ContentJson)

    //                 if (ContentJson.length > 0) {
    //                     setitems(prev => [...prev, { id: '04', title: ' - 檢驗', data: ContentJson }])
    //                 }
    //                 //Gauge


    //                 let ContentJson2 = JSON.parse(GaugeData[0]["content"]);
    //                 // console.log(ContentJson);
    //                 setArray03(PF.multiFilter(ContentJson2, { CheckCategory: ['一般體格', '醫生問診'] }))
    //                 // setArray02_1(PF.multiFilter(ContentJson2, { Err: ['true'] }))
    //                 setArray02(prev => [...prev, ...ContentJson2.filter(x => x.Err === 'true')])

    //                 // setArray02(prev => [...Array02, ...PF.multiFilter(ContentJson, { Err: ['true'] })])
    //                 // arr02 = [...arr02, ...PF.multiFilter(ContentJson, { Err: ['true'] })]

    //                 // let Array03 = PF.multiFilter(ContentJson, { CheckCategory: ['醫生問診'] });
    //                 // console.log(ContentJson);
    //                 // console.log(PF.multiFilter(ContentJson, { Err: ['true'] }))

    //                 let ItemArray = PF.multiFilter(ContentJson2, { CheckCategory: PicCategoryArray });
    //                 // console.log(ItemArray);
    //                 let object = _.keyBy(ItemArray, 'CheckCategory');
    //                 // console.log(object);
    //                 let y = {}
    //                 Object.keys(object).map(CheckCategory => {
    //                     y[CheckCategory] = PF.multiFilter(ContentJson2, { CheckCategory: CheckCategory })
    //                 })
    //                 // console.log(y);
    //                 setGaugeItem(y)
    //                 if (Object.keys(y).length > 0) {
    //                     setitems(prev => [...prev, { id: '05', title: ' - 影像檢查', data: y }])

    //                 }
    //                 let array6 = PF.multiFilter(ContentJson2, { CheckCategory: ['肺功能檢查'] })
    //                 setArray06(array6)

    //                 if (array6.length > 0) {
    //                     setitems(prev => [...prev, { id: '06', title: ' - 其他檢查', data: array6 }])
    //                 }





    //             }
    //             else {
    //             }
    //         })
    // }

    // useEffect(() => {
    //     // getBarcode('51004');
    //     // getBarcodeGaugeItem('2200046510');
    //     // getBarcodeLabItem('2200046510');
    //     getFullData('2200046510');
    // }, [])


    let overviewChart = {
        A1: Array02.filter(x => x.system_name === '神經系統'),
        A2: Array02.filter(x => x.system_name === '一般體格'),
        B1: Array02.filter(x => x.system_name === '頭頸部與心血管系統'),
        B2: Array02.filter(x => x.system_name === '血液'),
        C1: Array02.filter(x => x.system_name === '胸腔與呼吸系統'),
        C2: Array02.filter(x => x.system_name === '免疫系統'),
        D1: Array02.filter(x => x.system_name === '腹部與肝膽腸胃系統'),
        D2: Array02.filter(x => x.system_name === '重金屬檢查'),
        E1: Array02.filter(x => x.system_name === '泌尿生殖系統'),
        E2: Array02.filter(x => x.system_name === '基因檢查'),
        F1: Array02.filter(x => x.system_name === '肌肉骨骼系統'),
        F2: Array02.filter(x => x.system_name === '新陳代謝'),
        G2: Array02.filter(x => x.system_name === '醫生問診'),

    }

    return (
        <Document
        >
            <ProvidePageReferences>
                <Page size="A4" style={styles.page} >
                    <Image src={FistPage}></Image>
                </Page>
                {/* <Page size="A4" style={styles.page}>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>神經系統</Text>
                                <View style={styles.line} />
                            </View>
                            <Text>0項異常</Text>

                        </View>
                        <View style={styles.txtOverView2}>
                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>一般體格</Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>頭頸部與心血管系統</Text>
                                <View style={styles.line} />
                            </View>
                            <Text>0項異常</Text>

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>血液</Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>胸腔與呼吸系統</Text>
                                <View style={styles.line} />
                            </View>
                            <Text>0項異常</Text>

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>免疫系統</Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>腹部與肝膽腸胃系統</Text>
                                <View style={styles.line} />
                            </View>
                            <Text>0項異常</Text>

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>重金屬檢查</Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>泌尿生殖系統
                                </Text>
                                <View style={styles.line} />
                            </View>
                            <Text>0項異常</Text>

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>基因檢查
                                </Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>肌肉骨骼系統

                                </Text>
                                <View style={styles.line} />
                            </View>
                            <Text>0項異常</Text>

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>新陳代謝

                                </Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>

                                </Text>
                            </View>
                            <Text></Text>

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>醫生問診</Text>
                            </View>
                            <Text>0項異常</Text>

                        </View>
                    </View>
                </Page> */}
                <Page size="A4" style={styles.page}>
                    <View style={[styles.section,]}>

                        <View style={{
                            display: 'flex',
                            flexDirection: "row",
                            justifyContent: "center",
                        }}>
                            <View style={{ padding: 20, width: 210, fontWeight: 900, textAlign: 'center' }}>
                                <Text style={{ fontSize: 15 }} >系統總覽</Text>
                                <Text style={{ fontSize: 12 }} >System Overview</Text>
                            </View>

                            <View style={{
                                width: 600, justifyContent: "center", height: 80, padding: 20,
                            }}>
                                <Text style={{ fontSize: 12, paddingLeft: 10, borderLeft: "1pt solid #8a80b0" }}>以器官系統性的分類，顯示異常項目的數量與嚴重度，以幫助您對自已的身體健康狀態，有完整的了解。</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.section, {
                        backgroundColor: "#F8F8F8", justifyContent: "center", display: 'flex', flexDirection: "row", borderRadius: 10,
                        position: 'absolute', zIndex: -1, top: 100, width: '100%'

                    }]}>
                        <Image style={{ width: 230, height: 550, paddingTop: 30 }} src={Males} />
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        paddingTop: 30
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>神經系統</Text>
                                <View style={styles.line} />
                            </View>
                            {overviewChart.A1.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.A1.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}

                        </View>
                        <View style={styles.txtOverView2}>
                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>一般體格</Text>
                            </View>
                            {overviewChart.A2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.A2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>頭頸部與心血管系統</Text>
                                <View style={styles.line} />
                            </View>
                            {overviewChart.B1.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.B1.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                        <View style={styles.txtOverView2}>


                        </View>
                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>血液</Text>
                            </View>
                            {overviewChart.B2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.B2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>胸腔與呼吸系統</Text>
                                <View style={styles.line} />
                            </View>
                            {overviewChart.C1.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.C1.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>免疫系統</Text>
                            </View>
                            {overviewChart.C2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.C2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>腹部與肝膽腸胃系統</Text>
                                <View style={styles.line} />
                            </View>
                            {overviewChart.D1.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.D1.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>重金屬檢查</Text>
                            </View>
                            {overviewChart.D2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.D2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                    </View>

                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        paddingTop: 30
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>泌尿生殖系統
                                </Text>
                                <View style={styles.line} />
                            </View>
                            {overviewChart.E1.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.E1.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>基因檢查
                                </Text>
                            </View>
                            {overviewChart.E2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.E2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>肌肉骨骼系統

                                </Text>
                            </View>
                            {overviewChart.F1.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.F1.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}

                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>新陳代謝

                                </Text>
                            </View>
                            {overviewChart.F2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.F2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}

                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>

                        <View style={styles.txtOverView}>
                            <View style={[styles.row, { fontWeight: 700 }]}>

                            </View>


                        </View>
                        <View style={styles.txtOverView2}>


                        </View>

                        <View style={styles.txtOverView3}>
                            <View style={[styles.row, { fontWeight: 700 }]}>
                                <Text>醫生問診</Text>
                            </View>
                            {overviewChart.G2.length > 0 ? (<Text style={{ color: 'red' }}>{overviewChart.G2.length}項異常</Text>
                            ) : (<Text>0項異常</Text>
                            )}
                        </View>
                    </View>
                </Page>
                {/* <Page size="A4" style={styles.page} wrap>
                    <View style={styles.section}>
                        <View style={styles.row}>

                            <Image style={{ width: 250, height: 200, padding: 1 }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures/Content/Upload/images/111.5/0508/L123532327_賴冠宏/page-1.jpg"}></Image>
                            <Image style={{ width: 250, height: 200, padding: 1 }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures/Content/Upload/images/111.5/0508/L123532327_賴冠宏/page-1.jpg"}></Image>
                        </View>
                        <View style={styles.row}>

                            <Image style={{ width: 250, height: 200, padding: 1 }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures/Content/Upload/images/111.5/0508/L123532327_賴冠宏/page-1.jpg"}></Image>
                            <Image style={{ width: 250, height: 200, padding: 1 }} src={"http://mj.mornjoy.com.tw/Examinenetcore/pictures/Content/Upload/images/111.5/0508/L123532327_賴冠宏/page-1.jpg"}></Image>
                        </View>

                    </View>
                </Page> */}
                <Page size="A4" style={styles.page}>
                    <View style={[styles.section, { marginBottom: 0 }]} >
                        <Text style={{ fontSize: 30, borderBottom: '5 solid #dcdcdc', padding: 10 }}>目錄</Text>
                    </View>
                    <Toc items={items} subItems={subItems} />
                </Page>
                {/* <Page size="A4" style={styles.page}>
                    {items.map((item, index) => {
                        return (
                            <ItemContent
                                key={index}
                                item={item}
                                break={newPage(0.2)}
                            />
                        );
                    })}
                </Page> */}
                <MyDocument items={items} Profile={Profile} Array03={Array03} Array04={Array04} Array06={Array06} Array05={GaugeItem} PicObj={PicObj} Array02={[...Array02_1, ...Array02_2]} />
                <Page size="A4" style={styles.page}>
                    <Image src={LastPage}></Image>
                </Page>
            </ProvidePageReferences>
        </Document >
    )
};




export default App;