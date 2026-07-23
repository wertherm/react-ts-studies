/**
 * FUNDAMENTO: Guard Clauses (early return) em event handlers assíncronos + null safety
 * ---------------------------------------------------------------------------------
 * CONTEXTO (inspirado num bug real de um wizard de cadastro):
 * Um formulário multi-etapas cria/salva uma "operação" e só então navega para a
 * próxima tela, passando o `id` da operação na URL (ex.: ?id=abc123).
 *
 * O BUG clássico: o handler navega para a próxima tela MESMO quando o `id` veio
 * null (porque o salvamento falhou). A tela seguinte abre sem `?id=` e quebra.
 *
 * OBJETIVO DO EXERCÍCIO: usar uma GUARD CLAUSE (early return) para bloquear a
 * navegação quando não há id, e tratar corretamente o tipo `string | null`.
 * NÃO é para copiar o caso real — é para exercitar o fundamento.
 */

import { useState } from 'react';

// Simulação de um "serviço" que salva a etapa e retorna o id da operação.
// Repare no tipo de retorno: o id PODE ser null (falha no salvamento).
type ResultadoSalvar = { operacaoId: string | null };

async function salvarEtapa(preenchido: boolean): Promise<ResultadoSalvar> {
  // Se não preencheu, simula falha e devolve null.
  await new Promise((r) => setTimeout(r, 300));
  return { operacaoId: preenchido ? 'op-123' : null };
}

// Simulação de navegação (no app real seria o useNavigate do react-router).
function navegarPara(url: string) {
  console.log('navegando para:', url);
}

export function WizardEtapa() {
  const [preenchido, setPreenchido] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleProximo = async () => {
    setCarregando(true);

    // TODO 1: chame salvarEtapa(preenchido) e guarde o resultado.
    // Dica: use await. Tipe/observe que result.operacaoId é `string | null`.

    // TODO 2: GUARD CLAUSE — se NÃO houver operacaoId, avise o usuário e
    //         faça `return` ANTES de montar a URL / navegar.
    //         (não deixe cair no navegarPara sem id!)

    // TODO 3: monte a query string com o id (ex.: `?id=<operacaoId>`)
    //         e chame navegarPara(...) somente quando o id existir.

    // TODO 4: garanta que setCarregando(false) rode em qualquer caminho
    //         (dica: try/finally, ou chame antes de cada return).
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
    </div>
  );
}

/*
 * DICAS
 * -----
 * - Guard clause = "trave e saia cedo". Em vez de aninhar `if (id) { ...navega... }`,
 *   escreva `if (!id) return;` e siga o caminho feliz sem indentação extra.
 * - `string | null`: o TypeScript te obriga a tratar o null. Depois de `if (!id) return;`
 *   o TS faz "narrowing" e passa a enxergar `id` como `string` no restante da função.
 * - Nullish coalescing `??`: útil para normalizar (`const id = maybe ?? null`).
 *   Diferente do `||`, o `??` só cai no fallback para null/undefined (não para '' ou 0).
 * - Handler async: `onClick={handleProximo}` aceita função async; só não dá para
 *   retornar a Promise para o DOM — trate erros dentro (try/catch/finally).
 */
