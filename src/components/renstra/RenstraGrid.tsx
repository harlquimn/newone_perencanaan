import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RenstraToolbar from "./RenstraToolbar";
import RenstraForm from "./RenstraForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface RenstraGridProps {
  onDataTypeChange?: (value: string) => void;
  onRowSelect?: (id: string) => void;
  selectedRows?: string[];
}

const getTableName = (type: string): string => {
  switch (type) {
    case "urusan":
      return "renstra_urusan";
    case "program":
      return "renstra_prog";
    case "kegiatan":
      return "renstra_keg";
    case "sub-kegiatan":
      return "renstra_subkeg";
    default:
      return "renstra_urusan";
  }
};

const RenstraGrid = ({
  onDataTypeChange = () => {},
  onRowSelect = () => {},
  selectedRows = [],
}: RenstraGridProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [data, setData] = React.useState<any[]>([]);
  const [selectedType, setSelectedType] = React.useState("urusan");
  const [loading, setLoading] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const tableName = getTableName(selectedType);
      const { data: result, error } = await supabase
        .from(tableName)
        .select("*")
        .order(`renstra_kode_rek_${selectedType}`, { ascending: true });

      if (error) throw error;
      setData(result || []);
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
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in("id", selectedRows);

      if (error) throw error;

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
    onRowSelect(""); // Clear selection when changing type
  };

  const filteredData = data.filter(
    (item) =>
      item[`renstra_kode_rek_${selectedType}`]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item[`renstra_uraian_${selectedType}`]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <RenstraToolbar
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

        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Kode Rekening</TableHead>
                <TableHead className="w-[300px]">Uraian</TableHead>
                <TableHead>Sasaran</TableHead>
                <TableHead>Indikator</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Target N+1</TableHead>
                <TableHead>Anggaran N+1</TableHead>
                <TableHead>Target N+2</TableHead>
                <TableHead>Anggaran N+2</TableHead>
                <TableHead>Target N+3</TableHead>
                <TableHead>Anggaran N+3</TableHead>
                <TableHead>Target N+4</TableHead>
                <TableHead>Anggaran N+4</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center">
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
                      {row[`renstra_kode_rek_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_uraian_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_sasaran_${selectedType}`]?.join(", ")}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_indikator_${selectedType}`]?.join(", ")}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_satuan_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_targetn1_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        row[`renstra_anggarann1_${selectedType}`] || 0,
                      )}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_targetn2_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        row[`renstra_anggarann2_${selectedType}`] || 0,
                      )}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_targetn3_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        row[`renstra_anggarann3_${selectedType}`] || 0,
                      )}
                    </TableCell>
                    <TableCell>
                      {row[`renstra_targetn4_${selectedType}`]}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        row[`renstra_anggarann4_${selectedType}`] || 0,
                      )}
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
      </div>

      <RenstraForm
        open={showForm}
        onClose={() => setShowForm(false)}
        mode={formMode}
        type={selectedType}
        initialData={selectedItem}
        onSuccess={loadData}
      />
    </div>
  );
};

export default RenstraGrid;
