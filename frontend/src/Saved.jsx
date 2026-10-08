import { Link } from "react-router-dom";

function Saved() {
  return (
    <div className="simple-page">
      <div className="simple-page-container">
        <Link to="/home" className="back-button">
          ← Back
        </Link>

        <h1>Saved</h1>

        <p>
          Your saved blogs will appear here.
        </p>
      </div>
    </div>
  );
}

export default Saved;