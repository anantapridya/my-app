"use client";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction, useState } from "react";
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
  modalState = [false, () => {}],
  refreshState = [false, () => {}],
}: {
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
  refreshState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
  // #region ===== Data =====
  const [openModal, setOpenModal] = modalState;
  const [refresh, setRefresh] = refreshState;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessagePayload>({
    defaultValues: {
      email: "",
      date: "", // Set as Date object
      description: "",
    },
    resolver: yupResolver(schema),
  });
  // #endregion

  // #region ===== Function =====
  const onSubmit: SubmitHandler<MessagePayload> = async (data) => {
    const formattedData = {
      ...data,
      date:
        typeof data.date === "string"
          ? data.date
          : format(data.date, "yyyy-MM-dd"),
    };
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_DEV}/api/message/add`,
        formattedData
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
      toast.error("Failed to add data", { autoClose: 2000 });
      console.error("Error adding data:", error);
    }
  };
  // #endregion

  return (
    <Dialog
      header="Create Message"
      visible={openModal}
      style={{ width: "50vw" }}
      onHide={() => {
        setOpenModal(false);
        reset();
      }}
    >
      <button onClick={() => console.log({ modalState, refreshState })}>
        Cek ModalState
      </button>
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
                    value={field.value ? new Date(field.value) : null}
                    onChange={(e) =>
                      field.onChange(
                        e.value ? format(e.value, "yyyy-MM-dd") : ""
                      )
                    }
                  />
                  {errors.date?.message && (
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
