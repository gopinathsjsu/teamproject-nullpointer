import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Button from '../../Components/Button/Button';
import { host } from '../../env';

import "./Checkout.scss";
import Loader from '../../Components/Loader/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    selectedLocationInfo, 
    selectedTheaterInfo 
  } = useSelector((state) => state?.dashboard);
  const [showtimes, setShowtimes] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const[ loading, setLoading ] = useState(true);

  const getData = () =>{
    fetch(`${host}/api/movie/${id}/${selectedLocationInfo?.id}`)
    .then((resp) => resp.json())
    .then((data) => {
      setShowtimes(data?.showtimes);
      setMovieInfo({
        id,
        image: data?.image, 
        title:data?.title
      })
      setLoading(false);
    })
  };

  useEffect(() => {
    getData();
  },[])

  const handleConfirm = (show) => {
    navigate('/payment', {state: {
      type:'movie',
      id: show?._id,
      itemName: `Movie - ${movieInfo?.title}`,
      itemCost: show?.price,
    }});
  }

  return(
    <>
      {
        loading? 
        <Loader />
        : (
          <div className="checkout-container">
            <h1 className="header-text">
                Book {movieInfo?.title}
              </h1>
            <div className="movie-container">
              <img className="movie-image" src={movieInfo?.image} alt=''/>
              <div className="movie">
                <p className="movie-meta">
                  Location: {selectedLocationInfo?.name}
                </p>
                <p className="movie-meta">
                  Theater: {selectedTheaterInfo?.name}
                </p>
                <p className="movie-meta">
                  Max Seating: {selectedTheaterInfo?.seating_capacity}
                </p>
                <div className="showing-container">
                  {showtimes?.map((show, index) => (
                    <div className="show" key={index}>
                      <p>
                        {dayjs(show?.show_date).format("ddd, MM-DD-YYYY")}
                      </p>
                      <p>
                      {dayjs(show?.show_date).format('hh:mm a')}
                      </p>
                      <Button type="button-primary" className="book" onClick={() => handleConfirm(show)}> Book </Button>
                    </div>
                  ))}
                </div>
              </div>  
            </div>
          </div>
        )
      }
    </>
  )
};

export default Checkout;