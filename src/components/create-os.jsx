import { Button } from './ui/button';
import { Checkbox } from "./ui/checkbox";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef  } from "react";
import { PlusCircle, Trash } from 'lucide-react';

const billSchema = z.array(
  z.object({
    description: z.string().min(3, 'Por favor, informe uma descrição válida.'),
    amount: z.preprocess(
      (value) => (isNaN(value) || value === null || value === undefined ? 0 : value),
      z.number().positive('Por favor, informe um valor válido.')
    ),
    value: z.preprocess(
      (value) => (isNaN(value) || value === null || value === undefined ? 0 : value),
      z.number().positive('Por favor, informe um valor válido.')
    )
  })
).min(1, 'Você deve incluir pelo menos um item.');

const isClient = typeof window !== 'undefined' && typeof FileList !== 'undefined';

const createOSSchema = z.object({
  checklist: z.object({
    device_turns_on: z.string().nonempty("Campo obrigatório"),
    faulty_screen: z.string().nonempty("Campo obrigatório"),
    restarting: z.string().nonempty("Campo obrigatório"),
    locked: z.string().nonempty("Campo obrigatório"),
    network: z.string().nonempty("Campo obrigatório"),
    wifi: z.string().nonempty("Campo obrigatório"),
    headset: z.string().nonempty("Campo obrigatório"),
    microphone: z.string().nonempty("Campo obrigatório"),
    speaker: z.string().nonempty("Campo obrigatório"),
    frontal_camera: z.string().nonempty("Campo obrigatório"),
    back_camera: z.string().nonempty("Campo obrigatório"),
    biometry: z.string().nonempty("Campo obrigatório"),
    front_sensors: z.string().nonempty("Campo obrigatório"),
    touch: z.string().nonempty("Campo obrigatório"),
    buttons: z.string().nonempty("Campo obrigatório"),
    keyboard: z.string().nonempty("Campo obrigatório"),
    casing: z.string().nonempty("Campo obrigatório"),
    charger: z.string().nonempty("Campo obrigatório"),
    backup: z.string().nonempty("Campo obrigatório"),
  }),
  logo: isClient
    ? z.instanceof(FileList).transform(list => list.item(0)).optional()
    : z.any(),
  date: z.string().min(1, "Data é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  client_name: z.string().min(1, "Nome do cliente é obrigatório"),
  client_phone: z.string().min(1, "Telefone do cliente é obrigatório"),
  client_document: z.string(),
  client_zipcode: z.string(),
  client_address: z.string(),
  client_number: z.string(),
  client_state: z.string(),
  client_city: z.string(),
  device_brand: z.string(),
  device_model: z.string(),
  device_password: z.string(),
  device_serial: z.string(),
  device_imei: z.string(),
  device_accessories: z.string(),
  device_additional_info: z.string(),
  terms: z.string().optional(),
  terms_two: z.string().optional(),
  terms_three: z.string().optional(),
  terms_four: z.string().optional(),
  terms_five: z.string().optional(),
  terms_six: z.string().optional(),
  is_checked_terms: z.boolean(),
  is_checked_terms_two: z.boolean(),
  is_checked_terms_three: z.boolean(),
  is_checked_terms_four: z.boolean(),
  is_checked_terms_five: z.boolean(),
  is_checked_terms_six: z.boolean(),
  bills: billSchema,
});

export function CreateOSDialog() {
  const { register, handleSubmit, watch, control, setValue, setError, clearErrors, formState: { errors } } = useForm({
    resolver: zodResolver(createOSSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'bills',
    control,
  });

  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedTermsTwo, setIsCheckedTermsTwo] = useState(false);
  const [isCheckedTermsThree, setIsCheckedTermsThree] = useState(false);
  const [isCheckedTermsFour, setIsCheckedTermsFour] = useState(false);
  const [isCheckedTermsFive, setIsCheckedTermsFive] = useState(false);
  const [isCheckedTermsSix, setIsCheckedTermsSix] = useState(false);

  

  useEffect(() => {
    setValue('is_checked_terms', isCheckedTerms);
    setValue('is_checked_terms_two', isCheckedTermsTwo);
    setValue('is_checked_terms_three', isCheckedTermsThree);
    setValue('is_checked_terms_four', isCheckedTermsFour);
    setValue('is_checked_terms_five', isCheckedTermsFive);
    setValue('is_checked_terms_six', isCheckedTermsSix);
  }, [
    isCheckedTerms,
    isCheckedTermsTwo,
    isCheckedTermsThree,
    isCheckedTermsFour,
    isCheckedTermsFive,
    isCheckedTermsSix,
    setValue,
  ]);

  const handleCheckboxChangeTerms = (e) => setIsCheckedTerms(e);
  const handleCheckboxChangeTermsTwo = (e) => setIsCheckedTermsTwo(e);
  const handleCheckboxChangeTermsThree = (e) => setIsCheckedTermsThree(e);
  const handleCheckboxChangeTermsFour = (e) => setIsCheckedTermsFour(e);
  const handleCheckboxChangeTermsFive = (e) => setIsCheckedTermsFive(e);
  const handleCheckboxChangeTermsSix = (e) => setIsCheckedTermsSix(e);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setValue('date', formattedDate);
  }, [setValue]);

  const generateOrderNumber = () => {
    const orderNumber = Math.floor(Math.random() * 1000000);
    return orderNumber.toString().padStart(6, '0');
  };



  const orderNumber = generateOrderNumber();

  const bills = watch('bills') || [];

  const handleRemove = (index) => {
    if (bills.length <= 1) {
      setError('bills', {
        type: 'manual',
        message: 'Você precisa manter pelo menos um item no orçamento para gerar uma OS.'
      });
      return;
    }
    clearErrors('bills'); // Limpar os erros se a remoção for permitida
    remove(index);
  };

  const total_value = bills.reduce((total, bill) => total + (bill.value || 0), 0);

 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitButtonRef = useRef(null);


  const handleCreateOS = async (data) => {
    const filteredData = { ...data, total_value };

    if (!isCheckedTerms) delete filteredData.terms;
    if (!isCheckedTermsTwo) delete filteredData.terms_two;
    if (!isCheckedTermsThree) delete filteredData.terms_three;
    if (!isCheckedTermsFour) delete filteredData.terms_four;
    if (!isCheckedTermsFive) delete filteredData.terms_five;
    if (!isCheckedTermsSix) delete filteredData.terms_six;

    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    try {
      setIsSubmitting(true);
      if (submitButtonRef.current) submitButtonRef.current.disabled = true;


      const response = await fetch(`https://os.estoquefacil.net/api/order-services/create/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
        mode: 'cors',
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da rede:', response.status, response.statusText, errorText);
        throw new Error(`Erro na resposta da rede: ${response.statusText}`);
      }

      const result = await response.json();

      window.location.reload();
      
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
    } finally {
      setIsSubmitting(false);
    }
  };


  const [clients, setClients] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [filteredClients, setFilteredClients] = useState([]); // Clientes filtrados para exibir
const timeoutRef = useRef(null);

// Função para buscar os clientes da API
const fetchClients = async (token) => {
  try {
    const response = await fetch(`https://os.estoquefacil.net/api/order-services/client/${token}`);
    const data = await response.json();
    setClients(data);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
};

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  fetchClients(token);
}, []);

