import { Form, Formik } from 'formik';
import React from 'react';
import Axios from "../../AxiosConfig/config";
import "react-toastify/dist/ReactToastify.css";
import { Button, Grid , Icon } from 'semantic-ui-react';
import InputField from '../../hoc/InputFields';
import * as Yup from "yup";
import {Col, Input, Row, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label } from "reactstrap";
import AdmissionTable from './AdmissionTable';
import './style.css'
import { toast } from 'react-toastify';
export default class AdmissionFilter extends React.Component {
    state = {
        fetchedItems: [],
        isOpen: false,
        admissionStartDate: "",
        admissionEndDate: "",
        academicYear: localStorage.getItem('academicYear') ? { label: "AY " + localStorage.getItem('academicYear') + " - " + (parseInt(localStorage.getItem('academicYear')) + 1), value: localStorage.getItem('academicYear') } : null,
        erpNo: "",
        admNumber: "",
        fullName: "",
        adhar: "",
        whatsappNum: "",
        studentEmail: "",
        father: "",
        gender: "",
        state: "",
        district: "",
        college: "",
        course: "",
        status: { value: "", label: "All" },
        counselor: "",
        stateOptions: [],
        academicYears: [],
        genderOptions: [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }],
        statusOptions: [{ value: "", label: "All" }, { value: "full_paid", label: "Full paid" }, { value: "instalment", label: "Instalment" }, { value: "pending", label: "Pending" }, { value: "cancelled", label: "Cancelled" },
        { value: "refund", label: "Refund" }, { value: "rejoin", label: "Rejoin" }],
        filterData: null,
        type: "",
        userOptions: [],
        searchInput:"",
        search:false,
        paymentStatus:"",
        paymentOptions: [{ value: null, label: "All" }, { value: true, label: "Paid" }, { value: false, label: "Unpaid" }]
    }
    componentDidMount() {
        const years = this.state.academicYears;
        let currentAcadamicYear = localStorage.getItem('academicYear') ? (parseInt(localStorage.getItem('academicYear')) + 5) : null;
        let firstYear = 2020;
        for (let i = 2020; i <= (currentAcadamicYear); i++) {
            years.push({ label: "AY " + firstYear + " - " + parseInt(firstYear + 1), value: firstYear });
            firstYear++;
        }
        let filterDetails = null;
        let filterOptions = null;
        if (this.props.match.params && this.props.match.params.filter && this.props.match.params.filter !== null && this.props.match.params.filter !== undefined && this.props.match.params.filter === 'all') {
            filterDetails = {};
            filterOptions = {};
            filterDetails.status = '';
            filterOptions.status = { value: "", label: "All" };
            filterDetails.academicYear = this.state.academicYear;
            filterOptions.academicYear = this.state.academicYear;
        }
        if (this.props.match.params && this.props.match.params.state && this.props.match.params.state !== null && this.props.match.params.state !== undefined) { //related to state
            filterDetails = {};
            filterOptions = {};
            filterDetails.state = this.props.match.params._id;
            filterOptions.state = { value: this.props.match.params._id, label: this.props.match.params.state };
            filterDetails.academicYear = this.state.academicYear;
            filterOptions.academicYear = this.state.academicYear;
        }
        if (this.props.match.params && this.props.match.params.district && this.props.match.params.district !== null && this.props.match.params.district !== undefined) { //related to district
            filterDetails = {};
            filterOptions = {};
            filterDetails.district = this.props.match.params._id;
            filterOptions.district = { value: this.props.match.params._id, label: this.props.match.params.district };
            filterDetails.academicYear = this.state.academicYear;
            filterOptions.academicYear = this.state.academicYear;
        }
        if (this.props.match.params && this.props.match.params.counselor && this.props.match.params.counselor !== null && this.props.match.params.counselor !== undefined) { //related to counselor
            filterDetails = {};
            filterOptions = {};
            filterDetails.counselor = this.props.match.params._id;
            filterOptions.counselor = { value: this.props.match.params._id, label: this.props.match.params.counselor };
            filterDetails.academicYear = this.state.academicYear;
            filterOptions.academicYear = this.state.academicYear;
        }
        if (this.props.match.params && this.props.match.params.course && this.props.match.params.course !== null && this.props.match.params.course !== undefined) { //related to course
            filterDetails = {};
            filterOptions = {};
            filterDetails.course = this.props.match.params._id;
            filterOptions.course = { value: this.props.match.params._id, label: this.props.match.params.course };
            filterDetails.academicYear = this.state.academicYear;
            filterOptions.academicYear = this.state.academicYear;
        }
        this.setState({ filterData: filterDetails, filterOptions: filterOptions, academicYears: years, })
        this.getAllStates();
        this.getAllColleges()
        this.getAllCourses();
        if (localStorage.getItem("accesslevel") !== "counselor") {
            this.getAllUsers();
        }             
    }    
    schema = () => {
        return Yup.object().shape({
            status: Yup.object().nullable().required("Status is required"),
            erpNo: Yup.string().matches(/^[a-zA-Z0-9]+$/, "ERP Number cannot contain white space and special character"),
            admNumber: Yup.string().matches(/^[a-zA-Z0-9]+$/, "Admission Number cannot contain white space and special character"),
            fullName: Yup.string().matches(/^[aA-zZ\s]+$/, "Student Name cannot contain white space and special character and numbers"),
            adhar: Yup.string().matches(/^\d/g, "Aadhaar Number cannot contain alphabets and special characters").max(12, "Aadhaar Number should contain only 12 digits"),
            whatsappNum: Yup.string().matches(/^\d/g, "Phone Number cannot contain alphabets and special characters").min(10, "Phone Number should contain 10 digits").max(10, "Phone Number should contain only 10 digits"),
            father: Yup.string().matches(/^[aA-zZ\s]+$/, "Father Name cannot contain white space and special character and numbers"),
            studentEmail: Yup.string().email('Student mail is invalid'),
        });
    };
    getAllStates = () => {
        Axios.get('/bec/state/getAll').then(response => {
            const stateArray = [];
            if (response.data.status === 200) {
                response.data.data.map((state, index) => (
                    stateArray.push({ value: state._id, label: state.state })
                ))
                this.setState({ ...this.state, stateOptions: stateArray })
            }
        }).catch((e) => {
            toast.error("Unable to get states")
        })
    }
    districtOptions = [];
    districtDependable = (data) => {
        if (data) {
            this.districtOptions = [];
            Axios.get(`bec/districts/getDistrictsByState/${data.value}`).then(response => {
                if (response.status === 200) {
                    response.data.data.map((mapdata, index) => (
                        this.districtOptions[index] = { value: mapdata._id, label: mapdata.district }
                    ))
                }
            }).catch((e) => {
                toast.error("Unable to get districs")
            })
        } else {
            this.setState({ type: "" })
        }
    }
    getAllUsers = () => {
        Axios.get('bec/users/dropdown')
            .then((response) => {
                let users = []
                response.data.data.map((mapdata, index) => (
                    users.push({ value: mapdata._id, label: mapdata.fullName })
                ))
                this.setState({ userOptions: users })
            })
            .catch((error) => {
                toast.error("Unable to get all users")
            });
    }
    getAllColleges = () => {
        Axios.get(`bec/college/getAll`).then((response) => {
            if (response.data.status === 200) {
                let collegesArray = [];
                response.data.data.map((college, index) => (
                    collegesArray.push({ value: college._id, label: college.collegeName })
                ))
                this.setState({ ...this.state, collegeOptions: collegesArray })
            }
        }).catch((e) => {
            toast.error("Unable to get colleges")
        })
    }
    getAllCourses = () => {
        Axios.get('/bec/course/getAll').then(response => {
            const courseArray = [];
            response.data.data.map((course, index) => (
                courseArray.push({ value: course._id, label: course.courseName })
            ))
            this.setState({ ...this.state, courseOptions: courseArray })
        }).catch((e) => {
            toast.error("Unable to get courses")
        })
    }
    onSubmit = (e) => {
        const filterDetails = {};
        const filterOptions = {};
        if (e.status !== "" && e.status !== undefined && e.status !== null) {
            filterDetails.status = e.status.value;
            filterOptions.status = e.status;
        }
        if (e.academicYear !== "" && e.academicYear !== undefined && e.academicYear !== null) {
            filterDetails.academicYear = e.academicYear;
            filterOptions.academicYear = e.academicYear;
        }
        if (e.erpNo !== "" && e.erpNo !== undefined && e.erpNo !== null) {
            filterDetails.applicationNo = e.erpNo;
            filterOptions.applicationNo = e.erpNo;
        }

        if (e.admNumber !== "" && e.admNumber !== undefined && e.admNumber !== null) {
            filterDetails.admissionNo = e.admNumber;
            filterOptions.admissionNo = e.admNumber;
        }

        if (e.adhar !== "" && e.adhar !== undefined && e.adhar !== null) {
            filterDetails.adhaarCardNo = e.adhar;
            filterOptions.adhaarCardNo = e.adhar;
        }
        if (e.fullName !== undefined && e.fullName !== "" && e.fullName !== null) {
            filterDetails.fullName = e.fullName;
            filterOptions.fullName = e.fullName;
        }
        if (e.whatsappNum !== "" && e.whatsappNum !== undefined && e.whatsappNum !== null) {
            filterDetails.stdWtsAppNo = e.whatsappNum;
            filterOptions.stdWtsAppNo = e.whatsappNum;
        }
        if (e.studentEmail !== "" && e.studentEmail !== undefined && e.studentEmail !== null) {
            filterDetails.stdEmail = e.studentEmail;
            filterOptions.stdEmail = e.studentEmail;
        }
        if (e.father !== "" && e.father !== undefined && e.father !== null) {
            filterDetails.fatherName = e.father;
            filterOptions.fatherName = e.father;
        }
        if (e.gender !== "" && e.gender !== undefined && e.gender !== null) {
            filterDetails.gender = e.gender.value;
            filterOptions.gender = e.gender;
        }
        if (e.college !== "" && e.college !== undefined && e.college !== null) {
            filterDetails.college = e.college.value;
            filterOptions.college = e.college;
        }
        if (e.course !== "" && e.course !== undefined && e.course !== null) {
            filterDetails.course = e.course.value;
            filterOptions.course = e.course;
        }
        if (e.state !== "" && e.state !== undefined && e.state !== null) {
            filterDetails.state = e.state.value;
            filterOptions.state = e.state;
        }
        if (e.district !== undefined && e.district !== null && e.district !== "") {
            filterDetails.district = e.district.value;
            filterOptions.district = e.district;
        }
        if (e.admissionStartDate !== "" && e.admissionStartDate !== undefined) {
            filterDetails.applicationFromDate = e.admissionStartDate;
            filterOptions.applicationFromDate = e.admissionStartDate;
        }
        if (e.admissionEndDate !== "" && e.admissionEndDate !== undefined) {
            filterDetails.applicationToDate = e.admissionEndDate;
            filterOptions.applicationToDate = e.admissionEndDate;
        }
        if (e.counselor !== "" && e.counselor !== undefined && e.counselor !== null) {
            filterDetails.counselor = e.counselor.value;
            filterOptions.counselor = e.counselor;
        }
        if (e.paymentStatus !== "" && e.paymentStatus !== undefined && e.paymentStatus !== null) {
            filterDetails.paymentStatus = e.paymentStatus.value;
            filterOptions.paymentStatus = e.paymentStatus;
        }  
        this.setState({...e ,filterData: filterDetails, filterOptions: filterOptions , search:true})
    }
    getBackFunction = (e) => {       
        this.setState({
            search:false,                             
        })
    }
    setQuery = () => {     
        if(this.state.searchInput) {
            let payload = {
                text: this.state.searchInput !==null && this.state.searchInput !== undefined && this.state.searchInput  !=="" ? this.state.searchInput :""
            };
            if(localStorage.getItem('academicYear')){
                payload.academicYear = { label: "AY " + localStorage.getItem('academicYear') + " - " + (parseInt(localStorage.getItem('academicYear')) + 1), value: localStorage.getItem('academicYear') }
            }
            Axios.post(`bec/admission/search?page=1&limit=5`, payload)
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            isOpen: res.data.data.data.docs.length > 0 ? true : false,
                            fetchedItems: res.data.data.data.docs
                        })
                    }
                })
                .catch(err => { console.log(err) })
        }
        else{
            this.setState({
                isOpen: false,
                fetchedItems: []
            })
        }
    }      
    handleClear=()=>{
        this.setState({            
            erpNo: "",
            admNumber: "",
            fullName: "",
            adhar: "",
            whatsappNum: "",
            studentEmail: "",
            father: "",
            gender: "",
            state: "",
            district: "",
            college: "",
            course: "",
            status: { value: "", label: "All" },
            counselor: "",
            admissionStartDate:"",
            admissionEndDate:""
        })
    }
    render() {
        return (
            this.state.search === false ?
                (<Formik
                    enableReinitialize={true}
                    initialValues={this.state}
                    validationSchema={this.schema}
                    onSubmit={this.onSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <Grid columns='equal' stackable>
                                <Grid.Row className='admissionFilter_row'>
                                   <Grid.Column >
                                   <span className="admissionFillter_style_A" size="large" ><i className="fa fa-address-card-o"></i>
                                            {" "} Admission Filter
                                        </span>
                                        <Button color="green" compact  style={{float:"right"}} onClick={() => { this.props.history.push("/alladmissions/list/admissions/createadmission/new") }}>New Student</Button>
                                    </Grid.Column> 
                                </Grid.Row>
                                <Grid.Row className="admissionFillter_style_B">
                                    <Grid.Column>
                                        <Grid.Row>
                                            <Col md={8} >
                                                <Dropdown className='dropdown-colmun' toggle={() => this.setState({ false: !this.state.isOpen })} isOpen={this.state.isOpen}>
                                                    <Label>Search Admission</Label>
                                                    <DropdownToggle className='searchDropdown'>                                                        
                                                        <Input className='searchInFilter'name='searchInput' value={this.state.searchInput} onChange={(e) =>{this.setState({searchInput:e.target.value} ,()=>{if(this.state.searchInput){this.setQuery()}})}} placeholder="Search with name, email, phone, erp, admission no" />                                                      
                                                        <Icon name="close" className="searchAdmissionCloseIcon" onClick={()=>this.setState({searchInput:""} , ()=>this.setQuery())}></Icon> 
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        {this.state.fetchedItems.map((item) => (
                                                            <div key={item.admissionNo} className='div-dropdown-item'>
                                                                <DropdownItem onClick={() => { this.props.history.push("/alladmissions/list/admissions/createadmission/" + item._id) }} className='dropdownItemfilter' key={item.adhaarCardNo}>
                                                                    <p style={{ marginBottom: 0 }} key={item.fullName}>
                                                                        <span className='dropdownItem-left'>Student Name:</span>{item.fullName ? <span className='dropdownItem-right'>{item.fullName.label},</span> : null}
                                                                        <span className='dropdownItem-left'>ERP No:</span>{item.applicationNo ? <span className='dropdownItem-right'>{item.applicationNo},</span> : null}
                                                                    </p>
                                                                    <p style={{ marginBottom: 0 }} key={item.stdWtsAppNo}>
                                                                        <span className='dropdownItem-left'>Admission No:</span>{item.admissionNo ? <span className='dropdownItem-right'>{item.admissionNo},</span> : null}
                                                                        <span className='dropdownItem-left'>Phone No:</span>{item.stdWtsAppNo ? <span className='dropdownItem-right'>{item.stdWtsAppNo},</span> : null}

                                                                    </p>
                                                                    <p style={{ marginBottom: 0 }} key={item.stdEmail}>
                                                                        <span className='dropdownItem-left'>Email:</span>{item.stdEmail ? <span className='dropdownItem-right'>{item.stdEmail}</span> : null}
                                                                    </p>
                                                                </DropdownItem>
                                                            </div>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                        </Grid.Row><hr style={{border:'solid 1px'}}/>
                                        <Grid.Row>
                                            <InputField label='Status' isClearable={true} inputtype='select' fieldSize="4" name='status' mandatoryField="true" type='select' options={this.state.statusOptions} placeholder='Select status' />
                                            <InputField label='Payment Status' isClearable={true} inputtype='select' fieldSize='4' name='paymentStatus' type='select' options={this.state.paymentOptions} placeholder='Select one option' />            
                                            <InputField label='ERP Number' inputtype='text' fieldSize='4' name='erpNo' type='text' placeholder='Enter ERP number' />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <InputField label='Admission Number' inputtype='text' fieldSize='4' name='admNumber' type='text' placeholder='Enter admission number' value={values.admNumber.toUpperCase()} />
                                            <InputField label='Aadhaar Card Number' inputtype='number' fieldSize='4' name='adhar' type='number' placeholder='Enter aadhaar number' />
                                            <InputField label='Student Full Name' inputtype='text' fieldSize='4' name='fullName' type='text' placeholder='Enter student full name' onChange={(e) => setFieldValue('fullName', e.target.value.toUpperCase())} />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <InputField label='Student Whatsapp Number' inputtype='number' fieldSize='4' name='whatsappNum' type='number' placeholder="Enter student whatsapp number" />
                                            <InputField label='Student Email' inputtype='email' fieldSize='4' name='studentEmail' type='email' placeholder='Enter student email' />
                                            <InputField label='Father Name' inputtype='text' fieldSize='4' name='father' type='text' placeholder='Enter father name' onChange={(e) => setFieldValue('father', e.target.value.toUpperCase())} />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <InputField label='College' isClearable={true} inputtype='select' fieldSize="4" name='college' type='select' options={this.state.collegeOptions} placeholder='Select college' />
                                            <InputField label='Course' isClearable={true} inputtype='select' fieldSize="4" name='course' type='select' options={this.state.courseOptions} setValue={this.specializationDependable} placeholder='Select course' />
                                            <InputField label='State' isClearable={true} inputtype='select' fieldSize="4" name='state' type='select' placeholder='Select state' options={this.state.stateOptions} setValue={(e) => { this.districtDependable(e); setFieldValue("district", null) }} />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <InputField label='District' isClearable={true} inputtype='select' fieldSize="4" name='district' type='select' placeholder='Select district' options={this.districtOptions} />
                                            <InputField label='Registered From Date' inputtype='date' fieldSize='4' name='admissionStartDate' type='date' placeholder='Enter admission date' />
                                            <InputField label='Registered To Date' inputtype='date' fieldSize='4' name='admissionEndDate' type='date' placeholder='Enter admission date' />
                                        </Grid.Row>
                                        <Grid.Row>
                                            <InputField label='Academic Year' inputtype='select' isClearable={true} options={this.state.academicYears} fieldSize='4' name='academicYear' type='select' placeholder='Enter academic year' />
                                            <InputField label='Gender' isClearable={true} inputtype='select' fieldSize='4' name='gender' type='select' options={this.state.genderOptions} placeholder='Select gender' />
                                            {localStorage.getItem("accesslevel") !== "counselor" && (<InputField label='Counselor' isClearable={true} inputtype='select' fieldSize='4' name='counselor' type='select' placeholder='Select counselor' options={this.state.userOptions} />)}
                                        </Grid.Row>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Row>
                                <Col xs={3} md={5} lg={4}></Col>
                                <Col xs={3} md={1} lg={1}>
                                    <Button basic type="reset" color='black' content='Clear' onClick={()=>this.handleClear()} />
                                </Col>
                                <Col xs={2} md={1} lg={1} className='admissionsearch'>
                                    <Button color="red" type="submit">Search</Button>
                                </Col>
                                <Col xs={4} md={5} lg={6}></Col>
                            </Row>
                        </Form>
                    )}
                </Formik>) :
                <AdmissionTable filterData={this.state.filterData} history={this.props.history} getBack={this.getBackFunction} filterOptions={this.state.filterOptions} />
        )
    }
}