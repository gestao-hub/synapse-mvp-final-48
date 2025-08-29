import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    mensagem: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Enviando formulário de contato...');
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        toast({
          title: "Erro ao enviar mensagem",
          description: error.message || "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      console.log('Email enviado com sucesso:', data);
      setIsSubmitted(true);
      
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu interesse. Entraremos em contato em breve.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          nome: '',
          email: '',
          empresa: '',
          telefone: '',
          mensagem: ''
        });
      }, 3000);

    } catch (error: any) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen bg-midnight text-white">
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#d946ef] via-[#3b82f6] to-[#00d9ff] bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Estamos aqui para ajudar você a transformar o treinamento da sua empresa. 
            Entre em contato conosco e descubra como podemos atender às suas necessidades.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Formulário de Contato */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Envie sua Mensagem</h2>
            
            {isSubmitted ? <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto text-spring mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Mensagem Enviada!</h3>
                <p className="text-white/70">
                  Obrigado pelo seu interesse. Entraremos em contato em breve.
                </p>
              </div> : <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-white mb-2">
                      Nome *
                    </label>
                    <input type="text" id="nome" name="nome" required value={formData.nome} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple" placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      E-mail *
                    </label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple" placeholder="seu@email.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="empresa" className="block text-sm font-medium text-white mb-2">
                      Empresa
                    </label>
                    <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple" placeholder="Nome da sua empresa" />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-white mb-2">
                      Telefone
                    </label>
                    <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple" placeholder="(11) 99999-9999" />
                  </div>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-white mb-2">
                    Mensagem *
                  </label>
                  <textarea id="mensagem" name="mensagem" required rows={5} value={formData.mensagem} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple resize-none" placeholder="Conte-nos sobre suas necessidades de treinamento..." />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>}
          </div>

          {/* Informações de Contato */}
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Informações de Contato</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-purple mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">E-mail</h3>
                    <p className="text-white/70">contato@excluvia.com</p>
                    
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-spring mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Telefone</h3>
                    <p className="text-white/70">+ 55 (43) 98863-2392</p>
                    <p className="text-white/70">+55 (11) 3333-3333</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-purple mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Endereço</h3>
                    <p className="text-white/70">
                      Av. Curitiba, 3<br />
                      Apucarana - PR<br />
                      CEP: 86800-005
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-spring mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">Horário de Atendimento</h3>
                    <p className="text-white/70">
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 13h<br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-bold text-white mb-4">Atendimento Especializado</h3>
              <p className="text-white/70 mb-6">
                Nossa equipe de especialistas está pronta para entender suas necessidades específicas 
                e propor a melhor solução para sua empresa.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-spring" />
                  <span className="text-white/70">Consultoria gratuita</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-spring" />
                  <span className="text-white/70">Demonstração personalizada</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-spring" />
                  <span className="text-white/70">Suporte técnico dedicado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-spring" />
                  <span className="text-white/70">Implementação assistida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
}