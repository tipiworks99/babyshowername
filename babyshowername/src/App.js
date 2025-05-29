import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BabyShowerForm from "./BabyShowerForm";
import ThankYou from "./ThankYou";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BabyShowerForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}
