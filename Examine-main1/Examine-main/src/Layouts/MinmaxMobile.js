import MyDocument from './Minmax';
import { isMobile } from 'react-device-detect';
import { createContext, useContext, Children, cloneElement, React, useState, useEffect, useRef } from "react";

import { saveAs } from "file-saver";
import { PDFDownloadLink, PDFViewer, pdf, BlobProvider, usePDF } from '@react-pdf/renderer';
// import { Button } from 'antd';
// const reactPdf = require('react-pdf/dist/esm/entry.webpack5')
// const { Document, Page } = reactPdf

// import { Document, Page, pdfjs } from 'react-pdf/dist/esm/index.webpack5';
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry";
import { Button, Paper, Typography, CircularProgress, Box } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import IconButton from '@mui/material/IconButton';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;// import { Document, Page, setOptions, pdfjs } from 'react-pdf';
// import url from "pdfjs-dist/build/pdf.worker";

// pdfjs.GlobalWorkerOptions.workerSrc = url;

const Loading = () => {

    return (
        <Paper elevation={3} style={{ height: 300 }}>

            <Typography>下載中，請稍候</Typography>

            <Box style={{ padding: 20 }}>
                <CircularProgress />
            </Box>
        </Paper>)
}

// const pdfjs = require('pdfjs-dist');
// pdfjs.PDFJS. = '/js/pdf.worker.js'
// import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
const App = (props) => {

    const { Array02, items, Profile, Array03, Array04, Array06, GaugeItem, PicObj, Array02_1, Array02_2, subItems, seturl } = props;

    // const generatePDFDocument = async () => {
    //     const blob = await pdf(
    //         <MyDocument />
    //     ).toBlob();

    //     console.log(blob);

    //     saveAs(blob, "pageName");
    // };

    // const generatePdfDocument = async (MyDocument, fileName) => {
    //     const blob = await pdf((
    //         <MyDocument
    //             title='My PDF'
    //         // pdfDocumentData={MyDocument}
    //         />
    //     )).toBlob();
    //     saveAs(blob, fileName);
    // };
    // const blob = pdf((
    //     <MyDocument
    //         title='My PDF'
    //     // pdfDocumentData={MyDocument}
    //     />
    // )).toBlob();
    // // const [numPages, setNumPages] = useState(null);
    // const [pdfString, setPdfString] = useState('');
    // const [numPages, setNumPages] = useState(null);
    // const [pdfString, setPdfString] = useState('');
    // const [numPages, setNumPages] = useState(null);
    // const [pageNumber, setPageNumber] = useState(1);

    // const onDocumentLoadSuccess = ({ numPages }) => {
    //     setNumPages(numPages);
    // };

    // let base64String;

    // let reader = new FileReader();
    // reader.readAsDataURL(blob);
    // reader.onloadend = () => {
    //     base64String = reader.result;
    //     setPdfString(base64String.substr(base64String.indexOf(',') + 1));
    // };
    // return (
    //     <div>
    //         <BlobProvider document={<MyDocument />}>
    //             {({ blob, url, loading }) => {
    //                 console.log(url)
    //                 console.log(blob)

    //                 // let base64String;

    //                 // let reader = new FileReader();
    //                 // reader.readAsDataURL(blob);
    //                 // reader.onloadend = () => {
    //                 //     base64String = reader.result;
    //                 //     setPdfString(base64String.substr(base64String.indexOf(',') + 1));
    //                 // };
    //                 return loading ? 'loading' : (
    //                     <Document
    //                         file={url}
    //                         onLoadSuccess={onDocumentLoadSuccess}
    //                         // renderMode="canvas"
    //                         onLoadError={console.error}>
    //                         <Page pageNumber={pageNumber}
    //                             width={window.innerWidth} />
    //                     </Document>
    //                     // <iframe src={url}></iframe>
    //                 );
    //             }}
    //         </BlobProvider>
    //     </div>)
    // console.log(Array02_1)
    // console.log(Array02)
    // console.log(Array02_2)


    if (isMobile) {
        // generatePdfDocument(MyDocument, '222')

        // function onDocumentLoadSuccess({ numPages }) {
        //     setNumPages(numPages);
        // }
        return (
            <PDFDownloadLink
                document={<MyDocument Array02={Array02} items={items} Profile={Profile} Array03={Array03} Array04={Array04}
                    Array06={Array06} GaugeItem={GaugeItem} PicObj={PicObj} Array02_1={Array02_1} Array02_2={Array02_2} subItems={subItems} />}
                fileName={Profile.PersonalId + '_' + Profile.UserName}
            >
                {({ blob, url, loading }) => {
                    // console.log(loading)
                    // console.log(url)
                    // console.log(blob)
                    if (blob !== null) {
                        console.log(blob)

                        if (blob.size > 3543735) {
                            console.log(blob)

                            return (
                                <Paper elevation={3} style={{ height: 300 }}>
                                    <Typography>LINE內建之瀏覽器將無法正常下載</Typography>
                                    <Typography>請用chrome或safari瀏覽器下載</Typography>
                                    <Button variant='contained' color='success'>下載</Button>
                                    <Typography>如圖片下載中致報告書中缺少，請重新點擊下載即可取得最新檔 或使用非手機之瀏覽器</Typography>

                                </Paper>)
                        }
                        else {
                            // console.log(blob)

                            return <Loading />


                        }


                    } else {

                        return <Loading />
                    }

                }
                }
            </PDFDownloadLink>

        )

        // );
    } else {
        return (
            // <PDFViewer
            //     // style={{ width: '100%', height: '100vh' }}
            //     style={{ position: 'absolute', border: 0, height: '95%', width: '100%' }}
            // >

            //     <MyDocument Array02={Array02} items={items} Profile={Profile} Array03={Array03} Array04={Array04}
            //         Array06={Array06} GaugeItem={GaugeItem} PicObj={PicObj} Array02_1={Array02_1} Array02_2={Array02_2} subItems={subItems} />
            // </PDFViewer>
            <BlobProvider document={<MyDocument Array02={Array02} items={items} Profile={Profile} Array03={Array03} Array04={Array04}
                Array06={Array06} GaugeItem={GaugeItem} PicObj={PicObj} Array02_1={Array02_1} Array02_2={Array02_2} subItems={subItems}
            />}>
                {({ blob, url, loading }) => {
                    // console.log(blob)
                    // console.log(blob)
                    // let fileUrl = URL.createObjectURL(blob);
                    // console.log(fileUrl);
                    // // let base64String;
                    // // let a = document.createElement("a")
                    // let blobURL = URL.createObjectURL(blob)
                    // a.download = 'test.pdf'
                    // a.href = blobURL
                    // document.body.appendChild(a)
                    // seturl(url)
                    return loading ? <Loading /> : (
                        // <Document
                        //     file={url}
                        //     onLoadSuccess={onDocumentLoadSuccess}
                        //     // renderMode="canvas"
                        //     onLoadError={console.error}>
                        //     <Page pageNumber={pageNumber}
                        //         width={window.innerWidth} />
                        // </Document>
                        <>
                            <a href={url} download={Profile.PersonalId + '_' + Profile.UserName + '.pdf'} style={{ position: "absolute", zIndex: 1, top: 0, left: 0 }}>
                                <IconButton >
                                    <GetAppIcon style={{ color: "white" }} />
                                </IconButton>
                            </a>
                            <iframe style={{ width: '100%', height: '100vh' }} src={url}  ></iframe>

                        </>
                    );
                }}
            </BlobProvider>

        );
    }



}

export default App
