import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from "@/app/components/ui/table"
import { Checkbox } from "@/app/components/ui/checkbox"
import { ButtonSwitch } from "@/app/components/ui/button-switch"

export default function TableUsers({ filteredBusinesses, selectedIds, toggleSelectAll, toggleSelect, handleStatusChange }) {
  return (
     <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron negocios
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses?.map((business) => (
                <TableRow key={business.id} className={selectedIds.includes(business.id) ? "bg-muted/50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(business.id)}
                      onCheckedChange={() => toggleSelect(business.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{business.nombre_negocio}</TableCell>
                  <TableCell>{business.correo}</TableCell>
                  <TableCell>{business.telefono}</TableCell>
                  <TableCell>{business.direccion}</TableCell>
                  <TableCell className="text-center">
                    <ButtonSwitch
                      businessId={business.id}
                      initialStatus={business.is_active}
                      onStatusChange={handleStatusChange}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      );
};