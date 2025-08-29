import { useState } from "react";
import { useScenarios, useScenariosActions, type Scenario, type CreateScenarioData } from "@/hooks/useScenarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const VOICE_OPTIONS = [
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
];

const TRACK_OPTIONS = [
  { value: "rh", label: "RH" },
  { value: "comercial", label: "Comercial" },
  { value: "educacional", label: "Educacional" },
  { value: "gestao", label: "Gestão" },
];

interface ScenarioFormProps {
  scenario?: Scenario;
  onClose: () => void;
}

function ScenarioForm({ scenario, onClose }: ScenarioFormProps) {
  const { createScenario, updateScenario } = useScenariosActions();
  const [formData, setFormData] = useState<CreateScenarioData>({
    track: scenario?.track || "rh",
    name: scenario?.name || "",
    system_prompt: scenario?.system_prompt || "",
    voice_id: scenario?.voice_id || "",
    is_default: scenario?.is_default || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (scenario) {
      await updateScenario.mutateAsync({ id: scenario.id, data: formData });
    } else {
      await createScenario.mutateAsync(formData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="track">Trilha</Label>
        <Select value={formData.track} onValueChange={(value) => setFormData(prev => ({ ...prev, track: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma trilha" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border">
            {TRACK_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nome do cenário"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="system_prompt">Prompt do Sistema</Label>
        <Textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => setFormData(prev => ({ ...prev, system_prompt: e.target.value }))}
          placeholder="Descreva o comportamento da IA neste cenário..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="voice_id">Voz (ElevenLabs)</Label>
        <Select value={formData.voice_id} onValueChange={(value) => setFormData(prev => ({ ...prev, voice_id: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma voz" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border">
            {VOICE_OPTIONS.map(voice => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
        />
        <Label htmlFor="is_default">Cenário padrão para esta trilha</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createScenario.isPending || updateScenario.isPending}>
          {scenario ? "Atualizar" : "Criar"} Cenário
        </Button>
      </div>
    </form>
  );
}

export default function ScenariosAdmin() {
  const { data: scenarios = [], isLoading } = useScenarios();
  const { deleteScenario } = useScenariosActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | undefined>();

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingScenario(undefined);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cenário?")) {
      await deleteScenario.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Gerenciar Cenários</h1>
          <p className="text-muted-foreground">
            Configure cenários para as simulações de treinamento
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cenário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingScenario ? "Editar Cenário" : "Novo Cenário"}
              </DialogTitle>
            </DialogHeader>
            <ScenarioForm 
              scenario={editingScenario} 
              onClose={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cenários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trilha</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Voz</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {scenario.track}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{scenario.name}</TableCell>
                  <TableCell>
                    {VOICE_OPTIONS.find(v => v.id === scenario.voice_id)?.name || "Não definida"}
                  </TableCell>
                  <TableCell>
                    {scenario.is_default && (
                      <Badge variant="secondary">Padrão</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(scenario)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(scenario.id)}
                        disabled={deleteScenario.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}