import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';

import './Payment.scss';
const Payment = () =>{
  const handlePayment = () => {

  }
  const paymentItems = [
    {
      id:'1',
      itemName: 'Premium Membership',
      itemCost: 15
    },
    {
      id:'2',
      itemName: 'Movie - Oppenheimer',
      itemCost: 30
    }
  ]
  return(
    <div className="payments-container">
      <h1 className="payments-header">
        Payments Breakup
      </h1>
      <div className="payments-item-container">
        {
          paymentItems.map((item) =>(
            <div className="payments-item" key={item.id}>
              <p>
                {item.itemName}
              </p>
              <p>
                {item.itemCost}
              </p>
            </div>
          ))
        }
        <div className="payments-item">
          <p>
            Total
          </p>
          <p>
            {paymentItems.reduce((total, item) => item.itemCost+total,0)}
          </p>
        </div>
        <div className="payments-method">
          <Input className="card-number" placeholder="Card number" />
          <Input className="card-name" placeholder="Name on card"/>
          <div className="card-security">
            <Input className="card-cvv" placeholder="Security code"/>
            <Input className="card-expiry" placeholder="Expiration date"/>
          </div>
        </div>
        <Button type="button-primary" onClick={handlePayment}>
          Confirm
        </Button>
      </div>
    </div>
  )
};

export default Payment;