import Button from '../Button/Button';
import Select from '../Select/Select';
import './Navbar.scss';

const Navbar = () => {
  const locations = ['Milpitas', 'San Jose', 'Santa Clara', 'Santa Cruz'];
  const theatres = ['AMC screen 1', 'AMC screen 2', 'AMC screen 3', 'AMC screen 4'];

  const handleLoginOrRegister = () => {

  }

  return(
    <div className="navbar-container">
      <div className='left-content'>
        <Select 
          label={"Location"}
          name={"Locations"} 
          options={locations} 
        />
        <Select 
          label={"Theatres"}
          name={"Theatres"} 
          options={theatres} 
        />
        <a href="/payment" className="link">
          Buy Membership
        </a>
      </div>
      <div className='right-content'>
        <a href="/register" className="link">
          Login/Register
        </a>
      </div>
    </div>
  )
};

export default Navbar;