import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createData,
  updateData,
  fetchData,
  DataItem,
  getTableName,
  getCodeField,
  getNameField,
  getSasaranField,
  getIndikatorField,
  getSatuanField,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface DataFormProps {
  open?: boolean;
  onClose?: () => void;
  type?: "urusan" | "program" | "kegiatan" | "sub-kegiatan";
  mode?: "create" | "edit";
  initialData?: DataItem | null;
}

const getDefaultFormData = (type: string): Partial<DataItem> => {
  const tableName = getTableName(type);
  return {
    [getCodeField(tableName)]: "",
    [getNameField(tableName)]: "",
    [getSasaranField(tableName)]: [],
    [getIndikatorField(tableName)]: [],
    [getSatuanField(tableName)]: "",
  };
};

export default function DataForm({
  open = true,
  onClose = () => {},
  type = "urusan",
  mode = "create",
  initialData = null,
}: DataFormProps) {
  const [formData, setFormData] = React.useState<Partial<DataItem>>(() => {
    const defaultData = getDefaultFormData(type);
    // Ensure array fields are initialized
    const sasaranField = getSasaranField(getTableName(type));
    const indikatorField = getIndikatorField(getTableName(type));
    if (sasaranField) defaultData[sasaranField] = [];
    if (indikatorField) defaultData[indikatorField] = [];
    return defaultData;
  });
  const [loading, setLoading] = React.useState(false);
  const [parentOptions, setParentOptions] = React.useState<DataItem[]>([]);

  React.useEffect(() => {
    if (open) {
      setFormData(initialData || getDefaultFormData(type));
    }
  }, [initialData, open]);

  React.useEffect(() => {
    const loadParentOptions = async () => {
      if (type === "urusan") return;

      try {
        let parentTable = "";
        switch (type) {
          case "program":
            parentTable = getTableName("urusan");
            break;
          case "kegiatan":
            parentTable = getTableName("program");
            break;
          case "sub-kegiatan":
            parentTable = getTableName("kegiatan");
            break;
          default:
            return;
        }

        const data = await fetchData(parentTable);
        setParentOptions(data || []);
      } catch (error) {
        console.error("Error loading parent options:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load parent options",
        });
      }
    };

    if (open) {
      loadParentOptions();
    }
  }, [type, open]);

  const resetForm = () => {
    setFormData(getDefaultFormData(type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const tableName = getTableName(type);

      // Prepare the data
      const dataToSave: Partial<DataItem> = {
        [getCodeField(tableName)]: formData[getCodeField(tableName)],
        [getNameField(tableName)]: formData[getNameField(tableName)],
      };

      // Add parent ID if needed
      const parentIdField = getParentIdField();
      if (parentIdField && formData[parentIdField]) {
        dataToSave[parentIdField] = formData[parentIdField];
      }

      // Add arrays and satuan if they exist for this type
      const sasaranField = getSasaranField(tableName);
      const indikatorField = getIndikatorField(tableName);
      const satuanField = getSatuanField(tableName);

      if (sasaranField && formData[sasaranField]) {
        dataToSave[sasaranField] = Array.isArray(formData[sasaranField])
          ? formData[sasaranField]
          : formData[sasaranField].split("\n").filter(Boolean);
      }

      if (indikatorField && formData[indikatorField]) {
        dataToSave[indikatorField] = Array.isArray(formData[indikatorField])
          ? formData[indikatorField]
          : formData[indikatorField].split("\n").filter(Boolean);
      }

      if (satuanField && formData[satuanField]) {
        dataToSave[satuanField] = formData[satuanField];
      }

      if (mode === "create") {
        await createData(tableName, dataToSave);
        toast({
          title: "Success",
          description: "Item created successfully",
        });
      } else {
        if (!initialData?.id) return;
        await updateData(tableName, initialData.id, dataToSave);
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getParentIdField = () => {
    switch (type) {
      case "program":
        return "urusan_id";
      case "kegiatan":
        return "program_id";
      case "sub-kegiatan":
        return "kegiatan_id";
      default:
        return null;
    }
  };

  const needsParent = type !== "urusan";
  const parentIdField = getParentIdField();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold capitalize">
            {mode} {type}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Rekening</Label>
              <Input
                id="code"
                value={formData[getCodeField(getTableName(type))] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [getCodeField(getTableName(type))]: e.target.value,
                  })
                }
                placeholder="Enter code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nomenkelatur</Label>
              <Input
                id="name"
                value={formData[getNameField(getTableName(type))] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [getNameField(getTableName(type))]: e.target.value,
                  })
                }
                placeholder="Enter name"
              />
            </div>
          </div>

          {needsParent && parentIdField && (
            <div className="space-y-2">
              <Label htmlFor="parent">Parent</Label>
              <Select
                value={formData[parentIdField]}
                onValueChange={(value) =>
                  setFormData({ ...formData, [parentIdField]: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {
                        option[
                          getCodeField(
                            getTableName(
                              type === "program"
                                ? "urusan"
                                : type === "kegiatan"
                                  ? "program"
                                  : "kegiatan",
                            ),
                          )
                        ]
                      }{" "}
                      -{" "}
                      {
                        option[
                          getNameField(
                            getTableName(
                              type === "program"
                                ? "urusan"
                                : type === "kegiatan"
                                  ? "program"
                                  : "kegiatan",
                            ),
                          )
                        ]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="sasaran">Sasaran</Label>
            <Textarea
              id="sasaran"
              value={
                Array.isArray(formData[getSasaranField(getTableName(type))])
                  ? formData[getSasaranField(getTableName(type))].join("\n")
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getSasaranField(getTableName(type))]: e.target.value
                    .split("\n")
                    .filter(Boolean),
                })
              }
              placeholder="Enter sasaran (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="indikator">Indikator</Label>
            <Textarea
              id="indikator"
              value={
                Array.isArray(formData[getIndikatorField(getTableName(type))])
                  ? formData[getIndikatorField(getTableName(type))].join("\n")
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getIndikatorField(getTableName(type))]: e.target.value
                    .split("\n")
                    .filter(Boolean),
                })
              }
              placeholder="Enter indikator (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="satuan">Satuan</Label>
            <Input
              id="satuan"
              value={formData[getSatuanField(getTableName(type))] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getSatuanField(getTableName(type))]: e.target.value,
                })
              }
              placeholder="Enter satuan"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