// Manipular a mudança de entrada
const handleInputChange = (e) => {
  const inputValue = e.target.value;
  setSearchTerm(inputValue);

  if (inputValue.length < 2) {
    setFilteredClients([]); // Limpar sugestões se o termo for muito curto
    return;
  }

  // Limpa o timeout anterior
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  // Configura um timeout para debounce
  timeoutRef.current = setTimeout(() => {
    const matchingClients = clients.filter(client =>
      client.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredClients(matchingClients);
  }, 300);  // 300ms de debounce
};

// Função para preencher os campos ao clicar no nome do cliente
const handleClientClick = (client) => {
  setValue('client_name', client.name);
  setValue('client_phone', client.phone_number);
  setValue('client_address', client.address ?? '');
  setValue('client_state', client.state ?? '');
  setValue('client_city', client.city ?? '');
  setValue('client_zipcode', client.postal_code ?? '');
  setValue('client_document', client.document ?? '')
  setValue('client_number', client.number ?? '')
  setSearchTerm(client.name); // Atualizar o campo de busca com o nome selecionado ou string vazia
  setFilteredClients([]); // Limpar sugestões após seleção
};

useEffect(() => {
  const form = document.querySelector('form');
  if (form) {
    form.setAttribute('autocomplete', 'off');
  }
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('name', `disable_autofill_${Math.random()}`);
  });
}, []);





  return (
    <DialogContent className="overflow-y-auto max-h-screen max-w-screen p-6 bg-white rounded-lg shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold pl-2">Nova OS</DialogTitle>
        <DialogDescription className="text-sm text-gray-600 pl-2">Preencha todas as informações abaixo para criar uma nova OS.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateOS)}  className="space-y-10" autoComplete='off'>
        
        {/* Seção: Informações Gerais */}
        <div className="space-y-4 pl-2">
          <h2 className="text-lg font-semibold bg-[#29aae1] py-2 text-white pl-2">Informações Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className='space-y-2 mt-4'>
              <Label htmlFor="date">Data:</Label>
                <Input id="date" {...register('date')} />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="number">Número de ordem</Label>
                <Input id="number" {...register('number')} defaultValue={orderNumber} readOnly/>
                {errors.number && <p className="text-red-500 text-xs">{errors.number.message}</p>}
              </div>
            </div>


          </div>



        </div>

        {/* Seção: Dados do Cliente */}
        <div className="space-y-4 pl-2">
          <h2 className="text-lg font-semibold bg-[#29aae1] text-white pl-2 py-2">Dados do Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
          <Label htmlFor="client_name">Nome do Cliente</Label>
          <Input id="client_name"
            value={searchTerm}
           {...register('client_name')}
            onChange={handleInputChange} />
          {errors.client_name && <p className="text-red-500 text-xs">{errors.client_name.message}</p>}

          {filteredClients.length > 0 && (
              <ul className="absolute z-10 w-[31%] bg-white border border-gray-300 rounded mt-14 max-h-40 overflow-y-auto shadow-lg">
                {filteredClients.map((client) => (
                  <li
                    key={client.id}
                    className="p-2 cursor-pointer hover:bg-[#29aae1] hover:bg-opacity-10 border-b-gray-300 border-1"
                    onClick={() => handleClientClick(client)}
                  >
                    {client.name}
                  </li>
                ))}
              </ul>
            )}

        </div>



            <div className="space-y-2">
              <Label htmlFor="client_phone">Telefone</Label>
              <Input id="client_phone" {...register('client_phone')} />
              {errors.client_phone && <p className="text-red-500 text-xs">{errors.client_phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_document">Documento</Label>
              <Input id="client_document" {...register('client_document')} />
              {errors.client_document && <p className="text-red-500 text-xs">{errors.client_document.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_zipcode">CEP</Label>
              <Input id="client_zipcode" {...register('client_zipcode')} />
              {errors.client_zipcode && <p className="text-red-500 text-xs">{errors.client_zipcode.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_address">Endereço</Label>
              <Input id="client_address" {...register('client_address')} />
              {errors.client_address && <p className="text-red-500 text-xs">{errors.client_address.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_number">Número</Label>
              <Input id="client_number" {...register('client_number')} />
              {errors.client_number && <p className="text-red-500 text-xs">{errors.client_number.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_state">Estado</Label>
              <Input id="client_state" {...register('client_state')} />
              {errors.client_state && <p className="text-red-500 text-xs">{errors.client_state.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_city">Cidade</Label>
              <Input id="client_city" {...register('client_city')} />
              {errors.client_city && <p className="text-red-500 text-xs">{errors.client_city.message}</p>}
            </div>
          </div>
        </div>

        {/* Seção: Informações do Dispositivo */}
        <div className="space-y-4 pl-2">
          <h2 className="text-lg font-semibold bg-[#29aae1] text-white  pl-2 py-2">Informações do Dispositivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device_brand">Marca do Dispositivo</Label>
              <Input id="device_brand" {...register('device_brand')} />
              {errors.device_brand && <p className="text-red-500 text-xs">{errors.device_brand.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_model">Modelo</Label>
              <Input id="device_model" {...register('device_model')} />
              {errors.device_model && <p className="text-red-500 text-xs">{errors.device_model.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_password">Senha</Label>
              <Input id="device_password" {...register('device_password')} />
              {errors.device_password && <p className="text-red-500 text-xs">{errors.device_password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_serial">Número de Série</Label>
              <Input id="device_serial" {...register('device_serial')} />
              {errors.device_serial && <p className="text-red-500 text-xs">{errors.device_serial.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_imei">IMEI</Label>
              <Input id="device_imei" {...register('device_imei')} />
              {errors.device_imei && <p className="text-red-500 text-xs">{errors.device_imei.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_accessories">Acessórios</Label>
              <Input id="device_accessories" {...register('device_accessories')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_additional_info">Informações Adicionais</Label>
              <Input id="device_additional_info" {...register('device_additional_info')} />
            </div>
            
          </div>
        </div>

        {/* Seção: Termos e Peças de Serviço */}
        <div className="space-y-4 pl-2">
        <h2 className="text-lg font-semibold bg-[#29aae1] text-white  pl-2 py-2">Termos de Serviço / Garantia</h2>
        <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTerms}
      />
            <Input id="terms" {...(isCheckedTerms ? {...register('terms')} : {})} defaultValue='A garantia de 90 dias será apenas para a peça ou serviço trocado descrito nesta O.S.' />
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
        </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsTwo}
      />
            <Input id="termsTwo" {...(isCheckedTermsTwo ? {...register('terms_two')} : {})}defaultValue='Dispositivos que não ligam ou têm a tela quebrada não são de nossa responsabilidade por defeitos além dos descritos nesta ordem de serviço, e não há possibilidade de testar o mesmo.'/>
            {errors.terms_two && <p className="text-red-500 text-xs">{errors.terms_two.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsThree}/>
            <Input id="termsThree" {...(isCheckedTermsThree ? {...register('terms_three')} : {})} defaultValue='Se o seu dispositivo entrou em contato com água ou qualquer tipo de líquido e umidade, é possível que a abertura do mesmo danifique a placa, tornando-a impossível de reparar e inutilizando a placa.' />
            {errors.terms_three && <p className="text-red-500 text-xs">{errors.terms_three.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsFour}/>
            <Input id="termsFour" {...(isCheckedTermsFour ? {...register('terms_four')} : {})} defaultValue='A garantia não cobre mau uso, dispositivos molhados, quedas, telas rachadas ou abertura por pessoas não autorizadas.'/>
            {errors.terms_four && <p className="text-red-500 text-xs">{errors.terms_four.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsFive}/>
            <Input id="termsFive" {...(isCheckedTermsFive ? {...register('terms_five')} : {})} defaultValue='Em serviços de reparo e recuperação na placa-mãe, há um alto risco de queimar a placa e tornar o dispositivo inutilizável. Nesses casos, não nos responsabilizamos por quaisquer danos, deixando o cliente ciente do risco de perda do equipamento.' />
            {errors.terms_five && <p className="text-red-500 text-xs">{errors.terms_five.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsSix}/>
            <Input id="termsSix" {...(isCheckedTermsSix ? {...register('terms_six')} : {})} defaultValue='A não retirada do dispositivo dentro de 90 dias corridos resultará em uma cobrança de custódia.' />
            {errors.terms_six && <p className="text-red-500 text-xs">{errors.terms_six.message}</p>}
          </div>
          
        </div>

        <div className="space-y-4 pl-2">
  <h2 className="text-lg font-semibold bg-[#29aae1] text-white pl-2 py-2">Checklist</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2 gap-x-12">
    
    {/* First Column */}
    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Aparelho liga:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.device_turns_on')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.device_turns_on')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.device_turns_on')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Botões:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.buttons')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.buttons')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.buttons')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    {/* Repeat this structure for other checklist items */}

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Tela com Defeito:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.faulty_screen')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.faulty_screen')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.faulty_screen')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Reiniciando:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.restarting')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.restarting')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.restarting')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Bloqueado:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.locked')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.locked')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.locked')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Internet:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.network')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.network')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.network')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    {/* Repeat this structure for the remaining columns */}
    
    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Wifi:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.wifi')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.wifi')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.wifi')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Fone:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.headset')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.headset')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.headset')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Microfone:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.microphone')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.microphone')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.microphone')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Alto Falante:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.speaker')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.speaker')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.speaker')} className="mr-1" defaultChecked/> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40"> Camera Frontal:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.frontal_camera')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.frontal_camera')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.frontal_camera')} className="mr-1" defaultChecked  /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40"> Touch:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.touch')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.touch')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.touch')} className="mr-1"defaultChecked  /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Camera Traseira:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.back_camera')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.back_camera')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.back_camera')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Carcaça:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.casing')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.casing')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.casing')} className="mr-1"defaultChecked  /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Carregador:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.charger')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.charger')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.charger')} className="mr-1"defaultChecked  /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Teclado:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.keyboard')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.keyboard')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.keyboard')} className="mr-1" defaultChecked /> NT
        </label>
      </div>
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Backup:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.backup')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.backup')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.backup')} className="mr-1"defaultChecked  /> NT
        </label>
      </div>
    </div>
    
    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Biometria:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.biometry')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.biometry')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.biometry')} className="mr-1"defaultChecked  /> NT
        </label>
      </div>
      
    </div>

    <div className='border flex items-center p-2'>
      <span className="font-semibold w-40">Sensor Frontal:</span>
      <div className="flex gap-2">
        <label className="flex items-center">
          <input type="radio" value="YES" {...register('checklist.front_sensors')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.front_sensors')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.front_sensors')} className="mr-1"defaultChecked  /> NT
        </label>
      </div>

      
      
    </div>

  </div>
