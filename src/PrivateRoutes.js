import { Outlet, Navigate } from 'react-router-dom';

function getToken(str) {
  const array = document.cookie.split(';');

  for (let i = 0; i < array.length; i++) {
    let cookie = array[i].trim();
    if (cookie.startsWith(clgt)) {
      return cookie.substring(str.length);
    }
    return null;
  }
}

decode

const PrivateRoutes = () => {
  let auth = getToken('token');
  let a = decode(auth);
  return (
    a.role_id === 2 ? <Outlet /> : <Navigate to="/"/>
  )
}