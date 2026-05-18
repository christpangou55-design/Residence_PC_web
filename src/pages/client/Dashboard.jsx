import React, { useState, useEffect } from 'react';
import { useOutletContext, Link, Navigate } from 'react-router-dom';
import { 
    Calendar, Clock, CheckCircle, XCircle, AlertCircle, 
    Heart, Star, CreditCard, Bell, MapPin, User, ChevronRight,
    Trash2, Edit3, Home
} from 'lucide-react';
import api, { BASE_URL } from '../../api';

const statusConfig = {
    confirmee:   { label: 'Confirmée',  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
    en_attente:  { label: 'En attente', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: AlertCircle },
    annulee:     { label: 'Annulée',    color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     icon: XCircle },
};

const TABS = ['Réservations', 'Favoris', 'Mes Avis', 'Paiements', 'Notifications'];

export default function ClientDashboard() {
    const { user } = useOutletContext();
    const [activeTab, setActiveTab] = useState('Réservations');
    const [reservations, setReservations] = useState([]);
    const [favoris, setFavoris] = useState({});
    const [avis, setAvis] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservationFilter, setReservationFilter] = useState('avenir'); // avenir | passes | en_attente
    const [editingAvis, setEditingAvis] = useState(null);
    const [editForm, setEditForm] = useState({ note: 5, commentaire: '' });

    useEffect(() => {
        if (!user) return;
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [resRes, favRes, avisRes, notifRes] = await Promise.all([
                    api.get('/reservations/mes'),
                    api.get('/client/favoris'),
                    api.get('/client/avis'),
                    api.get('/notifications'),
                ]);
                setReservations(resRes.data);
                setFavoris(favRes.data);
                setAvis(avisRes.data);
                setNotifications(notifRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    if (!user) return <Navigate to="/login" replace />;

    const resArray = Array.isArray(reservations) ? reservations : Object.values(reservations);
    const notifsArray = Array.isArray(notifications) ? notifications : Object.values(notifications);
    const avisArray = Array.isArray(avis) ? avis : Object.values(avis);

    const today = new Date();
    const filteredReservations = resArray.filter(r => {
        const arrival = new Date(r.date_arrivee);
        const departure = new Date(r.date_depart);
        if (reservationFilter === 'avenir')     return arrival >= today && r.statut !== 'annulee';
        if (reservationFilter === 'passes')     return departure < today;
        if (reservationFilter === 'en_attente') return r.statut === 'en_attente';
        return true;
    });

    const handleRemoveFavori = async (logementId, collection) => {
        try {
            await api.delete(`/client/favoris/${logementId}`);
            setFavoris(prev => {
                const updated = { ...prev };
                if (updated[collection]) {
                    updated[collection] = updated[collection].filter(f => f.logement_id !== logementId);
                    if (updated[collection].length === 0) delete updated[collection];
                }
                return updated;
            });
        } catch (e) { console.error(e); }
    };

    const handleDeleteAvis = async (avisId) => {
        if (!window.confirm('Supprimer cet avis ?')) return;
        try {
            await api.delete(`/avis/${avisId}`);
            setAvis(prev => prev.filter(a => a.id !== avisId));
        } catch (e) {
            alert(e.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleEditAvis = async (avisId) => {
        try {
            await api.put(`/avis/${avisId}`, editForm);
            setAvis(prev => prev.map(a => a.id === avisId ? { ...a, ...editForm } : a));
            setEditingAvis(null);
        } catch (e) {
            alert(e.response?.data?.message || 'Erreur lors de la modification');
        }
    };



    const upcomingCount = resArray.filter(r => new Date(r.date_arrivee) >= today && r.statut !== 'annulee').length;
    const favorisTotalCount = Object.values(favoris).flat().length;
    const unreadNotifs = notifsArray.filter(n => !n.read_at).length;

    return (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-primary text-white pt-12 pb-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
                <div className="max-w-6xl mx-auto relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden">
                            {user.profile_photo_url 
                                ? <img src={user.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                : <span className="text-2xl font-black">{user.nom?.charAt(0)}</span>}
                        </div>
                        <div>
                            <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Bienvenue,</p>
                            <h1 className="text-3xl font-black tracking-tighter">{user.nom}</h1>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Séjours à venir', value: upcomingCount, icon: Calendar },
                            { label: 'Favoris', value: favorisTotalCount, icon: Heart },
                            { label: 'Notifications', value: unreadNotifs, icon: Bell },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                                <Icon className="w-5 h-5 mx-auto mb-2 text-white/70" />
                                <div className="text-2xl font-black">{value}</div>
                                <div className="text-xs text-white/60 font-bold uppercase tracking-wider mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto px-6 -mt-12">
                <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden border border-gray-100">
                    <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-shrink-0 px-6 py-5 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                                    activeTab === tab
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-400 hover:text-primary hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {loading ? (
                            <div className="flex flex-col items-center py-20">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Chargement...</p>
                            </div>
                        ) : (
                            <>
                                {/* === RESERVATIONS === */}
                                {activeTab === 'Réservations' && (
                                    <div>
                                        <div className="flex gap-2 mb-8">
                                            {[
                                                { key: 'avenir', label: 'À venir' },
                                                { key: 'passes', label: 'Passés' },
                                                { key: 'en_attente', label: 'En attente' },
                                            ].map(f => (
                                                <button
                                                    key={f.key}
                                                    onClick={() => setReservationFilter(f.key)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                                        reservationFilter === f.key
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>

                                        {filteredReservations.length === 0 ? (
                                            <EmptyState icon={Calendar} message="Aucune réservation dans cette catégorie" />
                                        ) : (
                                            <div className="space-y-4">
                                                {filteredReservations.map(r => {
                                                    const cfg = statusConfig[r.statut] || statusConfig.en_attente;
                                                    const StatusIcon = cfg.icon;
                                                    const nights = Math.ceil((new Date(r.date_depart) - new Date(r.date_arrivee)) / 86400000);
                                                    const photo = r.logement?.photos?.[0];
                                                    return (
                                                        <div key={r.id} className="flex gap-5 bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                                                            <div className="w-40 h-36 flex-shrink-0 bg-gray-200 overflow-hidden">
                                                                {photo
                                                                    ? <img src={`${BASE_URL}/storage/${photo.chemin}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                    : <div className="w-full h-full flex items-center justify-center"><Home className="text-gray-300 w-10 h-10" /></div>}
                                                            </div>
                                                            <div className="flex-1 py-4 pr-4">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div>
                                                                        <h3 className="font-black text-primary text-lg leading-tight">{r.logement?.titre}</h3>
                                                                        {(r.logement?.ville || r.logement?.adresse) && (
                                                                            <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1">
                                                                                <MapPin className="w-3 h-3" />{r.logement?.ville || r.logement?.adresse}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                                                        <StatusIcon className="w-3 h-3" />{cfg.label}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold">
                                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.date_arrivee).toLocaleDateString('fr-FR')} → {new Date(r.date_depart).toLocaleDateString('fr-FR')}</span>
                                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{nights} nuit{nights > 1 ? 's' : ''}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-3">
                                                                    <span className="text-lg font-black text-primary">{parseFloat(r.prix_total).toLocaleString('fr-FR')} €</span>
                                                                    <Link to={`/logements/${r.logement_id}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                                                                        Voir le logement <ChevronRight className="w-3 h-3" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* === FAVORIS === */}
                                {activeTab === 'Favoris' && (
                                    <div>
                                        {Object.keys(favoris).length === 0 ? (
                                            <EmptyState icon={Heart} message="Vous n'avez pas encore de favoris" />
                                        ) : (
                                            Object.entries(favoris).map(([collection, items]) => (
                                                <div key={collection} className="mb-10">
                                                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Heart className="w-4 h-4 text-primary" /> {collection}
                                                        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px]">{items.length}</span>
                                                    </h2>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {items.map(f => {
                                                            const log = f.logement;
                                                            if (!log) return null;
                                                            const photo = log.photos?.[0];
                                                            return (
                                                                <div key={f.id} className="bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all group relative">
                                                                    <button
                                                                        onClick={() => handleRemoveFavori(log.id, collection)}
                                                                        className="absolute top-3 right-3 z-10 bg-white/90 text-red-400 hover:text-red-600 hover:bg-white p-2 rounded-xl shadow-sm transition-all"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                    <div className="h-40 bg-gray-200 overflow-hidden">
                                                                        {photo
                                                                            ? <img src={`${BASE_URL}/storage/${photo.chemin}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                            : <div className="w-full h-full flex items-center justify-center"><Home className="text-gray-300 w-8 h-8" /></div>}
                                                                    </div>
                                                                    <div className="p-4">
                                                                        <h3 className="font-black text-primary text-sm leading-tight mb-1">{log.titre}</h3>
                                                                        {log.ville && <p className="text-xs text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{log.ville}</p>}
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <span className="font-black text-primary">{parseFloat(log.prix_nuit).toLocaleString('fr-FR')} €</span>
                                                                                <span className="text-xs text-gray-400 font-bold"> /nuit</span>
                                                                                {log.en_promotion && (
                                                                                    <span className="ml-2 bg-red-50 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Promo</span>
                                                                                )}
                                                                            </div>
                                                                            <Link to={`/logements/${log.id}`} className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline">Voir</Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* === MES AVIS === */}
                                {activeTab === 'Mes Avis' && (
                                    <div className="space-y-4">
                                        {avisArray.length === 0 ? (
                                            <EmptyState icon={Star} message="Vous n'avez pas encore laissé d'avis" />
                                        ) : (
                                            avisArray.map(a => {
                                                const daysSince = Math.floor((new Date() - new Date(a.created_at)) / 86400000);
                                                const canEdit = daysSince <= 30;
                                                const canDelete = daysSince <= 7;
                                                const isEditing = editingAvis === a.id;
                                                return (
                                                    <div key={a.id} className="bg-gray-50 rounded-[24px] p-6 border border-gray-100">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="font-black text-primary text-sm">{a.logement?.titre}</h3>
                                                                {a.logement?.ville && <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{a.logement.ville}</p>}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {canEdit && (
                                                                    <button onClick={() => { setEditingAvis(isEditing ? null : a.id); setEditForm({ note: a.note, commentaire: a.commentaire }); }}
                                                                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                                        <Edit3 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                {canDelete && (
                                                                    <button onClick={() => handleDeleteAvis(a.id)}
                                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {isEditing ? (
                                                            <div className="space-y-3">
                                                                <div className="flex gap-1">
                                                                    {[1,2,3,4,5].map(s => (
                                                                        <button key={s} onClick={() => setEditForm(f => ({...f, note: s}))}
                                                                            className={`text-2xl transition-all ${s <= editForm.note ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                                                                    ))}
                                                                </div>
                                                                <textarea value={editForm.commentaire} onChange={e => setEditForm(f => ({...f, commentaire: e.target.value}))}
                                                                    rows={3} className="w-full bg-white border-2 border-primary/20 rounded-xl p-3 text-sm font-bold text-primary outline-none focus:border-primary resize-none" />
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleEditAvis(a.id)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary-dark transition-all">Enregistrer</button>
                                                                    <button onClick={() => setEditingAvis(null)} className="bg-gray-200 text-gray-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-300 transition-all">Annuler</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex gap-0.5 mb-2">
                                                                    {[1,2,3,4,5].map(s => <span key={s} className={`text-lg ${s <= a.note ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>)}
                                                                </div>
                                                                {a.commentaire && <p className="text-sm text-gray-600 font-medium italic">"{a.commentaire}"</p>}
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {/* === PAIEMENTS === */}
                                {activeTab === 'Paiements' && (
                                    <div>
                                        {resArray.filter(r => r.paiement).length === 0 ? (
                                            <EmptyState icon={CreditCard} message="Aucun paiement enregistré" />
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                                            <th className="pb-4">Logement</th>
                                                            <th className="pb-4">Date</th>
                                                            <th className="pb-4">Montant</th>
                                                            <th className="pb-4">Statut</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {resArray.filter(r => r.paiement).map(r => (
                                                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="py-4 font-bold text-primary">{r.logement?.titre}</td>
                                                                <td className="py-4 text-gray-500 font-medium">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                                                                <td className="py-4 font-black text-primary">{parseFloat(r.paiement.montant).toLocaleString('fr-FR')} €</td>
                                                                <td className="py-4">
                                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        r.paiement.statut === 'reussi' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                                    }`}>{r.paiement.statut}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* === NOTIFICATIONS === */}
                                {activeTab === 'Notifications' && (
                                    <div className="space-y-3">
                                        {notifsArray.length === 0 ? (
                                            <EmptyState icon={Bell} message="Aucune notification" />
                                        ) : (
                                            notifsArray.map(n => (
                                                <div key={n.id} className={`p-5 rounded-[20px] border transition-all ${n.read_at ? 'bg-gray-50 border-gray-100' : 'bg-primary/5 border-primary/20'}`}>
                                                    <p className={`text-sm font-bold ${n.read_at ? 'text-gray-600' : 'text-primary'}`}>
                                                        {n.data?.message || JSON.stringify(n.data)}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                                        {new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
}

function EmptyState({ icon: Icon, message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-primary/40" />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{message}</p>
        </div>
    );
}
