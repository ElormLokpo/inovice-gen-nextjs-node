"use client"
import { Cbutton } from "@/app/components/shared/button";
import { CInput } from "@/app/components/shared/input";
import { Business, useBusinesses } from "@/app/hooks/useBusiness";
import { ArrowCircleDownIcon, PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import { useSideModal } from "@/app/store";
import AddBusinessForm, { ADD_BUSINESS_FORM_ID } from "./business-operations";
import { SideModal } from "../../components/side-modal";
import { useMemo, useState } from "react";


export default function CreateInvoicePage() {
    const setModalContent = useSideModal((state) => state.setModalContent)
    const { data: businesses = [], isLoading: isLoadingBusinesses } = useBusinesses();
    const [selectedBusinessId, setSelectedBusinessId] = useState("");
    const selectedBusiness = useMemo(
        () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0],
        [businesses, selectedBusinessId],
    );

    const handleAddBusiness = () => {
        setModalContent(<SideModal formId={ADD_BUSINESS_FORM_ID} heading="Add Business" loadingText="Adding Business" content={<AddBusinessForm formId={ADD_BUSINESS_FORM_ID} />} />)
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

    return (
        <div className="px-7 grid grid-cols-2 gap-2">
            <div className=" border border-zinc-800 rounded-xl">
                <div className="flex mb-3 justify-between border-b pb-4 p-4 border-zinc-800 ">
                    <div className="text-xl text-zinc-100 font-semibold">Invoice Detail</div>

                    <div className="flex gap-2 items-center">
                        <div>
                            <select
                                value={selectedBusinessId || selectedBusiness?.id || ""}
                                onChange={(event) => setSelectedBusinessId(event.target.value)}
                                disabled={isLoadingBusinesses || businesses.length === 0}
                                className="text-xs text-zinc-300 border w-30 border-zinc-600 py-3 px-3 rounded-2xl bg-black disabled:opacity-60"
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
                                <Cbutton
                                    handler={handleEditBusiness}
                                    disabled={!selectedBusiness}
                                    buttonType="standard"
                                    variant="secondary"
                                    size="xs"
                                    label="Edit Details"
                                    icon={<PencilSimpleLineIcon size={12} />}
                                />
                            </div>
                        </div>
                        <BusinessDetails business={selectedBusiness} />
                    </div>

                    <div className="mb-4 w-full p-3 rounded-xl">

                        <div className="grid grid-cols-2 gap-3 ">
                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>

                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>
                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>
                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>

                        </div>
                    </div>

                    <div className="bg-zinc-800/50 mb-4 w-full  rounded-xl">
                        <div className="flex justify-between p-4 items-center pb-1 border-b mb-4 border-zinc-800">
                            <div>
                                <span className="font-semibold text-sm text-zinc-100">Client Details</span>
                            </div>

                        </div>
                        <div className="grid grid-cols-3 gap-3 p-4">
                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>

                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>
                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>
                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>

                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>

                            <div className="flex flex-col gap-1 mb-2">
                                <CInput variant={"default"} label="Sample Label:" inputType="form" />
                            </div>



                        </div>
                    </div>
                    <div>
                        <div className="flex bg-emerald-800 text-xs rounded-t-xl text-emerald-100">
                            <div className="w-[20%] py-3 px-2 border-r border-emerald-700">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-emerald-700">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-emerald-700">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-emerald-700">Quantity</div>
                            <div className="w-[20%] py-3 px-2">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-b border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-zinc-600">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Quantity</div>
                            <div className="w-[20%] py-3 px-2 border-r border-zinc-600">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-zinc-600">
                            <div className="w-[20%] py-3 px-2  border-zinc-600"></div>
                            <div className="w-[50%] py-3 px-2 border-zinc-600"></div>
                            <div className="w-[10%] py-3 px-2 border-zinc-600"></div>
                            <div className="w-[10%] py-3 px-2 border-zinc-600"></div>
                            <div className="w-[20%] py-3 px-2 border-r border-l border-b border-zinc-600 flex  gap-1">
                                <Cbutton buttonType="standard" variant="secondary" size="xs" label="Add" />
                                <Cbutton buttonType="standard" className="bg-red-100 border-red-400 hover:bg-red-300 text-red-700" variant="secondary" size="xs" label="Discard" />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border border-zinc-800 p-3 rounded-xl">

                <div className="flex mb-3 justify-between border-b pb-4 border-zinc-600 ">
                    <div className="text-lg font-semibold">Invoice Preview</div>

                    <div className="flex gap-3 items-center">

                        <Cbutton buttonType="standard" variant="secondary" size="sm" label="Download Invoice" icon={<ArrowCircleDownIcon size={12} />} />
                    </div>
                </div>

                <div className="bg-zinc-800/50 p-2 rounded-2xl ">
                    <div className="flex justify-between text-xs border-b p-2 mb-5 border-zinc-600">
                        <div><span className="text-zinc-400">Date of issue: </span>November 20, 2026</div>
                        <div><span className="text-zinc-400">Date of issue: </span>November 20, 2026</div>

                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <div className="text-sm">
                            <div className="text-2xl font-semibold">INVOICE</div>
                            <span><span className="text-zinc-400">Invoice Number:</span> INV-S23R230RF223F-2F</span>
                        </div>
                        <div >
                            <span className="font-semibold">Company Name</span>
                        </div>
                    </div>

                    <div className="p-2 bg-zinc-800/50 mb-10 text-xs flex justify-between mb-4 rounded-xl border border-zinc-600/50">
                        <div className="flex flex-col gap-1">
                            <span className="text-zinc-400">Send to:</span>
                            <span className="">Sam Smith</span>
                            <span className="text-zinc-400">123 Cresant Road, Airport City</span>
                            <span className="text-zinc-400">+233 34 5464</span>



                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-zinc-400">Send to:</span>
                            <span className="">Sam Smith</span>
                            <span className="text-zinc-400">123 Cresant Road, Airport City</span>
                            <span className="text-zinc-400">+233 34 5464</span>

                        </div>
                    </div>


                    <div>
                        <div className="flex bg-emerald-800 text-xs rounded-t-xl text-emerald-100">
                            <div className="w-[20%] py-3 px-2 border-r border-emerald-700">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-emerald-700">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-emerald-700">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-emerald-700">Quantity</div>
                            <div className="w-[20%] py-3 px-2">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-b border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-zinc-600">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Quantity</div>
                            <div className="w-[20%] py-3 px-2 border-r border-zinc-600">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-b border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-zinc-600">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Quantity</div>
                            <div className="w-[20%] py-3 px-2 border-r border-zinc-600">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-b border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-zinc-600">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Quantity</div>
                            <div className="w-[20%] py-3 px-2 border-r border-zinc-600">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-b border-zinc-600">
                            <div className="w-[20%] py-3 px-2 border-l border-r border-zinc-600">Part Number</div>
                            <div className="w-[50%] py-3 px-2 border-r border-zinc-600">Description</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Unit Price</div>
                            <div className="w-[10%] py-3 px-2 border-r border-zinc-600">Quantity</div>
                            <div className="w-[20%] py-3 px-2 border-r border-zinc-600">Total(GHC)</div>
                        </div>
                        <div className="flex text-xs border-zinc-600 mb-10">
                            <div className="w-[20%] py-3 px-2  border-zinc-600"></div>
                            <div className="w-[50%] py-3 px-2 border-zinc-600"></div>
                            <div className="w-[10%] py-3 px-2 border-zinc-600"></div>
                            <div className="w-[10%] py-3 px-2 border-zinc-600"></div>
                            <div className="w-[20%] py-3 px-2 border-r border-l border-b border-zinc-600 flex  gap-1">
                                <Cbutton buttonType="standard" variant="secondary" size="xs" label="Add" />
                                <Cbutton buttonType="standard" className="bg-red-100 border-red-400 hover:bg-red-300 text-red-700" variant="secondary" size="xs" label="Discard" />

                            </div>
                        </div>

                        <div className="flex gap-2 justify-end align-baseline">
                            <Cbutton buttonType="standard" variant="secondary" size="sm" label="Add Compnay" icon={<PlusIcon size={12} />} />

                            <Cbutton buttonType="standard" variant="primary" size="sm" label="Add Compnay" icon={<PlusIcon size={12} />} />

                        </div>
                    </div>
                </div>
            </div>
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
