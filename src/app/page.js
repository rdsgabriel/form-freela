'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Dialog, DialogTrigger,  } from "@/components/ui/dialog";
import { PlusCircle, DownloadIcon, ChevronDown, ChevronRight, ChevronLeft, Trash, Pencil, Ellipsis} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { OSFilters } from "@/components/os-filters";
import { CreateOSDialog } from "@/components/create-os";
import { UpdateOSDialog } from "@/components/update-os";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal } from "@/components/ui/dropdown-menu";

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

  const [selectedOrder, setSelectedOrder] = useState(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

   

    const fetchOrders = async () => {
        try {
            const response = await fetch(`https://os.estoquefacil.net/api/order-services/${token}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
        const data = await response.json();
        const validData = data.map(order => {
          return {
        id: order.id || '',
        number: order.number || '',
        client_name: order.client_name || '',
        client_phone: order.client_phone || '',
        client_document: order.client_document || '',
        client_zipcode: order.client_zipcode || '',
        client_address: order.client_address || '',
        client_number: order.client_number || '',
        client_state: order.client_state || '',
        client_city: order.client_city || '',
        device_brand: order.device_brand || '',
        device_model: order.device_model || '',
        device_password: order.device_password || '',
        device_serial: order.device_serial || '',
        device_imei: order.device_imei || '',
        device_accessories: order.device_accessories || '',
        device_additional_info: order.device_additional_info || '',
        terms: order.terms || '',
        terms_two: order.terms_two || '',
        terms_three: order.terms_three || '',
        terms_four: order.terms_four || '',
        terms_five: order.terms_five || '',
        terms_six: order.terms_six || '',
        is_checked_terms: order.is_checked_terms,
        is_checked_terms_two: order.is_checked_terms_two,
        is_checked_terms_three: order.is_checked_terms_three,
        is_checked_terms_four: order.is_checked_terms_four,
        is_checked_terms_five: order.is_checked_terms_five,
        is_checked_terms_six: order.is_checked_terms_six,
        bills: order.bills || {},
        checklist: order.checklist || {
          device_turns_on: '',
          faulty_screen: '',
          restarting: '',
          locked: '',
          network: '',
          wifi: '',
          headset: '',
          microphone: '',
          speaker: '',
          frontal_camera: '',
          back_camera: '',
          biometry: '',
          front_sensors: '',
          touch: '',
          buttons: '',
          keyboard: '',
          casing: '',
          charger: '',
          backup: '',
        },
        status: order.status || 'Pendente',
        logo: order.logo || null,
        date: order.date || '',
        pdf_url: order.pdf_url || '',
            
          };
        });
        setOrders(validData);
        setFilteredOrders(validData);
      } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();


  }, []);

  const handleStatusChange = useCallback((id, newStatus) => {
    // Atualizar o estado imediatamente
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(filterOrders(updatedOrders));
  
    // Em seguida, enviar a requisição para o servidor
    const updateStatusOnServer = async () => {
      try {
        const response = await fetch(`https://os.estoquefacil.net/api/order-services/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus }),
          mode: 'cors',
        });
  
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
      } catch (error) {
        console.error("Erro ao atualizar o status:", error);
      }
    };
  
    updateStatusOnServer();
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

  const handleGoBack = () => {
    window.history.back();
  };

  const handleDelete = async (number) => {

    const userConfirmed = window.confirm("Você tem certeza que deseja excluir esta ordem de serviço?");
    
    if (!userConfirmed) {
        return; // Se o usuário cancelar, a função termina aqui e nada é excluído
    }
    // Remover imediatamente a ordem de serviço da interface
    setOrders(prevOrders => prevOrders.filter(order => order.number !== number));
    setFilteredOrders(prevFilteredOrders => prevFilteredOrders.filter(order => order.number !== number));
  
    try {
      const response = await fetch(`https://os.estoquefacil.net/api/order-services/del/${number}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Erro ao deletar a ordem de serviço');
      }
      
    
    } catch (error) {
      console.error('Erro ao excluir a ordem de serviço:', error);
      
      
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const [isDialogDelete, setIsDialogDelete] = useState(false);

  // Função para abrir o diálogo de exclusão
  const openDeleteDialog = () => {
    setIsDialogDelete(true);
  };


  
  return (
    <div className='bg-[#f5fcff] w-full h-full'>
      <div className='m-4'>
      <Button onClick={handleGoBack} className='bg-[#29aae1] hover:bg-cyan-500' >
       <ChevronLeft className='w-5 h-5 mr-1'/>
         Voltar
      </Button>
      </div>
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
                  <TableHead className='text-white'>PDF</TableHead>
                  <TableHead className='text-white rounded-tr-lg'></TableHead>
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
                      <a href={`https://os.estoquefacil.net/storage/app/public/pdfs/OS_${order.number}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center text-blue-600 hover:text-blue-800">
                        <Button type='button' variant='outline' className='hover:text-[#29aae1]'>
                        <DownloadIcon className="w-4" />
                      </Button>
                      </a>
                    </TableCell>
                    <TableCell>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-gray-600 hover:text-gray-900">
                          <Ellipsis className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent className="w-48 p-2 bg-white shadow-lg rounded-lg">
                          <DropdownMenuItem
                            className="flex items-center p-2 text-[#29aae1] hover:bg-blue-50 rounded-lg"
                            onClick={() => handleEditClick(order)}
                          >
                            <Pencil className="mr-2 w-4 h-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(order.number)}
                            className="flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash className="mr-2 w-4 h-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>

                 
                  
                    
                                    
                    {isDialogOpen && (
        <Dialog open onOpenChange={handleCloseDialog}>
          <UpdateOSDialog order={selectedOrder} onClose={handleCloseDialog} />
        </Dialog>
      )}
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