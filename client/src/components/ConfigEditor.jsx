import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle, Check } from 'lucide-react';

const ConfigEditor = () => {
  const [config, setConfig] = useState({
    school_name: "Normandie Web School",
    tone: "concis, professionnel",
    rules: "jamais quitter école, réponse **courte**, escalade humaine si détresse"
  });
  
  const [originalConfig, setOriginalConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Simuler le chargement initial des données
    // Remplacez cette partie par votre appel API
    const loadConfig = async () => {
      try {
        // const response = await fetch('/api/config');
        // const data = await response.json();
        // setConfig(data);
        // setOriginalConfig(data);
        
        // Pour l'instant, on utilise les données par défaut
        setOriginalConfig({...config});
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    };
    
    loadConfig();
  }, []);

  useEffect(() => {
    // Vérifier si des modifications ont été apportées
    if (originalConfig) {
      const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
      setHasChanges(changed);
    }
  }, [config, originalConfig]);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      // Simuler l'appel API
      // Remplacez cette partie par votre appel API réel
      console.log('Données à sauvegarder:', config);
      
      // await fetch('/api/config', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config)
      // });
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setOriginalConfig({...config});
      setSaveStatus('success');
      setHasChanges(false);
      
      // Afficher le JSON dans la console pour vérification
      console.log('Configuration sauvegardée avec succès:', JSON.stringify(config, null, 2));
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalConfig) {
      setConfig({...originalConfig});
      setSaveStatus(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setSaveStatus('copied');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Configuration de l'Assistant</h1>
            <p className="text-gray-600 text-sm">Modifiez les paramètres de base de votre assistant IA</p>
          </div>

          {/* Formulaire */}
          <div className="space-y-6">
            {/* Nom de l'école */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'école
              </label>
              <input
                type="text"
                value={config.school_name}
                onChange={(e) => handleInputChange('school_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Entrez le nom de l'école"
              />
            </div>

            {/* Ton */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ton de la conversation
              </label>
              <input
                type="text"
                value={config.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Ex: concis, professionnel"
              />
              <p className="mt-1 text-xs text-gray-500">Définit le style de communication de l'assistant</p>
            </div>

            {/* Règles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Règles de comportement
              </label>
              <textarea
                value={config.rules}
                onChange={(e) => handleInputChange('rules', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                placeholder="Définissez les règles de comportement..."
              />
              <p className="mt-1 text-xs text-gray-500">Règles spécifiques que l'assistant doit suivre</p>
            </div>
          </div>

          {/* Indicateur de modifications */}
          {hasChanges && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">Des modifications non sauvegardées sont en attente</span>
            </div>
          )}

          {/* Messages de statut */}
          {saveStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <Check className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">Configuration sauvegardée avec succès</span>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-800">Erreur lors de la sauvegarde</span>
            </div>
          )}

          {saveStatus === 'copied' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <Check className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">JSON copié dans le presse-papiers</span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition duration-200 flex items-center justify-center ${
                isSaving || !hasChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className={`px-6 py-2.5 rounded-lg font-medium transition duration-200 ${
                !hasChanges
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }`}
            >
              Réinitialiser
            </button>

            <button
              onClick={copyToClipboard}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition duration-200 active:scale-95"
              title="Copier le JSON"
            >
              📋 JSON
            </button>
          </div>

          {/* Aperçu JSON */}
          <details className="mt-8">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
              Voir l'aperçu JSON
            </summary>
            <pre className="mt-3 p-4 bg-gray-50 rounded-lg text-xs overflow-x-auto">
              <code>{JSON.stringify(config, null, 2)}</code>
            </pre>
          </details>
        </div>

        {/* Note d'information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note :</strong> Les appels API sont actuellement simulés. 
            Remplacez les sections commentées par vos vrais endpoints dans le code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigEditor;