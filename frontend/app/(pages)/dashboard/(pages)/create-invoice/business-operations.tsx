import { CInput } from "@/app/components/shared/input";

export default function AddBusinessForm() {


    return (
        <div>
            <form>
                <div className="mb-5">
                    <CInput variant={"default"} inputType="form" label="Business Name:" />
                </div>

                <div className="flex gap-4 mb-5 ">
                    <CInput variant={"default"} inputType="form" label="Business Name:" />
                    <CInput variant={"default"} inputType="form" label="Business Name:" />

                </div>

                <div className="mb-5">
                    <CInput variant={"default"} inputType="form" label="Business Name:" />
                </div>

                <div className="flex gap-4 mb-5">
                    <CInput variant={"default"} inputType="form" label="Business Name:" />
                    <CInput variant={"default"} inputType="form" label="Business Name:" />

                </div>


                <div className="mb-5">
                    <CInput variant={"default"} inputType="form" label="Business Name:" />
                </div>


                <div className="mb-5">
                    <CInput variant={"default"} inputType="form" label="Business Name:" />
                </div>

            </form>
        </div>

    )
}