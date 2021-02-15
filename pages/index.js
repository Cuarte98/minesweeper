import Head from "next/head";
import MineSweeper from "../components/minesweeper";

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
