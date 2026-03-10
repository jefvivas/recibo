import { useState, useRef } from "react";
import "./App.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {

  const hoje = new Date().toISOString().split("T")[0];

  const numeroInicial = Math.floor(Math.random() * 99999) + 1;

  const [numeroRecibo, setNumeroRecibo] = useState(numeroInicial);
  const [nomeRecebedor, setNomeRecebedor] = useState("Jéferson Vivas");
  const [nome, setNome] = useState("");
  const [data, setData] = useState(hoje);
  const [valor, setValor] = useState("");
  const [referente, setReferente] = useState("");

  const reciboRef = useRef<HTMLDivElement>(null);

  const formatarValor = (valor: string) => {

    if (!valor) return "";

    let numero = valor.replace(",", ".");
    let valorNumerico = Number(numero);

    if (isNaN(valorNumerico)) return valor;

    return valorNumerico.toFixed(2).replace(".", ",");
  };

  const formatarData = (data: string) => {

    if (!data) return "";

    const meses = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
    ];

    const d = new Date(data);

    const dia = d.getDate();
    const mes = meses[d.getMonth()];
    const ano = d.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
  };

  const baixarPDF = async () => {

    if (!reciboRef.current) return;

    const canvas = await html2canvas(reciboRef.current, {
      scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save("recibo.pdf");
  };

  return (
    <div className="container">

      <div className="formArea">
        <h2>Gerar Recibo</h2>

        <input
          placeholder="Número do recibo"
          type="number"
          value={numeroRecibo}
          onChange={(e) => setNumeroRecibo(Number(e.target.value))}
        />

        <input
          placeholder="Nome do recebedor"
          value={nomeRecebedor}
          onChange={(e) => setNomeRecebedor(e.target.value)}
        />

        <input
          placeholder="Nome de quem paga"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <input
          placeholder="Referente a"
          value={referente}
          onChange={(e) => setReferente(e.target.value)}
        />

        <button onClick={() => window.print()}>
          Imprimir
        </button>

        <button onClick={baixarPDF}>
          Baixar PDF
        </button>
      </div>

      <div ref={reciboRef} className="recibo">

        <div className="topo">
          <div>
            <h1>RECIBO</h1>
            <span className="numero">Nº {numeroRecibo}</span>
          </div>

          <div className="valorBox">
            <span>VALOR TOTAL</span>
            <strong>R$ {formatarValor(valor)}</strong>
          </div>
        </div>

        <div className="campo">
          <label>Recebi(emos) de:</label>
          <div className="box">{nome}</div>
        </div>

        <div className="campo">
          <label>A importância de:</label>
          <div className="box">R$ {formatarValor(valor)}</div>
        </div>

        <div className="campo">
          <label>Referente a:</label>
          <div className="box">{referente}</div>
        </div>

        <div className="rodape">

          <span>
            Guapimirim, {formatarData(data)}.
          </span>

          <div className="assinaturaArea">
            <div className="linha"></div>
            <span>{nomeRecebedor}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

