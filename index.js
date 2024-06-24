
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App.js';
import EmployRegistr from './components/EmployRegistration.js';
import ResetEmployPassword from './components/ResetEmployPassword.js';
import EditEmployed from './components/EditEmployed.js';
import Header from './components/Header.js';
import WorkingHoursDisplay from './components/WorkingHoursDisplay.js';
import ListForEditHours from './components/ListForEditHours.js';
import TempletEditHours from './components/TempletEditHours.js';
import TemplatHoursDisply from './components/TemplatHoursDisply.js';
import CompDetails from './components/CompDetails.js';
import ListEmployeesHoursDisp from './components/ListEmployeesHoursDisp.js';
import ListEditEmploye from './components/ListEditEmploye.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppContainer = () => {
  const [logoUrl, setLogoUrl] = useState(''); 
  const permission = '';


  return (
    <BrowserRouter>
      <Header logoUrl={logoUrl} setLogoUrl={setLogoUrl} permission ={permission} />
      
      <Routes>
        <Route path="/" element={<App permission ={permission} />} />
        <Route path="/EmployRegistration" element={<EmployRegistr />} />
        <Route path='/ResetEmployPassword' element={<ResetEmployPassword />} />
        <Route path='/WorkingHoursDisplay' element={<WorkingHoursDisplay />} />
        <Route path='/ListForEditHours' element={<ListForEditHours />} />
        <Route path="/TempletEditHours/:employeeID/:selctYear/:selctMonth" element={<TempletEditHours />} />
        <Route path='/CompDetails' element={<CompDetails logoUrl={logoUrl} setLogoUrl={setLogoUrl}  />} />
        <Route path='ListEmployeesHoursDisp' element={<ListEmployeesHoursDisp />} />
        <Route path="/TemplatHoursDisply/:employeeID/:selctYear/:selctMonth" element={<TemplatHoursDisply />} />
        <Route path='ListEditEmploye' element={<ListEditEmploye />} />
        <Route path='/EditEmployed/:employeeID' element={<EditEmployed />} />
      </Routes>
    </BrowserRouter>
  );
};

root.render(<AppContainer />);
