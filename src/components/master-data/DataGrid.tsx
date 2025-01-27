import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataToolbar from "./DataToolbar";
import DataForm from "./DataForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataGridProps {
  data?: Array<{
    id: string;
    code: string;
    name: string;
    parent?: string;
  }>;
  onDataTypeChange?: (value: string) => void;
  onRowSelect?: (id: string) => void;
  selectedRows?: string[];
}

const mockData = [
  { id: "1", code: "01", name: "Urusan Pemerintahan Wajib" },
  { id: "2", code: "02", name: "Urusan Pemerintahan Pilihan" },
  { id: "3", code: "03", name: "Urusan Pemerintahan Umum" },
];

const DataGrid = ({
  data = mockData,
  onDataTypeChange = () => {},
  onRowSelect = () => {},
  selectedRows = [],
}: DataGridProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleAdd = () => {
    setFormMode("create");
    setShowForm(true);
  };

  const handleEdit = () => {
    setFormMode("edit");
    setShowForm(true);
  };

  const filteredData = data.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <DataToolbar
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDataTypeChange={onDataTypeChange}
        canEdit={selectedRows.length === 1}
        canDelete={selectedRows.length > 0}
      />

      <div className="p-4">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mb-4"
        />

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  className={selectedRows.includes(row.id) ? "bg-muted" : ""}
                  onClick={() => onRowSelect(row.id)}
                >
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowSelect(row.id);
                        handleEdit();
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <DataForm
        open={showForm}
        onClose={() => setShowForm(false)}
        mode={formMode}
        type="urusan"
      />
    </div>
  );
};

export default DataGrid;
