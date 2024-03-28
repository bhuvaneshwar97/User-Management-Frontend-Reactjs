import React, { Component } from "react";
import { Icon, Button, Dimmer, Loader, Popup, Label} from "semantic-ui-react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Modal, ModalBody, ModalHeader, Col, Input, Row, InputGroup, InputGroupText, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import Axios from "../../../AxiosConfig/config";
import './../../Admission/style.css'
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import moment from "moment";
import Select from 'react-select';
export default class CourseChangedStudents extends Component {
  state = {
    currentPage: 1,
    totalDocs: "0",
    activePage: "0",
    totalPages: "0",
    studentList: [],
    searchData: this.props.searchData? this.props.searchData : '',
    isSearch: false,
    isLoading: false,
    permissions: { canCreate: false, canView: false, canUpdate: false, canDelete: false },
    openViewA: false,
    openView: false,
    student_image: null,
    aadhaar_images: [],
    propsData: this.props,
    image: "",
    viewModal: false,
    isExportClick: false,
    isOpenExport: false,
    export: "",
    exportOptions: [],
    isFilter: false,
    popUpData: "",
    pageSize:1,
    pagiOptions:[ { value:"10", label: "10" },{ value:"20", label: "20" },{ value:"30", label: "30" },{ value:"40", label: "40" },{ value:"50", label: "50" }],
    pagisizeOptionSelect:{value: '10', label: '10'},
    visible:false
  };
  toggleVisible = () => { 
    const scrolled = document.documentElement.scrollTop; 
     if (scrolled > 280){ 
      this.setState({visible:true})
    }  
    else if (scrolled <= 280){ 
      this.setState({visible:false})
    } 
  }; 
scrollToTop = () =>{ 
  window.scrollTo({ 
      top: 0,  
      behavior: 'smooth'
  }); 
}; 
  componentDidMount() {
    window.addEventListener('scroll', this.toggleVisible);
    this.setState({ isLoading: true });
    if(this.props.searchData){
      this.handleSearch(1);
    }else{
      this.loadData();
    }
    
    let exportDataOptions =
      [
        { value: `bec/export/total/admission/details`, label: "Total Admission Details", disabled: localStorage.getItem("accesslevel") !== "manager" ? false : true },
        { value: `bec/export/total_admission_status`, label: "Total Admission Status", disabled: localStorage.getItem("accesslevel") !== "manager" ? false : true },
        { value: `bec/export/student/registration/sheet`, label: "Registration sheet", disabled: localStorage.getItem("accesslevel") !== "counselor" ? false : true },
        { value: `bec/export/fee_details_report`, label: "Fee Details Sheet", disabled: localStorage.getItem("accesslevel") !== "counselor" ? false : true },
        { value: `bec/export/admission/details`, label: "Admissions Details", disabled: localStorage.getItem("accesslevel") !== "counselor" ? false : true },
        { value: `bec/export/total/admissiondetails`, label: "Admissions Details & Points", disabled: localStorage.getItem("accesslevel") === "admin" || localStorage.getItem("accesslevel") === "super_admin" ? false : true },
        { value: `bec/export/total_status_details`, label: "Total Status Details ", disabled: localStorage.getItem("accesslevel") === "admin" || localStorage.getItem("accesslevel") === "super_admin" ? false : true }]
    let exportMap = this.state.exportOptions;
    exportDataOptions.forEach((options) => {
      if (options.disabled === false) {
        return exportMap.push({ label: options.label, value: options.value })
      }
    })
    this.setState({
      exportOptions: exportMap
    })
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.toggleVisible);
  }
  handleExportButtonApis = async (data) => {
    if (data) {
      let payload = {};
      if (Object.keys(this.state.propsData.filterOptions).length !== 0) {
        payload = this.state.propsData.filterData;
      }
      payload.academicYear.value = parseInt(payload.academicYear.value);
      if (data ? data.value : null) {
        Axios.post(data.value, payload).then((response) => {
          if (response.data.status === 200) {
            if ((response.data.data !== undefined) && (response.data.data !== "") && (response.data.data !== null)) {
              const link = document.createElement("a");
              link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/export/viewExcelFile/" + response.data.data.file;
              link.setAttribute("download", response.data.data.file);
              document.body.appendChild(link);
              link.click();
            }
          } else if (response.data.status === 404) {
            Swal.fire({
              icon: "warning",
              text: "No records found to export..!"
            })
          }
        })
          .catch((err) => {
            toast.error("Unable to export admissison's data")
          })
      }
    }
  }
  loadData = () => {
    let payload = {};
    if (this.state.propsData.filterOptions && Object.keys(this.state.propsData.filterOptions).length !== 0) {
      payload = this.state.propsData.filterData;
    }
    if (this.state.isSearch === false) {
      this.setState({ isLoading: true })
      Axios.post(`bec/coursechanged/students?page=${this.state.currentPage}&limit=${this.state.pagisizeOptionSelect.value}`, payload).then(response => {
        if (response.data.status === 200) {
          let data = [];
          if (response.data.data.data.length > 0) {
            response.data.data.data.forEach((obj, i) => {
              let previousCourse = '';
              let currentCourse = '';
              obj.records.forEach((r,i)=>{
                if(r.course._id === obj.admission.course && r.specialization._id === obj.admission.specialization){
                  currentCourse=r;
                  currentCourse.changedDate=r.createdAt;
                }else{
                  previousCourse = r;
                }
              })
              data.push({student:obj.admission,currentCourse:currentCourse, previousCourse:previousCourse});
            })
          }
          this.setState({
            studentList: data,
            currentPage: parseInt(response.data.data.page),
            totalDocs: parseInt(response.data.data.totalDocs), 
            isLoading: false
          });
        } else {
          this.setState({ isLoading: false })
        }
      }).catch((e) => {
        this.setState({ isLoading: false,
        totalDocs:0 });
      })
    }
  }
  actions = (cell, row) => {
    return (
      <span>
         <Link id={cell._id} to={`/alladmissions/list/admissions/createadmission/${cell._id}`}> <Icon name="address card" size="large" title="Admission" className="admission_B admission_action_icon_style" /> </Link> 
      </span>
    )
  }
  studentPictureModalLoad = (id) => {
    if (this.state.openView === false) {
      Axios.get(`bec/admission/get/${id}`).then((response) => {
        if (response.data.status === 200) {
          this.setState({
            openView: !this.state.openView,
            student_image: response.data.data[0].stdPhoto.fileName
          })
        }
      }).catch((e) => {
        toast.error("Unable to get student picture")
      })
    }
    else { this.setState({ openView: !this.state.openView }) }
  }
  previewStudentImage = (images) => {
    this.setState({ viewModal: true, image: images })
  }
  downloadStudentImage = (images) => {
    const link = document.createElement("a");
    link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/stdimage/view/" + images;
    link.setAttribute("download", images);
    document.body.appendChild(link);
    link.click();
  }
  aadhaarPictureModalLoad = (id) => {
    if (this.state.openViewA === false) {
      Axios.get(`bec/admission/get/${id}`).then((response) => {
        if (response.data.status === 200) {
          this.setState({
            openViewA: !this.state.openViewA,
            aadhaar_images: response.data.data[0].adharPhoto,
          })
        }
      }).catch((e) => {
        toast.error("Unable to get aadhaar picture")
      })
    }
    else { this.setState({ openViewA: !this.state.openViewA }) }
  }
  previewAadhaarImage = (images) => {
    Swal.fire({
      imageUrl: process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + images,
      imageWidth: "auto",
      imageHeight: "auto",
      imageAlt: "Custom image",
      allowOutsideClick: false
    });
  }
  downloadAadhaarImage = (images) => {
    const link = document.createElement("a");
    link.href = process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + images;
    link.setAttribute("download", images);
    document.body.appendChild(link);
    link.click();
  }
  PaginationHangle = (page) => {
    this.setState({ currentPage: page },
      () => {
        if (this.state.isSearch === false) {
          this.loadData();
        }
        else {
          this.handleSearch(page);
        }
      }
    )
  }
  prevNextArrow = (current, type, originalElement) => {
    if (type === 'prev') {
      return <span className="prevNextArrow">Prev</span>;
    }
    if (type === 'next') {
      return <span className="prevNextArrow">Next</span>;
    }
    if (type === 'page') {
      return originalElement;
    }
  }
  displayName = (cell, row) => {
    return cell ? cell.fullName.label : "Not Available";
  }
  displayFatherName = (cell, row) => {
    return cell ? cell.fatherName : "Not Available";
  }
  displayNamber = (cell, row) => {
    return cell ? cell.stdWtsAppNo    : "Not Available";
  }
  displayEmail = (cell, row) => {
    return cell ? cell.stdEmail : "Not Available";
  }
  displayCollege = (cell, row) => {  
    return (<p className="contentBreak">{cell.college && cell.college._id ? cell.college.collegeName : "Not Available"}</p>);
  }
  displayCourse = (cell, row) => {
    return (
      <p className="contentBreak">
        {cell && cell.course && cell.course._id
          ? `${cell.course.courseName} -- ${cell.specialization && cell.specialization._id ? cell.specialization.specializationName : "Not Available"}`
          : "Not Available"}
      </p>
    );
  }  
  displayCounselorName = (cell, row) => {
    return(<p className="contentBreak">{ cell && cell.createdBy ? cell.createdBy.fullName : "Not Available"}</p>);
  }
  checkERP = (cell) => {   
    return cell && cell.applicationNo ? cell.applicationNo  : <Badge color="secondary" className="erpNumber_status_badgeColor_style">Not issued</Badge>;
  }
  admissionNo = (cell) => {
    return cell && cell.admissionNo ? cell.admissionNo : <Badge color="secondary" className="erpNumber_status_badgeColor_style">Not issued</Badge>;
  }
  displayApplicationDate = (cell) => {
    return cell && cell.ApplicationDate ? moment(cell.ApplicationDate).format("DD-MM-YYYY") : "Not Available";
  }
  courseChangeDate =(cell)=>{
    return cell && cell.changedDate ? moment(cell.changedDate).format("DD-MM-YYYY") : "Not Available";
  }
  handleSearchInput = (event) => {
    let data = this.state;
    if (event.target.value !== undefined && event.target.value !== null && event.target.value !== "") {
      data.searchData = event.target.value;
      data.isSearch = true;
    }
    else {
      data.searchData = event.target.value;
      data.isSearch = false;
    }
    this.setState({ ...data }, () => this.loadData())
  }
  handleSearch = (page) => {
    let payload = {
      text: this.state.searchData ? this.state.searchData.trim() : this.state.searchData
    }
    if (this.state.propsData.filterData && this.state.propsData.filterData.academicYear) {
      payload.academicYear = this.state.propsData.filterData.academicYear;
    }
    this.setState({ isLoading: true })
    Axios.post(`bec/coursechanged/students/search?page=${page ? page : 1}&limit=${this.state.pagisizeOptionSelect.value}`, payload).then(response => {
      if (response.data.status === 200) {
        let data = [];
        if (response.data.data.data.length > 0) {
          response.data.data.data.forEach((obj, i) => {
            let previousCourse = '';
            let currentCourse = '';
            obj.records.forEach((r,i)=>{
              if(r.course._id === obj.admission.course && r.specialization._id === obj.admission.specialization){
                currentCourse=r;
                currentCourse.changedDate=r.createdAt;
              }else{
                previousCourse = r;
              }
            })
            data.push({student:obj.admission,currentCourse:currentCourse, previousCourse:previousCourse});
          })
        }
        this.setState({
          studentList: data,
          currentPage: parseInt(response.data.data.page),
          totalDocs: parseInt(response.data.data.totalDocs),          
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false })
      }
    }).catch((e) => {
      this.setState({ isLoading: false })
      toast.error("Unable to load admissions")
    })
  }
  closeSearchData = (e, type) => {
    let remainingFilterValues = {
      filterOptions: {},
      filterData: {}
    };
    let stateData = this.state.propsData;
    if (stateData.filterOptions !== undefined && stateData.filterOptions !== null && type !== undefined && type !== null && Object.keys(stateData.filterOptions).length === 1) {
      remainingFilterValues.filterOptions = {};
      remainingFilterValues.filterData = {};
    } else {
      stateData.filterOptions !== undefined && stateData.filterOptions !== null && type !== undefined && type !== null && Object.keys(stateData.filterOptions).forEach((key, index) => {
        if (key !== type) {
          remainingFilterValues.filterOptions[key] = stateData.filterOptions[key];
          remainingFilterValues.filterData[key] = stateData.filterData[key];
        }
      });
    }
    this.setState({
      ...this.state,
      propsData: remainingFilterValues
    }, () => this.loadData())
  }
  filterWithOptions = (e) => {
    this.setState({
      isFilter: !this.state.isFilter,
    })
  }
  pagiHandleChange=(page)=>{
    this.setState({pagisizeOptionSelect:page,currentPage: 1}, () => { this.loadData() })
 }
  render() {
    let popUpOptions = [];
    return (
      <div className="admission_style_A">
        <ToastContainer />
        {this.state.isLoading ?
          <Dimmer active inverted>
            <Loader content='Data Loading...' active inline='centered' size="medium" />
          </Dimmer> : null}
        <Row >
          <Col md={4} xs={12}>
            <span className="admission_style_B" size="large" >
              <i className="fa fa-address-card-o" ></i>  Course Changed Students </span>
          </Col>
          <Col md={8} xs={12}>
            <Row>
              <Col md={5} xs={0}> </Col>
              <Col md={4} xs={6} className="formd1">
                <InputGroup >
                  <Input type="text" placeholder="Search..." name="searchData" onChange={(e) => { this.handleSearchInput(e) }} />
                  <InputGroupText onClick={() => { this.handleSearch() }} className="admissionTable_searchIcon_style">
                    <i className="fa fa-search" size="large"></i></InputGroupText>
                </InputGroup>
              </Col>
              <Col md={3} xs={6} className="formd2">
                <div className="totaldiv1">
                  <Popup
                    trigger={<Icon bordered inverted color='teal' name='filter' id="iconstyle" onClick={(e) => this.props.getBack(e)} />}
                    content='Filter / Back'
                    position='top right'
                    inverted
                  />                 
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {this.state.propsData.filterOptions && Object.keys(this.state.propsData.filterOptions).length > 0 ? <span className="filter_with_style">Filtered with :</span> : null}
            <Row>
              <Col md="4" className="tabwidthstyle">
                {this.state.propsData.filterOptions ? Object.keys(this.state.propsData.filterOptions).map((key, index) => {
                  let labelName = key;
                  let values = this.state.propsData.filterOptions[key];
                  if (key === 'status') {
                    labelName = "Status"
                  }
                  if (key === 'academicYear') {
                    labelName = 'Academic Year'
                  }
                  if (key === 'applicationNo') {
                    labelName = 'ERP Number'
                  }
                  if (key === 'admissionNo') {
                    labelName = 'Admission Number'
                  }
                  if (key === 'fullName') {
                    labelName = 'Student Full Name'
                  }
                  if (key === 'adhaarCardNo') {
                    labelName = 'Adhaar Card Number'
                  }
                  if (key === 'stdWtsAppNo') {
                    labelName = 'Student Whatsup Number'
                  }
                  if (key === 'fatherName') {
                    labelName = 'Father Name'
                  }
                  if (key === 'stdEmail') {
                    labelName = "Student Email Id"
                  }
                  if (key === 'course') {
                    labelName = "Course"
                  }
                  if (key === 'gender') {
                    labelName = 'Gender'
                  }
                  if (key === 'college') {
                    labelName = 'College'
                  }
                  if (key === 'district') {
                    labelName = 'District'
                  }
                  if (key === 'state') {
                    labelName = 'State'
                  }
                  if (key === 'applicationFromDate') {
                    labelName = 'Application Start Date'
                  }
                  if (key === 'applicationToDate') {
                    labelName = "Application End Date"
                  }
                  if (key === 'counselor') {
                    labelName = "Counselor"
                  }
                  if (typeof values === "object") {
                    values = this.state.propsData.filterOptions[key].label;
                  }
                  if (this.state.isFilter === false && index > 1) {
                    let popUpRecords = {};
                    popUpRecords[labelName] = values;
                    popUpOptions.push(popUpRecords)
                    return "";
                  }
                  return <span className='admission_filter_style' key={labelName}>{labelName} : {values}<i className='fa fa-close admissionFilter_closeIcon_style' onClick={(e) => { this.closeSearchData(e, key) }}></i></span>
                }):null}
              </Col>
              <Col md="8" className="admission_showMore_Style" id="tabwidthstyle1">
                { this.state.propsData.filterOptions && Object.keys(this.state.propsData.filterOptions).length > 2
                  ?
                  <Popup position="bottom center" trigger={<Label color="blue" className="labelstyle"> <Icon name='eye' />Show All Filters  </Label>} wide='very'>
                    <div>
                      <div>
                        <Row className="gridRowStyle">
                          {popUpOptions.map((e, i) => {
                            return <Col md={3} xs={12} className="semanticcolumntabstyle" key={Object.keys(e)[0]}><span className="girdColumnstyle">{Object.keys(e)[0]} : {e[Object.keys(e)[0]]}</span>  </Col>
                          })}
                        </Row>
                      </div>
                    </div>
                  </Popup>
                  : null}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <div >
            <BootstrapTable striped  data={this.state.studentList} hover multiColumnSearch={true} className={this.state.propsData.filterOptions && Object.keys(this.state.propsData.filterOptions).length === 0 ? "erpRequest_style_header" : ""} >
              {localStorage.getItem("accesslevel") !== "manager" ? <TableHeaderColumn dataFormat={this.actions} width='75px' dataField='student' > Actions </TableHeaderColumn> : null}
              <TableHeaderColumn dataField='student' dataSort={true} dataFormat={this.displayApplicationDate} width="100px" dataAlign="center">Application<br />Date</TableHeaderColumn>
              <TableHeaderColumn dataField='student' dataFormat={this.admissionNo} isKey dataSort width="170px" > Admission Number </TableHeaderColumn>
              <TableHeaderColumn dataField='student' dataSort dataFormat={this.checkERP} width="120px"> ERP Number </TableHeaderColumn>
              <TableHeaderColumn dataField='student' dataFormat={this.displayName} dataSort={true} width="180px">  Student Name </TableHeaderColumn>
              <TableHeaderColumn dataField='student' dataSort width="140px" dataFormat={this.displayFatherName}> Father Name </TableHeaderColumn>
              <TableHeaderColumn dataField="student" dataSort width="140px" dataFormat={this.displayNamber}>Phone Number</TableHeaderColumn>
              <TableHeaderColumn dataField="student" dataSort width="180px" dataFormat={this.displayEmail}>Email</TableHeaderColumn>
              <TableHeaderColumn dataField="student" dataFormat={this.displayCollege} dataSort width="400px" >College</TableHeaderColumn>
              <TableHeaderColumn dataField="previousCourse" dataFormat={this.displayCourse} dataSort width="350px">Previous Course</TableHeaderColumn>
              <TableHeaderColumn dataField="currentCourse" dataFormat={this.displayCourse} dataSort width="350px">Current Course</TableHeaderColumn>
              <TableHeaderColumn dataField="currentCourse" dataFormat={this.courseChangeDate} dataSort width="150px">Date of Change</TableHeaderColumn>
              <TableHeaderColumn dataField='student' dataFormat={this.displayCounselorName}dataSort width="150px"> Counselor Name </TableHeaderColumn>
            </BootstrapTable>
            <br />
            <Row>
             <Col md={2}>
                <Select
                value={this.state.pagisizeOptionSelect}
                onChange={this.pagiHandleChange}
                options={this.state.pagiOptions}
                /> 
            </Col>
            <Col md={10} >
                <div className='admission_style_D'>
                <Pagination 
                  onChange={this.PaginationHangle.bind(this)} 
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  defaultPageSize={1} 
                  current={this.state.currentPage} 
                  total={this.state.totalDocs} 
                  locale={localeInfo} 
                  itemRender={this.prevNextArrow}
                  showSizeChanger
                  onShowSizeChange={this.onShowSizeChange}
                  pageSize={this.state.pagisizeOptionSelect?this.state.pagisizeOptionSelect.value:"10"}
                /> 
              </div>
            </Col>
          </Row> 
          <Icon name="arrow circle up" className="scrollUpArrow" size='big' onClick={this.scrollToTop} style={{display: this.state.visible ? 'inline' : 'none'}} /> 
            <Modal size="sm" isOpen={this.state.openView} toggle={this.studentPictureModalLoad} className={"modal-primary " + this.props.className}>
              <ModalHeader toggle={this.studentPictureModalLoad}>
                <strong as='a' color='' size="large" > <i className="fa fa-bars"></i> {"  "} <span className="cardlabelstyle"> Student Picture </span> </strong>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md={3} className="admission_style_E">
                    {this.state.student_image !== null && this.state.student_image !== undefined ?
                      <Button type="button" className="admission_style_F" >
                        <div class="previewBtn">
                          <img src={process.env.REACT_APP_BACKEND_API_URL + "bec/stdimage/view/" + this.state.student_image} className='img' height={50} width={70} alt="preview" />
                          <span class="view">
                            <i className="fa fa-eye admission_style_G" aria-hidden="true" onClick={() => this.previewStudentImage(this.state.student_image)}></i>
                            <i className="fa fa-arrow-circle-down admission_style_H" aria-hidden="true" onClick={() => this.downloadStudentImage(this.state.student_image)}></i></span>
                        </div>
                      </Button>
                      : <span className="admission_style_I">No Images available</span>}
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
            <Modal size="sm" isOpen={this.state.openViewA} toggle={this.aadhaarPictureModalLoad} className={"modal-primary " + this.props.className} >
              <ModalHeader toggle={this.aadhaarPictureModalLoad}>
                <strong as='a' color='' size="large" > <i className="fa fa-bars"></i> {"  "} <span className="cardlabelstyle"> Aadhaar Picture </span> </strong>
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md={3} className="admission_style_J" >
                    {this.state.aadhaar_images !== null && this.state.aadhaar_images !== undefined ?
                      this.state.aadhaar_images.map((image, index) =>
                      (
                        <Button type="button" className="admission_style_K" >
                          <div class="previewBtn"> <img src={process.env.REACT_APP_BACKEND_API_URL + "bec/adhaar/view/" + image.fileName} className='img' height={50} width={70} alt="preview" />
                            <span class="view">
                              <i className="fa fa-eye admission_style_L" aria-hidden="true" onClick={() => this.previewAadhaarImage(image.fileName)}></i>
                              <i className="fa fa-arrow-circle-down admission_style_M" aria-hidden="true" onClick={() => this.downloadAadhaarImage(image.fileName)}></i></span>
                          </div>
                        </Button>
                      )) : <span className="admission_style_N">No Images available</span>}
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </div>
        </Row>
      </div >
    );
  }
}