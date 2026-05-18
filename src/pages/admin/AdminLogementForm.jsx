import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Trash2, CalendarPlus } from 'lucide-react';
import api, { BASE_URL } from '../../api';

const AdminLogementForm = () => {
    const { user } = useOutletContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const fileInputRef = useRef(null);
    
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        adresse: '',
        ville: '',
        pays: '',
        prix_nuit: '',
        capacite: '',
        equipements: '',
        statut: 'disponible'
    });
    
    // Pour la gestion des dispos (uniquement en mode édition)
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
                    let equipmentsStr = '';
                    if(data.equipements) {
                        try {
                            const parsed = typeof data.equipements === 'string' ? JSON.parse(data.equipements) : data.equipements;
                            equipmentsStr = parsed.join(', ');
                        } catch(e) {}
                    }
                    setFormData({
                        titre: data.titre || '',
                        description: data.description || '',
                        adresse: data.adresse || '',
                        ville: data.ville || '',
                        pays: data.pays || '',
                        prix_nuit: data.prix_nuit || '',
                        capacite: data.capacite || '',
                        equipements: equipmentsStr,
                        statut: data.statut || 'disponible'
                    });
                    setDisponibilites(data.disponibilites || []);
                    setExistingPhotos(data.photos || []);
                })
                .catch(() => navigate('/admin/logements'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing, navigate]);

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
        payload.append('adresse', formData.adresse || '');
        payload.append('ville', formData.ville || '');
        payload.append('pays', formData.pays || '');
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
            navigate('/admin/logements');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center uppercase tracking-widest text-sm text-gray-500">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto pb-12">
            <div className="mb-6">
                <Link to="/admin/logements" className="inline-flex items-center text-sm font-medium hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
                </Link>
            </div>

            <div className="border border-gray-200 p-8 shadow-sm mb-8">
                <h1 className="text-2xl font-bold tracking-tighter mb-6">
                    {isEditing ? 'Modifier le logement' : 'Ajouter un logement'}
                </h1>

                {error && <div className="bg-black text-white p-3 mb-6 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... Existing Fields ... */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Titre</label>
                        <input type="text" name="titre" required value={formData.titre} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Adresse</label>
                            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Ex: 12 Rue des Palmiers" className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ville</label>
                            <input type="text" name="ville" value={formData.ville} onChange={handleChange} placeholder="Ex: Abidjan" className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Pays</label>
                            <input type="text" name="pays" value={formData.pays} onChange={handleChange} placeholder="Ex: Côte d'Ivoire" className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Prix par nuit (€)</label>
                            <input type="number" step="0.01" name="prix_nuit" required value={formData.prix_nuit} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Capacité (personnes)</label>
                            <input type="number" name="capacite" required value={formData.capacite} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Équipements <span className="text-gray-400 font-normal">(Séparés par des virgules)</span></label>
                        <input type="text" name="equipements" value={formData.equipements} onChange={handleChange} placeholder="WiFi, Piscine, Climatisation..." className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Statut</label>
                        <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-black transition bg-white cursor-pointer">
                            <option value="disponible">Disponible</option>
                            <option value="indisponible">Indisponible</option>
                        </select>
                    </div>

                    {/* Photos Existantes */ }
                    {isEditing && existingPhotos.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-3">Photos enregistrées</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {existingPhotos.map(photo => (
                                    <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                                        <img src={`${BASE_URL}/storage/${photo.chemin}`} alt="logement" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border border-dashed border-gray-300 p-6 text-center">
                        <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <label className="block text-sm font-medium mb-2">{images ? 'Nouvelles photos sélectionnées' : 'Ajouter de nouvelles photos'}</label>
                        <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current.click()} className="border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition">
                            Sélectionner des images
                        </button>
                        
                        {imagePreviews.length > 0 && (
                            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <button type="submit" disabled={isSaving} className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                            {isSaving ? 'Sauvegarde en cours...' : (isEditing ? 'Enregistrer les informations' : 'Ajouter le logement')}
                        </button>
                    </div>
                </form>
            </div>

            {/* SECTIONS DISPONIBILITES (Seulement en Edition) */}
            {isEditing && (
                <div className="border border-gray-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold tracking-tighter mb-6 flex items-center">
                        <CalendarPlus className="w-5 h-5 mr-3" /> Périodes de disponibilité
                    </h2>
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
                        <h3 className="text-sm font-bold uppercase mb-4 text-gray-700">Déclarer une nouvelle période</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1">Début</label>
                                <input type="date" name="date_debut" value={newDispo.date_debut} onChange={handleDispoChange} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1">Fin</label>
                                <input type="date" name="date_fin" value={newDispo.date_fin} onChange={handleDispoChange} className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black" />
                            </div>
                        </div>
                        <button onClick={handleAddDispo} className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition">
                            Ajouter au calendrier
                        </button>
                    </div>

                    <div className="space-y-2">
                        {disponibilites.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Aucune période explicitement définie.</p>
                        ) : (
                            disponibilites.map(d => (
                                <div key={d.id} className="flex justify-between items-center border border-gray-200 p-3 bg-white">
                                    <div className="text-sm font-medium">
                                        Du {new Date(d.date_debut).toLocaleDateString('fr-FR')} au {new Date(d.date_fin).toLocaleDateString('fr-FR')}
                                    </div>
                                    <button onClick={() => handleDeleteDispo(d.id)} className="text-red-500 hover:text-red-700 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogementForm;
