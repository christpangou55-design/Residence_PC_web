import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Star, MapPin, Wifi, Wind } from 'lucide-react';
import api, { BASE_URL } from '../api';

const getImageUrl = (chemin) => {
    if (!chemin) return null;
    if (chemin.startsWith('http')) return chemin;
    return `${BASE_URL}/storage/${chemin}`;
};

const LogementDetails = () => {
    const { id } = useParams();
    const [logement, setLogement] = useState(null);
    const [loading, setLoading] = useState(true);

    const [dates, setDates] = useState({ date_arrivee: '', date_depart: '', nb_personnes: 1 });
    const [checkResult, setCheckResult] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [error, setError] = useState('');

    const [avisData, setAvisData] = useState({ moyenne: 0, total: 0, avis: [] });
    const [newAvis, setNewAvis] = useState({ note: 5, commentaire: '' });
    const [avisError, setAvisError] = useState('');
    const [avisSuccess, setAvisSuccess] = useState('');
    const [submittingAvis, setSubmittingAvis] = useState(false);

    const navigate = useNavigate();
    const { user } = useOutletContext();

    useEffect(() => {
        api.get(`/logements/${id}`)
            .then(res => setLogement(res.data.data || res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        api.get(`/logements/${id}/avis`)
            .then(res => setAvisData(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleAvisSubmit = async (e) => {
        e.preventDefault();
        setAvisError('');
        setAvisSuccess('');
        setSubmittingAvis(true);
        try {
            const res = await api.post(`/logements/${id}/avis`, newAvis);
            setAvisSuccess(res.data.message);
            setNewAvis({ note: 5, commentaire: '' });
            // Rafraîchir les avis
            const avisRes = await api.get(`/logements/${id}/avis`);
            setAvisData(avisRes.data);
        } catch (err) {
            setAvisError(err.response?.data?.message || 'Erreur lors de la soumission de l\'avis.');
        } finally {
            setSubmittingAvis(false);
        }
    };

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
                            <span className="ml-2 text-gray-900 font-black">{avisData.total > 0 ? avisData.moyenne : 'Nouveau'} <span className="text-gray-400 ml-1">· {avisData.total} Avis</span></span>
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

                    <section className="pt-10 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black tracking-tighter text-gray-900">Avis Clients</h2>
                            <div className="flex items-center space-x-2 text-xl font-black">
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                <span>{avisData.total > 0 ? avisData.moyenne : 'Nouveau'}</span>
                                <span className="text-gray-400 text-sm font-medium">({avisData.total} avis)</span>
                            </div>
                        </div>

                        {/* Liste des avis */}
                        <div className="space-y-6 mb-12">
                            {avisData.avis.length === 0 ? (
                                <p className="text-gray-400 font-medium italic">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>
                            ) : (
                                avisData.avis.map(avis => (
                                    <div key={avis.id} className="bg-slate-50 p-6 rounded-3xl border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden">
                                                    {avis.user.profile_photo_url ? (
                                                        <img src={avis.user.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        avis.user.nom.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{avis.user.nom}</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {new Date(avis.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < avis.note ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {avis.commentaire && (
                                            <p className="text-gray-600 leading-relaxed font-medium">"{avis.commentaire}"</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Formulaire d'avis (Visible uniquement si connecté) */}
                        {user ? (
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-black mb-6">Partagez votre expérience</h3>
                                {avisError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl border border-red-100">{avisError}</div>}
                                {avisSuccess && <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs font-black uppercase tracking-widest rounded-xl border border-green-100">{avisSuccess}</div>}
                                
                                <form onSubmit={handleAvisSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Votre note</label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setNewAvis({...newAvis, note: star})}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star className={`w-8 h-8 ${newAvis.note >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Votre commentaire</label>
                                        <textarea
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 resize-none h-32"
                                            placeholder="Comment s'est passé votre séjour ?"
                                            value={newAvis.commentaire}
                                            onChange={(e) => setNewAvis({...newAvis, commentaire: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={submittingAvis}
                                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-colors disabled:opacity-50"
                                    >
                                        {submittingAvis ? 'Publication...' : 'Publier mon avis'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-gray-100">
                                <p className="text-gray-500 font-medium text-sm">
                                    <Link to="/login" className="text-primary font-black hover:underline">Connectez-vous</Link> pour laisser un avis.
                                </p>
                            </div>
                        )}
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
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer">{avisData.total} Avis</span>
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
