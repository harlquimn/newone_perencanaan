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
  const [programOptions, setProgramOptions] = React.useState([]);
  const [selectedProgram, setSelectedProgram] = React.useState("");

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (type === "program" && initialData.renstra_kode_rek_prog) {
        // Find and set the selected program based on the code
        const program = programOptions.find(
          (p: any) => p.kode_rek_900prog === initialData.renstra_kode_rek_prog,
        );
        if (program) {
          setSelectedProgram(program.id);
        }
      }
    }
  }, [initialData, programOptions]);

  React.useEffect(() => {
    const loadProgramOptions = async () => {
      if (type !== "program") return;

      try {
        const { data, error } = await supabase
          .from("kepmen_900_prog")
          .select("*")
          .order("kode_rek_900prog", { ascending: true });

        if (error) throw error;
        setProgramOptions(data || []);
      } catch (error) {
        console.error("Error loading program options:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load program options",
        });
      }
    };

    if (open) {
      loadProgramOptions();
    }
  }, [type, open]);

  const handleProgramSelect = async (programId: string) => {
    const selected = programOptions.find((opt: any) => opt.id === programId);
    if (selected) {
      setSelectedProgram(programId);

      // Find the parent urusan based on the program code
      const urusanCode = selected.kode_rek_900prog.substring(0, 4);
      const { data: urusanData } = await supabase
        .from("renstra_urusan")
        .select("id")
        .eq("renstra_kode_rek_urusan", urusanCode)
        .single();

      setFormData({
        ...formData,
        renstra_kode_rek_prog: selected.kode_rek_900prog,
        renstra_uraian_prog: selected.uraian_900prog,
        renstra_satuan_prog: selected.satuan_900prog || "",
        urusan_id: urusanData?.id || null,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tableName = getTableName(type);

      if (mode === "create") {
        const { error } = await supabase.from(tableName).insert([formData]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Item created successfully",
        });
      } else {
        const { error } = await supabase
          .from(tableName)
          .update(formData)
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
            {/* Basic Information */}
            <div className="p-4 border rounded-lg space-y-4">
              <Label className="text-lg font-medium">Basic Information</Label>

              {type === "program" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nomenkelatur Program</Label>
                    <Select
                      value={selectedProgram}
                      onValueChange={handleProgramSelect}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programOptions.map((option: any) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.kode_rek_900prog} - {option.uraian_900prog}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
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
              )}

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
                  readOnly={type === "program"}
                  className={type === "program" ? "bg-gray-100" : ""}
                />
              </div>
            </div>

            {/* Targets & Budget */}
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
