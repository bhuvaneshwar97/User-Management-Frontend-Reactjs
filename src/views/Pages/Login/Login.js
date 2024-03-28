import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import "./style.css";
import { Dimmer, Loader } from 'semantic-ui-react';
import "react-toastify/dist/ReactToastify.css";
import loginpic from '../../../assets/img/brand/loginpic.jpg';
class Login extends Component {
  state = {
    isLoading: false
  }
  values = {
    username: '',
    password: ''
  }
  handleSubmit = (data) => {
    if (data.username.trim().toLowerCase() === "user@gmail.com" && data.password.trim().toLowerCase() === "12345") {
      localStorage.setItem('loggedin', data.username.trim().toLowerCase());
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Login Successful',
        showConfirmButton: false,
        timer: 1500
      })
      this.props.history.push('/home');
    }
    else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Invalid Credentials!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
  render() {
    return (
      <div className='body1'>
        {this.state.isLoading ?
          <Dimmer active inverted className="dimmerstylelogin">
            <Loader content='Please wait...' active inline='centered' size="medium" />
          </Dimmer> : null}
        <Formik
          initialValues={this.values}
          onSubmit={this.handleSubmit}
          validationSchema={Yup.object().shape({
            username: Yup.string().required('Please enter email.').email('Email is invalid'),
            password: Yup.string().required('Please enter password.'),
          })}
        >
          <Form>
            <div className="app flex-row align-items-center" >
              <Container className='mobilestyle'>
                <Row className="justify-content-center">
                  <Card className="p-4 secondcard">
                    <CardBody>
                      <div className="cover-photo"></div>
                      <div className="photo">
                        <img src={loginpic} alt="" className='nextcard' />
                      </div>
                      <div className='wholeloginstyle'>
                        <h1 className='textstyle'>Login</h1>
                        <p className="text-muted textstyle">Sign in to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-user"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input tag={Field} type="text" name='username' placeholder="Please enter email" />
                          </InputGroup>
                          <ErrorMessage name='username' className='login_style' component="div" />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-lock"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input tag={Field} type="password" name='password' placeholder="Please enter Password" autoComplete="current-password" />
                          </InputGroup>
                          <ErrorMessage name='password' component="div" className='login_style' />
                        </InputGroup>
                        <Row>
                          <Col md="3" xs="3">
                          </Col>
                          <Col md="5" xs="5">
                            <Button className="px-4 buttonstyle" type="submit">Login</Button>
                          </Col>
                          <Col md="4" xs="4">
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </Row>
              </Container>
            </div>
          </Form>
        </Formik>
      </div>
    );
  }
}
export default Login;