import { AppSidebarToggler } from '@coreui/react';
import PropTypes from 'prop-types';
import "rc-pagination/assets/index.css";
import React, { Component } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { DropdownItem, DropdownMenu, DropdownToggle, Nav,UncontrolledDropdown } from 'reactstrap';
import { Icon } from "semantic-ui-react";
const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {};
class DefaultHeader extends Component {
  render() {  
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <span style={{marginLeft:"30%"}}>
        </span>
        <Nav className="ms-auto" navbar> 
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <Icon name="user" size="large" className="me-2" />
            </DropdownToggle>
            <DropdownMenu className='extraclassstyle1'>
              <DropdownItem className='extraclassstyle' onClick={e => {
                this.props.onLogout(e)
                localStorage.clear();
              }}> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}
DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;
export default DefaultHeader;