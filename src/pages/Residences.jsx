import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, MapPin, Search as SearchIcon, SlidersHorizontal, ArrowRight } from 'lucide-react';
import api from '../api';

const Residences = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';

    const [logements, setLogements] = useState([]);
    const [filteredLogements, setFilteredLogements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        api.get('/logements')
            .then(res => {
                const data = res.data.data || res.data;
                setLogements(data);
                setFilteredLogements(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = logements.filter(l => 
            l.titre.toLowerCase().includes(query) || 
            (l.description && l.description.toLowerCase().includes(query))
        );
        setFilteredLogements(filtered);
    }, [searchQuery, logements]);

    const getImageUrl = (chemin) => {
        if (!chemin) return null;
        if (chemin.startsWith('http')) return chemin;
        return `/storage/${chemin}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
            {/* Premium Header */}
            <div className="mb-20">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="h-1.5 w-12 bg-primary rounded-full"></div>
                    <span className="text-xs font-black tracking-[0.3em] uppercase text-primary">Collection Exclusive</span>
                </div>
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[0.85]">
                    Découvrez <br/><span className="text-primary italic">L'Incomparable</span>
                </h1>
                <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
                    Parcourez notre catalogue de propriétés d'exception, rigoureusement sélectionnées pour leur caractère unique et leur standing.
                </p>
            </div>

            {/* Premium Filters Bar */}
            <div className="bg-white p-2 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2 mb-20 focus-within:ring-2 ring-primary/10 transition-all">
                <div className="flex-1 flex items-center bg-slate-50/50 px-8 py-5 rounded-[30px] border border-slate-50">
                    <SearchIcon className="text-primary w-5 h-5 opacity-40" />
                    <input 
                        type="text" 
                        placeholder="Rechercher une destination, un style..." 
                        className="bg-transparent border-none focus:ring-0 ml-4 w-full font-bold text-slate-900 placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center p-2 gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center space-x-3 bg-white px-8 py-5 rounded-[28px] border border-slate-100 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        <span>Filtres Avancés</span>
                    </button>
                    <button className="flex-1 md:flex-none bg-primary text-white px-12 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                        Rechercher
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {filteredLogements.length > 0 ? filteredLogements.map((logement) => (
                        <Link key={logement.id} to={`/logements/${logement.id}`} className="group block">
                            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden mb-8 shadow-2xl border border-slate-50 group-hover:shadow-primary/20 transition-all duration-700">
                                {logement.photos?.[0] ? (
                                    <img src={getImageUrl(logement.photos[0].chemin)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out" alt={logement.titre} />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <Star className="text-slate-200 w-16 h-16" />
                                    </div>
                                )}
                                
                                <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center border border-white">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                        <span className="ml-2 text-xs font-black text-slate-900 tracking-tighter">4.9</span>
                                    </div>
                                    <div className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8">
                                    <div className="bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 shadow-xl">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Haut de Gamme</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 flex justify-between items-start">
                                <div className="space-y-2 flex-1 mr-4">
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
                    )) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-300 text-3xl font-black tracking-tighter">Aucune résidence ne correspond à votre recherche</p>
                        </div>
                    )}
                </div>
            )}
            
            {/* Call to action */}
            <div className="mt-40 bg-slate-900 rounded-[80px] p-20 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700"></div>
                <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-none">Vous souhaitez <span className="text-primary italic">davantage</span> ?</h2>
                    <p className="text-slate-400 mb-12 text-lg max-w-xl mx-auto font-medium">Nos conseillers sont disponibles pour vous proposer des propriétés hors catalogue.</p>
                    <Link to="/contact" className="bg-white text-primary px-16 py-7 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:scale-110 transition-all shadow-2xl inline-block">
                        Nous Contacter
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Residences;
