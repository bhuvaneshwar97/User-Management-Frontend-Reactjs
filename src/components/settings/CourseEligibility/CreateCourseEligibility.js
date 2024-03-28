import React, { Component } from "react";
import { Button, Dimmer, Grid, Loader } from "semantic-ui-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Axios from "../../../AxiosConfig/config";
import InputField from "../../../hoc/InputFields";
import './style.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default class CreateCourseEligibility extends Component {
  state = {
    courseSelect:"",
    specialization: "",
    duration:"",
    eligibility:"", 
    courseSelectOptions:[],
    id: this.props.match.params.id,
    permissions: { canCreate: false, canView: false, canUpdate: false, canDelete: false },
    isLoading: false
  };
  schema = () => {
    return Yup.object().shape({
        courseSelect: Yup.object().required("Course is required"),
       specialization:Yup.string().required("Specialization is required"),
       duration:Yup.string().required("Duration is required"),
       eligibility:Yup.string().required("Eligibility is required"),
    });
  };
  loadDistrictPermissions = () => {
    Axios.get(`bec/permission/display/${localStorage.getItem('roleId')}`).then(
      (response) => {
         if (response.data.status === 200) {
          this.setState({
            permissions: response.data.data.data.course_eligibility,
            isLoading:false
          })
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        toast.error("Unable to get the permission display..! ");
      })
  }
  componentDidMount() {
    this.setState({ isLoading: true })
    this.loadDistrictPermissions();
     Axios.get('bec/course/getAll').then(response => {
         if (response.data.status === 200) {
          const allcourse = []
          response.data.data.map((mapdata, index) => (
            allcourse.push({ value: mapdata._id, label: mapdata.courseName })
          ))
          this.setState({courseSelectOptions: allcourse, isLoading: false })
        }
        else {
          this.setState({ isLoading: false })
        }
      }).catch((e) => {
        this.setState({ isLoading: false });
        toast.error("Unable to get all the state's");
      })
    if (this.state.id !== "new") {
      Axios.get('bec/courseEligibility/getById/' + this.state.id).then(response => {
        if (response.data.status === 200) {
          this.setState({
            isLoading: false,
            courseSelect:{ value: response.data.data.course._id, label: response.data.data.course.courseName },
            specialization: response.data.data.specialization,
            duration:response.data.data.duration,
            eligibility:response.data.data.eligibility
          })
        }
        else {
          this.setState({ isLoading: false })
        }
      }).catch((e) => {
        this.setState({ isLoading: false });
        toast.error("Unable to get the courseEligibility");
      })
    }
  }

  handleCourseEligibilityDelete = (courseEligibilityId) => {    
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
        Axios.delete(`bec/courseEligibility/delete/${courseEligibilityId}`)
          .then((response) => {
            if (response.data.status === 200) {
              this.setState({ isLoading: false });
              toast.error("Record deleted successfully..!")
              setTimeout(() => {
                this.props.history.push('/settings/CourseEligibility')
              }, 1000)
            }else{
              this.setState({isLoading:false})
            }
          }).catch((error) => {
            this.setState({ isLoading: false });
            toast.error("Unable to delete the course eligibility");
          })
      } else {
        this.setState({ isLoading: false });
      }
    })
  };

  onSubmit = (e) => {
    const payload = {
        course: e.courseSelect.value,
        specialization: e.specialization,
        duration:e.duration,
        eligibility:e.eligibility
    };
    this.setState({ isLoading: true });
    if (this.state.id === 'new') {
      Axios.post('bec/create/courseEligibility', payload)
        .then((response) => {
          if (response.data.status === 201) {
            this.setState({ isLoading: false });
            toast.success("Course Eligibility created successfully..!");
            setTimeout(() => {
              this.props.history.push("/settings/CourseEligibility");
            }, 1000)

          } else {
            this.setState({ isLoading: false });
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          toast.error("Unable to create the course");
        });
    }
    else {
      Axios.put('bec/courseEligibility/update/' + this.state.id, payload).then(response => {
        this.setState({ isLoading: false });
        setTimeout(() => {
          this.props.history.push("/settings/CourseEligibility");
        }, 1000)
        toast.success("Course Eligibility details updated successfully..!")
      }).catch((e) => {
        this.setState({ isLoading: false });
        toast.error("Unable to update the course");
      })
    }
  };
  render() {
    return (
      <Grid className="createDistrict_Style_A">
        <ToastContainer />
        {this.state.isLoading ?
          <Dimmer active inverted>
            <Loader content='Data Loading...' active inline='centered' size="medium" />
          </Dimmer> : null}
        <Grid.Row>
          <Grid.Column width={16}>
            <Formik
              enableReinitialize={true}
              initialValues={this.state}
              validationSchema={this.schema}
              onSubmit={this.onSubmit}
            >
              <Form>
                <span className="createDistrict_Style_B" size="large" ><i className="fa fa-address-card-o"></i>
                  {" "} {this.state.id === "new" ? "Create Course Eligibility" : "Update Course Eligibility"}
                </span>
                <div>
                  <Grid columns='equal' stackable>
                    <Grid.Row className="createDistrict_Style_C" >
                      <Grid.Column>                       
                        <InputField label='Course' inputtype='select' isClearable={true} fieldSize="6" mandatoryField="true" options={this.state.courseSelectOptions} name='courseSelect' type="select" />
                        <InputField label='Specialization' inputtype='text' fieldSize="6" mandatoryField="true" name='specialization' type='text' placeholder='Enter specialization'  onKeyDown={(evt) => ["0","1","2","3","4","5","6","7","8","9","\\","`", "~", "!", "@", "#", "$", "%", "^","*","+", "=", "{", "}", "[", "]", ":", ";", ".", ",", "?", "<", ">", "/",].includes(evt.key) && evt.preventDefault()}/>
                        <InputField label='Eligibility' inputtype='textarea' fieldSize="12" mandatoryField="true" name='eligibility' type='textarea' placeholder='Enter eligibility'onKeyDown={(evt) => ["\\","`", "~", "!", "@", "#", "$","^","*","=", "{", "}", "[", "]", ":", ";", ".", ",", "?", "<", ">"].includes(evt.key) && evt.preventDefault()}/>                  
                        <InputField label='Duration' onKeyDown={(evt) => ["\\", "e", "E", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "}", "[", "]", ":", ";", ".", ",", "?", "<", ">", "/",].includes(evt.key) && evt.preventDefault()} inputtype='text' rows="6" fieldSize="6" mandatoryField="true" name='duration' type='text' placeholder='Enter duration'/>                                             
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div><br />
                <center>
                  <Button className="createDistrict_Style_D" type="submit" color="blue">   {this.state.id === 'new' ? 'Create' : 'Update'}   </Button>
                  <Button onClick={() => { this.props.history.push("/settings/CourseEligibility"); }}>Cancel</Button>
                  {this.state.id !== 'new' && this.state.permissions.canDelete === true ? <Button color="red" type="button" onClick={() => this.handleCourseEligibilityDelete(this.state.id)} >Delete</Button> : null}
                </center>
              </Form>
            </Formik>
          </Grid.Column>
          <Grid.Column width={4}></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}