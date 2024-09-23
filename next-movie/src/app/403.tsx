export default function AccessDeniedPage() {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Accès interdit</h1>
        <p>Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.</p>
        <a href="/" className="text-blue-500">Retour à l&apos;accueil</a>
      </div>
    );
  }
  