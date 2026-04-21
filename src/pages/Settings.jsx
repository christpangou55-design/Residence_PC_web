import { useOutletContext } from 'react-router-dom';
import { User, Lock, Bell, Shield, CreditCard, ChevronRight, Globe, Camera } from 'lucide-react';

const Settings = () => {
    const { user } = useOutletContext();

    return (
        <div className="max-w-5xl mx-auto px-4 py-24">
            <div className="mb-20">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Espace Privilège</span>
                <h1 className="text-7xl font-black tracking-tighter text-gray-900 leading-none">Paramètres du <span className="text-primary italic">Compte</span></h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-20">
                {/* Sidebar / Profile Card */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-10 rounded-[60px] shadow-2xl border border-gray-100 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-slate-50 group-hover:bg-primary/5 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-[40px] bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
                                    <User size={64} className="text-slate-200" />
                                </div>
                                <button className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.nom || 'Membre Privilège'}</h2>
                            <p className="text-gray-400 font-medium text-sm mt-1">{user?.email}</p>
                            
                            <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</span>
                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Premium Platinum</span>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Membre depuis</span>
                                    <span className="text-slate-900 text-xs font-black tracking-tighter">Janvier 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Settings */}
                <div className="lg:w-2/3 space-y-16">
                    <Section title="Sécurité du compte">
                        <SettingItem label="Informations Personnelles" icon={<User size={20} />} />
                        <SettingItem label="Changer le mot de passe" icon={<Lock size={20} />} />
                        <SettingItem label="Authentification à deux facteurs" icon={<Shield size={20} />} />
                    </Section>

                    <Section title="Préférences & Expérience">
                        <div className="flex items-center justify-between py-8 border-b border-slate-50">
                            <div className="flex items-center space-x-6">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <Bell className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Alertes de Réservation</h3>
                                    <p className="text-gray-400 text-xs font-medium mt-1 uppercase tracking-tighter">Notifications instantanées par email et SMS</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-14 h-7 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <SettingItem label="Langue et Région" icon={<Globe size={20} />} value="Français (FR)" />
                    </Section>

                    <Section title="Gestion Financière">
                        <SettingItem label="Modes de paiement" icon={<CreditCard size={20} />} value="Visa •••• 4242" />
                    </Section>

                    <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                            Supprimer mon compte
                        </button>
                        <button className="bg-primary text-white px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                            Enregistrer les modifications
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 border-b border-gray-100 pb-4">{title}</h2>
        <div className="space-y-2">{children}</div>
    </div>
);

const SettingItem = ({ label, icon, value }) => (
    <button className="w-full flex items-center justify-between py-8 border-b border-gray-50 group">
        <div className="flex items-center space-x-6">
            <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-primary/5 transition-colors">
                <div className="text-primary">{icon}</div>
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">{label}</h3>
        </div>
        <div className="flex items-center space-x-4">
            {value && <span className="text-sm font-bold text-gray-400 capitalize">{value}</span>}
            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
        </div>
    </button>
);

export default Settings;
