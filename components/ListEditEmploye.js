import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


//////// employee list for ListEmployeesEditingEmployeeDetails 

function ListEditEmploye (){
 
    const [employeeList, setEmployeeList] = useState([]);
    const [input , setInput]= useState({
      status: "Active",
      searchByName:"",

  });
    const navigate = useNavigate();
   

  const employeeContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };
  
  const employeeInfo = {
    display: 'flex',
    alignItems: 'center',
  };
  
  const employeeName = {
    fontWeight: 'bold',
    marginRight: '10px',
  };
  
  const employeeID = {
    color: '#555',
  };
  
  const employeeStatus = (status) => {
    return {
      backgroundColor: status === 'Active' ? '#4CAF50' : '#FF5733',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '5px',
    };
  };
  
    const backStyl ={
        width:'80px',
        height: '80px',
        position :'absolute',
        zIndex: '1',
    }
    
    const inputDivStyl ={
        display:'flex',
        justifyContent: "space-evenly",
        height: '80px',
        rowGap: '20px',
        columnGap: '40px',
    }
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
    const sercformStyl = {
      padding:'10px',
      backgroundColor:'rgb(222, 208, 182)',

      }

  const serchDivStyl ={
    display:'flex',
    justifyContent: "flex-end",
    height: '70px',
    rowGap: '20px',
    columnGap: '40px',

    }


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/getListEmployees', { params: input });
          console.log('Employee list:', response.data);
    
          const filteredList = response.data.filter((employee) => {
            return employee.personalInfo.status === input.status;
          });
    
          setEmployeeList(filteredList);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
    
      fetchData();
    }, [input]);
    


    function handelChange(event) {
      const { value, name } = event.target;
    
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    
      if (name === 'searchByName') {
        // If the input is for searching by name, update the list without making an API call
        const filteredList = employeeList.filter((employee) =>
          employee.personalInfo.fName.toLowerCase().includes(value.toLowerCase()) ||
          employee.personalInfo.lName.toLowerCase().includes(value.toLowerCase())
        );
        setEmployeeList(filteredList);
      } else {
        axios.get('/getListEmployees', { params: input })
          .then((response) => {
            console.log('Employee list:', response.data);
    
            const filteredList = response.data.filter((employee) => {
                return employee.personalInfo.status === input.status;  
            });
    
            setEmployeeList(filteredList);
          })
          .catch((error) => {
            console.error('Error fetching employees:', error);
          });
      }
    }


    function handelClick(employeeID) {
       
      const EditPageURL = `/EditEmployed/${employeeID}`;
      navigate(EditPageURL);
       
    }
    



    return (
      <div>
            <Link to="/" title="Back">
          <img
          src="https://cdn-icons-png.flaticon.com/512/4495/4495698.png"
          alt="Back"
          style={backStyl}
          />
             </Link>

         <div style={inputDivStyl}>
              <h2 >Employ Editing</h2>
          </div>

        <div>
 
  <form style={sercformStyl}>
        <div style={serchDivStyl}>

        <div>
            <input
            name='searchByName'
            type='text'
            placeholder='search By Name '
            required
            autoFocus
            value={input.searchByName}
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
      </form>

      <div>
  <h3>Employee List:</h3>
  <ul>
    {employeeList.map(employee => (
      <li key={employee.ID}>
        <div style={employeeContainer} onClick={() => handelClick(employee.ID)}>
          <div style={employeeInfo}>
            <span style={employeeName}>
              {employee.personalInfo.fName} {employee.personalInfo.lName}
            </span>
            <span style={employeeID}> - {employee.ID}</span>
          </div>
          <div style={employeeStatus(employee.personalInfo.status)}>{employee.personalInfo.status}</div>
        </div>
      </li>
    ))}
  </ul>
</div>

    </div>


        </div>

    )
}




export default ListEditEmploye;