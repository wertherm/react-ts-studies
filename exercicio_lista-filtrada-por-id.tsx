/* =============================================================================
 * FUNDAMENTO: Lista filtrada em React
 *   (1) guardar o DATASET COMPLETO no estado e DERIVAR a lista filtrada
 *   (2) identificar a linha clicada por um ID ESTÁVEL, nunca pelo índice
 * =============================================================================
 *
 * CONTEXTO / MOTIVAÇÃO
 * --------------------
 * Um grid de operações tem uma busca. Dois bugs clássicos aparecem quando a
 * implementação é ingênua:
 *
 *   Bug A) Ao digitar na busca, os valores da coluna somem/zeram — porque a
 *          busca reconstrói as linhas do zero em vez de FILTRAR o que já existe.
 *   Bug B) Ao clicar numa linha com a lista filtrada, abre a operação ERRADA —
 *          porque o clique usa o índice da linha (0,1,2...) para achar o item
 *          na lista ORIGINAL, e o índice do que está na tela não bate mais.
 *
 * Sua missão: implementar o componente evitando os dois bugs.
 * Não precisa copiar o código da sessão — foque no fundamento.
 */

import { useMemo, useState } from "react";

// Modelo de uma operação (o "dado bruto").
interface Operacao {
  id: string;
  tipo: string;
  descricao: string;
  valorTotal: number;
}

// Simula o retorno do backend.
const OPERACOES: Operacao[] = [
  { id: "op-a1", tipo: "Contrato de Locação", descricao: "Locação Galpão SP", valorTotal: 120000 },
  { id: "op-b2", tipo: "CCB", descricao: "CCB Agro Norte", valorTotal: 55000 },
  { id: "op-c3", tipo: "Debenture", descricao: "Deb. Série Única", valorTotal: 980000 },
  { id: "op-d4", tipo: "Contrato de Locação", descricao: "Locação Loja RJ", valorTotal: 42000 },
];

// Formata número em BRL. (pronto, não precisa mexer)
const formatBRL = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export function GridOperacoes() {
  // O dataset COMPLETO já carregado. É a "fonte da verdade".
  const [operacoes] = useState<Operacao[]>(OPERACOES);

  // O texto digitado na busca.
  const [busca, setBusca] = useState("");

  // TODO 1: derive a lista visível A PARTIR de `operacoes`, filtrando por `busca`
  //         (case-insensitive, comparando tipo OU descrição). Use useMemo para
  //         só recalcular quando `operacoes` ou `busca` mudarem.
  //         DICA: se `busca` estiver vazia, mostre `operacoes` inteiro.
  const operacoesFiltradas = useMemo<Operacao[]>(() => {
    // TODO: implemente o filtro aqui
    return [];
  }, [/* TODO: dependências */]);

  // TODO 2: ao clicar numa linha, encontre a operação pelo ID (estável),
  //         NÃO pelo índice. Receba o id como parâmetro.
  const handleClickLinha = (id: string) => {
    // TODO: encontre a operação correta em `operacoes` usando o id
    // const operacao = ...
    // alert(`Abrindo ${operacao?.descricao}`);
  };

  return (
    <div>
      <input
        placeholder="Buscar por tipo ou descrição..."
        value={busca}
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
            // TODO 3: qual deve ser a `key`? O índice serve como key aqui?
            //         E o onClick, o que ele deve passar para handleClickLinha?
            <tr key={/* TODO */ index} onClick={() => handleClickLinha(/* TODO */ "")}>
              {/* O "#" é só rótulo visual — pode usar o índice SÓ para isso. */}
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
 * DICAS
 * -----------------------------------------------------------------------------
 * - Derive, não duplique: o filtrado é uma FUNÇÃO do dataset + busca. Guardar
 *   o filtrado em outro useState e sincronizar "na mão" é fonte de bugs.
 * - `useMemo` evita refazer o filtro a cada render sem necessidade.
 * - Índice (posição no array) NÃO é identidade. Com a lista filtrada, o índice
 *   0 pode ser a operação "op-c3", não a "op-a1". Sempre resolva por `id`.
 * - `key` no React também deve ser o `id` estável — nunca o índice quando a
 *   lista pode reordenar/filtrar.
 * - "#" na tela é só numeração visual; para isso o índice pode ser usado.
 * --------------------------------------------------------------------------- */
