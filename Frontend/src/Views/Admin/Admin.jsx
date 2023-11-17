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
    const [showtimeID, setShowtimeID] = useState('');

    // theater inputs
    const [theaterName, setTheaterName] = useState('');
    const [theaterLocationID, setTheaterLocationID] = useState('');
    const [seatCapacity, setSeatCapacity] = useState('');

    // Analytics inputs
    const [analyticTheaterID, setAnalyticTheaterID] = useState('');

    function defaultFields() {
        setMovieName('');
        setNewMovieName('');
        setTheaterID('');
        setMovieID('');
        setShowDate('');
        setShowtimeID('');
        setTheaterName('');
        setTheaterLocationID('');
        setSeatCapacity('');
    }

    //theater CRUD inputs
    function updateScheduleOption(e) {
        setScheduleOption(e.target.value);
    }

    function updateViewOption(e) {
        setViewOption(e.target.value);
        //getTheaterOccupancy()
    }


    const handleOptionChange = (e) => {
        updateScheduleOption(e);
        setErrorMessage("");
        setConfirmMessage("");
        defaultFields();
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
                        <br></br>
                        <input
                            type="text"
                            required placeholder="Movie ID (remove)"
                            value={movieID}
                            onChange={(e) => setMovieID(e.target.value)}
                        />
                    </div>
        }
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
                            required placeholder="Show Date (ex: 16 November 2023 14:48 UTC)"
                            value={showDate}
                            onChange={(e) => setShowDate(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="Showtime ID (remove)"
                            value={showtimeID}
                            onChange={(e) => setShowtimeID(e.target.value)}
                        />
                    </div>
        }
        else if(scheduleOption === "Theater") {
            return <div className="input-container">
                        <input
                            type="text"
                            required placeholder="theater name"
                            value={theaterName}
                            onChange={(e) => setTheaterName(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="theater location ID"
                            value={theaterLocationID}
                            onChange={(e) => setTheaterLocationID(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="seat capacity"
                            value={seatCapacity}
                            onChange={(e) => setSeatCapacity(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="Theater ID (remove)"
                            value={theaterID}
                            onChange={(e) => setTheaterID(e.target.value)}
                        />
                    </div>
        }
    }

    /* MOVIE API CALLS */
    // ADD MOVIE
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
            setErrorMessage("Error: Input syntax");
          });

        defaultFields();
    }

    // REMOVE MOVIE
    const removeMovie = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(movieID === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty movie name");
            return;
        }

        console.log(`${host}/api/theater_employee/delete_movie/${movieID}`);
        fetch(`${host}/api/theater_employee/delete_movie/${movieID}`, {
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
            setErrorMessage("Error: Input syntax");
        });

        defaultFields();
    }

    /* SHOWTIME API CALLS */
    // ADD SHOWTIME
    const insertShowtime = () => {
        setErrorMessage("");
        setConfirmMessage("");
        if(showDate === '') {
            setErrorMessage("Error: an input field is empty");
            return;
        }
        const event = new Date(showDate);

        console.log(event);
        const data = {
            theater_id: theaterID,
            movie_id: movieID,
            show_date: event.toISOString()
        }
        
        if(theaterID === "" || movieID === "") {
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
            setErrorMessage("Error: Input syntax");
          });

          defaultFields();
    }

    // REMOVE SHOWTIME
    const removeShowtime = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(showtimeID === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty movie name");
            return;
        }

        fetch(`${host}/api/theater_employee/delete_showtime/${showtimeID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setConfirmMessage("Showtime removed successfully");
        })
        .catch((error) => {
            setErrorMessage("Error: Input syntax");
        });

        defaultFields();
    }

    /* THEATER API CALLS */
    // ADD THEATER #Expects in body: "name" (str), "location_id" (str), "seating capacity" (int)
    const insertTheater = () => {
        setErrorMessage("");
        setConfirmMessage("");

        if(isNaN(parseInt(seatCapacity))) {
            setErrorMessage("Error: invalid input for seat capacity");
            return;
        }

        const data = {
            name: theaterName,
            location_id: theaterLocationID,
            seating_capacity: seatCapacity
        }
        
        if(theaterName === "" || theaterLocationID === "" || seatCapacity === null) {
            setErrorMessage("Error: an input field is empty");
            return;
        }
        console.log(data);
        fetch(`${host}/api/theater_employee/insert_theater`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
          body: JSON.stringify(data)
        })
          .then((resp) => resp.json())
          .then((data) => {
            setConfirmMessage("Theater added successfully");
          })
          .catch((error) => {
            setErrorMessage("Error: Input syntax");
          });

          defaultFields();
    }

    // REMOVE THEATER /api/theater_employee/delete_theater/<theater_id>'
    const removeTheater = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(theaterID === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty theater ID");
            return;
        }

        fetch(`${host}/api/theater_employee/delete_theater/${theaterID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setConfirmMessage("Theater removed successfully");
        })
        .catch((error) => {
            setErrorMessage("Error: Input syntax");
        });

        defaultFields();
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

    // View theater occupancy for the last 30/60/90 days
    const getTheaterOccupancy = () => {
        fetch(`${host}/api/theater/${analyticTheaterID}/occupancy`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('x-access-token'),
            },
            body: viewOption
          })
          .then((resp) => resp.json())
          .then((data) => {
              console.log("success", data);
          })
          .catch((error) => {
                console.log("Error: input syntax");
          });
  
          defaultFields();
    }

    function displayTheaterOccupancy() {
        if(analyticTheaterID === '') {
            return <div className="error-message">
                Error: theater ID is empty
            </div>
        }
        else {
            return <div>
                test
            </div>;
        }

        defaultFields();
    }

    function handleAnalyticsUpdate() {
        getTheaterOccupancy();
        displayTheaterOccupancy();
    }
    return (
        <section className="admin-page">
            <h1 className="title">Admin Page</h1>
            <h1> Add/update/remove movies/showtimes/theater assignment in the schedule </h1>
            <Button className="button-style" type="button-primary" onClick={scheduleOption === "Movies" ? insertMovie : 
                                                                            scheduleOption === "Showtime" ? insertShowtime :
                                                                            scheduleOption === "Theater" ? insertTheater : null}> Add </Button>
            <Button className="button-style" type="button-primary" onClick={null}> Update </Button>
            <Button className="button-style" type="button-primary" onClick={scheduleOption === "Movies" ? removeMovie :
                                                                            scheduleOption === "Showtime" ? removeShowtime : 
                                                                            scheduleOption === "Theater" ? removeTheater : null}> Remove </Button>
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
                    <div className="input-container">
                        <input
                            type="text"
                            required placeholder="Theater ID"
                            value={analyticTheaterID}
                            onChange={(e) => setAnalyticTheaterID(e.target.value)}
                        />
                    </div>
                    <br></br>
                    <Button className="button-style" type="button-primary" onClick={handleAnalyticsUpdate}> Update Display </Button>
                    <h1> Viewing Theater Occupancy for the last: {            
                        <select className="drop-down" value={viewOption} onChange={updateViewOption}>
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90">90 days</option>
                        </select>
                        }
                    </h1>
    
                    <div className="list-box">
                        <p1> {displayTheaterOccupancy()} </p1>

                    </div>
                </div>
            </div>
            <h1> Configure discount prices for shows before 6pm and for Tuesday shows </h1>  
            <Button className="button-style" type="button-primary" onClick={null}> Configure Discount Prices </Button>
        </section>

    )
}
export default Admin;