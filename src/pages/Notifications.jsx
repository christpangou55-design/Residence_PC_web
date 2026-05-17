import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Info, Clock, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(notifications.map(notif => 
                notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
            ));
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(notifications.map(notif => ({ ...notif, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const getIcon = (type) => {
        if (type === 'reservation') return <CheckCircle className="text-green-500" size={24} />;
        if (type === 'info') return <Info className="text-primary" size={24} />;
        return <Bell className="text-slate-400" size={24} />;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    }

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 min-h-screen">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter text-gray-900 leading-none">Notifications</h1>
                    <p className="text-gray-400 mt-4 text-xl font-medium">Restez informé de vos activités Résidence PC.</p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-primary font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {notifications.length === 0 ? (
                    <div className="mt-20 text-center">
                        <div className="inline-flex flex-col items-center">
                            <div className="bg-slate-50 p-10 rounded-full mb-6">
                                <Bell size={40} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">Aucune notification</p>
                        </div>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`p-8 rounded-[40px] shadow-xl border flex items-center group transition-all duration-300 ${!notif.read_at ? 'bg-white border-primary/20' : 'bg-slate-50 border-gray-100 opacity-70'}`}
                        >
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border group-hover:scale-110 transition-transform ${!notif.read_at ? 'bg-primary/5 border-primary/10' : 'bg-white border-gray-100'}`}>
                                {getIcon(notif.data.type_notif || 'info')}
                            </div>
                            <div className="ml-8 flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{notif.data.titre}</h3>
                                        {!notif.read_at && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(notif.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-medium">{notif.data.message}</p>
                                {notif.data.logement_id && (
                                    <div className="mt-4">
                                        <Link 
                                            to={`/logements/${notif.data.logement_id}`} 
                                            className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors border border-primary/20"
                                        >
                                            <span>Voir le logement & Laisser un avis</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                            {!notif.read_at && (
                                <button onClick={() => markAsRead(notif.id)} className="ml-8 p-3 text-primary bg-primary/5 hover:bg-primary hover:text-white rounded-xl transition-colors" title="Marquer comme lu">
                                    <Check size={20} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
            
            {unreadCount === 0 && notifications.length > 0 && (
                <div className="mt-20 text-center animate-fade-in">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Vous êtes à jour</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
