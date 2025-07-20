import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, Clock, LogIn, LogOut, Filter } from 'lucide-react';
import { Visitor } from '@/types/auth';
import { getVisitors, saveVisitors, addVisitor } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const VisitorsList = () => {
  const [visitors, setVisitors] = useState<Visitor[]>(getVisitors());
  const [filter, setFilter] = useState<'all' | 'inside' | 'left'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    residenceNumber: '',
    entryTime: new Date().toTimeString().slice(0, 5)
  });

  const filteredVisitors = visitors.filter(visitor => {
    if (filter === 'all') return true;
    return visitor.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVisitor = addVisitor({
      name: formData.name,
      residenceNumber: formData.residenceNumber,
      entryTime: formData.entryTime,
      date: new Date().toISOString().split('T')[0],
      status: 'inside'
    });
    
    setVisitors(getVisitors());
    setFormData({
      name: '',
      residenceNumber: '',
      entryTime: new Date().toTimeString().slice(0, 5)
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Visitante registrado",
      description: `${newVisitor.name} foi registrado com sucesso`
    });
  };

  const handleExit = (visitorId: string) => {
    const updatedVisitors = visitors.map(visitor =>
      visitor.id === visitorId
        ? {
            ...visitor,
            status: 'left' as const,
            exitTime: new Date().toTimeString().slice(0, 5)
          }
        : visitor
    );
    
    saveVisitors(updatedVisitors);
    setVisitors(updatedVisitors);
    
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

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5" />
              <span>Controle de Visitantes</span>
            </CardTitle>
            <CardDescription>
              Registre entradas e saídas de visitantes
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="inside">No condomínio</SelectItem>
                <SelectItem value="left">Saíram</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <LogIn className="w-4 h-4 mr-2" />
                  Registrar Entrada
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Visitante</DialogTitle>
                  <DialogDescription>
                    Registre a entrada de um novo visitante
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="visitorName">Nome do Visitante</Label>
                    <Input
                      id="visitorName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="residenceNumber">Unidade Visitada</Label>
                    <Input
                      id="residenceNumber"
                      placeholder="101, 102..."
                      value={formData.residenceNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, residenceNumber: e.target.value }))}
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
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitante</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell className="font-medium">{visitor.name}</TableCell>
                <TableCell>Apt {visitor.residenceNumber}</TableCell>
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
        
        {filteredVisitors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Nenhum visitante registrado' : 
               filter === 'inside' ? 'Nenhum visitante no condomínio' : 
               'Nenhum visitante saiu hoje'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};