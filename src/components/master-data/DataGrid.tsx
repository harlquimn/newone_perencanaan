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
import {
  fetchData,
  deleteData,
  DataItem,
  getTableName,
  getCodeField,
  getNameField,
  getSasaranField,
  getIndikatorField,
  getSatuanField,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface DataGridProps {
  onDataTypeChange?: (value: string) => void;
  onRowSelect?: (id: string) => void;
  selectedRows?: string[];
}

const DataGrid = ({
  onDataTypeChange = () => {},
  onRowSelect = () => {},
  selectedRows = [],
}: DataGridProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [data, setData] = React.useState<DataItem[]>([]);
  const [selectedType, setSelectedType] = React.useState("urusan");
  const [loading, setLoading] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<DataItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const tableName = getTableName(selectedType);
      const result = await fetchData(tableName);
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [selectedType]);

  const handleAdd = () => {
    setSelectedItem(null);
    setFormMode("create");
    setShowForm(true);
    // Clear selected rows when adding new item
    onRowSelect("");
  };

  const handleEdit = () => {
    const item = data.find((d) => d.id === selectedRows[0]);
    if (item) {
      setSelectedItem(item);
      setFormMode("edit");
      setShowForm(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedRows.length) return;

    try {
      const tableName = getTableName(selectedType);
      await Promise.all(selectedRows.map((id) => deleteData(tableName, id)));
      toast({
        title: "Success",
        description: "Items deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error("Error deleting items:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete items",
      });
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    onDataTypeChange(value);
  };

  const filteredData = data.filter(
    (item) =>
      item[getCodeField(getTableName(selectedType))]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item[getNameField(getTableName(selectedType))]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <DataToolbar
        selectedDataType={selectedType}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDataTypeChange={handleTypeChange}
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
                <TableHead>Kode Rekening</TableHead>
                <TableHead>Nomenkelatur</TableHead>
                <TableHead>Sasaran</TableHead>
                <TableHead>Indikator</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    className={selectedRows.includes(row.id) ? "bg-muted" : ""}
                    onClick={() => onRowSelect(row.id)}
                  >
                    <TableCell>
                      {row[getCodeField(getTableName(selectedType))]}
                    </TableCell>
                    <TableCell>
                      {row[getNameField(getTableName(selectedType))]}
                    </TableCell>
                    <TableCell>
                      {row[getSasaranField(getTableName(selectedType))]?.join(
                        ", ",
                      )}
                    </TableCell>
                    <TableCell>
                      {row[getIndikatorField(getTableName(selectedType))]?.join(
                        ", ",
                      )}
                    </TableCell>
                    <TableCell>
                      {row[getSatuanField(getTableName(selectedType))]}
                    </TableCell>
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
                ))
              )}
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
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <DataForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          loadData();
        }}
        mode={formMode}
        type={selectedType}
        initialData={selectedItem}
      />
    </div>
  );
};

export default DataGrid;
