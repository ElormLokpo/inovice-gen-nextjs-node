import { IoMdClose } from "react-icons/io";
import { useSideModal } from "@/app/store";
import { ReactNode } from "react";
import { Cbutton } from "@/app/components/shared/button";


export const SideModal = ({ content, heading }: { content: ReactNode, heading:string }) => {
    const setModalContent = useSideModal((state) => state.setModalContent)
    const handleCloseModal = () => {
        setModalContent(null)
    }

    return (
        <div>
            <div className="border-l h-screen p-3 border-zinc-700 flex flex-col justify-between ">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-zinc-100 text-lg">{heading}</span>

                        <div className="cursor-pointer" onClick={handleCloseModal}>

                            <IoMdClose size={20} className="text-zinc-400" />
                        </div>
                    </div>


                    <div>
                        {content}
                    </div>
                </div>

                <div className="flex gap-2 border-t py-3 border-zinc-700 justify-end">
                    <div>
                        <Cbutton buttonType="standard" variant="primary" className="text-xs px-6 py-3" label={heading} />
                    </div>
                    <Cbutton handler={handleCloseModal} buttonType="standard" variant="secondary" className="text-xs px-6 py-3" label="Cancel" />
                </div>

            </div>
        </div>
    )
}