import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Communication } from '@/types/auth';
import { getCommunications } from '@/utils/storage';

export const CommunicationsView = () => {
  const [communications] = useState<Communication[]>(getCommunications());

  const getPriorityBadge = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-destructive text-destructive-foreground">Alta Prioridade</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Prioridade Média</Badge>;
      case 'low':
        return <Badge variant="outline">Prioridade Baixa</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getPriorityIcon = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'low':
        return <Info className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // Sort by priority (high first) then by date (newest first)
  const sortedCommunications = communications.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const highPriorityCount = communications.filter(c => c.priority === 'high').length;

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Comunicados</span>
        </CardTitle>
        <CardDescription>
          Mensagens e avisos da administração do condomínio
        </CardDescription>
        
        {highPriorityCount > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {highPriorityCount} comunicado{highPriorityCount > 1 ? 's' : ''} importante{highPriorityCount > 1 ? 's' : ''} 
                {highPriorityCount > 1 ? ' requerem' : ' requer'} sua atenção
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sortedCommunications.map((communication) => (
            <Card key={communication.id} className={`border ${
              communication.priority === 'high' ? 'border-destructive/30 bg-destructive/5' :
              communication.priority === 'medium' ? 'border-warning/30 bg-warning/5' :
              'border-border'
            }`}>
              <CardHeader className="pb-3">
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
                      <span>{new Date(communication.date).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {getPriorityBadge(communication.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {communication.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {communications.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum comunicado disponível</p>
            <p className="text-sm text-muted-foreground mt-2">
              Novos comunicados da administração aparecerão aqui
            </p>
          </div>
        )}

        {communications.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Sobre os comunicados:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Alta prioridade:</strong> Assuntos urgentes que requerem atenção imediata</li>
              <li>• <strong>Prioridade média:</strong> Informações importantes do dia a dia</li>
              <li>• <strong>Prioridade baixa:</strong> Avisos gerais e informativos</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};