</div>


<div className="space-y-4 pl-2">
        {/* Seção: Valores */}
        <h2 className="text-lg font-semibold bg-[#29aae1] text-white pl-2 py-2">Orçamento</h2>

        {fields.map((field, index) => (
  <div key={field.id} className="border p-4 rounded-md shadow-sm mb-4">
    
    <div className="mb-4">
      <Label htmlFor={`description-${index}`} className="block mb-1 text-sm font-medium text-gray-700">
        Descrição
      </Label>
      <Input
        id={`description-${index}`}
        {...register(`bills.${index}.description`)}
        type='text'
        placeholder="Descrição"
        className="border-gray-300 rounded-md shadow-sm"
      />
      {errors.bills?.[index]?.description && (
        <p className="text-red-500 text-xs mt-1">
          {errors.bills[index].description.message}
        </p>
      )}
    </div>

    <div className="mb-4">
      <Label htmlFor={`amount-${index}`} className="block mb-1 text-sm font-medium text-gray-700">
        Quantidade
      </Label>
      <Input
        id={`amount-${index}`}
        {...register(`bills.${index}.amount`, { valueAsNumber: true })}
        type='number'
        placeholder="Quantidade"
        className="border-gray-300 rounded-md shadow-sm"
      />
      {errors.bills?.[index]?.amount && (
        <p className="text-red-500 text-xs mt-1">
          {errors.bills[index].amount.message}
        </p>
      )}
    </div>

    <div className="mb-4">
      <Label htmlFor={`value-${index}`} className="block mb-1 text-sm font-medium text-gray-700">
        Valor Unitário
      </Label>
      <Input
          id={`value-${index}`}
          {...register(`bills.${index}.value`,
             { valueAsNumber: true,
              validate: {
                positiveNumber: value => {
                  if (value === undefined || value === '' || isNaN(value)) {
                    setError(`bills.${index}.value`, {
                      type: 'manual',
                      message: 'Por favor, informe um valor válido.',
                    });
                    return false;
                  }
                  return true;
                }}
              })}
          type='number'
          placeholder="Valor"
          className="border-gray-300 rounded-md shadow-sm"
        />
      {errors.bills?.[index]?.value && (
        <p className="text-red-500 text-xs mt-1">
          {errors.bills[index].value.message ||  'Valor inválido. Por favor, informe um valor numérico.'}
        </p>
      )}
    </div>
  
    <Button type='button' variant='outline' onClick={() => handleRemove(index)} className="flex items-center text-black hover:text-red-500">
      <Trash className="mr-2 w-4" />
      Remover
    </Button>
  </div>
))}

<Button type='button' variant='outline' className='bg-[#29aae1] text-white hover:bg-cyan-500 hover:text-white' onClick={() => append({
  description: '',
  amount: 0,
  value: 0,
})}>
  <PlusCircle />
  <span className='ml-2 text-white'>Adicionar item</span>
</Button>

<div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
  <p className="text-xl font-bold text-gray-800">
    Valor Total: <span className="text-green-600">R$ {total_value.toFixed(2)}</span>
  </p>
</div>


{errors?.bills && (
        <p className="text-red-500 text-xs">
          {errors.bills?.message}
        </p>
      )}
      </div>

        <DialogFooter className="flex justify-center items-center">
        {isSubmitting ? (
        <div>
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
        <Button
          className="bg-[#29aae1] hover:bg-cyan-500 sm:mt-4 md:mt-0"
          type="submit"
          ref={submitButtonRef} // Referência para o botão
          disabled={isSubmitting} // Desativa o botão se isSubmitting for verdadeiro
        >
          Criar
        </Button>
      )}
          <DialogClose asChild className="ml-2">
            <Button variant='outline' >Cancelar</Button>
            </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );

}