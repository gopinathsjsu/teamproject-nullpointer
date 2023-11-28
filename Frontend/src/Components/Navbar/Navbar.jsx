import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import Select from '../Select/Select';
import Avatar from '../../assets/avatar.png';
import Logo from '../../assets/logo.png';
import Caret from '../../assets/caret.svg';
import { setSelectedTheaterInfo, setSelectedLocationInfo } from '../../Redux/dashboardReducer';
import './Navbar.scss';
import { setDashboard } from "../../Redux/dashboardReducer";
import { host } from '../../env';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, dashboard } = useSelector((state) => state);
  const [ locations, setLocations] = useState();
  const [ theaters, setTheatres] = useState();
  const [ selectedLocation, setSelectedLocation ] = useState(locations?.[0] || {});
  const [ selectedTheater, setSelectedTheater ] = useState(theaters?.[0] || {});
  const [ dropdownCicked, setDropdownClicked ] = useState(false);
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const getData = () =>{
    fetch(`${host}/api/all_locations`)
    .then((resp) => resp.json())
    .then((data) => {
      dispatch(setDashboard(data));
    })
  };

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if(dashboard?.locations && !locations && !theaters){ 
      setLocations(dashboard?.locations);
      setTheatres(dashboard?.theaters);
      setSelectedLocation(dashboard?.locations?.[0])
      setSelectedTheater(dashboard?.theaters?.[0])
    }
  },[dashboard]);

  const handleSetLocation = (e) =>{
    const location = locations?.filter(({name}) => name === e?.target?.value)?.[0];
    setSelectedLocation(location);
  }

  const handleSetTheater = (e) =>{
    const theater = theaters?.filter(({name}) => name === e?.target?.value)?.[0];
    setSelectedTheater({...theater});
  }

  useEffect(() => {
    if(selectedTheater?.id)
      dispatch(setSelectedTheaterInfo({...selectedTheater}));
  }, [selectedTheater])

  useEffect(() => {
    setTheatres(dashboard?.theaters?.filter((theater) => theater?.locationId === selectedLocation?.id));
    console.warn('222', selectedLocation?.id, dashboard?.theaters?.filter((theater) => theater?.locationId === selectedLocation?.id));
    setSelectedTheater(dashboard?.theaters?.[0]);
    dispatch(setSelectedLocationInfo({...selectedLocation}));
  },[selectedLocation]);

  const handleLogout = () => {
    localStorage.removeItem('x-access-token');
    window.location.href = '/';
  };

  const handleBuyMembership = () => {
    navigate('/payment', {state: {
      type:'membership',
      id: '1',
      itemName: `Membership`,
      itemCost: 15,
    }});
  }

  return(
    <div className="navbar-container">
      <div className='left-content'>
        <a href="/" className="link avatar">
          <img src={Logo} alt="avatar" width={80} height={40}/>
        </a>
        {
          path === '/' &&(
            <>
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
            </>
          )
        }
        {
          user?.id && user?.isAdmin && (
            <a href="/admin" className="link">
              Admin portal
            </a>
          )
        }
        {
          user?.id && !user?.isMember && !user?.isAdmin && (
          <a onClick={handleBuyMembership} className="link">
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
          <div className='avatar' role="button" onClick={() => setDropdownClicked(!dropdownCicked)}>
            <img src={Avatar} alt="avatar" width={40} height={40}/>
            <img src={Caret} width={20} height={20} className={classNames({
              'rotateDown': dropdownCicked,
              'rotateUp': !dropdownCicked
            })} alt="caret"/>
            {
              dropdownCicked && (
                <div className='avatar-dropdown'>
                  <a href="/account" className="link">Account</a>
                  <a href='#' className='link' onClick={handleLogout}>Logout</a>
                </div>
              )
            }
          </div>
        }
       
      </div>
    </div>
  )
};

export default Navbar;