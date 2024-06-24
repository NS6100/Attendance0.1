import { useState } from "react";
import MainMenu from "./MainMenu.js";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



function MainInput() {
  const [inBtnPressed, setInBtnPressed] = useState(false);
  const [outBtnPressed, setOutBtnPressed] = useState(false);
  const [inputBar, setText] = useState({
    iDBar: "",
    passBar: ""
  });
  
  const [isIdValid, setIdValid]= useState(false);
  const [isPasswordValid,setPasswordValid] = useState(false);
  const navigate = useNavigate();
  const [passwordLength , setPasswordLength]=useState(-1);
  const [userDetails , setUserDetails] = useState({
    permission: "",
    userID: "",
  });

  const formStyl = {
    backgroundColor: '#ffffff',
  backgroundImage: 'radial-gradient(#9098c0 2px, #ffffff 2px)',
  backgroundSize: '40px 40px',
};


  const barStyl = {
    width: "40%",
    padding: "20px 10px",
    boxSizing: "border-box",
    border: "2px solid",
    borderRadius: "8px",
    fontSize: "24px",
    margin: "20px"
  };

  const divStyl = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: "60px",
    height: "250px"
  };

  const BtndivStyl = {
    display: "flex",
    justifyContent: "space-evenly",
    marginTop: "10px",
    marginBottom:"100px"
  };

  const OutBtnStyl = {
    display: "flex",
    justifyContent: "space-between",
    height: "70px",
    width: "180px",
    fontSize: "50px",
    borderRadius: "12px",
    cursor: isPasswordValid ? 'pointer' : 'not-allowed' ,
    backgroundColor: outBtnPressed ? "rgb(199, 0, 57)" : "rgb(255, 128, 128)",
    border: "3px solid black",
    transition: "background-color 0.2s, box-shadow 0.2s",

  };

  const InBtnStyl = {
    ...OutBtnStyl,
    backgroundColor: inBtnPressed ? "rgb(85, 124, 85)" : "rgb(205, 250, 213)"
  };


  async function handelChange(event) {
    const { value, name } = event.target;
    if (name === "iDBar") {
      setText((prevInputBar) => ({ ...prevInputBar, [name]: value }));
      if (value.length === 9) {
        try {
          const response = await axios.post('/mainInputIdValid', { iDValue: value });
          console.log('Server response:', response.data);
          setPasswordLength(response.data.passwordLength);
          setIdValid(response.data.isIdValid);
          if (!response.data.isIdValid) {
            alert("Wrong I.D");
            setText((prevInputBar) => ({ ...prevInputBar, iDBar: "" }));
            navigate.push('/');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        
        setIdValid(false);
        setPasswordValid(false); 
      } 
    }
 
    if (name === "passBar") {
      setText((prevInputBar) => ({ ...prevInputBar, [name]: value }));
      if (value.length === passwordLength) {
        try {
          const InputValid = {
            passBar: value,
            iDBar: inputBar.iDBar
          };
          const response = await axios.post('/mainInputPasswordValid', { InputValid });
          console.log('Server response:', response.data);
          setPasswordValid(response.data.isPasswordValid);
          console.log(response.data.isPasswordValid);
          setUserDetails({
            permission: response.data.permission,
            userID: InputValid.iDBar
          });
          console.log('userDetails:', userDetails);
          if (!response.data.isPasswordValid) {
            alert("Wrong password");
            setText((prevInputBar) => ({ ...prevInputBar, iDBar: "" }));
            setText((prevInputBar) => ({ ...prevInputBar, passBar: "" }));
            navigate.push('/');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  }
  

  function handelClick(isInBtn) {    
    if (isInBtn) {
      setInBtnPressed(true);
      setTimeout(() => {
        setInBtnPressed(false);
      }, 2500);
      const currentDate = new Date();
      const attendanceSignature = {
        iDBar: inputBar.iDBar,
        date: currentDate.toLocaleDateString('en-GB'),
        time: currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        action: "IN",  
      };    
      axios.put('/signAttendance', { attendanceSignature })
        .then(response => {
          console.log('Server response:', response.data);
        })
        .catch(error => {
          console.log('Error:', error);
        });
      alert('Welcome');
      navigate.push('/');
    } else {
      setOutBtnPressed(true);
      setTimeout(() => {
        setOutBtnPressed(false);
      }, 2500);
      const currentDate = new Date();
      const attendanceSignature = {
        iDBar: inputBar.iDBar,
        date: currentDate.toLocaleDateString('en-GB'),
        time: currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        action: "OUT", 
      };
      axios.put('/signAttendance', { attendanceSignature })
        .then(response => {
          console.log('Server response:', response.data);
        })
        .catch(error => {
          console.log('Error:', error);
        });
      alert('Good Bay');
      navigate.push('/');
    }
  }
  return (
    <form style={formStyl}>
      <MainMenu userDetails={userDetails} />
      <div style={divStyl}>
        <h1>Welcome</h1>
        <input
          name="iDBar"
          onChange={handelChange}
          type="text"
          value={inputBar.iDBar}
          placeholder="ID"
          required
          autoFocus
          style={barStyl}
        />
        <input
          name="passBar"
          onChange={handelChange}
          type="text"  
          value={inputBar.passBar}
          placeholder="Password"
          required
          style={barStyl}
          disabled={!isIdValid}
        />
      </div>

      <div style={BtndivStyl}>
        <button
          onClick={() => handelClick(true)}
          value="IN"
          style={InBtnStyl}
          disabled={!isPasswordValid} 
        >
          IN
          <img
            src="https://cdn-icons-png.flaticon.com/512/8677/8677615.png"
            alt=""
            style={{ backgroundColor: "rgb(205, 250, 213)", borderRadius: "12px" ,width:'60px'}}
          />
        </button>
        <button
          onClick={() => handelClick(false)}
          style={OutBtnStyl}
          disabled={!isPasswordValid} 
          value="OUT"
        >
          OUT
          <img
            src="https://freesvg.org/img/export_1.png"
            alt=""
            style={{ backgroundColor: "rgb(255, 128, 128)", borderRadius: "12px" ,width:'60px' }}
          />
        </button>
        
      </div>
      <Link 
      to='/ResetEmployPassword' 
      title="Forgat Password"
      style={{fontSize:"20px", display:"flex" , justifyContent:"center"}}
      >Forgat Password
      </Link>
    </form>
  );
}

export default MainInput;
