import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SubjectFilterProvider } from "./contexts/SubjectFilterContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SubjectFilterProvider>
          <Router>
            <Layout />
          </Router>
        </SubjectFilterProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;