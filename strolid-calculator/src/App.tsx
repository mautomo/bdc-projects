import React, { useState, useMemo } from 'react';

// Types
interface FormData {
  calls: number;
  answerRate: number;
  convRate: number;
  gp: number;
}

interface LeadData {
  email: string;
  firstName: string;
  rooftopCount: string;
  crm: string;
  sendPdf: boolean;
}

const App: React.FC = () => {
  // Built-in calculation functions (no external imports needed)
  const calcMissed = (calls: number, answerRate: number): number => {
    return Math.round(calls * (1 - answerRate / 100));
  };

  const calcLostRevenue = (missed: number, convRate: number, gp: number): number => {
    return Math.round(missed * (convRate / 100) * gp);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateComparison = (calls: number, currentAnswerRate: number, convRate: number, gp: number) => {
    const currentRevenue = calls * (currentAnswerRate / 100) * (convRate / 100) * gp;
    const strolidRevenue = calls * 0.95 * (convRate / 100) * gp; // 95% answer rate
    const delta = strolidRevenue - currentRevenue;
    const deltaPercentage = ((delta / currentRevenue) * 100);

    return {
      current: Math.round(currentRevenue),
      withStrolid: Math.round(strolidRevenue),
      delta: Math.round(delta),
      deltaPercentage: Math.round(deltaPercentage * 10) / 10, // Round to 1 decimal
    };
  };

  const [formData, setFormData] = useState<FormData>({
    calls: 1200,
    answerRate: 65,
    convRate: 28,
    gp: 375,
  });

  const [leadData, setLeadData] = useState<LeadData>({
    email: '',
    firstName: '',
    rooftopCount: '',
    crm: '',
    sendPdf: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Calculations
  const metrics = useMemo(() => {
    const missed = calcMissed(formData.calls, formData.answerRate);
    const lostRevenue = calcLostRevenue(missed, formData.convRate, formData.gp);
    const comparison = calculateComparison(
      formData.calls,
      formData.answerRate,
      formData.convRate,
      formData.gp
    );

    return {
      missed,
      lostRevenue,
      comparison,
      showLeadCapture: lostRevenue >= 25000,
    };
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...leadData,
        calculatorData: {
          ...formData,
          missedCalls: metrics.missed,
          lostRevenue: metrics.lostRevenue,
          potentialGain: metrics.comparison.delta,
        },
        timestamp: new Date().toISOString(),
      };

      console.log('Lead captured:', payload); // For testing

      // Simulate successful submission for demo
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setLeadData({
          email: '',
          firstName: '',
          rooftopCount: '',
          crm: '',
          sendPdf: false,
        });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 900,
      color: '#061635',
      letterSpacing: '-0.025em',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: 900,
      color: '#243b53',
      textTransform: 'uppercase' as const,
      letterSpacing: '-0.025em',
      margin: '8px 0',
    },
    ctaButton: {
      background: 'linear-gradient(135deg, #103c5a 0%, #1cbede 100%)',
      color: 'white',
      fontWeight: 900,
      padding: '12px 24px',
      borderRadius: '25px',
      fontSize: '14px',
      textTransform: 'uppercase' as const,
      letterSpacing: '-0.025em',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
    },
    main: {
      maxWidth: '768px',
      margin: '0 auto',
      padding: '48px 16px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      marginBottom: '32px',
    },
    cardTitle: {
      fontSize: '28px',
      fontWeight: 900,
      color: '#061635',
      textTransform: 'uppercase' as const,
      letterSpacing: '-0.025em',
      marginBottom: '32px',
      textAlign: 'center' as const,
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '16px',
      transition: 'border-color 0.2s',
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    slider: {
      width: '100%',
      height: '8px',
      borderRadius: '4px',
      background: '#e5e7eb',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as const,
    },
    sliderLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px',
    },
    resultsCard: {
      background: 'linear-gradient(to right, #f0f4f8, #e0f2fe)',
      borderRadius: '16px',
      padding: '32px',
    },
    resultsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    resultItem: {
      textAlign: 'center' as const,
    },
    resultNumber: {
      fontSize: '36px',
      fontWeight: 900,
      color: '#dc2626',
      marginBottom: '8px',
    },
    resultLabel: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
    },
    comparisonCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
    },
    comparisonTitle: {
      fontSize: '20px',
      fontWeight: 900,
      color: '#061635',
      textAlign: 'center' as const,
      marginBottom: '24px',
      letterSpacing: '-0.025em',
    },
    comparisonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      textAlign: 'center' as const,
    },
    comparisonItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    comparisonLabel: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    comparisonValue: {
      fontSize: '22px',
      fontWeight: 900,
      marginBottom: '4px',
    },
    comparisonPercentage: {
      fontSize: '14px',
    },
    leadCaptureTitle: {
      fontSize: '24px',
      fontWeight: 900,
      color: '#061635',
      textTransform: 'uppercase' as const,
      letterSpacing: '-0.025em',
      marginBottom: '8px',
    },
    leadCaptureSubtitle: {
      color: '#6b7280',
      marginBottom: '24px',
      fontSize: '16px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box' as const,
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    checkboxInput: {
      width: '20px',
      height: '20px',
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #103c5a 0%, #1cbede 100%)',
      color: 'white',
      fontWeight: 900,
      padding: '16px',
      borderRadius: '25px',
      fontSize: '18px',
      textTransform: 'uppercase' as const,
      letterSpacing: '-0.025em',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
    },
    successMessage: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center' as const,
    },
    footer: {
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      marginTop: '64px',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px',
      textAlign: 'center' as const,
    },
    footerText: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '16px',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      fontSize: '12px',
      color: '#9ca3af',
      flexWrap: 'wrap' as const,
    },
    footerLink: {
      color: '#9ca3af',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <div style={styles.logo}>
            <span style={styles.logoText}>🏢 STROLID</span>
          </div>

          {/* Title */}
          <h1 style={styles.headerTitle}>
            Missed-Revenue Calculator
          </h1>

          {/* CTA Button */}
          <button style={styles.ctaButton}>
            Talk to a BDC Strategist
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Calculator Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Calculate Your Missed Revenue
          </h2>

          {/* Input Section */}
          <div style={styles.inputGrid}>
            {/* Monthly Calls */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Monthly Inbound Calls
              </label>
              <input
                type="number"
                value={formData.calls}
                onChange={(e) => handleInputChange('calls', parseInt(e.target.value) || 0)}
                style={styles.input}
                min="0"
              />
            </div>

            {/* Answer Rate */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Current Answer Rate: {formData.answerRate}%
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={formData.answerRate}
                onChange={(e) => handleInputChange('answerRate', parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>40%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Conversion Rate */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Close/RO Conversion: {formData.convRate}%
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={formData.convRate}
                onChange={(e) => handleInputChange('convRate', parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Average Gross Profit */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Avg Gross Per Sale/RO ($)
              </label>
              <input
                type="number"
                value={formData.gp}
                onChange={(e) => handleInputChange('gp', parseInt(e.target.value) || 0)}
                style={styles.input}
                min="0"
                placeholder="375"
              />
            </div>
          </div>

          {/* Results Section */}
          <div style={styles.resultsCard}>
            <div style={styles.resultsGrid}>
              <div style={styles.resultItem}>
                <div style={styles.resultNumber}>
                  {formatNumber(metrics.missed)}
                </div>
                <div style={styles.resultLabel}>
                  Missed Calls Monthly
                </div>
              </div>

              <div style={styles.resultItem}>
                <div style={styles.resultNumber}>
                  {formatCurrency(metrics.lostRevenue)}
                </div>
                <div style={styles.resultLabel}>
                  Estimated Lost Revenue
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div style={styles.comparisonCard}>
              <h3 style={styles.comparisonTitle}>
                REVENUE COMPARISON
              </h3>
              <div style={styles.comparisonGrid}>
                <div style={styles.comparisonItem}>
                  <div style={{...styles.comparisonLabel, color: '#6b7280'}}>Current</div>
                  <div style={{...styles.comparisonValue, color: '#dc2626'}}>
                    {formatCurrency(metrics.comparison.current)}
                  </div>
                </div>
                <div style={styles.comparisonItem}>
                  <div style={{...styles.comparisonLabel, color: '#1cbede'}}>With Strolid</div>
                  <div style={{...styles.comparisonValue, color: '#1cbede'}}>
                    {formatCurrency(metrics.comparison.withStrolid)}
                  </div>
                </div>
                <div style={styles.comparisonItem}>
                  <div style={{...styles.comparisonLabel, color: '#16a34a'}}>Gain</div>
                  <div style={{...styles.comparisonValue, color: '#16a34a'}}>
                    +{formatCurrency(metrics.comparison.delta)}
                  </div>
                  <div style={{...styles.comparisonPercentage, color: '#16a34a'}}>
                    (+{metrics.comparison.deltaPercentage}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Capture Card - Only show if lost revenue >= $25,000 */}
        {metrics.showLeadCapture && (
          <div style={styles.card}>
            <h2 style={styles.leadCaptureTitle}>
              Get Your Full Revenue Recovery Plan
            </h2>
            <p style={styles.leadCaptureSubtitle}>
              You're missing out on significant revenue! Let us show you exactly how to recover it.
            </p>

            {submitSuccess ? (
              <div style={styles.successMessage}>
                <div style={{fontSize: '32px', marginBottom: '12px'}}>✅</div>
                <div style={{fontSize: '20px', fontWeight: 600, color: '#15803d', marginBottom: '8px'}}>Thank you!</div>
                <div style={{color: '#16a34a', fontSize: '16px'}}>We'll be in touch with your custom revenue recovery plan.</div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <input
                    type="email"
                    placeholder="Email Address*"
                    value={leadData.email}
                    onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="First Name*"
                    value={leadData.firstName}
                    onChange={(e) => setLeadData(prev => ({ ...prev, firstName: e.target.value }))}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Number of Rooftops"
                    value={leadData.rooftopCount}
                    onChange={(e) => setLeadData(prev => ({ ...prev, rooftopCount: e.target.value }))}
                    style={styles.input}
                  />
                  <select
                    value={leadData.crm}
                    onChange={(e) => setLeadData(prev => ({ ...prev, crm: e.target.value }))}
                    style={styles.select}
                  >
                    <option value="">Select Your CRM</option>
                    <option value="dealertrack">DealerTrack</option>
                    <option value="reynolds">Reynolds & Reynolds</option>
                    <option value="cdk">CDK Global</option>
                    <option value="automate">Automate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={leadData.sendPdf}
                    onChange={(e) => setLeadData(prev => ({ ...prev, sendPdf: e.target.checked }))}
                    style={styles.checkboxInput}
                  />
                  <span style={{fontSize: '16px', color: '#374151'}}>
                    Send me the full PDF breakdown
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    ...styles.submitButton,
                    opacity: isSubmitting ? 0.5 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Get My Revenue Recovery Plan'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            Estimates are directional; your ROI may vary based on market conditions and implementation.
          </p>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>Terms of Service</a>
            <span>© 2025 Strolid, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;