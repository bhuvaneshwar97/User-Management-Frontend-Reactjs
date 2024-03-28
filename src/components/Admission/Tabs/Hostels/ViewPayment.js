import React from "react";
import { Col, Row, Card, Badge, CardBody, Modal, ModalBody } from "reactstrap";
import { Button } from "semantic-ui-react";
import { ButtonGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import Axios from "../../../../AxiosConfig/config";
import moment from "moment";
import './style.css'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default class ViewPayment extends React.Component {
    state = {
        view: null,
        studentInfo: this.props.studentInfo,
        studentId: this.props.studentId,
        _id: this.props._id,
        form: {
            residential: null,
            studentId: this.props.studentId,
            academicYear: null,
            bill_date: null,
            payment_amount: null,
            payment_mode: null,
            payment_status: null,
            fileName: null,
            hostelYear: null
        },
        bill_path: null,
        image: "",
        viewModal: false
    }
    componentDidMount() {
        this.showDataById(this.state._id);
    }
    previewImage = (image) => {
        if (image !== undefined) {
            this.setState({ viewModal: true, image: image })
        }
    }
    downloadImage = (image) => {
        if (image !== undefined) {
            const link = document.createElement("a");
            link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/payment/view/" + image;
            link.setAttribute("download", image);
            document.body.appendChild(link);
            link.click();
        }
    }
    showDataById = (_id) => {
        Axios.get(`/bec/payment/get/${_id}`)
            .then((response) => {
                if (response.data.status === 200) {
                    let data = response.data.data;
                    let form = {
                        residential: data.residential ? data.residential : null,
                        studentId: data.student ? data.student : null,
                        academicYear: data.academicYear ? data.academicYear : null,
                        bill_date: moment(data.billDate).format("YYYY-MM-DD"),
                        payment_amount: data.paymentAmount,
                        hostelYear: moment(data.hostelYear).format("YYYY"),
                        payment_mode: data.paymentMode,
                        transactionNo: data.transactionNo,
                        fileName: data.reciept_fileName,
                        status: data.status,
                    }
                    this.setState({
                        _id: _id,
                        form: form,
                        bill_path: data.reciept_path,
                    })
                }
            })
            .catch(error => {
                toast.error("Unable to load payments")
            });
    };
    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.state.viewModal}>
                    <ModalBody className='chat_m'>
                        <Card >
                            <h6><b> <i onClick={() => { this.setState({ viewModal: false }) }} className="fa fa-close billing_Close_Icon"></i> </b></h6>
                            <TransformWrapper>
                                <TransformComponent>
                                    <img className="billing_image" src={process.env.REACT_APP_BACKEND_API_URL + "bec/payment/view/" + this.state.image} alt="paymentrecipt" />
                                </TransformComponent>
                            </TransformWrapper>
                        </Card>
                    </ModalBody>
                </Modal>
                <ToastContainer />
                <Card className="viewPayment_style_A">
                    <h6 ><b className="viewPayment_style_B">Admission details :</b> <i onClick={() => this.props.toggle()} className="fa fa-close viewPayment_style_C"></i></h6>
                    <Row >
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    ERP Number{"  "}
                                    <span className="viewPayment_style_D">
                                        <b>{(this.state.studentInfo) && (this.state.studentInfo.applicationNo) ? this.state.studentInfo.applicationNo : <Badge color="warning" className="add_Payment">Not issued</Badge>}</b>
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Student Name{" "}
                                    <span className="viewPayment_style_E">
                                        {this.state.studentInfo ? this.state.studentInfo.fullName.label : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Gender{" "}
                                    <span className="viewPayment_style_E">
                                        {this.state.studentInfo ? this.state.studentInfo.gender : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    College Name{" "}
                                    <span className="viewPayment_style_E">
                                        {this.state.studentInfo ? this.state.studentInfo.college.collegeName : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Group{" "}
                                    <span className="viewPayment_style_E">
                                        {this.state.studentInfo ? this.state.studentInfo.course.courseName + "--" + this.state.studentInfo.specialization.specializationName : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Joining Academic Year{" "}
                                    <span className="viewPayment_style_E">
                                        {this.state.studentInfo ? this.state.studentInfo.academicYear.label : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="viewPayment_style_F">
                    <h6 ><b className="viewPayment_style_G">Hostel Details :</b></h6>
                    <Row>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Hostel Name</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.residential && this.state.form.residential.hostel && this.state.form.residential.hostel.hostelName ? this.state.form.residential.hostel.hostelName : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Hostel Type</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.residential && this.state.form.residential.hostelType && this.state.form.residential.hostelType.label ? this.state.form.residential.hostelType.label : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Hostel Address</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.residential && this.state.form.residential.hostel && this.state.form.residential.hostel.address ? this.state.form.residential.hostel.address : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row><br />
                    <Row>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Hostel Phone</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.residential && this.state.form.residential.hostel && this.state.form.residential.hostel.phone ? this.state.form.residential.hostel.phone : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Hostel Fee</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.residential && this.state.form.residential.hostel && this.state.form.residential.hostel.fee ? this.state.form.residential.hostel.fee : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row><br />
                    <h6 ><b className="viewPayment_style_G">Payment details :</b></h6>
                    <Row>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Academic Year</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.academicYear ? this.state.form.academicYear.label : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    <b>Payment Date</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.bill_date}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Payment Mode</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.payment_mode}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row><br />
                    <Row>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    <b>Payment Amount</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.payment_amount}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    <b>Transaction No</b>{" "}
                                    <span className="viewPayment_style_H">
                                        {this.state.form.transactionNo}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>                                           
                            <b className="receiptsName_style">Receipts : </b>
                            {this.state.bill_path != null && this.state.bill_path !== undefined ?
                                <Card className="view_modal_C">
                                    <img
                                        src={
                                            process.env.REACT_APP_BACKEND_API_URL + "bec/payment/view/" + this.state.form.fileName
                                        }
                                        className='img'
                                        height={120}
                                        width={148}
                                        alt="preview"
                                    />
                                    <center className="center_button_style">
                                        <CardBody>
                                            <ButtonGroup>
                                                <Button title="Preview" icon="eye" size="small" color="green" className="viewPayment_style_J" aria-hidden="true" onClick={() => this.previewImage(this.state.form.fileName)}></Button>
                                                <Button title="Download" icon="download" size="small" color="green" className="viewPayment_style_J" aria-hidden="true" onClick={() => this.downloadImage(this.state.form.fileName)}></Button>
                                            </ButtonGroup>
                                        </CardBody>
                                    </center>
                                </Card> : <span className="viewPayment_style_K">No receipts available</span>}
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}