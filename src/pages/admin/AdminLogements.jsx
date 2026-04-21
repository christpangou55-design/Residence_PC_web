import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api';

const AdminLogements = () => {
    const { user } = useOutletContext();
    const [logements, setLogements] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const fetchLogements = () => {
        api.get('/logements')
            .then(res => setLogements(res.data.data || res.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLogements();
    }, []);

    const handleDelete = (id) => {
        if(window.confirm('Voulez-vous vraiment supprimer ce logement ?')) {
            api.delete(`/logements/${id}`)
                .then(() => fetchLogements())
                .catch(() => alert("Erreur lors de la suppression."));
        }
    };

    if (loading) return <div className="py-20 text-center text-sm text-gray-500 uppercase tracking-widest">Chargement...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold tracking-tighter">Gestion des logements</h1>
                <Link to="/admin/logements/create" className="inline-flex items-center text-sm font-medium bg-black text-white px-4 py-2 hover:bg-gray-800 transition">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Link>
            </div>

            <div className="border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-900">ID</th>
                            <th className="px-6 py-3 font-semibold text-gray-900">Titre</th>
                            <th className="px-6 py-3 font-semibold text-gray-900">Prix / nuit</th>
                            <th className="px-6 py-3 font-semibold text-gray-900">Capacité</th>
                            <th className="px-6 py-3 font-semibold text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {logements.map(l => (
                            <tr key={l.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">{l.id}</td>
                                <td className="px-6 py-4 font-medium">{l.titre}</td>
                                <td className="px-6 py-4">{l.prix_nuit} €</td>
                                <td className="px-6 py-4">{l.capacite} pers.</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <Link to={`/admin/logements/${l.id}/edit`} className="inline-flex items-center text-gray-900 hover:text-gray-500 transition">
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(l.id)} className="inline-flex items-center text-red-600 hover:text-red-900 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {logements.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Aucun logement enregistré.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLogements;
