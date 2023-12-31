import "./AccountInfo.scss";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { host } from "../../env";
import { useSelector } from 'react-redux';
import Button from '../../Components/Button/Button';


const AccountInfo = () => {
    const userInfo = useSelector(state => state.user);

    // container for movies watched in the past 30 days
    const [movies, setMovies] = useState([]);
    //container for past movies
    const [pastMovies, setPastMovies] = useState([]);
    //container for upcoming movies
    const [upcomingMovies, setUpcomingMovies] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    //const [error, setError] = useState("");
    
    const getData = (apiPath, container) => {
        const fetchData = async () => {
            fetch(`${host}/api/${apiPath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('x-access-token')
                },
            })
            .then((resp) => resp.json())
            .then((data) => {
                if(data.message) {
                    container([]);
                    return;
                }

                var formattedMovies = [];
                if(apiPath === "recent_movies") {
                    formattedMovies = data.map(entry => ({
                        movieName: entry.movie.title,
                        showDate: entry.show_date,
                        theaterID: entry.theater_id,
                    }));
                }
                else if(apiPath === "future_user_tickets") {
                    formattedMovies = data.map(entry => ({
                        movieName: entry.showtime.movie.title,
                        showDate: entry.showtime.show_date,
                        theaterID: entry.showtime.theater_id,
                        ticketID: entry._id
                    }));
                }
                else if(apiPath === "prev_user_tickets") {
                    formattedMovies = data.map(entry => ({
                        movieName: entry.showtime.movie.title,
                        showDate: entry.showtime.show_date,
                        theaterID: entry.showtime.theater_id,
                    }));
                }
                container(formattedMovies);
            }, []
        ).catch((error) => {
            container([]);
            //console.log(error);
            //setError(JSON.stringify(error));
        });}

        fetchData();
        setIsLoading(false);
    };

    function refund(ticketID) {
        fetch(`${host}/api/user_ticket/${ticketID}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'x-access-token': localStorage.getItem('x-access-token'),
            },
          })
          .then((resp) => {
            if(resp.status !== 404) {
                console.log("Movie removed successfully");
                getData("future_user_tickets", setUpcomingMovies);
            }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
        
        console.log("REFUND: ", ticketID);
    }

    useEffect(() => {
        getData("recent_movies", setMovies);
        getData("prev_user_tickets", setPastMovies);
        getData("future_user_tickets", setUpcomingMovies);
        //getRecentMovies();
    }, []);

    function displayMovies(container) {
        if(isLoading) {
            return <div> Loading...</div>;
        }
        // else if(error) {
        //     return <div> {error} </div>
        // }
        else {
            return <div>
                    <h1>Tickets List</h1>
                    {container.map((movie, index) => (
                        <div key={index}>
                            <p>{container === upcomingMovies ? 
                                    <Button className="button-style" type="button-primary" onClick={() => refund(movie.ticketID)}> Refund </Button>
                                : ""}
                                Movie {index + 1} 
                            </p>
                            <p>Movie Name: {movie.movieName}</p>
                            <p>Show Date: {movie.showDate}</p>
                            <p>Theater ID: {movie.theaterID}</p>
                            <hr/>
                        </div>
                    ))}
                </div>
        }
    }

    return (
        <div className="page-layout">
            <h1 className="title">Account Information</h1>
            <p1> Username: {userInfo.username}</p1>
            <br></br>
            <p1> Membership: {userInfo.isMember ? "True" : "False"}</p1>
            <br></br>
            <p1> Rewards Points: {userInfo.points}</p1>
            <br></br>

            <div className="movie-row">
                <div className="info-container">
                    <h1 className="title">Previous Movie Tickets</h1>
                    <div className="list-box">
                        {displayMovies(pastMovies)}
                    </div>
                </div>
                <div className="info-container">
                    <h1 className="title">Upcoming Movie Tickets</h1>
                    <div className="list-box">
                        {displayMovies(upcomingMovies)}
                    </div>
                </div>
                <div className="info-container">
                    <h1 className="title">Movies Watched (past 30 Days)</h1>
                    <div className="list-box">
                        {displayMovies(movies)}
                    </div>
                </div>
            </div>
        </div>
    )
  };
  
  export default AccountInfo;