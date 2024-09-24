import { useSession } from 'next-auth/react';
import CreateProductModal from 'pages/modals/create-product-modal';
import DeleteProductModal from 'pages/modals/delete-product-modal';
import ExamplesModal from 'pages/modals/examples-modal';

import FormTitle from 'pages/utilities/form-title';
import Layout from 'pages/utilities/layout';
import { useState } from 'react';
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

  // Obtener la sesión de la BD
  const { status } = useSession();
  /**
   * Consultas a base de datos
   */
  //Obtener todos los usuarios creados con su sucursal
  const { data: products } = trpc.product.findManyProduct.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
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
              className="px-5 py-2 gap-2 text-black font-medium cursor-pointer flex flex-row items-center transition-all duration-300 transform hover:scale-105"
              onClick={(event) => {
                event.stopPropagation();
                openEditModal(null);
              }}
            >
              <svg
                viewBox="0 0 576 512"
                className="h-4 w-4 cursor-pointer fill-purple-500"
              >
                <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z" />
              </svg>
              <p>Producto</p>
            </button>

            <button
              className="px-5 py-2 gap-2 text-black font-medium cursor-pointer flex flex-row items-center transition-all duration-300 transform hover:scale-105"
              onClick={(event) => {
                event.stopPropagation();
                openMovementModal();
              }}
            >
              <svg
                viewBox="0 0 512 512"
                className="h-4 w-4 cursor-pointer fill-sky-500"
              >
                <path d="M190.5 68.8L225.3 128l-1.3 0-72 0c-22.1 0-40-17.9-40-40s17.9-40 40-40l2.2 0c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40L32 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l448 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-41.6 0c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88l-2.2 0c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0L152 0C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40l-72 0-1.3 0 34.8-59.2C329.1 55.9 342.9 48 357.8 48l2.2 0c22.1 0 40 17.9 40 40zM32 288l0 176c0 26.5 21.5 48 48 48l144 0 0-224L32 288zM288 512l144 0c26.5 0 48-21.5 48-48l0-176-192 0 0 224z" />
              </svg>
              <p>Ejemplar</p>
            </button>
          </div>
        </div>
        <div className="relative flex items-center w-full p-3">
          <svg
            viewBox="0 0 512 512"
            className="absolute left-5 h-6 w-6 cursor-pointer fill-gray-500 hover:fill-sky-500 transition-colors duration-300"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <input
            type="text"
            placeholder="Ingrese producto a buscar..."
            className="w-full appearance-none rounded-full border border-gray-300 bg-gray-50 px-10 py-2 text-gray-700 shadow-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow duration-300"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            required
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100 text-left text-black font-medium">
              <tr>
                <th className="py-4 px-6">Producto</th>
                <th className="py-4 px-6">Laboratorio</th>
                <th className="py-4 px-6">Presentación</th>
                <th className="py-4 px-6">Capacidad</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Precio</th>
                <th className="py-4 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              {filteredProducts?.map((product, index) => (
                <tr
                  key={index}
                  className={`border-b transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  } hover:bg-gray-100`}
                >
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6">{product.Laboratory?.name}</td>
                  <td className="py-4 px-6">
                    {product.Presentation?.presentation}
                  </td>
                  <td className="py-4 px-6">{product.quantity}</td>
                  <td className="py-4 px-6">{product.Stocks[0]?.stock ?? 0}</td>
                  <td className="py-4 px-6">S/. {product.price}</td>
                  <td className="py-4 px-6 text-sky-500 underline">
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
