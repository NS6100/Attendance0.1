import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TempletEditHours() {
    const { employeeID, selctYear, selctMonth } = useParams();
    const [workingHoursData, setWorkingHoursData] = useState({});
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [existingEntriesInput, setExistingEntriesInput] = useState({});
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [timeValidationError, setTimeValidationError] = useState(null);
    const [editableTimeValidationError, setEditableTimeValidationError] = useState(null);
    const [editableDateValidationError, setEditableDateValidationError] = useState(null);
    const [editableEntries, setEditableEntries] = useState([
      { date: `01/${selctMonth}/${selctYear}`, inTime: '', outTime: '', totalHours: '' },
    ]);
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const timeRegex = /^(0[1-9]|1[0-9]|2[0-4]):[0-5][0-9]$/;


  const inputDivStyl = {
    display: 'flex',
    justifyContent: 'space-evenly',
    height: '80px',
    rowGap: '20px',
    columnGap: '40px',
  };

  const backStyl = {
    width: '80px',
    height: '80px',
    position: 'absolute',
    zIndex: '1',
  };
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


  function combineInOutEntries(entries) { 
    const combinedEntries = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if(entry.action === "IN"){
        const nextEntry = entries[i + 1];

        if (nextEntry && nextEntry.action === "OUT") {
          const diffInHours = calculateTimeDifference(
            entry.date,
            entry.time,
            nextEntry.date,
            nextEntry.time
          );

          combinedEntries.push({
            date: entry.date,
            inTime: entry.time,
            outTime: nextEntry.time,
            totalHours: parseFloat(diffInHours.toFixed(2)),
            inId: entry._id,
            outId: nextEntry._id,
          });
          i++;
        }else{
          console.log('IN entry without matching OUT entry:', entry);
          combinedEntries.push({
            date: entry.date,
            inTime: entry.time,
            outTime: "",
            totalHours: 0,
            inId: entry._id,
            outId: "",
          });
          i++;
        }
      }else{
        combinedEntries.push({
          date: entry.date,
          inTime: "",
          outTime:entry.time,
          totalHours: 0,
          inId: "",
          outId: entry._id,
        });
        i++;
      }
      
    }
    console.log('combinedEntries : ', combinedEntries);
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
  

  useEffect(() => {
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


  function handleEditChange  (index, field, value)  {
    const updatedEntries = [...editableEntries];
    updatedEntries[index][field] = value;

    setEditableTimeValidationError(null);
    setEditableDateValidationError(null);
    
    for (const entry of updatedEntries) {
      if (!timeRegex.test(entry.inTime) || !timeRegex.test(entry.outTime) || !dateRegex.test(entry.date)) {
        setEditableTimeValidationError('Invalid time format. Please enter a valid time in HH:mm format , date in dd/mm/yyyy format.');
      }
    };

    console.log('editableEntries :',editableEntries)
    setEditableEntries(updatedEntries);
  };
  

function handleExistingEntriesChange  (uniqueId, field, value)  {
  // Create a copy of the existingEntriesInput state
  const updatedInput = { ...existingEntriesInput };
  // Update the specific field for the given uniqueId
  updatedInput[uniqueId] = {
    ...updatedInput[uniqueId],
    [field]: value,
  };
  // If the field is 'inTime' and the 'outTime' is not set, set it to an empty string
  if (field === 'inTime' && !updatedInput[uniqueId]?.outTime) {
    updatedInput[uniqueId] = {
      ...updatedInput[uniqueId],
      outTime: '',
    };
  }
  // Clear any previous time validation error
  setTimeValidationError(null);
  // Validate the time format (HH:mm) for 'inTime' and 'outTime'
  if ((field === 'inTime' || field === 'outTime') && value !== '' && !timeRegex.test(value)) {
    // Handle invalid time format by setting an error state
    setTimeValidationError('Invalid time format. Please enter a valid time in HH:mm format.');
  }
  // Update the existingEntriesInput state with the modified data
  setExistingEntriesInput(updatedInput);
};


function addNewRow  (date, index)  {
  // If the selected row is null or different from the clicked row, create a new editable entry
  if (selectedRowIndex !== index) {
    const newEditableEntry = { date, inTime: "", outTime: "", totalHours: "" };
    setEditableEntries([newEditableEntry]);
    setSelectedRowIndex(index);
  } else {
    // If the selected row is the same as the clicked row, append a new editable entry
    const updatedEntries = [...editableEntries];
    const newEditableEntry = { date, inTime: "", outTime: "", totalHours: "" };
    updatedEntries.push(newEditableEntry);
    setEditableEntries(updatedEntries);
  }
};

  
function saveExistChanges(existingEntry, newInputValue) {
  try {
    // Update the server with the modified entry
    axios
      .post('/updateExistEntries', { employeeID, updatedEntries: [existingEntry], newInputValue })
      .then((response) => {
        console.log('Server response after update:', response.data);
        // Refresh the working hours data after a successful update
        axios.post('/workingHoursDisplay', {allInput: { serchID: employeeID, selctYear, selctMonth },})
          .then((response) => {
            console.log('Server response after refresh:', response.data);
            // Update the editableEntries state with the updated data
            setWorkingHoursData(response.data.chosenEmployee);
            setEmployeeDetails({
            fName: response.data.chosenEmployee.employedFName,
            lName: response.data.chosenEmployee.employedLName,
            ID: response.data.chosenEmployee.employedID,
            });
            // Clear selected row after saving changes
            setSelectedRowIndex(null);
          })
          .catch((error) => {
            console.error('Client: Error refreshing hours data:', error);
          });
      })
      .catch((error) => {
        console.error('Client: Error updating entry:', error);
      });
  } catch (error) {
    console.error('Error updating entry:', error);
  }
}


function saveEditChanges( editableEntries) {
  try {
    console.log('editableEntries',editableEntries)
    axios.post('/updateEditEntries', { employeeID, editableEntries })
      .then((response) => {
        console.log('Server response after update:', response.data);
        // Refresh the working hours data after a successful update
        axios.post('/workingHoursDisplay', {allInput: { serchID: employeeID, selctYear, selctMonth },})
          .then((response) => {
            console.log('Server response after refresh:', response.data);
            // Update the editableEntries state with the updated data
            setWorkingHoursData(response.data.chosenEmployee);
            // Clear selected row after saving changes
            setSelectedRowIndex(null);
          })
          .catch((error) => {
            console.error('Client: Error refreshing hours data:', error);
          });
      })
      .catch((error) => {
        console.error('Client: Error updating entry:', error);
      });
  } catch (error) {
    console.error('Error updating entry:', error);
    // Handle errors as needed  
  }
}



function deleteExistChanges (existingEntry){
console.log('existingEntry:',existingEntry)
axios
.post('/deleteExistEntries', { employeeID, existingEntry })
.then((response) => {
  console.log('Server response after update:', response.data);
  // Refresh the working hours data after a successful update
  axios.post('/workingHoursDisplay', {allInput: { serchID: employeeID, selctYear, selctMonth },})
    .then((response) => {
      console.log('Server response after refresh:', response.data);
      // Update the editableEntries state with the updated data
      setWorkingHoursData(response.data.chosenEmployee);
      setEmployeeDetails({
      fName: response.data.chosenEmployee.employedFName,
      lName: response.data.chosenEmployee.employedLName,
      ID: response.data.chosenEmployee.employedID,
      });
      // Clear selected row after saving changes
      setSelectedRowIndex(null);
    })
    .catch((error) => {
      console.error('Client: Error refreshing hours data:', error);
    });
})
.catch((error) => {
  console.error('Client: Error updating entry:', error);
});

}

function Confirmation (entry, existingEntryInput)  {
  const confirmation = window.confirm("Are you sure you want to delete this entry?");
  if (confirmation) {
    // User clicked "Yes," proceed with deletion
    deleteExistChanges(entry, existingEntryInput);
  }
};
return (
    <div>
      <Link to="/ListForEditHours" title="Back">
        <img src="https://cdn-icons-png.flaticon.com/512/4495/4495698.png" alt="Back" style={backStyl} />
      </Link>

      <div style={inputDivStyl}>
        <h2>Employee Hours</h2>
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
            <th style={thTdStyl}>Actions</th>
          </tr>
        </thead>
        <tbody>
      {/* Existing entries */}
      {workingHoursData.attendance && combineInOutEntries(workingHoursData.attendance).map((entry, index) => {
  const uniqueId = `${entry.date}-${index}`; // Create a unique identifier
  return (
    <React.Fragment key={index}>
      <tr>
        <td style={thTdStyl}>{entry.date}</td>
        <td style={thTdStyl}>
          <input
            type="text"
            placeholder={entry.inTime}
            value={existingEntriesInput[uniqueId]?.inTime || ''}
            onChange={(e) => handleExistingEntriesChange(uniqueId, 'inTime', e.target.value)}
          />
          {timeValidationError && <div style={{ color: 'red' }}>{timeValidationError}</div>}
        </td>
        <td style={thTdStyl}>
          <input
            type="text"
            placeholder={entry.outTime}
            value={existingEntriesInput[uniqueId]?.outTime || ''}
            onChange={(e) => handleExistingEntriesChange(uniqueId, 'outTime', e.target.value)}
          />
          {timeValidationError && <div style={{ color: 'red' }}>{timeValidationError}</div>}
        </td>
        <td style={thTdStyl}>{entry.totalHours}</td>
        <td style={thTdStyl}>
          <button onClick={() => addNewRow(entry.date, index)}>+</button>
        </td>
        <td style={thTdStyl}>
        <button onClick={() => saveExistChanges(entry, existingEntriesInput[uniqueId])}
        disabled={timeValidationError}
        >Save</button>
        </td>
        <td style={thTdStyl}>
        <button onClick={() => Confirmation(entry, existingEntriesInput[uniqueId])}>Delete</button>
        </td>
      </tr>
      {/* Editable entries */}
      {selectedRowIndex === index && editableEntries.map((editableEntry, editableIndex) => (
        <tr key={`editable-${index}-${editableIndex}`}>
          <td style={thTdStyl}>
            <input
              type="text"
              value={editableEntry.date}
              onChange={(e) => handleEditChange(editableIndex, "date", e.target.value)}
            />
            {editableDateValidationError && <div style={{ color: 'red' }}>{editableDateValidationError}</div>}
          </td>        
          <td style={thTdStyl}>
            <input
              type="text"
              value={editableEntry.inTime}
              onChange={(e) => handleEditChange(editableIndex, "inTime", e.target.value)}
            />
            {editableTimeValidationError && <div style={{ color: 'red' }}>{editableTimeValidationError}</div>}
          </td>
          <td style={thTdStyl}>
            <input
              type="text"
              value={editableEntry.outTime}
              onChange={(e) => handleEditChange(editableIndex, "outTime", e.target.value)}
            />
            {editableTimeValidationError && <div style={{ color: 'red' }}>{editableTimeValidationError}</div>}
          </td>
          <td style={thTdStyl}>{editableEntry.totalHours}</td>
          <td style={thTdStyl}></td>
          <td style={thTdStyl}>
            <button onClick={() => saveEditChanges( editableEntries)}
            disabled={editableTimeValidationError || editableDateValidationError}
            >Save</button>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
})}
  {/* Display a single "Editable Entries" row when there are no existing entries */}
  {(!workingHoursData.attendance || workingHoursData.attendance.length === 0) && (
<tr>
<td style={thTdStyl}>
  <input
    type="text"
    placeholder = {editableEntries.date || `01/${selctMonth}/${selctYear}`}
    value= {editableEntries[0]?.date || '' }
    onChange={(e) => handleEditChange(0, "date", e.target.value)}
  />
  {editableDateValidationError && <div style={{ color: 'red' }}>{editableDateValidationError}</div>}
</td>
 <td style={thTdStyl}>
   <input
     type="text"
     value={editableEntries[0]?.inTime || ''}
     onChange={(e) => handleEditChange(0, "inTime", e.target.value)}
   />
   {editableTimeValidationError && <div style={{ color: 'red' }}>{editableTimeValidationError}</div>}
 </td>
 <td style={thTdStyl}>
   <input
     type="text"
     value={editableEntries[0]?.outTime || ''}
     onChange={(e) => handleEditChange(0, "outTime", e.target.value)}
   />
   {editableTimeValidationError && <div style={{ color: 'red' }}>{editableTimeValidationError}</div>}
 </td>
 <td style={thTdStyl}>{editableEntries[0]?.totalHours}</td>
 <td style={thTdStyl}>
   <button onClick={() => addNewRow(`01/${selctMonth}/${selctYear}`, -1)}>+</button>     
 </td>
 <td style={thTdStyl}>
   <button onClick={() => saveEditChanges(editableEntries)}
    disabled={editableTimeValidationError || editableDateValidationError}
    >Save</button>
 </td>
</tr>
)}
    </tbody>
      </table>
    </div>
  );
}

export default TempletEditHours;
