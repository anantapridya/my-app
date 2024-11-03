"use client";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Yup Configuration
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  date: yup.string().required("Date is required"),
  description: yup.string().required("Description is required"),
});

const MessageDialog = ({
  modalState: [openModal, setOpenModal],
  refreshState,
}: {
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
  refreshState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
  // #region ===== Data =====
  // ** State Management
  const [refresh, setRefresh] = refreshState!;
  // ** Form Handler
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessagePayload>({
    defaultValues: {
      email: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
    resolver: yupResolver(schema),
  });
  // #endregion

  // #region ===== Function =====
  // ** Handle
  const onSubmit: SubmitHandler<MessagePayload> = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_DEV}/api/message/add`,
        data
      );
      toast.success("Data Successfully Added", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      setRefresh(!refresh);
      reset();
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  // #endregion
  return (
    <Dialog
      header="Create Message"
      visible={openModal}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!openModal) return;
        setOpenModal(false);
        reset();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-4">
          <div className="grid grid-cols-4 mb-2">
            <label className="col-span-1">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <InputText className="col-span-3 border p-2" {...field} />
                  {errors.email && (
                    <p className="text-red-500 text-sm col-span-3">
                      {errors.email.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-4 mb-2">
            <label className="col-span-1">Date</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <Calendar
                    className="col-span-3 border p-2"
                    value={field.value as any}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm col-span-3">
                      {errors.date.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-4 mb-2">
            <label className="col-span-1">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <>
                  <InputText className="col-span-3 border p-2" {...field} />
                  {errors.description && (
                    <p className="text-red-500 text-sm col-span-3">
                      {errors.description.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex justify-end mt-5">
            <Button
              label="Submit"
              className="px-3 py-2 bg-blue-500 text-white"
              type="submit"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default MessageDialog;
