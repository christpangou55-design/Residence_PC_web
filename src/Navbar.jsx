import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home as HomeIcon, LayoutGrid, ConciergeBell, Phone, Bell, Settings } from 'lucide-react';
import api from './api';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        if (user) {
            api.get('/notifications/unread-count')
                .then(res => setUnreadCount(res.data.unread_count))
                .catch(err => console.error('Error fetching unread count:', err));
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_-15px_rgba(0,86,164,0.3)]">
            <div className="w-full px-4 sm:px-8 lg:px-10 xl:px-16 2xl:px-20">
                <div className="flex justify-between h-24">
                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-white p-2 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <span className="text-primary text-2xl font-black italic">PC</span>
                            </div>
                            <div className="ml-4 flex flex-col">
                                <span className="text-white text-2xl font-black tracking-tighter leading-none">Résidence PC</span>
                                <span className="text-white/50 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Collections de luxe</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden xl:flex items-center justify-center flex-1 min-w-0 px-4 space-x-4 2xl:space-x-8">
                        <NavLink to="/" icon={<HomeIcon size={16} />} label="Accueil" />
                        <NavLink to="/residences" icon={<LayoutGrid size={16} />} label="Résidences" />
                        <NavLink to="/services" icon={<ConciergeBell size={16} />} label="Services" />
                        <NavLink to="/contact" icon={<Phone size={16} />} label="Contact" />
                    </div>

                    <div className="flex items-center space-x-4 flex-shrink-0">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-xs font-black text-white/70 hover:text-white tracking-[0.2em] transition uppercase">
                                    Connexion
                                </Link>
                                <Link to="/register" className="text-xs font-black bg-white text-primary px-8 py-3.5 rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-white/10 uppercase tracking-widest">
                                    S'inscrire
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 2xl:space-x-4 bg-white/5 p-1.5 pr-2 2xl:pr-4 rounded-2xl border border-white/10">
                                <div className="flex items-center space-x-2 2xl:space-x-3">
                                    <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-xl bg-gradient-to-tr from-white/20 to-white/5 flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
                                        {user.profile_photo_url ? (
                                            <img src={user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm 2xl:text-base text-white font-black">{user.nom.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs 2xl:text-sm font-black text-white leading-none whitespace-nowrap">
                                            {user.nom}
                                        </span>
                                        <span className="hidden 2xl:block text-[10px] font-bold text-white/50 uppercase tracking-tighter mt-1">
                                            Membre Privilège
                                        </span>
                                    </div>
                                </div>
                                 <div className="h-6 2xl:h-8 w-px bg-white/10 mx-1 2xl:mx-2"></div>
                                 <div className="flex items-center space-x-1 2xl:space-x-3">
                                     <Link to="/notifications" className="p-1.5 2xl:p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition duration-300 relative">
                                        <Bell className="w-4 h-4 2xl:w-5 2xl:h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-primary-dark"></span>
                                        )}
                                     </Link>
                                     <Link to="/settings" className="p-1.5 2xl:p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition duration-300">
                                        <Settings className="w-4 h-4 2xl:w-5 2xl:h-5" />
                                     </Link>
                                     <Link to="/help" className="hidden 2xl:block p-1.5 2xl:p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition duration-300">
                                        <Phone className="w-4 h-4 2xl:w-5 2xl:h-5" />
                                     </Link>
                                     <div className="h-4 2xl:h-6 w-px bg-white/10 mx-0.5 2xl:mx-1"></div>
                                     {user.role === 'admin' && (
                                         <Link to="/admin/logements" className="text-[9px] 2xl:text-[10px] font-black text-white px-2 py-1 2xl:px-3 2xl:py-1.5 bg-primary-dark rounded-lg hover:bg-primary transition uppercase tracking-widest border border-white/10 whitespace-nowrap">
                                             Admin
                                         </Link>
                                     )}
                                     {user.role === 'vendeur' && (
                                         <Link to="/vendeur/logements" className="text-[9px] 2xl:text-[10px] font-black text-white px-2 py-1 2xl:px-3 2xl:py-1.5 bg-primary-dark rounded-lg hover:bg-primary transition uppercase tracking-widest border border-white/10 whitespace-nowrap">
                                             Mes Annonces
                                         </Link>
                                     )}
                                     {user.role === 'client' && (
                                         <Link to="/dashboard" className="text-[9px] 2xl:text-[10px] font-black text-white px-2 py-1 2xl:px-3 2xl:py-1.5 bg-primary-dark rounded-lg hover:bg-primary transition uppercase tracking-widest border border-white/10 whitespace-nowrap">
                                             Mon Espace
                                         </Link>
                                     )}
                                     <button onClick={handleLogout} className="p-1.5 2xl:p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition duration-300">
                                         <LogOut className="w-4 h-4 2xl:w-5 2xl:h-5" />
                                     </button>
                                 </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, label, icon }) => (
    <Link to={to} className="group relative flex items-center space-x-2 py-2">
        <span className="text-white/40 group-hover:text-white transition-colors duration-300">{icon}</span>
        <span className="text-sm font-black text-white/60 group-hover:text-white uppercase tracking-widest transition-colors duration-300">
            {label}
        </span>
        <span className="absolute -bottom-1 left-0 w-0 h-1 bg-white rounded-full transition-all duration-500 group-hover:w-full"></span>
    </Link>
);

export default Navbar;

