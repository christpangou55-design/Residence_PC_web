import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone } from 'lucide-react';
import api from '../api';

const Register = () => {
    const { setUser } = useOutletContext();
    const [formData, setFormData] = useState({ nom: '', email: '', telephone: '', password: '', password_confirmation: '', role: 'client' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-20 px-4">
            <div className="max-w-xl w-full">
                <div className="bg-white p-12 md:p-16 rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                            <span className="text-white font-black italic">PC</span>
                        </div>
                        
                        <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-2">Créer un compte</h1>
                        <p className="text-gray-400 font-medium mb-12">Rejoignez le cercle exclusif de <span className="text-primary font-bold">Résidence PC</span>.</p>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-500 p-5 rounded-2xl mb-10 text-xs font-black uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput 
                                    label="Nom complet" 
                                    name="nom" 
                                    type="text" 
                                    placeholder="John Doe" 
                                    icon={<User size={18} />} 
                                    onChange={handleChange} 
                                />
                                <FormInput 
                                    label="Téléphone" 
                                    name="telephone" 
                                    type="tel" 
                                    placeholder="+33 6 ..." 
                                    icon={<Phone size={18} />} 
                                    onChange={handleChange} 
                                />
                            </div>

                            <FormInput 
                                label="Adresse Email" 
                                name="email" 
                                type="email" 
                                placeholder="votre@email.com" 
                                icon={<Mail size={18} />} 
                                onChange={handleChange} 
                            />
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Type de compte</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'client' })}
                                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'client' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-gray-400 hover:bg-slate-100'}`}
                                    >
                                        Voyageur
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'vendeur' })}
                                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.role === 'vendeur' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-gray-400 hover:bg-slate-100'}`}
                                    >
                                        Hôte / Vendeur
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <PasswordField 
                                    label="Mot de passe" 
                                    name="password" 
                                    show={showPassword} 
                                    toggle={() => setShowPassword(!showPassword)} 
                                    onChange={handleChange} 
                                />
                                <PasswordField 
                                    label="Confirmation" 
                                    name="password_confirmation" 
                                    show={showConfirmPassword} 
                                    toggle={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all mt-6">
                                Créer mon compte Privilège
                            </button>
                        </form>
                        
                        <div className="mt-12 text-center">
                            <p className="text-gray-400 text-sm font-medium">
                                Déjà membre ? {' '}
                                <Link to="/login" className="text-primary font-black uppercase text-xs tracking-widest ml-1 hover:underline decoration-2 underline-offset-4">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, type, placeholder, icon, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">{label}</label>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                {icon}
            </div>
            <input 
                type={type} 
                name={name}
                required={name !== 'telephone'}
                className="w-full bg-slate-50 border-none rounded-3xl pl-16 pr-6 py-5 font-bold focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 placeholder:text-gray-300"
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    </div>
);

const PasswordField = ({ label, name, show, toggle, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">{label}</label>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
            </div>
            <input 
                type={show ? 'text' : 'password'} 
                name={name}
                required
                minLength={8}
                className="w-full bg-slate-50 border-none rounded-3xl pl-16 pr-14 py-5 font-bold focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 placeholder:text-gray-300"
                placeholder="••••••••"
                onChange={onChange}
            />
            <button 
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggle}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
            >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    </div>
);

export default Register;
