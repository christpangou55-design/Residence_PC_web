import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Star, MapPin, Wifi, Wind } from 'lucide-react';
import api from '../api';

const API_BASE = 'http://10.19.114.201:8000';

const getImageUrl = (chemin) => {
    if (!chemin) return null;
    if (chemin.startsWith('http')) return chemin;
    return `${API_BASE}/storage/${chemin}`;
};

const LogementDetails = () => {
    const { id } = useParams();
    const [logement, setLogement] = useState(null);
    const [loading, setLoading] = useState(true);

    const [dates, setDates] = useState({ date_arrivee: '', date_depart: '', nb_personnes: 1 });
    const [checkResult, setCheckResult] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { user } = useOutletContext();

    useEffect(() => {
        api.get(`/logements/${id}`)
            .then(res => setLogement(res.data.data || res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleCheckAvailability = async () => {
        if (!dates.date_arrivee || !dates.date_depart) {
            setError('Veuillez sélectionner les dates.');
            return;
        }
        setCheckLoading(true);
        setError('');
        try {
            const res = await api.post(`/logements/${id}/check`, dates);
            setCheckResult(res.data);
        } catch (err) {
            setError('Erreur lors de la vérification.');
        } finally {
            setCheckLoading(false);
        }
    };

    const handleReservation = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setCheckLoading(true);
        try {
            const res = await api.post('/reservations', {
                logement_id: id,
                ...dates
            });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (err) {
            setError('Erreur lors de la réservation.');
            setCheckLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    if (!logement) return <div className="text-center py-20 font-bold">Logement introuvable</div>;

    const photos = logement.photos || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
                <div>
                    <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-colors mb-6 group">
                        <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à la collection
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 mb-4 leading-none">{logement.titre}</h1>
                    <div className="flex items-center space-x-6 text-xs font-black uppercase tracking-widest">
                        <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-2 text-gray-900 font-black">4.9 <span className="text-gray-400 ml-1">· 12 Avis</span></span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-primary opacity-60" />
                            <span className="text-gray-900">Thiais, France</span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="p-3 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50 transition-colors shadow-sm"><Wind className="w-5 h-5 text-gray-400" /></button>
                    <button className="p-3 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50 transition-colors shadow-sm"><Wifi className="w-5 h-5 text-gray-400" /></button>
                </div>
            </div>

            {/* Photo Grid - Premium Layout */}
            <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px] mb-16 rounded-[48px] overflow-hidden shadow-2xl border border-gray-100">
                <div className="col-span-8 row-span-2 group relative overflow-hidden">
                    {photos[0] ? (
                        <img 
                            src={getImageUrl(photos[0].chemin)} 
                            className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" 
                            alt="Main" 
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-gray-300">Aperçu indisponible</div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="col-span-4 row-span-1 group relative overflow-hidden border-l border-white/20">
                    {photos[1] ? (
                        <img src={getImageUrl(photos[1].chemin)} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="P2" />
                    ) : (
                        <div className="w-full h-full bg-slate-100"></div>
                    )}
                </div>
                <div className="col-span-2 row-span-1 group relative overflow-hidden border-t border-white/20">
                    {photos[2] ? (
                        <img src={getImageUrl(photos[2].chemin)} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="P3" />
                    ) : (
                        <div className="w-full h-full bg-slate-200"></div>
                    )}
                </div>
                <div className="col-span-2 row-span-1 group relative overflow-hidden border-l border-t border-white/20">
                    {photos[3] ? (
                        <img src={getImageUrl(photos[3].chemin)} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="P4" />
                    ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <Star className="text-primary/20 w-8 h-8" />
                        </div>
                    )}
                    <button className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <span className="text-2xl font-black tracking-tighter leading-none">+ {photos.length > 4 ? photos.length - 4 : 0}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1">Photos</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                {/* Content */}
                <div className="lg:col-span-2 space-y-16">
                    <section>
                        <div className="flex justify-between items-start pb-10 border-b border-gray-100">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-4">Une expérience signée Résidence PC</h2>
                                <div className="flex flex-wrap gap-3">
                                    <span className="bg-slate-50 text-gray-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100">{logement.capacite} Voyageurs</span>
                                    <span className="bg-slate-50 text-gray-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100">2 Chambres</span>
                                    <span className="bg-slate-50 text-gray-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100">Luxe & Design</span>
                                </div>
                            </div>
                            <div className="w-16 h-16 bg-primary/5 rounded-[24px] flex items-center justify-center border border-primary/10 shadow-inner">
                                <Users className="text-primary w-7 h-7 opacity-70" />
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group bg-blue-50/50 p-8 rounded-[32px] border border-blue-100/50 transition-all hover:shadow-xl hover:shadow-blue-900/5">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Wifi className="text-primary w-6 h-6" /></div>
                            <h3 className="text-xl font-black tracking-tight mb-2">Connectivité totale</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">Fibre optique ultra-débit pour vos moments de divertissement ou de travail.</p>
                        </div>
                        <div className="group bg-slate-50 p-8 rounded-[32px] border border-gray-100 transition-all hover:shadow-xl hover:shadow-slate-900/5">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Wind className="text-primary w-6 h-6" /></div>
                            <h3 className="text-xl font-black tracking-tight mb-2">Confort thermique</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">Système de climatisation réversible intelligent de dernière génération.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-black mb-8 tracking-tighter text-gray-900">Le Mot de l'Hôte</h2>
                        <div className="text-gray-400 leading-relaxed text-xl font-medium whitespace-pre-line border-l-4 border-primary/20 pl-8">
                            {logement.description || "Découvrez une oasis de sérénité au design épuré. Chaque recoin de ce logement a été pensé pour offrir une expérience de séjour inégalée, mêlant haut de gamme et confort absolu."}
                        </div>
                    </section>
                </div>

                {/* Booking Card - Ultra Premium */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 bg-white border border-gray-100 rounded-[48px] p-10 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-baseline mb-12">
                            <div className="flex items-baseline">
                                <span className="text-5xl font-black tracking-tighter text-gray-900">{Math.round(logement.prix_nuit)}€</span>
                                <span className="text-gray-400 ml-2 text-sm font-black uppercase tracking-widest opacity-60">/ Nuit</span>
                            </div>
                            <div className="px-3 py-1 bg-primary/5 rounded-lg">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest underline cursor-pointer">12 Avis</span>
                            </div>
                        </div>

                        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100 animate-pulse">{error}</div>}

                        <div className="bg-slate-50 border border-gray-100 rounded-[32px] mb-8 overflow-hidden group focus-within:border-primary/20 transition-colors">
                            <div className="flex border-b border-gray-100">
                                <div className="flex-1 p-5 border-r border-gray-100">
                                    <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Arrivée</label>
                                    <input 
                                        type="date"
                                        className="w-full border-none p-0 focus:ring-0 font-black text-sm bg-transparent"
                                        value={dates.date_arrivee}
                                        onChange={(e) => { setDates({...dates, date_arrivee: e.target.value}); setCheckResult(null); }}
                                    />
                                </div>
                                <div className="flex-1 p-5">
                                    <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Départ</label>
                                    <input 
                                        type="date"
                                        className="w-full border-none p-0 focus:ring-0 font-black text-sm bg-transparent"
                                        value={dates.date_depart}
                                        onChange={(e) => { setDates({...dates, date_depart: e.target.value}); setCheckResult(null); }}
                                    />
                                </div>
                            </div>
                            <div className="p-5">
                                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Capacité de séjour</label>
                                <select 
                                    className="w-full border-none p-0 focus:ring-0 font-black text-sm bg-transparent appearance-none"
                                    value={dates.nb_personnes}
                                    onChange={(e) => setDates({...dates, nb_personnes: parseInt(e.target.value)})}
                                >
                                    {[...Array(logement.capacite)].map((_, i) => (
                                        <option key={i} value={i+1}>{i+1} {i+1 > 1 ? 'Voyageurs' : 'Voyageur'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!checkResult?.disponible ? (
                            <button 
                                onClick={handleCheckAvailability}
                                disabled={checkLoading}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[32px] font-black text-lg transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 uppercase tracking-tighter"
                            >
                                {checkLoading ? 'Vérification...' : 'Vérifier l\'Exception'}
                            </button>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div className="space-y-4 py-6 px-1">
                                    <div className="flex justify-between text-gray-400 font-bold text-sm">
                                        <span className="underline decoration-dotted underline-offset-4">{Math.round(logement.prix_nuit)}€ × {checkResult.nuits} nuits</span>
                                        <span className="text-gray-900 font-black">{Math.round(logement.prix_nuit * checkResult.nuits)}€</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold text-sm">
                                        <span className="underline decoration-dotted underline-offset-4">Frais de Conciergerie</span>
                                        <span className="text-gray-900 font-black">25€</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 flex justify-between font-black text-2xl tracking-tighter">
                                        <span>Total Net</span>
                                        <span className="text-primary">{Math.round(checkResult.prix_total + 25)}€</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleReservation}
                                    className="w-full bg-primary hover:bg-primary-dark text-white py-7 rounded-[32px] font-black text-xl transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 uppercase tracking-tighter"
                                >
                                    Confirmer le Séjour
                                </button>
                                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-center space-x-3">
                                    <Star className="w-4 h-4 text-primary fill-primary animate-pulse" />
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Garantie Premium Résidence PC</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogementDetails;
