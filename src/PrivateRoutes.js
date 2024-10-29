import { Outlet, Navigate } from 'react-router-dom';
import { decoder64 } from './Components/Base64Encoder/Base64Encoder';
import { getToken }  from './Components/GetToken/GetToken';

const PrivateRoutes = () => {
  const token = getToken('token');

  console.log('Token before decoding:', token);

  if (!token) return <Navigate to="/" />;

  // Decode the Base64 token string
  const decodedToken = decoder64(token);
  console.log('Decoded token:', decodedToken); // Log the decoded token

  if (!decodedToken) {
    console.error('Invalid or corrupted token:', decodedToken);
    return <Navigate to="/" />;
  }

  // Parse the decoded token (since it's a JSON object encoded as a string)
  let parsedToken;
  try {
    parsedToken = JSON.parse(decodedToken);
  } catch (error) {
    console.error('Failed to parse token:', error);
    return <Navigate to="/" />;
  }

  console.log('Parsed Token:', parsedToken); // Log the parsed token

  // Check for role_id in the parsed token
  if (parsedToken.role_id === 2) {
    return <Outlet />;
  }else if(parsedToken.role_id === 3){
    console.log('Seller logged in, redirecting to seller dashboard');
    return <Outlet/>;
  }else{
    console.error('Access denied. User role is not authorized.', parsedToken.role_id);
    return <Navigate to="/" />;
  }
};

export default PrivateRoutes;
