import "./verify-email.css";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  const isEmailVerified = true;
  return (
    <section className="verify-email">
      {isEmailVerified ? (
        <>
          <i className="bi bi-patch-check verify-email-icon"></i>
          <h1 className="verify-email-title">
            Your email has been verified successfully
          </h1>
          <Link to="/login" className="verify-email-link">
            Go to login page
          </Link>
        </>
      ) : (
        <>
          <h1 className="verify-email-not-found">Not Found</h1>
        </>
      )}
    </section>
  );
};

export default VerifyEmail;
