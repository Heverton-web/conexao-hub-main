import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Library, Filter, BookOpen, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { ManualViewer } from "@/components/knowledge/ManualViewer";
import manualsData from "@/data/manuals.json";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function KnowledgeCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedManual, setSelectedManual] = useState<any | null>(null);

  // 1. Primeiro filtramos os manuais por role (para saber quais categorias exibir)
  const accessibleManuals = (manualsData as any[]).filter((manual) => {
    const isSuperAdmin = user?.role === "super_admin";
    return isSuperAdmin || manual.roles.includes(user?.role || "user");
  });

  // 2. Extraímos as categorias únicas desses manuais acessíveis
  const availableCategories = ["all", ...new Set(accessibleManuals.map(m => m.category.toLowerCase()))];

  // 3. Filtramos pela busca e pela categoria ativa
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
    <div className="min-h-screen bg-[#050505] text-zinc-100 pb-20 relative overflow-hidden">
      {/* 🔮 Efeitos de Fundo (Blobs conforme manual_branding) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* 🌟 Banner Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f622,transparent)]" />
        
        {/* Botão de Escape Superior */}
        <div className="absolute top-8 left-8 z-20">
          <Button 
            onClick={() => navigate("/")}
            variant="outline" 
            className="bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80 gap-2 backdrop-blur-xl transition-all"
          >
            <ArrowLeft size={16} /> Voltar ao Hub
          </Button>
        </div>

        <div className="relative z-10 w-full max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20">
              <Library size={24} />
            </div>
            <span className="font-bold tracking-[0.2em] uppercase text-xs text-blue-500/80">Base de Conhecimento Premium</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500 tracking-tighter"
          >
            Central de Conhecimento
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <Input
                type="text"
                placeholder="O que você deseja aprender hoje?"
                className="w-full h-16 pl-14 pr-6 bg-zinc-900/80 border-zinc-800 focus:border-blue-500/50 rounded-2xl backdrop-blur-2xl text-xl transition-all shadow-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 📑 Filtros e Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          {availableCategories.length > 2 && (
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
              <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1.5 rounded-2xl h-auto backdrop-blur-xl">
                {availableCategories.map((cat) => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="px-8 py-2.5 rounded-xl text-sm font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.5)] capitalize transition-all"
                  >
                    {cat === "all" ? "Todos os Manuais" : cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/30 border border-zinc-800/50 text-zinc-500 text-sm font-medium backdrop-blur-md">
            <Filter size={16} className="text-blue-500" />
            <span>Exibindo <span className="text-white">{filteredManuals.length}</span> resultados</span>
          </div>
        </div>

        {/* 📚 Grid de Cards */}
        {filteredManuals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="py-32 text-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/10 backdrop-blur-sm">
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
              <BookOpen size={40} className="text-zinc-700" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Busca sem resultados</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Não encontramos nada relacionado a "{searchTerm}". Tente palavras-chave mais simples.</p>
          </div>
        )}
      </main>

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
