export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
            
          <div className="flex space-x-6">
            <a href="/" className="hover:text-gray-400">Accueil</a>
            <a href="/about" className="hover:text-gray-400">À propos</a>
            <a href="/contact" className="hover:text-gray-400">Contact</a>
          </div>
  
  
          <div className="text-sm">
            &copy; Copyrigth {new Date().getFullYear()} Next Movie. Tous droits réservés.
          </div>
        </div>
      </footer>
    );
  }
  