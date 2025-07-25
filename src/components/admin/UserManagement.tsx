import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  name: string;
  apartment: string;
  email: string;
  phone: string;
}

export default function UserManagement() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    apartment: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.apartment) {
      alert("Apartamento é obrigatório.");
      return;
    }

    // Pega moradores atuais do localStorage (ou cria array vazio)
    const moradores = JSON.parse(localStorage.getItem("residents") || "[]");

    // Adiciona novo morador
    moradores.push(formData);

    // Salva array atualizado no localStorage
    localStorage.setItem("residents", JSON.stringify(moradores));

    alert("Morador salvo com sucesso!");

    // Limpa formulário
    setFormData({
      name: "",
      apartment: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cadastrar novo morador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nome do morador (opcional)
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Digite o nome (opcional)"
          />
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium">
            Apartamento *
          </label>
          <Input
            id="apartment"
            value={formData.apartment}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, apartment: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail (opcional)
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="E-mail (opcional)"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Telefone (opcional)
          </label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Telefone (opcional)"
          />
        </div>

        <Button type="submit" className="mt-4">
          Salvar morador
        </Button>
      </form>
    </div>
  );
}
