import { CInput } from "@/app/components/shared/input";
import { Business, useCreateBusiness, useUpdateBusiness } from "@/app/hooks/useBusiness";
import { useCloudinaryUpload } from "@/app/hooks/useCloudinaryUpload";
import { AddBusinessSchema, AddBusinessSchemaType } from "@/app/schema";
import { useSideModal } from "@/app/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export const ADD_BUSINESS_FORM_ID = "add-business-form";

type BusinessFormMode = "create" | "edit";

const businessToFormValues = (business?: Business): AddBusinessSchemaType => ({
    name: business?.name ?? "",
    address: business?.address ?? "",
    city: business?.city ?? "",
    email: business?.email ?? "",
    country: business?.country ?? "",
    phone: business?.phone ?? "",
    logoUrl: business?.logoUrl ?? "",
    taxId: business?.taxId ?? "",
    currency: business?.currency ?? "GHS",
});

export default function AddBusinessForm({
    formId = ADD_BUSINESS_FORM_ID,
    mode = "create",
    business,
}: {
    formId?: string;
    mode?: BusinessFormMode;
    business?: Business;
}) {
    const defaultValues = useMemo(() => businessToFormValues(business), [business]);
    const setModalContent = useSideModal((state) => state.setModalContent);
    const setSubmitState = useSideModal((state) => state.setSubmitState);
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<AddBusinessSchemaType>({
        resolver: zodResolver(AddBusinessSchema),
        defaultValues,
    });

    const logoUrl = useWatch({ control, name: "logoUrl" });
    const { mutateAsync: uploadLogo, isPending: isUploadingLogo } = useCloudinaryUpload();
    const { mutate: createBusiness, isPending: isCreatingBusiness } = useCreateBusiness({
        onSuccess: () => setModalContent(null),
    });
    const { mutate: updateBusiness, isPending: isUpdatingBusiness } = useUpdateBusiness({
        onSuccess: () => setModalContent(null),
    });
    const isSavingBusiness = isCreatingBusiness || isUpdatingBusiness;

    useEffect(() => {
        setSubmitState({
            isSubmitting: isSavingBusiness,
            loadingText: mode === "edit" ? "Saving Business..." : "Adding Business...",
        });

        return () => setSubmitState({ isSubmitting: false });
    }, [isSavingBusiness, mode, setSubmitState]);

    const handleLogoUpload = async (file?: File) => {
        if (!file) return;

        try {
            const uploadedLogoUrl = await uploadLogo({ file, folder: "invoice-generation/business-logos" });
            setValue("logoUrl", uploadedLogoUrl, { shouldDirty: true, shouldValidate: true });

        } catch (error) {
            const message = error instanceof Error ? error.message : "Logo upload failed";
            toast.error(message);
        }
    }

    const submitHandler = (businessData: AddBusinessSchemaType) => {
        if (mode === "edit" && business) {
            updateBusiness({ id: business.id, data: businessData });
            return;
        }

        createBusiness(businessData);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(submitHandler)} id={formId}>
                <div className="mb-5">
                    <CInput register={register} errors={errors} name="name" variant={"default"} inputType="form" label="Business Name:" />
                </div>

                <div className="flex gap-4 mb-5 ">
                    <CInput register={register} errors={errors} name="address" variant={"default"} inputType="form" label="Address:" />
                    <CInput register={register} errors={errors} name="city" variant={"default"} inputType="form" label="City:" />

                </div>

                <div className="mb-5">
                    <CInput register={register} errors={errors} name="email" variant={"default"} inputType="form" label="Email:" />
                </div>

                <div className="flex gap-4 mb-5">
                    <CInput register={register} errors={errors} name="country" variant={"default"} inputType="form" label="Country:" />
                    <CInput register={register} errors={errors} name="phone" variant={"default"} inputType="form" label="Phone Number:" />

                </div>

                <div className="mb-5">
                    <CInput register={register} errors={errors} name="taxId" variant={"default"} inputType="form" label="Tax ID:" />
                </div>

                <div className="flex gap-4 mb-5">
                    <CInput register={register} errors={errors} name="currency" variant={"default"} inputType="form" label="Currency:" />
                    <div className="flex flex-col gap-2 w-full">
                        <label className="block text-xs mb-2 text-zinc-100">Logo:</label>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingLogo || isSavingBusiness}
                            onChange={(event) => handleLogoUpload(event.target.files?.[0])}
                            className="w-full transition-colors border border-zinc-800 focus:outline-none focus:border-emerald-500 bg-transparent px-4 py-3 rounded-xl text-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        {isUploadingLogo && (
                            <span className="text-[10px] font-light  text-zinc-400">Adding logo...</span>
                        )}
                        {logoUrl && (
                            <span className="text-[10px] font-light text-emerald-400 break-all"></span>
                        )}
                        {errors.logoUrl?.message && (
                            <span className="text-red-500 text-[10px] font-light ml-1">
                                {errors.logoUrl.message}
                            </span>
                        )}
                    </div>

                </div>

                <input type="hidden" {...register("logoUrl")} />

                <div>
                    {
                        logoUrl ? <>
                            <Image height={100} width={100} src={logoUrl} alt="logo" />
                        </> :
                            <div className="border border-zinc-800 w-[6rem] h-[6rem] text-xs justify-center items-center flex text-white rounded-md">
                                Logo preview
                            </div>}
                </div>

            </form>
        </div>

    )
}


export const DeleteBusinessForm = ({ businessName }: {  businessName:string }) => {
   

    return (
        <div>            
          
                <div className="font-light text-sm">Are you sure you want to delete {businessName} ? </div>

               
        </div>
    )
}   
