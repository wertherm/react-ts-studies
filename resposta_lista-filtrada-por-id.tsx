/* =============================================================================
 * RESPOSTA — Lista filtrada em React
 *   (1) guardar o DATASET COMPLETO no estado e DERIVAR a lista filtrada
 *   (2) identificar a linha clicada por um ID ESTÁVEL, nunca pelo índice
 * =============================================================================
 *
 * Esta é a solução completa e comentada. Os dois bugs que ela evita são
 * exatamente os que foram corrigidos na sessão (grid de Operações):
 *   Bug A) valores da coluna "zeram" ao digitar na busca;
 *   Bug B) clicar na linha com a lista filtrada abre a operação errada.
 */

import { useMemo, useState } from "react";

interface Operacao {
  id: string;
  tipo: string;
  descricao: string;
  valorTotal: number;
}

const OPERACOES: Operacao[] = [
  { id: "op-a1", tipo: "Contrato de Locação", descricao: "Locação Galpão SP", valorTotal: 120000 },
  { id: "op-b2", tipo: "CCB", descricao: "CCB Agro Norte", valorTotal: 55000 },
  { id: "op-c3", tipo: "Debenture", descricao: "Deb. Série Única", valorTotal: 980000 },
  { id: "op-d4", tipo: "Contrato de Locação", descricao: "Locação Loja RJ", valorTotal: 42000 },
];

const formatBRL = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export function GridOperacoes() {
  // FONTE DA VERDADE: o dataset completo, já com os valores calculados.
  // Tudo o que a tela mostra é DERIVADO daqui. Nunca mexemos nele ao buscar.
  const [operacoes] = useState<Operacao[]>(OPERACOES);

  // Único estado que a interação de busca precisa: o texto digitado.
  // Repare que NÃO existe um `operacoesFiltradas` em useState — se existisse,
  // teríamos duas cópias da mesma informação para manter em sincronia (a raiz
  // do Bug A: a busca reconstruía a lista e esquecia de recalcular os valores).
  const [busca, setBusca] = useState("");

  // (1) DERIVAÇÃO: a lista visível é uma FUNÇÃO PURA de (operacoes, busca).
  // useMemo só recalcula quando uma dessas dependências muda — barato e correto.
  const operacoesFiltradas = useMemo<Operacao[]>(() => {
    const termo = busca.trim().toLowerCase();

    // Busca vazia → mostra o dataset inteiro (com os valores intactos).
    if (!termo) return operacoes;

    // Filtra a partir do dataset completo. Como só recortamos itens já
    // existentes, o campo `valorTotal` (e qualquer outro) vem junto de graça:
    // não há reconstrução de linha, então nada "zera". Isso mata o Bug A.
    return operacoes.filter(
      (op) =>
        op.tipo.toLowerCase().includes(termo) ||
        op.descricao.toLowerCase().includes(termo),
    );
  }, [operacoes, busca]);

  // (2) IDENTIDADE POR ID: recebemos o `id` da linha clicada e procuramos o
  // item no dataset completo. O índice da linha na tela NÃO serve como
  // identidade — com a lista filtrada, a 1ª linha visível pode ser "op-c3".
  // Resolver por `id` garante que abrimos sempre a operação certa (mata o Bug B).
  const handleClickLinha = (id: string) => {
    const operacao = operacoes.find((op) => op.id === id);
    if (!operacao) return; // guarda defensiva: id inexistente
    // Numa app real: navigate(`/operacao/${operacao.id}`) etc.
    alert(`Abrindo: ${operacao.descricao} (${formatBRL(operacao.valorTotal)})`);
  };

  return (
    <div>
      <input
        placeholder="Buscar por tipo ou descrição..."
        value={busca}
        // Controlled input: o valor do campo é dirigido pelo estado `busca`.
        onChange={(e) => setBusca(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Operação</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {operacoesFiltradas.map((op, index) => (
            // key = id ESTÁVEL. Assim o React reconcilia as linhas corretamente
            // quando a lista filtra/reordena (nunca use índice como key aqui).
            // onClick passa op.id — a identidade, não a posição.
            <tr key={op.id} onClick={() => handleClickLinha(op.id)}>
              {/* "#" é só numeração visual da lista JÁ filtrada — para ISSO o
                  índice é legítimo, pois não é usado como identidade. */}
              <td>{String(index + 1).padStart(2, "0")}</td>
              <td>{op.tipo}</td>
              <td>{op.descricao}</td>
              <td>{formatBRL(op.valorTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * POR QUE FUNCIONA (resumo dos fundamentos)
 * -----------------------------------------------------------------------------
 * 1. ESTADO MÍNIMO + DERIVAÇÃO
 *    Só guardamos o irredutível: `operacoes` (fonte) e `busca` (input). A lista
 *    filtrada é DERIVADA. Menos estado = menos sincronização = menos bugs.
 *
 * 2. useMemo
 *    Memoiza o resultado do filtro; recalcula só quando (operacoes|busca) mudam.
 *    Não muda a corretude — muda o custo. Correção vem da derivação; performance
 *    vem do memo.
 *
 * 3. IDENTIDADE ≠ POSIÇÃO
 *    `id` é estável e único; o índice muda conforme a lista filtra/ordena.
 *    Use `id` para: (a) a prop `key`, (b) resolver o item no clique, (c) qualquer
 *    lookup. Reserve o índice apenas para rótulos visuais ("#", numeração).
 *
 * PARALELO COM A SESSÃO:
 *   - `operacoes`  ~ `topData` (dataset completo em estado)
 *   - filtro derivado ~ o que antes era feito reconstruindo linhas na busca
 *   - `op.id` no clique ~ o `__id` adicionado às linhas para o handleOperacaoClick
 * --------------------------------------------------------------------------- */
