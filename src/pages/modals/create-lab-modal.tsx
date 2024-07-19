import FormTitle from 'pages/utilities/form-title';
import { FormEvent, useState } from 'react';
import { trpc } from 'utils/trpc';

export default function CreateLabModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState<string>('');

  const utils = trpc.useContext();
  const createLab = trpc.laboratory.createLab.useMutation({
    onSettled: async () => {
      await utils.laboratory.findMany.invalidate();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const labData = {
      name: name,
    };

    createLab.mutate(labData);

    onClose();
    setName('');
  };
  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-30">
      <form
        className="w-11/12 md:w-1/2 flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg"
        onSubmit={handleSubmit}
      >
        <FormTitle text="Nuevo laboratorio" />

        <div className="flex flex-col gap-2">
          <label className="text-black text-sm font-bold">Nombre:</label>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={name}
            onChange={(event) => setName(event.target.value)}
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
      </form>
    </div>
  );
}
