import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Users, 
  Package, 
  MessageSquare, 
  LogOut,
  Clock,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { VisitorManagement } from './resident/VisitorManagement';
import { CorrespondenceView } from './resident/CorrespondenceView';
import { CommunicationsView } from './resident/CommunicationsView';
import { ThemeSelector } from './ThemeSelector';
import { 
  getVisitors, 
  getCorrespondences,
  getCommunications 
} from '@/utils/storage';

export const ResidentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const userResidence = user?.residenceNumber;
  const visitors = getVisitors().filter(v => v.residenceNumber === userResidence);
  const correspondences = getCorrespondences().filter(c => c.residenceNumber === userResidence);
  const communications = getCommunications();
  
  const activeVisitors = visitors.filter(v => v.status === 'inside');
  const pendingCorrespondences = correspondences.filter(c => c.status === 'waiting');
  const highPriorityCommunications = communications.filter(c => c.priority === 'high');

  return (
    <div className="min-h-screen bg-gradient-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Meu Condomínio</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.name} • Apt {user?.residenceNumber}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeSelector />
              <Button 
                variant="outline" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="visitors">Visitantes</TabsTrigger>
            <TabsTrigger value="correspondence">Correspondências</TabsTrigger>
            <TabsTrigger value="communications">Comunicados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Visitantes Ativos
                  </CardTitle>
                  <Users className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{activeVisitors.length}</div>
                  <p className="text-xs text-muted-foreground">
                    No condomínio agora
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Correspondências
                  </CardTitle>
                  <Package className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{pendingCorrespondences.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando retirada
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comunicados
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{communications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Mensagens ativas
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-success" />
                    <span>Meus Visitantes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeVisitors.length > 0 ? (
                    <div className="space-y-3">
                      {activeVisitors.slice(0, 3).map((visitor) => (
                        <div key={visitor.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{visitor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Entrada: {visitor.entryTime}
                            </p>
                          </div>
                          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
                            Presente
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum visitante no momento</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-warning" />
                    <span>Correspondências Pendentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingCorrespondences.length > 0 ? (
                    <div className="space-y-3">
                      {pendingCorrespondences.slice(0, 3).map((correspondence) => (
                        <div key={correspondence.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{correspondence.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(correspondence.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                            Aguardando
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma correspondência pendente</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {highPriorityCommunications.length > 0 && (
              <Card className="bg-gradient-card border-0 border-l-4 border-l-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span>Comunicados Importantes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {highPriorityCommunications.slice(0, 2).map((communication) => (
                      <div key={communication.id} className="border-l-2 border-l-destructive pl-4">
                        <h4 className="font-medium">{communication.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {communication.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {communication.author} • {new Date(communication.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorManagement />
          </TabsContent>

          <TabsContent value="correspondence">
            <CorrespondenceView />
          </TabsContent>

          <TabsContent value="communications">
            <CommunicationsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};