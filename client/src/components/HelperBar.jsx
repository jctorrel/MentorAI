import React from "react";

function HelperBar({ studentEmail }) {
  return (
    <div className="helper-bar">
      <div>
        Connecté en tant que{" "}
        <span className="email-label">{studentEmail}</span>
      </div>
      <div>
        Le mentor peut commettre des erreurs. Il est recommandé de vérifier les
        informations importantes ou de demander à l&apos;équipe de la NWS.
      </div>
    </div>
  );
}

export default HelperBar;
