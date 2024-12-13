import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Layout />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;