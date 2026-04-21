import React from 'react';
import { ConciergeBell, Car, ShieldCheck, Waves, Coffee, Utensils } from 'lucide-react';

const Services = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-24">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Excellence PC</span>
                <h1 className="text-7xl font-black tracking-tighter text-gray-900 mt-4">Services <span className="text-primary italic">Privilège</span></h1>
                <p className="text-gray-400 mt-8 text-xl max-w-2xl mx-auto font-medium">Votre séjour ne se limite pas à un hébergement. Découvrez l'expérience complète Résidence PC.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <ServiceCard 
                    icon={<ConciergeBell size={40} className="text-primary" />}
                    title="Conciergerie Dédiée"
                    desc="Un assistant personnel disponible 24/7 pour organiser vos réservations, sorties et demandes particulières."
                />
                <ServiceCard 
                    icon={<Car size={40} className="text-primary" />}
                    title="Transport de Luxe"
                    desc="Transferts aéroport ou mise à disposition de chauffeurs privés et véhicules de prestige."
                />
                <ServiceCard 
                    icon={<ShieldCheck size={40} className="text-primary" />}
                    title="Sécurité & Sérénité"
                    desc="Une protection discrète et totale de vos biens et de votre vie privée durant tout votre séjour."
                />
                <ServiceCard 
                    icon={<Waves size={40} className="text-primary" />}
                    title="Bien-être & Spa"
                    desc="Massages à domicile, soins personnalisés et accès exclusif aux meilleurs centres de détente."
                />
                <ServiceCard 
                    icon={<Utensils size={40} className="text-primary" />}
                    title="Chef à Domicile"
                    desc="Une expérience gastronomique sur mesure concoctée par des chefs étoilés dans votre cuisine."
                />
                <ServiceCard 
                    icon={<Coffee size={40} className="text-primary" />}
                    title="Petit-Déjeuner"
                    desc="Produits frais et locaux livrés chaque matin à votre porte pour un réveil d'exception."
                />
            </div>

            <div className="mt-32 bg-slate-900 rounded-[80px] p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full -mr-20 -mt-20"></div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-8 relative z-10">Prêt pour l'expérience <span className="text-primary italic">PC</span> ?</h2>
                <button className="bg-white text-primary px-16 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:scale-110 transition-all shadow-2xl relative z-10">
                    Nous Contacter
                </button>
            </div>
        </div>
    );
};

const ServiceCard = ({ icon, title, desc }) => (
    <div className="bg-white p-12 rounded-[50px] shadow-xl border border-gray-50 hover:shadow-primary/10 transition-all duration-500 group">
        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default Services;
