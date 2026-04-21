import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 8250,
        reservations: 38,
        occupancy: 72,
    });

    return (
        <div className="space-y-10 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900">Tableau de Bord Administrateur</h1>
                    <p className="text-gray-500 mt-1 font-medium">Suivez les performances de votre activité en temps réel.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition">Exporter PDF</button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-dark transition">Appliquer Filtres</button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-primary p-8 rounded-[32px] text-white shadow-xl shadow-blue-900/10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/20 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
                        <div className="flex items-center text-xs font-bold bg-white/20 px-2 py-1 rounded-full"><ArrowUpRight className="w-3 h-3 mr-1" /> +12%</div>
                    </div>
                    <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Revenus du Mois</p>
                    <h3 className="text-4xl font-black mt-2">{stats.revenue.toLocaleString()} €</h3>
                </div>

                <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-50 rounded-2xl text-primary"><Calendar className="w-6 h-6" /></div>
                        <div className="flex items-center text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full"><ArrowUpRight className="w-3 h-3 mr-1" /> +5%</div>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Réservations</p>
                    <h3 className="text-4xl font-black mt-2 text-gray-900">{stats.reservations} <span className="text-sm font-medium text-gray-400">Réservations</span></h3>
                </div>

                <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-50 rounded-2xl text-primary"><TrendingUp className="w-6 h-6" /></div>
                        <div className="flex items-center text-xs font-bold bg-blue-50 text-primary px-2 py-1 rounded-full">Optimal</div>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Taux d'Occupation</p>
                    <h3 className="text-4xl font-black mt-2 text-gray-900">{stats.occupancy}% <span className="text-sm font-medium text-gray-400">Taux d'Occupation</span></h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Placeholder */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xl font-bold">Revenus Mensuels</h4>
                        <select className="border-none bg-gray-50 rounded-lg text-sm font-bold focus:ring-primary">
                            <option>Année 2026</option>
                            <option>Année 2025</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between px-2">
                        {/* Simple SVG Chart */}
                        <svg className="w-full h-full" viewBox="0 0 800 200">
                            <path 
                                d="M0,150 Q100,140 200,160 T400,100 T600,120 T800,50" 
                                fill="none" 
                                stroke="#0056A4" 
                                strokeWidth="4" 
                                strokeLinecap="round"
                            />
                            <circle cx="800" cy="50" r="6" fill="#0056A4" />
                            <rect x="0" y="190" width="800" height="2" fill="#f1f5f9" />
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Jan</span><span>Féb</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span><span>Août</span>
                    </div>
                </div>

                {/* Recent Reservations Table */}
                <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm overflow-hidden">
                    <h4 className="text-xl font-bold mb-8">Réservations Récentes</h4>
                    <div className="space-y-6">
                        {[
                            { user: "Jean Dupont", amount: 1540, status: "Payée", trend: "up" },
                            { user: "Marie Curie", amount: 890, status: "Payée", trend: "up" },
                            { user: "Alan Turing", amount: 1200, status: "Annulée", trend: "down" },
                            { user: "Ada Lovelace", amount: 2100, status: "Payée", trend: "up" },
                        ].map((res, i) => (
                            <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-bold text-gray-900">{res.user}</p>
                                    <p className="text-xs text-gray-400 font-medium">Détails de la réservation</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{res.amount}€</p>
                                    <div className={`text-[10px] font-bold ${res.status === 'Payée' ? 'text-green-500' : 'text-orange-500'} flex items-center justify-end uppercase`}>
                                        {res.trend === 'up' ? <ArrowUpRight className="w-2 h-2 mr-1" /> : <ArrowDownRight className="w-2 h-2 mr-1" />}
                                        {res.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client List */}
            <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm overflow-hidden">
                 <h4 className="text-xl font-bold mb-8">Liste des Clients</h4>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                                <th className="pb-4">Client</th>
                                <th className="pb-4 text-center">Statut</th>
                                <th className="pb-4 text-right">Montant Total</th>
                                <th className="pb-4 text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: "Robert Downey", status: "Confirmé", amount: 12500, perf: "28.5%" },
                                { name: "Scarlett Joh.", status: "Confirmé", amount: 8400, perf: "15.2%" },
                                { name: "Chris Evans", status: "En attente", amount: 5600, perf: "8.1%" },
                            ].map((client, i) => (
                                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-gray-900 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-primary text-xs flex items-center justify-center mr-3 font-black">
                                            {client.name.charAt(0)}
                                        </div>
                                        {client.name}
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{client.status}</span>
                                    </td>
                                    <td className="py-4 text-right font-bold text-gray-900">{client.amount.toLocaleString()} €</td>
                                    <td className="py-4 text-right font-bold text-green-600 flex items-center justify-end">
                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                        {client.perf}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
