import React, { useState ,useEffect ,useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const CompDetails = ({ logoUrl, setLogoUrl }) => {
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [compID, setCompID] = useState('');
  const [compName, setCompName] = useState('');
  const [hostSMTP, sethostSMTP] = useState('');
  const [eMailAddressSmtp, seteMailAddressSmtp] = useState('');
  const [passwordSMTP, setpasswordSMTP] = useState('');

  const [inputBar, setInputBar] = useState({
    logoLink: "",
    compID: "",
    compName: "" ,
    hostSMTP : "" ,
    eMailAddressSmtp: "",
    passwordSMTP: "" ,
  });
  
  const mainDiv = {
    paddingBottom: '70px',
    backgroundColor: '#ffffff',
    backgroundImage: 'radial-gradient(#9098c0 2px, #ffffff 2px)',
    backgroundSize: '40px 40px',

  }

  const backStyl = {
    width: '80px',
    height: '80px',
    position: 'absolute',
    zIndex: '1',
  };

  const backDiv = {
    display: 'block',
    margin: '20px',
    height: '100px',
  };

  const divStyl = {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    height: '120px',
  };

  const barStyl = {
    margin: '5px',
    boxSizing: 'border-box',
    border: '2px solid',
    borderRadius: '8px',
    height: '50px',
    width: '280px',
    fontSize: '15px',
    font: 'bold',
  };

  const inputDivStyl = {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '120px',
    rowGap: '20px',
    columnGap: '40px',
    margin: '5px',
    backgroundColor: 'rgb(238, 245, 255)',
  };

  const labelStyl = {
    fontWeight: 'bold',
    fontSize: '150%',
  };

  const BtnStyl = {
    display: 'inline-block',
    justifyContent:'space-between',
    height: '80px',
    width: '100px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '20px',
    backgroundColor:'green',
    color: 'white',
    

  };

  const logoStyl = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  };

  const imgWindo = {
    border: '2px solid black',
    width: '100px',
    height: '100px',
  };

 


const memoizedSetLogoUrl = useCallback((newUrl) => {
  setLogoUrl(newUrl);
}, [setLogoUrl]);

useEffect(() => {
  axios.get('/getCompanyDetails')
    .then(response => {
      const companyDetail = response.data.company;
      setInputBar({
        logoLink: companyDetail.logoLink,
        compID: companyDetail.compID,
        compName: companyDetail.compName,
        hostSMTP : companyDetail.hostSMTP ,
        eMailAddressSmtp: companyDetail.eMailAddressSmtp,
        passwordSMTP: companyDetail.passwordSMTP ,
      });
      memoizedSetLogoUrl(companyDetail.logoLink);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}, [memoizedSetLogoUrl]);

  function handleChange(event) {
    const { value, name } = event.target;
    switch (name) {
      case 'logo':
        setNewLogoUrl(value);
        setInputBar((prevInputBar) => ({ ...prevInputBar, [name]: value }));
        break;
      case 'compID':
        setCompID(value);
        setInputBar((prevInputBar) => ({ ...prevInputBar, [name]: value }));
        break;
      case 'compName':
        setCompName(value);
        setInputBar((prevInputBar) => ({ ...prevInputBar, [name]: value }));
        break;
      case 'hostSMTP':
        sethostSMTP(value);
        setInputBar((prevInputBar) => ({ ...prevInputBar, [name]: value }));
        break;
      case 'eMailAddressSmtp':
        seteMailAddressSmtp(value);
        setInputBar((prevInputBar) => ({ ...prevInputBar, [name]: value }));
        break;
      case 'passwordSMTP':
        setpasswordSMTP(value);
        setInputBar((prevInputBar) => ({ ...prevInputBar, [name]: value }));
        break;


      default:
        break;
    }
  }



  function submitCompDet(event) {
    event.preventDefault();
    const { logoLink, compID, compName } = inputBar;
    setLogoUrl(newLogoUrl);
    const companyDeta = {
      logoLink: newLogoUrl,
      compID,
      compName,
      hostSMTP,
      eMailAddressSmtp,
      passwordSMTP,
    };
  
    axios.post('/updateCompDetails', companyDeta)
      .then(response => {
        console.log('Server response:', response.data); 
        alert(`Company details have been successfully entered`);  
      })
      .catch(error => {
        console.error('Error:', error);

      });
  }
  
  

  return (
    <div style={mainDiv}>
      <div style={backDiv}>
        <Link to="/" title="Back">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4495/4495698.png"
            alt="Back"
            style={backStyl}
          />
        </Link>
      </div>
      <div style={divStyl}>
        <div style={inputDivStyl}>
          <label htmlFor="logoInput" style={labelStyl}>
            Enter Logo URL:
          </label>
          <input
            type="text"
            id="logoInput"
            name="logo"
            value={inputBar.logoLink  ||newLogoUrl}
            onChange={handleChange}
            placeholder="Enter logo URL"
            style={barStyl}
          />

          <div style={imgWindo}>
            {logoUrl && <img src={logoUrl} alt="Custom Logo" style={logoStyl} />}
          </div>
        </div>
      </div>

      <div style={inputDivStyl}>
        <div>
          <label htmlFor="compID" style={labelStyl}>
            Enter Company ID number
          </label>
          <input
            type="number"
            id="compID"
            name="compID"
            value={inputBar.compID || compID}
            onChange={handleChange}
            placeholder="Company ID number"
            style={barStyl}
          />
        </div>

        <div>
          <label htmlFor="compName" style={labelStyl}>
            Enter Company Name
          </label>
          <input
            type="text"
            id="compName"
            name="compName"
            value={inputBar.compName || compName}
            onChange={handleChange}
            placeholder="Company Name"
            style={barStyl}
          />
        </div>
        </div>

        <div style={inputDivStyl}>
        <div>
          <label htmlFor="hostSMTP" style={labelStyl}>
            Enter Company Host SMTP
          </label>
          <input
            type="number"
            id="hostSMTP"
            name="hostSMTP"
            value={inputBar.hostSMTP || hostSMTP}
            onChange={handleChange}
            placeholder="Company Host SMTP"
            style={barStyl}
          />
        </div>

        <div>
          <label htmlFor="eMailAddressSmtp" style={labelStyl}>
            Enter Company Email Address SMTP
          </label>
          <input
            type="text"
            id="eMailAddressSmtp"
            name="eMailAddressSmtp"
            value={inputBar.eMailAddressSmtp || eMailAddressSmtp}
            onChange={handleChange}
            placeholder="Company Email Address SMTP"
            style={barStyl}
          />
        </div>
        </div>

        <div style={inputDivStyl}>

        <div>
          <label htmlFor="passwordSMTP" style={labelStyl}>
            Enter Company Email Password SMTP
          </label>
          <input
            type="text"
            id="passwordSMTP"
            name="passwordSMTP"
            value={inputBar.passwordSMTP || passwordSMTP}
            onChange={handleChange}
            placeholder="Company Email Password SMTP"
            style={barStyl}
          />
        </div>
        </div>

        <button 
        onClick={submitCompDet}
         value="submit"
          style={BtnStyl} 
          >Submit
        </button>
        
        
    </div>
  );
};

export default CompDetails;
