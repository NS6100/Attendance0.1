import React, { useState } from 'react';
import { Link } from 'react-router-dom';



function MainMenu ({userDetails}){

 const permission = userDetails.permission ;
 const userID = userDetails.userID ;
 console.log("userIDM",userID)
 console.log("permissionM",permission)

 

const imgDivStyl ={
display : 'inline' ,
}

const openDivStyl ={
    position :'absolute',
    display: 'flex',
    flexDirection: 'column',
    zIndex: '1',
    
}

const linkStyl = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', 
  alignItems: 'center', 
  border: '2px solid',
  width: '230px',
  height: '80px',
  backgroundColor: 'rgb(255, 255, 236)',
  textAlign: 'center',
};



const imgStyl = {
  height:'55px',
  width:'55px',
  

}

const inerImg ={
  height:'38px',
  width:'38px',
  marginTop:'2px'

}

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeDelay = 6000; 

     let closeTimeout;

    function handleMouseOver() {
        clearTimeout(closeTimeout);
      setIsMenuOpen(true);
    }
  
    function handleMouseOut() {
        closeTimeout = setTimeout(() => {
            setIsMenuOpen(false);
          }, closeDelay);
        
    }



return (
    <div style={imgDivStyl}>
      <img style={imgStyl}
        src= 'https://cdn-icons-png.flaticon.com/512/1828/1828533.png'
        alt="Main Menu"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      {isMenuOpen && (
        <div style={openDivStyl}>
            {(permission === 'All' || permission === 'Rigistration') && (
            <Link to="/EmployRegistration" title="Employ registration" style={linkStyl}>
            Employ Registration
            <img style={inerImg} alt='New Employ Registration'
          src = 'https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-3/256/Add-Male-User-icon.png'
          />
          </Link>
            )}

          {(permission === 'NoPermission' ) &&(
          <Link to={{
            pathname: "/WorkingHoursDisplay", search: `userID=${userID}`,}} title="Working Hours Display" 
            style={linkStyl}>
          Working Hours Display
          <img style={inerImg} alt='Working Hours Display'
          src = 'https://cdn-icons-png.flaticon.com/512/38/38822.png'
          />
          </Link>
            )}

          {(permission === 'All' || permission === 'Rigistration') &&(
          <Link to="/ListEmployeesHoursDisp"
            title="Working Hours Display" 
            style={linkStyl}>
          Working Hours Display
          <img style={inerImg} alt='Working Hours Display'
          src = 'https://cdn-icons-png.flaticon.com/512/38/38822.png'
          />
          </Link>
            )}

          {(permission === 'All' || permission === 'Rigistration') && (
          <Link to="/ListEditEmploye" title="Edit employed" style={linkStyl}> 
          Edit Employed
          <img style={inerImg} alt='Edit Employed'
          src = 'https://cdn3.iconfinder.com/data/icons/pretty-office-part-3/256/Sign_up-512.png'
          />
          </Link>
          )}

          {(permission === 'All' ) &&(
          <Link to="/ListForEditHours" title="Working Hours Editing" style={linkStyl}>
          Working Hours Editing
          <img style={inerImg} alt='Working Hours Editing'
          src = 'https://cdn2.iconfinder.com/data/icons/flat-artistic-common-5/32/database_table-edit-512.png'
          />
          </Link>
          )}

          {(permission === 'All' ) &&(
            <Link to="/CompDetails" title="Display settings" style={linkStyl} >
            Company details
            <img style={inerImg} alt='Company details'
          src = 'https://cdn-icons-png.flaticon.com/512/2083/2083417.png'
          />
            </Link>
          )}



          


        </div>
      )}

    </div>
  );
}



export default MainMenu







