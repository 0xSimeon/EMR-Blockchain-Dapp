import "../styles/globals.css";
import React, { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { CeloProvider, Alfajores, NetworkNames } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Layout from "../components/Layout";

function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    const importTE = async () => {
      (await import("tw-elements")).default;
    };
    importTE();
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <CeloProvider
        dapp={{
          name: "Decentralized Medical Records System",
          description: "An Electronic Medical Records dapp",
          url: "https://example.com",
          icon: "https://example.com/favicon.ico",
        }}
        // defaultNetwork={Alfajores.name}
        networks={[Alfajores]}
        network={{
          name: NetworkNames.Alfajores,
          rpcUrl: "https://alfajores-forno.celo-testnet.org",
          graphQl: "https://alfajores-blockscout.celo-testnet.org/graphiql",
          explorer: "https://alfajores-blockscout.celo-testnet.org",
          chainId: 44787,
        }}
        connectModal={{
          providersOptions: { searchable: true },
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CeloProvider>
    );
  }
}

export default App;
