'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  Building2,
  ChevronDown,
  Users,
  Briefcase,
  Megaphone,
  Check
} from 'lucide-react';

const COMPANY_SIZES = [
  { value: '1-5', label: '1–5 funcionários' },
  { value: '6-20', label: '6–20 funcionários' },
  { value: '21-100', label: '21–100 funcionários' },
  { value: '100+', label: '100+ funcionários' },
];

const SEGMENTS = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'vendas', label: 'Vendas' },
  { value: 'agencia', label: 'Agência' },
  { value: 'saas', label: 'SaaS' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'educacao', label: 'Educação' },
  { value: 'outro', label: 'Outro' },
];

const SOURCES = [
  { value: 'google', label: 'Google' },
  { value: 'ads', label: 'Anúncios (Ads)' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'evento', label: 'Evento' },
  { value: 'outro', label: 'Outro' },
];

interface DropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}

function Dropdown({ options, value, onChange, placeholder, isOpen, onToggle, icon }: DropdownProps) {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <div
        onClick={onToggle}
        className={`border rounded-[4px] px-4 py-3.5 flex items-center justify-between cursor-pointer bg-white transition-colors ${
          isOpen ? 'border-slate-900' : value ? 'border-slate-400' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-slate-500">{icon}</span>}
          <span className={`text-[15px] ${value ? 'text-slate-700' : 'text-slate-500'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown className={`text-slate-500 w-5 h-5 stroke-[1.5] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-[4px] shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                value === option.value
                  ? 'bg-slate-100 text-slate-900'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-[15px]">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompanySetupPage() {
  const router = useRouter();
  const { user } = useUser();

  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [segment, setSegment] = useState('');
  const [source, setSource] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!companyName || !companySize || !segment || !source || !acceptedTerms) {
      return;
    }

    // TODO: Save to backend
    console.log({
      companyName,
      companySize,
      segment,
      source,
      acceptedMarketing
    });

    router.push('/onboarding');
  };

  const isFormValid = companyName && companySize && segment && source && acceptedTerms;

  return (
    <div className="bg-slate-200 min-h-screen flex items-center justify-center p-4 antialiased text-slate-800">
      <div className="bg-white w-full max-w-[620px] rounded-lg shadow-2xl p-10 md:p-12 relative">

        {/* Stepper */}
        <div className="relative mb-10">
          {/* Connecting Line */}
          <div className="absolute top-3.5 left-0 w-full h-[1px] bg-slate-200 -z-0" />

          <div className="flex justify-between relative z-10 px-4">
            {/* Step 1 - Completed */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium shadow-sm">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs font-medium text-slate-500">Conta criada</span>
            </div>

            {/* Step 2 - Current */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium shadow-sm">
                2
              </div>
              <span className="text-xs font-medium text-slate-800">Sua empresa</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-xs font-medium shadow-sm">
                3
              </div>
              <span className="text-xs font-medium text-slate-400">Briefing</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-slate-900 text-2xl font-semibold tracking-tight mb-3">Sua empresa</h1>
          <p className="text-sm text-slate-600">
            Você está configurando como{' '}
            <span className="font-semibold text-slate-900">
              {user?.primaryEmailAddress?.emailAddress || 'usuário'}
            </span>
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">

          {/* Company Name Input */}
          <div className="border border-slate-300 rounded-[4px] px-3 py-2 flex items-center gap-3 hover:border-slate-400 transition-colors focus-within:border-slate-900">
            <Building2 className="text-slate-500 w-5 h-5 stroke-[1.5]" />
            <div className="flex flex-col flex-1">
              <label className="text-[10px] text-slate-500 leading-tight">Nome da empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Digite o nome da sua empresa"
                className="text-[15px] text-slate-900 outline-none w-full bg-transparent p-0 leading-tight font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Company Size Dropdown */}
          <Dropdown
            options={COMPANY_SIZES}
            value={companySize}
            onChange={setCompanySize}
            placeholder="Qual o tamanho da sua empresa?"
            isOpen={openDropdown === 'size'}
            onToggle={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
            icon={<Users className="w-5 h-5 stroke-[1.5]" />}
          />

          {/* Segment Dropdown */}
          <Dropdown
            options={SEGMENTS}
            value={segment}
            onChange={setSegment}
            placeholder="Segmento / área de atuação"
            isOpen={openDropdown === 'segment'}
            onToggle={() => setOpenDropdown(openDropdown === 'segment' ? null : 'segment')}
            icon={<Briefcase className="w-5 h-5 stroke-[1.5]" />}
          />

          {/* Source Dropdown */}
          <Dropdown
            options={SOURCES}
            value={source}
            onChange={setSource}
            placeholder="Como conheceu o Symponhy?"
            isOpen={openDropdown === 'source'}
            onToggle={() => setOpenDropdown(openDropdown === 'source' ? null : 'source')}
            icon={<Megaphone className="w-5 h-5 stroke-[1.5]" />}
          />

          {/* Info Box */}
          <div className="bg-amber-50 rounded-[4px] p-4 flex items-start gap-3">
            <div className="mt-0.5 min-w-[20px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <p className="text-[13px] text-amber-800 leading-relaxed font-normal">
              Essas informações nos ajudam a personalizar sua experiência e oferecer os melhores recursos para o seu tipo de negócio.
            </p>
          </div>

          {/* Checkboxes */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-400 checked:bg-slate-900 checked:border-transparent transition-all"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 stroke-[3]" />
              </div>
              <label className="text-[13px] text-slate-500 leading-snug pt-0.5">
                Ao se cadastrar, você concorda com nossos{' '}
                <a href="#" className="text-slate-700 hover:underline font-medium">Termos de serviço</a> e{' '}
                <a href="#" className="text-slate-700 hover:underline font-medium">Aviso de privacidade</a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={acceptedMarketing}
                  onChange={(e) => setAcceptedMarketing(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-400 checked:bg-slate-900 checked:border-transparent transition-all"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 stroke-[3]" />
              </div>
              <label className="text-[13px] text-slate-500 leading-snug pt-0.5">
                Receba dicas úteis, atualizações de produtos e ofertas exclusivas por e-mail
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full font-semibold text-[17px] py-3.5 rounded-[5px] transition-colors mt-4 shadow-sm tracking-wide ${
              isFormValid
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Próximo
          </button>

        </div>
      </div>
    </div>
  );
}
