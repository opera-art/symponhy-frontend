'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@/shared/components/ui';
import { Save } from 'lucide-react';

export const GeneralSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: 'Ana Marketing',
    email: 'ana@marketing.com',
    phone: '(11) 99999-9999',
    website: 'https://anamarketing.com.br',
    bio: 'Especialista em Marketing Digital e Growth Hacking',
    location: 'São Paulo, SP',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', formData);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Informações da Conta
        </h3>
        <p className="text-sm text-slate-600">
          Atualize suas informações de negócio
        </p>
      </div>

      {/* Profile Section */}
      <Card padding="md">
        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome do Negócio
            </label>
            <Input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Nome da sua empresa ou marca"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Principal
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Telefone
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://seusite.com"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Localização
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Cidade, Estado"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio/Descrição
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Escreva uma breve descrição sobre você"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
              rows={4}
            />
          </div>

          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Salvar Alterações
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="md" className="border-2 border-red-200 bg-red-50/30">
        <div>
          <h4 className="font-semibold text-slate-900 mb-2">Zona de Perigo</h4>
          <p className="text-sm text-slate-600 mb-4">
            Ações irreversíveis para sua conta
          </p>
          <Button
            variant="outline"
            className="text-status-error hover:text-status-error"
          >
            Deletar Conta
          </Button>
        </div>
      </Card>
    </div>
  );
};
