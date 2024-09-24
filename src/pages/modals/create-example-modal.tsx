import { useSession } from 'next-auth/react';
import FormTitle from 'pages/utilities/form-title';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';

export default function CreateExampleModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [branchId, setBranchId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  // Obtener la sesión de la BD
  const { status } = useSession();
  const utils = trpc.useContext();
  /**
   * Consultas a base de datos
   */

  //Obtener todos los usuarios creados con su sucursal
  const { data: products } = trpc.product.findManyProduct.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
  //Obtener el usuario actual
  const { data: currentUser } = trpc.user.findCurrentOne.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-30'
    : 'hidden';
  //Mutación para la base de datos
  const createExample = trpc.example.createExample.useMutation({
    onSettled: async () => {
      await utils.example.findUserExamples.invalidate();
      await utils.product.findManyProduct.invalidate();
    },
    onError: (error) => {
      console.error('Error creating example:', error);
    },
  });
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validar que se ingresen números o números con decimales
    if (/^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setBranchId(currentUser.branchId!);
    }
  }, [currentUser, currentUser?.branchId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const exampleData = {
      productId: selectedProductId,
      branchId: branchId,
      saleId: null,
      isAvailable: true,
      quantity: parseFloat(quantity), // Enviar la cantidad al backend
    };

    createExample.mutate(exampleData);

    onClose();
    setSelectedProductId('');
    setBranchId('');
  };

  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }
  const filteredProducts = products?.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {/* Fondo borroso y no interactivo */}
      <div className={overlayClassName}></div>
      <form
        className="fixed inset-0 z-30 flex items-center justify-center p-4 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="max-h-[calc(100%-5rem)] overflow-y-auto flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
          <FormTitle text="Nuevo ejemplar" />
          <p className="text-sm font-light">
            Seleccione el ejemplar que desea agregar:
          </p>

          <div className="mt-4 items-center flex md:flex-row flex-col gap-4">
            <div className="flex flex-row gap-2 w-full items-center">
              <svg
                viewBox="0 0 512 512"
                className="h-6 w-6 cursor-pointer fill-gray-500"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
              <input
                type="text"
                placeholder="Ingrese producto a buscar..."
                className="w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <svg
                viewBox="0 0 448 512"
                className="h-5 w-5 cursor-pointer fill-gray-500"
              >
                <path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128l95.1 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0L325.8 320l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7-95.1 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 21.3-128L64 192c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320l95.1 0 21.3-128-95.1 0z" />
              </svg>

              <input
                type="text"
                placeholder="Cantidad"
                className="focus:shadow-outline w-32 appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                value={quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b border-gray-200 text-left text-black text-sm font-light">
                <tr>
                  <th className="py-4 pr-2">Seleccionar</th>
                  <th className="py-4 pr-2">Producto</th>
                  <th className="py-4 pr-2">Laboratorio</th>
                  <th className="py-4 pr-2">Presentación</th>
                  <th className="py-4 pr-2">Capacidad</th>
                  <th className="py-4 pr-2">Precio</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr
                    className="border-b border-gray-200 text-sm font-light"
                    key={index}
                  >
                    <td className="py-4 pr-2">
                      <input
                        type="radio"
                        name="selectedProduct"
                        value={product.id}
                        checked={selectedProductId === product.id}
                        onChange={(event) =>
                          setSelectedProductId(event.target.value)
                        }
                      />
                    </td>
                    <td className="py-4 pr-2">{product.name}</td>
                    <td className="py-4 pr-2">{product.Laboratory?.name}</td>
                    <td className="py-4 pr-2">
                      {product.Presentation?.presentation}
                    </td>
                    <td className="py-4 pr-2">{product.quantity}</td>
                    <td className="py-4 pr-2">S/. {product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  );
}
