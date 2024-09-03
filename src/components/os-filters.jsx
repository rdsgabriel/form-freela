import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useEffect, useCallback } from 'react';

// Ajuste o esquema de validação para usar 'number' e 'client_name'
const OSFiltersSchema = z.object({
  number: z.string().optional(),
  client_name: z.string().optional()
});

export function OSFilters({ onFilter }) {
  const { register, watch, reset } = useForm({
    resolver: zodResolver(OSFiltersSchema),
    defaultValues: { number: "", client_name: "" }
  });

  // Observar mudanças nos campos
  const filters = watch();

  // Use useCallback para garantir que a função onFilter não seja recriada em cada renderização
  const handleFilter = useCallback(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  useEffect(() => {
    handleFilter();
  }, [filters, handleFilter]);

  const handleClear = () => {
    reset({ number: "", client_name: "" });
  };

  return (
    <form className="flex items-center gap-2">
      <Input placeholder="Busque por ID" {...register('number')} />
      <Input placeholder="Busque por cliente" {...register('client_name')} />
      <Button type="button" onClick={handleClear} variant="link">
        Limpar filtros
      </Button>
      <Button type="button" variant="link">
        <Search className="w-4 h-4 mr-2 text-[#29aae1]" />
        Filtrar resultados
      </Button>
    </form>
  );
}
