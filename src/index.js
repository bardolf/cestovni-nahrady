import { createRoot } from "react-dom/client";
import ContractContainer from './components/contractForm.jsx'

import Bootstrap from 'bootstrap/dist/css/bootstrap.css'; // eslint-disable-line no-unused-vars
import './styles.css'

createRoot(document.getElementById("index")).render(<ContractContainer />);