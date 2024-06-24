import { Link ,useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';




function TemplatHoursDisply (){
    const { employeeID, selctYear, selctMonth } = useParams();
    const [workingHoursData, setWorkingHoursData] = useState(null);
    const [employeeDetails ,setEmployeeDetails] = useState(null);
    const[compDeta,setCompDeta] = useState ({
      logoLink:"",
      compID: "",
      compName: "",
    });




   
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
   
    
  const tableDivStyl = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px',
  };

  const tableStyl = {
    borderCollapse: 'collapse',
    width: '80%',
    margin: 'auto',
    marginTop: '10px',
  };

  const thTdStyl = {
    border: '1px solid black',
    textAlign: 'left',
    padding: '8px',
  };

  const pdfBtn = {
    backgroundColor: 'blue', 
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    width : '70',
    height: '50',
  };
  

  useEffect(() => {
    axios.get('/getCompanyDetails')
    .then(response => {
      const companyDetail = response.data.company;
      setCompDeta({
        logoLink:companyDetail.logoLink,
        compID: companyDetail.compID,
        compName: companyDetail.compName,
      });
    
    })
    .catch(error => {
      console.error('Error:', error);
    });
    // Fetch and display hours for the employee with the ID 'employeeID'
    axios.post('/workingHoursDisplay', { allInput: { serchID: employeeID, selctYear, selctMonth } })
      .then((response) => {
        console.log('Server response:', response.data);
        setWorkingHoursData(response.data.chosenEmployee);
        setEmployeeDetails({
          fName: response.data.chosenEmployee.employedFName,
          lName: response.data.chosenEmployee.employedLName,
          ID: response.data.chosenEmployee.employedID,
        });
      })
      .catch((error) => {
        console.error('Client: Error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
        alert(`Error: ${error.message}`);
      });
  
    console.log(`Fetching and displaying hours for employee with ID: ${employeeID}`);
  }, [employeeID, selctYear, selctMonth]);




function combineInOutEntries(entries) {
  const combinedEntries = [];

  for (let i = 0; i < entries.length; i++) {  ///////// לבדוק
    const entry = entries[i];

    if (entry.action === "IN") {
      const nextEntry = entries[i + 1];

      if (nextEntry && nextEntry.action === "OUT") {
        const diffInHours = calculateTimeDifference(entry.date, entry.time, nextEntry.date, nextEntry.time);

        combinedEntries.push({
          date: entry.date,
          inTime: entry.time,
          outTime: nextEntry.time,
          totalHours: parseFloat(diffInHours.toFixed(2)),
        });

        // Skip the next iteration since we have already processed the OUT entry
        i++;
      } else {
        // IN entry without a matching OUT entry, treat it as a separate row without a total of hours
        console.log('IN entry without matching OUT entry:', entry);
        combinedEntries.push({
          date: entry.date,
          inTime: entry.time,
          outTime: "",
          totalHours: 0,
        });
        i++;
      }
      }else{
      combinedEntries.push({
        date: entry.date,
        inTime: "",
        outTime: entry.time,
        totalHours: 0,  
    });
    i++;    

    }                  
  }

  return combinedEntries;
}


function calculateTimeDifference(date1, time1, date2, time2) {
  // Convert date and time strings to ISO format (YYYY-MM-DDTHH:mm)
  const isoDateTime1 = convertDateTimeFormat(date1, time1);
  const isoDateTime2 = convertDateTimeFormat(date2, time2);

  if (!isoDateTime1 || !isoDateTime2) {
    console.error('Invalid date or time format');
    return null;
  }

  const dateTime1 = new Date(isoDateTime1);
  const dateTime2 = new Date(isoDateTime2);
  
  let diffInHours = (dateTime2 - dateTime1) / (1000 * 60 * 60);
  diffInHours = diffInHours < 0 ? diffInHours + 24 : diffInHours;
  return diffInHours;
}

function convertDateTimeFormat(date, time) {
  const [day, month, year] = date.split('/');
  let [hours, minutes] = time.split(':');

  // Ensure hours are within a valid range (0-23)
  hours = parseInt(hours, 10) % 24;

  // Create a new Date object with the adjusted format
  const isoDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`);

  // Check if the Date object is valid
  if (isNaN(isoDate.getTime())) {
    console.error(`Invalid Date: ${date} ${time}`);
    return null;
  }

  return isoDate.toISOString();
}


  

    function createPdf() {
      // Create a new PDF document
      const pdf = new jsPDF();
      // Set document properties
      pdf.setProperties({
        title: 'Working Hours Report',
        subject: 'Employee Working Hours',
        author: compDeta.compName,              
        keywords: 'working hours, report',
      });
      // Add content to the PDF
      pdf.text('Working Hours Report', 20, 10);
      pdf.text(`${compDeta.compName} ${compDeta.compID} `, 20, 20);
      pdf.text(`${employeeDetails.fName} ${employeeDetails.lName} ${employeeDetails.ID}`, 20, 30);
      // Add table content
      const tableData = [['Date', 'IN Time', 'OUT Time', 'Total Hours']];
      combineInOutEntries(workingHoursData.attendance).forEach(entry => {
        tableData.push([entry.date, entry.inTime, entry.outTime, entry.totalHours]);
      });
      pdf.autoTable({
        head: [['Date', 'IN Time', 'OUT Time', 'Total Hours']],
        body: tableData,
        startY: 40,
      });
      // Add total hours and total days
      pdf.text(`Total Hours: ${workingHoursData.attendance.length > 0
        ? combineInOutEntries(workingHoursData.attendance)
            .map(entry => parseFloat(entry.totalHours))
            .reduce((acc, value) => acc + value)
            .toFixed(2): 0}`, 20, pdf.lastAutoTable.finalY + 10);
      pdf.text(`Total Days: ${new Set(workingHoursData.attendance.map(entry => entry.date)).size}`, 20, pdf.lastAutoTable.finalY + 20); 
      // Save the PDF
      pdf.save(`${employeeDetails.ID}_WorkingHoursReport.pdf`);
    }



    return (

        <div>

      <Link to="/ListEmployeesHoursDisp" title="Back">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4495/4495698.png"
          alt="Back"
          style={backStyl}
        /> 
      </Link>
      <div style={inputDivStyl}>
        <h2>
        Working Hours Display 
        </h2>
      </div>
      {workingHoursData && (
        
  <div>
    <div>
          <button style={pdfBtn}  onClick={createPdf}>Create PDF</button>

    </div>
    <div style={tableDivStyl}>
      <h3>Working Hours Data</h3>
    </div>
    <div style={tableDivStyl}>
      <h4>
        {employeeDetails.fName} {employeeDetails.lName} {employeeDetails.ID}
      </h4>
    </div>
    <table style={tableStyl}>
      <thead>
        <tr>
          <th style={thTdStyl}>Date</th>
          <th style={thTdStyl}>IN Time</th>
          <th style={thTdStyl}>OUT Time</th>
          <th style={thTdStyl}>Total Hours</th>
        </tr>
      </thead>
      <tbody>
        {combineInOutEntries(workingHoursData.attendance).map((entry, index) => (
          <tr key={index}>
            <td style={thTdStyl}>{entry.date}</td>
            <td style={thTdStyl}>{entry.inTime}</td>
            <td style={thTdStyl}>{entry.outTime}</td>
            <td style={thTdStyl}>{entry.totalHours}</td>
          </tr>
        ))}
        
        <tr>
          <td style={thTdStyl} colSpan="3">Total Hours :</td>
          <td style={thTdStyl}>
            {workingHoursData.attendance.length > 0
              ? combineInOutEntries(workingHoursData.attendance)
                  .map((entry) => parseFloat(entry.totalHours))
                  .reduce((acc, value) => acc + value)
                  .toFixed(2)
              : 0
            }
          </td>
        </tr>
        <tr>
            <td style={thTdStyl} colSpan="3">Total Days :</td>
          <td style={thTdStyl}>
            {new Set(workingHoursData.attendance.map(entry => entry.date)).size}
        </td>
          </tr>
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}
export default TemplatHoursDisply;