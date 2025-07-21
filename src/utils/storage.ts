import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsers, saveUsers } from "@/utils/storage";

interface User {
  id: string;
  login: string;
  password?: string;
  type: string;
  residenceNumber: string;
  name?: string;
  email?: string;
  phone?: string;
}

export default function UserManagement() {
  const [formData, setFormData] = useState({
    name: "",
    apartment: "",
    email: "",
    phone: "",
  });

  const [residents, setResidents] = useState<User[]>([]);

  useEffect(() => {
    const users = getUsers();
    const residentUsers = users.filter(u => u.type === "resident");
    setResidents(residentUsers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.apartment) {
      alert("Apartamento é obrigatório.");
      return;
    }

    const users = getUsers();
    const newUser: User = {
      id: `res-${Date.now()}`,
      login: `apt${formData.apartment}`,
      password: "123456", // senha padrão
      type: "resident",
      residenceNumber: formData.apartment,
      name: formData.name.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    setResidents(prev => [...prev, newUser]);
    setFormData({ name: "", apartment: "", email: "", phone: "" });
  };

  const handleDelete = (id: string) => {
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    saveUsers(filteredUsers);
    setResidents(residents.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cadastrar novo morador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nome do morador (opcional)</label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Digite o nome (opcional)"
          />
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium">Apartamento *</label>
          <Input
            id="apartment"
            value={formData.apartment}
            onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">E-mail (opcional)</label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="E-mail (opcional)"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Telefone (opcional)</label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Telefone (opcional)"
          />
        </div>

        <Button type="submit" className="mt-4">Salvar morador</Button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Moradores cadastrados</h3>
        {residents.length === 0 ? (
          <p>Nenhum morador cadastrado.</p>
        ) : (
          <ul>
            {residents.map(r => (
              <li key={r.id} className="flex justify-between items-center py-1 border-b">
                <span>{r.name ?? "(Sem nome)"} - Apt {r.residenceNumber}</span>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>Remover</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
