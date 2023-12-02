import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';

import './Payment.scss';
import { useEffect, useState } from 'react';
import { host } from '../../env';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Redux/userReducer';
import Loader from '../../Components/Loader/Loader';

const Payment = () =>{
  const location = useLocation();
  const navigate = useNavigate();
  const [numTickets, setNumtickets] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [ticketPrice, setTicketPrice] = useState();
  const [total, setTotal] = useState();

  const [cardNumber, setCardNumber] = useState();
  const [cardName, setCardName] = useState('');
  const [cardSecurity, setCardSecurity] = useState();
  const [cardExpiry, setExpiry] = useState('');
  const { state: paymentItem } = location;

  useEffect(() => {
    let convenienceFee;
    if(user?.id){
      convenienceFee = (user?.isMember || paymentItem?.type !== 'movie') ? 0 : 1.5;
    } else{
      convenienceFee = 1.5;
    }
    setTicketPrice(paymentItem?.itemCost * numTickets + convenienceFee);
  },[numTickets, user]);

  useEffect(() => {
    if(user?.id){
      if(ticketPrice < user?.points){
        setRedeemPoints(ticketPrice);
      } else
        setRedeemPoints(user?.points);
    }
  },[user, ticketPrice]);

  useEffect(() => {
    setTotal(ticketPrice - redeemPoints);
  },[ticketPrice, redeemPoints]);

  const handleInputChange = (e) => {
    switch(e?.target?.name){
      case 'tickets':
        setNumtickets(Number(e?.target?.value));
        break;
      case 'number':
        setCardNumber(e?.target?.value);
        break;
      case 'name':
        setCardName(e?.target?.value);
        break;
      case 'security':
        setCardSecurity(e?.target?.value);
        break;
      case 'expiry':
        setExpiry(e?.target?.value);
        break;
      default: break;
    }
  }

  const buyTicket = () => {
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
    };
    if(localStorage.getItem('x-access-token')){
      headers['x-access-token'] = localStorage.getItem('x-access-token')
    }
    fetch(`${host}/api/buy_ticket`, {
      method: 'POST',
      headers: headers,
      body:JSON.stringify({
        user_id: user?.id,
        ticket_count: Number(numTickets),
        showtime_id: paymentItem?.id,
        use_reward: redeemPoints > 0 ? true : false, 
        points_used: redeemPoints,
      })
    }).then(async (response) => {
      if(response.ok)
        return response.json();
      let error = await response.json();
      throw new Error(error?.message);
    })
    .then(_ => {
      setSuccess("Ticket booked successfully, navigating to ticket");
      setTimeout(() => {navigate(`/ticket/${_?._id}/${_?.showtime_id}`,{replace:true})}, 2000);
    }).catch(error => {
      setError(error?.message);
      setLoading(false);
    })
  }

  const buyMembership = () =>{
    setLoading(true);
    fetch(`${host}/api/buy_vip`, {
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('x-access-token')
      },
      body:JSON.stringify({
        user_id: user?.id,
      })
    }).then(async (response) => {
      if(response.ok)
        return response.json();
      let error = await response.json();
      throw new Error(error?.message);
    })
    .then(_ => {
      setSuccess("Membership bought successfully, navigating to home");
      let updatedUser = {...user};
      updatedUser['isMember'] = true;
      dispatch(login({...updatedUser}));
      setTimeout(() => navigate(-1), 2000);
    })
    .catch(error => {
      setError(error?.message);
      setLoading(false);
    })
  }

  const handlePayment = () => {
    if(!cardNumber || cardNumber.toString().length<13){
      setError('Invalid card Number')
      return;
    }
    if(!cardName || cardName.length<3){
      setError('Invalid card holder name')
      return;
    }
    if(!cardSecurity || cardSecurity.toString().length!==3){
      setError('Invalid card security')
      return;
    }
    if(!cardExpiry || !cardExpiry.match(/\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/)){
      setError('Invalid card expiry')
      return;
    }
    setError(false);
    if(paymentItem?.type === 'movie')
      buyTicket();
    else
      buyMembership();
  }
  return(
    <>
      {
          loading? <Loader/> : 
          (
            <div className="payments-container">
              <h1 className="payments-header">
                Payments Breakup
              </h1>
              <div className="payments-item-container">
                {
                  <>
                    <div className="payments-item" key={paymentItem.id}>
                      <p>
                        {paymentItem.itemName}
                      </p>
                      <p>
                        +{paymentItem.itemCost}
                      </p>
                    </div>
                    {
                      paymentItem?.type === "movie" && (
                      <div className="payments-item">
                        <p>
                          Number of tickets (Minimum: 1, Maximum:8)
                        </p>
                        <Input disabled={loading} name="tickets" className="tickets" min={1} max={8} onChange={handleInputChange} value={numTickets} type="number" />
                      </div>  
                      )
                    }
                    {
                      !user?.isMember && paymentItem.type === "movie" && (
                        <div className="payments-item">
                          <p>
                            Non-member fee
                          </p>
                          <p>
                            +1.5
                          </p>                
                        </div>  
                      )
                    }
                    {
                      paymentItem.type === "movie" && user?.points!==0 && (
                        <div className="payments-item">
                          <p>
                            Reward points
                          </p>
                          <p>
                            {-redeemPoints?.toFixed(2)}
                          </p>                
                        </div>  
                      )
                    }
                  </>
                }
                <div className="payments-item">
                  <p>
                    Total
                  </p>
                  <p>
                    {
                      parseFloat(total).toFixed(2)
                    }
                  </p>
                </div>
                <div className="payments-method">
                  <Input disabled={loading} name="number" className="card-number" onChange={handleInputChange} value={cardNumber} type="number" placeholder="Card number" />
                  <Input disabled={loading} name="name" className="card-name" onChange={handleInputChange} value={cardName} type="text" placeholder="Name on card"/>
                  <div className="card-security">
                    <Input disabled={loading} name="security" className="card-cvv" onChange={handleInputChange} value={cardSecurity} type="number" placeholder="Security code"/>
                    <Input disabled={loading} name="expiry" className="card-expiry" onChange={handleInputChange} value={cardExpiry} type="text" placeholder="Expiration date"/>
                  </div> 
                </div>
                {
                  success && (
                    <span className="success">
                      {success}
                    </span>
                  )
                }
                {
                  error && (
                    <span className="error">
                      {error}
                    </span>
                  )
                }
                <Button disabled={loading} type="button-primary" onClick={handlePayment}>
                  Confirm
                </Button>
              </div>
            </div>
          )
      }
    </>
  )
};

export default Payment;