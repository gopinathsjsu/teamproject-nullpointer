import { useSelector } from 'react-redux';
import Select from '../Select/Select';
import Avatar from '../../assets/avatar.png';
import Logo from '../../assets/logo.png';
import './Navbar.scss';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, dashboard } = useSelector((state) => state);
  const [ locations, setLocations] = useState([]);
  const [ theaters, setTheatres] = useState([]);
  const [ selectedLocation, setSelectedLocation ] = useState(locations?.[0] || {});
  const [ selectedTheater, setSelectedTheater ] = useState(theaters?.[0] || {});

  useEffect(() => {
    if(dashboard?.locations){ 
      setLocations(dashboard?.locations);
      setTheatres(dashboard?.theaters);
    }
  },[dashboard]);

  const handleSetLocation = (e) =>{
    const location = locations?.filter(({name}) => name === e?.target?.value)?.[0];
    setSelectedLocation(location);
  }

  const handleSetTheater = (e) =>{
    const theater = theaters?.filter(({name}) => name === e?.target?.value)?.[0];
    setSelectedTheater(theater);
  }
  
  useEffect(() => {
    setTheatres(dashboard?.theaters?.filter((theater) => theater?.locationId === selectedLocation?.id));
  },[selectedLocation]);

  return(
    <div className="navbar-container">
      <div className='left-content'>
        <a href="/" className="link avatar">
          <img src={Logo} alt="avatar" width={80} height={40}/>
        </a>
        <Select 
          label={"Location"}
          name={"Locations"} 
          value={selectedLocation?.name}
          options={locations?.map(({name}) => name)} 
          onChange={handleSetLocation}
        />
        <Select 
          label={"Theatres"}
          name={"Theatres"} 
          value={selectedTheater?.name}
          options={theaters?.map(({name}) => name)} 
          onChange={handleSetTheater}
        />
        {
          user?.id && !user?.isMember && (
          <a href="/payment" className="link">
            Buy Membership
          </a>
          )
        }
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