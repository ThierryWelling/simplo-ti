"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} App Simplo TI. Todos os direitos reservados.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary">
              Termos de Uso
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 