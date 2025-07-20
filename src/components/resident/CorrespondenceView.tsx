import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Mail, Utensils, Truck, Clock } from 'lucide-react';
import { Correspondence } from '@/types/auth';
import { getCorrespondences } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';

export const CorrespondenceView = () => {
  const { user } = useAuth();
  const [correspondences] = useState<Correspondence[]>(
    getCorrespondences().filter(c => c.residenceNumber === user?.residenceNumber)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-warning text-warning-foreground">Aguardando Retirada</Badge>;
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

  // Sort by date (newest first)
  const sortedCorrespondences = correspondences.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const pendingCount = correspondences.filter(c => c.status === 'waiting').length;

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Minhas Correspondências</span>
        </CardTitle>
        <CardDescription>
          Acompanhe suas entregas e correspondências
        </CardDescription>
        
        {pendingCount > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                Você tem {pendingCount} correspondência{pendingCount > 1 ? 's' : ''} aguardando retirada na portaria
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Entrega</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCorrespondences.map((correspondence) => (
              <TableRow key={correspondence.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(correspondence.type)}
                    <span className="font-medium">{getTypeLabel(correspondence.type)}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  {correspondence.description}
                </TableCell>
                <TableCell>
                  {new Date(correspondence.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{getStatusBadge(correspondence.status)}</TableCell>
                <TableCell>
                  {correspondence.status === 'delivered' && correspondence.deliveredAt ? (
                    <span className="text-sm text-muted-foreground">
                      {new Date(correspondence.deliveredAt).toLocaleDateString('pt-BR')}
                    </span>
                  ) : correspondence.status === 'waiting' ? (
                    <span className="text-sm text-warning font-medium">
                      Disponível na portaria
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {correspondences.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma correspondência registrada</p>
            <p className="text-sm text-muted-foreground mt-2">
              Suas entregas aparecerão aqui quando chegarem
            </p>
          </div>
        )}

        {correspondences.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Informações importantes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Correspondências ficam disponíveis na portaria durante o horário comercial</li>
              <li>• Para retirar, apresente um documento de identificação</li>
              <li>• Em caso de dúvidas, entre em contato com a administração</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};