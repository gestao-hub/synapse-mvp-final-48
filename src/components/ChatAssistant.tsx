import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '👋 Olá! Sou o assistente do Synapse. Como posso ajudar você a conhecer melhor nossa plataforma de simulações empresariais com IA?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('synapse-chat-assistant', {
        body: { 
          message: input,
          context: {
            timestamp: new Date().toISOString(),
            messageCount: messages.length
          }
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Erro no chat",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 shadow-2xl hover:shadow-3xl transition-all duration-300 group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <span className="sr-only">Assistente Synapse</span>
          </Button>
        </DialogTrigger>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-foreground text-background px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Assistente Synapse
        </div>

        <DialogContent className="sm:max-w-lg h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-lg font-semibold">Assistente Synapse</DialogTitle>
            <p className="text-sm text-muted-foreground">Tire suas dúvidas sobre nossa plataforma</p>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Digitando...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua dúvida sobre o Synapse..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by IA • Respostas em tempo real
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}