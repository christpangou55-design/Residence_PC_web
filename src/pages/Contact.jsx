import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col lg:flex-row gap-24">
                <div className="lg:w-1/2">
                    <h1 className="text-7xl font-black tracking-tighter text-gray-900 mb-8">Contactez <span className="text-primary italic">L'Excellence</span></h1>
                    <p className="text-gray-400 text-xl font-medium mb-16 leading-relaxed">
                        Nos conseillers sont à votre disposition pour créer votre séjour sur mesure. Une demande particulière ? Un événement d'exception ? Nous sommes là.
                    </p>

                    <div className="space-y-12">
                        <ContactInfo 
                            icon={<Phone className="text-primary" size={24} />}
                            title="Téléphone"
                            value="+33 (0)1 23 45 67 89"
                            subtitle="Disponible 24/7 pour nos membres"
                        />
                        <ContactInfo 
                            icon={<Mail className="text-primary" size={24} />}
                            title="Email"
                            value="contact@residence-pc.com"
                            subtitle="Réponse sous 2 heures garanties"
                        />
                        <ContactInfo 
                            icon={<MapPin className="text-primary" size={24} />}
                            title="Siège Social"
                            value="12 Avenue des Champs-Élysées, 75008 Paris"
                            subtitle="Uniquement sur rendez-vous"
                        />
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="bg-white p-12 rounded-[60px] shadow-2xl border border-gray-50 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full"></div>
                        
                        <form className="space-y-8 relative z-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Prénom</label>
                                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Jean" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Nom</label>
                                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Dupont" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email</label>
                                <input type="email" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all" placeholder="jean.dupont@email.com" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Message</label>
                                <textarea className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all min-h-[150px]" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>
                            <button className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center space-x-4">
                                <span>Envoyer le message</span>
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactInfo = ({ icon, title, value, subtitle }) => (
    <div className="flex items-start">
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 mt-1">
            {icon}
        </div>
        <div className="ml-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">{title}</h3>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
            <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-tighter">{subtitle}</p>
        </div>
    </div>
);

export default Contact;
