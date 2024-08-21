
import * as React from "react"
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';




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
  terms: z.string().min(1, "Termos são obrigatórios"),
  termsTwo: z.string().min(1, "Termos são obrigatórios"),
  termsThree: z.string().min(1, "Termos são obrigatórios"),
  parts: z.number().min(0, "O valor deve ser maior ou igual a 0"),
  total: z.number().min(0, "O total deve ser maior ou igual a 0"),
});

export function CreateOSDialog() {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(createOSSchema),
  });

  
  function handleCreateOS(data) {
    console.log('Dados enviados:', data);
  }

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
                <Input id="number" {...register('number')} />
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
      defaultChecked/>
            <Input id="terms" {...register('terms')} />
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
          </div>
          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      defaultChecked/>
            <Input id="termsTwo" {...register('termsTwo')} />
            {errors.termsTwo && <p className="text-red-500 text-xs">{errors.termsTwo.message}</p>}
          </div>
          <div className="space-y-2 flex gap-2 items-center">
            <Checkbox  className="w-4 h-4 data-[state=checked]:bg-[var(--primary)]"
      style={{ "--primary":'#29aae1' }}
      defaultChecked/>
            <Input id="termsThree" {...register('termsThree')} />
            {errors.termsThree && <p className="text-red-500 text-xs">{errors.termsThree.message}</p>}
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
          <input type="radio" value="NT" {...register('checklist.deviceTurnsOn')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.buttons')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.faultyScreen')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.restarting')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.locked')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.network')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.wifi')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.headset')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.microphone')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.speaker')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.frontalCamera')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.touch')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.backCamera')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.casing')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.charger')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.keyboard')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.backup')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.biometry')} className="mr-1" /> NT
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
          <input type="radio" value="NT" {...register('checklist.frontSensors')} className="mr-1" /> NT
        </label>
      </div>

      
      
    </div>

  </div>
</div>



        {/* Seção: Valores */}
        <div className="space-y-4 pl-2">
        <h2 className="text-lg font-semibold bg-[#29aae1] text-white  pl-2 py-2">Orçamento</h2>
          <div className="space-y-2">
            <Label htmlFor="parts">Peças</Label>
            <Input 
              type="number" 
              id="parts" 
              {...register('parts', {
                valueAsNumber: true // Adiciona a configuração para tratar o valor como número
              })} 
              />
            {errors.parts && <p className="text-red-500 text-xs">{errors.parts.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="total">Valor Total</Label>
            <Input 
              type="number" 
              id="total" 
              {...register('total', {
                valueAsNumber: true // Adiciona a configuração para tratar o valor como número
              })} 
              />
            {errors.total && <p className="text-red-500 text-xs">{errors.total.message}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Salvar</Button>
          <DialogClose className="ml-2">Cancelar</DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
