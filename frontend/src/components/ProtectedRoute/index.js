import {Outlet, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Navigate to="/login"/>
  }
  return <Outlet />
}
export default ProtectedRoute
