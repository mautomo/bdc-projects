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
  // Built-in calculation functions
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

      console.log('Lead captured:', payload);

      // Simulate successful submission
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-2xl font-black text-brand-navy tracking-tight">STROLID</span>
            </div>

            {/* Title */}
            <h1 className="text-lg font-black text-gray-700 tracking-tight uppercase hidden sm:block">
              Missed-Revenue Calculator
            </h1>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-navy hover:to-brand-blue text-white font-black px-6 py-3 rounded-full text-sm tracking-tight uppercase transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Talk to a BDC Strategist
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase mb-2">
                Calculate Your Missed Revenue
              </h2>
              <p className="text-gray-600">Discover how much revenue you're losing from unanswered calls</p>
            </div>

            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Monthly Calls */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Monthly Inbound Calls
                </label>
                <input
                  type="number"
                  value={formData.calls}
                  onChange={(e) => handleInputChange('calls', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-cyan focus:outline-none transition-colors text-lg font-medium"
                  min="0"
                />
              </div>

              {/* Average Gross Profit */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Avg Gross Per Sale/RO ($)
                </label>
                <input
                  type="number"
                  value={formData.gp}
                  onChange={(e) => handleInputChange('gp', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-cyan focus:outline-none transition-colors text-lg font-medium"
                  min="0"
                  placeholder="375"
                />
              </div>

              {/* Answer Rate Slider */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Answer Rate: <span className="text-brand-cyan font-black text-lg">{formData.answerRate}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={formData.answerRate}
                  onChange={(e) => handleInputChange('answerRate', parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>40%</span>
                  <span>70%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Conversion Rate Slider */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Close/RO Conversion: <span className="text-brand-cyan font-black text-lg">{formData.convRate}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={formData.convRate}
                  onChange={(e) => handleInputChange('convRate', parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>5%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
              {/* Key Metrics */}
              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
                  <div className="text-4xl font-black text-red-600 mb-2">
                    {formatNumber(metrics.missed)}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Missed Calls Monthly
                  </div>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
                  <div className="text-4xl font-black text-red-600 mb-2">
                    {formatCurrency(metrics.lostRevenue)}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Estimated Lost Revenue
                  </div>
                </div>
              </div>

              {/* Revenue Comparison Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-brand-navy text-center mb-6 uppercase tracking-tight">
                  Monthly Revenue Comparison
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Revenue */}
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-sm font-bold text-red-700 mb-2 uppercase">Current</div>
                    <div className="text-2xl font-black text-red-600 mb-1">
                      {formatCurrency(metrics.comparison.current)}
                    </div>
                    <div className="text-xs text-red-600 font-medium">Your current revenue</div>
                  </div>

                  {/* With Strolid */}
                  <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="text-sm font-bold text-cyan-700 mb-2 uppercase">With Strolid</div>
                    <div className="text-2xl font-black text-cyan-600 mb-1">
                      {formatCurrency(metrics.comparison.withStrolid)}
                    </div>
                    <div className="text-xs text-cyan-600 font-medium">95% answer rate</div>
                  </div>

                  {/* Revenue Gain */}
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-bold text-green-700 mb-2 uppercase">Monthly Gain</div>
                    <div className="text-2xl font-black text-green-600 mb-1">
                      +{formatCurrency(metrics.comparison.delta)}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      +{metrics.comparison.deltaPercentage}% increase
                    </div>
                  </div>
                </div>

                {/* Annual Projection */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-700 mb-1 uppercase">Annual Revenue Potential</div>
                    <div className="text-3xl font-black text-green-600">
                      +{formatCurrency(metrics.comparison.delta * 12)}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Additional revenue per year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Capture Card - Only show if lost revenue >= $25,000 */}
          {metrics.showLeadCapture && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-brand-navy tracking-tight uppercase mb-3">
                  Get Your Full Revenue Recovery Plan
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  You're missing out on <span className="font-black text-red-600">{formatCurrency(metrics.lostRevenue)}</span> monthly! 
                  Let us show you exactly how to recover it with a customized strategy.
                </p>
              </div>

              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-2xl font-black text-green-800 mb-2">Thank You!</div>
                  <div className="text-green-700 text-lg">We'll be in touch with your custom revenue recovery plan within 24 hours.</div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address*</label>
                      <input
                        type="email"
                        value={leadData.email}
                        onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-cyan focus:outline-none transition-colors"
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name*</label>
                      <input
                        type="text"
                        value={leadData.firstName}
                        onChange={(e) => setLeadData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-cyan focus:outline-none transition-colors"
                        required
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Rooftops</label>
                      <input
                        type="text"
                        value={leadData.rooftopCount}
                        onChange={(e) => setLeadData(prev => ({ ...prev, rooftopCount: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-cyan focus:outline-none transition-colors"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Primary CRM</label>
                      <select
                        value={leadData.crm}
                        onChange={(e) => setLeadData(prev => ({ ...prev, crm: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-cyan focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select Your CRM</option>
                        <option value="dealertrack">DealerTrack</option>
                        <option value="reynolds">Reynolds & Reynolds</option>
                        <option value="cdk">CDK Global</option>
                        <option value="automate">Automate</option>
                        <option value="other">Other/Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sendPdf"
                      checked={leadData.sendPdf}
                      onChange={(e) => setLeadData(prev => ({ ...prev, sendPdf: e.target.checked }))}
                      className="w-5 h-5 text-brand-cyan rounded focus:ring-brand-cyan focus:ring-2"
                    />
                    <label htmlFor="sendPdf" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Send me the detailed PDF revenue recovery breakdown
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-navy hover:to-brand-blue text-white font-black py-4 px-8 rounded-full text-lg tracking-tight uppercase transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Get My Revenue Recovery Plan'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. Your information will only be used to provide your custom revenue analysis.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto">
              Revenue estimates are directional and based on industry averages. Actual results may vary based on market conditions, 
              implementation effectiveness, and current operational efficiency.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-500 flex-wrap">
              <a href="#" className="hover:text-brand-cyan transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-cyan transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-cyan transition-colors">Contact Us</a>
              <span>© 2025 Strolid, Inc. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

    
    </div>
  );
};

export default App;