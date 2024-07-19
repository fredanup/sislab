import FormTitle from 'pages/utilities/form-title';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IProductDetail } from 'utils/auth';
import { trpc } from 'utils/trpc';
import CreateLabModal from './create-lab-modal';
import CreatePresentationModal from './create-presentation-modal';

export default function CreateProductModal({
  isOpen,
  onClose,
  selectedProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: IProductDetail | null;
}) {
  const [name, setName] = useState<string>('');
  const [laboratoryId, setLaboratoryId] = useState<string>('');
  const [presentationId, setPresentationId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isPresOpen, setIsPresOpen] = useState(false);
  const utils = trpc.useContext();
  //Mutación para la base de datos
  //Obtener todos los usuarios creados con su sucursal
  const { data: laboratories } = trpc.laboratory.findMany.useQuery();
  const { data: presentations } = trpc.presentation.findMany.useQuery();

  const createProduct = trpc.product.createProduct.useMutation({
    onSettled: async () => {
      await utils.product.findManyProduct.invalidate();
    },
  });

  const updateProduct = trpc.product.updateProduct.useMutation({
    onSettled: async () => {
      await utils.product.findManyProduct.invalidate();
    },
  });

  useEffect(() => {
    if (selectedProduct !== null) {
      setName(selectedProduct.name!);
      setQuantity(selectedProduct.quantity!);
      setPrice(selectedProduct.price!.toString());
      if (laboratories) {
        const laboratoryMatchedOption = laboratories.find(
          (laboratory) => laboratory.id === selectedProduct.laboratoryId,
        );
        if (laboratoryMatchedOption) {
          setLaboratoryId(selectedProduct.laboratoryId!);
        }
      }
      if (presentations) {
        const presentationMatchedOption = presentations.find(
          (presentation) => presentation.id === selectedProduct.presentationId,
        );
        if (presentationMatchedOption) {
          setPresentationId(selectedProduct.presentationId!);
        }
      }
    }
  }, [laboratories, presentations, selectedProduct]);

  const openLabModal = () => {
    setIsLabOpen(true);
  };

  const closeLabModal = () => {
    setIsLabOpen(false);
  };

  const openPresModal = () => {
    setIsPresOpen(true);
  };

  const closePresModal = () => {
    setIsPresOpen(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validar que se ingresen números o números con decimales
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const productData = {
      name: name,
      quantity: quantity,
      price: parseFloat(price),
      laboratoryId: laboratoryId,
      presentationId: presentationId,
    };

    if (selectedProduct !== null) {
      updateProduct.mutate({
        id: selectedProduct.id,
        ...productData,
      });
    } else {
      createProduct.mutate(productData);
    }

    onClose();
    setName('');
    setQuantity('');
    setPrice('');
    setLaboratoryId('');
    setPresentationId('');
  };
  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }
  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
    : 'hidden';
  return (
    <>
      {/* Fondo borroso y no interactivo */}
      <div className={overlayClassName}></div>
      <form
        onSubmit={handleSubmit}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-30 w-11/12 md:w-auto overflow-auto rounded-lg bg-white p-9"
      >
        <div className="flex flex-col gap-2">
          <FormTitle text="Crear producto" />
          <p className="text-justify text-base font-light text-gray-500">
            Complete los campos presentados a continuación:
          </p>

          {/**CUERPO 1*/}
          <div className="flex flex-col gap-2">
            <label className="text-black text-sm font-bold">
              Nombre del producto:
            </label>
            <input
              type="text"
              className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <label className="text-black text-sm font-bold">
                Laboratorio:
              </label>
              <svg
                viewBox="0 0 512 512"
                className={`h-8 w-8 cursor-pointer fill-black p-1.5  `}
                onClick={(event) => {
                  event.stopPropagation();
                  openLabModal();
                }}
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
            </div>
            <div>
              <select
                className="block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={laboratoryId}
                onChange={(event) => setLaboratoryId(event.target.value)}
                required
              >
                {selectedProduct?.laboratoryId === null ||
                  (selectedProduct == null && (
                    <>
                      <option value="">Seleccionar</option>
                    </>
                  ))}
                {laboratories?.map((laboratory) => (
                  <option key={laboratory.id} value={laboratory.id}>
                    {laboratory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <label className="text-black text-sm font-bold">
                Presentación:
              </label>
              <svg
                viewBox="0 0 512 512"
                className={`h-8 w-8 cursor-pointer fill-black p-1.5  `}
                onClick={(event) => {
                  event.stopPropagation();
                  openPresModal();
                }}
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
            </div>
            <div>
              <select
                className="block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={presentationId}
                onChange={(event) => setPresentationId(event.target.value)}
                required
              >
                {selectedProduct?.presentationId === null ||
                  (selectedProduct === null && (
                    <>
                      <option value="">Seleccionar</option>
                    </>
                  ))}
                {presentations?.map((presentation) => (
                  <option key={presentation.id} value={presentation.id}>
                    {presentation.presentation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black text-sm font-bold">
              Cantidad por unidad:
            </label>
            <input
              type="text"
              className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black text-sm font-bold">
              Precio unitario:
            </label>
            <input
              type="text"
              className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              value={price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4 pt-4 flex flex-row justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              className="rounded-lg border bg-gray-500 px-4 py-1 text-base font-medium text-white"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg border bg-sky-500 px-4 py-1 text-base font-medium text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      </form>
      {isLabOpen && (
        <CreateLabModal isOpen={isLabOpen} onClose={closeLabModal} />
      )}
      {isPresOpen && (
        <CreatePresentationModal isOpen={isPresOpen} onClose={closePresModal} />
      )}
    </>
  );
}
