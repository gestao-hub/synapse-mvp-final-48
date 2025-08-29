import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck } from 'lucide-react';

interface RoleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleOptions: string[];
  onRoleSelect: (role: string) => void;
  scenarioTitle: string;
  scenarioDescription: string;
}

const roleLabels: Record<string, string> = {
  // Gestão
  'lider': 'Líder',
  'participante': 'Participante',
  'gestor': 'Gestor',
  'colaborador': 'Colaborador', 
  'solicitante': 'Solicitante',
  'aprovador': 'Aprovador',
  'decisor_gestao': 'Decisor',
  'reportador': 'Reportador',
  'apresentador': 'Apresentador',
  'conselheiro': 'Conselheiro',
  'mediador_gestao': 'Mediador',
  'parte_conflitante': 'Parte Conflitante',
  'lider_mudanca': 'Líder de Mudança',
  'afetado': 'Afetado',
  'ceo': 'CEO',
  'consultor': 'Consultor',
  
  // Comercial
  'vendedor': 'Vendedor',
  'comprador': 'Comprador',
  'fornecedor': 'Fornecedor',
  'cliente': 'Cliente',
  'decisor': 'Decisor',
  'account_manager': 'Account Manager',
  'cliente_vip': 'Cliente VIP',
  'prospect': 'Prospect',
  'cliente_renovacao': 'Cliente (Renovação)',
  'cliente_atual': 'Cliente Atual',
  
  // RH
  'entrevistador': 'Entrevistador',
  'candidato': 'Candidato',
  'rh_gestor': 'Gestor de RH',
  'funcionario': 'Funcionário',
  'mediador': 'Mediador',
  'envolvido': 'Envolvido',
  'avaliador': 'Avaliador',
  'avaliado': 'Avaliado',
  'rh_disciplinar': 'RH (Disciplinar)',
  'funcionario_advertido': 'Funcionário',
  'rh_onboarding': 'RH (Onboarding)',
  'novo_funcionario': 'Novo Funcionário',
  'lider_comunicacao': 'Líder',
  'equipe_impactada': 'Equipe',
  
  // Educacional
  'professor': 'Professor',
  'aluno': 'Aluno',
  'tutor': 'Tutor',
  'estudante': 'Estudante',
  'aluno_apresentador': 'Aluno (Apresentador)',
  'banca_avaliadora': 'Banca Avaliadora',
  'coordenador': 'Coordenador',
  'orientador': 'Orientador',
  'orientando': 'Orientando',
  'mediador_educacional': 'Mediador',
  'estudante_conflito': 'Estudante',
  'professor_avaliador': 'Professor (Avaliador)',
  'aluno_autor': 'Aluno (Autor)',
  'instrutor_capacitacao': 'Instrutor',
  'professor_capacitando': 'Professor'
};

const roleDescriptions: Record<string, string> = {
  // Gestão
  'lider': 'Conduza reuniões estratégicas e tome decisões executivas',
  'participante': 'Contribua com insights e questione decisões',
  'gestor': 'Forneça feedback construtivo e desenvolva sua equipe',
  'colaborador': 'Receba feedback e demonstre crescimento profissional',
  'solicitante': 'Defenda seu orçamento com dados convincentes',
  'aprovador': 'Avalie solicitações com critério financeiro',
  'decisor_gestao': 'Tome decisões rápidas em situações de crise',
  'decisor': 'Tome decisões rápidas em situações de crise',
  'reportador': 'Comunique problemas com clareza e urgência',
  'apresentador': 'Apresente resultados para stakeholders executivos',
  'conselheiro': 'Questione estratégias e avalie viabilidade',
  'mediador_gestao': 'Resolva conflitos entre departamentos',
  'mediador': 'Mantenha neutralidade e busque soluções',
  'parte_conflitante': 'Defenda sua posição departamental',
  'lider_mudanca': 'Conduza reestruturações organizacionais',
  'afetado': 'Expresse preocupações sobre mudanças',
  'ceo': 'Avalie decisões estratégicas de alto impacto',
  'consultor': 'Forneça análises objetivas e recomendações',
  
  // Comercial
  'vendedor': 'Conduza vendas consultivas e demonstre valor',
  'comprador': 'Avalie propostas com critério empresarial',
  'fornecedor': 'Negocie condições mantendo margens',
  'cliente': 'Busque valor e melhores condições',
  'account_manager': 'Gerencie relacionamentos estratégicos',
  'cliente_vip': 'Exija tratamento diferenciado',
  'prospect': 'Avalie oportunidades com ceticismo',
  'cliente_renovacao': 'Negocie melhores condições na renovação',
  'cliente_atual': 'Considere expansões que agreguem valor',
  
  // RH
  'entrevistador': 'Avalie competências técnicas e comportamentais',
  'candidato': 'Demonstre qualificações através de exemplos',
  'rh_gestor': 'Conduza processos com empatia e profissionalismo',
  'funcionario': 'Expresse suas perspectivas e preocupações',
  'envolvido': 'Expresse seu ponto de vista no conflito',
  'avaliador': 'Conduza avaliações objetivas e construtivas',
  'avaliado': 'Participe ativamente e aceite feedback',
  'rh_disciplinar': 'Aplique medidas disciplinares com justiça',
  'funcionario_advertido': 'Demonstre compreensão e comprometimento',
  'rh_onboarding': 'Facilite integração e esclareça expectativas',
  'novo_funcionario': 'Demonstre proatividade e absorva informações',
  'lider_comunicacao': 'Comunique mudanças com transparência',
  'equipe_impactada': 'Busque esclarecimentos sobre o futuro',
  
  // Educacional
  'professor': 'Ensine com clareza e mantenha engajamento',
  'aluno': 'Participe ativamente e faça perguntas',
  'tutor': 'Adapte abordagem ao ritmo do estudante',
  'estudante': 'Seja honesto sobre dificuldades',
  'aluno_apresentador': 'Defenda seu projeto com confiança',
  'banca_avaliadora': 'Avalie profundidade e ofereça feedback',
  'coordenador': 'Colabore para encontrar soluções pedagógicas',
  'orientador': 'Guie metodologicamente a pesquisa',
  'orientando': 'Apresente ideias e aceite direcionamento',
  'mediador_educacional': 'Foque no aprendizado e convivência',
  'estudante_conflito': 'Expresse perspectiva mas esteja aberto',
  'professor_avaliador': 'Ofereça feedback específico e construtivo',
  'aluno_autor': 'Escute feedback e planeje melhorias',
  'instrutor_capacitacao': 'Demonstre benefícios práticos',
  'professor_capacitando': 'Questione aplicações práticas'
};

export function RoleSelector({ 
  open, 
  onOpenChange, 
  roleOptions, 
  onRoleSelect, 
  scenarioTitle,
  scenarioDescription 
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Escolha sua Perspectiva
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{scenarioTitle}</h3>
            <p className="text-muted-foreground">{scenarioDescription}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Selecione seu papel na simulação:</h4>
            
            <div className="grid gap-3">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    selectedRole === role 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedRole === role ? "default" : "secondary"}>
                          {roleLabels[role] || role}
                        </Badge>
                        {selectedRole === role && (
                          <UserCheck className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {roleDescriptions[role] || 'Perspectiva específica para esta simulação'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedRole}
              className="min-w-[120px]"
            >
              Iniciar Simulação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}