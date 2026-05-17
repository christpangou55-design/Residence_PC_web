import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Trash2, CalendarPlus, Check, Info } from 'lucide-react';
import api, { BASE_URL } from '../../api';

const LogementForm = () => {
    const { user } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const fileInputRef = useRef(null);
    
    if (!user || (user.role !== 'vendeur' && user.role !== 'admin')) {
        return <Navigate to="/" replace />;
    }

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        prix_nuit: '',
        capacite: '',
        equipements: '',
        statut: 'disponible'
    });
    
    const [disponibilites, setDisponibilites] = useState([]);
    const [newDispo, setNewDispo] = useState({ date_debut: '', date_fin: '', type: 'disponible', motif: '' });
    const [images, setImages] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchDisponibilites = async () => {
        try {
            const res = await api.get(`/logements/${id}`);
            setDisponibilites(res.data.disponibilites || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (isEditing) {
            api.get(`/logements/${id}`)
                .then(res => {
                    const data = res.data;
                    
                    // Sécurité : Vérifier que c'est bien le logement du vendeur
                    if (user.role !== 'admin' && data.user_id !== user.id) {
                        navigate('/vendeur/logements');
                        return;
                    }

                    let equipmentsStr = '';
                    if(data.equipements) {
                        try {
                            const parsed = typeof data.equipements === 'string' ? JSON.parse(data.equipements) : data.equipements;
                            equipmentsStr = Array.isArray(parsed) ? parsed.join(', ') : '';
                        } catch(e) {
                            equipmentsStr = '';
                        }
                    }
                    setFormData({
                        titre: data.titre || '',
                        description: data.description || '',
                        prix_nuit: data.prix_nuit || '',
                        capacite: data.capacite || '',
                        equipements: equipmentsStr,
                        statut: data.statut || 'disponible'
                    });
                    setDisponibilites(data.disponibilites || []);
                    setExistingPhotos(data.photos || []);
                })
                .catch(() => navigate('/vendeur/logements'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing, navigate, user]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleDispoChange = e => setNewDispo({ ...newDispo, [e.target.name]: e.target.value });

    const handleFileChange = e => {
        if (e.target.files.length > 0) {
            setImages(e.target.files);
            const previews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        } else {
            setImages(null);
            setImagePreviews([]);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette photo ?')) {
            try {
                await api.delete(`/logements/${id}/photos/${photoId}`);
                setExistingPhotos(existingPhotos.filter(p => p.id !== photoId));
            } catch (e) {
                alert('Erreur lors de la suppression de la photo.');
            }
        }
    };

    const handleAddDispo = async () => {
        if (!newDispo.date_debut || !newDispo.date_fin) return alert("Remplissez les dates");
        try {
            await api.post(`/logements/${id}/disponibilites`, newDispo);
            setNewDispo({ date_debut: '', date_fin: '', type: 'disponible', motif: '' });
            fetchDisponibilites();
        } catch (e) {
            alert(e.response?.data?.message || "Erreur d'ajout de la période");
        }
    };

    const handleDeleteDispo = async (dispoId) => {
        if (window.confirm("Supprimer cette période ?")) {
            try {
                await api.delete(`/logements/${id}/disponibilites/${dispoId}`);
                fetchDisponibilites();
            } catch (e) {
                alert("Erreur de suppression");
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsSaving(true);
        
        let equipParsed = [];
        if (formData.equipements) {
            equipParsed = formData.equipements.split(',').map(item => item.trim()).filter(i => i);
        }

        const payload = new FormData();
        payload.append('titre', formData.titre);
        payload.append('description', formData.description || '');
        payload.append('prix_nuit', formData.prix_nuit);
        payload.append('capacite', formData.capacite);
        payload.append('equipements', JSON.stringify(equipParsed));
        payload.append('statut', formData.statut);
        
        if (images) {
            for (let i = 0; i < images.length; i++) payload.append('images[]', images[i]);
        }

        try {
            if (isEditing) {
                payload.append('_method', 'PUT');
                await api.post(`/logements/${id}`, payload);
            } else {
                await api.post(`/logements`, payload);
            }
            navigate('/vendeur/logements');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm text-primary/40 font-black uppercase tracking-widest">Préparation du formulaire...</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-10">
                <Link to="/vendeur/logements" className="group inline-flex items-center text-sm font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à mes annonces
                </Link>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
                <div className="bg-primary p-10 text-white">
                    <h1 className="text-3xl font-black tracking-tighter mb-2">
                        {isEditing ? 'Modifier votre annonce' : 'Nouvelle annonce'}
                    </h1>
                    <p className="text-white/60 font-medium italic">Complétez les informations pour attirer plus de voyageurs.</p>
                </div>

                <div className="p-10">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center">
                            <Info className="text-red-500 w-5 h-5 mr-3" />
                            <p className="text-red-800 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xs">01</div>
                                <h2 className="text-lg font-black text-primary uppercase tracking-wider">Informations Générales</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">Nom de la résidence</label>
                                    <input 
                                        type="text" name="titre" required 
                                        value={formData.titre} onChange={handleChange} 
                                        placeholder="Ex: Villa Azur - Suite Royale"
                                        className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-bold text-primary" 
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">Description détaillée</label>
                                    <textarea 
                                        name="description" rows={5} 
                                        value={formData.description} onChange={handleChange} 
                                        placeholder="Décrivez les atouts de votre logement..."
                                        className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-bold text-primary resize-none" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">Prix par nuit (€)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" step="0.01" name="prix_nuit" required 
                                            value={formData.prix_nuit} onChange={handleChange} 
                                            className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-primary" 
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black">€</span>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">Capacité d'accueil</label>
                                    <input 
                                        type="number" name="capacite" required 
                                        value={formData.capacite} onChange={handleChange} 
                                        placeholder="Nombre de personnes"
                                        className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-primary" 
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xs">02</div>
                                <h2 className="text-lg font-black text-primary uppercase tracking-wider">Services & Visuels</h2>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">Équipements (séparés par des virgules)</label>
                                <input 
                                    type="text" name="equipements" 
                                    value={formData.equipements} onChange={handleChange} 
                                    placeholder="WiFi, Piscine, Climatisation, Parking..."
                                    className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-bold text-primary" 
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">Disponibilité immédiate</label>
                                <select 
                                    name="statut" value={formData.statut} onChange={handleChange} 
                                    className="w-full bg-gray-50 border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-black text-primary appearance-none cursor-pointer"
                                >
                                    <option value="disponible">✓ Disponible à la réservation</option>
                                    <option value="indisponible">✕ Indisponible pour le moment</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Galerie Photos</label>
                                
                                {isEditing && existingPhotos.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                        {existingPhotos.map(photo => (
                                            <div key={photo.id} className="relative group rounded-2xl overflow-hidden border border-gray-100 aspect-square shadow-sm">
                                                <img src={`${BASE_URL}/storage/${photo.chemin}`} alt="logement" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => handleDeletePhoto(photo.id)} className="bg-white text-red-500 p-3 rounded-xl shadow-xl hover:scale-110 active:scale-90 transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div 
                                    onClick={() => fileInputRef.current.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                                >
                                    <UploadCloud className="w-12 h-12 mx-auto text-gray-300 mb-4 group-hover:text-primary transition-colors" />
                                    <p className="text-sm font-black text-primary uppercase tracking-widest mb-1">
                                        {images ? `${images.length} fichiers sélectionnés` : 'Glissez vos plus belles photos'}
                                    </p>
                                    <p className="text-xs text-gray-400 font-bold">Format JPG, PNG (Max 5Mo)</p>
                                    <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                </div>
                                
                                {imagePreviews.length > 0 && (
                                    <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5">
                                                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                            <button 
                                type="submit" disabled={isSaving} 
                                className="flex-grow bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center group"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" />
                                        {isEditing ? 'Enregistrer les modifications' : 'Publier mon annonce'}
                                    </>
                                )}
                            </button>
                            {isEditing && (
                                <Link to="/vendeur/logements" className="bg-gray-50 text-gray-400 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-100 hover:text-gray-600 transition-all text-center">
                                    Annuler
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {isEditing && (
                <div className="mt-12 bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
                    <div className="p-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xs">03</div>
                            <h2 className="text-lg font-black text-primary uppercase tracking-wider">Gestion des disponibilités</h2>
                        </div>
                        
                        <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-gray-400">Ajouter une période de location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date de début</label>
                                    <input type="date" name="date_debut" value={newDispo.date_debut} onChange={handleDispoChange} className="w-full bg-white border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date de fin</label>
                                    <input type="date" name="date_fin" value={newDispo.date_fin} onChange={handleDispoChange} className="w-full bg-white border-2 border-transparent px-6 py-4 rounded-2xl outline-none focus:border-primary font-bold text-primary" />
                                </div>
                            </div>
                            <button onClick={handleAddDispo} className="bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 flex items-center">
                                <CalendarPlus className="w-4 h-4 mr-3" /> Confirmer la période
                            </button>
                        </div>

                        <div className="space-y-4">
                            {disponibilites.length === 0 ? (
                                <div className="py-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Aucune période spécifique définie</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {disponibilites.map(d => (
                                        <div key={d.id} className="flex justify-between items-center bg-white border-2 border-gray-50 p-6 rounded-[24px] shadow-sm hover:border-primary/20 transition-all">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mb-1">Période active</span>
                                                <span className="text-sm font-black text-primary">
                                                    {new Date(d.date_debut).toLocaleDateString('fr-FR')} — {new Date(d.date_fin).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                            <button onClick={() => handleDeleteDispo(d.id)} className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogementForm;
