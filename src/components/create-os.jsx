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
import { useState, useEffect  } from "react";
import { PlusCircle, Trash } from 'lucide-react';


const billSchema = z.array(
  z.object(
    {
      description: z.string().min(3, 'Por favor, informe uma descrição válida.'),
      amount: z.number().positive('Por favor, informe um valor válido'),
      value: z.number().positive('Por favor, informe um valor válido')
    }
  )
).min(1, 'Você deve incluir pelo menos um item.')


const isClient = typeof window !== 'undefined' && typeof FileList !== 'undefined';
// Schema de validação usando Zod
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
    : z.any().optional(),
  date: z.string().min(1, "Data é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  client_name: z.string().min(1, "Nome do cliente é obrigatório"),
  client_phone: z.string().min(1, "Telefone do cliente é obrigatório"),
  client_document: z.string().min(1, "Documento do cliente é obrigatório"),
  client_zipcode: z.string().min(1, "CEP do cliente é obrigatório"),
  client_address: z.string().min(1, "Endereço do cliente é obrigatório"),
  client_number: z.string().min(1, "Número do cliente é obrigatório"),
  client_state: z.string().min(1, "Estado do cliente é obrigatório"),
  client_city: z.string().min(1, "Cidade do cliente é obrigatória"),
  device_brand: z.string().min(1, "Marca do dispositivo é obrigatória"),
  device_model: z.string().min(1, "Modelo do dispositivo é obrigatório"),
  device_password: z.string().min(1, "Senha do dispositivo é obrigatória"),
  device_serial: z.string().min(1, "Número de série do dispositivo é obrigatório"),
  device_imei: z.string().min(15, "IMEI do dispositivo é obrigatório ter no mínimo 15 digitos."),
  device_accessories: z.string(),
  device_additional_info: z.string(),
  terms: z.string().optional(),
  terms_two: z.string().optional(),
  terms_three: z.string().optional(),
  terms_four: z.string().optional(),
  terms_five: z.string().optional(),
  terms_six: z.string().optional(),
  bills: billSchema,
})


export function CreateOSDialog() {
  const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(createOSSchema),
  });

 // Função para formatar a data no formato DD/MM/YYYY
 const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Configura o valor inicial do campo de data no formato DD/MM/YYYY
useEffect(() => {
  const today = new Date();
  const formattedDate = formatDate(today);
  setValue('date', formattedDate); // Define o valor inicial do campo
}, [setValue]);

  const {fields, append, remove} = useFieldArray(
    {
      name: 'bills',
      control,
    }
  )

  const generateOrderNumber = () => {
    const orderNumber = Math.floor(Math.random() * 1000000); // Gera um número aleatório
    return orderNumber.toString().padStart(6, '0'); // Garante que o número tenha 6 dígitos
  };

  const orderNumber = generateOrderNumber();


  // Obtenha os valores do campo 'bills'
  const bills = watch('bills') || []; // Garantir que seja um array

  // Calcular o valor total
  const total_value = Array.isArray(bills)
    ? bills.reduce((total, bill) => total + (bill.value || 0), 0)
    : 0;

  // Estado dos checkboxes
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedTermsTwo, setIsCheckedTermsTwo] = useState(false);
  const [isCheckedTermsThree, setIsCheckedTermsThree] = useState(false);
  const [isCheckedTermsFour, setIsCheckedTermsFour] = useState(false);
  const [isCheckedTermsFive, setIsCheckedTermsFive] = useState(false);
  const [isCheckedTermsSix, setIsCheckedTermsSix] = useState(false);

  // Funções para atualizar o estado dos checkboxes
  const handleCheckboxChangeTerms = (e) => setIsCheckedTerms(e);
  const handleCheckboxChangeTermsTwo = (e) => setIsCheckedTermsTwo(e);
  const handleCheckboxChangeTermsThree = (e) => setIsCheckedTermsThree(e);
  const handleCheckboxChangeTermsFour = (e) => setIsCheckedTermsFour(e);
  const handleCheckboxChangeTermsFive = (e) => setIsCheckedTermsFive(e);
  const handleCheckboxChangeTermsSix = (e) => setIsCheckedTermsSix(e);

  const url = '/api/order-services/create';



  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOS = async (data) => {
    const filteredData = { ...data, total_value };

    // Remover os campos dos checkboxes não marcados
    if (!isCheckedTerms) delete filteredData.terms;
    if (!isCheckedTermsTwo) delete filteredData.termsTwo;
    if (!isCheckedTermsThree) delete filteredData.termsThree;
    if (!isCheckedTermsFour) delete filteredData.termsFour;
    if (!isCheckedTermsFive) delete filteredData.termsFive;
    if (!isCheckedTermsSix) delete filteredData.termsSix;

    try {
      if (isSubmitting) return; // Impede novas ações se já estiver enviando

      setIsSubmitting(true); // Define o estado de envio como verdadeiro

      const response = await fetch(url, {
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
      
      // Opção: Adicione lógica de sucesso aqui se necessário
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      // Opção: Adicione lógica de erro aqui se necessário
    } finally {
      setIsSubmitting(false); // Define o estado de envio como falso após o processamento
    }
  };



  return (
    <DialogContent className="overflow-y-auto max-h-screen max-w-screen p-6 bg-white rounded-lg shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold pl-2">Nova OS</DialogTitle>
        <DialogDescription className="text-sm text-gray-600 pl-2">Preencha todas as informações abaixo para criar uma nova OS.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateOS)} className="space-y-10">
        
        {/* Seção: Informações Gerais */}
        <div className="space-y-4 pl-2">
          <h2 className="text-lg font-semibold bg-[#29aae1] py-2 text-white pl-2">Informações Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className='space-y-2'>
              <Label htmlFor="date">Data:</Label>
                <Input id="date" {...register('date')} />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número de ordem</Label>
                <Input id="number" {...register('number')} defaultValue={orderNumber} readOnly/>
                {errors.number && <p className="text-red-500 text-xs">{errors.number.message}</p>}
              </div>
            </div>

            <div className="space-y-2 ml-10 mt-8">
      <div className="relative w-28 h-28 border border-gray-300 rounded overflow-hidden">
       
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">+</span>
          </div>
        
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
              <Input id="client_name" {...register('client_name')} />
              {errors.client_name && <p className="text-red-500 text-xs">{errors.client_name.message}</p>}
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
        Valor
      </Label>
      <Input
        id={`value-${index}`}
        {...register(`bills.${index}.value`, { valueAsNumber: true })}
        type='number'
        placeholder="Valor"
        className="border-gray-300 rounded-md shadow-sm"
      />
      {errors.bills?.[index]?.value && (
        <p className="text-red-500 text-xs mt-1">
          {errors.bills[index].value.message}
        </p>
      )}
    </div>
  
    <Button type='button' variant='outline' onClick={() => remove(index)} className="flex items-center text-black hover:text-red-500">
      <Trash className="mr-2 w-4" />
      Remover
    </Button>
  </div>
))}

<Button type='button' variant='outline' className='bg-[#29aae1] text-white hover:bg-cyan-500 hover:text-white' onClick={() => append({
  description: '',
  amount: 0,
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

      <DialogFooter>
      <Button
        className="bg-[#29aae1] hover:bg-cyan-500"
        type="submit"
        disabled={isSubmitting} // Desativa o botão se isSubmitting for verdadeiro
      >
        Criar
      </Button>
      <DialogClose asChild className="ml-2">
        <Button variant='outline'>Cancelar</Button>
      </DialogClose>
    </DialogFooter>
      </form>
    </DialogContent>
  );

}