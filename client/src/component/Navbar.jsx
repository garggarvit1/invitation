import React from 'react'
import {Link} from "react-router-dom"


const Navbar = () => {
  return (
    <div className="navbar">
     
      <div className="navbar-container">
        {/* <div className="navbar-logo">MyApp</div> */}
        <div className="navbar-links"  style={{ display: 'flex',flexDirection:'row',justifyContent:'space-evenly' }} >
          {/* <Link to="/" className="navbar-link">Home</Link> */}
          <Link to="/" className='navbar-link' >Home</Link>

          <Link to="/addInfo" className="navbar-link" >Add</Link>
          <Link to={"/invitation"}>Invitation</Link>
          <Link to={"/addinvite"}> ADD Invitation</Link>
        </div>
      </div>
    
    </div>
  )
}

export default Navbar