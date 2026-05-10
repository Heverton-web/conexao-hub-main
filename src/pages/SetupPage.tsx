import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Shield, Rocket, Mail, Lock, User, CheckCircle2, Loader2, AlertTriangle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { colorMix } from '../lib/utils';
import { useBrand } from '../contexts/BrandContext';

export const SetupPage: React.FC = () => {
  const { config } = useBrand();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'super_admin'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Garantir perfil como super_admin no banco
        // Nota: O trigger handle_new_user pode estar configurado, 
        // mas forçamos aqui para garantir o bootstrap correto.
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          name,
          email,
          role: 'super_admin',
          status: 'active',
          preferences: { theme: 'dark', language: 'pt-br' }
        });

        if (profileError) throw profileError;

        // 3. Inicializar system_config se não existir
        const { data: existingConfig } = await supabase.from('system_config').select('id').limit(1);
        if (!existingConfig || existingConfig.length === 0) {
          await supabase.from('system_config').insert({
            id: 1,
            app_name: 'Hub Conexão',
            updated_at: new Date().toISOString()
          });
        }
      }

      setIsSuccess(true);
      toast.success("Super Admin criado com sucesso!");
      
      // Recarregar após 2 segundos para entrar na aplicação
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err: any) {
      console.error("Erro no setup:", err);
      setError(err.message || "Erro ao configurar administrador inicial.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] p-4">
        <div className="w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/10">
            <CheckCircle2 size={48} className="text-green-500 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-white">Tudo Pronto!</h1>
          <p className="text-zinc-400">O sistema foi inicializado com sucesso. Redirecionando para o painel...</p>
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Blobs */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="w-full max-w-[500px] relative z-10">
        <div className="backdrop-blur-2xl bg-zinc-900/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-8">
          
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:rotate-6 transition-transform">
              <Shield size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Setup Inicial</h1>
              <p className="text-zinc-400 text-sm">Crie a conta do <b>Super Administrador</b> para começar a usar seu Hub White Label.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle className="shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSetup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Nome do Administrador</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  placeholder="Ex: Admin Mestre"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email de Acesso</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="admin@exemplo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Senha Mestra</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="Min. 6 caracteres"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <Rocket size={20} />
                  <span>Inicializar Hub</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
              Powered by Conexão Hub Engine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
