import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, Trash2, Home, Phone, Mail } from 'lucide-react';
import { User } from '@/types/auth';
import { getUsers, saveUsers } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(getUsers().filter(u => u.type === 'resident'));
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    login: '',
    password: '',
    residenceNumber: '',
    email: '',
    phone: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      login: '',
      password: '',
      residenceNumber: '',
      email: '',
      phone: ''
    });
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allUsers = getUsers();
    
    if (editingUser) {
      // Update existing user
      const updatedUsers = allUsers.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      );
      saveUsers(updatedUsers);
      setUsers(updatedUsers.filter(u => u.type === 'resident'));
      toast({
        title: "Usuário atualizado",
        description: "As informações foram salvas com sucesso"
      });
    } else {
      // Create new user
      const newUser: User = {
        id: `res-${Date.now()}`,
        type: 'resident',
        ...formData
      };
      
      const updatedUsers = [...allUsers, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers.filter(u => u.type === 'resident'));
      toast({
        title: "Usuário criado",
        description: "Novo morador cadastrado com sucesso"
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      login: user.login,
      password: user.password,
      residenceNumber: user.residenceNumber || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    const allUsers = getUsers();
    const updatedUsers = allUsers.filter(user => user.id !== userId);
    saveUsers(updatedUsers);
    setUsers(updatedUsers.filter(u => u.type === 'resident'));
    toast({
      title: "Usuário removido",
      description: "O morador foi removido do sistema"
    });
  };

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Gerenciamento de Usuários</span>
            </CardTitle>
            <CardDescription>
              Cadastre e gerencie os moradores do condomínio
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
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Morador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Editar Morador' : 'Novo Morador'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? 'Atualize as informações do morador' 
                    : 'Preencha os dados para cadastrar um novo morador'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="login">Usuário</Label>
                    <Input
                      id="login"
                      value={formData.login}
                      onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                    {editingUser ? 'Atualizar' : 'Cadastrar'}
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
              <TableHead>Nome</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center w-fit">
                    <Home className="w-3 h-3 mr-1" />
                    {user.residenceNumber}
                  </Badge>
                </TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    {user.email && (
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                        {user.email}
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum morador cadastrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};