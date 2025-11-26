import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// TODO: Implementar endpoints backend para gerenciamento de usuários

/**
 * Página de gerenciamento de usuários
 * TODO: Integrar com API real quando endpoints forem criados
 */
export function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários da plataforma
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Em Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Funcionalidade de gerenciamento de usuários em desenvolvimento. Os
              endpoints de backend precisam ser implementados primeiro.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
