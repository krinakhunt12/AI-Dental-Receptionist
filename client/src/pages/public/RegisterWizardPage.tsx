import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Stepper, StepItem } from '../../components/ui/Stepper';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PLANS } from '../../config/plans';
import { useAuth } from '../../app/AuthProvider';
import { useTenant } from '../../app/TenantProvider';
import { useUIStore } from '../../store/useUIStore';
import {
  Building2,
  UserCheck,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// Zod Validation Schemas
const step1Schema = z.object({
  clinicName: z.string().min(2, 'Clinic name is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  doctorsCount: z.string(),
  website: z.string().optional(),
});

const step2Schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: 'Clinic Details', subtitle: 'Practice info' },
  { id: 2, title: 'Admin Account', subtitle: 'Your credentials' },
  { id: 3, title: 'Select Plan', subtitle: 'Choose tier' },
  { id: 4, title: 'Trial or Payment', subtitle: 'Instant access' },
];

export const RegisterWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { updatePlan } = useTenant();
  const { addToast } = useUIStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Form State initialized from localStorage draft if available
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('smilecare_registration_draft');
    return saved
      ? JSON.parse(saved)
      : {
          clinicName: 'SmileCare Dental',
          city: 'San Francisco',
          phone: '+1 (555) 987-6543',
          doctorsCount: '3-5 Doctors',
          website: 'https://smilecaredental.com',
          fullName: 'Dr. Krina Mehta',
          email: 'krina@smilecare.ai',
          password: 'password123',
          selectedPlanId: 'GROWTH' as 'STARTER' | 'GROWTH' | 'ENTERPRISE',
          paymentOption: 'TRIAL' as 'TRIAL' | 'CARD' | 'UPI',
        };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('smilecare_registration_draft', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Password strength score (0-4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9!@#$%^&*]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(formData.password);

  const handleNext = () => {
    if (currentStep === 1) {
      const res = step1Schema.safeParse(formData);
      if (!res.success) {
        const fieldErrors: Record<string, string> = {};
        res.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    } else if (currentStep === 2) {
      const res = step2Schema.safeParse(formData);
      if (!res.success) {
        const fieldErrors: Record<string, string> = {};
        res.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleComplete = async () => {
    updatePlan(formData.selectedPlanId);
    await login(formData.email, 'OWNER');
    localStorage.removeItem('smilecare_registration_draft');
    addToast({
      type: 'success',
      title: 'Registration Complete!',
      message: 'Welcome to SmileCare AI. Please verify your email to get started.',
    });
    navigate('/verify-email');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Create Your <span className="gradient-text-teal">SmileCare AI</span> Clinic
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Setup your 24/7 AI Receptionist in less than 3 minutes. No credit card required for 14-day trial.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-xl mb-8">
        <Stepper steps={WIZARD_STEPS} currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />
      </div>

      {/* Wizard Form Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
        {/* STEP 1: CLINIC DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                Step 1: Dental Clinic Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your practice so your AI receptionist can tailor responses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Clinic Name"
                placeholder="e.g. SmileCare Dental Studio"
                value={formData.clinicName}
                onChange={(e) => handleChange('clinicName', e.target.value)}
                error={errors.clinicName}
              />
              <Input
                label="City / Location"
                placeholder="e.g. San Francisco, CA"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                error={errors.city}
              />
              <Input
                label="Clinic Phone Number"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
              />
              <Select
                label="Number of Doctors"
                value={formData.doctorsCount}
                onChange={(e) => handleChange('doctorsCount', e.target.value)}
                options={[
                  { value: '1 Doctor', label: '1 Solo Practitioner' },
                  { value: '2-5 Doctors', label: '2 - 5 Doctors' },
                  { value: '6-15 Doctors', label: '6 - 15 Doctors' },
                  { value: '15+ Doctors', label: '15+ DSO Multi-Location' },
                ]}
              />
              <div className="md:col-span-2">
                <Input
                  label="Clinic Website (Optional)"
                  placeholder="https://yourclinic.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ADMIN ACCOUNT */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-400" />
                Step 2: Practice Owner / Admin Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                This account will hold Owner permissions for managing staff, AI, and billing.
              </p>
            </div>

            <div className="space-y-4 max-w-xl">
              <Input
                label="Full Name"
                placeholder="e.g. Dr. Krina Mehta"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                error={errors.fullName}
              />
              <Input
                type="email"
                label="Work Email Address"
                placeholder="krina@smilecare.ai"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />
              <div>
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  error={errors.password}
                />
                {/* Password Strength Meter */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Password Strength:</span>
                    <span
                      className={`font-bold ${
                        passwordScore <= 1
                          ? 'text-rose-400'
                          : passwordScore === 2
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {passwordScore <= 1 ? 'Weak' : passwordScore === 2 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full">
                    <div
                      className={`flex-1 rounded-full ${
                        passwordScore >= 1 ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full ${
                        passwordScore >= 2 ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full ${
                        passwordScore >= 3 ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full ${
                        passwordScore >= 4 ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE PLAN */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  Step 3: Select Your SmileCare Plan
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  All plans include a 14-day free trial. Switch or cancel anytime.
                </p>
              </div>

              {/* Monthly / Yearly Toggle */}
              <div className="inline-flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    billingCycle === 'monthly' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                    billingCycle === 'yearly' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  <span>Yearly</span>
                  <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 text-[10px] font-extrabold rounded-full">
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.keys(PLANS) as ('STARTER' | 'GROWTH' | 'ENTERPRISE')[]).map((planKey) => {
                const plan = PLANS[planKey];
                const isSelected = formData.selectedPlanId === planKey;
                const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

                return (
                  <div
                    key={planKey}
                    onClick={() => handleChange('selectedPlanId', planKey)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-950/30 border-teal-400 ring-2 ring-teal-500/40 shadow-xl scale-[1.02]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950">
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{plan.description}</p>

                      <div className="my-4">
                        <span className="text-3xl font-extrabold text-white">${price}</span>
                        <span className="text-xs text-slate-400">/month</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <Button
                        size="sm"
                        variant={isSelected ? 'primary' : 'outline'}
                        className="w-full justify-center"
                      >
                        {isSelected ? 'Selected Plan' : 'Select Plan'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: TRIAL OR PAYMENT MOCK */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-400" />
                Step 4: Activate Trial or Checkout
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Selected Plan: <strong>{PLANS[formData.selectedPlanId].name}</strong> (${PLANS[formData.selectedPlanId].priceMonthly}/mo)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: 14-Day Free Trial */}
              <div
                onClick={() => handleChange('paymentOption', 'TRIAL')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentOption === 'TRIAL'
                    ? 'bg-teal-950/40 border-teal-400 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="teal" icon={<Zap className="w-3.5 h-3.5" />}>
                    NO CARD REQUIRED
                  </Badge>
                  {formData.paymentOption === 'TRIAL' && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                </div>
                <h3 className="text-base font-bold text-white">Start 14-Day Free Trial</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Immediate full access to all features. Your card will not be charged today.
                </p>
              </div>

              {/* Option 2: Mock Instant Payment */}
              <div
                onClick={() => handleChange('paymentOption', 'CARD')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentOption === 'CARD'
                    ? 'bg-teal-950/40 border-teal-400 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                    STRIPE / RAZORPAY MOCK
                  </Badge>
                  {formData.paymentOption === 'CARD' && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                </div>
                <h3 className="text-base font-bold text-white">Subscribe & Pay Now</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Instantly activate paid subscription with priority onboarding call.
                </p>
              </div>
            </div>

            {formData.paymentOption === 'CARD' && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 max-w-md animate-fade-in">
                <Input label="Card Number" placeholder="4242 •••• •••• 4242" defaultValue="4242424242424242" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Expiry Date" placeholder="MM/YY" defaultValue="12/28" />
                  <Input label="CVC / CVV" placeholder="123" defaultValue="888" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Navigation Footer Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            icon={ArrowLeft}
            className="text-slate-300"
          >
            Back
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} icon={ArrowRight} iconPosition="right">
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              icon={Sparkles}
              size="lg"
              className="bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 font-bold shadow-xl shadow-teal-500/25"
            >
              Complete Registration & Verify Email
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
