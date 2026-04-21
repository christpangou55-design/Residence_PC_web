import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center p-8 max-w-md border border-gray-200 shadow-sm">
                <CheckCircle className="w-16 h-16 mx-auto text-black mb-4" />
                <h1 className="text-3xl font-bold tracking-tighter mb-2">Paiement Validé</h1>
                <p className="text-gray-500 mb-8">
                    Votre réservation a bien été prise en compte et le paiement est confirmé. Merci pour votre confiance !
                </p>
                {sessionId && (
                    <p className="text-xs text-gray-400 mb-6 truncate px-4">
                        Ref Stripe: {sessionId}
                    </p>
                )}
                <Link to="/" className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
