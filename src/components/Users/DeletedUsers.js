import moment from "moment";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { ToastContainer, toast } from "react-toastify";
import { Button, Col, Row } from 'reactstrap';
import { Dimmer, Loader } from "semantic-ui-react";
import Axios from "../../AxiosConfig/config";
import './style.css';
import Select from 'react-select';
export default class DeletedUsers extends Component {
  state = {
    currentPage: 1,
    totalDocs: "0",
    NotificationsList: [],
    selectedRows: [],
    isLoading: false,
    pagiOptions: [{ value: "10", label: "10" }, { value: "20", label: "20" }, { value: "30", label: "30" }, { value: "40", label: "40" }, { value: "50", label: "50" }],
    pagisizeOptionSelect: { value: '10', label: '10' }
  }
  pagiHandleChange = (page) => {
    this.setState({ pagisizeOptionSelect: page, currentPage: 1 }, () => {
      this.tableListData();
    })
  }
  PaginationHangle = (data) => {
    this.setState({
      currentPage: data
    }, () => this.tableListData())
  }
  componentDidMount = () => {
    this.tableListData()
  }
  tableListData = () => {
    this.setState({ isLoading: true })
    let payload = {};
    payload.academicYear = localStorage.getItem('academicYear') ? localStorage.getItem('academicYear') : null;
    Axios.get(`user/getalldeletedusers/${this.state.currentPage}/${this.state.pagisizeOptionSelect.value}`, payload)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            NotificationsList: response.data.content,
            currentPage: response.data.number + 1,
            totalDocs: response.data.totalElements,
            isLoading: false
          })
        }
        else {
          this.setState({ isLoading: false })
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false })
        toast.error("Unable to load notifications")
      });
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
  enableUser = () => {
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
    Axios.put(`/user/updateuserstatus/true`, payload)
      .then(res => {
        if (res.status === 200) {
          toast.success("Users enabled successfully");
          this.setState({ selectedRows: [] });
          this.tableListData();
        }
      })
      .catch(err => {
        toast.error("Unable to enable users");
      })
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
  dateHandle = (cell, row) => {
    return cell ? moment(cell).format('DD-MM-YYYY') : null;
  }
  render() {
    return (
      <>
        <ToastContainer
          position="top-right"
          limit={1}
          className="notification_style_S"
        />
        {this.state.isLoading ?
          <Dimmer active inverted>
            <Loader content='Please wait...' active inline='centered' size="medium" />
          </Dimmer> : null}
        <Row>
          <Col md={9}>
            <span className='createDemo_style_E' size="large" ><i className="fa fa-bars"></i>
              {" "} Deleted Users
            </span>
          </Col>
          {this.state.selectedRows.length > 0 ?
            <Col md={3}>
              <Button color="success" className="notifybuttonstyle" onClick={() => this.enableUser()}>Enable Users</Button>{" "}
            </Col>
            : null}
        </Row>
        <BootstrapTable striped keyField="userId" selectRow={this.selectRow} data={this.state.NotificationsList} hover multiColumnSearch={true} >
          <TableHeaderColumn dataField='userId' dataSort width='280'>ID</TableHeaderColumn>
          <TableHeaderColumn dataField='firstName' dataSort width='150'>First Name</TableHeaderColumn>
          <TableHeaderColumn dataField='lastName' dataSort width='150'>Last Name</TableHeaderColumn>
          <TableHeaderColumn dataField='dob' dataSort width='110' dataFormat={this.dateHandle}>Date of Birth</TableHeaderColumn>
          <TableHeaderColumn dataField='gender' dataSort width='90' >Gender</TableHeaderColumn>
          <TableHeaderColumn dataField='email' dataSort width='220' >Email</TableHeaderColumn>
          <TableHeaderColumn dataField='mobile' dataSort width='100' >Mobile</TableHeaderColumn>
          <TableHeaderColumn dataField='fullAddress' dataSort width='250' >Full Address</TableHeaderColumn>
        </BootstrapTable>
        <br />
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
              <Pagination onChange={this.PaginationHangle.bind(this)} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                pageSize={this.state.pagisizeOptionSelect ? this.state.pagisizeOptionSelect.value : "10"} defaultPageSize={10} current={this.state.currentPage} total={this.state.totalDocs} locale={localeInfo} itemRender={this.prevNextArrow} />
            </div>
          </Col>
        </Row>
      </>
    )
  }
}