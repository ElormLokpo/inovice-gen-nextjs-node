import { IoMdClose } from "react-icons/io";
import { useSideModal } from "@/app/store";
import { ReactNode } from "react";
import { Cbutton } from "@/app/components/shared/button";
import { cn } from "@/app/lib/utils";


export const SideModal = ({ content, heading, formId, isLoading, loadingText, deleteHandler }: { content: ReactNode, heading: string,loadingText?:string, formId?:string , isLoading?:boolean, deleteHandler?: () => void}) => {
    const setModalContent = useSideModal((state) => state.setModalContent)
    const isSubmitting = useSideModal((state) => state.isSubmitting)
    const modalLoadingText = useSideModal((state) => state.loadingText)
    const handleCloseModal = () => {
        setModalContent(null)
    }

    const submitIsLoading = isLoading || isSubmitting;
    const submitLoadingText = modalLoadingText || loadingText || `${heading}...`;

    return (
        <div>
            <div className="border-l h-screen p-3 border-zinc-800 flex flex-col">
                <div className="flex-shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-zinc-100 text-lg">{heading}</span>

                        <div className="cursor-pointer" onClick={handleCloseModal}>
                            <IoMdClose size={20} className="text-zinc-400" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 overflow-auto">
                    {content}
                </div>

                <div className="flex-shrink-0 flex gap-2 border-t py-3 border-zinc-800 justify-end">
                    <div>
                        <Cbutton
                            formId={formId}
                            type={deleteHandler ? "button" : "submit"}
                            buttonType="standard"
                            variant="primary"
                            className={cn("text-xs px-6 py-3", deleteHandler ? "bg-red-500 hover:bg-red-600" : "")}
                            handler={deleteHandler}
                            label={heading}
                            isLoading={submitIsLoading}
                            loadingText={submitLoadingText}
                        />
                    </div>
                    <Cbutton handler={handleCloseModal} buttonType="standard" variant="secondary" className="text-xs px-6 py-3" label="Cancel" />
                </div>
            </div>
        </div>
    )
}
