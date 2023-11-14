import { useSelector } from 'react-redux';
import Select from '../Select/Select';
import Avatar from '../../assets/avatar.png';
import Logo from '../../assets/logo.png';
import './Navbar.scss';

const Navbar = () => {
  const locations = ['Milpitas', 'San Jose', 'Santa Clara', 'Santa Cruz'];
  const theatres = ['AMC screen 1', 'AMC screen 2', 'AMC screen 3', 'AMC screen 4'];
  const { user } = useSelector((state) => state);
  
  return(
    <div className="navbar-container">
      <div className='left-content'>
        <a href="/" className="link avatar">
          <img src={Logo} alt="avatar" width={80} height={40}/>
        </a>
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
        {
          !user?.id?
            <a href="/register" className="link">
              Login/Register
            </a>
          :
            <a href="/account" className="link avatar">
              <span>Welcome {user?.username}</span>
              <img src={Avatar} alt="avatar" width={40} height={40}/>
            </a>
        }
       
      </div>
    </div>
  )
};

export default Navbar;