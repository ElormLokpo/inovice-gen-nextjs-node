import { CInput } from "@/app/components"

export const InvoiceDateOperationsForm = ({ setInvoiceDates }: {
    setInvoiceDates: React.Dispatch<React.SetStateAction<{
        issueDate: string;
        dueDate: string;
    }>>
}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInvoiceDates((prevValues) => ({ ...prevValues, [name]: value }))
    }



    return (
        <div className="py-10">
            <form>
                <div className="grid grid-cols-2 gap-3 ">
                    <div className="flex flex-col gap-1 mb-2">
                        <CInput type="date" variant={"default"} name="issueDate" label="Issue Date:" inputType="regularInput" onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <CInput type="date" variant={"default"} name="dueDate" label="Due Date:" inputType="regularInput" onChange={handleInputChange} />
                    </div>
                </div>

            </form>
        </div>
    )

}