import React, {  useEffect } from 'react';
import axios from 'axios';

function CompLogo({ logoUrl, setLogoUrl }) {
  const imgStyl = {
    width: '90px',
    height: '80px',
    marginTop: '10px',
    borderRadius: '50%',
  };

  useEffect(() => {
    axios.get('/getCompanyDetails')
      .then(response => {
        const companyDetail = response.data.company;
        setLogoUrl(companyDetail.logoLink);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [setLogoUrl]);

  return (
    <div className="workTitl">
      {logoUrl ? (
        <img src={logoUrl} alt="Company Logo" style={imgStyl} />
      ) : (
        <h3>Show logo</h3>
      )}
    </div>
  );
}

export default CompLogo;
