// src/components/admin/AdminSection.jsx
import React from 'react';

function AdminSection({ title, description, children, muted = false }) {
    return (
        <section 
            className={`
                mt-12 pt-8 border-t transition-all duration-300
                ${muted 
                    ? 'border-dashed border-slate-300 opacity-75 grayscale-[0.5]' 
                    : 'border-slate-200 opacity-100'
                }
            `}
        >
            <div className="mb-8">
                <h2 className={`
                    text-xl font-bold tracking-tight
                    ${muted ? 'text-slate-600' : 'text-slate-900'}
                `}>
                    {title}
                </h2>
                
                {description && (
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            <div className="relative">
                {children}
            </div>
        </section>
    );
}

export default AdminSection;