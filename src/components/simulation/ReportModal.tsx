import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Download, FileText } from "lucide-react";

interface ReportModalProps {
  reportData: {
    userTranscript: string;
    aiTranscript: string;
    score: number;
    feedback: string;
    duration: number;
  };
  onClose: () => void;
}

export function ReportModal({ reportData, onClose }: ReportModalProps) {
  const exportPDF = () => {
    // Implementar exportação PDF
    console.log("Exportando PDF...", reportData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Relatório da Simulação</DialogTitle>
          <div className="flex gap-2">
            <Button onClick={exportPDF} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Score e Duração */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {reportData.score || 'N/A'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Duração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {Math.floor(reportData.duration / 60)}m {reportData.duration % 60}s
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transcrições */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="secondary">Usuário</Badge>
                  Transcrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {reportData.userTranscript || "Nenhuma transcrição do usuário disponível"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline">IA</Badge>
                  Transcrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {reportData.aiTranscript || "Nenhuma transcrição da IA disponível"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback */}
          {reportData.feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {reportData.feedback}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}