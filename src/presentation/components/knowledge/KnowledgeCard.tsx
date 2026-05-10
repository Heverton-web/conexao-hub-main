import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface KnowledgeCardProps {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  onClick: () => void;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  title,
  description,
  iconName,
  category,
  onClick
}) => {
  // @ts-ignore
  const Icon = LucideIcons[iconName] || LucideIcons.Book;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group relative p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-md flex flex-col h-full cursor-pointer overflow-hidden"
    >
      {/* 🔮 Efeito de Vidro Líquido no Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-zinc-800 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <span className="px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-blue-300 transition-colors">
          {category}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      
      <p className="text-zinc-400 text-sm mb-6 flex-1 line-clamp-3">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
        <div className="flex items-center text-zinc-500 text-xs gap-1">
          <Clock size={12} />
          <span>~5 min leitura</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={onClick}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 gap-2 p-0 h-auto font-semibold"
        >
          Acessar <ArrowRight size={16} />
        </Button>
      </div>
    </motion.div>
  );
};
