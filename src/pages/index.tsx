import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from './utilities/spinner';
import { trpc } from 'utils/trpc';

export default function Home() {
  //Obtenemos la sesión de la bd
  const { data: session, status } = useSession();
  /**
   * Consultas a base de datos
   */
  //Obtener el usuario actual
  const { data: currentUser } = trpc.user.findOne.useQuery(
    session?.user?.id ?? '',
  );

  //Inicialización de ruta
  const router = useRouter();

  //Redireccion al usuario a Main
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
      return;
    }
    if (session) {
      if (currentUser) {
        if (currentUser.role !== null) {
          if (currentUser.role !== 'Vendedor') {
            // Si el usuario está autenticado, redirigir a la página protegida
            router.replace('/dashboard/users').catch((error) => {
              // Manejar cualquier error que pueda ocurrir al redirigir
              console.error('Error al redirigir a la página principal:', error);
            });
          } else {
            // Si el usuario está autenticado, redirigir a la página protegida
            router.replace('/dashboard/products').catch((error) => {
              // Manejar cualquier error que pueda ocurrir al redirigir
              console.error('Error al redirigir a la página principal:', error);
            });
          }
        } else {
          router.replace('/modals/unknown-user').catch((error) => {
            // Manejar cualquier error que pueda ocurrir al redirigir
            console.error('El usuario no tiene un rol asignado', error);
          });
        }
      }
    }
  }, [status, session, router, currentUser]);

  return (
    <>
      {status === 'authenticated' || status === 'loading' ? (
        <Spinner text="Cargando" />
      ) : (
        <>
          <Image
            src={'/background.jpg'}
            layout="fill"
            objectFit="cover"
            alt="Background"
          />
          <div className="absolute top-1/2 left-1/2 z-30 w-8/12 -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg bg-white p-6 drop-shadow-lg">
            <div className="flex flex-col gap-6 items-center">
              <Image src={'/logo.png'} width={150} height={150} alt="Logo" />
              <button
                className="rounded-full border bg-slate-700 px-4 py-2 text-base font-medium text-white hover:text-white hover:bg-slate-500 hover:border-transparent"
                onClick={() => {
                  signIn('google').catch(console.log);
                }}
              >
                Iniciar sesión con Google
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
