import Button from "../../Components/Button/Button";
import "./Dashboard.scss";
import Oppenheimer from '../../assets/oppenheimer.png';
import Spiderman from '../../assets/spiderman.png';
import Elemental from '../../assets/elemental.png';
import { host } from '../../env';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = () =>{
    fetch(`${host}/api/all_locations`)
    .then((resp) => resp.json())
    .then((data) => {
      console.warn('111', data);
    })
  };

  useEffect(() => {
    getData();
  }, [])

  const movies = [
    {
      title: 'Oppenheimer',
      image: Oppenheimer,
    },
    {
      title: 'Spiderman',
      image: Spiderman,
    },
    {
      title: 'Elemental',
      image: Elemental,
    }
  ]

  const handleBook = () => {
    navigate("/checkout");
  }
  
  return (
    <div className="dashboard-container">
      <div className="showing-container">
        <h1 className="header-text">
          Currently Playing
        </h1>
        <div className="showing-grid">
          {movies.map(movie => (
            <div className="movie">
              <img className="movie-image" src={movie.image} alt=''/>
              <h3 className="movie-title">
                {movie.title}
              </h3>
              <Button className="movie-book" onClick={handleBook} type={'button-primary'}>Book</Button>
            </div>
          ))}
        </div>
      </div>
      <div className="showing-container">
        <h1 className="header-text">
          Upcoming Movies
        </h1>
        <div className="showing-grid">
          {movies.map(movie => (
            <div className="movie">
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
};

export default Dashboard;