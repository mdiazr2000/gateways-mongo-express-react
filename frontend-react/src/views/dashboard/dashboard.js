import React, {useState, useEffect} from 'react';
import {API_ENDPOINT,
    getDeleteGatewaysEndpoint,
    getGatewaysEndpoint,
    getDeleteDeviceEndpoint} from "../../core/api/endpoints";
import {PostUploadRequest, GetRequest, PutRequest, PostRequest, DeleteRequest} from "../../core/api/api-request";
import { useStoreon } from 'storeon/react';
import ErrorView from "../../components/error/errorview";
import DisplayButton from "../../components/displayButton/displayButton"
import NotificationView from "../../components/notification/notification";
import "./dasboard.css";
import { Container,Row,Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import update from 'immutability-helper';
import { format } from 'date-fns'
import ModalDeleteGateway from '../../components/modal/modalDeleteGateway'
import { Button,Modal } from 'react-bootstrap'


export default function Dashboard() {

    let navigate = useNavigate();

    const { dispatch, auth } = useStoreon('auth');
    const [fileSelected, setFileSelected] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [filesUser, setFilesUser] = useState(null);
    const [gateways, setGateways] = useState(null);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [showHide, setShowHide] = useState(false);
    const [showHideDevice, setShowHideDevice] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);


    const [selectedItem, setSelectedItem] = useState(null);
    const [newName, setNewName] = useState(null);

    useEffect(() => {
        getAllGateways();
    }, [])


    const getAllGateways = async () => {

        const url = getGatewaysEndpoint();
        const result = await GetRequest(url , auth.accessToken);
        result.status === 401 && navigate('/');
        if ( result.status == 200) {
           const listGateways = result.data.gateways.map(item => {
                item = Object.assign({}, item, { show: true });
                return item;
            })
            setGateways(listGateways);
        }
    }

    const hideDevices = (id) => {
        const indexFound = gateways.findIndex((item) => item._id === id);
        let objGateway = gateways[indexFound];
        objGateway.show = !gateways[indexFound].show;
        const updatedGateways = update(gateways, {$splice: [[indexFound, 1, objGateway]]});  // array.splice(start, deleteCount, item1)
        setGateways(updatedGateways);
    }

    const gotoAddDevice = (item) => {
        navigate('/add-device', {state:{gateway:item}});
    }

    const gotoEditGateway = (item) => {
        navigate('/edit-gateway', {state:{gateway:item}});
    }

    const handleModalShow = () => {
        setShowHide(true);
    }
    const handleModalHide = () => {
        setShowHide(false);
    }

    const handleModalDeviceShow = () => {
        setShowHideDevice(true);
    }
    const handleModalDeviceHide = () => {
        setShowHideDevice(false);
    }

    const gotoRemoveGateway = (item) => {
        setSelectedGateway(item);
        handleModalShow();
    }

    const deleteGateway = async () => {

        handleModalHide();
        const url = getDeleteGatewaysEndpoint(selectedGateway._id);
        const result = await DeleteRequest(url , {},auth.accessToken);
        result.status === 401 && navigate('/');
        if ( result.status == 200) {
            getAllGateways()
        }
    }

    const gotoRemoveDevice = (item, device) => {
        setSelectedGateway(item);
        setSelectedDevice(device);
        handleModalDeviceShow();
    }

    const gotoEditDevice = (gateway, device) => {
        navigate('/edit-device', {state:{gateway:gateway, device: device}});
    }

    const deleteDevice = async () => {

        handleModalDeviceHide();
        const url = getDeleteDeviceEndpoint(selectedGateway._id, selectedDevice._id);
        const result = await DeleteRequest(url , {},auth.accessToken);
        result.status === 401 && navigate('/');
        if ( result.status == 200) {
            getAllGateways()
        }
    }

    return(
        <div style={{display: 'flex'}}>

            <Modal show={showHide} id="deletedGateway">
                <Modal.Header closeButton onClick={() => handleModalHide()}>
                    <Modal.Title>Delete a Gateway</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete Gateway: {selectedGateway && selectedGateway.serial_number}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalHide()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => deleteGateway()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showHideDevice} id="deletedDevice">
                <Modal.Header closeButton onClick={() => handleModalDeviceHide()}>
                    <Modal.Title>Delete a Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete Device: {selectedDevice && selectedDevice.uid_number}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalDeviceHide()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => deleteDevice()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="container-dashboard">
                {error && <ErrorView error={error}  />}
                {message && <NotificationView message={message}  />}
              <div style={{width: '900px', paddingTop: '30px'}}>
               <div><h3>Gateways</h3></div>
              <div className="form-row" style={{width: '900px'}}>
                <div className="form-group form-for-update" style={{width: '900px',
                    display: 'flex', paddingBottom: '0px'}}>
                    <button type="submit" className="btn btn-dark" onClick={() => navigate('/add-gateway')}>Add Gateway</button>
                </div>

            </div>

                    <div style={{paddingTop:'30px'}} >
                        <Container>
                            <Row className="header-table">
                                <Col className="max-width-50">
                                    </Col>
                                <Col>Serial number</Col>
                                <Col>Name</Col>
                                <Col>Ip Address</Col>
                                <Col>Number Devices</Col>
                                <Col>Add Device</Col>
                                <Col>Edit Gateway</Col>
                                <Col>Delete Gateway</Col>
                            </Row>
                            {
                                gateways && gateways.length &&  gateways.map(item =>
                                {

                                  let rowsDevices = item.devices && item.devices.length && item.devices.map( device => {
                                      return <Row className="padding-device" key={device._id}>
                                          <Col>{device.uid_number}</Col>
                                          <Col>{device.vendor}</Col>
                                          <Col>{format(new Date(device.date_created), "yyyy-MM-dd")}</Col>
                                          <Col>{device.status}</Col>
                                          <Col onClick={() => gotoEditDevice(item,device)} className="button-display">
                                              <div style={{marginLeft: '30px'}}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                       fill="currentColor" className="bi bi-pencil"
                                                       viewBox="0 0 16 16">
                                                      <path
                                                          d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                  </svg>
                                              </div>
                                          </Col>
                                          <Col onClick={() => gotoRemoveDevice(item, device)} className="button-display">
                                              <div style={{marginLeft: '30px'}}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                       fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                      <path fillRule="evenodd"
                                                            d="M6.5 1a.5.5 0 0 0-.5.5v1h4v-1a.5.5 0 0 0-.5-.5h-3ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1H3.042l.846 10.58a1 1 0 0 0 .997.92h6.23a1 1 0 0 0 .997-.92l.846-10.58Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                  </svg>
                                              </div>
                                          </Col>
                                      </Row>

                                  })

                                  let rowsGateway = <Row className="header-row-items" key={item.id}>
                                      <Col key={item._id}>
                                          <Row>
                                              <Col className="max-width-50 button-display" onClick={() => hideDevices(item._id) }>
                                                  <DisplayButton show={item.show}  />
                                              </Col>
                                              <Col className="txt-overflow">{item.serial_number}</Col>
                                              <Col>{item.name}</Col>
                                              <Col>{item.ip_address}</Col>
                                              <Col>{item.devices.length}</Col>
                                              <Col onClick={() => gotoAddDevice(item)} className="button-display">
                                                  <div style={{marginLeft: '30px'}}>

                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                       fill="currentColor" className="bi bi-plus-circle"
                                                       viewBox="0 0 16 16">
                                                      <path
                                                          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                      <path
                                                          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                  </svg>
                                                  </div>
                                              </Col>
                                              <Col onClick={() => gotoEditGateway(item)} className="button-display">
                                                  <div style={{marginLeft: '30px'}}>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                           fill="currentColor" className="bi bi-pencil"
                                                           viewBox="0 0 16 16">
                                                          <path
                                                              d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                      </svg>
                                                  </div>
                                              </Col>
                                              <Col onClick={() => gotoRemoveGateway(item)} className="button-display">
                                                  <div style={{marginLeft: '30px'}}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                       fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                      <path fillRule="evenodd"
                                                            d="M6.5 1a.5.5 0 0 0-.5.5v1h4v-1a.5.5 0 0 0-.5-.5h-3ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1H3.042l.846 10.58a1 1 0 0 0 .997.92h6.23a1 1 0 0 0 .997-.92l.846-10.58Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                  </svg>
                                                  </div>
                                              </Col>
                                          </Row>
                                          {item.show &&
                                          <Row className="header-table-device padding-device">
                                              <Col>UID Number</Col>
                                              <Col>Vendor</Col>
                                              <Col>Date</Col>
                                              <Col>Status</Col>
                                              <Col>Edit Device</Col>
                                              <Col>Delete Device</Col>
                                          </Row>
                                          }
                                          {item.show && rowsDevices.length && rowsDevices}
                                      </Col>

                                  </Row>
                                  return rowsGateway
                                })
                            }


                        </Container>
                    </div>

            </div>
            </div>
        </div>
    );
}