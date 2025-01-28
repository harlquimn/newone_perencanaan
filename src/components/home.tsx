import React from "react";
import Sidebar from "./layout/Sidebar";
import DataGrid from "./master-data/DataGrid";
import RenstraGrid from "./renstra/RenstraGrid";
import Dashboard from "./dashboard/Dashboard";

interface HomeProps {
  onNavigate?: (path: string) => void;
  activePath?: string;
  sidebarExpanded?: boolean;
  onSidebarToggle?: () => void;
}

const Home = () => {
  const [activePath, setActivePath] = React.useState("/dashboard");
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [selectedDataType, setSelectedDataType] = React.useState("urusan");

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <Sidebar
        expanded={sidebarExpanded}
        onNavigate={setActivePath}
        activePath={activePath}
        className="h-screen"
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            {activePath === "/dashboard"
              ? "Dashboard"
              : activePath === "/master-data"
                ? "Master Data Management"
                : activePath === "/renstra"
                  ? "Renstra Management"
                  : ""}
          </h1>
          <p className="text-gray-500">
            {activePath === "/dashboard"
              ? "Overview of your system"
              : activePath === "/master-data"
                ? "Manage your hierarchical data structure"
                : activePath === "/renstra"
                  ? "Manage your strategic planning"
                  : ""}
          </p>
        </div>

        {activePath === "/dashboard" ? (
          <Dashboard />
        ) : (
          <div className="rounded-lg border bg-white shadow">
            {activePath === "/master-data" ? (
              <DataGrid
                onDataTypeChange={setSelectedDataType}
                onRowSelect={handleRowSelect}
                selectedRows={selectedRows}
              />
            ) : activePath === "/renstra" ? (
              <RenstraGrid
                onDataTypeChange={setSelectedDataType}
                onRowSelect={handleRowSelect}
                selectedRows={selectedRows}
              />
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
