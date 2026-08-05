import { useEffect, useState } from "react";
import { STATUS_CRM, type Patrocinador, type StatusCrm } from "./tipos";
import "./App.css";

const URL_API = "http://localhost:3000";

export default function App() {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<StatusCrm | "">("");

  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [email, setEmail] = useState("");
  const [nicho, setNicho] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);

      try {
        const rota = filtro
          ? `${URL_API}/patrocinadores?status=${encodeURIComponent(filtro)}`
          : `${URL_API}/patrocinadores`;

        const resposta = await fetch(rota);
        if (!resposta.ok) {
          throw new Error("Falha ao carregar");
        }

        const dados: Patrocinador[] = await resposta.json();
        setPatrocinadores(dados);
      } catch {
        setErro("Não foi possível carregar os patrocinadores. A API está rodando?");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [filtro]);

  async function cadastrar(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setMensagem(null);

    try {
      const resposta = await fetch(`${URL_API}/patrocinadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razao_social: razaoSocial,
          cnpj,
          nome_contato: nomeContato || null,
          email: email || null,
          nicho: nicho || null,
        }),
      });

      const corpo = await resposta.json();

      if (!resposta.ok) {
        setMensagem(corpo.erro ?? corpo.message ?? "Erro ao cadastrar");
        return;
      }

      setPatrocinadores((atual) => [...atual, corpo as Patrocinador]);
      setMensagem(`${corpo.razao_social} entrou no funil.`);
      setRazaoSocial("");
      setCnpj("");
      setNomeContato("");
      setEmail("");
      setNicho("");
    } catch {
      setMensagem("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function moverEtapa(id: number, status_crm: StatusCrm) {
    const resposta = await fetch(`${URL_API}/patrocinadores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_crm }),
    });

    if (!resposta.ok) return;

    const atualizado: Patrocinador = await resposta.json();
    setPatrocinadores((atual) =>
      atual.map((p) => (p.id === atualizado.id ? atualizado : p))
    );
  }

  async function remover(id: number) {
    const confirmou = window.confirm("Remover este patrocinador do funil?");
    if (!confirmou) return;

    const resposta = await fetch(`${URL_API}/patrocinadores/${id}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      setPatrocinadores((atual) => atual.filter((p) => p.id !== id));
    }
  }

  return (
    <main>
      <header>
        <p className="eyebrow">F1 in Schools — Enterprise</p>
        <h1>Patrocinadores</h1>
      </header>

      <section className="cadastro">
        <h2>Novo patrocinador</h2>

        <form onSubmit={cadastrar}>
          <input
            placeholder="Razão social"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
          />
          <input
            placeholder="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
          <input
            placeholder="Nome do contato"
            value={nomeContato}
            onChange={(e) => setNomeContato(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Nicho"
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
          />
          <button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Cadastrar"}
          </button>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </section>

      <section className="listagem">
        <div className="barra">
          <h2>Funil de vendas</h2>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as StatusCrm | "")}
          >
            <option value="">Todas as etapas</option>
            {STATUS_CRM.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {carregando && <p>Carregando patrocinadores...</p>}
        {erro && <p className="erro">{erro}</p>}

        {!carregando && !erro && patrocinadores.length === 0 && (
          <p>Nenhum patrocinador nesta etapa. Cadastre o primeiro acima.</p>
        )}

        <ul>
          {patrocinadores.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.razao_social}</strong>
                <span className="detalhe">
                  {p.cnpj}
                  {p.nicho && ` · ${p.nicho}`}
                  {p.nome_contato && ` · ${p.nome_contato}`}
                </span>
              </div>

              <div className="acoes">
                <select
                  value={p.status_crm}
                  onChange={(e) => moverEtapa(p.id, e.target.value as StatusCrm)}
                >
                  {STATUS_CRM.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button onClick={() => remover(p.id)}>Remover</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
