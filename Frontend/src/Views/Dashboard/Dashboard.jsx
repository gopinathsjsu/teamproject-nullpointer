import Button from "../../Components/Button/Button";
import Loader from "../../Components/Loader/Loader";
import "./Dashboard.scss";
import { host } from '../../env';
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedTheaterInfo } = useSelector((state) => state?.dashboard);
  const [currentlyShowing, setCurrentlyShowing] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCurrentMovies = () =>{
    fetch(`${host}/api/theater/${selectedTheaterInfo?.id}/movies`)
    .then((resp) => resp.json())
    .then((data) => {
      setLoading(false);
      setCurrentlyShowing([...data]);
    })
  }

  const getUpcomingMovies = () => {
    fetch(`${host}/api/upcoming_movies`)
    .then((resp) => resp.json())
    .then((data) => {
      setUpcomingMovies([...data]);
    })
  }

  useEffect(() => {
    getUpcomingMovies();
  }, []);

  useEffect(() => {
    if(selectedTheaterInfo?.id)
      getCurrentMovies();
  }, [selectedTheaterInfo])
    

  const handleBook = (movie) => {
    navigate("/checkout/"+movie?._id);
  }
  
  return (
    <>
    {
      loading ? <Loader /> : 
      (
        <div className="dashboard-container">
          <div className="showing-container">
            <h1 className="header-text">
              Currently Playing
            </h1>
            <div className="showing-grid">
              {currentlyShowing?.map((movie, index) => (
                <div className="movie" key={index}>
                  <img className="movie-image" src={movie.image} alt=''/>
                  <h3 className="movie-title">
                    {movie.title}
                  </h3>
                  <Button className="movie-book" onClick={() => handleBook(movie)} type={'button-primary'}>Book</Button>
                </div>
              ))}
            </div>
          </div>
          <div className="showing-container">
            <h1 className="header-text">
              Upcoming Movies
            </h1>
            <div className="showing-grid">
              {upcomingMovies?.map((movie, index) => (
                <div className="movie" key={index}>
                  <img className="movie-image" src={movie.image} alt=''/>
                  <h3 className="movie-title">
                    {movie.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    </>
  )
};

export default Dashboard;