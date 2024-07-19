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
  /**
   * Consultas a base de datos
   */

  //Obtener todos los ejemplares vendidos
  const { data: userSales, isLoading } =
    trpc.example.findSoldExamples.useQuery(saleId);

  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <form className="w-11/12 md:w-1/2 flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
          <FormTitle text="Detalle de la venta" />

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="border-b border-gray-200 text-left text-black text-sm font-light">
                <tr>
                  <th className="py-4 pr-2">Código</th>
                  <th className="py-4 pr-2">Producto</th>
                  <th className="py-4 pr-2">Laboratorio</th>
                  <th className="py-4 pr-2">Presentación</th>
                  <th className="py-4 pr-2">Cantidad</th>
                  <th className="py-4 pr-2">Precio</th>
                </tr>
              </thead>
              <tbody>
                {userSales?.map((sale, index) => (
                  <>
                    <tr
                      className="border-b border-gray-200 text-sm font-light"
                      key={index}
                    >
                      <td className="py-4 pr-2">{sale.id}</td>
                      <td className="py-4 pr-2">{sale.Product?.name}</td>
                      <td className="py-4 pr-2">
                        {sale.Product?.Laboratory?.name}
                      </td>
                      <td className="py-4 pr-2">
                        {sale.Product?.Presentation?.presentation}
                      </td>
                      <td className="py-4 pr-2">{sale.Product?.quantity}</td>
                      <td className="py-4 pr-2">{sale.Product?.price}</td>
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
        </form>
      </div>
    </>
  );
}
