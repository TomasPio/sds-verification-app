
// SDS Verification App - Enhanced Version
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { format, parseISO, differenceInDays } from "date-fns";
import { ArrowDownToLine, FileUp } from "lucide-react";
import * as XLSX from "xlsx";

const initialData = [
  {
    name: "MOBIL DTE OIL HEAVY",
    producer: "ExxonMobil",
    sdsDate: "2022-12-18",
    link: "https://www.msds.exxonmobil.com",
    notes: "Zgodna z (UE) 2020/878",
    ghs: ["GHS07", "GHS08"]
  },
  {
    name: "Hydraulic Oil Premium 32",
    producer: "Statoil",
    sdsDate: "2009-09-24",
    link: "",
    notes: "Nieaktualna, wymaga aktualizacji",
    ghs: []
  },
  {
    name: "MYE 643",
    producer: "Brak danych",
    sdsDate: "",
    link: "",
    notes: "Brak karty – należy pozyskać",
    ghs: []
  }
];

export default function SDSVerificationApp() {
  const [substances, setSubstances] = useState(initialData);
  const [newSubstance, setNewSubstance] = useState({ name: "", producer: "", sdsDate: "", link: "", notes: "", ghs: [] });
  const [filter, setFilter] = useState("");

  const handleAdd = () => {
    setSubstances([...substances, newSubstance]);
    setNewSubstance({ name: "", producer: "", sdsDate: "", link: "", notes: "", ghs: [] });
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(substances);
    XLSX.utils.book_append_sheet(wb, ws, "SDS");
    XLSX.writeFile(wb, "sds_verification.xlsx");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const imported = XLSX.utils.sheet_to_json(worksheet);
      setSubstances(imported);
    };
    reader.readAsArrayBuffer(file);
  };

  const isValid = (date) => {
    if (!date) return false;
    const days = differenceInDays(new Date(), parseISO(date));
    return days <= 3 * 365;
  };

  const filtered = substances.filter(sub => sub.name.toLowerCase().includes(filter.toLowerCase()));

  const ghsIcons = {
    GHS01: "💥", GHS02: "🔥", GHS03: "🧨", GHS04: "💨",
    GHS05: "🧪", GHS06: "☠️", GHS07: "⚠️", GHS08: "👤", GHS09: "🌊"
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Dodaj substancję</h2>
          <div className="grid grid-cols-6 gap-2">
            <Input placeholder="Nazwa" value={newSubstance.name} onChange={e => setNewSubstance({ ...newSubstance, name: e.target.value })} />
            <Input placeholder="Producent" value={newSubstance.producer} onChange={e => setNewSubstance({ ...newSubstance, producer: e.target.value })} />
            <Input type="date" value={newSubstance.sdsDate} onChange={e => setNewSubstance({ ...newSubstance, sdsDate: e.target.value })} />
            <Input placeholder="Link" value={newSubstance.link} onChange={e => setNewSubstance({ ...newSubstance, link: e.target.value })} />
            <Input placeholder="Uwagi" value={newSubstance.notes} onChange={e => setNewSubstance({ ...newSubstance, notes: e.target.value })} />
            <Input placeholder="Piktogramy (np. GHS07,GHS08)" value={newSubstance.ghs.join(",")} onChange={e => setNewSubstance({ ...newSubstance, ghs: e.target.value.split(",") })} />
          </div>
          <Button onClick={handleAdd}>Dodaj</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista substancji chemicznych</h2>
            <div className="flex gap-2">
              <Input placeholder="Szukaj..." value={filter} onChange={e => setFilter(e.target.value)} className="w-64" />
              <Button onClick={handleExport} variant="outline"><ArrowDownToLine className="mr-2 h-4 w-4" />Eksport</Button>
              <label className="cursor-pointer flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                <span>Import</span>
                <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nazwa</TableCell>
                <TableCell>Producent</TableCell>
                <TableCell>Data SDS</TableCell>
                <TableCell>Aktualna</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Piktogramy</TableCell>
                <TableCell>Uwagi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((substance, i) => (
                <TableRow key={i}>
                  <TableCell>{substance.name}</TableCell>
                  <TableCell>{substance.producer}</TableCell>
                  <TableCell>{substance.sdsDate ? format(parseISO(substance.sdsDate), "yyyy-MM-dd") : "Brak"}</TableCell>
                  <TableCell className={
                    substance.sdsDate ? (isValid(substance.sdsDate) ? "text-green-600 font-semibold" : "text-red-600 font-semibold") : "text-yellow-600 font-semibold"
                  }>
                    {substance.sdsDate ? (isValid(substance.sdsDate) ? "TAK" : "NIE") : "BRAK"}
                  </TableCell>
                  <TableCell>
                    {substance.link ? <a href={substance.link} target="_blank" className="text-blue-500 underline">Zobacz</a> : "Brak"}
                  </TableCell>
                  <TableCell>
                    {substance.ghs.map((g, idx) => <span key={idx} className="mr-1">{ghsIcons[g.trim()] || g}</span>)}
                  </TableCell>
                  <TableCell>{substance.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
