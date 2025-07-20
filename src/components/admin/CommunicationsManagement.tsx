import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Edit, Trash2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Communication } from '@/types/auth';
import { getCommunications, saveCommunications, addCommunication } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const CommunicationsManagement = () => {
  const [communications, setCommunications] = useState<Communication[]>(getCommunications());
  const [editingCommunication, setEditingCommunication] = useState<Communication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as Communication['priority'],
    author: 'Administração'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      author: 'Administração'
    });
    setEditingCommunication(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCommunication) {
      // Update existing communication
      const updatedCommunications = communications.map(comm =>
        comm.id === editingCommunication.id
          ? { ...comm, ...formData, date: editingCommunication.date }
          : comm
      );
      saveCommunications(updatedCommunications);
      setCommunications(updatedCommunications);
      toast({
        title: "Comunicado atualizado",
        description: "As alterações foram salvas com sucesso"
      });
    } else {
      // Create new communication
      const newCommunication = addCommunication({
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        author: formData.author,
        date: new Date().toISOString()
      });
      setCommunications(getCommunications());
      toast({
        title: "Comunicado publicado",
        description: "O comunicado foi enviado para todos os moradores"
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (communication: Communication) => {
    setEditingCommunication(communication);
    setFormData({
      title: communication.title,
      content: communication.content,
      priority: communication.priority,
      author: communication.author
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (communicationId: string) => {
    const updatedCommunications = communications.filter(comm => comm.id !== communicationId);
    saveCommunications(updatedCommunications);
    setCommunications(updatedCommunications);
    toast({
      title: "Comunicado removido",
      description: "O comunicado foi deletado do sistema"
    });
  };

  const getPriorityBadge = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-destructive text-destructive-foreground">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Média</Badge>;
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getPriorityIcon = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'low':
        return <Info className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Gerenciamento de Comunicados</span>
            </CardTitle>
            <CardDescription>
              Crie e gerencie comunicados para os moradores
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Comunicado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCommunication ? 'Editar Comunicado' : 'Novo Comunicado'}
                </DialogTitle>
                <DialogDescription>
                  {editingCommunication 
                    ? 'Atualize as informações do comunicado' 
                    : 'Crie um novo comunicado para os moradores'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do comunicado"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value: Communication['priority']) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="author">Autor</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Ex: Administração, Síndico, etc."
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Digite o conteúdo do comunicado..."
                    className="min-h-32"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-primary">
                    {editingCommunication ? 'Atualizar' : 'Publicar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {communications.map((communication) => (
            <Card key={communication.id} className="border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(communication.priority)}
                      <CardTitle className="text-lg">{communication.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Por: {communication.author}</span>
                      <span>•</span>
                      <span>{new Date(communication.date).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      {getPriorityBadge(communication.priority)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(communication)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(communication.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{communication.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {communications.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum comunicado publicado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};