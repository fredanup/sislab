import FormTitle from 'pages/utilities/form-title';
import { FormEvent, useEffect, useState } from 'react';
import { IMovementDetail } from 'utils/auth';
import { trpc } from 'utils/trpc';

export default function CreateOutputModal({
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

  const utils = trpc.useContext();
  /**
   * Consultas a base de datos
   */

  //Mutación para la base de datos
  const { data: branchs, isLoading } = trpc.branch.findMany.useQuery();
  const createMovement = trpc.movement.createOutputMovement.useMutation({
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    selectedExamples?.forEach((example) => {
      const movementData = {
        provenanceId: example.branchId,
        destinationId: branchId,
        exampleId: example.id,
      };

      createMovement.mutate(movementData);
    });

    onClose();
    handleSelectedExamples([]);
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
        <FormTitle text="Nueva salida" />
        <div className="mt-4 max-h-64 overflow-y-auto border p-2">
          <h2 className="text-lg font-semibold mb-2">
            Ejemplares Seleccionados
          </h2>
          <ul className="list-disc pl-5">
            {selectedExamples?.map((example) => (
              <li key={example.id} className="py-1">
                {example.Product?.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-black text-sm font-bold">
            Sucursal de destino:
          </label>
          <div>
            <select
              className="block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
            >
              <option value="" disabled>
                Selecciona una sucursal
              </option>
              {branchs?.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.address}
                </option>
              ))}
            </select>
          </div>
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
