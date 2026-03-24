import { AdminLayout } from "@/components/admin/AdminLayout";
import { ReportsView } from "@/components/admin/ReportsView";

/**
 * Página de gerenciamento de denúncias
 * Usa o componente ReportsView que busca dados reais da API
 */
export function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Denúncias</h1>
            <p className="text-muted-foreground">
              Gerencie denúncias e relatórios da plataforma
            </p>
          </div>
        </div>

        <ReportsView />
      </div>
    </AdminLayout>
  );
}
