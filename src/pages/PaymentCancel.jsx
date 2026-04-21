import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center p-8 max-w-md border border-gray-200 shadow-sm">
                <XCircle className="w-16 h-16 mx-auto text-black mb-4" />
                <h1 className="text-3xl font-bold tracking-tighter mb-2">Paiement Annulé</h1>
                <p className="text-gray-500 mb-8">
                    Vous avez annulé le processus de paiement. Votre compte n'a pas été débité et la réservation est en suspens.
                </p>
                <Link to="/" className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition">
                    Continuer à chercher
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;
