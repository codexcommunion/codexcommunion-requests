import { Amplify } from "aws-amplify";
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from "../amplify_outputs.json";

import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Layout from "./components/Layout";
import "./index.css";

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  Predictions: outputs.custom.Predictions,
});


function Root() {
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem("skipInstructions") !== "true";
  });

  const handleToggleInstructions = () => {
    const next = !showInstructions;
    setShowInstructions(next);
    if (next) {
      localStorage.removeItem("skipInstructions");
    } else {
      localStorage.setItem("skipInstructions", "true");
    }
  };

  return (
    <Layout
      onShowInstructions={handleToggleInstructions}
      showInstructions={showInstructions}
    >
      <App
        showInstructions={showInstructions}
        onHideInstructions={() => {
          localStorage.setItem("skipInstructions", "true");
          setShowInstructions(false);
        }}
      />
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
