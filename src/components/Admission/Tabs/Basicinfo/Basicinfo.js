import React, { Component } from "react";
import { Button, Icon, Dimmer, Loader, Checkbox } from "semantic-ui-react";
import { Formik, Form, ErrorMessage } from "formik";
import InputField from "../../../../hoc/InputFields";
import Axios from "../../../../AxiosConfig/config";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import 'bootstrap/dist/css/bootstrap.css';
import moment from "moment";
import { Badge, Col, Label, Input, Row,Card, Modal, CardBody, ModalBody } from "reactstrap";
import Swal from "sweetalert2";
import schema from './schema';
import Accordion from 'react-bootstrap/Accordion';
import dummyimage from '../../../../assets/img/brand/dummy_image.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ButtonGroup } from "react-bootstrap";
import Select from 'react-select';
import html2pdf from 'html2pdf.js';
export default class Basicinfo extends Component {
    state = {
        errorMessage: "",
        years: [],
        enableFields: true,
        studentFormWithoutUpload: {
            studentFirstName: "",
            studentLastName: "",
            studentFullName: "",
            motherName: "",
            fatherName: "",
            birthPlace: "",
            birthDate: "",
            bloodGroup: "",
            aadhaarNumber: "",
            address: "",
            comments: "",
            studentWhatsappNumber: "",
            parentContactNumber: "",
            studentMailId: "",
            parentMailId: "",
            sports: "",
            langusgesKnown: "",
            pincode: "",
            state: "",
            district: "",
            adharDistrict: "",
            college: "",
            specialization: "",
            academicYear: "",
            course: "",
            defaultFee: "",
            otherFee: "",
            totalFee: 0,
            paidFee: "",
            nationality: "",
            religion: "",
            paymentLink: "",
            erpNo: "",
            admissionNo: '',
            gender: "",
            domicileState:"",
            id: this.props.id,
            standardFee: '',
            maritFee: [],
            permanentAddress: "",
            confirmedFee: 0,
            confirmedFeeType: null,
            feeType: "",
            erpNo_edit: false,
            addEducation: false,
            percentage: null,
            counselor_id: "",
            counselor_name: "",
            createdBy: "",
            enteredBy: "",
            education: "",
            collegeName: "",
            areaName: "",
            campusName: "",
            isFeeConfirmed: false,
            educationLevel: '',
            lastStudiedTown: null,
            lastStudiedState: "",
            lastStudiedDistrict: "",
            lastStudiedCollegeType: null,
            quota:null,
            quotapercent: "",
            aadharimgcount:"",
            courseType: ""
        },
        studentCurrentStatusData: "",
        feeStructure: [],
        educationLevels: [],
        studentFullNameOptions: [],
        aadhaarFilesSelection: [],
        aadhaarFilesSelectionUrl: [], 
        stateOptions: [],
        districtOptions: [],
        aadhaarDistrictOptions: [],
        collegeOptions: [],
        specializationOptions: [],
        academicYearOptions: [],
        courseOptions: [],
        activeIndex: 1,
        student_img_path: "",
        student_img_url: dummyimage,
        quotaOptions:[],
        genderOptions: [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Others", label: "Others" }],
        domicileStateOptions:[{value:"South India" , label:"South India"} , {value:"Other than South India" , label:"Other than South India"}],
        bloodGroupOptions: [],
        languagesOptions: [],
        sportsOptions: [],
        nationality: [],
        religion: [],
        isLoading: false,
        aadharImage: "",
        aadharViewModal: false,
        aadhaarExists: false,
        lastStudiedCollegeTypeOptions: [{ value: "IIT", label: "IIT" }, { label: "NIT", value: "NIT" }, { label: "EAMCET", value: "EAMCET" }, { label: "MEDICO", value: "MEDICO" }, { label: "OTHERS", value: "OTHERS" }],
        courseTypeOptions: []
    };
    studentFileUpload = (e) => {
        this.props.onlyImage(URL.createObjectURL(e.target.files[0]));
        if (e.target.files.length !== 0) {
            this.setState({ ...this.state, student_img_path: e.target.files[0], student_img_url: URL.createObjectURL(e.target.files[0]) });
        }
        document.getElementById('imageUpload').value = null;
    }
    studentPictureUpload = (id) => {
        if (this.state.student_img_path !== null && this.state.student_img_path !== undefined && this.state.student_img_path !== "" && typeof this.state.student_img_path === 'object') {
            let formdata = new FormData();
            formdata.append('image', this.state.student_img_path);
            Axios.post('/bec/stdimage/upload/' + id, formdata)
                .then(imgRes => {
                    if (imgRes.data.status === 201) {
                        toast.success("Student picture uploaded successfully.!")
                    }
                })
                .catch((e) => {
                    toast.error("Unable to upload the student picture")
                })
        }
    }
    studentPicDelete = () => {
        if (this.state.student_img_url !== '' && this.state.student_img_url !== undefined && typeof this.state.student_img_path === 'object') {
            this.props.onlyImage(null);
            this.setState({ ...this.state, student_img_url: dummyimage, student_img_path: null })
        }
        else {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    Axios.delete(`bec/image/delete/${this.state.studentFormWithoutUpload.id}/image`).then((res) => {
                        if (res.data.status === 200) {
                            this.props.onlyImage(null);
                            this.setState({
                                ...this.state,
                                student_img_path: null
                            })
                        }
                    })
                        .catch((e) => {
                            toast.error("Unable to delete the student photo")
                        })
                }
            })
        }
    }
    viewAadhaarsBeforeUpload = (image) => {
        const src = URL.createObjectURL(image);
        return src;
    }
    aadhaarPictureUpload = (id) => {
        if (this.state.aadhaarFilesSelection !== undefined && this.state.aadhaarFilesSelection !== null && this.state.aadhaarFilesSelection.length > 0) {
            let formdata = new FormData();
          
            [...this.state.aadhaarFilesSelection].map(image => {
               return formdata.append('images', image)
            })
            Axios.post('/bec/adhaar/upload/' + id, formdata)
                .then(imgRes => {
                    if (imgRes.data.status === 201) {
                        toast.success("Aadhaar picture uploaded successfully.!")
                        this.setState({ aadharViewModal: false })
                    }
                })
                .catch((e) => {
                    toast.error("Unable to upload the aadhaar picture")
                })
        }
    }
    aadhaarPicsDelete = (image, type) => {
        if (type === "new") {
            if (this.state.aadhaarFilesSelection !== null && this.state.aadhaarFilesSelection !== undefined) {
                let images = {}
                images = Object.values(this.state.aadhaarFilesSelection).filter((img, i) => {
                    return (img.name !== image.name);
                })
                this.setState({
                    ...this.state,
                    aadhaarFilesSelection: images
                })
            }
        }
        else {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    Axios.delete(`bec/image/delete/${this.state.studentFormWithoutUpload.id}/${image}`).then((res) => {
                        if (res.data.status === 200) {
                            toast.error("Adhaar image deleted");
                            this.getStudentInformation();
                        }
                    }).catch((e) => {
                        toast.error("Unable to delete aadhaar picture")
                    })
                }
            })
        }
    }
    aadhaarFileUpload =  (e) => {
        let stateImages;
        if(this.state.aadharimgcount>1){
            Swal.fire({
                icon:"warning",
                text:"If you want to upload new aadhar picture delete existing pictures"
            })
        }
        else{
            if (e.target.files.length !== 0 && e.target.files.length <= 2) {
                if (this.state.aadhaarFilesSelection.length === 1) {
                    stateImages = e.target.files[0];
                    this.setState((prevState) => ({
                    aadhaarFilesSelection: [...prevState.aadhaarFilesSelection, stateImages],
                }));
                
                }
                else {
                    this.setState({ ...this.state, aadhaarFilesSelection: e.target.files });
                }
            }
        }
    }
    previewAadhaarImageBefore = (images) => {
        const src = URL.createObjectURL(images);
        Swal.fire({
            imageUrl: src,
            imageWidth: "auto",
            imageHeight: "auto",
            imageAlt: "Custom image",
            allowOutsideClick: false
        });
    }
    previewImage = (image, type) => {
        if (type === 'uploaded') {
            this.setState({ aadharViewModal: true, aadharImage: process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + image.fileName })
        } else {
            this.setState({ aadharViewModal: true, aadharImage: URL.createObjectURL(image) })
        }
    }
    downloadImage = (image) => {
        if (image !== undefined) {
            const link = document.createElement("a");
            link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + image;
            link.setAttribute("download", image);
            document.body.appendChild(link);
            link.click();
        }
    }
    previewAadhaarImageAfter = (images) => {
        Swal.fire({
            imageUrl: process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + images,
            imageWidth: "auto",
            imageHeight: "auto",
            imageAlt: "Custom image",
            allowOutsideClick: false
        });
    }
    getAllStates = () => {
        Axios.get('/bec/state/getAll').then(response => {
            const stateArray = [];
            response.data.data.map((state, index) => (
                stateArray.push({ value: state._id, label: state.state })
            ))
            this.setState({ ...this.state, stateOptions: stateArray })
        })
            .catch((e) => {
                toast.error("Unable to get states")
            })
    }
    getAllDistricts = () => {
        Axios.get('/bec/district/getAll').then(response => {
            const districtArray = [];
            response.data.data.data.map((district, index) => (
                districtArray.push({ value: district._id, label: district.district })
            ))
            this.setState({ ...this.state, aadhaarDistrictOptions: districtArray })
        }).catch((e) => {
            toast.error("Unable to get  districts")
        })
    }
    getAllColleges = () => {
        Axios.get(`bec/college/getAll`)
            .then((response) => {
                const collegesArray = [];
                response.data.data.map((college, index) => (
                    collegesArray.push({ value: college._id, label: college.collegeName, startMonth: college.startMonth ? college.startMonth : null, paymentLink: college.paymentLink ? college.paymentLink : null })
                ))
                this.setState({ ...this.state, collegeOptions: collegesArray })
            })
            .catch((e) => {
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
    specializationOptions = [];
    specializationDependable = (data) => {
        this.specializationOptions = [];
        Axios.get(`bec/specialization/getAllByCourse?course=${data.value}`).then(response => {
            response.data.data.map((mapdata, index) => (
                this.specializationOptions[index] = { value: mapdata._id, label: mapdata.specializationName }
            ))
        }).catch((e) => {
            toast.error("Unable to get specialization");
        })
    }
    courseFeeChecking = (e)=>{         
        let feeStructureFind = this.state.feeStructure.find((data)=>data.value === e.value);   
        if((this.state.feeStructure && this.state.feeStructure.length === 0)|| !feeStructureFind){
            Swal.fire({
                icon: 'warning',
                text: `Fee structure not available, configure fee sturcture`,
            })
        }
    }
    courseOptions = [];
    courseDependable = (data) => {
        this.courseOptions = [];
        this.specializationOptions = [];
        Axios.get(`bec/college/getallcoursesbycollege/${data.value}`).then(response => {
            response.data.data.courses.map((mapdata, index) => (
                this.courseOptions[index] = { value: mapdata._id, label: mapdata.courseName }
            ))
        }).catch((e) => {
            toast.error("Unable to get courses")
        })
    }
    districtOptions = [];
    districtDependable = (data) => {
        this.districtOptions = [];
        Axios.get(`bec/districts/getDistrictsByState/${data.value}`).then(response => {
            response.data.data.map((mapdata, index) => (
                this.districtOptions[index] = { value: mapdata._id, label: mapdata.district }
            ))
        }).catch((e) => {
            toast.error("Unable to get districts")
        })
    }
    lastDistrictOptions = [];
    lastDistrictDependable = (data) => {
        this.lastDistrictOptions = [];
        Axios.get(`bec/districts/getDistrictsByState/${data.value}`).then(response => {
            response.data.data.map((mapdata, index) => (
                this.lastDistrictOptions[index] = { value: mapdata._id, label: mapdata.district }
            ))
        }).catch((e) => {
            toast.error("Unable to get districts")
        })
    }
    componentDidMount() {       
        const years = this.state.years;
        const d = new Date();
        const year = d.getFullYear(); 
        let firstYear = year;
        for (let i = 0; i < 60; i++) {
            years.push({ label: firstYear, value: firstYear });
            firstYear++;
        }
        this.setState({ ...this.state, years: years });
        this.getAllStates();
        this.getAllDistricts();
        this.getAllColleges()
        this.getAllCourses();
        this.dropdown();
        this.quotaDropdown();
        if (this.state.studentFormWithoutUpload.id !== "new") {
            this.getStudentInformation();
        }
        if (this.state.id && this.state.id !== 'new') {
            this.props.enableEducation();
        }
    }
    quotaDropdown = () =>{
        Axios.get(`bec/quota/dropdown`)
        .then(res => {
            if (res.status === 200) {
                const quota = [];
                res.data.data.forEach((q,i)=>{
                    quota.push({
                        label : q.quotaName,
                        value:q._id,
                        percentage:q.percentage
                    })
                });
                this.setState({
                    ...this.state,
                    quotaOptions:quota
                },()=>this.state.quotaOptions);
            }
        })
        .catch((err)=>console.log(err))
    }
    dropdown = () => {
        Axios.get(`bec/additionaldropdown/getall`).then((res => {
            if (res.status === 200) {
                const sports = [];
                res.data.data.forEach(dropdown => {
                    if (dropdown.type === 'sports') {
                        sports.push({ label: dropdown.name, value: dropdown._id });
                    }
                })
                const language = [];
                res.data.data.forEach(dropdown => {
                    if (dropdown.type === 'language') {
                        language.push({ label: dropdown.name, value: dropdown._id });
                    }
                })
                const nationality = [];
                res.data.data.forEach(dropdown => {
                    if (dropdown.type === 'nationality') {
                        nationality.push({ label: dropdown.name, value: dropdown._id });
                    }
                })
                const religion = [];
                res.data.data.forEach(dropdown => {
                    if (dropdown.type === 'religion') {
                        religion.push({ label: dropdown.name, value: dropdown._id });
                    }
                })
                const bloodGroup = [];
                res.data.data.forEach(dropdown => {
                    if (dropdown.type === 'blood_group') {
                        bloodGroup.push({ label: dropdown.name, value: dropdown._id });
                    }
                })
                const courseTypes = [];
                res.data.data.forEach(dropdown => {
                    if (dropdown.type === 'course_type') {
                        courseTypes.push({ label: dropdown.name, value: dropdown._id });
                    }
                })
                this.setState({
                    ...this.state,
                    bloodGroupOptions: bloodGroup,
                    nationality: nationality,
                    religion: religion,
                    languagesOptions: language,
                    sportsOptions: sports,
                    courseTypeOptions: courseTypes
                })
            }
        })).catch((e) => {
            toast.error("Unable to get the details")
        })
    }
    getStudentInformation = () => {
        this.setState({ isLoading: true })
        Axios.get(`/bec/admission/get/${this.state.studentFormWithoutUpload.id}`).then((response) => {          
            if (response.data.status === 200) {
                const studentFullNameDropDown = [];
                if (this.state.studentFormWithoutUpload.id !== 'new') {
                    studentFullNameDropDown.push({ label: response.data.data[0].firstName + " " + response.data.data[0].lastName, value: response.data.data[0].lastName + " " + response.data.data[0].firstName })
                    studentFullNameDropDown.push({ label: response.data.data[0].lastName + " " + response.data.data[0].firstName, value: response.data.data[0].firstName + " " + response.data.data[0].lastName })
                    this.setState({ studentFullNameOptions: studentFullNameDropDown })
                }
                const languageOptions = [];
                if (response.data.data[0].languagesKnown !== null && response.data.data[0].languagesKnown !== undefined) {
                    response.data.data[0].languagesKnown.map(element => (
                        languageOptions.push({ value: element._id, label: element.name })
                    ))
                }
                const sportsOptions = [];
                if (response.data.data[0].sports !== null && response.data.data[0].sports !== undefined) {
                    response.data.data[0].sports.map(element => (
                        sportsOptions.push({ value: element._id, label: element.name })
                    ))
                }            
                const serverResponse = response.data.data[0];
                const serverImageResponse = response.data.data[0].adharPhoto;
                const confirmedFee = serverResponse.confirmedFee ? serverResponse.confirmedFee : 0;
                let defaultFee = 0;
                if (!serverResponse.confirmedFee && !serverResponse.isFeeConfirmed && serverResponse.defaultFee) {
                    defaultFee = serverResponse.defaultFee[serverResponse.defaultFee.fee]
                }
                const studentFormWithoutUpload = {
                    erpNo_edit: serverResponse.applicationNo !== null && serverResponse.applicationNo !== '' && serverResponse.applicationNo !== undefined ? false : true,
                    studentFirstName: serverResponse.firstName,
                    studentLastName: serverResponse.lastName,
                    studentFullName: serverResponse.fullName?{ value: serverResponse.fullName.value, label: serverResponse.fullName.label }:null,
                    motherName: serverResponse.motherName,
                    fatherName: serverResponse.fatherName,
                    education: serverResponse.education,
                    collegeName: serverResponse.collegeName,
                    areaName: serverResponse.areaName,
                    campusName: serverResponse.campusName,
                    birthPlace: serverResponse.birthPlace,
                    birthDate: moment(serverResponse.dob).format("YYYY-MM-DD"),
                    bloodGroup: serverResponse.bloodGroup ? { value: serverResponse.bloodGroup._id, label: serverResponse.bloodGroup.name } : null,
                    aadhaarNumber: serverResponse.adhaarCardNo,
                    adharDistrict: serverResponse.adharDistrict?{ value: serverResponse.adharDistrict._id, label: serverResponse.adharDistrict.district }:null,
                    address: serverResponse.address,
                    permanentAddress: serverResponse.permanentAddress,
                    comments: serverResponse.inbox,
                    studentWhatsappNumber: serverResponse.stdWtsAppNo,
                    parentContactNumber: serverResponse.parentPhone,
                    studentMailId: serverResponse.stdEmail,
                    parentMailId: serverResponse.parentEmail,
                    pincode: serverResponse.pincode,
                    sports: sportsOptions,
                    quota:serverResponse.quota?{label:serverResponse.quota.quotaName,value:serverResponse.quota._id,percentage:serverResponse.quota.percentage}:null,
                    quotapercent: serverResponse.quotapercent,
                    langusgesKnown: languageOptions,
                    state: serverResponse.state?{ value: serverResponse.state._id, label: serverResponse.state.state }:null,
                    district: serverResponse.district?{ value: serverResponse.district._id, label: serverResponse.district.district }:null,
                    college: serverResponse.college?{ value: serverResponse.college._id, label: serverResponse.college.collegeName, startMonth: serverResponse.college.startMonth }:null,
                    specialization: serverResponse.specialization?{ value: serverResponse.specialization._id, label: serverResponse.specialization.specializationName }:null,
                    academicYear: serverResponse.academicYear,
                    educationLevel: serverResponse.educationLevel ? { value: serverResponse.educationLevel._id, label: serverResponse.educationLevel.education } : null,
                    course: serverResponse.course ? { value: serverResponse.course._id, label: serverResponse.course.courseName } : null,
                    defaultFee: serverResponse.defaultFee ? serverResponse.defaultFee : null,
                    otherFee: serverResponse.otherFee,
                    totalFee: parseInt(confirmedFee) + parseInt(serverResponse.otherFee),
                    paidFee: serverResponse.paidFee,
                    nationality: serverResponse.nationality ? { value: serverResponse.nationality._id, label: serverResponse.nationality.name } : null,
                    religion: serverResponse.religion ? { value: serverResponse.religion._id, label: serverResponse.religion.name } : null,
                    paymentLink: serverResponse.paymentLink,
                    erpNo: serverResponse.applicationNo,
                    admissionNo: serverResponse.admissionNo,
                    gender: serverResponse.gender?{ value: serverResponse.gender, label: serverResponse.gender }:null,
                    domicileState:serverResponse.domicileState?{ value: serverResponse.domicileState, label: serverResponse.domicileState}:null,
                    id: serverResponse._id,
                    standardFee: serverResponse.standardFee ? serverResponse.standardFee : null,
                    maritFee: serverResponse.meritFee ? serverResponse.meritFee : [],
                    confirmedFee: serverResponse.confirmedFee ? serverResponse.confirmedFee : defaultFee,
                    confirmedFeeType: serverResponse.confirmedFeeType ? serverResponse.confirmedFeeType : null,
                    addEducation: serverResponse.addEducation,
                    percentage: serverResponse.percentage ? serverResponse.percentage : null,
                    counselor_id: serverResponse.createdBy ? serverResponse.createdBy.counselor_id : null,
                    counselor_name: serverResponse.createdBy ? serverResponse.createdBy.fullName : null,
                    enteredBy: serverResponse.enteredBy ? serverResponse.enteredBy : null,
                    isFeeConfirmed: serverResponse.isFeeConfirmed,
                    lastStudiedTown: serverResponse.lastStudiedTown ? serverResponse.lastStudiedTown : null,
                    lastStudiedState: serverResponse.lastStudiedState ? { value: serverResponse.lastStudiedState._id, label: serverResponse.lastStudiedState.state } : null,
                    lastStudiedDistrict: serverResponse.lastStudiedDistrict ? { value: serverResponse.lastStudiedDistrict._id, label: serverResponse.lastStudiedDistrict.district } : null,
                    lastStudiedCollegeType: serverResponse.lastStudiedCollegeType ? serverResponse.lastStudiedCollegeType : null,
                    courseType: serverResponse.courseType ? { value: serverResponse.courseType._id, label: serverResponse.courseType.name } : null
                }
                this.setState({
                    ...this.state,
                    studentFormWithoutUpload: studentFormWithoutUpload,
                    aadhaarFilesSelectionUrl: serverImageResponse ? serverImageResponse : null,
                    student_img_path: serverResponse.stdPhoto ? serverResponse.stdPhoto.fileName : null,
                    studentCurrentStatusData: serverResponse,
                    createdBy: serverResponse.createdBy && serverResponse.createdBy._id ? serverResponse.createdBy._id : null,
                    aadharimgcount:serverImageResponse?serverImageResponse.length:0,
                    isLoading: false
                })
                this.props.forHeaderprops(response.data.data);
                this.props.fromCreateAdmissionStudentIdCallback(response.data.data[0]._id, studentFormWithoutUpload, response.data.data);
                if (studentFormWithoutUpload.college) {
                    this.courseDependable(studentFormWithoutUpload.college); 
                    this.dependableEducationLevels(studentFormWithoutUpload.college); 
                    this.loadFeeStructure(studentFormWithoutUpload.college);
                }
            }
            else {
                this.setState({ isLoading: false });
            }
        }).catch((e) => {
            this.setState({ isLoading: false });
            toast.error("Unable to get the details")
        })
    }
    loadFeeStructure = (college) => {
        Axios.get('/bec/fee/college/' + college.value).then(res => {        
            if (res.status === 200) {                
                this.setState({
                    ...this.state,
                    feeStructure: res.data.data.length > 0 ? res.data.data[0].courseList : []
                })
            }
        }).catch((e) => {
            toast.error("Unable to get the fee structure")
        })
    }
    dependableEducationLevels = (college) => {
        Axios.get('/bec/college/getallcoursesbycollege/' + college.value).then(res => {
            if (res.status === 200) {
                let educationLevels = [];
                res.data.data.educationLevel.map((education, i) => (
                    educationLevels.push({ label: education.education, value: education._id, qualification: education.qualification, dependents: education.dependents })
                ))
                this.setState({
                    ...this.state,
                    educationLevels: educationLevels
                })
            }
        }).catch((e) => {
            toast.error("Unable to get the fee structure")
        })
    }    
    onSubmit = (e) => {           
        const sportsOptions = [];
        if(e.sports && e.sports.length > 0){
            e.sports.map(element => (
                sportsOptions.push(element.value)
            ))
        }
        const languagesOptions = [];
        if (e.languagesKnown && e.languagesKnown.length > 0) {
            e.languagesKnown.forEach(element => {
                languagesOptions.push(element.value);
            });
        }
        let feeStructureFind = this.state.feeStructure.find((data)=>data.value === e.course.value);   
        if(this.state.aadhaarExists){
            Swal.fire({
                icon: 'warning',
                text: `Aadhaar Number already exist..!`,
            })
        }
        else if((this.state.feeStructure && this.state.feeStructure.length === 0) || !feeStructureFind){
            Swal.fire({
                icon: 'warning',
                text: `Fee structure not available , configure fee sturcture`,
            })
        }
        else if((this.state.aadharimgcount+this.state.aadhaarFilesSelection.length)>2){
            Swal.fire({
                icon: 'warning',
                text: `If you want to upload new aadhar picture delete existing picture`,
            })
        }
        else{           
        const payload = {
            applicationNo: e.erpNo,
            firstName: e.studentFirstName?e.studentFirstName.toUpperCase():"",
            lastName: e.studentLastName?e.studentLastName.toUpperCase():"",
            fullName: e.studentFullName,
            dob: e.birthDate,
            birthPlace: e.birthPlace,
            bloodGroup:e.bloodGroup? e.bloodGroup.value:null,
            gender: e.gender.value,
            domicileState:e.domicileState.value,
            fatherName: e.fatherName?e.fatherName.toUpperCase():"",
            education: e.education,
            collegeName: e.collegeName,
            areaName: e.areaName,
            campusName: e.campusName,
            motherName: e.motherName?e.motherName.toUpperCase():"",
            parentPhone: e.parentContactNumber,
            parentEmail: e.parentMailId,
            stdWtsAppNo: e.studentWhatsappNumber,
            stdEmail: e.studentMailId,
            adhaarCardNo: e.aadhaarNumber,
            adharDistrict: e.adharDistrict.value,
            languagesKnown: languagesOptions,
            sports: sportsOptions,
            state: e.state.value,
            district: e.district.value,
            educationLevel: e.educationLevel.value,
            course: e.course.value,
            address: e.address,
            permanentAddress: e.permanentAddress,
            pincode: e.pincode,
            nationality:e.nationality ? e.nationality.value : null,
            religion:e.religion? e.religion.value:null,
            college: e.college?e.college.value:null,
            specialization: e.specialization.value,
            academicYear: e.academicYear,
            otherFee: parseInt(e.otherFee),
            quota: e.quota.value,
            quotapercent: parseFloat(e.quotapercent),
            totalFee: ((e.confirmedFee && !isNaN(e.confirmedFee) ? e.quota && e.quotapercent ? parseInt(e.confirmedFee) - parseInt(e.confirmedFee)/100*parseInt(e.quotapercent): parseInt(e.confirmedFee) : 0) + (e.otherFee && !isNaN(e.otherFee) ? parseInt(e.otherFee) : 0)),
            paidFee: e.paidFee,
            paymentLink: e.paymentLink,
            inbox: e.comments,
            standardFee: e.standardFee ? parseInt(e.standardFee) : 0,
            meritFee: this.state.studentFormWithoutUpload.maritFee,
            confirmedFee: e.confirmedFee,
            defaultFee: e.defaultFee ? e.defaultFee : 0,
            isFeeConfirmed: e.confirmedFee !== 0 && e.isFeeConfirmed ? true : false,
            createdBy: this.state.createdBy,
            enteredBy: localStorage.getItem("userId"),
            percentage: e.percentage,
            lastStudiedTown: e.lastStudiedTown ? e.lastStudiedTown : null,
            lastStudiedState: e.lastStudiedState ? e.lastStudiedState.value : null,
            lastStudiedDistrict: e.lastStudiedDistrict ? e.lastStudiedDistrict.value : null,
            lastStudiedCollegeType: e.lastStudiedCollegeType ? e.lastStudiedCollegeType : null,
            courseType:e.courseType? e.courseType.value:null
        }
        let statusPayload = {
            statusType: "pending",
            statusValue: true,
            refundData: null,
            statusConfirmation: "Requested",
            academic_year: e.academicYear.value ? parseInt(e.academicYear.value) : new Date().getFullYear()
        }
        if (payload.createdBy === undefined || payload.createdBy === null || payload.createdBy === "") {
            Swal.fire({
                icon: 'warning',
                text: "Please search the entered counselor id ..!",
            })
        }                      
        else if (this.state.studentFormWithoutUpload.id === "new") {
            if (this.state.aadhaarFilesSelection !== null && this.state.aadhaarFilesSelection !== undefined && this.state.aadhaarFilesSelection.length !== 0) {
                this.setState({ isLoading: true })
                Axios.post("bec/admission/create", payload).then((response) => {
                    if (response.data.status === 201) {
                        statusPayload.student = response.data.data._id;
                        Axios.post(`bec/student/status/add`, statusPayload).then((res) => {
                        }).catch((error) => { toast.error("Unable to set the status") })
                        this.studentPictureUpload(response.data.data._id)
                        this.aadhaarPictureUpload(response.data.data._id)
                        setTimeout(() => {
                            this.props.history.push("/alladmissions/list/admissions/createadmission/" + response.data.data._id);
                            this.props.fromCreateAdmissionStudentIdCallback(response.data.data._id, response.data.data);
                            this.props.enableEducation();
                            this.props.handleManualTabChange(1);
                        }, 2000)
                        toast.success("Student details saved successfully")
                        this.setState({ isLoading: false });
                    }
                    else {
                        setTimeout(() => {
                            this.props.history.push("/alladmissions/list/admissions/createadmission/" + response.data.data._id);
                            this.props.fromCreateAdmissionStudentIdCallback(response.data.data._id, response.data.data);
                            this.props.handleManualTabChange(1)
                        }, 2000)
                        toast.success("Student details saved successfully :)")
                        this.setState({ isLoading: false });
                    }
                }).catch((e) => {
                    toast.error("Unable to create student")
                    this.setState({ isLoading: false });
                })
            } else {
                Swal.fire({
                    icon: 'warning',
                    text: "Please upload aadhaar picture"
                })
            }
        }
        else {
            this.setState({ isLoading: true });
            if ((this.state.aadhaarFilesSelection !== null && this.state.aadhaarFilesSelection !== undefined && this.state.aadhaarFilesSelection.length !== 0) || (this.state.aadhaarFilesSelectionUrl !== null && this.state.aadhaarFilesSelectionUrl !== undefined && this.state.aadhaarFilesSelectionUrl.length !== 0)) {
                Axios.put(`bec/admission/update/${this.props.id}`, payload).then((response) => {
                    if (response.data.status === 200) {
                        this.studentPictureUpload(response.data.data._id)
                        this.aadhaarPictureUpload(response.data.data._id)
                        setTimeout(() => { this.props.handleManualTabChange(1) }, 2000)
                        toast.success("Student details updated successfully :)")
                        this.setState({ isLoading: false });
                    }
                    else {
                        this.setState({ isLoading: false })
                    }
                }).catch((e) => {
                    toast.error("Unable to update student")
                    this.setState({ isLoading: false });
                })
            } else {
                Swal.fire({
                    icon: 'warning',
                    text: "Please upload aadhaar picture"
                })
                this.setState({ isLoading: false });
            }
        }
        }
    };
    fee = (e, values) => {
        const coursec = this.state.feeStructure.filter(course => e.value === course.value);
        if (coursec.length > 0) {
            this.state.feeStructure.forEach((course, index) => {
                if (e.value === course.value) {
                    const percentages = [];
                    course.percentages !== undefined && course.percentages !== null && course.percentages.length > 0 && course.percentages.forEach((per, idx) => {
                        const amount = course.value + per.value + idx + index;
                        percentages.push(per);
                        percentages[idx].amount = amount;
                    })
                    const confirmedFee = this.state.studentFormWithoutUpload.confirmedFee ? this.state.studentFormWithoutUpload.confirmedFee : 0;
                    const defaultFee = course.type !== 'standard' && course.defaultFee ? course.defaultFee[course.defaultFee.fee] : 0;
                    this.setState({
                        ...this.state,
                        studentFormWithoutUpload: {
                            ...values,
                            course: e,
                            specialization: '',
                            standardFee: course.standard,
                            confirmedFee: course.type === 'standard' ? course.standard : defaultFee,
                            maritFee: course.type !== 'standard' ? percentages : null,
                            feeType: course.type ? course.type : null,
                            otherFee: course.otherFee ? course.otherFee[course.otherFee.fee] : 0,
                            defaultFee: course.defaultFee ? course.defaultFee : 0,
                            totalFee: parseInt(confirmedFee) + parseInt(course.otherFee ? course.otherFee[course.otherFee.fee] : 0),
                            isFeeConfirmed: course.type !== 'standard' ? false : true,
                            percentage: { label: course.type === 'standard' ? 'Standard' : null }
                        }
                    });
                }
            })
        }
        else {
            this.setState({
                ...this.state,
                studentFormWithoutUpload: {
                    ...values,
                    course: e,
                    standardFee: null,
                    maritFee: []
                }
            })
        }
    }
    handleErpNumberChange = (event, values) => {
        let data = this.state;
        data.studentFormWithoutUpload.erpNo = event.target.value;
        if (event.target.value !== undefined && event.target.value !== null && event.target.value !== "") {
            return <Badge color="warning" className="ERPNumber">Not issued</Badge>
        }
        else {
            data.studentFormWithoutUpload.erpNo = event.target.value;
        }
        this.setState({ ...data });
    }
    handleErpNumberupdateFieldOpen() {
        let data = this.state;
        data.studentFormWithoutUpload.erpNo_edit = !data.studentFormWithoutUpload.erpNo_edit;
        this.setState({ ...data });
    }
    handleErpNumber = (values) => {
        if (this.state.studentFormWithoutUpload.id !== "new") {
            if (values.erpNo !== undefined && values.erpNo !== null && values.erpNo !== "") {
                values.applicationNo = this.state.studentFormWithoutUpload.erpNo;
                this.setState({ ...this.state, studentFormWithoutUpload: { ...this.state.studentFormWithoutUpload, erpNo_edit: false }, isLoading: false });
                Axios.put(`bec/admission/erpnumber/${this.state.studentFormWithoutUpload.id}`, values)
                    .then((response) => {
                        if (response.data.status === 200) {
                            toast.success("Student ERP number updated successfully..!")
                            this.props.refreshHeader();
                        }
                    })
                    .catch((error) => {
                        this.setState({ ...this.state, isLoading: false });
                    })
            }
            else {
                this.setState({ errorMessage: "ERP number is required" });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                text: "Please save student details initially!",
            })
        }
    }
    nameChange = (type, e, values) => {
        let form = values;
        if (type === 'studentFirstName') {
            form.studentFirstName = e.target.value.toUpperCase();
            form.studentFullName = '';
        }
        else{
            form.studentFirstName = form.studentFirstName.toUpperCase();
        }
        if (type === 'studentLastName') {
            form.studentLastName = e.target.value.toUpperCase();
            form.studentFullName = '';
        }
        else{
            form.studentLastName = form.studentLastName.toUpperCase();
        }
        let fullNameFormates = [];
        fullNameFormates.push({ label: form.studentLastName + " " + form.studentFirstName, value: form.studentLastName + " " + form.studentFirstName });
        fullNameFormates.push({ label: form.studentFirstName + " " + form.studentLastName, value: form.studentFirstName + " " + form.studentLastName });
        this.setState({
            ...this.state,
            studentFullNameOptions: fullNameFormates,
        })
    }
    coursebaesdONlevel = (e, values) => {
        if (e && values) {
            Axios.get('/bec/college/getallcoursesbycollege/' + values.college.value)
                .then((res) => {
                    if (res.data.status === 200) {
                        let courses = [];
                        res.data.data.courses.forEach((course, i) => {
                            if (e.value === course.educationLevel) {
                                courses.push({
                                    label: course.courseName, value: course._id, educationLevel: course.educationLevel
                                })
                            }
                        });
                        this.courseOptions = courses;
                        values.educationLevel = e;
                        this.setState({
                            ...this.state,
                            studentFormWithoutUpload: {
                                ...values,
                            }
                        })
                    }
                })
                .catch(err => { toast.error('Unable to load Cousres') });
        } else {
            toast.error("Please select education level");
            this.setState({
                ...this.state,
                studentFormWithoutUpload: {
                    ...values,
                }
            })
        }
    }
    printApplication = () => {
        Axios.get('/bec/export/basicadmissiondetails/' + this.props.id)
                .then(res => {
                    if (res.status === 200) {
                        if (res.data) {
                            let options = {
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                                margin: 2,
                                image: {type: 'jpeg', quality: 0.98},
                                html2canvas: { 
                                    scale: 1.5,
                                    letterRendering: true,
                                    useCORS: true
                                }
                              };
                              html2pdf().set(options).from(res.data).toPdf().save('studentform.pdf');
                        }
                        else{
                            toast.error("Unable to print admission details");
                        }
                    }
                    else{
                        toast.error("Unable to print admission details");
                    }
                })
                .catch((e) => {
                    toast.error("Unable to print admission details");
                })
    }
    checkAadhaarExists = async (e) => {                    
        let payload ={
            aadhaarNumber : e.target.value ? e.target.value:null
        }      
        if (payload.aadhaarNumber.length === 12) {
            Axios.post(`bec/payment/verifyduplicatestudent`,payload)
                .then((response) => {                                    
                    if (response.data.status === 200) {
                        if(response.data.data === "exist"){
                            this.setState({aadhaarExists:true});
                            Swal.fire({
                                icon: 'warning',
                                text: "Aadhaar Number already exist..!"
                            })
                        }
                        else{
                            this.setState({aadhaarExists:false});
                        }
                    }                   
                })
                .catch((e) => {                  
                    this.setState({aadhaarExists:false});
                })           
        }
    };    
    render() {
        return (
            <>
                <ToastContainer />
                {this.state.isLoading ?
                    <Dimmer active inverted className="dimmerstylebasic">
                        <Loader content='Please wait...' active inline='centered' size="medium" className='spinner' />
                    </Dimmer> : null}
                <Modal size="lg" isOpen={this.state.aadharViewModal}>
                    <ModalBody className='chat_m'>
                        <Card >
                            <h6><b> <i onClick={() => { this.setState({ aadharViewModal: false }) }} className="fa fa-close aadharModal_Close_Icon"></i> </b></h6>
                            <TransformWrapper>
                                <TransformComponent>
                                    <img className="basicInfo_image" src={this.state.aadharImage} alt="aadhar" />
                                </TransformComponent>
                            </TransformWrapper>
                        </Card>
                    </ModalBody>
                </Modal>
                <Formik key={this.props.enableFields} enableReinitialize={true} initialValues={this.state.studentFormWithoutUpload} validationSchema={schema} onSubmit={this.onSubmit} >
                    {({ values, setFieldValue, errors }) => (
                        <Form autoComplete="off">
                            <Row className="basicInfo_fields_style">
                                <Accordion defaultActiveKey={["0", "1", "2", "3", "4", "5", "6"]} alwaysOpen>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Personal Information</Accordion.Header>
                                        <Accordion.Body >
                                            <Row>
                                                <Col width={4}>
                                                    <Row className="accordionrowstyle">
                                                        <Label attached='top left'>Student Picture</Label>
                                                        <div>
                                                            <Button htmlFor="imageUpload" type="button" as="label" floated="left" color="blue">
                                                                <Icon name="upload" />
                                                            </Button>
                                                            <Input type="file" hidden name="image" id="imageUpload" accept="image/*" onChange={(e) => { this.studentFileUpload(e) }} />
                                                            <Button type="button" icon floated="left" disabled={localStorage.getItem("accesslevel") === "counselor" && localStorage.getItem("counselorId") !== this.state.studentFormWithoutUpload.enteredBy.counselor_id}>
                                                                <Icon name="trash" onClick={this.studentPicDelete} />
                                                            </Button>
                                                        </div >
                                                    </Row>
                                                    <Row>
                                                        <div>
                                                            {
                                                                <Row >
                                                                    <Col md="12" xs="12">
                                                                        <div className="basicdivstyle">
                                                                            <Row>
                                                                                <Col md="10" xs="10">
                                                                                    {((this.state.studentFormWithoutUpload.id === "new") || ((localStorage.getItem("accesslevel") !== "counselor") && (this.state.studentFormWithoutUpload.id !== "new"))) ?
                                                                                        <InputField label='Counselor Id' inputtype='text' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} fieldSize="12" onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "\\", "/", "_", ",", ".", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} name='counselor_id' type="text" mandatoryField="true" placeholder='Search counselor id' /> :
                                                                                        <InputField label='Counselor Id' inputtype='text' fieldSize="12" name='counselor_id' type="text" mandatoryField="true" onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "\\", "_", ",", ".", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "\"", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} disabled placeholder='Search counselor id' />
                                                                                    }
                                                                                </Col>
                                                                                <Col md="2" xs="2" className="searchmarginstyle">
                                                                                    <span onClick={() => {
                                                                                        return values.counselor_id !== undefined && values.counselor_id !== null && values.counselor_id !== "" ?
                                                                                            Axios.get(`/bec/user/getbycounselorid/${values.counselor_id}`)
                                                                                                .then((response) => {
                                                                                                    if (response.data.status === 200) {
                                                                                                        this.setState({
                                                                                                            createdBy: response.data.data._id
                                                                                                        })
                                                                                                        setFieldValue("counselor_id", response.data.data.counselor_id)
                                                                                                        setFieldValue("counselor_name", response.data.data.fullName)
                                                                                                    } else {
                                                                                                        setFieldValue("counselor_name", "")
                                                                                                    }
                                                                                                })
                                                                                            : (setFieldValue("counselor_name", ""));
                                                                                    }}>
                                                                                        <Icon name="search" inverted bordered color="black" className="searchStyle"></Icon>
                                                                                    </span>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    </Col>
                                                                    <Row>
                                                                        <div className="basiccounselordivstyle">
                                                                            Counselor Name
                                                                            <p><b>{values.counselor_name}</b>
                                                                            </p>
                                                                        </div>
                                                                    </Row>
                                                                </Row>
                                                            }
                                                        </div>
                                                    </Row>
                                                    {this.state.studentFormWithoutUpload.id !== "new" ?
                                                        <Row className="editmodestyle">
                                                            <Label>Edit Mode</Label>
                                                            <Checkbox toggle onChange={() => { this.setState({ enableFields: !this.state.enableFields }) }} />
                                                        </Row> : null}
                                                    <Row className="erpnumberstyle">
                                                        {(localStorage.getItem('accesslevel') !== "admin" && localStorage.getItem('accesslevel') !== "manager")
                                                            ?
                                                            <Col md={12} xs={12}>
                                                                <div>
                                                                    <label className='erpNum_Style_A'> ERP Number</label><br />
                                                                    {this.state.studentFormWithoutUpload.erpNo !== null && this.state.studentFormWithoutUpload.erpNo !== "" ? <b className='erpNum_Style_B'>{this.state.studentFormWithoutUpload.erpNo}</b> : <strong>Not yet issued</strong>}
                                                                </div>
                                                            </Col>
                                                            :
                                                            <Row>
                                                                <Label className='erp_style_b_A'>ERP Number</Label>
                                                                {this.state.studentFormWithoutUpload.erpNo_edit === false ? <span><Badge className="erp_no_show_badge">{this.state.studentFormWithoutUpload.erpNo}</Badge><Icon name="edit" className="erp_onedit_button" color="blue" size="large" onClick={() => { this.handleErpNumberupdateFieldOpen() }} ></Icon></span> :
                                                                    <Col md={12} xs={12}>
                                                                        <Row>
                                                                            <Col md={10} xs={10}>
                                                                                <Input type="text" placeholder="Enter ERP number" defaultValue={values.erpNo} onChange={(e) => this.handleErpNumberChange(e, values)} name='erpNo' className="erpNumber_input_style" />
                                                                                {this.state.errorMessage && (<p className="error erpNumber_input_style2"> {this.state.errorMessage} </p>)}
                                                                            </Col>
                                                                            <Col md={2} xs={2} className="erpmarginstyle">
                                                                                <Icon name="save" className="erp_onclick_button" color="blue" size="large" onClick={() => { this.handleErpNumber(values) }} ></Icon>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>}
                                                            </Row>}
                                                    </Row>
                                                </Col>
                                                <Col md={4}>
                                                    <Row>
                                                        <InputField label='Student Surname' fieldSize="12" disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' mandatoryField="true" name='studentFirstName' type="text" onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} placeholder='Enter surname as per 10th certificate' onChange={(e) => { setFieldValue("studentFirstName", e.target.value); setFieldValue("studentFullName", ""); this.nameChange('studentFirstName', e, values); }} className="capitalize_text"/>
                                                    </Row>
                                                    <Row>
                                                        <InputField label='Student Name' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} fieldSize="12" disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' mandatoryField="true" name='studentLastName' type='text' placeholder='Enter name as per 10th certificate' onChange={(e) => { setFieldValue("studentLastName", e.target.value); setFieldValue("studentFullName", ""); this.nameChange('studentLastName', e, values); }} className="capitalize_text"/>
                                                    </Row>
                                                    <Row>
                                                        <InputField label='Student Full Name' fieldSize="12" isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} inputtype='select' mandatoryField="true" name='studentFullName' type='select' placeholder='Select one option' options={this.state.studentFullNameOptions} />
                                                    </Row>
                                                    <Row>
                                                        <InputField label='Birthdate' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='date' fieldSize="12" mandatoryField="true" name='birthDate' type='date' placeholder='Enter birth date' />
                                                    </Row>
                                                </Col>
                                                <Col md={4}>
                                                    <Row>
                                                        <InputField label='Student Email Id' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='email' fieldSize="12" mandatoryField="true" name='studentMailId' type='email' onKeyDown={(evt) => ["+", "-", "!", "#", "$", "%", "^", "&", "*", "/", "\\", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} placeholder='Enter student mail id' />
                                                    </Row>
                                                    <Row>
                                                        <InputField label='Student Whatsapp Number' inputtype='number' onChange={(e) => { return (e.target.value.length < 11) ? setFieldValue("studentWhatsappNumber", e.target.value) : (e.target.value ? null : setFieldValue("studentWhatsappNumber", null)) }} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} fieldSize="12" mandatoryField="true" name='studentWhatsappNumber' onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "(", ")"].includes(evt.key) && evt.preventDefault()} type='number' placeholder='Enter student whatsapp number' />                                                    </Row>
                                                    <Row>
                                                        {((this.state.studentFormWithoutUpload.id === "new") || ((localStorage.getItem("accesslevel") !== "counselor") && (this.state.studentFormWithoutUpload.id !== "new"))) ?
                                                            <InputField label='Aadhaar Number' fieldSize="12" disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} onChange={(e) => { return e.target.value.length < 13 ? (setFieldValue("aadhaarNumber", e.target.value), this.checkAadhaarExists(e)) : null }} onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "~", "\\", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} inputtype='number' mandatoryField="true" name='aadhaarNumber' type='number' placeholder='Enter aadhaar number' /> :
                                                            <InputField label='Aadhaar Number' fieldSize="12" inputtype='number' onChange={(e) => { return ((e.target.value.length < 13)) ? (setFieldValue("aadhaarNumber", e.target.value), this.checkAadhaarExists(e)) : (e.target.value ? null : setFieldValue("aadhaarNumber", null)) }} onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} mandatoryField="true" name='aadhaarNumber' type='number' disabled placeholder='Enter aadhaar number' />}
                                                    </Row>                                                   
                                                    <Row>
                                                        <InputField label='Gender' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} inputtype='select' fieldSize="12" mandatoryField="true" name='gender' type='select' placeholder='Select one Option' options={this.state.genderOptions} />
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Parent Information</Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <InputField label='Father Name' onKeyDown={(evt) => ["+", "-", "!", "\\", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="6" mandatoryField="true" name='fatherName' type='text' placeholder='Enter father name as per 10th certificate' className="capitalize_text" />
                                                <InputField label='Mother Name' onKeyDown={(evt) => ["+", "-", "!", "@", "\\", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="6" mandatoryField="true" name='motherName' type='text' placeholder='Enter mother name as per 10th certificate' className="capitalize_text" />
                                            </Row>
                                            <Row>
                                                <InputField label='Parent Contact Number' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='number' fieldSize="6" mandatoryField="true" name='parentContactNumber' type='number' placeholder='Enter parent contact number' onChange={(e) => { return (e.target.value.length <= 10) ? setFieldValue("parentContactNumber", e.target.value) : (e.target.value ? null : setFieldValue("parentContactNumber", null)) }} onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} />
                                                <InputField label='Parent Email Id' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='email' fieldSize="6" name='parentMailId' type='email' placeholder='Enter parent mail id' />
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Address</Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <InputField label='State' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='state' type='select' placeholder='Select one option' options={this.state.stateOptions} setValue={(e) => { this.districtDependable(e); setFieldValue("district", null); setFieldValue("state", e); }} />
                                                <InputField label='District' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='district' type='select' placeholder='Select one option' options={this.districtOptions} />
                                                <InputField label='Pincode' onChange={(e) => { return (e.target.value.length < 7) ? setFieldValue("pincode", e.target.value) : (e.target.value ? null : setFieldValue("pincode", null)) }} onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "\\", "_", ",", ".", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='number' fieldSize="4" mandatoryField="true" name='pincode' type='number' placeholder='Enter pincode number' />
                                            </Row>
                                            <Row>
                                                {((this.state.studentFormWithoutUpload.id === "new") || ((localStorage.getItem("accesslevel") !== "counselor") && (this.state.studentFormWithoutUpload.id !== "new"))) ?
                                                    <InputField label='Aadhaar District' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='adharDistrict' type='select' placeholder='Select one option' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} options={this.state.aadhaarDistrictOptions} />
                                                    : <InputField label='Aadhaar District' inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='adharDistrict' type='select' placeholder='Select one option' isDisabled options={this.state.aadhaarDistrictOptions} />}
                                                <InputField label='Communication Address' inputtype='textarea' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} fieldSize="4" mandatoryField="true" name='address' type='text' placeholder='Enter address' /><br />
                                                <InputField label='Permanent Address' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='textarea' fieldSize="4" mandatoryField="true" name='permanentAddress' type='text' placeholder='Enter permanent address' />
                                            </Row>
                                            <Row>
                                                <Col md="4" xs="0" className="domicleStateStyle">                                         
                                                    <InputField label='Domicile State' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} inputtype='select' fieldSize="12" mandatoryField="true" name='domicileState' type='select' placeholder='Select one Option' options={this.state.domicileStateOptions} />
                                                </Col>
                                                <Col md="4" xs="12" className="permanentCheckBoxStyle">
                                                    <span><input type="checkbox" name="address" id="checkBox" onChange={(e) => { e.target.checked === true ? setFieldValue("permanentAddress", values.address) : setFieldValue("permanentAddress", "") }}></input> Is permanent address same as communication address</span>
                                                </Col>
                                                <Col md="4" xs="0"></Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>University Information</Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <InputField label='College' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? true : false} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='college' type='select' options={this.state.collegeOptions} placeholder="Select one option" setValue={(e) => { this.courseDependable(e, values); this.dependableEducationLevels(e, values); this.loadFeeStructure(e); setFieldValue('educationLevel', ''); setFieldValue("course", null); setFieldValue("paymentLink", e.paymentLink ? e.paymentLink : null); setFieldValue('specialization', null); setFieldValue("academicYear", { label: "AY " + new Date().getFullYear() + " - " + parseInt(new Date().getFullYear() + 1), value: new Date().getFullYear() }); setFieldValue("college", e); }} />
                                                <InputField label='Course Type' inputtype='select' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} fieldSize="4" mandatoryField="true" name='courseType' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} type='select' options={this.state.courseTypeOptions} placeholder='Select one option' />
                                                <InputField label='Education Level' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='educationLevel' type='select' options={this.state.educationLevels} setValue={(e) => { setFieldValue('course', ''); setFieldValue('specialization', ''); this.coursebaesdONlevel(e, values); setFieldValue("educationLevel", e) }} placeholder='Select one option' />                                                
                                            </Row>
                                            <Row>
                                                <InputField label='Course' inputtype='select' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} fieldSize="4" mandatoryField="true" name='course' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} type='select' options={this.courseOptions} setValue={(e) => { setFieldValue('specialization', ''); this.courseFeeChecking(e); this.specializationDependable(e, values); this.fee(e, values); }} placeholder='Select one option' />
                                                <InputField label='Specialization' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='specialization' value={values.specialization} type='select' options={this.specializationOptions} placeholder='Select one option' />
                                                <InputField label='Joining Academic Year' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='academicYear' value={values.academicYear} type='select' onChange={(e) => { setFieldValue('academicYear', values.college.startMonth ? { label: "AY " + e.label + ' - ' + parseInt(e.label + 1), value: parseInt(e.value) } : e) }} options={this.state.years} />
                                            </Row>  
                                            <Row>
                                                <InputField label='Payment Link' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="true" name='paymentLink' type='text' placeholder='Enter payment link' />
                                            </Row>                                         
                                            {this.state.studentFormWithoutUpload.defaultFee && this.state.studentFormWithoutUpload.defaultFee!==0 && (this.state.studentFormWithoutUpload.standardFee ===null || this.state.studentFormWithoutUpload.id ==="new")?
                                                <Row>
                                                    <Col md={4}></Col>
                                                    <Col md={3} key={"defaultFee"} className="backgroundStylesGrayColor paddingStyles">
                                                        <Label>Default Tution Fee</Label>
                                                    </Col>
                                                    <Col md={3} className="backgroundStylesGrayColor"></Col>
                                                    <Col md={2} className="amountAlignRight backgroundStylesGrayColor paddingStyles">
                                                        <strong>{this.state.studentFormWithoutUpload.defaultFee ? (Math.round(parseInt(this.state.studentFormWithoutUpload.defaultFee[this.state.studentFormWithoutUpload.defaultFee.fee]) * 100) / 100).toFixed(2) : null}</strong>                                                        
                                                    </Col>
                                                </Row> 
                                            : null}
                                            {this.state.studentFormWithoutUpload.standardFee ?
                                                <Row>
                                                    <Col md={4}></Col>
                                                    <Col md={3} className="paddingStyles backgroundStylesGrayColor"> <Label>Standard Tution Fee</Label></Col>
                                                    <Col md={3} className="paddingStyles backgroundStylesGrayColor"></Col>
                                                    <Col md={2} className="paddingStyles amountAlignRight backgroundStylesGrayColor">
                                                        <strong>{this.state.studentFormWithoutUpload.standardFee ?(Math.round(parseInt(this.state.studentFormWithoutUpload.standardFee) * 100) / 100).toFixed(2):null}</strong>                                                        
                                                    </Col>                                                    
                                                </Row>
                                            :null}
                                             {this.state.studentFormWithoutUpload.isFeeConfirmed ? null :
                                             (this.state.studentFormWithoutUpload.maritFee !== null && this.state.studentFormWithoutUpload.maritFee.length > 0) ?
                                            <>
                                                <Row>
                                                    <Col md={4}></Col>
                                                    <Col md={3} className="paddingStyles paddingStyles">
                                                        Merit Based Tution Fee
                                                    </Col>
                                                    <Col md={2} className="paddingStyles">
                                                    <span className="table_row_select_field paddingStyles">
                                                        <Select 
                                                            options={
                                                                (this.state.studentFormWithoutUpload.maritFee !== null && this.state.studentFormWithoutUpload.maritFee.length > 0) ?
                                                                this.state.studentFormWithoutUpload.maritFee.map((merit, index) => ({
                                                                
                                                                    label: merit.label+" ("+merit[merit.amount]+")",
                                                                    key: merit.label,
                                                                    value: merit[merit.amount]
                                                                })) :
                                                                []
                                                            }
                                                            menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false}
                                                            isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null}
                                                        />  
                                                        </span>
                                                    </Col>
                                                    <Col md={1}></Col>
                                                    <Col md={2}></Col>
                                                </Row> 
                                            </>
                                            :null}
                                            
                                            {this.state.studentFormWithoutUpload.confirmedFee ?
                                            <>
                                                <Row>
                                                    <Col md={4}></Col>
                                                    <Col md={3} className={`paddingStyles ${!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                        <Label>{this.state.studentFormWithoutUpload.isFeeConfirmed && this.state.studentFormWithoutUpload.feeType !== 'standard' ? this.state.studentFormWithoutUpload.isFeeConfirmed && this.state.studentFormWithoutUpload.feeType !== 'standard' && this.state.studentFormWithoutUpload.addEducation && this.state.studentFormWithoutUpload.percentage ? 'Confirmed Tution Fee -(' + this.state.studentFormWithoutUpload.percentage.label + ')' : 'Confirmed Tution Fee ' : !this.state.studentFormWithoutUpload.isFeeConfirmed && this.state.studentFormWithoutUpload.feeType !== 'standard' ? 'Confirmed Tution Fee (Default Fee)' : 'Confirmed Tution Fee (Standard Fee)'}</Label>
                                                    </Col>
                                                    <Col md={2} className={!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}></Col>
                                                    <Col md={1} className={!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}> <strong>{this.state.studentFormWithoutUpload && this.state.studentFormWithoutUpload.percentage && this.state.studentFormWithoutUpload.percentage.label?(this.state.studentFormWithoutUpload.percentage.label!=="Standard"?this.state.studentFormWithoutUpload.percentage.label:"0%"):""} - </strong> </Col> 
                                                    <Col md={2} className={`amountAlignRight paddingStyles ${!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                        <strong>{this.state.studentFormWithoutUpload.confirmedFee?(Math.round(parseInt(this.state.studentFormWithoutUpload.confirmedFee) * 100) / 100).toFixed(2):0}</strong>                                                        
                                                    </Col>                                                   
                                                </Row> 
                                            </>
                                            : null}
                                            <Row>
                                                <Col md={4}></Col>
                                                <Col md={3} className={`paddingStyles ${this.state.studentFormWithoutUpload.standardFee || this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                    <Label>Quota<span className="error">*</span></Label>
                                                </Col>
                                                <Col md={3} className={`paddingStyles ${this.state.studentFormWithoutUpload.standardFee || this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                    <span className="align_quota_details">
                                                        <Select className="select_field_style" menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} value={values.quota} type='select' options={this.state.quotaOptions} onChange={(e)=>setFieldValue('quota',e)}/> 
                                                        <ErrorMessage name="quota" className="error" component="div"/>
                                                    </span>
                                                        <InputField className="align_quota_details" label='' onChange={(e) => { return (parseFloat(e.target.value) <= 100) ? setFieldValue("quotapercent", e.target.value) : (e.target.value ? null : setFieldValue("quotapercent", "")) }} onKeyDown={(evt) => ["e", "E", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "\\", "_", ",", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()}  disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='number' fieldSize="5" mandatoryField="true" name='quotapercent' type='number' placeholder='Percent' /><strong className="percent_style">% -</strong>
                                                </Col>
                                                <Col md={2} className={`amountAlignRight paddingStyles ${this.state.studentFormWithoutUpload.standardFee || this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                    <strong > {values.confirmedFee === null || values.confirmedFee === undefined || values.confirmedFee === 0 ? 
                                                    (values.quota && values.quotapercent ? 
                                                        this.state.studentFormWithoutUpload.defaultFee && ((Math.round(this.state.studentFormWithoutUpload.defaultFee[this.state.studentFormWithoutUpload.defaultFee.fee]) - parseInt(this.state.studentFormWithoutUpload.defaultFee && this.state.studentFormWithoutUpload.defaultFee[this.state.studentFormWithoutUpload.defaultFee.fee])/100*parseFloat(values.quotapercent)* 100) / 100).toFixed(2)
                                                        :0) 
                                                    : ((Math.round((!isNaN(parseInt(values.confirmedFee)) ? values.quota && values.quotapercent ? parseInt(values.confirmedFee) - parseInt(values.confirmedFee)/100*parseFloat(values.quotapercent):0 : 0)* 100) / 100).toFixed(2))} </strong>
                                                </Col>                                               
                                            </Row> 
                                            {this.state.studentFormWithoutUpload.otherFee ?
                                            <Row>
                                                <Col md={4} ></Col>
                                                <Col md={3} className={`paddingStyles ${!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                        <Label>Other Fee</Label>
                                                </Col>
                                                <Col md={2} className={`${!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}></Col>
                                                <Col md={1} className={`paddingStyles ${!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}> <strong>+</strong> </Col> 
                                                <Col md={2} className={`amountAlignRight paddingStyles ${!this.state.studentFormWithoutUpload.standardFee && !this.state.studentFormWithoutUpload.isFeeConfirmed?'backgroundStylesGrayColor':'backgroundStylesWhiteColor'}`}>
                                                        <strong>{this.state.studentFormWithoutUpload.otherFee && !isNaN(parseInt(values.otherFee)) ? (Math.round(parseInt(values.otherFee) * 100) / 100).toFixed(2) : 0}</strong>                                                       
                                                </Col> 
                                            </Row>: null} 
                                            {!isNaN(parseInt(values.confirmedFee) + parseInt(values.otherFee)) ?
                                            <Row style={{backgroundColor:'rgb(148 217 148)'}}>
                                                <Col md={4} style={{backgroundColor:'white'}}></Col>
                                                <Col md={3} className="paddingStyles">
                                                    <Label><strong>Total Fee</strong></Label>                                                
                                                </Col>
                                                <Col md={2}></Col>
                                                <Col md={1} className="paddingStyles"> <strong className="actionSymbol">=</strong>  </Col>  
                                                <Col md={2} className="amountAlignRight paddingStyles">
                                                    <strong >{values.confirmedFee === null || values.confirmedFee === undefined || values.confirmedFee === 0 ? 
                                                        (Math.round((values.quota && values.quotapercent ? 
                                                            parseInt(this.state.studentFormWithoutUpload.defaultFee && this.state.studentFormWithoutUpload.defaultFee[this.state.studentFormWithoutUpload.defaultFee.fee]) - parseInt(this.state.studentFormWithoutUpload.defaultFee && this.state.studentFormWithoutUpload.defaultFee[this.state.studentFormWithoutUpload.defaultFee.fee])/100*parseFloat(values.quotapercent):
                                                            parseInt(this.state.studentFormWithoutUpload.defaultFee && this.state.studentFormWithoutUpload.defaultFee[this.state.studentFormWithoutUpload.defaultFee.fee]) + (!isNaN(parseInt(values.otherFee)) ? parseInt(values.otherFee) : 0))* 100) / 100).toFixed(2) : 
                                                            (Math.round(((!isNaN(parseInt(values.confirmedFee)) ? values.quota && values.quotapercent ? parseInt(values.confirmedFee) - parseInt(values.confirmedFee)/100*parseFloat(values.quotapercent):parseInt(values.confirmedFee) : 0) + (!isNaN(parseInt(values.otherFee)) ? parseInt(values.otherFee) : 0))* 100) / 100).toFixed(2)} </strong>
                                                </Col> 
                                            </Row>
                                            : null}
                                            <Row></Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header>Other Details</Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <InputField label='Birth Place' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="true" name='birthPlace' type='text' placeholder='Enter birth place' />
                                                <InputField label='Blood Group' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='bloodGroup' type='select' options={this.state.bloodGroupOptions} placeholder='Enter blood group' />
                                                <InputField label='Nationality' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='nationality' type="select" placeholder='Select one option' options={this.state.nationality} />
                                            </Row>
                                            <Row>
                                                <InputField label='Religion' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="true" name='religion' type="select" placeholder='Select one option' options={this.state.religion} />
                                                <InputField label='Sports' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='sports' type='select' options={this.state.sportsOptions} placeholder='Enter known sports' isMulti />
                                                <InputField label='Languages Known' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='langusgesKnown' type='select' options={this.state.languagesOptions} placeholder='Enter known languages' isMulti />
                                            </Row>
                                            <Row>
                                                <InputField label='Comments' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='textarea' fieldSize="4" name='comments' type='text' placeholder='Enter comments' />
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="5">
                                        <Accordion.Header>Last Education Details</Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <InputField label='Education Name' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "*", "/", "_", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="false" name='education' type='text' placeholder='Enter Education Name' value={values.education} onChange={(e) => setFieldValue("education", e.target.value)} />
                                                <InputField label='College Name' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "\\", "%", "^", "*", "/", "_", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="false" name='collegeName' type='text' placeholder='Enter College Name' value={values.collegeName} onChange={(e) => setFieldValue("collegeName", e.target.value)} />
                                                <InputField label='Area Name' disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="false" name='areaName' type='text' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "\\", "%", "^", "*", "/", "_", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} placeholder='Enter Area Name' value={values.areaName} onChange={(e) => setFieldValue("areaName", e.target.value)} />
                                            </Row>
                                            <Row>
                                                <InputField label='Campus Name' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "\\", "%", "^", "*", "/", "_", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="false" name='campusName' type='text' placeholder='Enter Campus Name' value={values.campusName} onChange={(e) => setFieldValue("campusName", e.target.value)} />
                                                <InputField label='Town' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "\\", "%", "^", "*", "/", "_", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} disabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='text' fieldSize="4" mandatoryField="false" name='lastStudiedTown' type='text' placeholder='Enter Town Name' value={values.lastStudiedTown} onChange={(e) => setFieldValue("lastStudiedTown", e.target.value)} />
                                                <InputField label='College Type' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='lastStudiedCollegeType' type='select' placeholder='Select one option' options={this.state.lastStudiedCollegeTypeOptions} />
                                            </Row>
                                            <Row>
                                                <InputField label='State' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='lastStudiedState' type='select' placeholder='Select one option' options={this.state.stateOptions} setValue={(e) => { setFieldValue("lastStudiedState", e); this.lastDistrictDependable(e); setFieldValue("lastStudiedDistrict", null) }} />
                                                <InputField label='District' isDisabled={(this.state.studentFormWithoutUpload.id !== "new") ? this.state.enableFields : null} inputtype='select' menuPlacement="auto" menuPosition="fixed" menuShouldScrollIntoView={false} fieldSize="4" mandatoryField="false" name='lastStudiedDistrict' type='select' placeholder='Select one option' options={this.lastDistrictOptions} />
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="6">
                                        <Accordion.Header>Documents</Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <Col md={8}>
                                                    <Label attached='top left'>Aadhaar Pictures <span className="aadharlabelspanstyle">*</span></Label>
                                                    <div className="picaupload">
                                                        <Button disabled={this.state.aadhaarFilesSelectionUrl !== null && this.state.aadhaarFilesSelectionUrl !== undefined && this.state.aadhaarFilesSelectionUrl.length !== 0 && localStorage.getItem("accesslevel") === "counselor"} as="label" content="Upload Aadhaar" size="mini" labelPosition="left" icon="upload" htmlFor="AadharUpload" color="blue" />
                                                        <Input className="basic_style_H" type='file' hidden accept="image/*" name="images" id="AadharUpload" onChange={(e) => { this.aadhaarFileUpload(e) }}   multiple={true} ismulti="true" />
                                                    </div><br />
                                                  
                                                    {
                                                        this.state.aadhaarFilesSelection !== null && this.state.aadhaarFilesSelection !== undefined && this.state.aadhaarFilesSelection.length !== 0 ?
                                                            Object.values(this.state.aadhaarFilesSelection).map((image, index) => {
                                                                return (
                                                                    <Card className="basic_style_I" key={index}>
                                                                        <img src={this.viewAadhaarsBeforeUpload(image)} onClick={() => this.previewAadhaarImageBefore(image.name)} className="basic_style_J" alt="aadhar" />
                                                                        <Icon name="close" circular onClick={() => this.aadhaarPicsDelete(image, "new")} className="basic_style_K" />
                                                                        <center>
                                                                            <Button title="Preview" icon="eye" size="small" color="orange" type="button" onClick={() => this.previewImage(image)}></Button>{" "}
                                                                        </center>
                                                                    </Card>
                                                                )
                                                            }) : ""
                                                    }
                                                    <br/>
                                                    {this.state.aadhaarFilesSelectionUrl !== null && this.state.aadhaarFilesSelectionUrl !== undefined && this.state.aadhaarFilesSelectionUrl.length !== 0 ?
                                                        (this.state.aadhaarFilesSelectionUrl.map((image, index) => {
                                                            return (
                                                                <Card className="basic_style_I" key={index}>
                                                                    <img src={process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + image.fileName} onClick={() => this.previewAadhaarImageAfter(image.fileName)} className="basic_style_J" alt="Preview aadhar img" />
                                                                    <center>
                                                                        <CardBody className="basicInfo_aadharImage_Buttons_style">
                                                                            <ButtonGroup>
                                                                                <Button title="Preview" icon="eye" size="small" color="orange" type="button" onClick={() => this.previewImage(image, "uploaded")}></Button>{" "}
                                                                                <Button title="Download" icon="download" size="small" color="green" type="button" onClick={() => this.downloadImage(image.fileName)}></Button>
                                                                                {localStorage.getItem("accesslevel") !== "counselor" ? <Button title="Delete" icon="trash" size="small" color="red" type="button" onClick={() => this.aadhaarPicsDelete(image.fileName, "notnew")}></Button> : null}
                                                                            </ButtonGroup>
                                                                        </CardBody>
                                                                    </center>
                                                                </Card>
                                                            )
                                                        })
                                                        ) : ""
                                                    }
                                                </Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Row>
                            <Row className="basicInfo_style_P">
                                <center>
                                    <Button type="reset" className="bg-secondary" id="resetbuttoncolor" onClick={() => this.props.history.goBack()}>Close</Button>
                                    {this.state.studentFormWithoutUpload.id !== "new" ?
                                            <>
                                                <Button color="blue" type="submit" disabled={localStorage.getItem("accesslevel") === "counselor" && localStorage.getItem("counselorId") !== this.state.studentFormWithoutUpload.enteredBy.counselor_id}>Save & Next</Button>
                                                <Button type="button" className="bg-primary" onClick={() => this.printApplication()} style={{color:"white"}}>Print</Button>
                                            </> :
                                        <Button color="blue" type="submit" >Save & Next</Button>
                                    }                                    
                                </center>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }
}