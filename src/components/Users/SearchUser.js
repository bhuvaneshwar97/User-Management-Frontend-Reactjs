
import React, { useCallback, useEffect } from "react";
import { Input, Row, Col, Card, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import './style.css';
import Axios from "../../AxiosConfig/config";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Icon } from "semantic-ui-react";
function SearchUser() {
    const [state, setState] = React.useState({ searchData: "", isOpen: false, fetchedItems: [], studentInfo: null, searchStudentId: "" });
    const [searchInput, setSearchInput] = React.useState("");

    const setQuery = useCallback(() => {
        if (searchInput) {
            Axios.get(`user/search/${searchInput}`)
                .then(res => {
                    if (res.status === 200) {
                        setState((prevState) => ({
                            ...prevState,
                            isOpen: res.data.length > 0 ? true : false,
                            fetchedItems: res.data,
                            studentInfo: null
                        }))
                    }
                })
                .catch(err => { console.log(err) });
        }
    }, [searchInput]);

    useEffect(() => {
        if (searchInput) {
            setQuery();
        }
    }, [searchInput, setQuery]);

    const handleCancel = () => {
        setSearchInput("");
        setState((prevState) => ({
            ...prevState,
            isOpen: false,
        }));
    };

    const viewData = (data) => {
        Axios.get(`/user/getByID/${data.userId}`)
            .then(res => {
                if (res.status === 200) {
                    setState((prevState) => ({
                        ...prevState,
                        studentInfo: res.data,
                        searchStudentId: data.userId
                    }))
                }
            })
            .catch(err => { console.log(err) });
    };

    return (
        <div>
            <Row>
                <Col md={5}>
                    <Dropdown className='dropdown-colmun' toggle={() => setState({ isOpen: !state.isOpen })} isOpen={state.isOpen}>
                        <DropdownToggle className='searchDropdown'>
                            <Input className='searchInFilter' value={searchInput} onChange={(e) => { setSearchInput(e.target.value); setQuery() }} name="searchInput" placeholder="Search with id, name" />
                            <Icon name="close" className="searchAdmissionCloseIcon" onClick={handleCancel}></Icon>
                        </DropdownToggle>
                        {state.fetchedItems && state.fetchedItems.length > 0 &&
                            <DropdownMenu>
                                {state.fetchedItems ? state.fetchedItems.map((item) => (
                                    <div key={item.admissionNo} className='div-dropdown-item'>
                                        <DropdownItem onClick={() => { viewData(item) }} className='dropdownItemfilter' key={item.adhaarCardNo}>
                                            <p style={{ marginBottom: 0 }}>
                                                <span className='dropdownItem-left'>ID : </span>{item.userId ? <span className='dropdownItem-right'>{item.userId},</span> : null}
                                            </p>
                                            <p style={{ marginBottom: 0 }}>
                                                <span className='dropdownItem-left'>First Name: </span>{item.firstName ? <span className='dropdownItem-right'>{item.firstName},</span> : null}
                                                <span className='dropdownItem-left'> Last Name: </span>{item.lastName ? <span className='dropdownItem-right'>{item.lastName},</span> : null}
                                            </p>
                                            <p style={{ marginBottom: 0 }}>
                                                <span className='dropdownItem-left'>Email :</span>{item.email ? <span className='dropdownItem-right'>{item.email},</span> : null}
                                            </p>
                                        </DropdownItem>
                                    </div>
                                )) : null}
                            </DropdownMenu>
                        }
                    </Dropdown>
                </Col>
            </Row>
            <br />
            <br />
            {state.studentInfo ?
                <div>
                    <Row>
                        <Col md={5}>
                            <Card className="basicDetails">
                                <Row >
                                    <center>
                                        <span className="editIconStyle">
                                            <Link id={state.searchStudentId} to={`/home/${state.searchStudentId}`}> <Icon name="pencil" className="admission_B" /> </Link>
                                        </span>
                                        <p className="viewName">{state.studentInfo.firstName}  {state.studentInfo.lastName}</p>
                                    </center>
                                </Row>
                            </Card>
                            <Card className="basicDetails_2">
                                <Row>
                                    <p><span className="personal-details-left">Email</span><span className="personal-details-right">{state.studentInfo && state.studentInfo.email ? state.studentInfo.email : "Not Available"}</span></p>
                                    <p><span className="personal-details-left">Mobile No</span><span className="personal-details-right">{state.studentInfo && state.studentInfo.mobile ? state.studentInfo.mobile : "Not Available"}</span></p>
                                    <p><span className="personal-details-left">Gender</span><span className="personal-details-right">{state.studentInfo && state.studentInfo.gender ? state.studentInfo.gender : "Not Available"}</span></p>
                                    <p><span className="personal-details-left">Date of Birth</span><span className="personal-details-right">{state.studentInfo && state.studentInfo.dob ? moment(state.studentInfo.dob).format("DD-MM-YYYY") : "Not Available"}</span></p>
                                    <p><span className="personal-details-left">Full Address</span><span className="personal-details-right">{state.studentInfo && state.studentInfo.fullAddress ? state.studentInfo.fullAddress : "Not Available"}</span></p>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div> : null}
        </div>
    )
}

export default SearchUser;
