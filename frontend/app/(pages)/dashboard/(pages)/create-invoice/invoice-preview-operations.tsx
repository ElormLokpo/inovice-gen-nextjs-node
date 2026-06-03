import { Cbutton } from "@/app/components"
import { ArrowCircleDownIcon } from "@phosphor-icons/react"

import { IBusiness } from "@/app/types"
import { useClients, useInvoiceItems, useRateValues } from "@/app/store"
import { useCreateInvoice } from "@/app/hooks/useInvoice"
import { toast } from "sonner"
import { pdf } from "@react-pdf/renderer"
import { InvoicePdfDocument } from "./invoice-pdf-document"


export const InvoicePreviewOperations = ({ selectedBusiness, invoiceDates }: { selectedBusiness?: IBusiness, invoiceDates?: { issueDate: string, dueDate: string } }) => {
    const invoiceItems = useInvoiceItems((state) => state.invoiceItems)
    const rateAmounts = useInvoiceItems((state) => state.rateAmounts)
    const rateValues = useRateValues((state) => state.rateValues)

    const selectedClient = useClients((state) => state.client)
    const { mutateAsync: createInvoice, isPending } = useCreateInvoice()

    const downloadInvoicePdf = async (invoiceData: Awaited<ReturnType<typeof createInvoice>>["data"]["data"]) => {
        if (!selectedBusiness) return

        const invoiceBlob = await pdf(
            <InvoicePdfDocument
                invoice={invoiceData}
                business={selectedBusiness}
                client={selectedClient}
                items={invoiceItems}
                rateAmounts={rateAmounts}
                rateValues={rateValues}
            />,
        ).toBlob()

        const url = URL.createObjectURL(invoiceBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${invoiceData.invoiceNumber}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    }

    const handleDownloadInvoice = async () => {
        if (!selectedBusiness?.id) {
            toast.error("Select a business before generating the invoice.")
            return
        }

        if (!selectedClient.name.trim()) {
            toast.error("Add the client details before generating the invoice.")
            return
        }

        if (!invoiceDates?.issueDate || !invoiceDates.dueDate) {
            toast.error("Add the invoice issue and due dates.")
            return
        }

        if (!invoiceItems.length) {
            toast.error("Add at least one invoice item.")
            return
        }

        const finalData = {
            businessId: selectedBusiness.id,
            currency: selectedBusiness.currency || "GHS",
            clientDetails: selectedClient,
            clientEmail: selectedClient.email,
            invoiceItems: invoiceItems,
            subtotal: rateAmounts?.total,
            ...rateAmounts,
            ...rateValues,
            issueDate: invoiceDates.issueDate,
            dueDate: invoiceDates.dueDate,
        }

        const response = await createInvoice(finalData)
        await downloadInvoicePdf(response.data.data)
    }


    return (
        <div className="border border-zinc-800 p-3 rounded-xl">

            <div className="flex mb-3 justify-between border-b pb-4 border-zinc-800 ">
                <div className="text-lg font-semibold">Invoice Preview</div>

                <div className="flex gap-3 items-center">

                    <Cbutton handler={handleDownloadInvoice} buttonType="standard" variant="secondary" size="sm" label="Generate Invoice" loadingText="Generating..." isLoading={isPending} icon={<ArrowCircleDownIcon size={12} />} />
                </div>
            </div>

            <div className="bg-zinc-800/50 p-2 rounded-2xl ">
                <div className="flex justify-between text-xs border-b p-2 mb-5 border-zinc-800">
                    <div><span className="text-zinc-400">Date of issue: </span>{invoiceDates?.issueDate || "November 20, 2026"}</div>
                    <div><span className="text-zinc-400">Date of due: </span>{invoiceDates?.dueDate || "November 20, 2026"}</div>

                </div>

                <div className="flex justify-between items-end mb-6">
                    <div className="text-sm">
                        <div className="text-2xl font-semibold">INVOICE</div>
                        <span><span className="text-zinc-400">Invoice Number:</span> INV-S23R230RF223F-2F</span>
                    </div>
                    <div >
                        <span className="font-semibold">Company Name</span>
                    </div>
                </div>

                <div className="p-2 bg-zinc-800/20 mb-10 text-xs flex justify-between mb-4 rounded-xl border border-zinc-600/50">
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-400 mb-2">Send to:</span>
                        <span className=" mb-2">{selectedClient.name.length > 0 ? selectedClient.name : "Client Name"}</span>
                        <span className="text-zinc-400 mb-2">{selectedClient.address.length > 0 ? selectedClient.address : "Client Address"}</span>
                        <span className="text-zinc-400 mb-2">{selectedClient.phone.length > 0 ? selectedClient.phone : "Client Phone"}</span>



                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-zinc-400 mb-2">Sent from:</span>
                        <span className=" mb-2">{selectedBusiness ? selectedBusiness?.name : "Business Name"}</span>
                        <span className="text-zinc-400 mb-2">{selectedBusiness ? selectedBusiness?.address : "Business Address"}</span>
                        <span className="text-zinc-400 mb-2">{selectedBusiness ? selectedBusiness?.phone : "Business Phone"}</span>

                    </div>
                </div>


                <div>
                    <div className="flex bg-emerald-500 font-bold text-zinc-800 text-xs rounded-t-xl">
                        <div className="w-[20%] py-3 px-2 border-r border-emerald-400">Part Number</div>
                        <div className="w-[50%] py-3 px-2 border-r border-emerald-400">Description</div>
                        <div className="w-[10%] py-3 px-2 border-r border-emerald-400">Unit Price</div>
                        <div className="w-[10%] py-3 px-2 border-r border-emerald-400">Quantity</div>
                        <div className="w-[20%] py-3 px-2">Total(GHC)</div>
                    </div>
                    <div className="flex text-xs border-b border-zinc-600">
                        <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-700">Part Number</div>
                        <div className="w-[50%] py-3 px-2 border-r border-zinc-700">Description</div>
                        <div className="w-[10%] py-3 px-2 border-r border-zinc-700">Unit Price</div>
                        <div className="w-[10%] py-3 px-2 border-r border-zinc-700">Quantity</div>
                        <div className="w-[20%] py-3 px-2 border-r border-zinc-700">Total(GHC)</div>
                    </div>

                    {invoiceItems.map((item, index) => (
                        <div key={index} className="flex text-xs border-b border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">{item.partNumber}</div>
                            <div className="w-[50%] py-3 px-2 border-r border-zinc-600">{item.description}</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">{item.unitPrice}</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">{item.quantity}</div>
                            <div className="w-[20%] py-3 px-2 border-r border-zinc-600">{item.amount}</div>
                        </div>
                    ))}

                    {[
                        { label: "Subtotal", rate: null, amount: rateAmounts?.total },
                        { label: "NHIL", rate: rateValues?.nhil, amount: rateAmounts?.nhilAmount },
                        { label: "GETFUND", rate: rateValues?.getfund, amount: rateAmounts?.getfundAmount },
                        { label: "COVID", rate: rateValues?.covid, amount: rateAmounts?.covidAmount },
                        { label: "VAT", rate: rateValues?.vat, amount: rateAmounts?.vatAmount },
                    ].map(({ label, rate, amount }) => (
                        <div key={label} className="flex text-xs border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-zinc-700" />
                            <div className="w-[50%] py-3 px-2 border-zinc-700 border-l border-r border-b flex justify-center items-center">
                                {label}{rate != null ? ` ${rate}%` : ""}
                            </div>
                            <div className="w-[10%] py-3 px-2 border-zinc-700" />
                            <div className="w-[10%] py-3 px-2 border-zinc-700" />
                            <div className="w-[20%] py-3 px-2 border-r border-l border-b border-zinc-700">{amount}</div>
                        </div>
                    ))}

                    <div className="flex text-xs border-zinc-700 mb-10">
                        <div className="w-[20%] py-3 px-2  border-zinc-700"></div>
                        <div className="w-[50%] py-3 px-2 border-zinc-700"></div>
                        <div className="w-[10%] py-3 px-2 border-zinc-700"></div>
                        <div className="w-[10%] py-3 px-2 border-zinc-700"></div>
                        <div className="w-[20%] py-3 px-2 border-r border-l border-b border-zinc-700 flex  gap-1">

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
