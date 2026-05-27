
import { CInput } from "@/app/components/shared/input";
import { useClientFormContext } from "./client-context";


export const AddClientForm = () => {
    const { setClient } = useClientFormContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClient((prev) => ({ ...prev, [name]: value }) )
}

return (
    <>
        <div className={"bg-zinc-800/50 mb-4 w-full rounded-xl"}>
            <div className={"grid grid-cols-3 gap-3 p-4"}>
                <div className="flex flex-col gap-1 mb-2">
                    <CInput variant={"default"} label="Client Name:" name="name" inputType="regularInput" onChange={handleChange} />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                    <CInput variant={"default"} label="Client Email:" name="email" inputType="regularInput" onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <CInput variant={"default"} label="Client Phone Number:" name="phone" inputType="regularInput" onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <CInput variant={"default"} label="Client Address:" name="address" inputType="regularInput" onChange={handleChange} />
                </div>

                <div className="flex flex-col gap-1 mb-2">
                    <CInput variant={"default"} label="City:" name="city" inputType="regularInput" onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <CInput variant={"default"} label="Country:" name="country" inputType="regularInput" onChange={handleChange} />
                </div>
            </div>


        </div >

    </>
)
}
