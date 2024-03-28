import React, { Component } from "react";
import { Button, Icon, Header, Divider, Dimmer, Loader } from "semantic-ui-react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { Col, Row, Modal, ModalBody, Input, ModalFooter } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.css';
import Axios from "../../../../AxiosConfig/config";
import Swal from 'sweetalert2';
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "rc-pagination/assets/index.css";
import EditBilling from "./EditBilling";
import ViewBilling from "./ViewBilling";
import './style.css';
import RefundAmount from "./RefundAmount";
import ViewRefundAmount from "./ViewRefundAmount";
import { AppSwitch } from "@coreui/react";
export default class Billing extends Component {
    state = {
        _id: null,
        currentPage: 1,
        DataCount: "0",
        totalDocs: "0",
        billingList: [],
        paymentStatusDropdown: [],
        billTypeDropdown: [],
        academicYearList: [],
        academicYearDropdown: [],
        years: [],
        form: {
            studentId: this.props.studentId,
        },
        openRefund: false,
        openModal: false,
        openView: false,
        openRefundView: false,
        studentInfo: null,
        paymentAmountLimits: [],
        isLoading: false,
        counselorId: "",
        deleteStatusReasonId: null,
        openReasonModal: false,
        errorMessage: "",
        reasonForAction: "",
        deleteHistoryId: "",
        historyReasonData: "",
    };
    forView = () => {
        this.setState({
            _id: null,
            openModal: false,
            form: {
                studentId: this.props.studentId,
            },
            openView: !this.state.openView,
        }, () => {
            this.getAllUniversityPayments()
        });
    }
    forViewRefundAmount = () => {
        this.setState({
            _id: null,
            form: {
                studentId: this.props.studentId,
            },
            openRefundView: !this.state.openRefundView,
        },
            () => {
                this.getAllUniversityPayments()
            }
        );
    }
    forEdit = (toastData) => {
        const state = this.state;
        if (toastData) {
            state._id = null;
            state.openView = false;
            state.form = {
                studentId: this.props.studentId
            }
            state.openModal = !this.state.openModal;
        } else {
            state._id = null;
            state.openView = false;
            state.form = {
                studentId: this.props.studentId
            }
            state.openModal = !this.state.openModal;
        }
        this.setState({
            ...state
        }, () => {
            this.getAllUniversityPayments()
        });
    }
    forRefund = (toast) => {
        const state = this.state;
        if (toast) {
            state._id = null;
            state.openView = false;
            state.openModal = false;
            state.form = {
                studentId: this.props.studentId
            }
            state.openRefund = !this.state.openRefund;
        } else {
            state._id = null;
            state.openView = false;
            state.openModal = false;
            state.form = {
                studentId: this.props.studentId
            }
            state.openRefund = !this.state.openRefund;
        }
        this.setState({
            ...state
        },
            () => {
                this.getAllUniversityPayments();
            }
        );
    }
    getAllUniversityPayments = () => {
        if (this.state.form.studentId !== "new") {
            Axios.get('bec/studentuniversity/groupbystudentid/' + this.state.form.studentId)
                .then(response => {
                    if (response.data.status === 200) {
                        if (response.data.data.length > 0) {
                            response.data.data.forEach((w, l) => {
                                if (w.all.length > 0 && Object.keys(w.all[0]).length > 0) {
                                    this.props.enableAllTabs();
                                }
                            })
                        }
                        response.data.data.length > 0 && response.data.data.sort((a, b) => {
                            if (a && a.all && a.all.length > 0 && a.all[0] && a.all[0].academicYear && b && b.all && b.all.length > 0 && b.all[0] && b.all[0].academicYear) {
                                return (b.all[0].academicYear.value - a.all[0].academicYear.value);
                            }else{
                                return 0;
                            }
                        })
                        let hos = [];
                        response.data.data.forEach((s, i) => {
                            if (!s._id.academicYear) {
                                s.all = [];
                                s._id.academicYear = s._id.universityAcademicYear.value;
                                hos.push(s);
                            } else {
                                hos.push(s);
                            }
                        })
                        hos = hos.sort((a, b) => { return b._id.academicYear - a._id.academicYear && new Date(b._id.createdAt) - new Date(a._id.createdAt) });
                        let paymentAmountLimits = [];
                        hos.forEach((year, index) => {
                            let filtered = paymentAmountLimits.filter((existed) => existed.year === year._id.academicYear);
                            if (filtered.length === 0) {
                                let totalPaid = year._id.totalPaid ? year._id.totalPaid : 0;
                                let totalRefund = year.totalConfirmedRefund ? year.totalConfirmedRefund : 0;
                                paymentAmountLimits.push({
                                    [year._id.academicYear]: parseInt(year._id.totalFee) - parseInt(totalPaid) + parseInt(totalRefund)
                                })
                            }
                        });
                        this.setState({
                            ...this.state,
                            billingList: hos,
                            paymentAmountLimits: paymentAmountLimits,
                            isLoading: false,
                        })
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    toast.error("Unable to get all the billing's")
                });
        }
    }
    handleBillingEdit = (_id, type, row) => {
        let stateData = this.state;
        if (type === 'view') {
            if (row.refundAmount !== undefined && row.refundAmount !== null) {
                stateData._id = _id;
                stateData.openView = false;
                stateData.openModal = false;
                stateData.openRefund = false;
                stateData.openRefundView = true;
            } else {
                stateData._id = _id;
                stateData.openView = true;
                stateData.openModal = false;
                stateData.openRefund = false;
                stateData.openRefundView = false;
            }
        } else {
            if (row.refundAmount !== null && row.refundAmount !== undefined) {
                stateData._id = _id;
                stateData.openView = false;
                stateData.openModal = false;
                stateData.openRefund = true;
                stateData.openRefundView = false;
            } else {
                stateData._id = _id;
                stateData.openView = false;
                stateData.openModal = true;
                stateData.openRefund = false;
                stateData.openRefundView = false;
            }
        }
        this.setState({ ...stateData });
    }
    handleBillingDelete = (_id, data) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
        }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`bec/payment/delete/${_id}`)
                    .then((response) => {
                        if (response.data.status === 200) {
                            this.getAllUniversityPayments();
                            toast.error("Payment details deleted successfully.!");
                        }
                    })
                    .catch((e) => {
                        toast.error("Unable to delete the billings");
                    })
            } else {
                Swal.fire('Your data is safe', '');
            }
        })
    };
    actions = (cell, row) => {
        return (
            <span>
                <i className="fa fa-eye billeyeiconstyle" onClick={() => this.handleBillingEdit(cell, 'view', row)} ></i>{" "}
                <Icon name="pencil" className="billing_editIcon_style"
                    disabled={(localStorage.getItem("accesslevel") === "counselor" && localStorage.getItem("counselorId") !== this.state.counselorId)
                        || row.status === false}
                    onClick={() => this.handleBillingEdit(cell, 'edit', row)} >{" "}</Icon>{" "}
                {
                    localStorage.getItem("accesslevel") === "admin" ?
                        <Icon name="trash" className="billing_deleteIcon_style" disabled={(localStorage.getItem("accesslevel") === "counselor" && localStorage.getItem("counselorId") !== this.state.counselorId) || row.status === false} onClick={() => this.handleBillingDelete(cell, row)} ></Icon>
                        : ""
                }
            </span>
        )
    }

    studentInfo = (id) => {
        if (id !== "new") {
            Axios.get('/bec/admission/get/' + id)
                .then((res) => {
                    if (res.data.status === 200) {
                        this.setState({
                            ...this.state,
                            studentInfo: res.data.data[0],
                            counselorId: res.data.data[0].enteredBy ? res.data.data[0].enteredBy.counselor_id : null
                        })
                    }
                    this.getAllUniversityPayments();
                }).catch((e) => {
                    toast.error("Unable to get the student details")
                })
        }
    }
    componentDidMount() {
        this.setState({ isLoading: true })
        if (this.props.studentId === 'new') {
            Swal.fire({
                icon: 'warning',
                text: "Please create student first.!",
            })
        }
        let years = this.state.years;
        let firstYear = 2010;
        this.getAllUniversityPayments();
        for (let i = 0; i < 60; i++) {
            years.push({ label: firstYear, value: firstYear });
            firstYear++;
        }
        this.studentInfo(this.props.studentId);
    }

    transactionNo = (cell, row) => {
        return cell ? cell : "Not Available";
    }
    openRefund = () => {
        if (this.props.studentId === 'new') {
            Swal.fire({
                icon: 'warning',
                text: "You have to create student basic details initially.!",
            })
        }
        else {
            this.setState({ openRefund: !this.state.openRefund })
        }
    }
    addRecord = () => {
        if (this.state.form.studentId !== "new") {
            this.setState({ openModal: true })           
        }
        else {
            Swal.fire({
                icon: 'warning',
                text: "You have to create student basic details initially.!",
            })
        }
    }
    displayPaymentDate = (cell, row) => {
        return cell !== null && cell !== undefined ? moment(cell).format("DD-MM-YYYY") : "Not Available";
    }
    refundStatusDisply = (cell, row) => {
        return row.refund_status && (row.refund_status === "Admin Confirmed" || row.refund_status === "Manager Confirmed") ? <p className="billrefundstatustyle">{row.refund_status}</p> :
            <p className="billrefundstatuscolor">{row.refund_status}</p>
    }
    statusDisply = (cell, row) => {
        let statusValue = row.status ? "true" : "false";
        return (
            <AppSwitch className={'mx-1'} variant={'pill'} name="status" color='primary' value={statusValue} checked={row.status ? true : false}
                onChange={(e) => this.handleStatusToggle(row)}
            />
        )
    }
    handleStatusToggle = (data) => {      
        this.setState({
            deleteStatusReasonId: data,
            openReasonModal: (data.status === true ? true : false)
        }, () => { return this.state.openReasonModal === false ? this.changeDeleteStatusWithoutReason(data) : "" })
    }
    handleReasonInput = (event) => {
        let deleteData = this.state
        if (event.target.value !== undefined && event.target.value !== null && event.target.value !== "") {
            deleteData.errorMessage = ""
            deleteData.reasonForAction = event.target.value
        }
        else {
            deleteData.errorMessage = "Reason is required"
            deleteData.reasonForAction = event.target.value
        }
        this.setState({ ...deleteData })
    }
    deleteReasonToggle = () => {
        this.setState({
            openReasonModal: !this.state.openReasonModal            
        },()=>{this.getAllUniversityPayments()})
    }   
    deleteReasonSave = () => {
        if (this.state.reasonForAction !== undefined && this.state.reasonForAction !== null && this.state.reasonForAction !== "") {
            let data = this.state.deleteStatusReasonId;
            let statusData = !data.status;
            let payload = {
                status: statusData,
                reason: this.state.reasonForAction ? this.state.reasonForAction : ""
            };
            Axios.post('bec/payment/softdelete/' + data._id, payload).then(response => {
                if (response.data.status === 200) {
                    this.setState({
                        openReasonModal: false,
                    });
                    toast.success("status updated successfully..!");
                    this.getAllUniversityPayments();
                }
            }).catch((e) => {
                toast.error("Unable to update the status ")
            })
        }
        else {
            this.setState({ errorMessage: "Delete reason is required" })
        }
    }
    changeDeleteStatusWithoutReason = (data) => {
        if (this.state.openReasonModal === false) {
            let data = this.state.deleteStatusReasonId;
            let statusData = !data.status;
            let payload = {
                status: statusData,
                reason: ""
            };
            Swal.fire({
                title: 'Do you want to change status',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    Axios.post('bec/payment/softdelete/' + data._id, payload).then(response => {
                        if (response.data.status === 200) {
                            this.setState({
                                openReasonModal: false,
                            });
                            toast.success("status updated successfully..!");
                            this.getAllUniversityPayments();
                        }
                    }).catch((e) => {
                        toast.error("Unable to update the status ")
                    })
                } else {
                    Swal.fire('Your not changed status', '');
                }
            })
        }
    }
    reasonForAction = (cell, row) => {
        return cell ? cell : " Not Available";
    }
    rowClassNameFormat = (row, rowId) => {
        return row.status === false ? "rowStatusStyle" : "";
    };

    render() {
        let year;
        const footerData = [
            [
                {
                    label: 'Total',
                    columnIndex: 0
                },
                {
                    label: 'Total value',
                    columnIndex: 3,
                    align: 'right',
                    formatter: (tableData) => {
                        let label = 0;
                        for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                            label += tableData[i].paymentAmount;
                        }
                        return (
                            <strong>{isNaN(label) ? 0 : label}</strong>
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
                            label += tableData[i].refundAmount;
                        }
                        return (
                            <strong>{label}</strong>
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
                            if (tableData[i].issuedRefundAmount && tableData[i].issuedRefundAmount !== null) {
                                label += tableData[i].issuedRefundAmount;
                            }
                        }
                        return (
                            <strong>{label}</strong>
                        );
                    }
                }
            ]
        ];
        return (
            <div>
                <ToastContainer
                    position="top-right"
                    limit={1}
                    className="billtoast"
                />
                {this.props.studentId !== "new" && this.state.isLoading ?
                    <Dimmer active inverted>
                        <Loader content='Data Loading...' active inline='centered' size="medium" />
                    </Dimmer> : null}
                <Row>
                    <Col md={8}></Col>
                    <Col md={4} xs={12}>
                        {this.props.studentId !== "new" ?
                            (<span>
                                <Button disabled={(localStorage.getItem("accesslevel") === "counselor" && (localStorage.getItem("counselorId") !== this.state.counselorId) ? true : false) || ((this.state.billingList && this.state.billingList.length > 0 && this.state.billingList[0].totalPaid === 0) ? true : false)} color="green" className="bill_refundAmount_style" onClick={this.openRefund}>Refund</Button>{""}
                                <Button disabled={localStorage.getItem("accesslevel") === "counselor" && localStorage.getItem("counselorId") !== this.state.counselorId} color="blue" className="bill_O" onClick={this.addRecord}>Add Payment</Button>
                            </span>)
                            :
                            (<span>
                                <Button color="green" className="bill_refundAmount_style" onClick={this.openRefund}>Refund</Button>{""}
                                <Button color="blue" className="bill_O" onClick={this.addRecord}>Add Payment</Button>
                            </span>)
                        }
                    </Col>
                </Row>
                {this.state.billingList.map((payment, index) => (
                    <div key={`${payment._id.createdAt}_${index}`}>
                        {year !== parseInt(payment._id.academicYear) ?
                            <Header as='h6' color='blue' className="bill_N" >AY {year = payment._id.academicYear} -{parseInt(payment._id.academicYear) + 1}</Header>
                            : ''}
                        <Row>
                            <Col md="12" xs="12">
                                <Row>
                                    <Col md="4" xs="12" className="college-info">
                                        <div className="bill_M"><b>College Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; </b></div>
                                        <div className="college-details">
                                            {payment._id.college && payment._id.college.collegeName ? payment._id.college.collegeName :"Not Available"} -- {payment._id.college && payment._id.college.collegeCode ? payment._id.college.collegeCode:""}
                                        </div>
                                        <div className="bill_M"><b>Education Level &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;</b></div>
                                        <div className="college-details">
                                        {payment._id.course.educationLevel ? payment._id.course.educationLevel.education : "Not Available"}</div>
                                        <div className="bill_M"><b>Course Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;</b></div>
                                        <div className="college-details">
                                        {payment._id.courseType && payment._id.courseType.name ? payment._id.courseType.name :"Not Available"}</div>
                                        <div className="bill_M"><b>Course Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;</b></div>
                                        <div className="college-details">
                                        {payment._id.course && payment._id.course.courseName ? payment._id.course.courseName :"Not Available"}</div>
                                        <div className="bill_M"><b>Specialization &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;</b></div>
                                        <div className="college-details">
                                        {payment._id.specialization &&payment._id.specialization.specializationName ? payment._id.specialization.specializationName :"Not Available"}</div>
                                    </Col>

                                    <Col md="2" xs="6" className="label_style">
                                        <span className="bill_M"><b>Actual Tuition Fee</b></span><br />
                                        {payment._id.quota && payment._id.quotapercent ? <span className="bill_M"><b>{payment._id.quota.quotaName?payment._id.quota.quotaName.substring(0, 7):""} Quota - {payment._id.quotapercent}%</b></span> : <span className="bill_M"><b>Quota : 0%</b></span>}<br />
                                        <span className="bill_M"><b>Tuition Fee </b></span><br />
                                        <span className="bill_M"><b>Other Fee</b></span><br />
                                        <span className="bill_M"><b>Total Fee</b></span><br />
                                    </Col>
                                    <Col md="1" xs="2" className="colon_style">:<br />: &nbsp;&nbsp;<b>-</b><br />:<br />: &nbsp;&nbsp;<b>+</b><br />:</Col>
                                    <Col md="1" xs="4" className="align_amount">
                                        {payment._id.tutionFee ? payment._id.tutionFee : 0}<br />
                                        {payment._id.tutionFee && !isNaN(payment._id.tutionFee) ? (payment._id.quotapercent ? (parseInt(payment._id.tutionFee) / 100 * parseFloat(payment._id.quotapercent)) : 0) : 0}<br />
                                        {payment._id.tutionFee && !isNaN(payment._id.tutionFee) ? (payment._id.quotapercent ? (parseInt(payment._id.tutionFee) - parseInt(payment._id.tutionFee) / 100 * parseFloat(payment._id.quotapercent)) : payment._id.tutionFee) : 0}<br />
                                        {payment._id.otherFee ? payment._id.otherFee : 0}<br />
                                        <b>{payment._id.totalFee ? payment._id.totalFee : 0}</b>
                                    </Col>
                                    <Col md="2" xs="6" className="label_style">
                                        <span className="bill_M"><b>Paid Fee</b> </span><br />
                                        <span className="bill_M"><b>Refund Request</b> </span><br />
                                        <span className="bill_M"><b>Refund Made</b> </span><br />
                                        <span className="bill_M"><b>Balance Fee</b>  </span>
                                    </Col>
                                    <Col md="1" xs="2" className="colon_style">:<br />:<br />:<br />:</Col>
                                    <Col md="1" xs="4" className="align_amount">
                                        {payment.totalPaid ? payment.totalPaid : payment._id.paidFee !== undefined && payment._id.paidFee !== null && payment._id.paidFee !== "" ? payment._id.paidFee : 0}<br />
                                        {payment.totalRefund ? payment.totalRefund : payment._id.madeRefundFee !== undefined && payment._id.madeRefundFee !== null && payment._id.madeRefundFee !== "" ? payment._id.madeRefundFee : 0}<br />
                                        {payment.totalConfirmedRefund ? payment.totalConfirmedRefund : payment._id.issuedRefundFee !== undefined && payment._id.issuedRefundFee !== null && payment._id.issuedRefundFee !== "" ? payment._id.issuedRefundFee : 0}<br />
                                        {(payment._id.totalFee || payment.totalPaid) ? ((payment._id.totalFee !== undefined && payment._id.totalFee !== null && payment._id.totalFee !== "" ? payment._id.totalFee : this.state.studentInfo ? parseInt(this.state.studentInfo.otherFee) + parseInt(this.state.studentInfo.defaultFee[this.state.studentInfo.defaultFee.fee]) : 0) - parseInt(payment.totalPaid ? payment.totalPaid : 0) + parseInt(payment.totalConfirmedRefund ? payment.totalConfirmedRefund : 0)) : 0}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Divider horizontal>
                            <Header as='h4'>
                                <span>
                                    <Icon name='dollar sign' color="blue" />
                                    <b color="blue">Payments</b>
                                </span>
                            </Header>
                        </Divider>
                        <Row>
                            <div>
                                <BootstrapTable showFooter={true} data={payment.all} hover multiColumnSearch={true} footerData={footerData} footer trClassName={this.rowClassNameFormat}>
                                    <TableHeaderColumn width='150' dataField='transactionNo' dataSort dataFormat={this.transactionNo} className='tableheaderstyle2global'>Transaction No  </TableHeaderColumn>
                                    <TableHeaderColumn width='100' dataField='paymentMode' dataSort className='tableheaderstyle2global'> Mode </TableHeaderColumn>
                                    <TableHeaderColumn width='100' dataField='billDate' dataSort dataFormat={this.displayPaymentDate} className='tableheaderstyle2global'> Date  </TableHeaderColumn>
                                    <TableHeaderColumn width='100' dataField='paymentAmount' dataSort dataAlign="right" className='tableheaderstyle2global'>Fee Paid </TableHeaderColumn>
                                    <TableHeaderColumn width='150' dataField='refundAmount' dataSort dataAlign="right" className='tableheaderstyle2global'>Refund Requested</TableHeaderColumn>
                                    <TableHeaderColumn width='120' dataField='issuedRefundAmount' dataSort dataAlign="right" className='tableheaderstyle2global'>Refund Made</TableHeaderColumn>
                                    <TableHeaderColumn width='100' dataField='refund_status' dataSort dataFormat={this.refundStatusDisply} className='tableheaderstyle2global'>Refund Status</TableHeaderColumn>
                                    {localStorage.getItem("accesslevel") !== "counselor" ? <TableHeaderColumn width='100' dataField='status' dataSort dataFormat={this.statusDisply} className='tableheaderstyle2global'>Status</TableHeaderColumn> : null}
                                    <TableHeaderColumn width='140' dataField='reasonForAction' dataFormat={this.reasonForAction} dataSort className='tableheaderstyle2global'>Deleted Reason</TableHeaderColumn>
                                    <TableHeaderColumn width='100' dataFormat={this.actions} dataField='_id' isKey dataAlign='center' className='tableheaderstyle2global'>Actions</TableHeaderColumn>
                                </BootstrapTable><hr className="hrstyle" />
                            </div>
                        </Row>
                    </div>
                ))}
                <Modal size="m" isOpen={this.state.openReasonModal} toggle={this.deleteReasonToggle} className='chat_head' backdrop="static">
                    <ModalBody className='chat_m' >
                        <h6><b> <i onClick={() => { this.setState({ openReasonModal : !this.state.openReasonModal  }) }} className="fa fa-close billing_Close_Icon"></i> </b></h6>
                        <h4><b><center>Reason for deleting</center></b></h4>
                        <Input type="text" name="reasonForAction" onChange={this.handleReasonInput} placeholder="Enter reason here..."></Input>
                        {this.state.errorMessage && (<p className='error_message_style'>{this.state.errorMessage}</p>)}
                    </ModalBody>
                    <ModalFooter className='chat_m'>
                        <Button color="grey" onClick={() => { this.setState({ openReasonModal : !this.state.openReasonModal  }) }} >Cancel</Button>{""}
                        <Button color="teal" onClick={(e) => this.deleteReasonSave()} >Save</Button>
                    </ModalFooter>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModal} toggle={this.forEdit.bind(this)} backdrop="static" centered={true}>
                    <ModalBody className="bill_K" >
                        <EditBilling years={this.state.years} toggle={this.forEdit.bind(this)} studentInfo={this.state.studentInfo} _id={this.state._id} studentId={this.state.form.studentId} func={this.forEdit} paymentAmountLimits={this.state.paymentAmountLimits} />
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openView} toggle={this.forView.bind(this)} backdrop="static" centered={true}>
                    <ModalBody className="bill_K">
                        <ViewBilling years={this.state.years} toggle={this.forView.bind(this)} studentInfo={this.state.studentInfo} _id={this.state._id} studentId={this.state.form.studentId} func={this.forView} />
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openRefund} toggle={this.forRefund.bind(this)} backdrop="static" centered={true}>
                    <ModalBody className="bill_K" >
                        <RefundAmount years={this.state.years} toggle={this.forRefund.bind(this)} studentInfo={this.state.studentInfo} _id={this.state._id} studentId={this.state.form.studentId} func={this.forRefund} paymentAmountLimits={this.state.paymentAmountLimits} />
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openRefundView} toggle={this.forViewRefundAmount.bind(this)} backdrop="static" centered={true}>
                    <ModalBody className="bill_K">
                        <ViewRefundAmount years={this.state.years} toggle={this.forViewRefundAmount.bind(this)} studentInfo={this.state.studentInfo} _id={this.state._id} studentId={this.state.form.studentId} func={this.forViewRefundAmount} />
                    </ModalBody>
                </Modal>
                <Row>
                    <center>
                        <Button type="button" className="btn_alignment_A" positive onClick={() => this.props.handleManualTabChange(1)}>  &laquo; Prev</Button>
                        <Button type="button" className="btn_alignment_B" positive onClick={() => this.props.handleManualTabChange(3)} >Next &raquo;</Button>
                    </center>
                </Row>
            </div>
        );
    }
}