"use client";
import LogoutButton from "@/pages/components/ButtonLogout";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { format } from "date-fns";
import MessageTable from "@/pages/dashboard/component/message-table";

export default function index() {
  // ** Lib Hooks
  const { data: session } = useSession();

  // #region ===== Data =====
  // ** State Management
  const [dataSession, setDataSession] = useState<UserSession[]>();
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState<number>(0);
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
  const getAllUserSession = async () => {
    try {
      setLoadingSession(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DEV}/api/user/session`,
        {}
      );
      if (response.ok) {
        const data = await response.json();
        setTotalRecords(data.data.length);
        const sortedData = [...data.data].sort(
          (a: UserSession, b: UserSession) => {
            const field = lazyState.sortField as keyof UserSession;
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
        setDataSession(paginatedData);
        setLoadingSession(false);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
      setLoadingSession(false);
    }
  };

  // ** Effect
  useEffect(() => {
    getAllUserSession();
  }, [lazyState]);
  // #endregion
  return (
    <div className="h-full w-full bg-white">
      <div className="p-5 mt-10">
        <DataTable
          value={dataSession}
          lazy
          paginator
          stripedRows
          dataKey={"ID"}
          rows={lazyState.rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[10, 20, 50, 100, totalRecords]}
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={loadingSession}
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
          header="User Session"
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
            key="username"
            header="Username"
            showFilterMenu={false}
            style={{ minWidth: "5rem" }}
            body={(rowData: UserSessionResponse) => {
              return (
                <div>
                  <span>{rowData.userId.username}</span>
                </div>
              );
            }}
          />
          <Column
            key="email"
            header="Email"
            showFilterMenu={false}
            style={{ minWidth: "5rem" }}
            body={(rowData: UserSessionResponse) => {
              return (
                <div>
                  <span>{rowData.userId.email}</span>
                </div>
              );
            }}
          />
          <Column
            key="loginTime"
            header="Login TIme"
            field="loginTime"
            showFilterMenu={false}
            style={{ minWidth: "5rem" }}
            body={(rowData: UserSessionResponse) => {
              return (
                <div>
                  <span>
                    {rowData.loginTime
                      ? format(
                          new Date(rowData.loginTime),
                          "dd MMMM yy hh:mm:ss"
                        )
                      : "-"}
                  </span>
                </div>
              );
            }}
          />
          <Column
            key="logoutTime"
            header="Logout TIme"
            field="logoutTime"
            showFilterMenu={false}
            style={{ minWidth: "5rem" }}
            body={(rowData: UserSessionResponse) => {
              return (
                <div>
                  <span>
                    {rowData.logoutTime
                      ? format(
                          new Date(rowData.logoutTime),
                          "dd MMMM yy hh:mm:ss"
                        )
                      : "-"}
                  </span>
                </div>
              );
            }}
          />
          <Column
            key="status"
            header="Status"
            field="status"
            showFilterMenu={false}
            style={{ minWidth: "5rem" }}
            body={(rowData: UserSessionResponse) => {
              return (
                <div>
                  <span>{rowData.status}</span>
                </div>
              );
            }}
          />
        </DataTable>
        <MessageTable />
      </div>

      <div className="fixed flex justify-between px-10 top-0 w-screen py-3 bg-blue-700">
        <div className="text-white h-full">
          <p className="font-bold">{session?.user.name}</p>
          <p>{session?.user.email}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
