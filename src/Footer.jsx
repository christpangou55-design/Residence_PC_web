import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Send, User, Globe, Shield } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 pt-24 pb-12 mt-32 border-t border-slate-100 rounded-t-[100px] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-black italic text-sm">PC</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-900">Résidence <span className="text-primary italic">Privilège</span></span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            L'excellence de l'hébergement haut de gamme. Vivez des séjours d'exception dans nos propriétés sélectionnées avec la plus grande rigueur.
                        </p>
                        <div className="flex space-x-6">
                            <SocialIcon icon={<Camera size={18} />} />
                            <SocialIcon icon={<Send size={18} />} />
                            <SocialIcon icon={<User size={18} />} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <FooterColumn title="Découvrir" links={[
                        { label: 'Nos Résidences', to: '/residences' },
                        { label: 'Services Premium', to: '/services' },
                        { label: 'Offres Saisonnières', to: '/offres' },
                        { label: 'Destinations', to: '/residences' },
                    ]} />

                    <FooterColumn title="Assistance" links={[
                        { label: 'Centre d\'aide', to: '/help' },
                        { label: 'Nous contacter', to: '/contact' },
                        { label: 'Annulations', to: '/help' },
                        { label: 'Sécurité', to: '/help' },
                    ]} />

                    <FooterColumn title="Communauté" links={[
                        { label: 'Devenir Hôte', to: '/register' },
                        { label: 'Parrainage', to: '/register' },
                        { label: 'Blog Privilège', to: '/' },
                        { label: 'Partenaires', to: '/' },
                    ]} />
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="flex items-center space-x-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>© 2024 Résidence PC</span>
                        <Link to="/" className="hover:text-primary transition-colors">Confidentialité</Link>
                        <Link to="/" className="hover:text-primary transition-colors">Conditions</Link>
                        <Link to="/" className="hover:text-primary transition-colors">Plan du site</Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-slate-900">
                            <Globe size={16} className="text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">Français (FR)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-900 border-l border-slate-200 pl-6">
                            <Shield size={16} className="text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">Garanti PC</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterColumn = ({ title, links }) => (
    <div className="space-y-8">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">{title}</h3>
        <ul className="space-y-4">
            {links.map((link, i) => (
                <li key={i}>
                    <Link to={link.to} className="text-slate-400 hover:text-primary text-sm font-medium transition-colors duration-300 flex items-center group">
                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const SocialIcon = ({ icon }) => (
    <a href="#" className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary shadow-sm hover:shadow-primary/30 transition-all duration-300">
        {icon}
    </a>
);

export default Footer;
