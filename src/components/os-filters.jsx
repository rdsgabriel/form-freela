'use client'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search } from "lucide-react"
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const OSFiltersSchema = z.object ({
  id: z.string(),
  name: z.string()
})


export function OSFilters() {
  const { register, handleSubmit } = useForm(
    { resolver: zodResolver(OSFiltersSchema) }
  )

  function handleFilterOS(data) {
      console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFilterOS)} className="flex items-center gap-2">
          <Input placeholder="Busque por ID" {...register('id')}></Input>
          <Input placeholder="Busque por cliente" {...register('name')}></Input>
          <Button type="submit" variant="link">
             <Search className="w-4 h-4 mr-2 text-[#29aae1]"/>
             Filtrar resultados
             </Button>
        </form>
  )
}