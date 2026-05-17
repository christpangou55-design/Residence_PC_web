import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import api from '../api';

const Login = () => {
    const { setUser } = useOutletContext();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants incorrects.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                            <span className="text-white font-black italic">PC</span>
                        </div>
                        
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">Bienvenue</h1>
                        <p className="text-gray-400 font-medium mb-10">Connectez-vous à votre espace <span className="text-primary font-bold">Privilège</span>.</p>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Adresse Email</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                                        placeholder="votre@email.com"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Mot de passe</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        name="password"
                                        required
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-14 py-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                    <button 
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-end pt-1">
                                    <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all mt-4">
                                Se connecter
                            </button>
                        </form>
                        
                        <div className="mt-10 text-center">
                            <p className="text-gray-400 text-sm font-medium">
                                Pas encore membre ? {' '}
                                <Link to="/register" className="text-primary font-black uppercase text-xs tracking-widest ml-1 hover:underline decoration-2 underline-offset-4">
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
