import moment from 'moment';
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Row } from "reactstrap";
import { Button, Dimmer, Icon, Loader } from "semantic-ui-react";
import Swal from "sweetalert2";
import Axios from "../../AxiosConfig/config";
import './style.css';
import Select from 'react-select';
export default class Users extends Component {
  state = {
    currentPage: 1,
    totalDocs: 0,
    userList: [],
    selectedRows: [],
    isLoading: false,
    pagiOptions: [{ value: "10", label: "10" }, { value: "20", label: "20" }, { value: "30", label: "30" }, { value: "40", label: "40" }, { value: "50", label: "50" }],
    pagisizeOptionSelect: { value: '10', label: '10' },
  };

  onPaginationChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.getAllUsers()
    });
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
  getAllUsers = () => {
    this.setState({ isLoading: true })
    Axios.get(`/user/getAll/${this.state.currentPage}/${this.state.pagisizeOptionSelect.value}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            userList: response.data.content,
            currentPage: response.data.number + 1,
            totalDocs: response.data.totalElements,
            isLoading: false,
          });
        }
        else {
          this.setState({ isLoading: false })
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false })
        toast.error("Unable to get users information")
      });
  }
  componentDidMount() {
    this.getAllUsers();
  };
  handleDelete = (id) => {
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
        this.setState({ isLoading: true });
        Axios.delete(`user/delete/${id}`)
          .then((response) => {
            if (response.status === 200) {
              this.setState({ isLoading: false })
              toast.error("User details deleted successfully..!")
              this.getAllUsers();
            } else {
              this.setState({ isLoading: false });
            }
          }).catch((error) => {
            this.setState({ isLoading: false });
            toast.error("Unable to delete user information")
          })
      }
    })
  };
  actions = (cell, row) => {
    return (
      <span>
        <i className="fa fa-trash  demo_style_A" onClick={() => this.handleDelete(row.userId)}></i>{" "}
        <Link to={`/home/${row.userId}`} ><Icon name="pencil" ></Icon></Link>
      </span>
    )
  }

  dateHandle = (cell, row) => {
    return cell ? moment(cell).format('DD-MM-YYYY') : null;
  }
  pagiHandleChange = (page) => {
    this.setState({ pagisizeOptionSelect: page, currentPage: 1 }, () => {
      this.getAllUsers()
    })
  }
  selectRow = {
    mode: "checkbox",
    onSelect: (row, isSelect, e) => {
      let data = this.state.selectedRows;
      if (isSelect) {
        data.push(row.userId);
      } else {
        data.forEach((key, index) => {
          if (key && key === row.userId) data.splice(index, 1)
        });
      }
      this.setState({ selectedRows: data });
    },
    onSelectAll: (isSelect, rows, e) => {
      let data = [];
      if (isSelect) {
        if (data.length === 0) data = [...rows];
        else data.push(...rows.userId);
      } else {
        let selectedData = [];
        data.forEach((key) => {
          let flag = 0;
          rows.forEach((row) => {
            if (row.userId === key.userId) {
              flag++;
            }
          });
          if (flag === 0) {
            selectedData.push(key.userId);
          }
        });
        data = selectedData;
      }
      this.setState({ selectedRows: data });
    },
  };
  bulkDeleteUsers = () => {
    let payload = {};
    let payloadIds = [];
    this.state.selectedRows.forEach((ids, index) => {
      if (typeof ids === 'object') {
        payloadIds.push(ids.userId)
      } else {
        payloadIds.push(ids)
      }
    });
    payload.ids = payloadIds;
    Axios.put(`/user/updateuserstatus/false`, payload)
      .then(res => {
        if (res.status === 200) {
          toast.success("Users deleted successfully");
          this.setState({ selectedRows: [] });
          this.getAllUsers();
        }
      })
      .catch(err => {
        toast.error("Unable to delete users");
      })
  }
  render() {
    return (
      <div>
        <ToastContainer />
        {this.state.isLoading ?
          <Dimmer active inverted>
            <Loader content='Data Loading...' active inline='centered' size="medium" />
          </Dimmer>
          : null}
        <Row >
          <Col md={9} xs={12}>
            <span className="createDemo_style_E" size="large" ><i className="fa fa-user"></i> Users </span>
          </Col>
          <Col md={3} xs={12} className="formdy demo_style_E">
            <Button title="Preview" color="green" size="small" className="demoImage_eye_style" aria-hidden="true" onClick={() => { this.props.history.push("/home/new") }}>Add User</Button>
            {this.state.selectedRows.length > 0 ? <Button color="red" className="notifybuttonstyle" onClick={this.bulkDeleteUsers}>Bulk Delete</Button> : null}
          </Col>
        </Row>
        <BootstrapTable striped keyField="userId" selectRow={this.selectRow} data={this.state.userList} hover multiColumnSearch={true} >
          <TableHeaderColumn dataFormat={this.actions} width='80' dataAlign='center'>Actions </TableHeaderColumn>
          <TableHeaderColumn dataField='userId' dataSort width='280'>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='firstName' dataSort width='200'>First Name</TableHeaderColumn>
          <TableHeaderColumn dataField='lastName' dataSort width='200'>Last Name</TableHeaderColumn>
          <TableHeaderColumn dataField='dob' dataSort width='110' dataFormat={this.dateHandle}>Date of Birth</TableHeaderColumn>
          <TableHeaderColumn dataField='gender' dataSort width='90' >Gender</TableHeaderColumn>
          <TableHeaderColumn dataField='email' dataSort width='260' >Email</TableHeaderColumn>
          <TableHeaderColumn dataField='mobile' dataSort width='100' >Mobile</TableHeaderColumn>
          <TableHeaderColumn dataField='fullAddress' dataSort width='250' >Full Address</TableHeaderColumn>
        </BootstrapTable>< br />
        <Row >
          <Col md={2}>
            <Select
              value={this.state.pagisizeOptionSelect}
              onChange={this.pagiHandleChange}
              options={this.state.pagiOptions}
            />
          </Col>
          <Col md={10} >
            <div className='paginationFor_demo_style'>
              <Pagination onChange={this.onPaginationChange.bind(this)} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                pageSize={this.state.pagisizeOptionSelect ? this.state.pagisizeOptionSelect.value : "10"} defaultPageSize={10} showQuickJumper current={this.state.currentPage} total={this.state.totalDocs} locale={localeInfo} itemRender={this.prevNextArrow} />
            </div>
          </Col>
        </Row>
      </div >
    );
  }
}