import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="bg-card rounded-lg shadow-lg border border-border p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <div className="h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  1. Aceitação dos Termos
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  Ao acessar e usar a plataforma WeUnite, você concorda em
                  cumprir e ficar vinculado aos seguintes termos e condições. Se
                  você não concordar com qualquer parte destes termos, você não
                  deve usar nossos serviços.
                </p>
              </section>

              <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h2 className="text-xl font-semibold mb-3 text-primary">
                  2. Elegibilidade e Menores de Idade
                </h2>
                <p className="leading-relaxed font-medium">
                  O uso da WeUnite é permitido apenas para indivíduos que possam
                  formar contratos vinculativos sob a lei aplicável.
                </p>
                <div className="mt-4 p-4 bg-background rounded border border-primary/30">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    ⚠️ Atenção: Usuários Menores de Idade
                  </h3>
                  <p className="leading-relaxed">
                    Para usuários menores de 18 anos (ou a idade de maioridade
                    em sua jurisdição), o uso da plataforma{" "}
                    <strong>
                      deve ser feito estritamente sob a supervisão e
                      acompanhamento de um pai ou responsável legal
                    </strong>
                    .
                  </p>
                  <p className="mt-2 leading-relaxed">
                    Ao permitir que um menor utilize a plataforma, o responsável
                    legal concorda em ficar vinculado a estes Termos de Uso e
                    assume total responsabilidade pelo uso da plataforma pelo
                    menor, incluindo quaisquer encargos financeiros e
                    responsabilidades legais que possam incorrer.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  3. Conta e Segurança
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  Para acessar certos recursos da plataforma, você pode precisar
                  criar uma conta. Você é responsável por manter a
                  confidencialidade de suas credenciais de login e por todas as
                  atividades que ocorrem em sua conta. Notifique-nos
                  imediatamente sobre qualquer uso não autorizado.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  4. Conduta do Usuário
                </h2>
                <p className="leading-relaxed text-muted-foreground mb-4">
                  Você concorda em não usar a plataforma para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Publicar conteúdo que seja ilegal, ofensivo, ameaçador,
                    difamatório ou que promova discurso de ódio e preconceito.
                  </li>
                  <li>Assediar, intimidar ou prejudicar outros usuários.</li>
                  <li>
                    Violar direitos de propriedade intelectual de terceiros.
                  </li>
                  <li>
                    Distribuir spam, vírus ou qualquer outro código malicioso.
                  </li>
                  <li>Criar perfis falsos ou deturpar sua identidade.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  5. Conteúdo Gerado pelo Usuário
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  Ao publicar conteúdo na WeUnite, você concede à plataforma uma
                  licença não exclusiva para usar, exibir e distribuir tal
                  conteúdo. Você mantém a propriedade de seu conteúdo, mas é
                  responsável por garantir que ele não viole direitos de
                  terceiros ou nossas políticas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  6. Modificações dos Termos
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  Reservamo-nos o direito de modificar estes termos a qualquer
                  momento. As alterações entrarão em vigor imediatamente após a
                  publicação na plataforma. O uso continuado da WeUnite após
                  tais alterações constitui sua aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Contato</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em
                  contato conosco através dos canais de suporte disponíveis na
                  plataforma.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
