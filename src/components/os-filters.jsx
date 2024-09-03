import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

// Ajuste o esquema de validação para usar 'number' e 'client_name'
const OSFiltersSchema = z.object({
  number: z.string().optional(),
  client_name: z.string().optional()
});

export function OSFilters({ onFilter }) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(OSFiltersSchema),
    defaultValues: { number: "", client_name: "" }
  });

  function handleFilterOS(data) {
    console.log("Data from form:", data);
    onFilter(data);
  }

  return (
    <form onSubmit={handleSubmit(handleFilterOS)} className="flex items-center gap-2">
      <Input placeholder="Busque por ID" {...register('number')} />
      <Input placeholder="Busque por cliente" {...register('client_name')} />
      <Button type="submit" variant="link">
        <Search className="w-4 h-4 mr-2 text-[#29aae1]" />
        Filtrar resultados
      </Button>
    </form>
  );
}
