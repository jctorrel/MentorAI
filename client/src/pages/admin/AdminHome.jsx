// src/pages/AdminHome.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, LogOut } from "lucide-react";

import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useAdminConfig } from "../../hooks/useAdminConfig";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSection from "../../components/admin/AdminSection";
import ConfigForm from "../../components/admin/ConfigForm";
import AdminPromptsSection from "./AdminPromptsSection";
import AdminProgramsSection from "./AdminProgramsSection";
import AdminFreeModeSection from "../../components/admin/AdminFreeModeSection";
import { LoadingState, AccessDenied } from "../../components/admin/AdminStatus";

function AdminHome() {
    const navigate = useNavigate();
    const { loading, isAdmin, error: authError, config: initialConfig } = useAdminAuth();
    const {
        config,
        saving,
        saveMessage,
        error: saveError,
        updateField,
        saveConfig
    } = useAdminConfig(initialConfig);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingState message="Chargement du panneau d'administration..." />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <AccessDenied />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-nws-purple/20 pb-20">

            {/* --- Barre de navigation (Sticky) --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-3 shadow-sm flex items-center justify-between">

                {/* Bouton Retour (Gauche) */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-all text-sm font-semibold group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retour à l'application
                </button>

                {/* Titre (Droite) */}
                <div className="flex items-center gap-2 text-nws-purple font-bold uppercase tracking-wider text-xs md:text-sm bg-nws-purple/5 px-3 py-1.5 rounded-full border border-nws-purple/10">
                    <LayoutDashboard className="w-4 h-4" />
                    Console Administrateur
                </div>
            </nav>

            {/* --- Contenu Principal --- */}
            {/* J'ai élargi ici à max-w-[1600px] pour occuper plus d'espace */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header de la page */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <AdminHeader />
                </div>

                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

                    {/* 1. Configuration Globale */}
                    <ConfigForm
                        config={config}
                        saving={saving}
                        saveMessage={saveMessage}
                        error={saveError}
                        onFieldChange={updateField}
                        onSave={saveConfig}
                    />

                    {/* 2. Interface Étudiant */}
                    <AdminSection
                        title="Interface & Expérience Étudiant"
                        description="Gérez les fonctionnalités visibles par les utilisateurs finaux."
                    >
                        <AdminFreeModeSection />
                    </AdminSection>

                    {/* 3. IA & Prompts */}
                    <AdminSection
                        title="Intelligence Artificielle"
                        description="Gérez ici les instructions système (System Prompts) utilisées par l'IA Mentor. 
                                        Modifiez le contenu avec précaution, car cela impacte directement les réponses aux étudiants."
                    >
                        <AdminPromptsSection />
                    </AdminSection>

                    {/* 4. Programmes */}
                    <AdminSection
                        title="Programmes Pédagogiques"
                        description="Visualisation des programmes de formation qui seront utilisés par le mentor pour structurer la discussion."
                    >
                        <AdminProgramsSection />
                    </AdminSection>

                </div>
            </main>
        </div>
    );
}

export default AdminHome;