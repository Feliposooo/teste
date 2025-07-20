import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Clock, LogIn, LogOut, Plus } from 'lucide-react';
import { Visitor } from '@/types/auth';
import { getVisitors, saveVisitors, addVisitor } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const VisitorManagement = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>(
    getVisitors().filter(v => v.residenceNumber === user?.residenceNumber)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    entryTime: new Date().toTimeString().slice(0, 5)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.residenceNumber) return;
    
    const newVisitor = addVisitor({
      name: formData.name,
      residenceNumber: user.residenceNumber,
      entryTime: formData.entryTime,
      date: new Date().toISOString().split('T')[0],
      status: 'inside'
    });
    
    setVisitors(getVisitors().filter(v => v.residenceNumber === user.residenceNumber));
    setFormData({
      name: '',
      entryTime: new Date().toTimeString().slice(0, 5)
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Visitante registrado",
      description: `${newVisitor.name} foi registrado com sucesso`
    });
  };

  const handleExit = (visitorId: string) => {
    const allVisitors = getVisitors();
    const updatedVisitors = allVisitors.map(visitor =>
      visitor.id === visitorId
        ? {
            ...visitor,
            status: 'left' as const,
            exitTime: new Date().toTimeString().slice(0, 5)
          }
        : visitor
    );
    
    saveVisitors(updatedVisitors);
    setVisitors(updatedVisitors.filter(v => v.residenceNumber === user?.residenceNumber));
    
    const visitor = visitors.find(v => v.id === visitorId);
    toast({
      title: "Saída registrada",
      description: `${visitor?.name} saiu do condomínio`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inside':
        return <Badge className="bg-success text-success-foreground">No condomínio</Badge>;
      case 'left':
        return <Badge variant="outline">Saiu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show only recent visitors (last 7 days)
  const recentVisitors = visitors.filter(visitor => {
    const visitorDate = new Date(visitor.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return visitorDate >= weekAgo;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5" />
              <span>Meus Visitantes</span>
            </CardTitle>
            <CardDescription>
              Registre e acompanhe seus visitantes
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Visitante
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Visitante</DialogTitle>
                <DialogDescription>
                  Informe os dados do seu visitante
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="visitorName">Nome do Visitante</Label>
                  <Input
                    id="visitorName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="entryTime">Horário de Entrada</Label>
                  <Input
                    id="entryTime"
                    type="time"
                    value={formData.entryTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryTime: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Unidade:</strong> {user?.residenceNumber}
                  </p>
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
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitante</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentVisitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell className="font-medium">{visitor.name}</TableCell>
                <TableCell>{new Date(visitor.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-success" />
                    {visitor.entryTime}
                  </div>
                </TableCell>
                <TableCell>
                  {visitor.exitTime ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                      {visitor.exitTime}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                <TableCell className="text-right">
                  {visitor.status === 'inside' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExit(visitor.id)}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Registrar Saída
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {recentVisitors.length === 0 && (
          <div className="text-center py-8">
            <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum visitante registrado nos últimos 7 dias</p>
            <p className="text-sm text-muted-foreground mt-2">
              Use o botão "Registrar Visitante" para adicionar um novo visitante
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};