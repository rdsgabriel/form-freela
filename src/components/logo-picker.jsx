import React, { useState } from 'react';

export function LogoUploader({ name, register, setValue, errors }) {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setValue(name, reader.result); // Guarda o valor da imagem no campo 'logo'
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-[200px] items-start ml-20 mb-4">
      <label
        htmlFor={name}
        className="block text-gray-700 font-medium ml-6 mb-1 cursor-pointer"
      >
        Seu Logotipo:
      </label>
      <div className="relative w-36 h-32 border ml-6 border-gray-300 rounded overflow-hidden">
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          {...register(name)} // Certifique-se de que register é uma função que pode ser chamada
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
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
      {errors[name] && <p className="text-red-500 text-xs ml-6">{errors[name].message}</p>}
    </div>
  );
}
