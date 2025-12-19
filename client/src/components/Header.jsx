// client/src/components/Header.jsx

import React from "react";
import StatusBadge from "./StatusBadge";
import { GraduationCap } from "lucide-react"; // Import d'une icône de secours si pas de logo

function Header({ online, count, limit }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 shadow-sm">
            
            {/* Partie Gauche : Identité */}
            <div className="flex items-center gap-3">
                {/* Logo NWS */}
                <div className="flex-shrink-0">
                    <img
                        src="Logo.svg"
                        alt="NWS Logo"
                        className="h-12 w-auto"
                    />
                </div>

                {/* Séparateur vertical */}
                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* Titre & Sous-titre */}
                <div className="flex flex-col">
                    <h1 className="text-m font-bold text-slate-800 tracking-tight leading-none">
                        Mentor AI
                    </h1>
                    <span className="text-[10px] sm:text-[13px] text-slate-500 font-medium mt-0.5">
                        Assistant Pédagogique
                    </span>
                </div>
            </div>

            {/* Partie Droite : Statut */}
            <StatusBadge
                online={online}
                count={count}
                limit={limit}
            />
        </header>
    );
}

export default Header;