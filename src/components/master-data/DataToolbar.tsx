import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface DataToolbarProps {
  selectedDataType?: string;
  onDataTypeChange?: (value: string) => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const DataToolbar = ({
  selectedDataType = "urusan",
  onDataTypeChange = () => {},
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  canEdit = false,
  canDelete = false,
}: DataToolbarProps) => {
  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Select value={selectedDataType} onValueChange={onDataTypeChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urusan">Urusan</SelectItem>
            <SelectItem value="program">Program</SelectItem>
            <SelectItem value="kegiatan">Kegiatan</SelectItem>
            <SelectItem value="sub-kegiatan">Sub-Kegiatan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="default" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={!canEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={!canDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DataToolbar;
