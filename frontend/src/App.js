import {Route, Routes, BrowserRouter,Navigate} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import NotFound from './components/NotFound'
import MoneyManager from './components/MoneyManager'
import './App.css'

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MoneyManager/>}/>
            </Route>
            <Route path="/not-found" element={<NotFound/>} />
            <Route path="*" element={<Navigate to="/not-found" />}/>
        </Routes>
    </BrowserRouter>
)

export default App

