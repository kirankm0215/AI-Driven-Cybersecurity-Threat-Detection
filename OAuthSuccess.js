import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Optionally, show a success alert or message here
      // Redirect to dashboard or home
      navigate('/dashboard');
    } else {
      // If no token was received, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white text-lg">
      Logging you in securely...
    </div>
  );
}

export default OAuthSuccess;
