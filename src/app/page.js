'use client';
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, DownloadIcon, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { OSFilters } from "@/components/os-filters";
import { CreateOSDialog } from "@/components/create-os";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const statusClasses = {
  Concluído: 'text-green-500',
  Cancelado: 'text-red-500',
  Pendente: 'text-gray-500'
};

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de itens por página
  const [loading, setLoading] = useState(true); // Estado de loading

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://os.estoquefacil.net/api/api/order-services');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const validData = data.map(order => ({
          id: order.id || '',
          number: order.number || '',
          client_name: order.client_name || '',
          status: order.status || 'Pendente'
        }));
        setOrders(validData);
        setFilteredOrders(validData);
      } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
      } finally {
        setLoading(false); // Defina loading como false após carregar os dados
      }
    };

    fetchOrders();
  }, []);

  const urlUpdate = `https://os.estoquefacil.net/api/api/order-services/update/${id}`

  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      const response = await fetch(urlUpdate, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedOrders = orders.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(filterOrders(updatedOrders));
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
    }
  }, [orders]);

  const handleFilter = (filters) => {
    setFilteredOrders(filterOrders(orders, filters));
  };

  const filterOrders = (orders, filters = {}) => {
    const numberFilter = filters.number ? removeAccents(filters.number.toLowerCase()) : '';
    const nameFilter = filters.client_name ? removeAccents(filters.client_name.toLowerCase()) : '';

    return orders.filter(order => {
      const numberMatch = removeAccents((order.number || '').toLowerCase()).includes(numberFilter);
      const nameMatch = removeAccents((order.client_name || '').toLowerCase()).includes(nameFilter);
      return numberMatch && nameMatch;
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
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
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className='animate-spin text-[#29aae1]'
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>

            </div>
          ) : (
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
                {currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.number}</TableCell>
                    <TableCell>{order.client_name}</TableCell>
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
                            onClick={() => handleStatusChange(order.id, 'Pendente')}
                            className={statusClasses['Pendente']}
                          >
                            Pendente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'Concluído')}
                            className={statusClasses['Concluído']}
                          >
                            Concluído
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'Cancelado')}
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
          )}
        </div>

        {/* Controles de Paginação */}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={handlePreviousPage}
            className={`${currentPage === 1 ? 'invisible' : ''} bg-[#29aae1] hover:bg-cyan-500`}
          >
            <ChevronLeft className='w-5 h-5 mr-1'/> Anterior
          </Button>
          
          <span className="absolute left-1/2 transform -translate-x-1/2">
            {currentPage} de {totalPages}
          </span>

          <Button
            onClick={handleNextPage}
            className={`${currentPage === totalPages ? 'invisible' : ''} bg-[#29aae1] hover:bg-cyan-500`}
          >
            Próxima <ChevronRight className='w-5 h-5 ml-1'/>
          </Button>
        </div>
      </div>
    </div>
  );
}
