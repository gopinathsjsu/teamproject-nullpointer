import "../Admin/Admin.scss";
import Button from '../../Components/Button/Button';
import React, {useState} from "react";

const Admin = () => {
    const [scheduleOption, setScheduleOption] = useState('Select...');
    const [viewOption, setViewOption] = useState('30 days');

    function updateScheduleOption(e) {
        setScheduleOption(e.target.value);
    }

    function updateViewOption(e) {
        setViewOption(e.target.value);
    }

    return (
        <section className="admin-page">
            <h1 className="title">Admin Page</h1>
            <h1> Add/update/remove movies/showtimes/theater assignment in the schedule </h1>
            <Button className="button-style" type="button-primary" onClick={null}> Add </Button>
            <Button className="button-style" type="button-primary" onClick={null}> Update </Button>
            <Button className="button-style" type="button-primary" onClick={null}> Remove </Button>
            <select className="drop-down" value={scheduleOption} onChange={updateScheduleOption}>
                <option value="Movies">Movies</option>
                <option value="Showtime">Showtimes</option>
                <option value="Theater">Theater</option>
            </select>

            <h1> Configure seating capacity for each theater in a multiplex </h1>
            <Button className="button-style" type="button-primary" onClick={null}> Configure Seating </Button>
            
            <h1 className="title"> Analytics Dashboard</h1>
            <div className="analytics-row">
                <div className="info-container">
                    <h1> Viewing Theater Occupancy for the last: {            
                        <select className="drop-down" value={viewOption} onChange={updateViewOption}>
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90">90 days</option>
                        </select>
                        }
                    </h1>
    
                    <div className="list-box">
                        <p1> * DISPLAY THEATER OCCUPANCY HERE *</p1>

                    </div>
                </div>
            </div>
            <h1> Configure discount prices for shows before 6pm and for Tuesday shows </h1>  
            <Button className="button-style" type="button-primary" onClick={null}> Configure Discount Prices </Button>
        </section>

    )
}
export default Admin;