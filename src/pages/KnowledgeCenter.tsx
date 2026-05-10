import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Library, Filter, BookOpen, ArrowLeft, ChevronRight, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { ManualViewer } from "@/components/knowledge/ManualViewer";
import manualsData from "@/data/manuals.json";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function KnowledgeCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedManual, setSelectedManual] = useState<any | null>(null);

  // 1. Filtramos os manuais por role
  const accessibleManuals = (manualsData as any[]).filter((manual) => {
    const isSuperAdmin = user?.role === "super_admin";
    return isSuperAdmin || manual.roles.includes(user?.role || "user");
  });

  // 2. Categorias únicas
  const availableCategories = ["all", ...new Set(accessibleManuals.map(m => m.category.toLowerCase()))];

  // 3. Filtro final
  const filteredManuals = accessibleManuals.filter((manual) => {
    if (activeCategory !== "all" && manual.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    const matchesSearch = 
      manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 relative overflow-hidden flex flex-col">
      {/* 🔮 Efeitos de Fundo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* 🔝 Top Header (Simétrico) */}
      <header className="relative z-20 border-b border-zinc-800/50 bg-black/40 backdrop-blur-xl flex items-center h-20 shrink-0">
        {/* Lado Esquerdo - Alinhado com a Sidebar */}
        <div className="w-72 px-8 flex items-center border-r border-zinc-800/50 h-full">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-bold text-sm tracking-tight">Voltar ao Hub</span>
          </button>
        </div>

        {/* Centro - Barra de Busca */}
        <div className="flex-1 px-12">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              type="text"
              placeholder="Pesquisar nos manuais..."
              className="w-full bg-zinc-900/30 border-zinc-800/50 focus:border-blue-500/30 rounded-2xl pl-12 h-12 transition-all text-sm outline-none text-white focus:ring-1 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lado Direito - Título da Página */}
        <div className="px-8 flex items-center gap-4 border-l border-zinc-800/50 h-full min-w-[280px] justify-end">
          <div className="text-right hidden sm:block">
            <h1 className="text-lg font-black tracking-tighter text-white uppercase">MANUAIS DE INSTRUÇÃO</h1>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Conexão Hub</p>
          </div>
          <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
            <Library className="text-blue-500" size={20} />
          </div>
        </div>
      </header>

      {/* 📚 Main Content (Sidebar + Grid) */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* 📑 Sidebar de Categorias */}
        <aside className="w-72 border-r border-zinc-800/50 bg-black/20 backdrop-blur-md hidden lg:flex flex-col p-6 overflow-y-auto shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-8 px-4">
            Categorias
          </div>
          
          <nav className="space-y-1">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group text-left",
                  activeCategory === cat 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Hash size={16} className={activeCategory === cat ? "text-blue-500" : "text-zinc-700 group-hover:text-zinc-500"} />
                  <span className="capitalize truncate">{cat === "all" ? "Todos os Manuais" : cat}</span>
                </div>
                {activeCategory === cat && <ChevronRight size={14} className="text-blue-500 shrink-0" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10">
              <BookOpen className="text-blue-500 mb-4" size={24} />
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Precisa de ajuda com algum processo técnico? Use nossa IA no chat.
              </p>
            </div>
          </div>
        </aside>

        {/* 📄 Grid de Manuais */}
        <main className="flex-1 overflow-y-auto p-8 sm:p-12 scrollbar-hide bg-black/10">
          <div className="max-w-6xl mx-auto">
            
            {/* Header da Seção */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-black text-white capitalize mb-2 tracking-tight">
                  {activeCategory === "all" ? "Biblioteca" : activeCategory}
                </h2>
                <p className="text-zinc-500 font-medium">
                  Encontramos {filteredManuals.length} manuais disponíveis para o seu perfil.
                </p>
              </div>
              
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <Filter size={14} className="text-blue-500" />
                <span>Resultados Ativos</span>
              </div>
            </div>

            {/* Grid */}
            {filteredManuals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                {filteredManuals.map((manual) => (
                  <KnowledgeCard
                    key={manual.id}
                    id={manual.id}
                    title={manual.title}
                    description={manual.description}
                    iconName={manual.icon}
                    category={manual.category}
                    onClick={() => setSelectedManual(manual)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border-2 border-dashed border-zinc-800/50 rounded-[3rem] bg-zinc-900/10 backdrop-blur-sm">
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                  <BookOpen size={40} className="text-zinc-700" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Sem resultados</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">Não encontramos nada relacionado à sua busca nesta categoria.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🔍 Visualizador de Manual (Modal) */}
      <ManualViewer
        isOpen={!!selectedManual}
        onClose={() => setSelectedManual(null)}
        manualTitle={selectedManual?.title || ""}
        sections={selectedManual?.sections || []}
      />
    </div>
  );
}
