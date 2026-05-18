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
import MyLogements from './pages/vendeur/MyLogements';
import VendeurLogementForm from './pages/vendeur/LogementForm';
import ClientDashboard from './pages/client/Dashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Residences from './pages/Residences';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Help from './pages/Help';

/**
 * Composant Racine de l'application Web.
 * Gère le routage vers les différentes pages via React Router.
 */
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 
                  * Toutes les routes sont enveloppées dans <Layout /> 
                  * qui contient la Barre de navigation et le Footer communs.
                */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="logements/:id" element={<LogementDetails />} />
                    
                    {/* Routes dédiées à l'administration */}
                    <Route path="admin/logements" element={<AdminLogements />} />
                    <Route path="admin/logements/create" element={<AdminLogementForm />} />
                    <Route path="admin/logements/:id/edit" element={<AdminLogementForm />} />

                    {/* Routes dédiées aux vendeurs */}
                    <Route path="vendeur/logements" element={<MyLogements />} />
                    <Route path="vendeur/logements/create" element={<VendeurLogementForm />} />
                    <Route path="vendeur/logements/:id/edit" element={<VendeurLogementForm />} />

                    {/* Dashboard Client */}
                    <Route path="dashboard" element={<ClientDashboard />} />
                    
                    {/* Routes de confirmation de paiement (Stripe) */}
                    <Route path="payment/success" element={<PaymentSuccess />} />
                    <Route path="payment/cancel" element={<PaymentCancel />} />
                    
                    {/* Autres pages du site */}
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

