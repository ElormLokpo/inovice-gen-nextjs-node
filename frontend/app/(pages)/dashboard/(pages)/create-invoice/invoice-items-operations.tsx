import { useState, useEffect } from "react"
import { Cbutton } from "@/app/components/shared/button"
import { useRateValues, useInvoiceItems } from "@/app/store"

interface IInvoiceItem {
    partNumber: string;
    description: string;
    unitPrice: number;
    quantity: number;
    amount: number;
}

const EMPTY_ITEM: IInvoiceItem = {
    partNumber: "",
    description: "",
    unitPrice: 0,
    quantity: 0,
    amount: 0,
}

export const InvoiceItemsOperationsTable = () => {
    const rateValues = useRateValues((state) => state.rateValues)
    const [invoiceItems, setInvoiceItems] = useState<IInvoiceItem[]>([])
    const [newInvoiceItem, setNewInvoiceItem] = useState<IInvoiceItem>(EMPTY_ITEM)
    const setInvoiceItemsState = useInvoiceItems((state) => state.setInvoiceItems)
    const setRateAmountsState = useInvoiceItems((state) => state.setRateAmounts) 

    const total = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
    const nhilAmount = (rateValues?.nhil ?? 0) * total / 100
    const getfundAmount = (rateValues?.getfund ?? 0) * total / 100
    const covidAmount = (rateValues?.covid ?? 0) * total / 100
    const vatAmount = (rateValues?.vat ?? 0) * total / 100

    const inputClassName =
        "w-full py-1 px-3 border-b border-zinc-700 focus:outline-none focus:border-transparent text-xs"

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewInvoiceItem((prev) => {
            const updated = { ...prev, [name]: value }
            updated.amount =
                name === "unitPrice"
                    ? +value * prev.quantity
                    : name === "quantity"
                    ? +value * prev.unitPrice
                    : prev.amount
            return updated
        })
    }


    const handleAddInvoiceItem = () => {
        const { partNumber, description, unitPrice, quantity } = newInvoiceItem
        if (!partNumber || !description || !unitPrice || !quantity) return

        setInvoiceItems((prev) => [
            ...prev,
            { ...newInvoiceItem, amount: unitPrice * quantity },
        ])
        setNewInvoiceItem(EMPTY_ITEM)
    }


    const handleDeleteLastInvoiceItem = () => {
        if (invoiceItems.length === 0) return
        setInvoiceItems((prev) => prev.slice(0, -1))
    }

    useEffect(() => {
        const rateAmounts = {
            nhilAmount,
            getfundAmount,
            covidAmount,
            vatAmount,
            total,
        }
        setRateAmountsState(rateAmounts)
        setInvoiceItemsState(invoiceItems)
    }, [invoiceItems, setInvoiceItemsState, rateValues, nhilAmount, getfundAmount, covidAmount, vatAmount, total, setRateAmountsState])


    return (
        <div className="w-full rounded-xl overflow-hidden">
            <table className="w-full">
                <thead className="bg-emerald-500  text-xs rounded-t-xl text-zinc-900 font-semibold">
                    <tr className="flex">
                        <th className="w-[20%]  py-3 px-2 border-r border-emerald-400">Part Number</th>
                        <th className="w-[50%] py-3 px-2 border-r border-emerald-400">Description</th>
                        <th className="w-[10%] py-3 px-2 border-r border-emerald-400">Unit Price</th>
                        <th className="w-[10%] py-3 px-2 border-r border-emerald-400">Quantity</th>
                        <th className="w-[20%] py-3 px-2">Amount (GHC)</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceItems.map((item, index) => (
                        <tr key={index} className="flex text-xs border-b border-zinc-600">
                            <td className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">{item.partNumber}</td>
                            <td className="w-[50%] py-3 px-2 border-r border-zinc-600">{item.description}</td>
                            <td className="w-[10%] py-3 px-2 border-r border-zinc-600">{item.unitPrice}</td>
                            <td className="w-[10%] py-3 px-2 border-r border-zinc-600">{item.quantity}</td>
                            <td className="w-[20%] py-3 px-2 border-r border-zinc-600">{item.amount}</td>
                        </tr>
                    ))}
                    <tr className="flex text-xs border-b border-zinc-600">
                        <td className="w-[20%] py-3 px-2 border-l border-r border-zinc-700">
                            <input value={newInvoiceItem.partNumber} name="partNumber" onChange={handleInputChange} placeholder="Part Number" className={inputClassName} />
                        </td>
                        <td className="w-[50%] py-3 px-2 border-r border-zinc-700">
                            <input value={newInvoiceItem.description} name="description" onChange={handleInputChange} placeholder="Description" className={inputClassName} />
                        </td>
                        <td className="w-[10%] py-3 px-2 border-r border-zinc-700">
                            <input value={newInvoiceItem.unitPrice} name="unitPrice" onChange={handleInputChange} type="number" placeholder="Unit Price" className={inputClassName} />
                        </td>
                        <td className="w-[10%] py-3 px-2 border-r border-zinc-700">
                            <input value={newInvoiceItem.quantity} name="quantity" onChange={handleInputChange} type="number" placeholder="Quantity" className={inputClassName} />
                        </td>
                        <td className="w-[20%] py-3 px-2 border-r border-zinc-700">{newInvoiceItem.amount || ""}</td>
                    </tr>
                </tbody>
            </table>

          
            <div className="flex text-xs border-zinc-600">
                <div className="w-[20%] py-3 px-2 border-zinc-700" />
                <div className="w-[50%] py-3 px-2 border-zinc-700 border-l border-r border-b flex justify-center items-center" />
                <div className="w-[10%] py-3 px-2 border-zinc-700" />
                <div className="w-[10%] py-3 px-2 border-zinc-700" />
                <div className="w-[20%] py-3 px-2 border-r border-l border-b border-zinc-700 grid grid-cols-2 gap-1">
                    <Cbutton handler={handleAddInvoiceItem} buttonType="standard" variant="secondary" size="xs" label="Add" />
                    <Cbutton handler={handleDeleteLastInvoiceItem} buttonType="standard" className="border-red-500 hover:bg-zinc-700 text-red-700" variant="secondary" size="xs" label="Delete" />
                </div>
            </div>

            {[
                { label: "Subtotal", rate: null, amount: total },
                { label: "NHIL", rate: rateValues?.nhil, amount: nhilAmount },
                { label: "GETFUND", rate: rateValues?.getfund, amount: getfundAmount },
                { label: "COVID", rate: rateValues?.covid, amount: covidAmount },
                { label: "VAT", rate: rateValues?.vat, amount: vatAmount },
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
        </div>
    )
}
