import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Home, Building2 } from 'lucide-react';
import api from '../../api';

const MyLogements = () => {
    const { user } = useOutletContext();
    const [logements, setLogements] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user || (user.role !== 'vendeur' && user.role !== 'admin')) {
        return <Navigate to="/" replace />;
    }

    const fetchLogements = () => {
        api.get('/vendeur/logements')
            .then(res => setLogements(res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLogements();
    }, []);

    const handleDelete = (id) => {
        if(window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
            api.delete(`/logements/${id}`)
                .then(() => fetchLogements())
                .catch(() => alert("Erreur lors de la suppression."));
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Building2 className="w-12 h-12 text-primary/20 mb-4" />
            <div className="text-sm text-primary/40 font-black uppercase tracking-widest">Chargement de vos annonces...</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-primary mb-2">Mes Annonces</h1>
                    <p className="text-gray-500 font-medium">Gérez vos résidences et suivez leurs disponibilités.</p>
                </div>
                <Link to="/vendeur/logements/create" className="group flex items-center bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
                    <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-black uppercase tracking-widest text-xs">Publier une annonce</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {logements.map(l => (
                    <div key={l.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                        <div className="relative h-64 overflow-hidden">
                            {l.photos && l.photos.length > 0 ? (
                                <img 
                                    src={`${api.defaults.baseURL.replace('/api', '')}/storage/${l.photos[0].chemin}`} 
                                    alt={l.titre} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                    <Home className="w-12 h-12 text-gray-200" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-white shadow-xl">
                                <span className="text-sm font-black text-primary">{l.prix_nuit}€</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase ml-1">/ nuit</span>
                            </div>
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                    l.statut === 'disponible' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {l.statut}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-8 flex-grow">
                            <h3 className="text-xl font-black text-primary tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{l.titre}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                                {l.description || "Aucune description fournie."}
                            </p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <div className="flex items-center text-gray-400">
                                    <span className="text-xs font-bold uppercase tracking-tighter">Capacité: {l.capacite} pers.</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link 
                                        to={`/vendeur/logements/${l.id}/edit`} 
                                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(l.id)} 
                                        className="p-3 bg-gray-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {logements.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-primary tracking-tight mb-2">Aucune annonce pour le moment</h3>
                        <p className="text-gray-500 font-medium mb-8">Commencez à gagner de l'argent en publiant votre première résidence.</p>
                        <Link to="/vendeur/logements/create" className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
                            <Plus className="w-5 h-5 mr-3" />
                            <span className="font-black uppercase tracking-widest text-xs">Créer ma première annonce</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLogements;
