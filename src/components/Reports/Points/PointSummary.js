import { Form, Formik } from "formik";
import moment from "moment";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CardHeader, Col, Row } from "reactstrap";
import { Button, Card, CardContent, Dimmer, Divider, Dropdown, Grid, Header, Icon, Loader, Popup, Segment } from "semantic-ui-react";
import Swal from 'sweetalert2';
import * as Yup from "yup";
import Axios from "../../../AxiosConfig/config";
import InputField from "../../../hoc/InputFields";
import './style.css';
import axios from "axios";
export default class PointSummary extends Component {
    state = {
        name: "",
        points: "",
        date: "",
        total: null,
        fullPaid: null,
        instalment: null,
        pending: null,
        cancelled: null,
        refund: null,
        adharPoints: null,
        servicePoints: null,
        referencePoints: null,
        adharPointsAccess: null,
        pointReportOption: [{ label: "Total adhar points report", value: "bec/export/get_total_adhar_points_details" }],
        exportOption: false,
        accessOptions: [{ label: "Admin", value: "admin" }, { label: "Admin & Counselor", value: "counselor" }],
        pointSummary: [],
        counselorID: this.props.match ? this.props.match.params.id : localStorage.getItem("counselorId"),
        academicYear: this.props.match ? parseInt(this.props.match.params.year) : this.props.filterData.academicYear,
        totalValue: null,
        balanceStatus: false,
        pointSummaryData: [],
        counselorAllPoints:[],
        fullpaiddetails: {},
        currentPage: 1,
        totalDocs: "0",
        isLoading: false
    }
    schema = () => {
        return Yup.object().shape({
            name: Yup.string().required("Name is required"),
            date: Yup.date().required("Date is required"),
            points: Yup.string().required("Points required"),
        });
    };
    componentDidMount() {
        this.setState({ isLoading: true })
        this.getAllPoints();
        this.getAllPoints("Approved")
        this.redeemHistory();
    }
    getAllPoints = (status) => {
        let counselorId = this.props.match ? this.props.match.params.id : null;
        let filterData = {};
        if (!this.props.filterData) {
            filterData.academicYear = this.state.academicYear;          
        } else {
            filterData = this.props.filterData;           
        }
        if(status && status === "Approved"){
            filterData.status = "Approved";
        }
        Axios.post(`/bec/admissionpoints/getcounselorpoints?counselorid=${counselorId}`, filterData).then((res) => {         
            if (res.data.status === 200) {
                let fullpaiddetails = {};
                let statusOrder = [];
                let full_paid = true, instalment = true, pending = true, cancelled = true, rejoin = true;
                res.data.data && res.data.data.forEach((data, index) => {
                    if (data._id.studentStatus === "full_paid") {
                        fullpaiddetails = data;
                        full_paid = false;
                        statusOrder[0] = data;
                    }
                    if (data._id.studentStatus === "instalment") {
                        instalment = false;
                        statusOrder[1] = data;
                    }
                    if (data._id.studentStatus === "pending") {
                        pending = false;
                        statusOrder[2] = data;
                    }
                    if (data._id.studentStatus === "cancelled") {
                        cancelled = false;
                        statusOrder[3] = data;
                    }
                    if (data._id.studentStatus === "rejoin") {
                        rejoin = false;
                        statusOrder[4] = data;
                    }
                })
                if (full_paid) {
                    statusOrder[0] = { _id: { studentStatus: "full_paid" }, first_year_admissions: 0, first_year: 0, second_year_admissions: 0, second_year: 0, third_year_admissions: 0, third_year: 0, aadhar_admissions: 0, aadhar: 0, service_admissions: 0, service: 0, reference_admissions: 0, reference: 0 };
                }
                if (instalment) {
                    statusOrder[1] = { _id: { studentStatus: "instalment" }, first_year_admissions: 0, first_year: 0, second_year_admissions: 0, second_year: 0, third_year_admissions: 0, third_year: 0, aadhar_admissions: 0, aadhar: 0, service_admissions: 0, service: 0, reference_admissions: 0, reference: 0 };
                }
                if (pending) {
                    statusOrder[2] = { _id: { studentStatus: "pending" }, first_year_admissions: 0, first_year: 0, second_year_admissions: 0, second_year: 0, third_year_admissions: 0, third_year: 0, aadhar_admissions: 0, aadhar: 0, service_admissions: 0, service: 0, reference_admissions: 0, reference: 0 };
                }
                if (cancelled) {
                    statusOrder[3] = { _id: { studentStatus: "cancelled" }, first_year_admissions: 0, first_year: 0, second_year_admissions: 0, second_year: 0, third_year_admissions: 0, third_year: 0, aadhar_admissions: 0, aadhar: 0, service_admissions: 0, service: 0, reference_admissions: 0, reference: 0 };
                }
                if (rejoin) {
                    statusOrder[4] = { _id: { studentStatus: "rejoin" }, first_year_admissions: 0, first_year: 0, second_year_admissions: 0, second_year: 0, third_year_admissions: 0, third_year: 0, aadhar_admissions: 0, aadhar: 0, service_admissions: 0, service: 0, reference_admissions: 0, reference: 0 };
                }
                let stateData=this.state;              
                stateData.fullpaiddetails = fullpaiddetails;
                stateData.isLoading = false;              
                if(status && status === "Approved"){
                    stateData.pointSummaryData = statusOrder;                   
                    this.setState({                       
                        ...this.stateData,                       
                    })
                }else{
                    stateData.counselorAllPoints = statusOrder;  
                    this.setState({
                       ...this.stateData,                     
                    })
                }
                
            }
        })
            .catch((e) => {
                this.setState({ isLoading: false })
                toast.error("Unable to get points")
            })
    }
    displayStatus = (cell, row) => {
        return (cell && cell.studentStatus ? ((cell.studentStatus === "pending" && "Pending") || (cell.studentStatus === "full_paid" && "Full paid") || (cell.studentStatus === "instalment" && "Instalment")
            || (cell.studentStatus === "cancelled" && "Cancelled") || (cell.studentStatus === "rejoin" && "Rejoin")) : "")
    }
    displayFirstYearAdmission = (cell, row , status) => {   
        let statusValue = row._id.studentStatus;           
        if (statusValue !== null && statusValue !== undefined) {
            return <div>
                {(row && row.first_year_admissions) ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/${statusValue}/first_year/${this.state.counselorID}/${status}`}><u><b>{row.first_year_admissions}</b></u></a> : 0}
            </div>
        }
    }
    displaySecondYearAdmission = (cell, row , status) => {
        let statusValue = row._id.studentStatus;
        if (statusValue !== null && statusValue !== undefined) {
            return <div>
                {(row && row.second_year_admissions) ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/${statusValue}/second_year/${this.state.counselorID}/${status}`}><u><b>{row.second_year_admissions}</b></u></a> : 0}
            </div>
        }
    }
    displayThirdYearAdmission = (cell, row , status) => {
        let statusValue = row._id.studentStatus;
        if (statusValue !== null && statusValue !== undefined) {
            return <div>
                {(row && row.third_year_admissions) ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/${statusValue}/third_year/${this.state.counselorID}/${status}`}><u><b>{row.third_year_admissions}</b></u></a> : 0}
            </div>
        }
    }
    displayAadharAdmission = (cell, row , status) => {
        let statusValue = row._id.studentStatus;
        if (statusValue !== null && statusValue !== undefined) {
            return <div>
                {(row && row.aadhar_admissions) ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/${statusValue}/aadhar/${this.state.counselorID}/${status}`}><u><b>{row.aadhar_admissions}</b></u></a> : 0}
            </div>
        }
    }
    displayServiceAdmission = (cell, row , status) => {
        let statusValue = row._id.studentStatus;
        if (statusValue !== null && statusValue !== undefined) {
            return <div>
                {(row && row.service_admissions) ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/${statusValue}/service/${this.state.counselorID}/${status}`}><u><b>{row.service_admissions}</b></u></a> : 0}
            </div>
        }
    }
    displayReferenceAdmission = (cell, row , status) => {
        let statusValue = row._id.studentStatus;
        if (statusValue !== null && statusValue !== undefined) {
            return <div>
                {(row && row.reference_admissions) ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/${statusValue}/reference/${this.state.counselorID}/${status}`}><u><b>{row.reference_admissions}</b></u></a> : 0}
            </div>
        }
    }
    redeemHistory = () => {
        let redeemedPoints = 0;
        Axios.get(`bec/redeempoint/getallredeemhistory/${this.state.counselorID}/${this.state.academicYear}?page=${this.state.currentPage}&limit=10`).then((res) => {
            res.data.data.docs.map((data, index) => (
                redeemedPoints = parseFloat(redeemedPoints) + parseFloat(data.points)
            ));
            this.setState({
                pointSummary: res.data.data.docs,
                currentPage: res.data.data.page,
                totalDocs: res.data.data.totalDocs,
                totalValue: redeemedPoints
            })
        })
    }
    pointSummaryPaginationHandle = (data) => {
        this.setState({
            currentPage: data
        }, () => { this.redeemHistory() })
    }
    handleExportButtonApis = async (data) => {
        if (data) {
            let payload = {};
            payload.academicYear = this.props.filterData;
            if (data && data.value) {
                this.setState({ isLoading: true });
                setTimeout(() => {
                    this.setState({ isLoading: false });
                }, 25000);
                axios.post(process.env.REACT_APP_BACKEND_API_URL+data.value, this.props.filterData, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token"), timeout: 30000}  })
                .then((response) => {
                    if (response.data.status === 200) {
                        if ((response.data.data !== undefined) && (response.data.data !== "") && (response.data.data !== null)) {
                            const link = document.createElement("a");
                            link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/export/viewExcelFile/" + response.data.data;
                            link.setAttribute("download", response.data.data);
                            document.body.appendChild(link);
                            link.click();
                        }
                    } else {
                        Swal.fire({
                            icon: "warning",
                            text: "No records found to export..!"
                        })
                    }
                    this.setState({ isLoading: true });
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    toast.error(err.response && err.response.data && err.response.data.message ?err.response.data.message: "Unable to export points data")
                })
            }
        }
    }
    saveDetails = (values) => {
        let payload = {
            counselor_id: this.state.counselorID,
            name: values.name,
            redeemDate: values.date,
            points: values.points,
            academic_year: this.state.academicYear
        }
        if ((((this.state.fullpaiddetails ? this.state.fullpaiddetails.first_year : 0)
            + (this.state.fullpaiddetails ? this.state.fullpaiddetails.second_year : 0) +
            (this.state.fullpaiddetails ? this.state.fullpaiddetails.third_year : 0)
            + (this.state.fullpaiddetails ? this.state.fullpaiddetails.service : 0) +
            (this.state.fullpaiddetails ? this.state.fullpaiddetails.aadhar : 0)) - (this.state.totalValue)) >= (values.points)) {
            Axios.post(`bec/redeempoint/addredeempoints/${this.state.counselorID}`, payload).then((res) => {
                if (res.data.status === 201) {
                    toast.success("Points redeemed successfully")
                    this.redeemHistory();
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                text: "Entered points are more then of balance points.!",
                allowOutsideClick: false
            })
        }
    }
    displayDate = (cell, row) => {
        return cell !== null && cell !== undefined ? moment(cell).format("DD-MM-YYYY") : "";
    }
    validationWithBalancePoints = (e) => {
        if ((((this.state.fullpaiddetails ? this.state.fullpaiddetails.first_year : 0)
            + (this.state.fullpaiddetails ? this.state.fullpaiddetails.second_year : 0) +
            (this.state.fullpaiddetails ? this.state.fullpaiddetails.third_year : 0)
            + (this.state.fullpaiddetails ? this.state.fullpaiddetails.service : 0) +
            (this.state.fullpaiddetails ? this.state.fullpaiddetails.aadhar : 0)) - (this.state.totalValue)) < (e.target.value)) {
            Swal.fire({
                icon: 'warning',
                text: "Entered points are more then of balance points.!",
                allowOutsideClick: false
            })
        }
    }
    render() {
        let footerData = [
            [
                {
                    label: 'Total value',
                    columnIndex: 2,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].points !== null && tableData[i].points !== undefined) {
                                label += parseFloat(tableData[i].points);
                            }
                        }
                        return (
                            <strong>Total : {isNaN(label) ?  0 :  label}
                            </strong>
                        );
                    }
                }
            ]
        ];
        let footerPointsData = [
            [
                {
                    label: 'Total',
                    columnIndex: 0
                },
                {
                    label: 'Total value',
                    columnIndex: 1,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if ((tableData[i].first_year_admissions !== null) && (tableData[i].first_year_admissions !== undefined)) {
                                label += parseFloat(tableData[i].first_year_admissions);
                            }
                        }
                        return (
                            <strong>{isNaN(label)? 0 :
                                label ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/all/first_year/${this.state.counselorID}/all`}><u><b>{label}</b></u></a> : 0}
                            </strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 2,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].first_year !== null && tableData[i].first_year !== undefined) {
                                label += parseFloat(tableData[i].first_year);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label} </strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 3,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if ((tableData[i].second_year_admissions !== null) && (tableData[i].second_year_admissions !== undefined)) {
                                label += parseFloat(tableData[i].second_year_admissions);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 :
                                label ? <a className="linkStyles" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/all/second_year/${this.state.counselorID}/all`}><u><b>{label}</b></u></a> : 0}
                            </strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 4,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].second_year !== null && tableData[i].second_year !== undefined) {
                                label += parseFloat(tableData[i].second_year);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 5,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if ((tableData[i].third_year_admissions !== null) && (tableData[i].third_year_admissions !== undefined)) {
                                label += parseFloat(tableData[i].third_year_admissions);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 :
                                label ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/all/third_year/${this.state.counselorID}/all`}><u><b>{label}</b></u></a> : 0}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 6,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].third_year !== null && tableData[i].third_year !== undefined) {
                                label += parseFloat(tableData[i].third_year);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 7,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].aadhar_admissions !== null && tableData[i].aadhar_admissions !== undefined) {
                                label += parseFloat(tableData[i].aadhar_admissions);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 :
                                label ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/all/aadhar/${this.state.counselorID}/all`}><u><b>{label}</b></u></a> : 0}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 8,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].aadhar !== null && tableData[i].aadhar !== undefined) {
                                label += parseFloat(tableData[i].aadhar);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 9,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].service_admissions !== null && tableData[i].service_admissions !== undefined) {
                                label += parseFloat(tableData[i].service_admissions);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 :
                                label ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/all/service/${this.state.counselorID}/all`}><u><b>{label}</b></u></a> : 0}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 10,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].service !== null && tableData[i].service !== undefined) {
                                label += parseFloat(tableData[i].service);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 11,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].reference_admissions !== null && tableData[i].reference_admissions !== undefined) {
                                label += parseFloat(tableData[i].reference_admissions);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 :
                                label ? <a className="linkStyles" target="blank" href={`${process.env.REACT_APP_FRONTEND_URL}#/request/counselor/admission/all/reference/${this.state.counselorID}/all`}><u><b>{label}</b></u></a> : 0}</strong>
                        );
                    }
                },
                {
                    label: 'Total value',
                    columnIndex: 12,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            if (tableData[i].reference !== null && tableData[i].reference !== undefined) {
                                label += parseFloat(tableData[i].reference);
                            }
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label}</strong>
                        );
                    }
                }
            ]
        ];
        return (
            <div>
                <ToastContainer />
                {this.state.isLoading ?
                    <Dimmer active inverted>
                        <Loader content='Data Loading...' active inline='centered' size="medium" />
                    </Dimmer>
                     : null} 
                <Row>
                    <Col md={8} xs={12}>
                        <span className='reports_header_style_C' size="large" >
                            <i className="fa fa-braille"></i> {" "}Points Summary{"  "} <b>-</b>{"  "}{this.props.match ? this.props.match.params.name : localStorage.getItem("fullName")}{" ("}{this.state.academicYear}{")"}
                        </span>
                    </Col>
                    <Col md={4} xs={12}>
                        <Row>
                            <Col md={8} xs={9}> </Col>
                            <Col md={4} xs={3} className="formd2">
                                {localStorage.getItem("accesslevel") === "counselor" ?
                                    <Popup
                                        trigger={<Dropdown icon={<Icon name='share square' bordered inverted color="green"/>} id="pointsiconstyle11" pointing={"top right"} options={this.state.pointReportOption} onChange={(e, value) => this.handleExportButtonApis(value)}>
                                        </Dropdown>}
                                        content='Export'
                                        position='top center'
                                        inverted
                                    />
                                    : null
                                }
                                {localStorage.getItem("accesslevel") === "counselor" ?
                                    <Popup
                                        trigger={<Icon bordered inverted color='teal' id="pointsiconstyle22" name='filter' onClick={(e) => this.props.getBack(e)} />}
                                        content='Filter'
                                        position='top right'
                                        inverted
                                    />
                                    : null
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Card className="cardstyle">
                    <CardContent>
                        <Grid divided centered stackable>                       
                            <Grid.Row stretched >
                                <CardHeader><b><span className="counselorPoints_Style_C" size="large" ><i className="fa fa-line-chart"></i></span>{" "} Counselor All Points</b></CardHeader>                                                                                                  
                                <Grid.Column width={16}>                                
                                    <Segment color='black'>
                                        <BootstrapTable striped  data={this.state.counselorAllPoints} hover footerData={footerPointsData} footer >
                                            <TableHeaderColumn dataField="_id" dataFormat={this.displayStatus} width="130px" isKey={true} className='tableheaderstyle3global'>Payment Status</TableHeaderColumn>
                                            <TableHeaderColumn dataField="first_year_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayFirstYearAdmission(cell , row ,"all")} className='tableheaderstyle3global'>1st Year{"  "}{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="first_year" width="80px"  dataAlign="right" className='tableheaderstyle3global'>1st Year{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="second_year_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displaySecondYearAdmission(cell , row ,"all")} className='tableheaderstyle3global'>2nd Year{"  "}{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="second_year" width="80px"  dataAlign="right" className='tableheaderstyle3global'>2nd Year{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="third_year_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayThirdYearAdmission(cell , row ,"all")} className='tableheaderstyle3global'>3rd Year{"  "}{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="third_year" width="80px"  dataAlign="right" className='tableheaderstyle3global'>3rd Year{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="aadhar_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayAadharAdmission(cell , row ,"all")} className='tableheaderstyle3global'>Aadhaar{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="aadhar" width="80px"  dataAlign="right" className='tableheaderstyle3global'>Aadhaar{<br />}Points </TableHeaderColumn>
                                            <TableHeaderColumn dataField="service_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayServiceAdmission(cell , row ,"all")} className='tableheaderstyle3global'>Service{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="service" width="90px"  dataAlign="right" className='tableheaderstyle3global'>Service{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="reference_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayReferenceAdmission(cell , row ,"all")} className='tableheaderstyle3global'>Reference{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="reference" width="100px"  dataAlign="right" className='tableheaderstyle3global'>Reference{<br />}Points</TableHeaderColumn>
                                        </BootstrapTable>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row stretched >  
                            <CardHeader><b><span className="counselorPoints_Style_C" size="large" ><i className="fa fa-check"></i></span>{" "} Approved Counselor Points</b></CardHeader>                             
                                <Grid.Column width={16}>                           
                                    <Segment color='black'>
                                        <BootstrapTable striped  data={this.state.pointSummaryData} hover footerData={footerPointsData} footer >
                                            <TableHeaderColumn dataField="_id" dataFormat={this.displayStatus} width="130px" isKey={true} className='tableheaderstyle3global'>Payment Status</TableHeaderColumn>
                                            <TableHeaderColumn dataField="first_year_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayFirstYearAdmission(cell , row ,"Approved")} className='tableheaderstyle3global'>1st Year{"  "}{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="first_year" width="80px"  dataAlign="right" className='tableheaderstyle3global'>1st Year{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="second_year_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displaySecondYearAdmission(cell , row ,"Approved")} className='tableheaderstyle3global'>2nd Year{"  "}{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="second_year" width="80px"  dataAlign="right" className='tableheaderstyle3global'>2nd Year{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="third_year_admissions" width="110px"  dataAlign="right" dataFormat={(cell,row)=>this.displayThirdYearAdmission(cell , row ,"Approved")} className='tableheaderstyle3global'>3rd Year{"  "}{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="third_year" width="80px"  dataAlign="right" className='tableheaderstyle3global'>3rd Year{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="aadhar_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayAadharAdmission(cell , row ,"Approved")} className='tableheaderstyle3global'>Aadhaar{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="aadhar" width="80px"  dataAlign="right" className='tableheaderstyle3global'>Aadhaar{<br />}Points </TableHeaderColumn>
                                            <TableHeaderColumn dataField="service_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayServiceAdmission(cell , row ,"Approved")} className='tableheaderstyle3global'>Service{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="service" width="90px"  dataAlign="right" className='tableheaderstyle3global'>Service{<br />}Points</TableHeaderColumn>
                                            <TableHeaderColumn dataField="reference_admissions" width="110px"  dataAlign="right" dataFormat={(cell , row)=>this.displayReferenceAdmission(cell , row ,"Approved")} className='tableheaderstyle3global'>Reference{<br />}Admissions</TableHeaderColumn>
                                            <TableHeaderColumn dataField="reference" width="100px"  dataAlign="right" className='tableheaderstyle3global'>Reference{<br />}Points</TableHeaderColumn>
                                        </BootstrapTable>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row stretched>
                                <Grid.Column width={8}>
                                    <Segment color='black'>
                                        <Divider horizontal>
                                            <Header as='h4'>
                                                <span>
                                                    <Icon name='dollar sign' color="blue" />
                                                    <b color="blue"> Total Full Paid Status</b>
                                                </span>
                                            </Header>
                                        </Divider>
                                        <Grid>
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={9}>
                                                </Grid.Column>
                                                <Grid.Column width={4} floated="right">
                                                    <span className="pointsummarycolumnspanstyle"> Admissions</span>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummarycolumnspanstyle">Points</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row className="pointsummarygridrowstyles">
                                                <Grid.Column width={4}>
                                                    <b>1<sup>st</sup>&nbsp;Year</b>
                                                </Grid.Column>
                                                <Grid.Column width={5}>
                                                </Grid.Column>
                                                <Grid.Column width={4} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.first_year_admissions ? this.state.fullpaiddetails.first_year_admissions : 0}</span>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.first_year ? this.state.fullpaiddetails.first_year : 0}</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Divider className="pointsummarydividerstyle" />
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={4}>
                                                    <b>2<sup>nd</sup>&nbsp;Year</b>
                                                </Grid.Column>
                                                <Grid.Column width={5}>
                                                </Grid.Column>
                                                <Grid.Column width={4} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.second_year_admissions ? this.state.fullpaiddetails.second_year_admissions : 0}</span>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.second_year ? this.state.fullpaiddetails.second_year : 0}</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Divider className="pointsummarydividerstyle" />
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={4}>
                                                    <b>3<sup>rd</sup>&nbsp;Year</b>
                                                </Grid.Column>
                                                <Grid.Column width={5}>
                                                </Grid.Column>
                                                <Grid.Column width={4} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.third_year_admissions ? this.state.fullpaiddetails.third_year_admissions : 0}</span>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.third_year ? this.state.fullpaiddetails.third_year : 0}</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Divider className="pointsummarydividerstyle" />
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={5}>
                                                    <b>Aadhaar</b>
                                                </Grid.Column>
                                                <Grid.Column width={4}>
                                                </Grid.Column>
                                                <Grid.Column width={4} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.aadhar_admissions ? this.state.fullpaiddetails.aadhar_admissions : 0}</span>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.fullpaiddetails && this.state.fullpaiddetails.aadhar ? this.state.fullpaiddetails.aadhar : 0}</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Divider className="pointsummarydividerstyle" />
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={4}>
                                                    <b>Total</b>
                                                </Grid.Column>
                                                <Grid.Column width={5}>
                                                </Grid.Column>
                                                <Grid.Column width={4} floated="right">
                                                    <span className="pointsummarycolumnspanstyle">{(this.state.fullpaiddetails && this.state.fullpaiddetails.first_year_admissions ? this.state.fullpaiddetails.first_year_admissions : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.second_year_admissions ? this.state.fullpaiddetails.second_year_admissions : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.third_year_admissions ? this.state.fullpaiddetails.third_year_admissions : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.service_admissions ? this.state.fullpaiddetails.service_admissions : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.aadhar_admissions ? this.state.fullpaiddetails.aadhar_admissions : 0)}</span>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummarycolumnspanstyle">{(this.state.fullpaiddetails && this.state.fullpaiddetails.first_year ? this.state.fullpaiddetails.first_year : 0)
                                                        + (this.state.fullpaiddetails && this.state.fullpaiddetails.second_year ? this.state.fullpaiddetails.second_year : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.third_year ? this.state.fullpaiddetails.third_year : 0)
                                                        + (this.state.fullpaiddetails && this.state.fullpaiddetails.service ? this.state.fullpaiddetails.service : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.aadhar ? this.state.fullpaiddetails.aadhar : 0)}</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Segment color='black'>
                                        <Divider horizontal>
                                            <Header as='h4'>
                                                <span>
                                                    <Icon name='dollar sign' color="blue" />
                                                    <b color="blue">Balance Redeem</b>
                                                </span>
                                            </Header>
                                        </Divider>
                                        <Grid>
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={13}>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummarycolumnspanstyle">Points</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row className="pointsummarygridrowstyles">
                                                <Grid.Column width={6}>
                                                    <b>Earned</b>
                                                </Grid.Column>
                                                <Grid.Column width={7}>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{(this.state.fullpaiddetails && this.state.fullpaiddetails.first_year ? this.state.fullpaiddetails.first_year : 0)
                                                        + (this.state.fullpaiddetails && this.state.fullpaiddetails.second_year ? this.state.fullpaiddetails.second_year : 0) +
                                                        (this.state.fullpaiddetails && this.state.fullpaiddetails.third_year ? this.state.fullpaiddetails.third_year : 0)
                                                        + (this.state.fullpaiddetails && this.state.fullpaiddetails.service ? this.state.fullpaiddetails.service : 0) +
                                                        ((this.state.fullpaiddetails && this.state.fullpaiddetails.aadhar) ? this.state.fullpaiddetails.aadhar : 0)}</span>                                                </Grid.Column>
                                            </Grid.Row>
                                            <Divider className="pointsummarydividerstyle" />
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={4}>
                                                    <b>Redeemed</b>
                                                </Grid.Column>
                                                <Grid.Column width={9}>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummaryspanalignstyle">{this.state.totalValue}</span>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Divider className="pointsummarydividerstyle" />
                                            <Grid.Row className="pointsummaryrowstyle">
                                                <Grid.Column width={4}>
                                                    <b>Total</b>
                                                </Grid.Column>
                                                <Grid.Column width={9}>
                                                </Grid.Column>
                                                <Grid.Column width={3} floated="right">
                                                    <span className="pointsummarycolumnspanstyle">
                                                        {((this.state.fullpaiddetails && this.state.fullpaiddetails.first_year ? this.state.fullpaiddetails.first_year : 0)
                                                            + (this.state.fullpaiddetails && this.state.fullpaiddetails.second_year ? this.state.fullpaiddetails.second_year : 0) +
                                                            (this.state.fullpaiddetails && this.state.fullpaiddetails.third_year ? this.state.fullpaiddetails.third_year : 0)
                                                            + (this.state.fullpaiddetails && this.state.fullpaiddetails.service ? this.state.fullpaiddetails.service : 0) +
                                                            (this.state.fullpaiddetails && this.state.fullpaiddetails.aadhar ? this.state.fullpaiddetails.aadhar : 0)) - (this.state.totalValue)}
                                                    </span>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            {localStorage.getItem("accesslevel") === "admin" ? 
                                <Grid.Row stretched>
                                    <Grid.Column width={16}>
                                        <Segment color='black'>
                                                <div><Divider horizontal>
                                                    <Header as='h4'>
                                                        <span>
                                                            <Icon name='dollar sign' color="blue" />
                                                            <b color="blue">Redeem Points</b>
                                                        </span>
                                                    </Header>
                                                </Divider>
                                                    <Formik
                                                        enableReinitialize={true}
                                                        initialValues={this.state}
                                                        validationSchema={this.schema}
                                                        onSubmit={this.saveDetails}
                                                    >{({ values, setFieldValue }) => (
                                                        <Form>
                                                            <Grid.Row>
                                                                <InputField label='Date' inputtype='date' fieldSize="4" mandatoryField="true" name='date' type='date' />
                                                                <InputField label='Name' inputtype='text' fieldSize="4" mandatoryField="true" name='name' type='text' placeholder='Enter Name' />
                                                                <InputField label='Points' inputtype='number' fieldSize="4" mandatoryField="true" name='points' type='number' onKeyDown={(evt) => ["e", "E", "+", "-", "!", "\\", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} placeholder='Enter number' onBlur={this.validationWithBalancePoints} />
                                                            </Grid.Row><br />
                                                            <Grid.Row> <center>
                                                                <Button color="blue" type="submit" className="buttonstyle" >Save</Button></center>
                                                            </Grid.Row>
                                                        </Form>)}
                                                    </Formik>
                                                </div>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                                : null
                            }
                            <Grid.Row stretched>
                                <Grid.Column width={16}>
                                    <Segment color='black' >
                                        <Divider horizontal>
                                            <Header as='h4'>
                                                <span>
                                                    <Icon name='dollar sign' color="blue" />
                                                    <b color="blue">Redeem History</b>
                                                </span>
                                            </Header>
                                        </Divider>
                                        <BootstrapTable striped  data={this.state.pointSummary} showFooter={true} footerData={footerData} footer >
                                            <TableHeaderColumn dataField='redeemDate' dataSort dataFormat={this.displayDate}>Date  </TableHeaderColumn>
                                            <TableHeaderColumn dataField='name' isKey={true} dataSort > Name </TableHeaderColumn>
                                            <TableHeaderColumn dataField='points' dataSort dataAlign="right" > Points  </TableHeaderColumn>
                                        </BootstrapTable>
                                        <hr className="hrstyle" />
                                        <Grid.Row className='pagination_style7'>
                                            <Grid.Column width={16}>
                                                <Pagination onChange={this.pointSummaryPaginationHandle} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                                    defaultPageSize={10} current={this.state.currentPage} total={this.state.totalDocs} locale={localeInfo} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <center> <Button color="black" onClick={() => this.props.getBack ? this.props.getBack() : this.props.history.push(`/reports/points`)}>Back</Button></center>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }
}