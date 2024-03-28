import React from "react";
import { Col, Row, Badge, Card, Modal, CardBody, ModalBody } from "reactstrap";
import { Button } from "semantic-ui-react";
import 'bootstrap/dist/css/bootstrap.css';
import Axios from "../../../../AxiosConfig/config";
import moment from "moment";
import './style.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { toast } from "react-toastify";
import { ButtonGroup } from "react-bootstrap";
export default class ViewBilling extends React.Component {
    state = {
        view: null,
        studentInfo: this.props.studentInfo,
        studentId: this.props.studentId,
        _id: this.props._id,
        form: {
            studentId: this.props.studentId,
            billing: null,
            billingType: null,
            academicYear: null,
            bill_date: null,
            payment_amount: null,
            transactionNo: null,
            payment_mode: null,
            payment_status: null,
            fileName: null,
            educationYear: null,
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
            link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/billing/view/" + image;
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
                        studentId: data.student ? data.student : null,
                        academicYear: data.academicYear,
                        bill_date: moment(data.billDate).format("DD-MM-YYYY"),
                        payment_amount: data.paymentAmount,
                        transactionNo: data.transactionNo,
                        hostelYear: moment(data.hostelYear).format("YYYY"),
                        payment_mode: data.paymentMode,
                        fileName: data.reciept_fileName,
                        educationYear: data.educationYear,
                        status: data.status,
                    }
                    this.setState({
                        _id: _id,
                        form: form,
                        bill_path: data.reciept_path,
                    })
                }
            })
            .catch((e) => {
                toast.error("Unable to get payment")
            })
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
                                    <img className="billing_image" src={process.env.REACT_APP_BACKEND_API_URL + "bec/billing/view/" + this.state.image} alt="Payment recipt"/>
                                </TransformComponent>
                            </TransformWrapper>
                        </Card>
                    </ModalBody>
                </Modal>
                <Card className="edit_bill_A">
                    <h6 ><b className="edit_bill_B">Admission details :</b> <i onClick={() => this.props.toggle()}  className="fa fa-close billiconstyle"></i></h6>
                    <Row >
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    ERP Number{"  "}
                                    <span className="edit_bill_D">
                                        <b>{(this.state.studentInfo) && (this.state.studentInfo.applicationNo) ? this.state.studentInfo.applicationNo : <Badge color="warning" className="add_Payment">Not issued</Badge>}</b>
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Student Name{" "}
                                    <span className="edit_bill_E">
                                        {this.state.studentInfo ? this.state.studentInfo.fullName.label : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Gender{" "}
                                    <span className="edit_bill_E">
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
                                    <span className="edit_bill_E">
                                        {this.state.studentInfo && this.state.studentInfo.college && this.state.studentInfo.college.collegeName? this.state.studentInfo.college.collegeName : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Group{" "}
                                    <span className="edit_bill_E">
                                        {this.state.studentInfo && this.state.studentInfo.courseName && this.state.studentInfo.course.courseName && this.state.studentInfo.specialization && this.state.studentInfo.specialization.specializationName 
                                         ? this.state.studentInfo.course.courseName + "--" + this.state.studentInfo.specialization.specializationName : "Not Available"}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    Joining Academic Year{" "}
                                    <span className="edit_bill_E">
                                        {this.state.studentInfo ? this.state.studentInfo.academicYear.label : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card className="edit_bill_F">
                    <h6 ><b className="edit_bill_B">Payment details :</b></h6>
                    <Row>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>For Year</b>{" "}
                                    <span className="edit_bill_E">
                                        {this.state.form.academicYear ? this.state.form.academicYear.label : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Parsing Year</b>{" "}
                                    <span className="edit_bill_E">
                                        {this.state.form.educationYear ? this.state.form.educationYear + " year" : null}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    <b>Payment Date</b>{" "}
                                    <span className="edit_bill_E">
                                        {this.state.form.bill_date}
                                    </span>
                                </p>
                            </div>
                        </Col>
                    </Row><br />
                    <Row>
                        <Col md={4}>
                            <div className="heading" >
                                <p className="titile">
                                    <b>Payment Mode</b>{" "}
                                    <span className="edit_bill_E">
                                        {this.state.form.payment_mode}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    <b>Payment Amount</b>{" "}
                                    <span className="edit_bill_E">
                                        {this.state.form.payment_amount}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="heading">
                                <p className="titile">
                                    <b>Transaction No</b>{" "}
                                    <span className="edit_bill_E">
                                        {this.state.form.transactionNo}
                                    </span>
                                </p>
                            </div>
                        </Col>
                        <Col>
                            <h6 ><b className="edit_bill_B">Receipts :</b></h6>                           
                            {this.state.bill_path !== null && this.state.bill_path !== undefined ?
                                <Card className="billcardstyle">
                                    <img
                                        src={
                                            process.env.REACT_APP_BACKEND_API_URL + "bec/billing/view/" + this.state.form.fileName
                                        }
                                        className='img'
                                        height={120}
                                        width={148}
                                        alt="preview"
                                    />
                                    <center>
                                        <CardBody>
                                            <ButtonGroup>
                                                <Button title="Preview" icon="eye" size="small" color="green" onClick={() => this.previewImage(this.state.form.fileName)}></Button>{" "}
                                                <Button title="Download" icon="download" size="small" color="green" onClick={() => this.downloadImage(this.state.form.fileName)}></Button>
                                            </ButtonGroup>
                                        </CardBody>
                                    </center>
                                </Card>
                                : <span className="view_bill_I">No receipts available</span>}
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}