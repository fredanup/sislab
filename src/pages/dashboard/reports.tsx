import SaleModal from 'pages/modals/sale-modal';
import FormTitle from 'pages/utilities/form-title';
import Layout from 'pages/utilities/layout';
import { useCallback, useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import { jsPDF } from 'jspdf';
import { ISaleDetail } from 'utils/auth';
import 'jspdf-autotable';
import { useSession } from 'next-auth/react';

interface IProduct {
  name: string;
  Laboratory: {
    name: string;
  } | null;
  Presentation: {
    presentation: string;
  } | null;
  quantity: string;
  price: number;
}

interface IUserSale {
  id: string;
  Product: IProduct | null;
}

export default function Reports() {
  //Obtenemos la sesión de la bd
  const { status } = useSession();
  const [saleExampleIsOpen, setSaleExampleIsOpen] = useState(false);
  const [selectedSaleForModal, setSelectedSaleForModal] =
    useState<ISaleDetail | null>(null);
  const [selectedSaleForPDF, setSelectedSaleForPDF] =
    useState<ISaleDetail | null>(null);
  const [userSales, setUserSales] = useState<IUserSale[]>([]);
  const [isPDFReady, setIsPDFReady] = useState(false);

  const { data: sales } = trpc.sale.findUserSales.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
  const { data: userSalesData } = trpc.example.findSoldExamples.useQuery(
    selectedSaleForPDF?.id || '',
    {
      enabled: !!selectedSaleForPDF?.id,
    },
  );

  useEffect(() => {
    if (selectedSaleForPDF && userSalesData) {
      setUserSales(userSalesData);
      setIsPDFReady(true);
    }
  }, [selectedSaleForPDF, userSalesData]);

  const generatePDF = useCallback(
    async (sale: ISaleDetail) => {
      if (!userSales) {
        return;
      }

      const doc = new jsPDF();

      doc.addImage('/logo.png', 'PNG', 10, 10, 50, 20);
      doc.setFontSize(18);
      doc.text('Reporte de Venta', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`Nro. de venta: ${sale.id}`, 10, 40);
      doc.text(`Descuento: - ${sale.discount} soles`, 10, 50);
      doc.text(`Precio final: ${sale.finalPrice}`, 10, 60);
      doc.text(
        `Fecha: ${new Date(sale.saleDate).toLocaleDateString()}`,
        10,
        70,
      );

      doc.line(10, 80, 200, 80);

      const tableColumns = [
        { header: 'Item', dataKey: 'item' },
        { header: 'Producto', dataKey: 'product' },
        { header: 'Laboratorio', dataKey: 'lab' },
        { header: 'Presentación', dataKey: 'presentation' },
        { header: 'Cantidad', dataKey: 'quantity' },
        { header: 'Precio', dataKey: 'price' },
      ];

      const tableRows = userSales.map((item, index) => ({
        item: index + 1,
        product: item.Product?.name || '',
        lab: item.Product?.Laboratory?.name || '',
        presentation: item.Product?.Presentation?.presentation || '',
        quantity: item.Product?.quantity || '',
        price: item.Product?.price || '',
      }));

      (doc as any).autoTable({
        head: [tableColumns.map((column) => column.header)],
        body: tableRows.map((row) => Object.values(row)),
        startY: 90,
        theme: 'grid',
        headStyles: { fillColor: [171, 205, 223] },
        styles: { fontSize: 10 },
      });

      doc.save(`Reporte-Venta-${sale.id}.pdf`);
    },
    [userSales],
  );

  const openSaleExampleModal = (sale: ISaleDetail) => {
    setSelectedSaleForModal(sale);
    setSaleExampleIsOpen(true);
  };

  const closeSaleExampleModal = () => {
    setSaleExampleIsOpen(false);
  };

  const handleGeneratePDF = (sale: ISaleDetail) => {
    setSelectedSaleForPDF(sale);
    setIsPDFReady(false);
  };

  useEffect(() => {
    if (isPDFReady && selectedSaleForPDF) {
      generatePDF(selectedSaleForPDF);
    }
  }, [generatePDF, isPDFReady, selectedSaleForPDF]);

  return (
    <>
      <Layout>
        <FormTitle text="Reportes" />
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100 text-left text-black font-medium">
              <tr>
                <th className="py-4 px-6">Nro</th>
                <th className="py-4 px-6">Descuento</th>
                <th className="py-4 px-6">Precio final</th>
                <th className="py-4 px-6">Fecha</th>
                <th className="py-4 px-6">Detalle</th>
                <th className="py-4 px-6">Reporte</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              {sales?.map((sale, index) => (
                <tr
                  className={`border-b transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  } hover:bg-gray-100`}
                  key={index}
                >
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6">{sale.discount}</td>
                  <td className="py-4 px-6">{sale.finalPrice}</td>
                  <td className="py-4 px-6">
                    {sale.saleDate.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <svg
                      viewBox="0 0 512 512"
                      className="h-8 w-8 cursor-pointer fill-gray-500 p-1.5"
                      onClick={(event) => {
                        event.stopPropagation();
                        openSaleExampleModal(sale);
                      }}
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                  </td>
                  <td className="py-4 px-6">
                    <svg
                      viewBox="0 0 512 512"
                      className="h-8 w-8 cursor-pointer fill-gray-500 p-1.5"
                      onClick={() => handleGeneratePDF(sale)}
                    >
                      <path d="M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {saleExampleIsOpen && selectedSaleForModal?.id !== undefined && (
          <SaleModal
            isOpen={saleExampleIsOpen}
            onClose={closeSaleExampleModal}
            saleId={selectedSaleForModal?.id}
          />
        )}
      </Layout>
    </>
  );
}
