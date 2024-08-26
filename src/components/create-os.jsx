

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
import { useState,  } from "react";
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
    deviceTurnsOn: z.string().nonempty("Campo obrigatório"),
    faultyScreen: z.string().nonempty("Campo obrigatório"),
    restarting: z.string().nonempty("Campo obrigatório"),
    locked: z.string().nonempty("Campo obrigatório"),
    network: z.string().nonempty("Campo obrigatório"),
    wifi: z.string().nonempty("Campo obrigatório"),
    headset: z.string().nonempty("Campo obrigatório"),
    microphone: z.string().nonempty("Campo obrigatório"),
    speaker: z.string().nonempty("Campo obrigatório"),
    frontalCamera: z.string().nonempty("Campo obrigatório"),
    backCamera: z.string().nonempty("Campo obrigatório"),
    biometry: z.string().nonempty("Campo obrigatório"),
    frontSensors: z.string().nonempty("Campo obrigatório"),
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
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientPhone: z.string().min(1, "Telefone do cliente é obrigatório"),
  clientDocument: z.string().min(1, "Documento do cliente é obrigatório"),
  clientZipCode: z.string().min(1, "CEP do cliente é obrigatório"),
  clientAddress: z.string().min(1, "Endereço do cliente é obrigatório"),
  clientNumber: z.string().min(1, "Número do cliente é obrigatório"),
  clientState: z.string().min(1, "Estado do cliente é obrigatório"),
  clientCity: z.string().min(1, "Cidade do cliente é obrigatória"),
  deviceBrand: z.string().min(1, "Marca do dispositivo é obrigatória"),
  deviceModel: z.string().min(1, "Modelo do dispositivo é obrigatório"),
  devicePassword: z.string().min(1, "Senha do dispositivo é obrigatória"),
  deviceSerial: z.string().min(1, "Número de série do dispositivo é obrigatório"),
  deviceIMEI: z.string().min(1, "IMEI do dispositivo é obrigatório"),
  deviceAccessories: z.string(),
  deviceAdditionalInfo: z.string(),
  terms: z.string().optional(),
  termsTwo: z.string().optional(),
  termsThree: z.string().optional(),
  termsFour: z.string().optional(),
  termsFive: z.string().optional(),
  termsSix: z.string().optional(),
  bills: billSchema,
})


