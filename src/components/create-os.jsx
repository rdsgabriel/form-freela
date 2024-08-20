'use client'
import { Button } from "./ui/button"
import {DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const createOSSchema = z.object({
  name: z.string(),
  id: z.string(),
})

export function CreateOSDialog () {

  const { register, handleSubmit } = useForm(
    { resolver: zodResolver(createOSSchema) }
  )

  function handleCreateOS(data) {
      console.log(data)
  }

  return (
    <DialogContent>

      <DialogHeader>
        <DialogTitle>Nova OS</DialogTitle>
        <DialogDescription>Crie uma nova OS</DialogDescription>
      </DialogHeader>

    <form onSubmit={handleSubmit(handleCreateOS)} className="space-y-6">
      <div className=" grid grid-cols-4 items-center text-right gap-3">
        <Label htmlFor='name'>Produto</Label>
        <Input className='col-span-3' {...register('name')}></Input>

      </div>

      <div className=" grid grid-cols-4 items-center text-right gap-3">
        <Label htmlFor='name'>ID</Label>
        <Input className='col-span-3' {...register('id')}></Input>

      </div>

      <DialogFooter>

      <DialogClose>
      
      <Button type='submit' className='bg-[#29aae1] hover:bg-cyan-500'>Salvar</Button>
      </DialogClose>
      <DialogClose>
      <Button type='button' variant='outline'>Cancelar</Button>
      </DialogClose>
     
      </DialogFooter>
    </form>

  </DialogContent>
  )
}