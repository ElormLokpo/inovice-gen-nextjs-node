"use client"
import { Cbutton } from "@/app/components/shared/button";
import { InvoiceItemsOperationsTable } from "./invoice-items-operations";
import { Business, useBusinesses, useDeleteBusiness } from "@/app/hooks/useBusiness";

import { Client, useClients, useDeleteClient } from "@/app/hooks/useClient";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useSideModal } from "@/app/store";

import AddBusinessForm, { ADD_BUSINESS_FORM_ID, DeleteBusinessForm } from "./business-operations";
import { SideModal } from "../../components/side-modal";
import { useEffect, useMemo, useState } from "react";

import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AddClientForm} from "./client-operations";
import { RateOperationsForm } from "./rate-operations";
import { InvoicePreviewOperations } from "./invoice-preview-operations";

export default function CreateInvoicePage() {
    const setModalContent = useSideModal((state) => state.setModalContent)
    const { data: businesses = [], isLoading: isLoadingBusinesses } = useBusinesses();
    const [selectedBusinessId, setSelectedBusinessId] = useState("");
    const selectedBusiness = useMemo(
        () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0],
        [businesses, selectedBusinessId],
    );
    const { data: clients = [], isLoading: isLoadingClients } = useClients(selectedBusiness?.id);
    const [selectedClientId, setSelectedClientId] = useState("");
    const selectedClient = useMemo(
        () => clients.find((client) => client.id === selectedClientId) ?? clients[0],
        [clients, selectedClientId],
    );

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

    const {  isPending: isDeletingClient } = useDeleteClient()


      useEffect(() => {
                const isDeleting = isDeletingBusiness || isDeletingClient;
                setSubmitState({
                    isSubmitting: isDeleting,
                    loadingText: isDeletingClient ? "Deleting Client..." : "Deleting Business...",
                });
        
                return () => setSubmitState({ isSubmitting: false });
            }, [isDeletingBusiness, isDeletingClient, setSubmitState]);


    return (
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
                                    setSelectedClientId("");
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
                                <span className="font-semibold text-zinc-100">Company Details</span>
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
                        <AddClientForm businessId={selectedBusiness?.id} formId="add-client-inline-form" showInlineSubmit selectedBusiness={selectedBusiness} selectedClient={selectedClient} clients={clients} setSelectedClientId={setSelectedClientId} isLoadingClients={isLoadingClients} />

                    </>

                    <>
                        <InvoiceItemsOperationsTable />
                    </>
                </div>
            </div>
            <>
                <InvoicePreviewOperations selectedBusiness={selectedBusiness} selectedClient={selectedClient} />
            </>
        </div>
    )
}

const businessDetailItems = (business?: Business) => [
    { label: "Company Name", value: business?.name },
    { label: "Email", value: business?.email },
    { label: "Phone", value: business?.phone },
    { label: "Address", value: business?.address },
    { label: "City", value: business?.city },
    { label: "Country", value: business?.country },
    { label: "Tax ID", value: business?.taxId },
    { label: "Currency", value: business?.currency },
];

function BusinessDetails({ business }: { business?: Business }) {
    if (!business) {
        return (
            <div className="text-xs text-zinc-400">
                Add a business to populate company details.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-x-4">
            {businessDetailItems(business).map((item) => (
                <div className="flex flex-col gap-1 mb-5" key={item.label}>
                    <span className="text-xs text-zinc-300/80">{item.label}</span>
                    <span className="text-xs">{item.value || "Not set"}</span>
                </div>
            ))}
        </div>
    );
}

const clientDetailItems = (client?: Client) => [
    { label: "Client Name", value: client?.name },
    { label: "Email", value: client?.email },
    { label: "Phone", value: client?.phone },
    { label: "Address", value: client?.address },
    { label: "City", value: client?.city },
    { label: "Country", value: client?.country },
];

function ClientDetails({ client }: { client?: Client }) {
    if (!client) {
        return (
            <div className="text-xs text-zinc-400">
                Add a client to populate client details.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-x-4">
            {clientDetailItems(client).map((item) => (
                <div className="flex flex-col gap-1 mb-5" key={item.label}>
                    <span className="text-xs text-zinc-300/80">{item.label}</span>
                    <span className="text-xs">{item.value || "Not set"}</span>
                </div>
            ))}
        </div>
    );
}
