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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface RenstraFormProps {
  open?: boolean;
  onClose?: () => void;
  type?: "urusan" | "program" | "kegiatan" | "sub-kegiatan";
  mode?: "create" | "edit";
  initialData?: any;
  onSuccess?: () => void;
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

const getKepmenTableName = (type: string): string => {
  switch (type) {
    case "urusan":
      return "kepmen_900_urusan";
    case "program":
      return "kepmen_900_prog";
    case "kegiatan":
      return "kepmen_900_keg";
    case "sub-kegiatan":
      return "kepmen_900_subkeg";
    default:
      return "kepmen_900_urusan";
  }
};

const getParentTableName = (type: string): string => {
  switch (type) {
    case "program":
      return "renstra_urusan";
    case "kegiatan":
      return "renstra_prog";
    case "sub-kegiatan":
      return "renstra_keg";
    default:
      return "";
  }
};

const getParentIdField = (type: string): string => {
  switch (type) {
    case "program":
      return "urusan_id";
    case "kegiatan":
      return "program_id";
    case "sub-kegiatan":
      return "kegiatan_id";
    default:
      return "";
  }
};

export default function RenstraForm({
  open = true,
  onClose = () => {},
  type = "urusan",
  mode = "create",
  initialData = null,
  onSuccess = () => {},
}: RenstraFormProps) {
  const [formData, setFormData] = React.useState<any>({
    [`renstra_kode_rek_${type}`]: "",
    [`renstra_uraian_${type}`]: "",
    [`renstra_sasaran_${type}`]: [],
    [`renstra_indikator_${type}`]: [],
    [`renstra_satuan_${type}`]: "",
    [`renstra_targetn1_${type}`]: "",
    [`renstra_targetn2_${type}`]: "",
    [`renstra_targetn3_${type}`]: "",
    [`renstra_targetn4_${type}`]: "",
    [`renstra_anggarann1_${type}`]: 0,
    [`renstra_anggarann2_${type}`]: 0,
    [`renstra_anggarann3_${type}`]: 0,
    [`renstra_anggarann4_${type}`]: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [kepmenOptions, setKepmenOptions] = React.useState([]);
  const [parentOptions, setParentOptions] = React.useState([]);
  const [selectedKepmen, setSelectedKepmen] = React.useState("");

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  React.useEffect(() => {
    const loadKepmenOptions = async () => {
      try {
        const { data, error } = await supabase
          .from(getKepmenTableName(type))
          .select("*");
        if (error) throw error;
        setKepmenOptions(data || []);
      } catch (error) {
        console.error("Error loading kepmen options:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reference data",
        });
      }
    };

    const loadParentOptions = async () => {
      if (type === "urusan") return;
      try {
        const { data, error } = await supabase
          .from(getParentTableName(type))
          .select("*");
        if (error) throw error;
        setParentOptions(data || []);
      } catch (error) {
        console.error("Error loading parent options:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load parent data",
        });
      }
    };

    if (open) {
      loadKepmenOptions();
      loadParentOptions();
    }
  }, [type, open]);

  const handleKepmenSelect = (kepmenId: string) => {
    const selected = kepmenOptions.find((opt: any) => opt.id === kepmenId);
    if (selected) {
      setSelectedKepmen(kepmenId);
      const typeKey = type === "sub-kegiatan" ? "subkeg" : type;
      setFormData({
        ...formData,
        [`renstra_kode_rek_${type}`]: selected[`kode_rek_900${typeKey}`],
        [`renstra_uraian_${type}`]: selected[`uraian_900${typeKey}`],
        [`renstra_sasaran_${type}`]: selected[`sasaran_900${typeKey}`] || [],
        [`renstra_indikator_${type}`]:
          selected[`indikator_900${typeKey}`] || [],
        [`renstra_satuan_${type}`]: selected[`satuan_900${typeKey}`] || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tableName = getTableName(type);
      const parentIdField = getParentIdField(type);

      const dataToSave = { ...formData };
      if (parentIdField && formData[parentIdField]) {
        dataToSave[parentIdField] = formData[parentIdField];
      }

      if (mode === "create") {
        const { error } = await supabase.from(tableName).insert([dataToSave]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Item created successfully",
        });
      } else {
        const { error } = await supabase
          .from(tableName)
          .update(dataToSave)
          .eq("id", initialData.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      }

      onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold capitalize">
            {mode} Renstra {type}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Reference Data (Kepmen)</Label>
            <Select value={selectedKepmen} onValueChange={handleKepmenSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select reference data" />
              </SelectTrigger>
              <SelectContent>
                {kepmenOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option[`kode_rek_900${type}`]} -{" "}
                    {option[`uraian_900${type}`]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type !== "urusan" && (
            <div className="space-y-2">
              <Label>
                Parent{" "}
                {type === "program"
                  ? "Urusan"
                  : type === "kegiatan"
                    ? "Program"
                    : "Kegiatan"}
              </Label>
              <Select
                value={formData[getParentIdField(type)]}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    [getParentIdField(type)]: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {parentOptions.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {
                        option[
                          `renstra_kode_rek_${type === "program" ? "urusan" : type === "kegiatan" ? "prog" : "keg"}`
                        ]
                      }{" "}
                      -{" "}
                      {
                        option[
                          `renstra_uraian_${type === "program" ? "urusan" : type === "kegiatan" ? "prog" : "keg"}`
                        ]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kode Rekening</Label>
              <Input
                value={formData[`renstra_kode_rek_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_kode_rek_${type}`]: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Uraian</Label>
              <Input
                value={formData[`renstra_uraian_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_uraian_${type}`]: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sasaran</Label>
            <Textarea
              value={
                Array.isArray(formData[`renstra_sasaran_${type}`])
                  ? formData[`renstra_sasaran_${type}`].join("\n")
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`renstra_sasaran_${type}`]: e.target.value
                    .split("\n")
                    .filter(Boolean),
                })
              }
              placeholder="Enter sasaran (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Indikator</Label>
            <Textarea
              value={
                Array.isArray(formData[`renstra_indikator_${type}`])
                  ? formData[`renstra_indikator_${type}`].join("\n")
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`renstra_indikator_${type}`]: e.target.value
                    .split("\n")
                    .filter(Boolean),
                })
              }
              placeholder="Enter indikator (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Satuan</Label>
            <Input
              value={formData[`renstra_satuan_${type}`]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`renstra_satuan_${type}`]: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target N+1</Label>
              <Input
                value={formData[`renstra_targetn1_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_targetn1_${type}`]: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Anggaran N+1</Label>
              <Input
                type="number"
                value={formData[`renstra_anggarann1_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_anggarann1_${type}`]:
                      parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target N+2</Label>
              <Input
                value={formData[`renstra_targetn2_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_targetn2_${type}`]: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Anggaran N+2</Label>
              <Input
                type="number"
                value={formData[`renstra_anggarann2_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_anggarann2_${type}`]:
                      parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target N+3</Label>
              <Input
                value={formData[`renstra_targetn3_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_targetn3_${type}`]: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Anggaran N+3</Label>
              <Input
                type="number"
                value={formData[`renstra_anggarann3_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_anggarann3_${type}`]:
                      parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target N+4</Label>
              <Input
                value={formData[`renstra_targetn4_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_targetn4_${type}`]: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Anggaran N+4</Label>
              <Input
                type="number"
                value={formData[`renstra_anggarann4_${type}`]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`renstra_anggarann4_${type}`]:
                      parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
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
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
