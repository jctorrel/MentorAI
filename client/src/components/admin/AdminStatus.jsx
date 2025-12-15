// src/components/admin/AdminStatus.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";

/**
 * Affiche un spinner de chargement centré
 */
export function LoadingState({ message = "Vérification des droits..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-500">
            <Loader2 className="w-8 h-8 text-nws-purple animate-spin mb-3" />
            <p className="text-slate-500 font-medium text-sm">{message}</p>
        </div>
    );
}

/**
 * Affiche une carte "Accès Refusé" (403)
 */
export function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-300">
            <div className="bg-red-50 p-4 rounded-full mb-6 ring-8 ring-red-50/50">
                <Lock className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                Accès refusé
            </h1>
            
            <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
                Votre compte ne dispose pas des droits administrateur nécessaires pour accéder à cette section.
            </p>

            <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all font-medium shadow-sm hover:shadow-md"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour à l'application
            </button>
        </div>
    );
}

/**
 * Affiche un petit message d'erreur (souvent dans les formulaires)
 */
export function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm animate-in slide-in-from-top-1 duration-300" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{message}</span>
        </div>
    );
}

/**
 * Affiche un petit message de succès
 */
export function SuccessMessage({ message }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm animate-in slide-in-from-top-1 duration-300" role="status">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{message}</span>
        </div>
    );
}