export function CreateOSDialog() {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    resolver: zodResolver(createOSSchema),
  });

  const {fields, append, remove} = useFieldArray(
    {
      name: 'bills',
      control,
    }
  )

  const generateOrderNumber = () => {
    return Math.floor(Math.random() * 1000000000); // Gera um número aleatório
  };

  const orderNumber = generateOrderNumber();


  // Obtenha os valores do campo 'bills'
  const bills = watch('bills') || []; // Garantir que seja um array

  // Calcular o valor total
  const totalValue = Array.isArray(bills)
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

  const handleCreateOS = (data) => {
    const filteredData = { ...data, totalValue };
    // Remover os campos dos checkboxes não marcados
    if (!isCheckedTerms) delete filteredData.terms;
    if (!isCheckedTermsTwo) delete filteredData.termsTwo;
    if (!isCheckedTermsThree) delete filteredData.termsThree;
    if (!isCheckedTermsFour) delete filteredData.termsFour;
    if (!isCheckedTermsFive) delete filteredData.termsFive;
    if (!isCheckedTermsSix) delete filteredData.termsSix;

    console.log('Dados enviados:', filteredData);
  };


  const [logoPreview, setLogoPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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

            <div className="space-y-2 ml-10">
      <Label htmlFor="logo">Logotipo:</Label>
      <div className="relative w-28 h-28 border border-gray-300 rounded overflow-hidden">
        <Input
          type="file"
          id="logo"
          accept="image/*"
          {...register('logo')}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {logoPreview ? (
          <img
            src={logoPreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">+</span>
          </div>
        )}
      </div>
      {errors.logo && (
        <p className="text-red-500 text-xs">
          {errors.logo.message}
        </p>
      )}
    </div>
            
          </div>



        </div>
        
        {/* Seção: Dados do Cliente */}
        <div className="space-y-4 pl-2">
          <h2 className="text-lg font-semibold bg-[#29aae1] text-white pl-2 py-2">Dados do Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input id="clientName" {...register('clientName')} />
              {errors.clientName && <p className="text-red-500 text-xs">{errors.clientName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Telefone</Label>
              <Input id="clientPhone" {...register('clientPhone')} />
              {errors.clientPhone && <p className="text-red-500 text-xs">{errors.clientPhone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientDocument">Documento</Label>
              <Input id="clientDocument" {...register('clientDocument')} />
              {errors.clientDocument && <p className="text-red-500 text-xs">{errors.clientDocument.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientZipCode">CEP</Label>
              <Input id="clientZipCode" {...register('clientZipCode')} />
              {errors.clientZipCode && <p className="text-red-500 text-xs">{errors.clientZipCode.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Endereço</Label>
              <Input id="clientAddress" {...register('clientAddress')} />
              {errors.clientAddress && <p className="text-red-500 text-xs">{errors.clientAddress.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientNumber">Número</Label>
              <Input id="clientNumber" {...register('clientNumber')} />
              {errors.clientNumber && <p className="text-red-500 text-xs">{errors.clientNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientState">Estado</Label>
              <Input id="clientState" {...register('clientState')} />
              {errors.clientState && <p className="text-red-500 text-xs">{errors.clientState.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientCity">Cidade</Label>
              <Input id="clientCity" {...register('clientCity')} />
              {errors.clientCity && <p className="text-red-500 text-xs">{errors.clientCity.message}</p>}
            </div>
          </div>
        </div>

        {/* Seção: Informações do Dispositivo */}
        <div className="space-y-4 pl-2">
          <h2 className="text-lg font-semibold bg-[#29aae1] text-white  pl-2 py-2">Informações do Dispositivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceBrand">Marca do Dispositivo</Label>
              <Input id="deviceBrand" {...register('deviceBrand')} />
              {errors.deviceBrand && <p className="text-red-500 text-xs">{errors.deviceBrand.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceModel">Modelo</Label>
              <Input id="deviceModel" {...register('deviceModel')} />
              {errors.deviceModel && <p className="text-red-500 text-xs">{errors.deviceModel.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="devicePassword">Senha</Label>
              <Input id="devicePassword" {...register('devicePassword')} />
              {errors.devicePassword && <p className="text-red-500 text-xs">{errors.devicePassword.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceSerial">Número de Série</Label>
              <Input id="deviceSerial" {...register('deviceSerial')} />
              {errors.deviceSerial && <p className="text-red-500 text-xs">{errors.deviceSerial.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceIMEI">IMEI</Label>
              <Input id="deviceIMEI" {...register('deviceIMEI')} />
              {errors.deviceIMEI && <p className="text-red-500 text-xs">{errors.deviceIMEI.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceAccessories">Acessórios</Label>
              <Input id="deviceAccessories" {...register('deviceAccessories')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceAdditionalInfo">Informações Adicionais</Label>
              <Input id="deviceAdditionalInfo" {...register('deviceAdditionalInfo')} />
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
            <Input id="termsTwo" {...(isCheckedTermsTwo ? {...register('termsTwo')} : {})}defaultValue='Dispositivos que não ligam ou têm a tela quebrada não são de nossa responsabilidade por defeitos além dos descritos nesta ordem de serviço, e não há possibilidade de testar o mesmo.'/>
            {errors.termsTwo && <p className="text-red-500 text-xs">{errors.termsTwo.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsThree}/>
            <Input id="termsThree" {...(isCheckedTermsThree ? {...register('termsThree')} : {})} defaultValue='Se o seu dispositivo entrou em contato com água ou qualquer tipo de líquido e umidade, é possível que a abertura do mesmo danifique a placa, tornando-a impossível de reparar e inutilizando a placa.' />
            {errors.termsThree && <p className="text-red-500 text-xs">{errors.termsThree.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsFour}/>
            <Input id="termsFour" {...(isCheckedTermsFour ? {...register('termsFour')} : {})} defaultValue='A garantia não cobre mau uso, dispositivos molhados, quedas, telas rachadas ou abertura por pessoas não autorizadas.'/>
            {errors.termsFour && <p className="text-red-500 text-xs">{errors.termsFour.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsFive}/>
            <Input id="termsFive" {...(isCheckedTermsFive ? {...register('termsFive')} : {})} defaultValue='Em serviços de reparo e recuperação na placa-mãe, há um alto risco de queimar a placa e tornar o dispositivo inutilizável. Nesses casos, não nos responsabilizamos por quaisquer danos, deixando o cliente ciente do risco de perda do equipamento.' />
            {errors.termsFive && <p className="text-red-500 text-xs">{errors.termsFive.message}</p>}
          </div>

          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      onCheckedChange={handleCheckboxChangeTermsSix}/>
            <Input id="termsSix" {...(isCheckedTermsSix ? {...register('termsSix')} : {})} defaultValue='A não retirada do dispositivo dentro de 90 dias corridos resultará em uma cobrança de custódia.' />
            {errors.termsSix && <p className="text-red-500 text-xs">{errors.termsSix.message}</p>}
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
          <input type="radio" value="YES" {...register('checklist.deviceTurnsOn')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.deviceTurnsOn')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.deviceTurnsOn')} className="mr-1" defaultChecked /> NT
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
          <input type="radio" value="YES" {...register('checklist.faultyScreen')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.faultyScreen')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.faultyScreen')} className="mr-1" defaultChecked /> NT
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
          <input type="radio" value="YES" {...register('checklist.frontalCamera')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.frontalCamera')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.frontalCamera')} className="mr-1" defaultChecked  /> NT
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
          <input type="radio" value="YES" {...register('checklist.backCamera')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.backCamera')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.backCamera')} className="mr-1" defaultChecked /> NT
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
          <input type="radio" value="YES" {...register('checklist.frontSensors')} className="mr-1" /> SIM
        </label>
        <label className="flex items-center">
          <input type="radio" value="NO" {...register('checklist.frontSensors')} className="mr-1" /> NÃO
        </label>
        <label className="flex items-center">
          <input type="radio" value="NT" {...register('checklist.frontSensors')} className="mr-1"defaultChecked  /> NT
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
    Valor Total: <span className="text-green-600">R$ {totalValue.toFixed(2)}</span>
  </p>
</div>


{errors?.bills && (
        <p className="text-red-500 text-xs">
          {errors.bills?.message}
        </p>
      )}
      </div>

        <DialogFooter>
          <Button className="bg-[#29aae1] hover:bg-cyan-500" type="submit">Criar</Button>
          <DialogClose asChild className="ml-2"><Button variant='outline' >Cancelar</Button></DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );

}
