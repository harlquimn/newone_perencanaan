import React from "react";
import Sidebar from "./layout/Sidebar";
import DataGrid from "./master-data/DataGrid";

interface HomeProps {
  onNavigate?: (path: string) => void;
  activePath?: string;
  sidebarExpanded?: boolean;
  onSidebarToggle?: () => void;
}

const Home = ({
  onNavigate = () => {},
  activePath = "/master-data",
  sidebarExpanded = true,
  onSidebarToggle = () => {},
}: HomeProps) => {
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
        onNavigate={onNavigate}
        activePath={activePath}
        className="h-screen"
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Master Data Management</h1>
          <p className="text-gray-500">
            Manage your hierarchical data structure
          </p>
        </div>

        <div className="rounded-lg border bg-white shadow">
          <DataGrid
            onDataTypeChange={setSelectedDataType}
            onRowSelect={handleRowSelect}
            selectedRows={selectedRows}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
