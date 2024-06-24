import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function ResetEmployPassword (){

    const [isFormComplete, setIsFormComplete] = useState(false);
    const navigate = useNavigate();

    const barStyl = {
        margin:'5px',
        boxSizing: "border-box",
        border: "2px solid",
        borderRadius: "8px",
        height : '50px',
        width: '280px',
        fontSize:'15px',
        font:'bold',
    }

    const inputDivStyl ={
        display:'flex',
        justifyContent: "space-evenly",
        height: '100px',
        rowGap: '20px',
        columnGap: '40px',
        margin: '20px'
    }

    const formStyl = {
      
        padding:'30px',
        backgroundColor:'rgb(243, 238, 234)',

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
        newPassword:"",
        dateOfBirth:"",
        phone:"",
       
    });


   

    function handelChange(event) {
        const { value, name } = event.target;
      
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
        const employeeDetails = input;
        console.log(employeeDetails);
      
        axios.put('/resetEmployPassword', employeeDetails)
          .then(response => {
            console.log('Server response:', response.data);
            alert("The password has been changed successfully");
            navigate('/', { replace: true });
          })
          .catch(error => {
            console.error('Error:', error.response.data);
             if (error.response.status === 400 || error.response.status === 404) {
              alert(error.response.data.message);
            } else {
              alert("An error occurred. Please try again later.");
            }
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
                <h2>Password Reset</h2>
            </div>
            <form style={formStyl} onSubmit={submiting}>
           
            <div style={inputDivStyl}>
            <input 
             name='ID'
             type='text'
             placeholder='I.D'
             required
              autoFocus
              value={input.ID}
              style={barStyl}
              onChange={handelChange}
        />
  
            <input 
            name='phone'
            type='text'
            placeholder='Phone'// XXX-XXXXXXX'
            // pattern="[0-9]{3}-[0-9]{7}"
             required 
            autoFocus
             value={input.phone}
            style={barStyl}
            onChange={handelChange}
        />
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
        value={input.dateOfBirth}
        style={barStyl}
        onChange={handelChange}
        />
        </div>
        <input
        name='newPassword'
        type='text'
        placeholder='New Password'
        required
        autoFocus
        value={input.password}
        style={barStyl}
        onChange={handelChange}
        />

       

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


export default ResetEmployPassword;