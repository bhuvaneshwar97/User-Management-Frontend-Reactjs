import React, { Component } from "react";
import { Button, Dimmer, Loader, } from "semantic-ui-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../hoc/InputFields";
import Axios from "../../AxiosConfig/config";
import { Row } from "reactstrap";
import './style.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default class CreateUser extends Component {
  state = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    fullAddress: "",
    mobile: "",
    id: this.props.match.params.id,
    genderOptions: [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }],
    isLoading: false
  };
  schema = () => {
    const phoneRegExp = /^[6-9]\d{9}$/
    return Yup.object().shape({
      firstName: Yup.string().required("First name is required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").trim(),
      lastName: Yup.string().required("Last name is required").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").trim(),
      dob: Yup.date().max(new Date(Date.now() - 472975200000), "You must be at least 15 years").required("Date of birth is required"),
      gender: Yup.object().nullable().required("Gender is required"),
      email: Yup.string().required('Email is required').email('Email is invalid'),
      fullAddress: Yup.string().required("Full address is required"),
      mobile: Yup.string().matches(phoneRegExp, "Please enter valid mobile number").nullable().min(10).required("Mobile number is required"),
    });
  };
  componentDidMount() {
    if (this.state.id !== "new") {
      this.setState({ isLoading: true });
      Axios.get('user/getByID/' + this.state.id).then(response => {
        if (response.status === 200) {
          this.setState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            dob: new Date(response.data.dob).toISOString().slice(0, 10),
            gender: response.data.gender ? { label: response.data.gender, value: response.data.gender } : null,
            email: response.data.email,
            fullAddress: response.data.fullAddress,
            mobile: response.data.mobile,
            isLoading: false
          })
        } else {
          this.setState({ isLoading: false });
        }
      }).catch((e) => {
        this.setState({ isLoading: false });
        toast.error("Unable to get user information")
      })
    }
  }
  onSubmit = (e) => {
    let payload = {
      firstName: e.firstName,
      lastName: e.lastName,
      dob: e.dob,
      gender: e.gender && e.gender.value ? e.gender.value : "",
      email: e.email,
      fullAddress: e.fullAddress,
      mobile: e.mobile,
    };
    if (this.state.id === 'new') {
      this.setState({ isLoading: true });
      Axios.post('/user/create', payload)
        .then((response) => {
          if (response.status === 201) {
            this.setState({ isLoading: false });
            toast.success("User details created successfully..!")
            setTimeout(() => {
              this.props.history.push("/home");
            }, 2000)
          } else {
            this.setState({ isLoading: false });
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          toast.error("Unable to create user details");
        });
    }
    else {
      this.setState({ isLoading: true });
      Axios.put('user/update/' + this.state.id, payload)
        .then(response => {
          if (response.status === 200) {
            this.setState({ isLoading: false });
            setTimeout(() => {
              this.props.history.push("/home");
            }, 2000)
            toast.success("User details updated successfully..!")
          } else {
            this.setState({ isLoading: false })
          }
        }).catch((e) => {
          this.setState({ isLoading: false });
          toast.error("Unable to update user information");
        })
    }
  };
  render() {
    return (
      <>
        <ToastContainer />
        {this.state.isLoading ?
          <Dimmer active inverted>
            <Loader content='Data Loading...' active inline='centered' size="medium" />
          </Dimmer> : null}
        <Formik
          enableReinitialize={true}
          initialValues={this.state}
          validationSchema={this.schema}
          onSubmit={this.onSubmit}
        >{({ values, setFieldValue }) => (
          <Form>
            <Row>
              <span className="createDemo_style_E" size="large" ><i className="fa fa-user"></i>
                {" "} {this.state.id === "new" ? "Create User" : "Update User"}
              </span>
            </Row>
            <br />
            <Row>
              <InputField label='First Name' fieldSize="6" inputtype='text' mandatoryField="true" name='firstName' type="text" placeholder='Enter first name' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} />
              <InputField label='Last Name' fieldSize="6" inputtype='text' mandatoryField="true" name='lastName' type='text' placeholder='Enter last name' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "\\", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(evt.key) && evt.preventDefault()} />
            </Row>
            <Row>
              <InputField label='Date of Birth' inputtype='date' fieldSize="6" mandatoryField="true" name='dob' type='date' placeholder='Enter date of birth' />
              <InputField label='Gender' inputtype='select' fieldSize="6" mandatoryField="true" name='gender' type='select' placeholder='Select one Option' options={this.state.genderOptions} />
            </Row>
            <Row>
              <InputField label='Email' inputtype='email' fieldSize="6" mandatoryField="true" name='email' type='email' placeholder='Enter email' onKeyDown={(evt) => ["+", "-", "!", "#", "$", "%", "^", "&", "*", "/", "\\", "`", "~", "=", "{", "}", "[", "]", "|", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} />
              <InputField label='Mobile Number' min="0" inputtype='number' onChange={(e) => { return ((e.target.value.length < 11) && (e.target.value > 0)) ? setFieldValue("mobile", e.target.value) : (e.target.value ? null : setFieldValue("phone", null)) }} fieldSize="6" mandatoryField="true" name='mobile' type='number' placeholder='Enter mobile number' onKeyDown={(evt) => ["+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "/", "_", ",", ".", "`", "~", "=", "{", "}", "[", "]", "|", "\\", "<", ">", "?", "/", "(", ")", ":", ";", "'", '"'].includes(evt.key) && evt.preventDefault()} />
            </Row>
            <Row>
              <InputField label='Full Address' inputtype='textarea' fieldSize="6" mandatoryField="true" name='fullAddress' type='text' placeholder='Enter full address' />
            </Row>
            <Row >
              <center>
                <Button type="reset" onClick={() => { this.props.history.push("/home") }}>Cancel</Button>
                <Button color="blue" type="submit" >   {this.state.id === 'new' ? 'Create' : 'Update'}   </Button>
              </center>
            </Row>
          </Form>
        )}
        </Formik>
      </>
    );
  }
}