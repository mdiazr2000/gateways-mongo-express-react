import {useNavigate} from "react-router";
import React, {useState} from "react";
import {useLocation} from 'react-router-dom';
import ErrorView from "../../components/error/errorview";
import "./addGateway.css";
import { useStoreon } from 'storeon/react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getEditDeviceEndpoint} from "../../core/api/endpoints";
import {PostRequest} from "../../core/api/api-request";
import { format } from 'date-fns'

export default function EditDevice() {

    const location = useLocation();
    let navigate = useNavigate();

    const { dispatch, auth } = useStoreon('auth');

    const [uidNumber, setUidNumber] = useState(location.state.device.uid_number);
    const [vendor, setVendor] = useState(location.state.device.vendor);
    const [dateCreated, setDateCreated] = useState(new Date(location.state.device.date_created));
    const [status, setStatus] = useState(location.state.device.status);
    const [error, setError] = useState();

    const editDevice = async () => {

        const formattedDate = format(new Date(dateCreated), "yyyy-MM-dd");
        const url = getEditDeviceEndpoint(location.state.gateway._id, location.state.device._id);
        const result = await PostRequest(url , {
            uid_number : uidNumber,
            vendor: vendor,
            date_created: formattedDate,
            status : status
        }, auth.accessToken);
        result.status === 401 && navigate('/');
        result.status !== 200 && setError(result.data.error);
        result.status === 200 && navigate('/dashboard');
    }

    return (
        <div style={{width:'100%'}} className="form-container-add-gateway">
            <div style={{width: '300px'}}>
                {error && <ErrorView error={error}  />}
                <div className="form-container">
                    <div className="form-sub-container">

                        <div className="logo-form-container"></div>

                        <div className="form-header">
                            <div className="form-title"><h3>Edit Device</h3></div>

                            <form>

                                <div className="form-group label-input" style={{paddingBottom: '0px'}}>
                                    <label>
                                        <h5>Gateway: {location.state.gateway.name}</h5></label>
                                </div>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Uid number</label>
                                    <input type="text" className="form-control" placeholder="Enter uid number"
                                           value={uidNumber}
                                           onChange={(event) => {
                                               setUidNumber(event.target.value);
                                           }} />
                                </div>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Vendor</label>
                                    <input type="text" className="form-control" placeholder="Enter vendor name"
                                           value={vendor}
                                           onChange={(event) => {
                                               setVendor(event.target.value);
                                           }}/>
                                </div>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Date Created</label>
                                    <DatePicker
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control" selected={dateCreated} onChange={(date) => setDateCreated(date)} />
                                </div>

                                <div className="form-group label-input">
                                    <label style={{paddingBottom: '20px'}}>Status</label>
                                    <select  className="form-select" value={status} aria-label="Enter status name"
                                             onChange={(event) => {
                                                 setStatus(event.target.value);
                                             }}>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                    </select>
                                </div>


                                <div className="form-button">
                                    <button style={{width: '300px'}} onClick={editDevice}
                                            type="button" className="btn btn-primary btn-block">Save</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}