import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    console.log("Google Se Raw Token Mil Gaya! 🎉");
    
    // 🔓 Token ko decode karke user ki details nikalna
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded Data:", decoded);

    try {
      // 🚀 Axios ke zariye backend API par data bhejna
      const response = await axios.post('https://my-mern-backend-sx7h.onrender.com/api/google-login', decoded);
      
      if (response.status === 200) {
        // Backend se response aane par user state set karna
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Backend par data bhejte waqt error aaya ❌", error);
    }
  };

  const handleError = () => {
    console.log('Login Fail Ho Gaya ❌');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>MERN Dynamic Google Login App 🚀</h1>
      <hr style={{ width: '50%', margin: '20px auto' }} />
      
      {!user ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      ) : (
        <div style={{ background: '#f0f0f0', padding: '20px', width: '300px', margin: '0 auto', borderRadius: '10px' }}>
          <img src={user.picture} alt="profile" style={{ borderRadius: '50%', width: '100px' }} />
          <h3 style={{ color: 'green' }}>Welcome, {user.name}! ✅</h3>
          <p>Email: {user.email}</p>
          <button onClick={() => setUser(null)} style={{ padding: '8px 15px', cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;