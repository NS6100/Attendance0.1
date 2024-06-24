import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import fs from 'fs';
import multer from 'multer'; 




const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 9000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const buildPath = path.join(projectRoot, 'build');
app.use(express.static(buildPath));

mongoose.connect('mongodb://localhost:27017/attendance', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Schema, model } = mongoose;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const employeeSchema = new Schema({
  password: { type: String, required: true },
  ID: { type: String, required: true, unique: true },
  personalInfo: {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    dateOfRegistration: { type: Date, required: true, default: Date.now },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    eMailAddress: { type: String, required: true, unique: true },
    hourRate: { type: Number, required: true },
    permission: { type: String, required: true },
    status: { type: String, required: true, default: 'Active' },
  },
  
  attendance: [{
    id: { type: Schema.Types.ObjectId },
    date: { type: String },
    time: { type: String },
    action: { type: String },
  }],

  messages: [{
    id: { type: Schema.Types.ObjectId },
    date: { type: String },
    sender: { type: String },
    addressee: { type: String },
    content: { type: String },
  }],
  

});
employeeSchema.path('attendance').default([]);
employeeSchema.path('messages').default([]);
const Employee = model('Employee', employeeSchema);


const companySchema = new Schema({
  logoLink: { type: String, required: true },
  compID: { type: Number, required: true, unique: true },
  compName: { type: String, required: true },
  hostSMTP : { type: String, required: true, unique: true },  /////////////////
  eMailAddressSmtp: { type: String, required: true, unique: true }, ///////////
  passwordSMTP : { type: String, required: true, unique: true },  /////////////
   });

const Company = model('Company', companySchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});




