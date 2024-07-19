import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import DeleteUserModal from 'pages/modals/delete-user-modal';
import ErrorDeletingUser from 'pages/modals/error-deleting-user';
import UpdateUserModal from 'pages/modals/update-user-modal';
import FormTitle from 'pages/utilities/form-title';
import Layout from 'pages/utilities/layout';
import { useEffect, useState } from 'react';
import { IUserBranch } from 'utils/auth';

import { trpc } from 'utils/trpc';

export default function Users() {
  //Obtenemos la sesión de la bd
  const { data: session } = useSession();
  //Hook de estado que controla la apertura del modal de edición
  const [editIsOpen, setEditIsOpen] = useState(false);
  //Hook de estado que controla la apertura del modal de eliminación
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  //Hook de estado que almacena el registro seleccionado
  const [selectedUser, setSelectedUser] = useState<IUserBranch | null>(null);
  /**
   * Consultas a base de datos
   */
  //Obtener todos los usuarios creados con su sucursal
  const { data: users, isLoading } = trpc.user.findManyUserBranch.useQuery();
  //Obtener el usuario actual
  const { data: currentUser } = trpc.user.findCurrentOne.useQuery();

  //Función de selección de registro y apertura de modal de edición
  const openEditModal = (user: IUserBranch) => {
    setSelectedUser(user);
    setEditIsOpen(true);
  };
  //Función de cierre de modal de edición
  const closeEditModal = () => {
    setEditIsOpen(false);
  };
  //Función de selección de registro y apertura de modal de eliminación
  const openDeleteModal = (user: IUserBranch) => {
    setSelectedUser(user);
    setDeleteIsOpen(true);
  };
  //Función de cierre de modal de eliminación
  const closeDeleteModal = () => {
    setDeleteIsOpen(false);
  };
  //Hook de estado utilizado para recordar qué card acaba de seleccionar el usuario
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  //Inicialización de ruta
  const router = useRouter();
  //Nota: En cuanto a jerarquía de tipos tenemos: De más simple a más complejo-->Calling-->Edit-->UserCalling
  /**
   *
   * @param data Parámetro que recibe el registro seleccionado por el usuario.
   * Dicho registro se envía a la función onCardSelect que es argumento del componente y es puente hacia el componente que lo está llamando
   * de esta manera el componente que lo llama tiene acceso a esta información.
   * Además guarda el valor del índice de la card seleccionada por el usuario. Este valor se utilizará posteriormente para dar color
   * a la card y el usuario entienda en qué card se encuentra
   */
  const handleCardClick = (data: IUserBranch, index: number | null) => {
    setSelectedCardIndex(index);
  };

  //Redireccion al usuario a Main
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Vendedor') {
        // Si el usuario está autenticado, redirigir a la página protegida
        router.replace('/dashboard/products').catch((error) => {
          // Manejar cualquier error que pueda ocurrir al redirigir
          console.error('Error al redirigir a la página principal:', error);
        });
      }
    }
  }, [currentUser, router]);

  if (!session?.user) return null;

  return (
    <>
      <Layout>
        <FormTitle text="Gestión de usuarios" />
        <table className="table-auto">
          <thead className="border-b border-gray-200 text-left text-black text-sm font-light">
            <tr>
              <th className="py-4 pr-2">Usuarios</th>
              <th className="py-4 pr-2">Rol</th>
              <th className="py-4 pr-2">Sucursal</th>
              <th className="py-4 pr-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <>
                <tr
                  className="border-b border-gray-200 text-sm font-light"
                  key={index}
                  onClick={() => handleCardClick(user, index)}
                >
                  <td className="py-4 pr-2 flex flex-row gap-3 items-center text-sm font-light">
                    <Image
                      className="rounded-full"
                      width={50}
                      height={50}
                      src={user.image ?? ''}
                      alt="User Avatar"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium">{user.name}</p>
                      <p className="font-light text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-2">{user.role}</td>
                  <td className="py-4 pr-2">{user.Branch?.address}</td>
                  <td className="py-4 text-sky-500 underline">
                    <button
                      className="underline mr-4"
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditModal(user);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="underline"
                      onClick={(event) => {
                        event.stopPropagation();
                        openDeleteModal(user);
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
        {editIsOpen && (
          <UpdateUserModal
            isOpen={editIsOpen}
            onClose={closeEditModal}
            selectedUser={selectedUser}
          />
        )}

        {deleteIsOpen && selectedUser?.id !== session.user.id && (
          <DeleteUserModal
            isOpen={deleteIsOpen}
            onClose={closeDeleteModal}
            selectedUser={selectedUser}
          />
        )}

        {deleteIsOpen && selectedUser?.id === session.user.id && (
          <ErrorDeletingUser isOpen={deleteIsOpen} onClose={closeDeleteModal} />
        )}
      </Layout>
    </>
  );
}
