"use client"
import { Cbutton } from "@/app/components/shared/button";
import { InvoiceItemsOperationsTable } from "./invoice-items-operations";
import { useBusinesses, useDeleteBusiness } from "@/app/hooks/useBusiness";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useSideModal } from "@/app/store";
import AddBusinessForm, { ADD_BUSINESS_FORM_ID, BusinessDetails, DeleteBusinessForm } from "./business-operations";
import { SideModal } from "../../components/side-modal";
import { useEffect, useMemo, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AddClientForm} from "./client-operations";
import { RateOperationsForm } from "./rate-operations";
import { InvoicePreviewOperations } from "./invoice-preview-operations";
import {InvoiceDateOperationsForm} from "./invoice-date-operations";
import { ClientFormProvider } from "./client-context";

export default function CreateInvoicePage() {
    const setModalContent = useSideModal((state) => state.setModalContent)
    const { data: businesses = [], isLoading: isLoadingBusinesses } = useBusinesses();
    const [selectedBusinessId, setSelectedBusinessId] = useState("");
    const selectedBusiness = useMemo(
        () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0],
        [businesses, selectedBusinessId],
    );
   

       const [invoiceDates, setInvoiceDates] = useState({
        issueDate: "",
        dueDate: ""
    })


    const [showBusinessOperationsPopup, setShowBusinessOperationsPopup] = useState(false);

    const setSubmitState = useSideModal((state) => state.setSubmitState);


    const handleAddBusiness = () => {
        setModalContent(<SideModal formId={ADD_BUSINESS_FORM_ID} heading="Add Business" loadingText="Adding Business..." content={<AddBusinessForm formId={ADD_BUSINESS_FORM_ID} />} />)
    }

    const handleEditBusiness = () => {
        if (!selectedBusiness) return;

        setModalContent(
            <SideModal
                formId={ADD_BUSINESS_FORM_ID}
                heading="Edit Business"
                loadingText="Saving Business"
                content={<AddBusinessForm formId={ADD_BUSINESS_FORM_ID} mode="edit" business={selectedBusiness} />}
            />,
        )
    }

    const { mutate: deleteBusiness, isPending: isDeletingBusiness } = useDeleteBusiness({
        onSuccess: () => setModalContent(null),
    });


    const handleDeleteBusiness = () => {
        if (!selectedBusiness) return;

        setModalContent(
            <SideModal
                deleteHandler={() => deleteBusiness(selectedBusiness.id)}
                heading="Delete Business"
                loadingText="Deleting Business..."
                content={<DeleteBusinessForm businessName={selectedBusiness?.name} />}
            />,
        )
    }

    


      useEffect(() => {
                const isDeleting = isDeletingBusiness  ;
                setSubmitState({
                    isSubmitting: isDeleting,
                    loadingText:   "Deleting Business...",
                });
        
                return () => setSubmitState({ isSubmitting: false });
            }, [isDeletingBusiness, setSubmitState]);


    return (
        <ClientFormProvider>
        <div className="px-7 grid grid-cols-2 gap-2">
            <div className=" border border-zinc-800 rounded-xl">
                <div className="flex mb-3 justify-between border-b pb-4 p-4 border-zinc-800 ">
                    <div className="text-xl text-zinc-100 font-semibold">Invoice Detail</div>

                    <div className="flex gap-2 items-center">
                        <div>
                            <select
                                value={selectedBusiness?.id || ""}
                                onChange={(event) => {
                                    setSelectedBusinessId(event.target.value);
                                }}
                                disabled={isLoadingBusinesses || businesses.length === 0}
                                className="text-xs text-zinc-300 border w-60 border-zinc-600 py-3 px-3 rounded-2xl bg-black disabled:opacity-60"
                            >
                                {businesses.length === 0 ? (
                                    <option value="">No business yet</option>
                                ) : (
                                    businesses.map((business) => (
                                        <option key={business.id} value={business.id}>
                                            {business.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <Cbutton handler={handleAddBusiness} buttonType="standard" variant="primary" size="sm" label="Add Business" icon={<PlusIcon size={12} />} />
                    </div>
                </div>

                <div className="p-3">
                    <div className="bg-zinc-800/50 mb-4 w-full p-3 rounded-xl">
                        <div className="flex justify-between items-center pb-3 border-b mb-4 border-zinc-800">
                            <div>
                                <span className="font-semibold text-zinc-100">Business Details</span>
                            </div>

                            <div>
                                <div className="cursor-pointer" onClick={() => setShowBusinessOperationsPopup((prev: boolean) => !prev)}>
                                    <BsThreeDotsVertical />
                                </div>
                                {showBusinessOperationsPopup && <div className="absolute z-10  bg-zinc-900 p-2 border border-zinc-800 rounded-xl">
                                    <Cbutton
                                        handler={handleDeleteBusiness}
                                        disabled={!selectedBusiness}
                                        buttonType="standard"
                                        variant="secondary"
                                        className=" border-0 text-red-700"
                                        size="xs"
                                        label="Delete Business"
                                        icon={<MdDeleteOutline size={12} />}
                                    />

                                    <Cbutton
                                        handler={handleEditBusiness}
                                        disabled={!selectedBusiness}
                                        buttonType="standard"
                                        variant="secondary"
                                        className="border-0"
                                        size="xs"
                                        label="Edit Details"
                                        icon={<PencilSimpleLineIcon size={12} />}
                                    />
                                </div>}
                            </div>

                        </div>
                        <BusinessDetails business={selectedBusiness} />
                    </div>

                    <div className="mb-4 w-full p-3 rounded-xl">
                            <RateOperationsForm />
                    </div>


                    <>
                        <AddClientForm />

                    </>

                    <>
                        <InvoiceDateOperationsForm setInvoiceDates={setInvoiceDates} />
                    </>

                    <>
                        <InvoiceItemsOperationsTable />
                    </>
                </div>
            </div>
            <>
                <InvoicePreviewOperations invoiceDates={invoiceDates} selectedBusiness={selectedBusiness}  />
            </>
        </div>
        </ClientFormProvider>
    )
}