app.post('/sendPdfEmail', upload.single('pdf'), async (req, res) => {
  const { email } = req.body;
  const pdfPath = req.file.path;

  try {
    const company = await Company.findOne({});
    if (!company) {
      console.error('SMTP server details not found in the database');
      return res.status(500).json({ success: false, message: 'SMTP server details not found' });
    }

    const transporter = nodemailer.createTransport({
      host: company.hostSMTP,
      port: 587,
      secure: false,
      auth: {
        user: company.eMailAddressSmtp,
        pass: company.passwordSMTP,
      },
    });

    const mailOptions = {
      from: company.eMailAddressSmtp,
      to: email,
      subject: 'Working Hours Report - DoNotReply',
      text: 'Please find the attached working hours report.',
      attachments: [
        {
          filename: path.basename(req.file.originalname),
          path: pdfPath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      fs.unlink(pdfPath, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });

      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      }

      console.log('Email sent:', info.response);
      res.json({ success: true, message: 'Email sent successfully' });
    });
  } catch (error) {
    console.error('Error in email sending process:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




app.post('/updateCompDetails', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { logoLink, compID, compName } = req.body;
    await Company.deleteMany({});
    const newCompany = new Company({
      logoLink,
      compID,
      compName,
      hostSMTP ,
      eMailAddressSmtp,
      passwordSMTP,
    });
    const savedCompany = await newCompany.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getCompanyDetails', async (req, res) => {
  try {
    const company = await Company.findOne({});
    if (company) {
      res.status(200).json({ company });
    } else {
      res.status(404).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/employRegistration', async (req, res) => { 
  try {
    //console.log('Received data:', req.body);
    const {
        ID,
        password,
        fName,
        lName,
        dateOfBirth,
        dateOfRegistration,
        phone,
        address,
        eMailAddress,
        hourRate,
        permission,
        status,
    } = req.body;

    // Create a new Employee instance
    const newEmployee = new Employee({
      password,
      ID,
      personalInfo: {
        fName,
        lName,
        dateOfBirth,
        dateOfRegistration,
        phone,
        address,
        eMailAddress,
        hourRate,
        permission,
        status,
      }
    });
    // Save the new employee to the database
    const savedEmployee = await newEmployee.save();
    console.log('Saved employee:', savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/mainInputIdValid', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const testediDValue = req.body.iDValue;
    const employee = await Employee.findOne({ ID: testediDValue });
    const passwordLength = employee ? employee.password.length : 0;
    const isIdValid = employee !== null;
    console.log('Is ID Valid:', isIdValid);
     res.status(201).json({ passwordLength, isIdValid});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

  
app.post('/mainInputPasswordValid', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const testediDValue = req.body.InputValid.iDBar;
    const  testedPass = req.body.InputValid.passBar;
    const employee = await Employee.findOne({ ID: testediDValue });
    const isIdValid = employee !== null && employee.personalInfo.status !== 'Deactive';
    const isPasswordValid = isIdValid && employee.password === testedPass;
    const permission = employee.personalInfo.permission 
    res.status(201).json({ isPasswordValid , permission }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.put('/signAttendance', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const iDValue = req.body.attendanceSignature.iDBar;
    const time = req.body.attendanceSignature.time
    const date = req.body.attendanceSignature.date;
    const action = req.body.attendanceSignature.action;
    const employee = await Employee.findOne({ ID: iDValue });
    if (employee) {
      employee.attendance.push({ time: time ,date:date, action:action });
      await employee.save();
      res.status(201).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.put('/resetEmployPassword', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { ID, newPassword, dateOfBirth, phone } = req.body;
    const employee = await Employee.findOne({ ID });
    console.log(employee);
    if (employee) {
      const employeeDateOfBirth = employee.personalInfo.dateOfBirth.toISOString().substring(0, 10);
      const inputDateOfBirth = String(dateOfBirth).substring(0, 10);
      const isValid = employee.personalInfo.phone === phone && employeeDateOfBirth === inputDateOfBirth;
      if (isValid) {
        const email = employee.personalInfo.eMailAddress;

        await Employee.updateOne({ ID }, { password: newPassword });
        console.log("Success");

        const company = await Company.findOne({});
        if (!company) {
          console.error('SMTP server details not found in the database');
          return res.status(500).json({ success: false, message: 'SMTP server details not found' });
        }

        const transporter = nodemailer.createTransport({
          host: company.hostSMTP,
          port: 587,
          secure: false,
          auth: {
            user: company.eMailAddressSmtp,
            pass: company.passwordSMTP,
          },
        });

        const mailOptions = {
          from: company.eMailAddressSmtp,
          to: email,
          subject: 'Password Change Notification - DoNotReply',
          text: 'Your password for the Attendance system has been successfully changed.',
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
          }
          console.log('Email sent:', info.response);
          res.status(200).json({ success: true, message: 'Password changed and email sent successfully' });
        });
      } else {
        console.log("One Of The Fields is wrong");
        res.status(400).json({ success: false, message: "One or more details filled are incorrect" });
      }
    } else {
      console.log("No Employee Found");
      res.status(404).json({ success: false, message: "No Employee Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/editGetEmploy', async (req, res) => {
  try {
      console.log('Received data:', req.body);
      const serchId = req.body.employeeID;
      const employee = await Employee.findOne({ ID: serchId });
      if (employee) {
          res.status(200).json({ employee });
      } else {
          res.status(404).json({ message: "Employee not found" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


app.post('/submitEditEmployed', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    // Extract relevant data directly from req.body
    const {
      ID,
      password,
      fName,
      lName,
      dateOfBirth,
      dateOfRegistration,
      phone,
      address,
      eMailAddress,
      hourRate,
      permission,
      status,
    } = req.body;
    // Find the existing employee by ID
    const existingEmployee = await Employee.findOne({ ID });
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    // timestamps in milliseconds since the Unix epoch (January 1, 1970, 00:00:00 UTC)
    const formattedDateOfBirth = new Date(dateOfBirth);
    formattedDateOfBirth.setUTCHours(0, 0, 0, 0);
    const existingDateOfBirth = new Date(existingEmployee.personalInfo.dateOfBirth);
    existingDateOfBirth.setUTCHours(0, 0, 0, 0);

    const formattedDateOfRegistration = new Date(dateOfRegistration);
    formattedDateOfRegistration.setUTCHours(0, 0, 0, 0);
    const existingDateRigistration = new Date(existingEmployee.personalInfo.dateOfRegistration);
    existingDateRigistration.setUTCHours(0, 0, 0, 0);
   
    // Check if the received data is different from the data in the DB
    const isDataChanged =
    (existingEmployee.password === password ) &&
    (existingEmployee.personalInfo.fName === fName ) &&
    (existingEmployee.personalInfo.lName === lName ) &&
    (existingDateOfBirth.getTime() === formattedDateOfBirth.getTime() ) &&
    (existingDateRigistration.getTime() === formattedDateOfRegistration.getTime() ) &&
    (existingEmployee.personalInfo.phone === phone ) &&
    (existingEmployee.personalInfo.address === address ) &&
    (existingEmployee.personalInfo.eMailAddress === eMailAddress ) &&
    (existingEmployee.personalInfo.hourRate === hourRate ) &&
    (existingEmployee.personalInfo.permission === permission ) &&
    (existingEmployee.personalInfo.status === status );
    if (isDataChanged) {
      return res.status(200).json({ message: 'No changes detected' });
    }else{
    // Update the employee document with the new data
    existingEmployee.password = password;
    existingEmployee.personalInfo.fName = fName;
    existingEmployee.personalInfo.lName = lName;
    existingEmployee.personalInfo.dateOfBirth = dateOfBirth;
    existingEmployee.personalInfo.dateOfRegistration = dateOfRegistration;
    existingEmployee.personalInfo.phone = phone;
    existingEmployee.personalInfo.address = address;
    existingEmployee.personalInfo.eMailAddress = eMailAddress;
    existingEmployee.personalInfo.hourRate = hourRate;
    existingEmployee.personalInfo.permission = permission;
    existingEmployee.personalInfo.status = status;
    // Save the updated employee document
     await existingEmployee.save();
     return res.status(201).json({ message: 'Editing was done successfully' });
  }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/workingHoursDisplay', async (req, res) => { 
  try {
    const serchId = req.body.allInput.serchID || req.body.employeeID;
    const selctYear = req.body.allInput.selctYear;
    const selctMonth = req.body.allInput.selctMonth;
    const employee = await Employee.findOne({ ID: serchId });
    if (employee) {
      // Filter attendance for the selected month and year
      const filteredAttendance = employee.attendance.filter(entry => {
        const entryDateParts = entry.date.split('/');
        const entryDate = new Date(`${entryDateParts[2]}-${entryDateParts[1]}-${entryDateParts[0]}`);
        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth() + 1;
        return entryYear == selctYear && entryMonth == selctMonth;
      });
      const chosenEmployee = {
        attendance: filteredAttendance,
        employedFName: employee.personalInfo.fName,
        employedLName: employee.personalInfo.lName,
        employedID: employee.ID,
        employedEmail : employee.personalInfo.eMailAddress,
      };
      res.status(200).json({ chosenEmployee });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/getListEmployees', async (req, res) => { 
  try {
    const { status } = req.query;
    console.log('Received request with status:', status);
    const query = status ? { 'personalInfo.status': status } : {};
    console.log('Constructed query:', query);
    // Fetch the list of employees from the database
    const employees = await Employee.find(query, {
      _id: 0,
      ID: 1,
      'personalInfo.fName': 1,
      'personalInfo.lName': 1,
      'personalInfo.status': 1,
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/updateExistEntries', async (req, res) => { 
  try {
    console.log('Received data for updating entries:', req.body);
    const { updatedEntries, employeeID, newInputValue } = req.body;
    console.log('Employee ID:', employeeID);
    const employee = await Employee.findOne({ ID: employeeID });
    if (!employee) {
      console.error(`Employee not found for ID: ${employeeID}`);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    let existingEntryOut = null, existingEntryIn = null;
    for (const entry of updatedEntries) {
      const { inTime, outTime, date, inId, outId } = entry;
      if(newInputValue.outTime ){
         existingEntryOut = employee.attendance.find(
          (attEntry) => attEntry._id.toString() === outId)
      }
      if(newInputValue.inTime ){
         existingEntryIn = employee.attendance.find(
          (attEntry) => attEntry._id.toString() === inId)
      }
        
      if (existingEntryOut || existingEntryIn ) {
        console.log((existingEntryOut || existingEntryIn ))
        // Update the existing entry
        
        if (newInputValue.inTime) {
          existingEntryIn.time = newInputValue.inTime;
        }
        if (newInputValue.outTime) {
          existingEntryOut.time = newInputValue.outTime;
        }
      } else {
          
        console.log(`Entry not found for date: ${date} and id: ${newInputValue.outTime? outId : inId}`);

        if (newInputValue.inTime) {
          employee.attendance.push({
            date:date,
            time:newInputValue.inTime,
            action: 'IN',
          });
         }
          if (newInputValue.outTime) {
            employee.attendance.push({
              date:date,
              time: newInputValue.outTime,
              action: 'OUT',
            });
          }
      }
    }
    const savedEmployee = await employee.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating entries:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



app.post('/updateEditEntries', async (req, res) => {
  try {
    console.log('Received data for updating entries:', req.body);
    const { employeeID, editableEntries } = req.body;
    const employee = await Employee.findOne({ ID: employeeID });
    if (!employee) {
      console.error(`Employee not found for ID: ${employeeID}`);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    for (const updatedEntry of editableEntries) {
      const { date, inTime, outTime } = updatedEntry;
        if (inTime) {
        employee.attendance.push({
          date:date,
          time: inTime,
          action: 'IN',
        });
       }
        if (outTime) {
          employee.attendance.push({
            date:date,
            time: outTime,
            action: 'OUT',
          });
        }
      }
    // Save changes to the database
    const savedEmployee = await employee.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating entries:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.post('/deleteExistEntries', async (req, res) => {
  try {
    console.log('Received data for updating entries:', req.body);
    const { existingEntry, employeeID } = req.body;
    const employee = await Employee.findOne({ ID: employeeID });
    if (!employee) {
      console.error(`Employee not found for ID: ${employeeID}`);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    let updateQuery = {};
    const { inTime, outTime, inId, outId } = existingEntry;
    if (outId) {
      const existingEntryOut = employee.attendance.find(
        (attEntry) => attEntry._id.toString() === outId
      );
        if (existingEntryOut) {
          updateQuery.$pull = { 'attendance': { _id: outId } };
         }
    }
    if (inId) {
      const existingEntryIn = employee.attendance.find(
        (attEntry) => attEntry._id.toString() === inId
      );
        if (existingEntryIn) {
          updateQuery.$pull = { 'attendance': { _id: inId } };
         }
    }
    // Apply the update to the database
    await Employee.updateOne({ ID: employeeID }, updateQuery);
    // Save changes to the database
    const savedEmployee = await employee.save();
    console.log('Saved Employee:', savedEmployee);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating entries:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
