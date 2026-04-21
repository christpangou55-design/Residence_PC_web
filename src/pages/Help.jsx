import React from 'react';
import { Search, HelpCircle, MessageSquare, Phone, Mail, ChevronRight } from 'lucide-react';

const Help = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-24">
            <div className="text-center mb-24">
                <h1 className="text-7xl font-black tracking-tighter text-gray-900 leading-none mb-8">Comment <br/><span className="text-primary italic">pouvons-nous vous aider ?</span></h1>
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="bg-white p-2 rounded-[35px] shadow-2xl border border-gray-100 flex items-center relative z-10">
                        <div className="flex-1 flex items-center px-8 py-4">
                            <Search className="text-gray-400 w-6 h-6" />
                            <input type="text" placeholder="Rechercher une réponse..." className="bg-transparent border-none focus:ring-0 ml-4 w-full font-black text-lg placeholder:text-gray-300" />
                        </div>
                        <button className="bg-primary text-white px-12 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                            Rechercher
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                <div className="space-y-4">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 border-b border-gray-100 pb-4">Sujets Populaires</h2>
                    <FAQItem title="Comment effectuer une réservation ?" />
                    <FAQItem title="Politique d'annulation et remboursements" />
                    <FAQItem title="Garanties et Assurances Résidence PC" />
                    <FAQItem title="Gestion de mon compte membre" />
                </div>
                <div className="space-y-8">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 border-b border-gray-100 pb-4">Nous Contacter</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <ContactMethod icon={<MessageSquare />} label="Chat Live" detail="Temps de réponse: < 2 min" />
                        <ContactMethod icon={<Phone />} label="Appel Prioritaire" detail="+33 (0)1 23 45 67 89" />
                        <ContactMethod icon={<Mail />} label="Support Email" detail="support@residence-pc.com" />
                    </div>
                </div>
            </div>

            <div className="bg-primary p-16 rounded-[70px] flex flex-col md:flex-row items-center justify-between shadow-[0_40px_80px_-15px_rgba(0,86,164,0.3)]">
                <div className="flex items-center space-x-8 mb-8 md:mb-0">
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                        <HelpCircle className="text-white" size={40} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter">Guide de Bienvenue PC</h3>
                        <p className="text-white/60 font-bold uppercase tracking-widest text-xs mt-1">Découvrez tout sur l'expérience de luxe</p>
                    </div>
                </div>
                <button className="bg-white text-primary px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:scale-110 transition-all shadow-xl">
                    Consulter le guide
                </button>
            </div>
        </div>
    );
};

const FAQItem = ({ title }) => (
    <button className="w-full flex items-center justify-between p-8 bg-white rounded-[35px] border border-transparent hover:border-primary/20 hover:shadow-xl transition-all group">
        <span className="text-lg font-black text-gray-900 tracking-tight">{title}</span>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
    </button>
);

const ContactMethod = ({ icon, label, detail }) => (
    <div className="flex items-center p-8 bg-slate-50 rounded-[35px] border border-gray-100">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 text-primary">
            {icon}
        </div>
        <div className="ml-8">
            <h4 className="text-sm font-black text-gray-900 tracking-tight">{label}</h4>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter mt-1">{detail}</p>
        </div>
    </div>
);

export default Help;
