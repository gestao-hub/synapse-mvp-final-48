import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  success: boolean;
  filename?: string;
  total_chunks?: number;
  chunks_processed?: number;
  error?: string;
}

export default function Uploads() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['.txt', '.pdf', '.docx'];
      const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
      
      if (!allowedTypes.some(type => type.includes(fileExtension || ''))) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: "Por favor, selecione um arquivo TXT, PDF ou DOCX",
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setResult(null);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Call edge function
      const response = await fetch(
        'https://roboonbdessuipvcpgve.supabase.co/functions/v1/embed-doc',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      const data: UploadResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no processamento');
      }

      setResult(data);
      
      if (data.success) {
        toast({
          title: "Upload concluído!",
          description: `Arquivo processado em ${data.chunks_processed} chunks`,
        });
      }

    } catch (error) {
      console.error('Erro no upload:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setResult(null);
    setIsUploading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Upload de Documentos</h1>
          <p className="text-muted-foreground">
            Faça upload de documentos para usar como contexto nas simulações com RAG
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Selecionar Arquivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                id="document"
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground">
                Suporte a arquivos TXT, PDF e DOCX (máx. 10MB)
              </p>
            </div>

            {file && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Arquivo selecionado:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </AlertDescription>
              </Alert>
            )}

            {file && !isUploading && !result && (
              <Button onClick={handleUpload} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Processar Documento
              </Button>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processando documento...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {result.success ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Upload concluído!</strong>
                      <br />
                      Arquivo: {result.filename}
                      <br />
                      Chunks processados: {result.chunks_processed} de {result.total_chunks}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Erro no processamento:</strong>
                      <br />
                      {result.error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={resetUpload} variant="outline" className="w-full">
                  Novo Upload
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como usar o RAG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Faça upload dos seus documentos de treinamento</p>
              <p>2. Nas páginas Live (RH, Comercial, Educacional), marque a opção "Usar RAG"</p>
              <p>3. A IA usará o conteúdo dos documentos como contexto adicional</p>
              <p>4. Isso permite respostas mais precisas baseadas no seu conteúdo específico</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}