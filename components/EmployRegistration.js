import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function EmployRegistr(){  
    const ageLimit = 365 * 14 ;
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(maxDate.getDate() + 1);
    const minDateAge = new Date(currentDate);
    minDateAge.setDate(minDateAge.getDate()- ageLimit);
    const minDateRegistr = new Date(currentDate);
    minDateRegistr.setDate(minDateRegistr.getDate()- 31);
    const navigate = useNavigate();
    const [isFormComplete, setIsFormComplete] = useState(false);
    
    const barStyl = {
        margin:'5px',
        boxSizing: "border-box",
        border: "2px solid",
        borderRadius: "8px",
        height : '50px',
        width: '100%', 
        fontSize:'15px',
        font:'bold',
    }

    const inputDivStyl ={
        display:'flex',
        justifyContent: "space-evenly",
        height: '100px',
        rowGap: '20px',
        columnGap: '40px',
        flexShrink: 1, 
    }

    const formStyl = {
        padding:'5px',
        backgroundColor:'rgb(214, 230, 242)',
        flexShrink: 1, 
    }

    const btnStyl = {
        height: "60px",
        width: "140px",
        fontSize: "20px",
        backgroundColor: isFormComplete ? 'rgb(152, 238, 204)' : 'rgb(176, 166, 149)',
        cursor: isFormComplete ? 'pointer' : 'not-allowed',    
      };
      

    const backStyl ={
        width:'80px',
        height: '80px',
        position :'absolute',
        zIndex: '1',
    }

    const [input , setInput]= useState({
        ID: "",
        password:"",
        fName:"",
        lName:"",
        dateOfBirth:"",
        dateOfRegistration:"",
        phone:"",
        address:"",
        eMailAddress:"",
        hourRate:"",
        permission:"NoPermission",
        status:"Active",
    });

      
    function handelChange(event) {
      const { value, name } = event.target;
      if ((name === 'ID' && value.length > 9) || (name === 'phone' && value.length > 10)) {
        alert(`${name} should be at most ${name === 'ID' ? 9 : 10} characters long.`);
        return; // Prevent further execution of the function
      }
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value, 
      }));
      const isComplete = Object.values(input).every((val) => val.trim() !== '');
       setIsFormComplete(isComplete);
    }

    
  function submiting(event) {
        event.preventDefault();
        setIsFormComplete(false);
        const newpemploy = input;
        if (input.ID.toString().length !== 9) {
          alert('ID should have exactly 9 digits.');
          return;
        }
        // Use Axios to send the form data to the server
        axios.post('/employRegistration', newpemploy)
          .then(response => {
            console.log('Server response:', response.data);
            alert("Registration was done successfully");
            navigate('/', { replace: true });      
          })
          .catch(error => {
            console.error('Error:', error);
            navigate('/', { replace: true });
          });
  }
      

 return(
        <div>
            <Link  to='/' title='Back' >
                <img src='https://cdn-icons-png.flaticon.com/512/4495/4495698.png' 
                alt='Back'
                style={backStyl} />
            </Link>
            <div style={inputDivStyl}>
            <h2 >Employ Registration</h2>
            </div>
            <form style={formStyl} onSubmit={submiting}>
                <div style={inputDivStyl}>
            <input
            name='fName'
            type='text'
            placeholder='First Name'
            required
            autoFocus
            value={input.fName}
            style={barStyl}
            onChange={handelChange}
            />
            <input
            name='lName'
            type='text'
            placeholder='Last Name'
            required
            autoFocus
            value={input.lName}
            style={barStyl}
            onChange={handelChange}
            />

            <input 
            name='ID'
            type='number'
            placeholder='I.D'
            required
            pattern="[0-9]{9}"
            autoFocus
            value={input.ID}
            style={barStyl}
            onChange={handelChange}
            />
            </div>

            <div style={inputDivStyl}>
             <input 
            name='phone'
            type='text'
            placeholder='Phone'
            pattern="[0-9]{10}"
            required 
            autoFocus
            value={input.phone}
            style={barStyl}
            onChange={handelChange}
            />
            <input
            name='address'
            type='text'
            placeholder='Home Address'
            required
            autoFocus
            value={input.address}
            style={barStyl}
            onChange={handelChange}
            />
            
            <input 
            name='eMailAddress'
            type='email'
            placeholder='eMail Address'
            required
            autoFocus
            value={input.eMailAddress}
            style={barStyl}
            onChange={handelChange}
            />
               </div> 
  
            <div style={inputDivStyl}> 
            <input
            name='password'
            type='text'
            placeholder='password'
            required
            autoFocus
            value={input.password}
            style={barStyl}
            onChange={handelChange}
            />

            <input
            name='hourRate'
            type='number'
            placeholder='hourly Rate'
            required
            autoFocus
            value={input.hourRate}
            style={barStyl}
            onChange={handelChange}
            />

            <div>
            <label htmlFor='permission'>Permission</label>
            <select
            name='permission'
            value={input.permission}
            style={barStyl}
            onChange={handelChange}
            >
            <option value='NoPermission'>No permissions</option>
            <option value='Rigistration'>Rigistration Only</option>
            <option value='All'>All permissions</option>
            </select>
            </div>
            
            </div>
            <div style={inputDivStyl}>
            <div>
            <label htmlFor='dateOfBirth' >Date Of Birth:</label>
            <input
            id='dateOfBirth'
            name='dateOfBirth'
            type='date'
            placeholder='Date Of Birth'
            required
            autoFocus
            max ={minDateAge.toISOString().split('T')[0]}
            value={input.dateOfBirth}
            style={barStyl}
            onChange={handelChange}
            />
            </div>
            <div>
            <label htmlFor='dateOfRegistration' >Date Of Registration:</label>
            <input
            id='dateOfRegistration'
            name='dateOfRegistration'
            type='date'
            placeholder='Date Of Registration'
            required
            autoFocus
            min={minDateRegistr.toISOString().split('T')[0]}
            max ={maxDate.toISOString().split('T')[0]}
            value={input.dateOfRegistration}
            style={barStyl}
            onChange={handelChange}
            />
            </div>

            <div>
            <label htmlFor='status'>Status:</label>
            <select 
            id='status'
            name='status'
            style={barStyl}
            onChange={handelChange}
            value={input.status}
            >
            <option value='Active'>Active</option>
            <option value='Deactive'>Deactive</option>
            </select>
            </div>

            </div>
            <button
            style={btnStyl}
            type='submit'
            value='submit'
            disabled={!isFormComplete}  
            >
            Submit
            </button>
            </form>
        </div>
    )
}

export default EmployRegistr;