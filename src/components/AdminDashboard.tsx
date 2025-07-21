import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  Package, 
  MessageSquare, 
  Settings,
  LogOut,
  Home,
  Clock,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserManagement from './admin/UserManagement'; // Importação corrigida (sem chaves)
import { VisitorsList } from './admin/VisitorsList';
import { CorrespondencesList } from './admin/CorrespondencesList';
import { CommunicationsManagement } from './admin/CommunicationsManagement';
import { ThemeSelector } from './ThemeSelector';
import { 
  getUsers, 
  getVisitors, 
  getCorrespondences,
  getCommunications 
} from '@/utils/storage';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const users = getUsers().filter(u => u.type === 'resident');
  const visitors = getVisitors();
  const correspondences = getCorrespondences();
  const communications = getCommunications();
  const activeVisitors = visitors.filter(v => v.status === 'inside');
  const pendingCorrespondences = correspondences.filter(c => c.status === 'waiting');

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
                <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">Bem-vindo, {user?.name}</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="visitors">Visitantes</TabsTrigger>
            <TabsTrigger value="correspondence">Correspondências</TabsTrigger>
            <TabsTrigger value="communications">Comunicados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Moradores
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Unidades cadastradas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Visitantes Ativos
                  </CardTitle>
                  <Clock className="h-4 w-4 text-success" />
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
                    Correspondências Pendentes
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
                  <Mail className="h-4 w-4 text-primary" />
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
                    <span>Visitantes Ativos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeVisitors.length > 0 ? (
                    <div className="space-y-3">
                      {activeVisitors.slice(0, 5).map((visitor) => (
                        <div key={visitor.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{visitor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Apt {visitor.residenceNumber} • {visitor.entryTime}
                            </p>
                          </div>
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
                    <span>Correspondências Recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingCorrespondences.length > 0 ? (
                    <div className="space-y-3">
                      {pendingCorrespondences.slice(0, 5).map((correspondence) => (
                        <div key={correspondence.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Apt {correspondence.residenceNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {correspondence.description}
                            </p>
                          </div>
                          <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                            Pendente
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
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorsList />
          </TabsContent>

          <TabsContent value="correspondence">
            <CorrespondencesList />
          </TabsContent>

          <TabsContent value="communications">
            <CommunicationsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
