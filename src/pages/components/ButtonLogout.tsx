import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

const LogoutButton = () => {
  // ** Lib Hooks
  const { data: session } = useSession();
  const router = useRouter();

  // #region ===== Function =====
  // ** Handle
  const handleLogout = async () => {
    if (session?.user?.token) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DEV}/api/auth/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          toast.success("Login Successfully", {
            autoClose: 2000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
          });
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          console.error("Logout failed:", await response.json());
          toast.error("Logout...", {
            autoClose: 2000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
          });
        }
      } catch (error) {
        console.error("Error logging out:", error);
        toast.error("An unexpected error occurred. Please try again.", {
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
      }
    }

    await signOut({ callbackUrl: "/login" });
  };
  // #endregion

  return (
    <>
      <ToastContainer />
      <button
        onClick={handleLogout}
        className="bg-red-700 p-3 rounded-lg text-white font-bold"
      >
        Logout
      </button>
    </>
  );
};

export default LogoutButton;
