import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen p-10">

      <div className="flex justify-between items-center">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default DashboardPage;