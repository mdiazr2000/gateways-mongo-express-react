import {useLocation, useNavigate} from "react-router";
import React, {useState} from "react";
import ErrorView from "../../components/error/errorview";
import {getEditGatewaysEndpoint, API_ENDPOINT, getGatewaysEndpoint} from "../../core/api/endpoints";
import {PostUploadRequest, GetRequest, PutRequest, PostRequest} from "../../core/api/api-request";
import { useStoreon } from 'storeon/react';
import "./addGateway.css";

export default function EditGateway() {

    const location = useLocation();
    let navigate = useNavigate();

    const { dispatch, auth } = useStoreon('auth');

    const [serialNumber, setSerialNumber] = useState(location.state.gateway.serial_number);
    const [name, setName] = useState(location.state.gateway.name);
    const [ipAddress, setIpAddress] = useState(location.state.gateway.ip_address);
    const [error, setError] = useState();

    const editGateway = async () => {

        const url = getEditGatewaysEndpoint(location.state.gateway._id);
        const result = await PostRequest(url , {
            serial_number : serialNumber,
            name: name,
            ip_address : ipAddress,
        }, auth.accessToken);
        result.status === 401 && navigate('/');
        result.status !== 200 && setError(result.data.error);
        result.status === 200 && navigate('/dashboard');
    }

    return (
        <div style={{width:'100%'}} className="form-container-add-gateway">
            <div style={{width: '300px'}}>
                {error && <ErrorView error={error}  />}
                <div className="form-container" style={{paddingTop:'30px'}}>
                    <div className="form-sub-container">

                        <div className="logo-form-container"></div>

                        <div className="form-header">
                            <div className="form-title"><h3>Edit Gateway</h3></div>

                            <form>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Serial number</label>
                                    <input type="text" className="form-control" placeholder="Enter serial number"
                                           value={serialNumber}
                                           onChange={(event) => {
                                               setSerialNumber(event.target.value);
                                           }} />
                                </div>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Name</label>
                                    <input type="text" className="form-control" placeholder="Enter name"
                                           value={name}
                                           onChange={(event) => {
                                               setName(event.target.value);
                                           }}/>
                                </div>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Ip Address</label>
                                    <input type="text" className="form-control" placeholder="Enter ip address"
                                           value={ipAddress}
                                           onChange={(event) => {
                                               setIpAddress(event.target.value);
                                           }}/>
                                </div>


                                <div className="form-button">
                                    <button style={{width: '300px'}} onClick={editGateway}
                                            type="button" className="btn btn-primary btn-block">Add</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}