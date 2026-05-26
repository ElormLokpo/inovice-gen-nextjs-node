
import { Cbutton } from "@/app/components/shared/button";
import { CInput } from "@/app/components/shared/input";

import { Client, useCreateClient, useDeleteClient, useUpdateClient } from "@/app/hooks/useClient";
import { AddClientSchema, AddClientSchemaType } from "@/app/schema";
import { useSideModal } from "@/app/store";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { LuUserRoundPlus } from "react-icons/lu";
import { SideModal } from "../../components/side-modal";
import { Business } from "@/app/hooks/useBusiness";

import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { MdDeleteOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

export const ADD_CLIENT_FORM_ID = "add-client-form";

type ClientFormMode = "create" | "edit";

const clientToFormValues = (client?: Client, selectedClient?: Client): AddClientSchemaType => ({
    name: client?.name ?? selectedClient?.name ?? "",
    email: client?.email ?? selectedClient?.email ?? "",
    phone: client?.phone ?? selectedClient?.phone ?? "",
    address: client?.address ?? selectedClient?.address ?? "",
    city: client?.city ?? selectedClient?.city ?? "",
    country: client?.country ?? "",
});

export const AddClientForm = ({
    businessId,
    formId = ADD_CLIENT_FORM_ID,
    mode = "create",
    client,
    showInlineSubmit = false,
    selectedBusiness,
    selectedClient,
    clients,
    setSelectedClientId,
    isLoadingClients
}: {
    businessId?: string;
    formId?: string;
    mode?: ClientFormMode;
    client?: Client;
    showInlineSubmit?: boolean;
    selectedBusiness?: Business;
    selectedClient?: Client;
    clients?: Client[];
    setSelectedClientId?: (id: string) => void;
    isLoadingClients?: boolean;
}) => {

    const [showClientOperationsPopup, setShowClientOperationsPopup] = useState(false);

    const defaultValues = useMemo(() => clientToFormValues(client, selectedClient), [client, selectedClient]);
    const setModalContent = useSideModal((state) => state.setModalContent);
    const setSubmitState = useSideModal((state) => state.setSubmitState);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddClientSchemaType>({
        resolver: zodResolver(AddClientSchema),
        defaultValues
    });


    const { mutate: deleteClient } = useDeleteClient({
        onSuccess: () => setModalContent(null),
    });




    const { mutate: createClient, isPending: isCreatingClient } = useCreateClient({
        onSuccess: () => {
            reset(clientToFormValues());
            if (mode === "edit") {
                setModalContent(null);
            }
        },
    });
    const { mutate: updateClient, isPending: isUpdatingClient } = useUpdateClient({
        onSuccess: () => setModalContent(null),
    });
    const isSavingClient = isCreatingClient || isUpdatingClient;

    useEffect(() => {
        setSubmitState({
            isSubmitting: isSavingClient,
            loadingText: mode === "edit" ? "Saving Client..." : "Adding Client...",
        });

        return () => setSubmitState({ isSubmitting: false });
    }, [isSavingClient, mode, setSubmitState]);

    const submitHandler = (data: AddClientSchemaType) => {
        if (!businessId) return;

        if (mode === "edit" && client) {
            updateClient({ id: client.id, businessId, data });
            return;
        }

        createClient({ businessId, data });
    }

    const handleEditClient = () => {
        if (!selectedBusiness || !selectedClient) return;

        setShowClientOperationsPopup(false);
        setModalContent(
            <SideModal
                formId={ADD_CLIENT_FORM_ID}
                heading="Edit Client"
                loadingText="Saving Client..."
                content={<AddClientForm formId={ADD_CLIENT_FORM_ID} mode="edit" businessId={selectedBusiness.id} client={selectedClient} />}
            />,
        )
    }

    const handleDeleteClient = () => {
        if (!selectedClient) return;

        setShowClientOperationsPopup(false);
        setModalContent(
            <SideModal
                deleteHandler={() => deleteClient(selectedClient.id)}
                heading="Delete Client"
                loadingText="Deleting Client..."
                content={<DeleteClientForm clientName={selectedClient.name} />}
            />,
        )
    }


    return (
        <>

            <form onSubmit={handleSubmit(submitHandler)} id={formId}>
                <div className={showInlineSubmit ? "bg-zinc-800/50 mb-4 w-full rounded-xl" : ""}>
                    {showInlineSubmit && (
                        <div className=" mb-4 w-full border-b border-zinc-800 ">
                            <div className="flex justify-between p-4 items-center pb-1  mb-4 border-zinc-800">
                                <div>
                                    <span className="font-semibold text-zinc-100">Client Details</span>
                                </div>
{/* 
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedClient?.id || ""}
                                        onChange={(event) => setSelectedClientId && setSelectedClientId(event.target.value)}
                                        disabled={isLoadingClients || clients?.length === 0}
                                        className="text-xs text-zinc-300 border w-60 border-zinc-600 py-3 px-3 rounded-2xl bg-black disabled:opacity-60"
                                    >
                                        {clients?.length === 0 ? (
                                            <option value="">No client yet</option>
                                        ) : (
                                            clients?.map((client) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name}
                                                </option>
                                            ))
                                        )}
                                    </select>

                                    <div className="relative">
                                        <div className="cursor-pointer" onClick={() => setShowClientOperationsPopup((prev: boolean) => !prev)}>
                                            <BsThreeDotsVertical />
                                        </div>
                                        {showClientOperationsPopup && <div className="absolute w-[10rem] right-0 z-10 bg-zinc-900 p-2 border border-zinc-800 rounded-xl">
                                            <Cbutton
                                                handler={handleDeleteClient}
                                                disabled={!selectedClient}
                                                buttonType="standard"
                                                variant="secondary"
                                                className="border-0 text-red-700 w-full"
                                                size="xs"
                                                label="Delete Client"
                                                icon={<MdDeleteOutline size={12} />}
                                            />

                                            <Cbutton
                                                handler={handleEditClient}
                                                disabled={!selectedClient}
                                                buttonType="standard"
                                                variant="secondary"
                                                className="border-0 w-full"
                                                size="xs"
                                                label="Edit Details"
                                                icon={<PencilSimpleLineIcon size={12} />}
                                            />
                                        </div>}
                                    </div>
                                </div> */}
                            </div>
                            {/* <div className="p-4">
                    <ClientDetails client={selectedClient} />
                </div> */}
                        </div>
                    )}

                    <div className={showInlineSubmit ? "grid grid-cols-3 gap-3 p-4" : "grid grid-cols-2 gap-3"}>
                        <div className="flex flex-col gap-1 mb-2">
                            <CInput register={register} errors={errors} variant={"default"} label="Client Name:" name="name" inputType="formInput" />
                        </div>

                        <div className="flex flex-col gap-1 mb-2">
                            <CInput register={register} errors={errors} variant={"default"} label="Client Email:" name="email" inputType="formInput" />
                        </div>
                        <div className="flex flex-col gap-1 mb-2">
                            <CInput register={register} errors={errors} variant={"default"} label="Client Phone Number:" name="phone" inputType="formInput" />
                        </div>
                        <div className="flex flex-col gap-1 mb-2">
                            <CInput register={register} errors={errors} variant={"default"} label="Client Address:" name="address" inputType="formInput" />
                        </div>

                        <div className="flex flex-col gap-1 mb-2">
                            <CInput register={register} errors={errors} variant={"default"} label="City:" name="city" inputType="formInput" />
                        </div>
                        <div className="flex flex-col gap-1 mb-2">
                            <CInput register={register} errors={errors} variant={"default"} label="Country:" name="country" inputType="formInput" />
                        </div>
                    </div>

                    {/* {showInlineSubmit && (
                        <div className="flex justify-end p-4 pt-0">
                            <Cbutton
                                disabled={!businessId}
                                isLoading={isSavingClient}
                                loadingText="Saving Client..."
                                type="submit"
                                buttonType="standard"
                                variant="secondary"
                                size="sm"
                                label="Save Client"
                                icon={<LuUserRoundPlus size={12} />}
                            />
                        </div>
                    )} */}
                </div>
            </form>
        </>
    )
}

export const DeleteClientForm = ({ clientName }: { clientName: string }) => {
    return (
        <div>
            <div className="font-light text-sm">Are you sure you want to delete {clientName}?</div>
        </div>
    )
}
