import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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

const getKepmenFieldPrefix = (type: string): string => {
  const typeKey = type === "sub-kegiatan" ? "subkeg" : type;
  return `900${typeKey}`;
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

  const handleKepmenSelect = async (kepmenId: string) => {
    const selected = kepmenOptions.find((opt: any) => opt.id === kepmenId);
    if (selected) {
      setSelectedKepmen(kepmenId);
      const kepmenPrefix = getKepmenFieldPrefix(type);

      // For program type, fetch the parent urusan based on the program's code
      let parentId = null;
      if (type === "program") {
        const programCode = selected[`kode_rek_900prog`];
        const urusanCode = programCode.substring(0, 4); // Get first 4 digits

        // Find matching urusan in renstra_urusan
        const { data: urusanData } = await supabase
          .from("renstra_urusan")
          .select("id, renstra_kode_rek_urusan")
          .eq("renstra_kode_rek_urusan", urusanCode)
          .single();

        if (urusanData) {
          parentId = urusanData.id;
        }
      }

      setFormData({
        ...formData,
        [`renstra_kode_rek_${type}`]: selected[`kode_rek_${kepmenPrefix}`],
        [`renstra_uraian_${type}`]: selected[`uraian_${kepmenPrefix}`],
        [`renstra_sasaran_${type}`]: selected[`sasaran_${kepmenPrefix}`] || [],
        [`renstra_indikator_${type}`]:
          selected[`indikator_${kepmenPrefix}`] || [],
        [`renstra_satuan_${type}`]: selected[`satuan_${kepmenPrefix}`] || "",
        ...(parentId && { [getParentIdField(type)]: parentId }),
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold capitalize mb-4">
            {mode} Renstra {type}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
              <Label className="text-lg font-medium">
                Reference Data (Kepmen)
              </Label>
              <Select value={selectedKepmen} onValueChange={handleKepmenSelect}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select reference data" />
                </SelectTrigger>
                <SelectContent>
                  {kepmenOptions.map((option: any) => {
                    const kepmenPrefix = getKepmenFieldPrefix(type);
                    return (
                      <SelectItem key={option.id} value={option.id}>
                        {option[`kode_rek_${kepmenPrefix}`]} -{" "}
                        {option[`uraian_${kepmenPrefix}`]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {type !== "urusan" && (
              <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
                <Label className="text-lg font-medium">
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
                  <SelectTrigger className="bg-white">
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

            <div className="p-4 border rounded-lg space-y-4">
              <Label className="text-lg font-medium">Basic Information</Label>
              <div className="grid grid-cols-2 gap-6">
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
                    readOnly={type === "program"}
                    className={type === "program" ? "bg-gray-100" : ""}
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
                    readOnly={type === "program"}
                    className={type === "program" ? "bg-gray-100" : ""}
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
            </div>

            <div className="p-4 border rounded-lg space-y-4">
              <Label className="text-lg font-medium">Targets & Budget</Label>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-md font-medium">Year N+1</Label>
                  <div className="space-y-2">
                    <Label>Target</Label>
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
                    <Label>Anggaran</Label>
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

                <div className="space-y-4">
                  <Label className="text-md font-medium">Year N+2</Label>
                  <div className="space-y-2">
                    <Label>Target</Label>
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
                    <Label>Anggaran</Label>
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
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-md font-medium">Year N+3</Label>
                  <div className="space-y-2">
                    <Label>Target</Label>
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
                    <Label>Anggaran</Label>
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

                <div className="space-y-4">
                  <Label className="text-md font-medium">Year N+4</Label>
                  <div className="space-y-2">
                    <Label>Target</Label>
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
                    <Label>Anggaran</Label>
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
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 border-t mt-6">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="w-32"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="w-32">
                {loading
                  ? "Saving..."
                  : mode === "create"
                    ? "Create"
                    : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
