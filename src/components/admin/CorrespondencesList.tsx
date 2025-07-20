import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Check, Filter, Truck, Mail, Utensils } from 'lucide-react';
import { Correspondence } from '@/types/auth';
import { getCorrespondences, saveCorrespondences, addCorrespondence } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const CorrespondencesList = () => {
  const [correspondences, setCorrespondences] = useState<Correspondence[]>(getCorrespondences());
  const [filter, setFilter] = useState<'all' | 'waiting' | 'delivered'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    residenceNumber: '',
    type: 'package' as Correspondence['type'],
    description: ''
  });

  const filteredCorrespondences = correspondences.filter(correspondence => {
    if (filter === 'all') return true;
    return correspondence.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCorrespondence = addCorrespondence({
      residenceNumber: formData.residenceNumber,
      type: formData.type,
      description: formData.description,
      date: new Date().toISOString(),
      status: 'waiting'
    });
    
    setCorrespondences(getCorrespondences());
    setFormData({
      residenceNumber: '',
      type: 'package',
      description: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Correspondência registrada",
      description: `Item cadastrado para o Apt ${newCorrespondence.residenceNumber}`
    });
  };

  const handleDelivery = (correspondenceId: string) => {
    const updatedCorrespondences = correspondences.map(correspondence =>
      correspondence.id === correspondenceId
        ? {
            ...correspondence,
            status: 'delivered' as const,
            deliveredAt: new Date().toISOString()
          }
        : correspondence
    );
    
    saveCorrespondences(updatedCorrespondences);
    setCorrespondences(updatedCorrespondences);
    
    const correspondence = correspondences.find(c => c.id === correspondenceId);
    toast({
      title: "Entrega confirmada",
      description: `Item do Apt ${correspondence?.residenceNumber} foi entregue`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-warning text-warning-foreground">Aguardando</Badge>;
      case 'delivered':
        return <Badge className="bg-success text-success-foreground">Entregue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: Correspondence['type']) => {
    switch (type) {
      case 'package':
        return <Package className="w-4 h-4" />;
      case 'letter':
        return <Mail className="w-4 h-4" />;
      case 'food_delivery':
        return <Utensils className="w-4 h-4" />;
      default:
        return <Truck className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: Correspondence['type']) => {
    switch (type) {
      case 'package':
        return 'Encomenda';
      case 'letter':
        return 'Carta/Documento';
      case 'food_delivery':
        return 'Delivery';
      default:
        return 'Outros';
    }
  };

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Controle de Correspondências</span>
            </CardTitle>
            <CardDescription>
              Gerencie entregas e correspondências dos moradores
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
                <SelectItem value="waiting">Aguardando</SelectItem>
                <SelectItem value="delivered">Entregues</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Correspondência
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Correspondência</DialogTitle>
                  <DialogDescription>
                    Cadastre uma nova correspondência ou entrega
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="residenceNumber">Unidade</Label>
                    <Input
                      id="residenceNumber"
                      placeholder="101, 102..."
                      value={formData.residenceNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, residenceNumber: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: Correspondence['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="package">Encomenda</SelectItem>
                        <SelectItem value="letter">Carta/Documento</SelectItem>
                        <SelectItem value="food_delivery">Delivery</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o item (ex: Encomenda Mercado Livre, Documento Correios, etc.)"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                      Cadastrar
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
              <TableHead>Unidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCorrespondences.map((correspondence) => (
              <TableRow key={correspondence.id}>
                <TableCell className="font-medium">
                  Apt {correspondence.residenceNumber}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(correspondence.type)}
                    <span>{getTypeLabel(correspondence.type)}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {correspondence.description}
                </TableCell>
                <TableCell>
                  {new Date(correspondence.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{getStatusBadge(correspondence.status)}</TableCell>
                <TableCell className="text-right">
                  {correspondence.status === 'waiting' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelivery(correspondence.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Entregar
                    </Button>
                  )}
                  {correspondence.status === 'delivered' && correspondence.deliveredAt && (
                    <span className="text-xs text-muted-foreground">
                      Entregue em {new Date(correspondence.deliveredAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCorrespondences.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Nenhuma correspondência registrada' : 
               filter === 'waiting' ? 'Nenhuma correspondência aguardando entrega' : 
               'Nenhuma correspondência foi entregue'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};