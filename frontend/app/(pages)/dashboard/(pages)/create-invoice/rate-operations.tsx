import { useState, useEffect } from "react"
import { CInput } from "@/app/components"
import { useRateValues } from "@/app/store"
import { IRateValues } from "@/app/types"


export const RateOperationsForm = () => {
    const [rateValues, setRateValues] = useState<IRateValues>({})
    const setRateValuesState = useRateValues((state) => state.setRateValues)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRateValues((prevValues) => ({ ...prevValues, [name]: Number(value) }))
    }


    useEffect(() => {
        setRateValuesState(rateValues)
    }, [rateValues, setRateValuesState])

    return (
        <div>
            <form>
                <div className="text-xs mb-6 font-light">Kindly enter the percentage values for the rate details of the invoice.</div>
                <div className="grid grid-cols-2 gap-3 ">
                    <div className="flex flex-col gap-1 mb-2">
                        <CInput type="number" variant={"default"} name="nhil" label="NHIL (%):" inputType="regularInput" onChange={handleInputChange} />
                    </div>

                    <div className="flex flex-col gap-1 mb-2">
                        <CInput type="number" variant={"default"} name="getfund" label="GETFUND (%):" inputType="regularInput" onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <CInput type="number" variant={"default"} name="vat" label="VAT(%):" inputType="regularInput" onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <CInput type="number" variant={"default"} name="covid" label="COVID (%):" inputType="regularInput" onChange={handleInputChange} />
                    </div>

                </div>
            </form>
        </div>
    )
}
