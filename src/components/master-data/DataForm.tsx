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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: FormData) => void;
  type?: "urusan" | "program" | "kegiatan" | "sub-kegiatan";
  mode?: "create" | "edit";
  initialData?: FormData;
}

interface FormData {
  code: string;
  name: string;
  parent?: string;
}

const defaultFormData: FormData = {
  code: "",
  name: "",
  parent: undefined,
};

const mockParentOptions = [
  { value: "1", label: "Parent 1" },
  { value: "2", label: "Parent 2" },
  { value: "3", label: "Parent 3" },
];

export default function DataForm({
  open = true,
  onClose = () => {},
  onSubmit = () => {},
  type = "urusan",
  mode = "create",
  initialData = defaultFormData,
}: DataFormProps) {
  const [formData, setFormData] = React.useState<FormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const needsParent = type !== "urusan";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold capitalize">
            {mode} {type}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="Enter code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter name"
            />
          </div>

          {needsParent && (
            <div className="space-y-2">
              <Label htmlFor="parent">Parent</Label>
              <Select
                value={formData.parent}
                onValueChange={(value) =>
                  setFormData({ ...formData, parent: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {mockParentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
