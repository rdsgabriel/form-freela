import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useEffect } from 'react';
import debounce from 'lodash.debounce';


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

  
  const debouncedOnFilter = debounce((filters) => {
    onFilter(filters);
  }, 10); 

  useEffect(() => {
    debouncedOnFilter(filters);
  }, [filters]);


  return (
    <form className="flex items-center gap-2">
      <Input placeholder="Busque por ID" {...register('number')} />
      <Input placeholder="Busque por cliente" {...register('client_name')} />
      <Button type="button" variant="link">
        <Search className="w-4 h-4 mr-2 text-[#29aae1]" />
        Filtrar resultados
      </Button>
    </form>
  );
}
