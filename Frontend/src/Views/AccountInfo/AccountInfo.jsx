import "./AccountInfo.scss";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";


const AccountInfo = () => {
    const [accountInfo, setAccountInfo] = useState('');

    /* required: back end API
        API 1: get_user_info (retrieve username/membership/points value)
        API 2: get_previous_tickets (retrieve list of previous movie tickets)
        API 3: get_upcoming_tickets (retrieve list of upcoming movie tickets)
        API 4: get_movies_watched (retrieve list of movies watched in past 30 days)
    */
    return (
        <div className="page-layout">
            <h1 className="title">Account Information</h1>
            <p1> Username: {accountInfo.username}</p1>
            <br></br>
            <p1> Membership: {accountInfo.membership}</p1>
            <br></br>
            <p1> Rewards Points: {accountInfo.points}</p1>
            <br></br>

            <div className="movie-row">
                <div className="info-container">
                    <h1 className="title">Previous Movie Tickets</h1>
                    <div className="list-box">
                        <p1> list container</p1>

                    </div>
                </div>
                <div className="info-container">
                    <h1 className="title">Upcoming Movie Tickets</h1>
                    <div className="list-box">
                        <p1> list container</p1>

                    </div>
                </div>
                <div className="info-container">
                    <h1 className="title">Movies Watched (past 30 Days)</h1>
                    <div className="list-box">
                    </div>
                </div>
            </div>
        </div>
    )
  };
  
  export default AccountInfo;