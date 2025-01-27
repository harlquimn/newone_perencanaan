import { supabase } from "./supabase";

export interface DataItem {
  id: string;
  kode_rek_900urusan?: string;
  uraian_900urusan?: string;
  kode_rek_900prog?: string;
  uraian_900prog?: string;
  sasaran_900prog?: string[];
  indikator_900prog?: string[];
  satuan_900prog?: string;
  kode_rek_900keg?: string;
  uraian_900keg?: string;
  sasaran_900keg?: string[];
  indikator_900keg?: string[];
  satuan_900keg?: string;
  kode_rek_900subkeg?: string;
  uraian_900subkeg?: string;
  sasaran_900subkeg?: string[];
  indikator_900subkeg?: string[];
  satuan_900subkeg?: string;
  urusan_id?: string;
  program_id?: string;
  kegiatan_id?: string;
  created_at: string;
  updated_at: string;
}

export const fetchData = async (table: string) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(getCodeField(table), { ascending: true });

  if (error) throw error;
  return data;
};

export const createData = async (table: string, item: Partial<DataItem>) => {
  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateData = async (
  table: string,
  id: string,
  item: Partial<DataItem>,
) => {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteData = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw error;
};

export const getTableName = (type: string): string => {
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

export const getCodeField = (table: string): string => {
  switch (table) {
    case "kepmen_900_urusan":
      return "kode_rek_900urusan";
    case "kepmen_900_prog":
      return "kode_rek_900prog";
    case "kepmen_900_keg":
      return "kode_rek_900keg";
    case "kepmen_900_subkeg":
      return "kode_rek_900subkeg";
    default:
      return "kode_rek_900urusan";
  }
};

export const getNameField = (table: string): string => {
  switch (table) {
    case "kepmen_900_urusan":
      return "uraian_900urusan";
    case "kepmen_900_prog":
      return "uraian_900prog";
    case "kepmen_900_keg":
      return "uraian_900keg";
    case "kepmen_900_subkeg":
      return "uraian_900subkeg";
    default:
      return "uraian_900urusan";
  }
};

export const getSasaranField = (table: string): string => {
  switch (table) {
    case "kepmen_900_prog":
      return "sasaran_900prog";
    case "kepmen_900_keg":
      return "sasaran_900keg";
    case "kepmen_900_subkeg":
      return "sasaran_900subkeg";
    default:
      return "";
  }
};

export const getIndikatorField = (table: string): string => {
  switch (table) {
    case "kepmen_900_prog":
      return "indikator_900prog";
    case "kepmen_900_keg":
      return "indikator_900keg";
    case "kepmen_900_subkeg":
      return "indikator_900subkeg";
    default:
      return "";
  }
};

export const getSatuanField = (table: string): string => {
  switch (table) {
    case "kepmen_900_prog":
      return "satuan_900prog";
    case "kepmen_900_keg":
      return "satuan_900keg";
    case "kepmen_900_subkeg":
      return "satuan_900subkeg";
    default:
      return "";
  }
};
