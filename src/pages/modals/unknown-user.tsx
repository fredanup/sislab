import { signOut } from 'next-auth/react';

export default function UnknownUser() {
  return (
    <div className="absolute top-1/2 left-1/2 z-30 w-11/12 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
      <div className="h-full w-full flex flex-row gap-4">
        <div className="h-full w-full flex flex-col gap-2">
          <h1 className="text-black text-xl font-semibold text-center">
            Cargando
          </h1>
          <p className="text-base font-light text-gray-500 text-center">
            Espere su validación por los administradores...
          </p>
          <div className="flex flex-row justify-center mt-2">
            <svg
              className="animate-spin h-10 w-10 fill-green-600"
              viewBox="0 0 512 512"
            >
              <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z" />
            </svg>
          </div>
          <div className="mt-4 pt-4 flex flex-row justify-center gap-2 border-t border-gray-200">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-full border bg-purple-400 px-4 py-2 text-base font-medium text-white hover:text-white hover:bg-slate-500 hover:border-transparent"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
