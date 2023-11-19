import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { host } from '../../env';

import "../Checkout/Checkout.scss";

const Ticket = () => {
  const { ticketId, showtimeId } = useParams();
  const [info, setInfo] = useState({});

  const getData = () =>{
    fetch(`${host}/api/ticket/${ticketId}/${showtimeId}`)
    .then((resp) => resp.json())
    .then((data) => {
      setInfo(data);
    })
  };

  useEffect(() => {
    getData();
  },[])


  return(
    <div className="checkout-container">
       <h1 className="header-text">
          Booking successful for {info?.movie?.title}
        </h1>
      <div className="movie-container">
        <img className="movie-image" src={info?.movie?.image} alt=''/>
        <div className="movie">
          <p className="movie-meta">
            Location: {info?.location?.name}
          </p>
          <p className="movie-meta">
            Theater: {info?.theater?.name}
          </p>
          <p className="movie-meta">
            Show date: {dayjs(info?.show_date).format("ddd MM/DD/YYYY hh:mm a")}
          </p>
          <p className="movie-meta">
            Ticket count: {info?.ticket?.ticket_count}
          </p>
        </div>  
      </div>
    </div>
  )
};

export default Ticket;