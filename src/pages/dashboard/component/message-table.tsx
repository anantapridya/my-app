"use client";
import MessageDialog from "@/pages/dashboard/component/message-dialog";
import { format } from "date-fns";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MessageTable = () => {
  // #region ===== Data =====
  // ** State Management
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [message, setMessage] = useState<MessagePayload[]>();
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    filters: {
      global: { value: "", matchMode: "LIKE" },
    },
    sortField: "",
    sortOrder: 1,
  });
  // #endregion

  // #region ===== Function =====
  // ** Handle
  const getALlMessage = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DEV}/api/message/`,
        {}
      );
      if (response.ok) {
        const data = await response.json();
        setTotalRecords(data.data.length);
        const sortedData = [...data.data].sort(
          (a: MessagePayload, b: MessagePayload) => {
            const field = lazyState.sortField as keyof MessagePayload;
            if (!field || !a[field] || !b[field]) return 0;

            const order = lazyState.sortOrder === -1 ? -1 : 1;
            if (a[field]! < b[field]!) return -1 * order;
            if (a[field]! > b[field]!) return 1 * order;
            return 0;
          }
        );

        const start = lazyState.first || 0;
        const end = start + (lazyState.rows || 10);
        const paginatedData = sortedData.slice(start, end);

        console.log(data);
        setMessage(paginatedData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      setLoading(false);
    }
  };

  // ** Effects
  useEffect(() => {
    getALlMessage();
  }, [lazyState, refreshTable]);
  // #endregion
  return (
    <div>
      <div className="p-5 mt-10">
        <Button
          label="+ Add Data"
          type="button"
          className="px-3 py-2 bg-blue-500 text-white"
          onClick={() => setOpenModal(true)}
        />
        {/* <button onClick={() => setOpenModal(true)}>Add Data</button> */}
      </div>
      <MessageDialog
        refreshState={[refreshTable, setRefreshTable]}
        modalState={[openModal, setOpenModal]}
      />
      <DataTable
        value={message}
        lazy
        paginator
        stripedRows
        dataKey={"ID"}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[10, 20, 50, 100, totalRecords]}
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        loading={loading}
        first={lazyState.first}
        sortField={lazyState.sortField}
        onPage={(event) => {
          setLazyState({
            ...lazyState,
            first: event.first,
            rows: event.rows,
          });
        }}
        onSort={(event) => {
          setLazyState({
            ...lazyState,
            sortField: event.sortField,
          });
        }}
        header="Message Data"
        scrollable
        scrollHeight="720px"
        emptyMessage="No data available."
        className="custom-datatable"
      >
        <Column
          key="No"
          header="No."
          showFilterMenu={false}
          style={{ width: "20px" }}
          body={(rowData, props) => {
            return (
              <div>
                <span>{props.rowIndex + 1}.</span>
              </div>
            );
          }}
        />
        <Column
          key="email"
          header="Email"
          showFilterMenu={false}
          style={{ minWidth: "5rem" }}
          body={(rowData: MessageResponse) => {
            return (
              <div>
                <span>{rowData.email}</span>
              </div>
            );
          }}
        />
        <Column
          key="description"
          field="description"
          header="Description"
          showFilterMenu={false}
          style={{ minWidth: "5rem" }}
        />
        <Column
          key="date"
          field="date"
          header="Date"
          showFilterMenu={false}
          style={{ minWidth: "5rem" }}
          body={(rowData: MessageResponse) => {
            return (
              <div>
                <span>
                  {rowData.date
                    ? format(new Date(rowData.date), "dd MMMM yyyy")
                    : "-"}
                </span>
              </div>
            );
          }}
        />
      </DataTable>
    </div>
  );
};

export default MessageTable;
