import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import api from './api';

const Layout = () => {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoadingAuth(false));
        } else {
            setLoadingAuth(false);
        }
    }, []);

    if (loadingAuth) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
            <Navbar user={user} setUser={setUser} />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
                <Outlet context={{ user, setUser }} />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
