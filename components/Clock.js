import React, { useState } from 'react';

const display = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, 
  };

  const ClockStyl={
    marginRight:'40px',
    fontSize: '2em'
  }

  

function Clock (){
    const [time , upDateTime]=useState(new Date().toLocaleTimeString('en-US', display));
    setInterval(updateTime,1000)

    function updateTime(){
      upDateTime(new Date().toLocaleTimeString('en-US', display));
    }

return(
<div className="workTitl">
  <h2 style={ClockStyl} > {time } </h2>
</div>);
}

export default Clock