import "./AccountInfo.scss";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { host } from "../../env";
import { useSelector } from 'react-redux';


const AccountInfo = () => {
    const userInfo = useSelector(state => state.user);
    const [accountInfo, setAccountInfo] = useState('');

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
      
    const getRecentMovies = () => {
        const fetchData = async () => {
            fetch(`${host}/api/recent_movies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('x-access-token')
                },
            })
            .then((resp) => resp.json())
            .then((data) => {        
                const formattedMovies = data.map((entry) => ({
                    movieName: entry.movie.movie_name,
                    user: entry.movie.user,
                    createdDate: entry.movie.created,
                    showDate: entry.show_date,
                    theaterID: entry.theater_id,
                }));
                setMovies(formattedMovies);
            }, []
        ).catch((error) => {
            console.log(error);
            //setError(JSON.stringify(error));
            setError("No tickets found");
        });}

        fetchData();
        setIsLoading(false);
    };

    useEffect(() => {
        getRecentMovies();
    }, []);

    function displayMovies() {
        if(isLoading) {
            return <div> Loading...</div>;
        }
        else if(error) {
            return <div> {error} </div>
        }
        else {
            return <div>
                    <h1>Movie List</h1>
                    {movies.map((movie, index) => (
                        <div key={index}>
                            <p>Movie {index + 1}</p>
                            <p>Movie Name: {movie.movieName}</p>
                            <p>Show Date: {movie.showDate}</p>
                            <p>Theater ID: {movie.theaterID}</p>
                            <hr/>
                        </div>
                    ))}
                </div>
        }
    }

    /* required: back end API
        API 1: get_user_info (retrieve username/membership/points value)
        API 2: get_previous_tickets (retrieve list of previous movie tickets)
        API 3: get_upcoming_tickets (retrieve list of upcoming movie tickets)
        API 4: get_movies_watched (retrieve list of movies watched in past 30 days)
    */
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
                        {displayMovies()}
                    </div>
                </div>
            </div>
        </div>
    )
  };
  
  export default AccountInfo;