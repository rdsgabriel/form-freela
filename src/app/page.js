'use client';
import { useState, useCallback } from 'react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, DownloadIcon, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { OSFilters } from "@/components/os-filters";
import { CreateOSDialog } from "@/components/create-os";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Função para normalizar e remover acentos
const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const statusClasses = {
  Concluído: 'text-green-500',
  Cancelado: 'text-red-500',
  Pendente: 'text-gray-500'
};

const allOrders = [
  { id: '323232', client: 'João', status: 'Pendente' },
  { id: '272727', client: 'Maria', status: 'Concluído' },
  { id: '191919', client: 'José', status: 'Cancelado' }
];

export default function Home() {
  const [orders, setOrders] = useState(allOrders);
  const [filteredOrders, setFilteredOrders] = useState(allOrders);

  const handleStatusChange = useCallback((index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = { ...updatedOrders[index], status: newStatus };
    setOrders(updatedOrders);
    setFilteredOrders(filterOrders(updatedOrders));
  }, [orders]);

  const handleFilter = (filters) => {
    setFilteredOrders(filterOrders(orders, filters));
  };

  const filterOrders = (orders, filters = {}) => {
    const idFilter = filters.id ? removeAccents(filters.id.toLowerCase()) : '';
    const nameFilter = filters.name ? removeAccents(filters.name.toLowerCase()) : '';
    return orders.filter(order => {
      const idMatch = removeAccents(order.id.toLowerCase()).includes(idFilter);
      const nameMatch = removeAccents(order.client.toLowerCase()).includes(nameFilter);
      return idMatch && nameMatch;
    });
  };

  return (
    <div className='bg-[#f5fcff] w-full h-full'>
      <div className="p-6 max-w-5xl mx-auto space-y-4 bg-white mt-20 rounded-xl shadow-xl">
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

          <OSFilters onFilter={handleFilter} />
        </div>

        <div className="border rounded-lg p-2">
          <Table>
            <TableHeader className='bg-[#29aae1]'>
              <TableRow className='hover:bg-[#29aae1]'>
              <TableHead className='text-white rounded-tl-lg'>ID da OS</TableHead>
              <TableHead className='text-white'>Cliente</TableHead>
              <TableHead className='text-white'>Status</TableHead>
              <TableHead className='text-white rounded-tr-lg'>PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, i) => (
                <TableRow key={i}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className={`cursor-pointer ${statusClasses[order.status]} flex items-center`}>
                          <span className="w-20 truncate">{order.status}</span>
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
                      <DownloadIcon className="w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
