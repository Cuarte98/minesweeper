import Head from "next/head";
import MineSweeper from "../components/minesweeper";
import "../i18n";
export default function Home() {
  return (
    <div>
      <Head>
        <title>MineSweeper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <MineSweeper />
      </main>
    </div>
  );
}
