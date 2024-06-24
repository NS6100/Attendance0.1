import React, { useState , useEffect } from 'react';
import { Link , useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function EditEmployed (){
    const { employeeID} = useParams();
    const [BtnPressed, setBtnPressed] = useState(false);
    const navigate = useNavigate();
    const [employeeFound, setEmployeeFound] = useState(false);
    

    const inputDivStyl ={
        display:'flex',
        justifyContent: "space-evenly",
        height: '80px',
        rowGap: '20px',
        columnGap: '40px',
    }

    const formStyl = {
        width:'100%',
        padding:'30px',
        backgroundColor:'rgb(190, 209, 207)',
    }

    const btnStyl = {
        height: "60px",
        width: "140px",
        fontSize: "20px",
        backgroundColor: BtnPressed ? 'rgb(64, 89, 69)' : 'rgb(152, 238, 204)',   
      };
    const backStyl ={
        width:'80px',
        height: '80px',
        position :'absolute',
        zIndex: '1',
    }


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


    const [input , setInput]= useState({
        serchID: "" ,
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
        permission:"",
        status:"",    
    });


    useEffect(() => {
      // Use the employeeID from useParams directly
      axios.post('/editGetEmploy', { employeeID })
        .then(response => {
          let employee = response.data.employee;
          // Format dates
          const formattedDateOfBirth = new Date(employee.personalInfo.dateOfBirth).toISOString().split('T')[0];
          const formattedDateOfRegistration = new Date(employee.personalInfo.dateOfRegistration).toISOString().split('T')[0];
          // Handle the employee data as needed
          setInput({
            ID: employee.ID,
            password: employee.password,
            fName: employee.personalInfo.fName,
            lName: employee.personalInfo.lName,
            dateOfBirth: formattedDateOfBirth,
            dateOfRegistration: formattedDateOfRegistration,
            phone: employee.personalInfo.phone,
            address: employee.personalInfo.address,
            eMailAddress: employee.personalInfo.eMailAddress,
            hourRate: employee.personalInfo.hourRate,
            permission: employee.personalInfo.permission,
            status: employee.personalInfo.status,
          });
          setEmployeeFound(true);
        })
        .catch(error => {
          console.error('Error:', error);
          setEmployeeFound(false);
        });
    }, [employeeID]); 
    
        
    function handelChange(event) {
        const { value, name } = event.target; 
        setInput((prevInputBar) => ({ ...prevInputBar, [name]: value }));
      }
             
function submiting(event) {
    event.preventDefault();
    let editEmploype = input;
    setBtnPressed(true);
    setTimeout(() => {
      setBtnPressed(false);
    }, 2500);     
    axios.post('/submitEditEmployed', editEmploype)
      .then(response => {
        alert('Server response: ' + response.data.message);
        console.log('Server response:', response.data);
        navigate('/', { replace: true });
      })
      .catch(error => {
        alert(`Error: ${error.message}`);
        console.error('Error:', error);
      });
}
 
    return(
        <div>
            <Link  to='/ListEditEmploye' title='Back' >
                <img src='https://cdn-icons-png.flaticon.com/512/4495/4495698.png' 
                alt='Back'
                style={backStyl} />
            </Link>
            <div style={inputDivStyl}>
            <h2 >Edit Employed</h2>
            </div>
            {employeeFound ? (
            <form style={formStyl} onSubmit={submiting}>
                <div style={inputDivStyl}>
              <div>
              <label htmlFor='fName'>Name</label>
            <input
            name='fName'
            type='text'
            placeholder={input.fName}
            required
            autoFocus
            value={input.fName}
            style={barStyl}
            onChange={handelChange}
            />
            </div>

            <div>
            <label htmlFor='lName'>Last name</label>
            <input
            name='lName'
            type='text'
            placeholder={input.lName}
            required
            autoFocus
            value={input.lName}
            style={barStyl}
            onChange={handelChange}
            />
            </div>

              <div>
              <label htmlFor='ID'>ID</label>
            <input 
            name='ID'
            type='number'
            placeholder={input.ID}
            required
            value={input.ID}
            style={barStyl}
           disabled
            />
            </div>
            </div>
            <div style={inputDivStyl}>

              <div>
              <label htmlFor='phone'>Phone</label>
             <input 
            name='phone'
            type='text'
            placeholder={input.phone}
            required 
            autoFocus
            value={input.phone}
            style={barStyl}
            onChange={handelChange}
            />
              </div>
              <div>
              <label htmlFor='address'>Home address</label>
            <input
            name='address'
            type='text'
            placeholder={input.address}
            required
            autoFocus
            value={input.address}
            style={barStyl}
            onChange={handelChange}
            />
            </div>

              <div>
              <label htmlFor='eMailAddress'>EMail address</label>  
            <input 
            name='eMailAddress'
            type='email'
            placeholder={input.eMailAddress}
           //pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            required
            autoFocus
            value={input.eMailAddress}
            style={barStyl}
            onChange={handelChange}
            />
            </div>
               </div> 
  
            <div style={inputDivStyl}> 

              <div>
              <label htmlFor='password'>Password</label> 
            <input
            name='password'
            type='text'
            placeholder={input.password}
            required
            autoFocus
            value={input.password}
            style={barStyl}
            onChange={handelChange}
            />
            </div>

              <div>
              <label htmlFor='hourRate'>Hourly rate</label>
            <input
            name='hourRate'
            type='number'
            placeholder={input.hourRate}
            required
            autoFocus
            value={input.hourRate}
            style={barStyl}
            onChange={handelChange}
            />
            </div>
            <div>
            <label htmlFor='permission'>Permission</label>
            <select
            name='permission'
            value={input.permission}
            style={barStyl}
            onChange={handelChange}
            >
             <option value={input.permission}>{input.permission}</option>
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
            placeholder={input.dateOfBirth}
            required
            autoFocus
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
            placeholder={input.dateOfRegistration}
            required
            autoFocus
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
            <option value={input.status}>{input.status}</option>
            <option value='Active'>Active</option>
            <option value='Deactive'>Deactive</option>
            </select>
            </div>

            </div>
            <button
            style={btnStyl}
            type='submit'
            value='submit'
           
            >
            Submit
            </button>

            </form>
            ) : (
              <p>No employee found</p>
            )}
        </div>
    )
}

export default EditEmployed;
