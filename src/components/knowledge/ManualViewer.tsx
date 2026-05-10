import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, X, ChevronRight, FileText, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Section {
  id: string;
  title: string;
  path: string;
  type: "md" | "html";
}

interface ManualViewerProps {
  isOpen: boolean;
  onClose: () => void;
  manualTitle: string;
  sections: Section[];
}

export const ManualViewer: React.FC<ManualViewerProps> = ({ 
  isOpen, 
  onClose, 
  manualTitle,
  sections
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || "");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  useEffect(() => {
    if (isOpen && activeSection) {
      setLoading(true);
      fetch(activeSection.path)
        .then((res) => res.text())
        .then((text) => {
          setContent(text);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao carregar manual:", err);
          setContent("Erro ao carregar o conteúdo do manual.");
          setLoading(false);
        });
    }
  }, [isOpen, activeSectionId, activeSection]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Código copiado!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Componentes customizados para o ReactMarkdown (Estilo Notion)
  const MarkdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-black mt-8 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tighter border-b border-zinc-800/50 pb-4">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-zinc-100 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-500 rounded-full" />
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-zinc-200">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-zinc-400 text-lg leading-relaxed mb-6">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-2 mb-6 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-3 mb-6 ml-4 list-decimal marker:text-blue-500 marker:font-bold">
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => {
      // Verifica se o conteúdo é uma checkbox (GFM)
      const content = React.Children.toArray(children);
      const isTask = props.className?.includes('task-list-item');
      
      return (
        <li className={cn("text-zinc-400 text-lg", !isTask && "flex items-start gap-3")}>
          {!isTask && <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500/50 shrink-0" />}
          <div className="flex-1">{children}</div>
        </li>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      if (!inline && match) {
        return (
          <div className="relative group my-8">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {match[1]}
                </span>
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {copiedCode === codeString ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  background: "transparent",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono text-sm border border-blue-500/10">
          {children}
        </code>
      );
    },
    table: ({ children }: any) => (
      <div className="my-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20">
        <table className="w-full text-left border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-zinc-800/50 text-zinc-200 text-sm font-bold uppercase tracking-wider">
        {children}
      </thead>
    ),
    th: ({ children }: any) => (
      <th className="px-6 py-4 border-b border-zinc-800">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-6 py-4 border-b border-zinc-800 text-zinc-400 text-sm">
        {children}
      </td>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 pl-6 border-l-4 border-blue-500/50 italic text-zinc-300 bg-blue-500/5 py-4 rounded-r-xl">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-12 border-zinc-800/50" />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] bg-transparent border-none p-0 overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* 💠 Fundo Liquid Glass */}
        <div className="absolute inset-0 bg-[#050505] border border-zinc-800/50 rounded-3xl -z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none" />
        
        {/* 🔝 Header */}
        <DialogHeader className="p-6 border-b border-zinc-800/50 flex flex-row items-center justify-between space-y-0 shrink-0 backdrop-blur-xl bg-black/40">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/20">
              <FileText size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                {manualTitle}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium">
                Central de Conhecimento • {activeSection?.title}
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex gap-2" />
        </DialogHeader>

        {/* 📚 Corpo Principal (Índice + Conteúdo) */}
        <div className="flex-1 flex overflow-hidden">
          {/* 📑 Sidebar de Índice */}
          <aside className="w-80 border-r border-zinc-800/50 bg-black/40 hidden md:flex flex-col p-6 backdrop-blur-xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6 px-2">
              Navegação do Manual
            </div>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group",
                      activeSectionId === section.id 
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                    )}
                  >
                    <span className="truncate">{section.title}</span>
                    <ChevronRight 
                      size={14} 
                      className={cn(
                        "transition-all duration-300",
                        activeSectionId === section.id ? "text-blue-500 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>

          {/* 📄 Visualizador de Conteúdo */}
          <main className="flex-1 relative bg-black/20">
            <ScrollArea className="h-full">
              <div className="max-w-4xl mx-auto p-12 lg:p-20">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-zinc-500 font-medium animate-pulse tracking-widest uppercase text-xs">Sincronizando conteúdo...</span>
                  </div>
                ) : activeSection?.type === "html" ? (
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl h-[800px] border border-zinc-800">
                    <iframe 
                      srcDoc={content} 
                      className="w-full h-full border-none"
                      title={activeSection.title}
                    />
                  </div>
                ) : (
                  <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents as any}
                    >
                      {content}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </ScrollArea>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
};
