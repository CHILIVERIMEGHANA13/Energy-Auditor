import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <h1 className={styles.title}>Power Up Your Energy Audit</h1>
      <p className={styles.subtitle}>
        Accurate energy auditing and certification made easy. Track your energy
        use, save costs, and go green.
      </p>
      <Link to="/signup" className={styles.ctaButton}>
        Get Started
      </Link>
      <br></br>
      <Link to="/login" className={styles.ctaButton}>
        Login
      </Link>
      

      {/* Features Section */}
      <div className={styles.features}>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Professional & reliable energy audit reports</li>
          <li>Easy certification process with blockchain verification</li>
          <li>Real-time monitoring & data-driven insights</li>
          <li>User-friendly dashboard & mobile support</li>
        </ul>
      </div>

      {/* About Us Section */}
      <section className={styles.aboutSection}>
        <h2>Our Mission</h2>
        <p>
          We're revolutionizing energy audits with smart tech, accurate insights,
          and blockchain-backed certifications. Sustainable, secure, and seamless.
        </p>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2>How It Works</h2>
        <ol>
          <li>Upload your energy usage data</li>
          <li>Receive detailed audit and analysis</li>
          <li>Get certified using blockchain verification</li>
          <li>Access your dashboard and download certificates</li>
        </ol>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What People Are Saying</h2>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <p>"Super easy to use. Got certified in minutes!"</p>
            <span>— Eco Joe</span>
          </div>
          <div className={styles.testimonialCard}>
            <p>"Love the blockchain integration. It’s secure AF."</p>
            <span>— Energy Queen</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <h2>FAQs</h2>
        <ul>
          <li><strong>What is an energy audit?</strong> It's a breakdown of your energy consumption to help save money and reduce waste.</li>
          <li><strong>How long does certification take?</strong> Minutes, thanks to automation + blockchain.</li>
          <li><strong>Is it free?</strong> Basic audits are. Premium includes detailed reports + blockchain certs.</li>
          <li><strong>Is my data safe?</strong> Absolutely. We use encryption and blockchain for security.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 EnergyCertify. All rights reserved.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
