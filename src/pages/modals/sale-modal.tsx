import FormTitle from 'pages/utilities/form-title';
import { trpc } from 'utils/trpc';

export default function SaleModal({
  isOpen,
  onClose,
  saleId,
}: {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
}) {
  //Obtener todos los ejemplares vendidos
  const { data: userSales } = trpc.example.findSoldExamples.useQuery(saleId);
  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
    : 'hidden';
  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }

  return (
    <>
      {/* Fondo borroso y no interactivo */}
      <div className={overlayClassName}></div>
      <form className="fixed inset-0 z-30 flex items-center justify-center p-4 mb-4">
        <div className="max-h-[calc(100%-5rem)] overflow-y-auto flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
          <FormTitle text="Detalle de la venta" />
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-100 text-left text-black font-medium">
                <tr>
                  <th className="py-4 pX-6">Código</th>
                  <th className="py-4 pX-6">Producto</th>
                  <th className="py-4 pX-6">Laboratorio</th>
                  <th className="py-4 pX-6">Presentación</th>
                  <th className="py-4 pX-6">Capacidad</th>
                  <th className="py-4 pX-6">Precio</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {userSales?.map((sale, index) => (
                  <>
                    <tr
                      className={`border-b transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-gray-50' : ''
                      } hover:bg-gray-100`}
                      key={index}
                    >
                      <td className="py-4 pX-6">{sale.id}</td>
                      <td className="py-4 pX-6">{sale.Product?.name}</td>
                      <td className="py-4 pX-6">
                        {sale.Product?.Laboratory?.name}
                      </td>
                      <td className="py-4 pX-6">
                        {sale.Product?.Presentation?.presentation}
                      </td>
                      <td className="py-4 pX-6">{sale.Product?.quantity}</td>
                      <td className="py-4 pX-6">S/. {sale.Product?.price}</td>
                    </tr>
                  </>
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
          </div>
        </div>
      </form>
    </>
  );
}
