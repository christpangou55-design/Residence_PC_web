import React from 'react';
import { Bell, CheckCircle, Info, Clock, ChevronRight } from 'lucide-react';

const Notifications = () => {
    const notifications = [
        {
            id: 1,
            title: 'Réservation confirmée',
            message: 'Votre séjour à la Villa des Alizés est confirmé pour le 12 Mai 2026.',
            time: 'Il y a 2 heures',
            type: 'success',
            icon: <CheckCircle className="text-green-500" size={24} />,
        },
        {
            id: 2,
            title: 'Offre Spéciale PC',
            message: 'Profitez de -20% sur votre prochaine réservation ce weekend avec le code PCVIP.',
            time: 'Il y a 5 heures',
            type: 'info',
            icon: <Info className="text-primary" size={24} />,
        },
        {
            id: 3,
            title: 'Rappel de Check-in',
            message: 'N\'oubliez pas de remplir vos informations de check-in avant votre arrivée.',
            time: 'Hier',
            type: 'warning',
            icon: <Clock className="text-orange-500" size={24} />,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black tracking-tighter text-gray-900 leading-none">Notifications</h1>
                    <p className="text-gray-400 mt-4 text-xl font-medium">Restez informé de vos activités Résidence PC.</p>
                </div>
                <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                    Tout marquer comme lu
                </button>
            </div>

            <div className="space-y-6">
                {notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex items-center group hover:border-primary/20 transition-all duration-300"
                    >
                        <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                            {notif.icon}
                        </div>
                        <div className="ml-8 flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">{notif.title}</h3>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.time}</span>
                            </div>
                            <p className="text-gray-500 font-medium">{notif.message}</p>
                        </div>
                        <button className="ml-8 p-4 text-gray-300 group-hover:text-primary transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <div className="inline-flex flex-col items-center">
                    <div className="bg-slate-50 p-10 rounded-full mb-6">
                        <Bell size={40} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">Vous êtes à jour</p>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
