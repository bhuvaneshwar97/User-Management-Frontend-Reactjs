import React, { Component } from "react";
import { Button, Dimmer, Loader } from "semantic-ui-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Axios from "../../../AxiosConfig/config";
import InputField from "../../../hoc/InputFields";
import { Row } from "reactstrap";
import './style.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default class CreateCourse extends Component {
  state = {
    colleges: [],
    name: "",
    duration: "",
    eligibility: "",
    college: "",
    educationLevel: '',
    educationLevelOptions: [],
    id: this.props.match.params.id,
    isLoading: false,
    permissions: { canCreate: false, canView: false, canUpdate: false, canDelete: false }
  };
  schema = () => {    
    return Yup.object().shape({
      educationLevel: Yup.object().nullable().required('Education level required'),
      name: Yup.string().required("Course name is required"),      
      duration: Yup.string().required("Duration is required").trim(),
      eligibility: Yup.string().matches().required("Eligibility is required")  
    });
  };
  loadEducationLevel = () => {
    Axios.get(`bec/educationdependent/dropdown`).then(response => {
      if (response.data.status === 200) {
        const qualifications = []
        response.data.data.map((mapData) => (
          qualifications.push({ value: mapData._id, label: mapData.education })
        ))
        this.setState({ ...this.state, educationLevelOptions: qualifications });
      }
    }).catch((error) => {
      toast.error("Unable to get education dependent")
    })
  }
  loadCoursePermissions = () => {
    Axios.get(`bec/permission/display/${localStorage.getItem('roleId')}`).then(
      (response) => {
        this.setState({
          permissions: response.data.data.data.courses,
          isLoading: false
        })
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        toast.error("Unable to get the permission display..! ")
      })
  }
  componentDidMount() {
    this.setState({ isLoading: true })
    this.loadCoursePermissions();
    this.loadEducationLevel();
    if (this.state.id !== "new") {
      Axios.get('bec/course/getById/' + this.state.id).then(response => {
        if (response.data.status === 200) {
          this.setState({
            isLoading: false,
            name: response.data.data.courseName,
            duration: response.data.data.duration,
            eligibility: response.data.data.eligibility,
            educationLevel: response.data.data.educationLevel ? { label: response.data.data.educationLevel.education, value: response.data.data.educationLevel._id } : null
          })
        }
        else {
          this.setState({ isLoading: false })
        }
      }).catch((e) => {
        this.setState({ isLoading: false })
        toast.error("Unable to get course");
      })
    }
  }
  checkDuration=(durationTime)=>{
    if(parseInt(durationTime)>10){
      Swal.fire({
        icon:"warning",
        text:"Duration exceeded"
      })
    }
  }
  handleCourseDelete = (courseId) => {    
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want delete?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`bec/course/delete/${courseId}`)
          .then((response) => {
            if (response.data.status === 200) {
              this.setState({ isLoading: false })
              toast.error("Courses record deleted successfully..!")
              this.props.history.push("/settings/courses")
            }
            else {
              this.setState({ isLoading: false })
            }
          }).catch((error) => {
            this.setState({ isLoading: false });
            toast.error("Unable to delete the course")
          })
      }
      else {
        this.setState({ isLoading: false })
      }
    })
  };
  onSubmit = (e) => {
    if(e && e.duration>10){
      Swal.fire({
        text:"Duration exceeded",
        icon:"warning"
      })
    }
    else{
    const payload = {
      courseName: e.name,
      duration: e.duration,
      eligibility: e.eligibility,
      educationLevel: e.educationLevel.value
    }
    this.setState({ isLoading: true })
    if (this.state.id === 'new') {
      Axios.post('bec/create/course', payload)
        .then((response) => {
          if (response.data.status === 201) {
            this.setState({ isLoading: false })
            setTimeout(() => {
              this.props.history.push("/settings/courses");
            }, 1000)
            toast.success("Course created successfully..!")
          }
          else {
            this.setState({ isLoading: false })
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          toast.error("Unable to create the course");
        });
    }
    else {
      Axios.put('bec/course/update/' + this.state.id, payload).then(response => {
        if (response.data.status === 200) {
          this.setState({ isLoading: false })
          setTimeout(() => {
            this.props.history.push("/settings/courses");
          }, 1000)
          toast.success("Course updated successfully..!")
        }
      }).catch((e) => {
        this.setState({ isLoading: false });
        toast.error("Unable to update the course")
      })
    }
  }
  };
  render() {
    return (
      <div className="createCourse_Style_A">
        <ToastContainer />
        {this.state.isLoading ?
          <Dimmer active inverted>
            <Loader content='Data Loading...' active inline='centered' size="medium" />
          </Dimmer> : null}
        <Row>
          <Formik 
            enableReinitialize={true}
            initialValues={this.state}
            validationSchema={this.schema}
            onSubmit={this.onSubmit}
          >{({setFieldValue})=>
            (<Form>
              <span className="createCourse_Style_B"><i className="fa fa-graduation-cap"></i>
                {" "}  {this.state.id === "new" ? "Create Course" : "Update Course"}
              </span>
              <Row>
                <InputField label='Education Level' inputtype='select' isClearable={true} mandatoryField="true" fieldSize="6" name='educationLevel' type='select' options={this.state.educationLevelOptions} placeholder='Select Education' />
                <InputField label='Course Name' inputtype='text' fieldSize="6" mandatoryField="true" name='name' type='text' placeholder='Enter course name' onKeyDown={(evt) => ["+", "!", "@", "#", "$", "%", "^", "*", "/", ",", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", ":", ";", "'", '"', "\\", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",].includes(evt.key) && evt.preventDefault()} />
              </Row>
              <Row>
                <InputField label='Duration' inputtype='number' min="0" onKeyDown={(evt) => ["e", "E", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "}", "[", "]", ":", ";", ".", ",", "?", "<", ">", "/", "\\"].includes(evt.key) && evt.preventDefault()} fieldSize="6" mandatoryField="true" name='duration' type='number' placeholder='Enter duration' 
                onChange={(e) => {setFieldValue('duration', e.target.value); this.checkDuration(e.target.value)}}
                />
                <InputField label='Eligibility' inputtype='text' fieldSize="6" mandatoryField="true" name='eligibility' type='text' placeholder='Enter eligibility' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "*", "/", "_", ",", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", '"', "\\"].includes(evt.key) && evt.preventDefault()} />
              </Row>
              <center>
                <Button className="createCourse_Style_C" type="submit" color="blue">   {this.state.id === 'new' ? 'Create' : 'Update'}   </Button>
                <Button onClick={() => { this.props.history.push("/settings/courses"); }}>Cancel</Button>
                {this.state.id !== 'new' && this.state.permissions.canDelete === true?
                  <Button color="red" type="button" onClick={() => { this.handleCourseDelete(this.state.id) }}>Delete</Button> : null}
              </center>
            </Form>)}
          </Formik>

        </Row>
      </div>
    );
  }
}