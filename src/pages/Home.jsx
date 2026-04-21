 import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react';
import api from '../api';

const Home = () => {
    const [logements, setLogements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/residences?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/residences');
        }
    };

    useEffect(() => {
        api.get('/logements')
            .then(res => {
                setLogements(res.data.data || res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getImageUrl = (chemin) => {
        if (!chemin) return null;
        if (chemin.startsWith('http')) return chemin;
        return `http://10.19.114.201:8000/storage/${chemin}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <section className="relative h-[750px] -mt-20 flex items-center justify-center overflow-hidden rounded-b-[100px] shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                    className="absolute inset-0 w-full h-full object-cover scale-105 animate-subtle-zoom"
                    alt="Luxury Residence"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70"></div>
                
                <div className="relative z-10 text-center text-white max-w-5xl px-4">
                    <div className="flex justify-center mb-8">
                        <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-black tracking-[0.4em] uppercase border border-white/20 animate-fade-in">
                            <Star className="w-3 h-3 text-primary-light mr-2 fill-primary-light" />
                            Collection ExclusivePC
                        </span>
                    </div>
                    
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85] drop-shadow-2xl animate-slide-up">
                        Vivez <br/><span className="text-primary-light italic">l'extraordinaire</span>
                    </h1>
                    
                    <div className="bg-white/95 backdrop-blur-2xl p-2 rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-center max-w-4xl mx-auto border border-white/40 animate-slide-up-delayed">
                        <div className="flex-1 flex items-center px-8 py-6 rounded-3xl w-full group transition-all duration-300">
                            <Search className="text-primary w-5 h-5 opacity-70" />
                            <div className="ml-4 text-left flex-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Destination</label>
                                <input 
                                    type="text" 
                                    placeholder="Où souhaitez-vous séjourner ?" 
                                    className="bg-transparent border-none p-0 focus:ring-0 text-black font-black text-lg w-full placeholder:text-gray-300" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-gray-100"></div>
                        <div className="flex-1 flex items-center px-8 py-6 rounded-3xl w-full group transition-all duration-300">
                            <Calendar className="text-primary w-5 h-5 opacity-70" />
                            <div className="ml-4 text-left">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Dates</label>
                                <input type="text" placeholder="Ajouter des dates" className="bg-transparent border-none p-0 focus:ring-0 text-black font-black text-lg w-full placeholder:text-gray-300" />
                            </div>
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="bg-primary hover:bg-primary-dark text-white px-12 py-7 rounded-[32px] font-black text-xl transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 whitespace-nowrap w-full md:w-auto uppercase tracking-tighter mt-2 md:mt-0 flex items-center justify-center cursor-pointer"
                        >
                            Découvrir
                        </button>
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0">
                    <div className="max-w-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-1.5 w-12 bg-primary rounded-full"></div>
                            <span className="text-xs font-black tracking-[0.3em] uppercase text-primary">Le Nouveau Luxe</span>
                        </div>
                        <h2 className="text-6xl font-black tracking-tighter text-gray-900 leading-none">Nos Résidences</h2>
                        <p className="text-gray-400 mt-8 text-xl font-medium leading-relaxed">Une sélection minutieuse de propriétés où chaque détail a été conçu pour votre sérénité.</p>
                    </div>
                    <Link to="/residences" className="flex items-center space-x-4 bg-slate-50 px-8 py-5 rounded-3xl text-primary font-black hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm border border-gray-100">
                        <span className="tracking-tighter uppercase text-sm">Voir tout le catalogue</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {logements.map((logement) => (
                        <Link 
                            key={logement.id} 
                            to={`/logements/${logement.id}`} 
                            className="group block"
                        >
                            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden mb-8 shadow-2xl group-hover:shadow-primary/20 transition-all duration-700 border border-gray-100">
                                {logement.photos && logement.photos.length > 0 ? (
                                    <img 
                                        src={getImageUrl(logement.photos[0].chemin)}
                                        className="w-full h-full object-cover transition duration-[1500ms] ease-out group-hover:scale-110"
                                        alt={logement.titre}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-3">
                                        <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center shadow-inner">
                                            <Star className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <span className="text-xs font-bold tracking-[0.4em] uppercase opacity-60">Résidence PC</span>
                                    </div>
                                )}
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                {/* Floating Labels */}
                                <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white">
                                        <div className="flex items-center">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                            <span className="ml-2 text-xs font-black text-gray-900 tracking-tighter">4.9</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-300">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8">
                                    <div className="bg-primary/95 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-xl">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Suite Exceptionnelle</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-start px-6">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-[0.9] group-hover:text-primary transition-colors duration-300">{logement.titre}</h3>
                                    <div className="flex items-center text-gray-400 space-x-3">
                                        <MapPin className="w-4 h-4 text-primary opacity-50" />
                                        <p className="text-xs font-black uppercase tracking-widest">{logement.capacite} Voyageurs</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black text-primary tracking-tighter leading-none">{Math.round(logement.prix_nuit)}€</p>
                                    <p className="text-gray-400 text-[9px] uppercase font-black tracking-[0.1em] mt-2 opacity-60">net / nuit</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Signature Services section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 rounded-[80px] border border-gray-100">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none mb-6">L'Expérience <br/><span className="text-primary italic">Signature PC</span></h2>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto uppercase tracking-widest text-xs">Plus qu'un séjour, un style de vie privilégié.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ServiceCard 
                        title="Conciergerie Dédiée" 
                        desc="Un assistant personnel disponible 24/7 pour satisfaire toutes vos exigences."
                    />
                    <ServiceCard 
                        title="Assurance Sérénité" 
                        desc="Une protection complète pour vous et vos proches durant tout votre séjour."
                        isFeatured
                    />
                    <ServiceCard 
                        title="Mobilité Premium" 
                        desc="Transferts privés et locations de véhicules de prestige sur demande."
                    />
                </div>
            </section>

            {/* Call Action */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary p-20 rounded-[80px] text-center shadow-2xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-none">Prêt pour <br/>l'exceptionnel ?</h2>
                        <Link to="/register" className="bg-white text-primary px-16 py-7 rounded-[30px] font-black text-xs uppercase tracking-[0.3em] hover:scale-110 transition-all shadow-2xl inline-block">
                            Rejoindre le Club PC
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ServiceCard = ({ title, desc, isFeatured }) => (
    <div className={`p-12 rounded-[50px] border transition-all duration-500 hover:-translate-y-2 ${isFeatured ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/20' : 'bg-white border-gray-100 text-gray-900 shadow-sm'}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${isFeatured ? 'bg-white/20' : 'bg-primary/5'}`}>
            <Star className={`w-6 h-6 ${isFeatured ? 'text-white' : 'text-primary'}`} />
        </div>
        <h3 className="text-2xl font-black tracking-tighter mb-4">{title}</h3>
        <p className={`font-medium leading-relaxed ${isFeatured ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
    </div>
);

export default Home;

