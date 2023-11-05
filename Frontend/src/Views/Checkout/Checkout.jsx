import { useNavigate } from 'react-router-dom';

import Button from '../../Components/Button/Button';
import Oppenheimer from '../../assets/oppenheimer.png';

import "./Checkout.scss";

const Checkout = () => {
  const navigate = useNavigate();

  const data = {
    image: Oppenheimer,
    location: {
      id: 1,
      location: "Milpitas",
    },
    theatre:{
      id: 1,
      maxSeatingCapacity: 40,
    },
    showings:[
      {
        id: 1,
        day: 'Monday',
        timings:[
          {
            id: 1,
            show: '9:00 am - 12:00 pm',
          },
          {
            id: 2,
            show: '1:00 pm - 4:00 pm',
          },
          {
            id: 3,
            show: '5:00 am - 8:00 pm',
          }
        ]
      },
      {
        id: 2,
        day: 'Tuesday',
        timings:[
          {
            id: 1,
            show: '9:00 am - 12:00 pm',
          },
          {
            id: 2,
            show: '1:00 pm - 4:00 pm',
          },
          {
            id: 3,
            show: '5:00 am - 8:00 pm',
          }
        ]
      },
      {
        id: 3,
        day: 'Wednesday',
        timings:[
          {
            id: 1,
            show: '9:00 am - 12:00 pm',
          },
          {
            id: 2,
            show: '1:00 pm - 4:00 pm',
          },
          {
            id: 3,
            show: '5:00 am - 8:00 pm',
          }
        ]
      }
    ]

  }

  const handleConfirm = () => {
    navigate('/payment');
  }

  return(
    <div class="checkout-container">
      <div class="movie-container">
        <img className="movie-image" src={data.image} alt=''/>
        <div class="movie">
          <p class="movie-meta">
            Theatre Location: {data.location.location}
          </p>
          <p class="movie-meta">
            Max Seating: {data.theatre.maxSeatingCapacity}
          </p>
          <div class="showing-container">
            {data.showings.map(show => (
              <div class="show">
                <p>
                  {show.day}
                </p>
                {show.timings.map(time => (
                  <>
                  <p>
                  {time.show}
                  </p>
                  <Button type="button-primary" className="book" onClick={handleConfirm}> Book </Button>
                  </>
                ))}
              </div>
            ))}
          </div>
        </div>  
      </div>
    </div>
  )
};

export default Checkout;