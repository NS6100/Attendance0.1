import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


//////// employee list for ListEmployeesHoursDisp 

function ListEmployeesHoursDisp (){
    const corentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthName = currentMonth.toString().padStart(2, '0');

    
    const [employeeList, setEmployeeList] = useState([]);
    const [input , setInput]= useState({
      selctYear:corentYear,
      selctMonth:currentMonthName ,
      status: "Active",
      searchByName:"",

  });
    const navigate = useNavigate();
   

  const employeeContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #ccc',
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
        
      const hoursPageURL = `/TemplatHoursDisply/${employeeID}/${input.selctYear}/${input.selctMonth}`;
      navigate(hoursPageURL);
       
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
              <h2 >Employ Hours Display </h2>
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
          
          <select
              name='selctMonth'
              value={input.selctMonth}
              onChange={handelChange}
              placeholder= {currentMonthName}
             style={barStyl}
            >
              <option value="01">January:1</option>
              <option value="02">February:2</option>
             <option value="03">March:3</option>
             <option value="04">April:4</option>
             <option value="05">May:5</option>
             <option value="06">June:6</option>
             <option value="07">July:7</option>
             <option value="08">August:8</option>
              <option value="09">September:9</option>
              <option value="10">October:10</option>
             <option value="11">November:11</option>
              <option value="12">December:12</option>
            </select>
          <div>
          <div>
            <label htmlFor="selctYear">Selcte Year:</label>
            <input
              name="selctYear"
              type="number"
              placeholder={corentYear}
              required
              autoFocus
              value={input.selctYear}
              style={barStyl}
              onChange={handelChange}
            />
          </div>
            

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




export default ListEmployeesHoursDisp;