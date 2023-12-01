import "../Admin/Admin.scss";
import Button from '../../Components/Button/Button';
import React, {useEffect, useState} from "react";
import { host } from "../../env";
import dayjs from "dayjs";

const Admin = () => {
    const [scheduleOption, setScheduleOption] = useState('Movies');
    const [viewOption, setViewOption] = useState('30 days');

    //error and confirm messages for CRUD
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    // Movie Inputs
    const [movieName, setMovieName] = useState('');
    const [newMovieName, setNewMovieName] = useState('');
    const [imageURL, setImageURL] = useState('');

    // showtime inputs
    const [theaterID, setTheaterID] = useState('');
    const [movieID, setMovieID] = useState('');
    const [showDate, setShowDate] = useState('');
    const [showtimeID, setShowtimeID] = useState('');

    // theater inputs
    const [theaterName, setTheaterName] = useState('');
    const [theaterLocationID, setTheaterLocationID] = useState('');
    const [seatCapacity, setSeatCapacity] = useState('');

    // Seating Capacity inputs
    const [seatingTheaterID, setSeatingTheaterID] = useState('');
    const [newSeatingCapacity, setNewSeatingCapacity] = useState('');
    const [seatingErrorMessage, setSeatingErrorMessage] = useState('');
    const [seatingConfirmMessage, setSeatingConfirmMessage] = useState('');

    // Analytics inputs
    const [analyticTheaterID, setAnalyticTheaterID] = useState('');

    const [occupancyData, setOccupancyData] = useState('30');
    const [summarizeOption, setSummarizeOption] = useState('Location');

    //Discounted Showtimes
    const [discountShowtimes, setDiscountShowtimes] = useState([]);
    const [selectedShowID, setSelectedShowID] = useState('');
    const [discountPerc, setDiscountPerc] = useState();
    const [discountSuccess, setDiscountSuccess] = useState('');
    const [discountError, setDiscountError] = useState('');

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
        setImageURL('');
    }

    //theater CRUD inputs
    function updateScheduleOption(e) {
        setScheduleOption(e.target.value);
    }

    function updateViewOption(e) {
        setViewOption(e.target.value);
        //getTheaterOccupancy()
    }

    function updateSummarizeOption(e) {
        setSummarizeOption(e.target.value);
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
                            required placeholder="Movie Image URL (add, update)"
                            value={imageURL}
                            onChange={(e) => setImageURL(e.target.value)}
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
                            required placeholder="Movie ID (remove, update)"
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
                            required placeholder="Showtime ID (remove, update)"
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
                            required placeholder="Theater ID (remove, update)"
                            value={theaterID}
                            onChange={(e) => setTheaterID(e.target.value)}
                        />
                    </div>
        }
    }

    /*  ******* SCHEDULE API CALLS ******** */
    // ADD MOVIE
    const insertMovie = () => {
        setErrorMessage("");
        setConfirmMessage("");
        const data = {
            movie_name: movieName,
            image: imageURL,
        }
        
        if(movieName === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty movie name");
            return;
        }

        if(imageURL === "") {
            setErrorMessage("Error: no image URL");
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

    // UPDATE MOVIE
    const updateMovie = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(movieID === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty movie ID");
            return;
        }
        
        if(imageURL === "" && newMovieName === "") {
            setErrorMessage("Error: Add an image url or new movie name to update")
            return;
        }

        var data = {};
        if (imageURL !== "" && newMovieName !== "") {
            data = {
                title: newMovieName,
                image: imageURL,
            };
        } 
        else if (imageURL !== "") {
            data = {
                image: imageURL,
            };
        } 
        else if (newMovieName !== "") {
            data = {
                title: newMovieName,
            };
        }

        fetch(`${host}/api/theater_employee/update_movie/${movieID}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
          body: JSON.stringify(data)
        })
          .then((resp) => {
            setConfirmMessage("Movie updated successfully");
            resp.json()
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

    // UPDATE SHOWTIME
    const updateShowtime = () => {
        setErrorMessage("");
        setConfirmMessage("");
        if(showDate === '') {
            setErrorMessage("Error: show date is empty");
            return;
        }

        if(showtimeID === '') {
            setErrorMessage("Error: showtime ID is empty");
            return;
        }
        const formattedDate = new Date(showDate);
        
        const data = {
            show_date: formattedDate
        }
        
        fetch(`${host}/api/theater_employee/update_showtime/${showtimeID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('x-access-token'),
            },
            body: JSON.stringify(data)
          })
          .then((resp) => {
            setConfirmMessage("Showtime updated successfully");
            resp.json()
          })
          .catch((error) => {
              setSeatingErrorMessage("Error: invalid syntax");
          });
    }

    const updateDiscount = () => {
        setDiscountError("");
        setDiscountSuccess("");
        if(selectedShowID === ''){
            setErrorMessage("Error: empty movie name");
            return;
        }
        fetch(`${host}/api/theater_employee/update_discount/${selectedShowID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('x-access-token'),
            },
            body: JSON.stringify({"showtime_id": selectedShowID, "percentage": Number(discountPerc)})
          })
          .then((resp) => {
            setDiscountSuccess("Discount updated successfully");
            resp.json().then(() => {
                getDiscountApplicableShowtimes();
            })
          })
          .catch((error) => {
                setDiscountError("Error: invalid syntax");
          });
    }

    // REMOVE SHOWTIME
    const removeShowtime = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(showtimeID === "") {
            //console.log("Error: empty movie name");
            setErrorMessage("Error: empty showtime id");
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

    function displayMessage(displayError, displayConfirm) {
        if(displayError !== "") {
            return <div className="error-message">
                {displayError}
            </div>
        }
        else if(displayConfirm !== "") {
            return <div className="confirm-message">
                {displayConfirm}
            </div>
        }
    }

    /* THEATER API CALLS */
    // ADD THEATER
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

    // REMOVE THEATER
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

    // UPDATE THEATER /api/theater_employee/update_theater/<theater_id>
    //Expects in body: "name" (str) (opt) or "seating_capacity" (int) (opt)
    const updateTheater = () => {
        setErrorMessage("");
        setConfirmMessage("");
        
        if(theaterName === '' && seatCapacity === '') {
            setErrorMessage("Error: requires theater name or seat capacity input");
            return;
        }

        if(theaterID === '') {
            setErrorMessage("Error: theater ID is empty");
            return;
        }

        const data = {
            name: theaterName,
            seating_capacity: seatCapacity
        }
         
        fetch(`${host}/api/theater_employee/update_theater/${theaterID}`, {
            method: "PATCH",
            headers: { 
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('x-access-token'),
            },
            body: JSON.stringify(data)
          })
            .then((resp) => {
              setConfirmMessage("Theater updated successfully");
              resp.json()
            })
            .catch((error) => {
              //console.log("Error: ", error);
              setErrorMessage("Error: Input syntax");
            });
  
          defaultFields();
    }

    /* ******** SEATING CAPACITY API CALLS ******** */
    const updateSeatingCapacity = () => {
        setSeatingErrorMessage('');
        setSeatingConfirmMessage('');

        if(isNaN(parseInt(newSeatingCapacity))) {
            setSeatingErrorMessage("Error: invalid input for seat capacity");
            return;
        }

        fetch(`${host}/api/theater_employee/update_theater_seatings/${seatingTheaterID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'x-access-token': localStorage.getItem('x-access-token'),
          },
          body: JSON.stringify({ seating_capacity: parseInt(newSeatingCapacity)})
        })
        .then((resp) => resp.json())
        .then((data) => {
            setSeatingConfirmMessage("Theater seatings have been updated");
            console.log("Seating updated");
        })
        .catch((error) => {
            setSeatingErrorMessage("Error: invalid syntax");
        });
    }

    /* ******** ANALYTICS API CALLS ********* */
    // View theater occupancy for the last 30/60/90 days
    const getTheaterOccupancy = () => {
        fetch(summarizeOption === 'Location' ? `${host}/api/all_location_occupancy` : 
              summarizeOption === 'Movie' ? `${host}/api/all_movie_occupancy` : null, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('x-access-token'),
            },
          })
          .then((resp) => resp.json())
          .then((data) => {
              console.log("success", data);
              setOccupancyData(data);
          })
          .catch((error) => {
                console.log(error);
                //console.log("Error: input syntax");
          });  
    }

    function displayTheaterOccupancy() {
        if (!occupancyData || !Array.isArray(occupancyData)) {
            return <p>No occupancy data available.</p>;
        }

        //console.log("DATA:" + JSON.stringify(occupancyData) + " type: " + summarizeOption);
        //console.log(occupancyData.name);
        const isLocation = occupancyData.some(data => data.hasOwnProperty('name'));
        const isMovie = occupancyData.some(data => data.hasOwnProperty('image'));
        if(isLocation) {
            return (
                <div>
                    {occupancyData.map((data) => (
                        <div key={data._id}>
                            <p>Location: {data.name}</p>
                            <p>Total Potential: {data.occupancy.total_potential}</p>
                            <p>Total Used: {data.occupancy.total_used}</p>
                            <hr/>
                        </div>
                    ))}
                </div>
            );
        }
        else if(isMovie) {
            return (
                <div>
                    {occupancyData.map((data) => (
                        <div key={data._id}>
                            <img src={data.image} alt={data.title} style={{ maxWidth: '100px' }} />
                            <p>Title: {data.title}</p>
                            <p>Total Potential: {data.occupancy.total_potential}</p>
                            <p>Total Used: {data.occupancy.total_used}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            );
        }
    }

    const getDiscountApplicableShowtimes = () => {
        fetch(`${host}/api/theater_employee/get_showtimes_custom`,
        {
            headers: {
                "Content-Type": "application/json",
                'x-access-token': localStorage.getItem('x-access-token'),
            },
        })
        .then(resp => resp.json())
        .then(data => {
            console.warn('111', data);
            setDiscountShowtimes(data);
        })
    }
    useEffect(() => {
        getDiscountApplicableShowtimes();
    }, [])

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
            <Button className="button-style" type="button-primary" onClick={scheduleOption === "Movies" ? updateMovie : 
                                                                            scheduleOption === "Showtime" ? updateShowtime :
                                                                            scheduleOption === "Theater" ? updateTheater : null}> Update </Button>
            <Button className="button-style" type="button-primary" onClick={scheduleOption === "Movies" ? removeMovie :
                                                                            scheduleOption === "Showtime" ? removeShowtime : 
                                                                            scheduleOption === "Theater" ? removeTheater : null}> Remove </Button>
            <select className="drop-down" value={scheduleOption} onChange={handleOptionChange}>
                <option value="Movies">Movies</option>
                <option value="Showtime">Showtimes</option>
                <option value="Theater">Theater</option>
            </select>
            {displayFields()}
            <p1> {displayMessage(errorMessage, confirmMessage)} </p1>
            <h1> Configure seating capacity for each theater in a multiplex </h1>
            <div className="input-container">
                        <input
                            type="text"
                            required placeholder="Theater ID"
                            value={seatingTheaterID}
                            onChange={(e) => setSeatingTheaterID(e.target.value)}
                        />
                        <br></br>
                        <input
                            type="text"
                            required placeholder="Seating Capacity"
                            value={newSeatingCapacity}
                            onChange={(e) => setNewSeatingCapacity(e.target.value)}
                        />
            </div>
            <p1> {displayMessage(seatingErrorMessage, seatingConfirmMessage)} </p1>
            <br></br>
            <Button className="button-style" type="button-primary" onClick={updateSeatingCapacity}> Configure Seating </Button>

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
                        <br></br>summarized by: <select className="drop-down" value={summarizeOption} onChange ={updateSummarizeOption}>
                            <option value="Location"> Location </option>
                            <option value="Movie"> Movie </option>
                        </select>
                    </h1>
                    <Button className="button-style" type="button-primary" onClick={handleAnalyticsUpdate}> Update Display </Button>

                    <div className="list-box">
                        <p1> {displayTheaterOccupancy()} </p1>
                    </div>
                </div>
            </div>
            <div className="info-container">
                <h1> Configure discount prices for shows before 6pm and for Tuesday shows </h1> 
                <input
                    type="text"
                    required placeholder="Show ID"
                    value={selectedShowID}
                    onChange={(e) => setSelectedShowID(e.target.value)}
                />
                <input
                    type="number"
                    required placeholder="Discount %"
                    value={discountPerc}
                    onChange={(e) => setDiscountPerc(e.target.value)}
                />
                <Button className="button-style" type="button-primary" onClick={updateDiscount}> Configure Discount Prices </Button>
                <p1> {displayMessage(discountError, discountSuccess)} </p1>
                <div className="list-box" style={{ maxWidth: "100px", maxHeight: "100px"}}>
                    {
                        discountShowtimes?.map(show => (
                            <div className="show-container">
                                <p>ShowID: {show?._id}</p>
                                <p>ShowDate: {dayjs(show?.show_date).format('ddd MM/DD/YYYY hh:mm a')}</p>
                                <p>Price: {show?.price}</p>
                                <p>Discount %: {show?.discount_percentage}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>

    )
}
export default Admin;