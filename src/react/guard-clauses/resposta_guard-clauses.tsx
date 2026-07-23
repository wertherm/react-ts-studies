/**
 * RESPOSTA — Guard Clauses (early return) em event handlers assíncronos + null safety
 * -----------------------------------------------------------------------------------
 * Este arquivo resolve o exercício por completo e explica o PORQUÊ de cada parte.
 *
 * O fundamento nasceu de um bug real: um handler de "próximo passo" navegava para a
 * tela de resumo mesmo quando o id da operação vinha null — a tela seguinte abria sem
 * `?id=` e disparava "ID da operação não encontrado na URL". A correção foi uma
 * GUARD CLAUSE: se não há id, avisa e retorna ANTES de navegar.
 */

import { useState } from 'react';

/**
 * Tipo de retorno do "serviço".
 * O ponto-chave é o union `string | null`: o id PODE não existir (falha no salvamento).
 * Modelar o null no tipo obriga quem consome a tratá-lo — o compilador vira seu aliado.
 */
type ResultadoSalvar = { operacaoId: string | null };

async function salvarEtapa(preenchido: boolean): Promise<ResultadoSalvar> {
  await new Promise((r) => setTimeout(r, 300));
  // Se não preencheu, simula falha de salvamento devolvendo null.
  return { operacaoId: preenchido ? 'op-123' : null };
}

function navegarPara(url: string) {
  // No app real seria o useNavigate() do react-router.
  console.log('navegando para:', url);
}

export function WizardEtapa() {
  const [preenchido, setPreenchido] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null); // estado de erro também é string | null

  const handleProximo = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // (1) Chamamos o serviço. `operacaoId` tem o tipo `string | null`.
      //     Usar `??` normaliza qualquer undefined para null, garantindo um único
      //     "valor de ausência" a testar. (?? só cai no fallback para null/undefined.)
      const { operacaoId } = await salvarEtapa(preenchido);
      const idSeguro = operacaoId ?? null;

      // (2) GUARD CLAUSE — trave e saia cedo.
      //     Se não há id, não faz sentido continuar: avisamos e retornamos.
      //     Isso impede o bug de navegar sem id. Note que NÃO aninhamos o resto
      //     dentro de um if — o caminho feliz fica linear e sem indentação extra.
      if (!idSeguro) {
        setErro('Não foi possível obter o ID da operação. Salve os dados antes de avançar.');
        return; // <- o coração da correção: para aqui, não navega.
      }

      // (3) A partir daqui o TypeScript faz NARROWING: como já retornamos quando
      //     idSeguro era null, o compilador agora enxerga `idSeguro` como `string`.
      //     Podemos usá-lo sem `?`, sem `!`, sem checagem extra.
      const params = new URLSearchParams();
      params.append('id', idSeguro); // idSeguro: string (garantido pelo guard acima)
      navegarPara(`/resumo?${params.toString()}`);
    } finally {
      // (4) finally roda em TODOS os caminhos (sucesso, erro, ou o return da guard).
      //     Por isso é o lugar ideal para desligar o "carregando" sem repetir código.
      setCarregando(false);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preenchido}
          onChange={(e) => setPreenchido(e.target.checked)}
        />
        Preencher dados (desmarcado = simula falha no salvamento)
      </label>

      <button onClick={handleProximo} disabled={carregando}>
        {carregando ? 'Salvando...' : 'Próximo'}
      </button>

      {/* Renderização condicional: só mostra o erro quando ele existe (string, não null). */}
      {erro && <p role="alert" style={{ color: 'crimson' }}>{erro}</p>}
    </div>
  );
}

/*
 * RESUMO DOS FUNDAMENTOS APLICADOS
 * --------------------------------
 * 1. Guard clause / early return: `if (!idSeguro) return;` — falha/condição inválida
 *    tratada logo no início, mantendo o caminho feliz linear e legível.
 * 2. Union types com null (`string | null`): modela a ausência de valor no próprio tipo,
 *    forçando o tratamento e evitando o "undefined é objeto" em runtime.
 * 3. Type narrowing: após o guard, o TS estreita `string | null` para `string`.
 * 4. Nullish coalescing (`??`): normaliza null/undefined sem pisar em '' ou 0 (que o || pegaria).
 * 5. Handler async + try/finally: garante limpeza de estado (carregando) em qualquer saída.
 * 6. Renderização condicional (`erro && <p/>`): exibe UI só quando o dado existe.
 *
 * PARALELO COM O BUG REAL:
 * - `operacaoId` vindo null do serviço == `POST` de salvamento falhou mas o fluxo seguia.
 * - A falta da guard clause == navegar para o resumo sem `?id=`.
 * - A correção == exatamente o `if (!savedOperacaoId) { toast.error(...); return; }`.
 */
