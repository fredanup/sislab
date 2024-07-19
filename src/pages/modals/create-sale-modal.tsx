import { Sale } from '@prisma/client';
import FormTitle from 'pages/utilities/form-title';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IMovementDetail, ISaleDetail } from 'utils/auth';
import { trpc } from 'utils/trpc';

export default function CreateSaleModal({
  isOpen,
  selectedExamples,
  onClose,
  handleSelectedExamples,
}: {
  isOpen: boolean;
  selectedExamples: IMovementDetail[];
  onClose: () => void;
  handleSelectedExamples: (data: IMovementDetail[]) => void;
}) {
  const [branchId, setBranchId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<string>(''); // Estado para almacenar el precio total

  const utils = trpc.useContext();
  /**
   * Consultas a base de datos
   */

  //Mutación para la base de datos
  const updateExample = trpc.example.updateExample.useMutation({
    onSettled: async () => {
      await utils.example.findUserExamples.invalidate();
    },
    onError: (error) => {
      console.error('Error creating example:', error);
    },
  });
  const { data: branchs, isLoading } = trpc.branch.findMany.useQuery();
  const createSale = trpc.sale.createSale.useMutation({
    onSettled: async () => {
      await utils.example.findUserExamples.invalidate();
    },
    onError: (error) => {
      console.error('Error creating example:', error);
    },
  });

  const exitForm = () => {
    onClose();
    handleSelectedExamples([]);
  };

  const handleFinalPrice = () => {
    let totalAmount = 0;
    selectedExamples?.forEach((example) => {
      const productPrice = example.Product.price;
      const productQuantity = 1; // Aquí deberías usar la cantidad real del producto, si está disponible.
      totalAmount += productPrice * productQuantity;
    });

    const discountAmount = parseFloat(discount) || 0;
    const discountedPrice = totalAmount * (1 - discountAmount / 100);
    return discountedPrice.toFixed(2); // Redondear el precio total a dos decimales
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Calcular finalPrice aquí para obtener el valor actualizado
    const finalPrice = handleFinalPrice();
    const saleData = {
      buyerId: userId,
      discount: parseFloat(discount),
      finalPrice: parseFloat(finalPrice),
    };

    try {
      const newSale = await createSale.mutateAsync(saleData); // Esperar a que se resuelva la promesa

      // Si la creación de la venta fue exitosa, actualizar los ejemplos
      if (newSale) {
        selectedExamples?.forEach((example) => {
          updateExample.mutate({
            saleId: newSale.id,
            exampleId: example.id,
          });
        });
      }

      // Cerrar el modal y limpiar los ejemplos seleccionados
      onClose();
      handleSelectedExamples([]);
    } catch (error) {
      console.error('Error creating sale:', error);
      // Manejar el error si la mutación falla
    }
  };

  const handleDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validar que se ingresen números o números con decimales
    if (/^\d*\.?\d*$/.test(value)) {
      setDiscount(value);
    }
  };
  const handleDNIChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validar que se ingresen números o números con decimales
    if (/^\d*\.?\d*$/.test(value)) {
      setUserId(value);
    }
  };

  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }
  const finalPrice = handleFinalPrice(); // Calcular el precio total antes de devolver el JSX

  return (
    <div className="fixed inset-0 flex items-center justify-center z-30">
      <form
        className="w-11/12 md:w-1/2 flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg"
        onSubmit={handleSubmit}
      >
        <FormTitle text="Nueva venta" />
        <div className="flex flex-col gap-2">
          <label className="text-black text-sm font-bold">DNI:</label>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={userId}
            onChange={handleDNIChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-black text-sm font-bold">Descuento:</label>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={discount}
            onChange={handleDiscountChange}
            required
          />
        </div>
        <div className="mt-4 max-h-64 overflow-y-auto border p-2">
          <h2 className="text-lg font-semibold mb-2">Detalle</h2>
          <ul className="list-disc pl-5">
            {selectedExamples?.map((example) => (
              <li key={example.id} className="py-1">
                <span>{example.Product?.name}</span> {/* Nombre */}
                <span className="float-right">{example.Product?.price}.00</span>
                {/* Precio alineado a la derecha */}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold mb-2">Precio total</h2>
          <p className="font-semibold pr-2">{finalPrice}</p>
        </div>

        <div className="mt-4 pt-4 flex flex-row justify-end gap-2 border-t border-gray-200">
          <button
            type="button"
            className="rounded-lg border bg-gray-500 px-4 py-1 text-base font-medium text-white"
            onClick={exitForm}
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
      </form>
    </div>
  );
}
