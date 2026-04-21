import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LogementDetails from './pages/LogementDetails';
import Dashboard from './pages/admin/Dashboard';
import AdminLogements from './pages/admin/AdminLogements';
import AdminLogementForm from './pages/admin/AdminLogementForm';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Residences from './pages/Residences';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Help from './pages/Help';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="logements/:id" element={<LogementDetails />} />
                    
                    <Route path="admin/logements" element={<AdminLogements />} />
                    <Route path="admin/logements/create" element={<AdminLogementForm />} />
                    <Route path="admin/logements/:id/edit" element={<AdminLogementForm />} />
                    
                    <Route path="payment/success" element={<PaymentSuccess />} />
                    <Route path="payment/cancel" element={<PaymentCancel />} />
                    
                    <Route path="residences" element={<Residences />} />
                    <Route path="services" element={<Services />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

