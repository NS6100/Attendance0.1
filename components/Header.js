
import CompLogo from './CompLogo.js'
import Clock from './Clock.js';
//import React, { useState } from 'react';

function Header ({ logoUrl, setLogoUrl }){ 

  const headerStyl = {
    display:'flex',
    justifyContent:'space-between' ,
    marginTop: '20px' ,
    marginBottom: '20px' , 
    hieght :'100px',
    backgroundColor: '#ffffff',
    backgroundImage:  'repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 40px ), repeating-linear-gradient( #9098c055, #9098c0 )',
    
    };

return(
<header className="App-header" style={headerStyl} >
<div className="workTitl" >
  <h1 style={{marginLeft:'20px'}}> At10dance </h1>
</div>
<CompLogo logoUrl={logoUrl} setLogoUrl={setLogoUrl}/>
<Clock />
</header>
);
}

export default Header;

