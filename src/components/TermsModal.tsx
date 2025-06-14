import { X } from "lucide-react";
import React from "react";

interface TermsModalProps {
  onClose: () => void;
  onAccept?: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose, onAccept }) => {
  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Política de Privacidade
          </h1>
          <p className="text-gray-600 text-sm">
            Floripa na Praia - Atualizada em 14/06/2025
          </p>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
            <p className="text-justify">
              O Floripa na Praia respeita sua privacidade e está comprometido em
              proteger as informações pessoais dos nossos usuários. Esta
              Política de Privacidade descreve como coletamos, usamos,
              armazenamos e compartilhamos suas informações ao utilizar nosso
              aplicativo. Ao usar o Floripa na Praia, você concorda com as
              práticas descritas nesta Política de Privacidade.
            </p>

            <p className="text-justify">
              Ao utilizar nossos serviços, você entende que coletaremos e
              usaremos suas informações pessoais nas formas descritas nesta
              Política, sob as normas da Constituição Federal de 1988 (art. 5º,
              LXXIX; e o art. 22º, XXX – incluídos pela EC 115/2022), das normas
              de Proteção de Dados (LGPD, Lei Federal 13.709/2018), das
              disposições consumeristas da Lei Federal 8078/1990 e as demais
              normas do ordenamento jurídico brasileiro aplicáveis.
            </p>

            <p className="text-justify">
              Dessa forma, o Floripa na Praia na qualidade de Controladora de
              Dados, compromete-se a cumprir as disposições aqui estabelecidas.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              1. Informações que coletamos
            </h2>
            <p className="text-justify">
              É a partir do seu consentimento que tratamos os seus dados
              pessoais. O consentimento é a manifestação livre, informada e
              inequívoca pela qual você autoriza o Floripa na Praia a tratar
              seus dados.
            </p>
            <p className="text-justify">
              Assim, em consonância com a Lei Geral de Proteção de Dados, seus
              dados só serão coletados, tratados e armazenados mediante prévio e
              expresso consentimento.
            </p>
            <p className="text-justify">
              Você pode revogar esse consentimento a qualquer momento e sem
              custo, ciente de que a revogação pode inviabilizar determinadas
              funcionalidades do aplicativo.
            </p>
            <div className="mb-4">
              <p className="font-medium mb-2">As informações coletadas são:</p>
              <p className="mb-2">
                <strong>I - Informações Pessoais:</strong> Ao criar uma conta no
                Floripa na Praia, coletamos seu nome, endereço de e-mail e, caso
                fornecido, sua foto de perfil. Essas informações são necessárias
                para que possamos criar sua conta e permitir que você interaja
                com outros usuários.
              </p>
              <p className="mb-2">
                <strong>II - Informações de Localização:</strong> Com a sua
                permissão, coletamos informações de localização para permitir
                que você atualize as condições das praias com base em sua
                posição geográfica, pois é necessário estar na praia onde você
                pretende interagir.
              </p>
              <p className="mb-2">
                <strong>III - Informações de Uso:</strong> Registramos
                informações sobre as condições que você atualiza, as suas fotos
                e as suas postagens.
              </p>
            </div>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              2. Como usamos suas Informações
            </h2>
            <p className="mb-2">Usamos as informações coletadas para:</p>
            <p className="mb-2">
              <strong>I -</strong> Prover e melhorar os serviços do aplicativo;
            </p>
            <p className="mb-2">
              <strong>II -</strong> Monitorar a segurança e a funcionalidade do
              aplicativo;
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              3. Compartilhamento de Informações
            </h2>
            <p className="text-justify mb-3">
              O Floripa na Praia não compartilha seus dados pessoais
              identificáveis com terceiros não autorizados, exceto nos casos
              previstos nesta Política. No entanto, algumas informações
              fornecidas voluntariamente por você, como postagens, avaliações e
              fotos, são públicas e podem ser visualizadas por qualquer usuário
              do aplicativo ou visitante do site.
            </p>

            <p className="mb-2">
              <strong>3.1. Conteúdo Público:</strong> Avaliações, fotos e
              comentários inseridos por você no aplicativo são visíveis aos
              demais usuários, como parte da proposta de compartilhamento
              colaborativo de informações sobre as praias.
            </p>

            <p className="mb-2">
              <strong>3.2. Terceiros Prestadores de Serviço:</strong> Seus dados
              podem ser compartilhados com terceiros contratados para viabilizar
              funcionalidades do aplicativo (como análise de dados ou
              hospedagem), sempre sob cláusulas contratuais de confidencialidade
              e proteção de dados.
            </p>

            <p className="mb-2">
              <strong>3.3. Obrigações Legais:</strong> Em caso de exigência
              legal, judicial ou administrativa, os dados poderão ser fornecidos
              às autoridades competentes, conforme previsto em lei.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              4. Retenção de Dados
            </h2>
            <p className="text-justify mb-3">
              Manteremos seus dados enquanto durar sua relação com o aplicativo
              ou conforme exigido por lei. Caso você deseje excluir sua conta e
              suas informações, entre em contato conosco pelo e-mail:{" "}
              <span className="font-medium text-blue-600">
                floripaflop@gmail.com
              </span>
              .
            </p>
            <p className="text-justify mb-3">
              Ao fim do período de armazenamento dos dados pessoais, eles serão
              excluídos de nossas bases de dados ou anonimizados. Nos termos do
              art. 16 da LGPD, mesmo após a solicitação de exclusão, poderemos
              manter dados nos seguintes casos:
            </p>
            <p className="mb-2">
              <strong>I -</strong> Cumprimento de obrigação legal ou regulatória
              pelo controlador;
            </p>
            <p className="mb-2">
              <strong>II –</strong> Estudo por órgão de pesquisa, garantida,
              sempre que possível, a anonimização dos dados pessoais;
            </p>
            <p className="mb-2">
              <strong>III –</strong> transferência a terceiro, desde que
              respeitados os requisitos de tratamento de dados dispostos nesta
              Lei; ou
            </p>
            <p className="mb-2">
              <strong>IV –</strong> Uso exclusivo do controlador, vedado seu
              acesso por terceiro, e desde que anonimizados os dados.
            </p>
            <p className="text-justify">
              Ou seja, algumas das suas informações pessoais que sejam
              necessárias para o cumprimento de determinações legais, judiciais
              e administrativas e/ou para o exercício do direito de defesa em
              processos judiciais e administrativos serão mantidas, apesar da
              exclusão dos demais dados.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              5. Segurança das Informações
            </h2>
            <p className="text-justify mb-3">
              Empregamos medidas de segurança para proteger suas informações
              contra acesso, alteração, divulgação ou destruição não
              autorizados. No entanto, nenhuma transmissão de dados pela
              internet ou método de armazenamento é completamente seguro.
            </p>
            <p className="mb-2">
              Entre as medidas que adotamos, destacamos as seguintes:
            </p>
            <p className="mb-2">
              <strong>I -</strong> Acesso restrito aos dados apenas por pessoas
              autorizadas e sob compromisso de confidencialidade;
            </p>
            <p className="mb-2">
              <strong>II -</strong> Armazenamento dos dados em ambientes
              controlados e seguros.
            </p>
            <p className="text-justify mb-3">
              Nos comprometemos a adotar as melhores posturas para evitar
              incidentes de segurança. Contudo, é necessário destacar que
              nenhuma plataforma digital é inteiramente segura e livre de
              riscos. É possível que, apesar de todos os nossos protocolos de
              segurança, problemas de culpa exclusivamente de terceiros ocorram,
              como ataques cibernéticos de hackers, ou também em decorrência da
              negligência ou imprudência do próprio usuário.
            </p>
            <p className="text-justify">
              Em caso de incidentes de segurança que possam gerar risco ou dano
              relevante para você ou qualquer um de nossos usuários,
              comunicaremos aos afetados e a Autoridade Nacional de Proteção de
              Dados sobre o ocorrido, conforme exigido pela Lei Geral de
              Proteção de Dados.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              6. Seus Direitos e Escolhas
            </h2>
            <p className="text-justify">
              Você tem o direito de acessar, corrigir, atualizar ou excluir suas
              informações pessoais. O Floripa na Praia assegura a seus usuários
              seus direitos de titular previstos no artigo 18 da Lei Geral de
              Proteção de Dados. Assim, você pode, de maneira gratuita e a
              qualquer tempo, fazer essas solicitações pelo e-mail{" "}
              <span className="font-medium text-blue-600">
                floripaflop@gmail.com
              </span>
              .
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              7. Cookies e Tecnologias de Rastreamento
            </h2>
            <p className="text-justify mb-2">
              O aplicativo pode utilizar cookies e tecnologias similares para
              melhorar sua experiência. Você pode configurar o uso de cookies
              nas preferências do seu navegador.
            </p>
            <p className="text-justify">
              A revogação de determinados cookies pode comprometer
              funcionalidades do aplicativo.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              8. Alterações nesta Política de Privacidade
            </h2>
            <p className="text-justify mb-2">
              Esta Política pode ser atualizada a qualquer momento, em função de
              alterações legais ou melhorias no aplicativo. A versão mais
              recente estará sempre disponível e, quando houver mudanças
              relevantes, você será notificado.
            </p>
            <p className="text-justify">
              O uso continuado do aplicativo após alterações representa sua
              concordância com a nova versão.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              9. Isenção de responsabilidade
            </h2>
            <p className="text-justify mb-3">
              Conforme mencionado no Tópico 5, embora adotemos padrões de
              segurança a fim de evitar incidentes, não há nenhuma página
              virtual inteiramente livre de riscos. Nesse sentido, não nos
              responsabilizamos por:
            </p>
            <p className="mb-2">
              <strong>I –</strong> Quaisquer consequências decorrentes da
              negligência, imprudência ou imperícia dos usuários em relação a
              segurança de seus dados individuais.
            </p>
            <p className="mb-2">
              <strong>II –</strong> Ações maliciosas de terceiros, como ataques
              de hackers, exceto se comprovada conduta culposa ou deliberada do
              Floripa na Praia.
            </p>
            <p className="mb-2">
              <strong>III –</strong> Inveracidade das informações inseridas pelo
              usuário nos registros necessários para a utilização dos nossos
              serviços; quaisquer consequências decorrentes de informações
              falsas ou inseridas de má-fé são de inteiramente responsabilidade
              do usuário.
            </p>

            <h2 className="text-lg font-semibold text-blue-900 mt-6 mb-3">
              10. Contato
            </h2>
            <p className="text-justify">
              Em caso de dúvidas sobre esta Política de Privacidade ou sobre o
              uso de seus dados, entre em contato conosco pelo{" "}
              <span className="font-medium text-blue-600">
                floripaflop@gmail.com
              </span>
              .
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-blue-800 text-center">
                <strong>Importante:</strong> Ao usar o Floripa na Praia, você
                concorda com as práticas descritas nesta Política de
                Privacidade, em conformidade com a LGPD (Lei Federal
                13.709/2018) e demais normas aplicáveis.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Aceitar Termos
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
