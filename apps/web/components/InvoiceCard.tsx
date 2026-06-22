import React from "react";

type InvoiceCardProps = {
  originalFilename: string;
  uploadedAt: string;
  filesize: number;
  invoiceId?: string;
  purchaseOrder?: string;
  amountDue?: number | string;
  vendorName?: string;
  company?: string;
  total?: number | string;
  documentType?: string;
  dueDate?: string;
  customerName?: string;
  invoiceDate?: string;
  invoiceTotal?: number | string;
  subTotal?: number | string;
  totalTax?: number | string;
  pdfDataUrl: string;
};

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  originalFilename,
  uploadedAt,
  filesize,
  invoiceId,
  purchaseOrder,
  amountDue,
  vendorName,
  company,
  total,
  documentType,
  dueDate,
  customerName,
  invoiceDate,
  invoiceTotal,
  subTotal,
  totalTax,
  pdfDataUrl,
}) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg max-w-3xl mx-auto p-10 mt-10 transition-all hover:shadow-xl overflow-hidden">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
        Invoice: <span className="font-semibold text-blue-700">{originalFilename}</span>
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6">
        <span>Uploaded: {uploadedAt}</span>
        <span>&middot;</span>
        <span>Size: {(filesize / 1024).toFixed(2)} KB</span>
      </div>

      {/* Subtle Gradient Divider */}
      <hr className="border-none h-1 bg-gradient-to-r from-blue-100 via-teal-100 to-gray-100 rounded-full mb-8" />

      {/* Metadata Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {vendorName && (
          <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-900 font-medium text-sm">
            <span className="font-bold">Vendor:</span> {vendorName}
          </span>
        )}
        {company && (
          <span className="px-3 py-1 rounded-full bg-teal-100 border border-teal-200 text-teal-900 font-medium text-sm">
            <span className="font-bold">Company:</span> {company}
          </span>
        )}
        {invoiceId && (
          <span className="px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-900 font-medium text-sm">
            <span className="font-bold">Invoice #:</span> {invoiceId}
          </span>
        )}
        {purchaseOrder && (
          <span className="px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-900 font-medium text-sm">
            <span className="font-bold">PO #:</span> {purchaseOrder}
          </span>
        )}
        {amountDue !== undefined && (
          <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-medium text-sm">
            <span className="font-bold">Amount Due:</span> {amountDue}
          </span>
        )}
        {total !== undefined && (
          <span className="px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-900 font-medium text-sm">
            <span className="font-bold">Total (incl. GST):</span> {total}
          </span>
        )}
        {invoiceTotal !== undefined && (
          <span className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-900 font-medium text-sm">
            <span className="font-bold">Invoice Total:</span> {invoiceTotal}
          </span>
        )}
        {subTotal !== undefined && (
          <span className="px-3 py-1 rounded-full bg-lime-100 border border-lime-200 text-lime-900 font-medium text-sm">
            <span className="font-bold">Subtotal:</span> {subTotal}
          </span>
        )}
        {totalTax !== undefined && (
          <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-900 font-medium text-sm">
            <span className="font-bold">Total Tax:</span> {totalTax}
          </span>
        )}
        {customerName && (
          <span className="px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 font-medium text-sm">
            <span className="font-bold">Customer:</span> {customerName}
          </span>
        )}
        {invoiceDate && (
          <span className="px-3 py-1 rounded-full bg-fuchsia-100 border border-fuchsia-200 text-fuchsia-900 font-medium text-sm">
            <span className="font-bold">Invoice Date:</span> {invoiceDate}
          </span>
        )}
        {dueDate && (
          <span className="px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-900 font-medium text-sm">
            <span className="font-bold">Due Date:</span> {dueDate}
          </span>
        )}
        {documentType && (
          <span className={`px-3 py-1 rounded-full border font-medium text-sm
              ${documentType === "TaxInvoice"
                ? "bg-emerald-100 border-emerald-200 text-emerald-900"
                : "bg-gray-200 border-gray-300 text-gray-700"
              }`}>
            <span className="font-bold">Type:</span> {documentType}
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="border-none h-1 bg-gradient-to-r from-blue-100 via-teal-100 to-gray-100 rounded-full my-8" />

      {/* PDF Preview */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Preview</h2>
        <div className="rounded-xl overflow-hidden shadow border border-gray-200 bg-gray-50">
          <object
            data={pdfDataUrl}
            type="application/pdf"
            width="100%"
            height="500px"
            className="rounded-xl"
          >
            <p>PDF preview is not supported in this browser.</p>
          </object>
        </div>
      </section>
    </div>
  );
};
