import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Componente de debug para desenvolvimento
 * Exibe informações de autenticação e permissões de admin
 * @dev Deve ser removido em produção
 */
export function AdminDebugInfo() {
  const { user, isAuthenticated } = useAuthStore();

  const isAdmin = user?.role === "admin".toUpperCase();
  console.log(user);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded text-xs z-50">
      <div>Logado: {isAuthenticated ? "Sim" : "Não"}</div>
      <div>Email: {user?.email || "N/A"}</div>
      <div>É Admin: {isAdmin ? "Sim" : "Não"}</div>
      <div>Role: {user?.role || "N/A"}</div>
    </div>
  );
}
