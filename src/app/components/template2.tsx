export default function TemplateModern() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-600 to-purple-900 text-white">
      <div className="flex flex-col items-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Foto do Usuário"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <h1 className="text-3xl font-bold mt-4">Seu Nome Aqui</h1>
        <p className="text-gray-300">Empreendedor | Criador de Conteúdo | Designer</p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <a href="#" className="px-6 py-3 bg-white text-indigo-700 rounded-md shadow-md text-center w-64">
          Meu Site
        </a>
        <a href="#" className="px-6 py-3 bg-white text-indigo-700 rounded-md shadow-md text-center w-64">
          Canal do YouTube
        </a>
        <a href="#" className="px-6 py-3 bg-white text-indigo-700 rounded-md shadow-md text-center w-64">
          Loja Online
        </a>
      </div>

      <footer className="mt-12 text-sm text-gray-300">
        Criado com <span className="text-red-300">♥</span> no Linkiwi
      </footer>
    </div>
  );
}