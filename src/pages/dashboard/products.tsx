import CreateProductModal from 'pages/modals/create-product-modal';
import DeleteProductModal from 'pages/modals/delete-product-modal';
import ExamplesModal from 'pages/modals/examples-modal';

import FormTitle from 'pages/utilities/form-title';
import Layout from 'pages/utilities/layout';
import { ChangeEvent, useState } from 'react';
import { IProductDetail } from 'utils/auth';
import { trpc } from 'utils/trpc';

export default function Products() {
  const [search, setSearch] = useState('');
  //Hook de estado que controla la apertura del modal de edición
  const [editIsOpen, setEditIsOpen] = useState(false);
  //Hook de estado que controla la apertura del modal de eliminación
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  //Hook de estado que almacena el registro seleccionado
  const [selectedProduct, setSelectedProduct] = useState<IProductDetail | null>(
    null,
  );
  //Hook de estado que controla la apertura del modal de movimiento
  const [movementIsOpen, setMovementIsOpen] = useState(false);

  /**
   * Consultas a base de datos
   */
  //Obtener todos los usuarios creados con su sucursal
  const { data: products, isLoading } = trpc.product.findManyProduct.useQuery();
  //Función de selección de registro y apertura de modal de edición
  const openEditModal = (product: IProductDetail | null) => {
    setSelectedProduct(product);
    setEditIsOpen(true);
  };
  //Función de cierre de modal de edición
  const closeEditModal = () => {
    setEditIsOpen(false);
  };
  //Función de selección de registro y apertura de modal de eliminación
  const openDeleteModal = (product: IProductDetail) => {
    setSelectedProduct(product);
    setDeleteIsOpen(true);
  };
  //Función de cierre de modal de eliminación
  const closeDeleteModal = () => {
    setDeleteIsOpen(false);
  };

  //Función de selección de registro y apertura de modal de movimiento
  const openMovementModal = () => {
    setMovementIsOpen(true);
  };
  //Función de cierre de modal de movimiento
  const closeMovementModal = () => {
    setMovementIsOpen(false);
  };

  const filteredProducts = products?.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Layout>
        <div className="flex gap-2 flex-row md:justify-between justify-around">
          <FormTitle text="Productos" />
          <div className="flex flex-row gap-2 md:gap-4 ml-auto">
            <button
              className="bg-sky-400 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                openMovementModal();
              }}
            >
              Movimientos
            </button>

            <button
              className="bg-purple-400 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                openEditModal(null);
              }}
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  `}
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <input
            type="text"
            placeholder="Ingrese producto a buscar..."
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            required
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 text-left text-black text-sm font-light">
              <tr>
                <th className="py-4 pr-2">Producto</th>
                <th className="py-4 pr-2">Laboratorio</th>
                <th className="py-4 pr-2">Presentación</th>
                <th className="py-4 pr-2">Cantidad</th>

                <th className="py-4 pr-2">Stock</th>
                <th className="py-4 pr-2">Precio</th>
                <th className="py-4 pr-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.map((product, index) => (
                <>
                  <tr
                    className="border-b border-gray-200 text-sm font-light"
                    key={index}
                  >
                    <td className="py-4 pr-2">{product.name}</td>
                    <td className="py-4 pr-2">{product.Laboratory?.name}</td>
                    <td className="py-4 pr-2">
                      {product.Presentation?.presentation}
                    </td>
                    <td className="py-4 pr-2">{product.quantity}</td>
                    <td className="py-4 pr-2">####</td>
                    <td className="py-4 pr-2">{product.price}</td>
                    <td className="py-4 text-sky-500 underline">
                      <button
                        className="underline mr-4"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(product);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="underline"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDeleteModal(product);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        {editIsOpen && (
          <CreateProductModal
            isOpen={editIsOpen}
            onClose={closeEditModal}
            selectedProduct={selectedProduct}
          />
        )}
        {deleteIsOpen && (
          <DeleteProductModal
            isOpen={deleteIsOpen}
            onClose={closeDeleteModal}
            selectedProduct={selectedProduct}
          />
        )}
        {movementIsOpen && (
          <ExamplesModal
            isOpen={movementIsOpen}
            onClose={closeMovementModal}
            selectedProduct={selectedProduct}
          />
        )}
      </Layout>
    </>
  );
}
