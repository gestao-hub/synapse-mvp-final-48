import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function SetupGestaoScenarios() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const setupScenarios = async () => {
    try {
      setLoading(true);
      
      // Cenários de Gestão
      const gestaoScenarios = [
        {
          area: 'gestao',
          title: 'Reunião Estratégica Executiva',
          description: 'Defina metas trimestrais com sua equipe de liderança, alinhando objetivos e recursos.',
          role_options: ['lider', 'participante'],
          criteria: [
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 1 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 1 }
          ],
          tags: ['gestao', 'lideranca', 'planejamento'],
          persona: {
            lider: 'Você é um diretor experiente conduzindo uma reunião estratégica. Mantenha foco nos objetivos e facilite decisões.',
            participante: 'Você é um gerente sênior participando da reunião. Contribua com insights e questione quando necessário.'
          }
        },
        {
          area: 'gestao',
          title: 'Feedback Executivo',
          description: 'Conduza uma conversa de avaliação com um colaborador sobre seu desempenho anual.',
          role_options: ['gestor', 'colaborador'],
          criteria: [
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 1 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 1 },
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.8 }
          ],
          tags: ['gestao', 'feedback', 'performance'],
          persona: {
            gestor: 'Você é um líder experiente dando feedback construtivo. Seja específico, empático e orientado a soluções.',
            colaborador: 'Você é um funcionário recebendo feedback. Demonstre receptividade e faça perguntas para melhorar.'
          }
        },
        {
          area: 'gestao',
          title: 'Negociação Orçamentária',
          description: 'Apresente e negocie o orçamento de seu departamento para o próximo ano fiscal.',
          role_options: ['solicitante', 'aprovador'],
          criteria: [
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 1 },
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 0.9 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.8 }
          ],
          tags: ['gestao', 'orcamento', 'negociacao'],
          persona: {
            solicitante: 'Você é um diretor defendendo seu orçamento. Use dados convincentes e seja assertivo mas flexível.',
            aprovador: 'Você é um CFO avaliando solicitações. Questione números e priorize o ROI empresarial.'
          }
        },
        {
          area: 'gestao',
          title: 'Gestão de Crise',
          description: 'Gerencie uma crise que afeta múltiplos departamentos e requer decisões rápidas.',
          role_options: ['decisor', 'reportador'],
          criteria: [
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.9 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.8 }
          ],
          tags: ['gestao', 'crise', 'operacional'],
          persona: {
            decisor: 'Você é o CEO lidando com uma crise. Tome decisões rápidas, comunique claramente e mantenha a calma.',
            reportador: 'Você é um gerente reportando a crise. Seja objetivo, urgente e proponha soluções iniciais.'
          }
        },
        {
          area: 'gestao',
          title: 'Apresentação para Board',
          description: 'Apresente os resultados trimestrais e estratégias futuras para o conselho administrativo.',
          role_options: ['apresentador', 'conselheiro'],
          criteria: [
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.9 },
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.8 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.7 }
          ],
          tags: ['gestao', 'board', 'resultados'],
          persona: {
            apresentador: 'Você é o CEO apresentando para o board. Seja transparente, estratégico e prepare-se para questionamentos.',
            conselheiro: 'Você é um conselheiro experiente. Faça perguntas estratégicas e avalie a viabilidade dos planos.'
          }
        },
        {
          area: 'gestao',
          title: 'Mediação Interdepartamental',
          description: 'Medite um conflito entre vendas e operações sobre prazos e expectativas de entrega.',
          role_options: ['mediador', 'parte_conflitante'],
          criteria: [
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 1 },
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 0.9 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.8 },
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.9 }
          ],
          tags: ['gestao', 'conflito', 'departamentos'],
          persona: {
            mediador: 'Você é um diretor mediando o conflito. Ouça ambos os lados, mantenha neutralidade e busque soluções win-win.',
            parte_conflitante: 'Você representa um departamento no conflito. Defenda sua posição mas esteja aberto ao diálogo.'
          }
        },
        {
          area: 'gestao',
          title: 'Reestruturação Corporativa',
          description: 'Comunique e implemente uma reestruturação organizacional que afeta várias áreas.',
          role_options: ['lider_mudanca', 'afetado'],
          criteria: [
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 1 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.9 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.9 },
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 0.8 }
          ],
          tags: ['gestao', 'reestruturacao', 'mudanca'],
          persona: {
            lider_mudanca: 'Você é um VP conduzindo a reestruturação. Seja transparente, empático e focado nos benefícios futuros.',
            afetado: 'Você é um funcionário impactado pela mudança. Expresse preocupações legítimas e busque esclarecimentos.'
          }
        },
        {
          area: 'gestao',
          title: 'Decisão de Aquisição',
          description: 'Decida sobre uma grande aquisição empresarial com múltiplas variáveis e stakeholders.',
          role_options: ['ceo', 'consultor'],
          criteria: [
            { key: 'tomada_decisao', label: 'Tomada de Decisão', weight: 1 },
            { key: 'lideranca_estrategica', label: 'Liderança Estratégica', weight: 1 },
            { key: 'comunicacao_executiva', label: 'Comunicação Executiva', weight: 0.8 },
            { key: 'influencia_persuasao', label: 'Influência e Persuasão', weight: 0.7 },
            { key: 'gestao_conflitos', label: 'Gestão de Conflitos', weight: 0.6 }
          ],
          tags: ['gestao', 'estrategia', 'aquisicao'],
          persona: {
            ceo: 'Você é o CEO avaliando uma aquisição estratégica. Pese riscos, benefícios e impactos nos stakeholders.',
            consultor: 'Você é um consultor estratégico. Forneça análises objetivas, cenários e recomendações baseadas em dados.'
          }
        }
      ];

      // Primeiro, deletar cenários existentes de gestão (para evitar duplicatas)
      await supabase
        .from('scenarios')
        .delete()
        .eq('area', 'gestao');

      // Inserir os novos cenários
      const scenariosToInsert = gestaoScenarios.map(scenario => ({
        name: scenario.title,
        description: scenario.description,
        area: scenario.area,
        criteria: scenario.criteria,
        persona: scenario.persona,
        role_options: scenario.role_options,
        system_prompt: `Você é um ${scenario.persona.lider || scenario.persona.gestor || 'profissional'} experiente em ${scenario.area}.`,
        track: scenario.area.toLowerCase(),
        voice_id: "21m00Tcm4TlvDq8ikWAM"
      }));
      
      const { data, error } = await supabase
        .from('scenarios')
        .insert(scenariosToInsert);

      if (error) {
        console.error('Erro ao inserir cenários:', error);
        throw error;
      }

      setSuccess(true);
      toast({
        title: "Sucesso!",
        description: `${gestaoScenarios.length} cenários de gestão foram configurados no banco de dados.`,
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível configurar os cenários. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
            <Settings className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Configurar Cenários de Gestão</CardTitle>
          <CardDescription>
            Configure os 8 cenários de gestão estratégica no banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!success ? (
            <>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Esta ação irá:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Inserir 8 cenários de gestão executiva</li>
                  <li>Configurar perspectivas duais para cada cenário</li>
                  <li>Definir métricas específicas de liderança</li>
                  <li>Habilitar o sistema de treino orientado</li>
                </ul>
              </div>
              
              <Button 
                onClick={setupScenarios} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Database className="h-4 w-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Configurar Cenários
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-700">Configuração Concluída!</h3>
                <p className="text-sm text-muted-foreground">
                  Os cenários de gestão foram configurados com sucesso.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/app/scenarios/gestao'}
                className="w-full"
              >
                Ir para Cenários de Gestão
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}