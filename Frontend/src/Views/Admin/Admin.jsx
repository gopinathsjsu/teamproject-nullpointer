import "../Admin/Admin.scss";
import Button from '../../Components/Button/Button';
import React, {useState} from "react";
import { host } from "../../env";

const Admin = () => {
    const [scheduleOption, setScheduleOption] = useState('Movies');
    const [viewOption, setViewOption] = useState('30 days');

    //error and confirm messages for CRUD
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    // Movie Inputs
    const [movieName, setMovieName] = useState('');
    const [newMovieName, setNewMovieName] = useState('');

    // showtime inputs
    const [theaterID, setTheaterID] = useState('');
    const [movieID, setMovieID] = useState('');
    const [showDate, setShowDate] = useState('');

    //theater CRUD inputs

    function updateScheduleOption(e) {
        setScheduleOption(e.target.value);
    }

    function updateViewOption(e) {
        setViewOption(e.target.value);
    }


    const handleOptionChange = (e) => {
        updateScheduleOption(e);
        setErrorMessage("");
        setConfirmMessage("");
    };

    // display the input fields for CRUD (add/update/remove movies/showtimes/theaters)
    function displayFields() {
        if(scheduleOption === "Movies") {
            return <div className="input-container">
                        <input
                            type="text"
                            required placeholder="movie name"
                            value={movieName}
                            onChange={(e) => setMovieName(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="new movie name (update)"
                            value={newMovieName}
                            onChange={(e) => setNewMovieName(e.target.value)}
                        />
                    </div>
        }
        //#Expects in body: "theater_id" (str), "movie_id" (str), "show_date" (str) (ISO 8601 datetime format)
        else if(scheduleOption === "Showtime") {
            return <div className="input-container">
                        <input
                            type="text"
                            required placeholder="Theater ID"
                            value={theaterID}
                            onChange={(e) => setTheaterID(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="Movie ID"
                            value={movieID}
                            onChange={(e) => setMovieID(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="Show Date (ISO 8601 datetime format)"
                            value={showDate}
                            onChange={(e) => setShowDate(e.target.value)}
                        />
                    </div>
        }
        else if(scheduleOption === "Theater") {
            return <h1> THEATER </h1>
        }
    }

    /* MOVIE API CALLS */
    // ADD API call (just call API and override)
    const insertMovie = () => {
        setErrorMessage("");
        setConfirmMessage("");
        const data = {
            movie_name: movieName,
            image: "null",
        }
        
        if(movieName === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty movie name");
            return;
        }

        fetch(`${host}/api/theater_employee/insert_movie`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
          body: JSON.stringify(data)
        })
          .then((resp) => resp.json())
          .then((data) => {
            //console.log("movie added successfully");
            setConfirmMessage("Movie added successfully");
          })
          .catch((error) => {
            //console.log("Error: ", error);
            setErrorMessage(error.toString());
          });

        setMovieName("");
        setNewMovieName("");
    }

    // REMOVE API call (just call API and override)
    const removeMovie = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(movieName === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty movie name");
            return;
        }

        console.log(`${host}/api/theater_employee/delete_movie/${movieName}`);
        fetch(`${host}/api/theater_employee/delete_movie/${movieName}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
        })
        .then((resp) => resp.json())
        .then((data) => {
        setConfirmMessage("Movie removed successfully");
        })
        .catch((error) => {
        //console.log("Error: ", error);
        setErrorMessage(error.toString());
        });

        setMovieName("");
        setNewMovieName("");
    }

    /* SHOWTIME API CALLS */
    const insertShowtime = () => {
        setErrorMessage("");
        setConfirmMessage("");
        const event = new Date(showDate);

        const data = {
            theater_id: theaterID,
            movie_id: movieID,
            show_date: event.toISOString()
        }
        
        if(theaterID === "" || movieID === "" || showDate === "") {
            setErrorMessage("Error: an input field is empty");
            return;
        }
        console.log(data);
        fetch(`${host}/api/theater_employee/insert_showtime`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
          body: JSON.stringify(data)
        })
          .then((resp) => resp.json())
          .then((data) => {
            //console.log("movie added successfully");
            setConfirmMessage("Showtime added successfully");
          })
          .catch((error) => {
            //console.log("Error: ", error);
            setErrorMessage(error.toString());
          });

        setMovieName("");
        setNewMovieName("");
    }

    function displayMessage() {
        if(errorMessage !== "") {
            return <div className="error-message">
                {errorMessage}
            </div>
        }
        else if(confirmMessage !== "") {
            return <div className="confirm-message">
                {confirmMessage}
            </div>
        }
    }

    return (
        <section className="admin-page">
            <h1 className="title">Admin Page</h1>
            <h1> Add/update/remove movies/showtimes/theater assignment in the schedule </h1>
            <Button className="button-style" type="button-primary" onClick={scheduleOption === "Movies" ? insertMovie : 
                                                                            scheduleOption === "Showtime" ? insertShowtime : null}> Add </Button>
            <Button className="button-style" type="button-primary" onClick={null}> Update </Button>
            <Button className="button-style" type="button-primary" onClick={removeMovie}> Remove </Button>
            <select className="drop-down" value={scheduleOption} onChange={handleOptionChange}>
                <option value="Movies">Movies</option>
                <option value="Showtime">Showtimes</option>
                <option value="Theater">Theater</option>
            </select>
            {displayFields()}
            <p1> {displayMessage()} </p1>
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