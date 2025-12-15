// src/components/admin/AdminHeader.jsx
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { getCurrentUserEmail } from "../../utils/storage";

function AdminHeader() {
    const userEmail = getCurrentUserEmail();
    
    // Récupère l'initiale pour l'avatar (ex: "admin@nws.fr" -> "A")
    const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : '?';

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-4">
            
            {/* --- Titre et Sous-titre --- */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    {/* Icône de bouclier pour le côté Admin/Secure */}
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-nws-purple" />
                    </div>
                    Administration
                </h1>
                <p className="text-slate-500 mt-2 pl-1">
                    Interface de gestion et de configuration du mentor IA.
                </p>
            </div>

            {/* --- Badge Utilisateur --- */}
            {userEmail && (
                <div className="flex items-center gap-3 px-2 pr-5 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
                    
                    {/* Avatar : Cercle avec l'initiale */}
                    <div className="w-10 h-10 rounded-full bg-nws-purple/10 flex items-center justify-center text-nws-purple font-bold text-lg border border-nws-purple/20">
                        {userInitial}
                    </div>
                    
                    {/* Infos Textuelles */}
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-tight">
                            Connecté en tant que
                        </span>
                        <span className="text-sm font-semibold text-slate-700 leading-tight">
                            {userEmail}
                        </span>
                    </div>
                </div>
            )}
        </header>
    );
}

export default AdminHeader;