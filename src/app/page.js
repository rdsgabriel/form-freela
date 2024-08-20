'use client'
import { useState } from 'react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, DownloadIcon, ChevronDown } from 'lucide-react';  // Importando ícone Edit2 para indicar que o status pode ser alterado
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { OSFilters } from "@/components/os-filters";
import { CreateOSDialog } from "@/components/create-os";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const statusClasses = {
  Concluído: 'text-green-500',
  Cancelado: 'text-red-500'
};

export default function Home() {
  const [statuses, setStatuses] = useState(Array(10).fill('Pendente'));

  const handleStatusChange = (index, newStatus) => {
    const updatedStatuses = [...statuses];
    updatedStatuses[index] = newStatus;
    setStatuses(updatedStatuses);
  };

  return (
    <div className='bg-[#f5fcff] w-full h-full'>
      <div className="p-6 max-w-5xl mx-auto space-y-4 bg-white mt-20 rounded-xl shadow-xl ">
      <h1 className="text-3xl font-extrabold pb-2 text-[#080b16]">Ordens de Serviço</h1>
      <div className="flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button className='bg-[#29aae1] hover:bg-cyan-500'>
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar OS
            </Button>
          </DialogTrigger>
          <CreateOSDialog />
        </Dialog>

        <OSFilters />
      </div>

      <div className="border rounded-lg p-2">
        <Table>
          <TableHeader className='bg-[#29aae1]'>
            <TableHead className='text-white rounded-tl-lg'>ID da OS</TableHead>
            <TableHead className='text-white'>Cliente</TableHead>
            <TableHead className='text-white'>Status</TableHead>
            <TableHead className='text-white rounded-tr-lg'>PDF</TableHead>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>329173128</TableCell>
                  <TableCell>Cliente {i}</TableCell>
                  <TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <span className={`cursor-pointer ${statusClasses[statuses[i]]} flex items-center`}>
        <span className="w-20 truncate">{statuses[i]}</span>
        <ChevronDown className="ml-2 w-4 h-4" />
      </span>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent>
      <DropdownMenuItem
        onClick={() => handleStatusChange(i, 'Pendente')}
        className={statusClasses['Pendente']}
      >
        Pendente
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleStatusChange(i, 'Concluído')}
        className={statusClasses['Concluído']}
      >
        Concluído
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => handleStatusChange(i, 'Cancelado')}
        className={statusClasses['Cancelado']}
      >
        Cancelado
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
                  <TableCell>
                    <Button type='button' variant='outline' className='hover:text-[#29aae1]'>
                      <DownloadIcon className="w-4 " />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
    </div>
  );
}
