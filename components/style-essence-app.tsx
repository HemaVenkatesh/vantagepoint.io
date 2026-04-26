"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Mail,
  Palette,
  User,
  CheckCircle,
  ChevronRight,
  Upload,
  Sparkles,
  Heart,
  Shirt,
  Search,
} from "lucide-react";

interface QuestionOption {
  value: string;
  label: string;
  traits: string[];
}

interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

interface EmailOrders {
  brands?: string[];
  colors?: string[];
  styles?: string[];
  priceRange?: string;
  frequency?: string;
  gaps?: string[];
}

interface ColorAnalysis {
  undertone: string;
  season: string;
  bestColors: string[];
  avoidColors: string[];
  analysis: string;
}

interface RecommendationItem {
  name: string;
  reason: string;
  colors: string[];
}

interface Recommendations {
  items?: RecommendationItem[];
  colorCombos?: { combo: string; occasion: string }[];
  styleTips?: string[];
  brands?: string[];
}

interface Profile {
  personality: string[];
  emailOrders: EmailOrders | null;
  facePhoto: string | null;
  colorAnalysis: ColorAnalysis | null;
  recommendations: Recommendations | null;
}

type Step = "welcome" | "questionnaire" | "email" | "photo" | "results";
type EmailMethod = "gmail" | "paste" | null;

const questionnaire: Question[] = [
  {
    id: "social",
    question: "How do you feel in social gatherings?",
    options: [
      { value: "energized", label: "Energized and excited", traits: ["extroverted", "bold"] },
      { value: "comfortable", label: "Comfortable and engaged", traits: ["balanced", "approachable"] },
      { value: "reserved", label: "Reserved but present", traits: ["introverted", "subtle"] },
      { value: "overwhelmed", label: "Prefer smaller groups", traits: ["introverted", "minimalist"] },
    ],
  },
  {
    id: "expression",
    question: "How do you like to express yourself?",
    options: [
      { value: "bold", label: "Bold and eye-catching", traits: ["creative", "confident", "maximalist"] },
      { value: "unique", label: "Unique but tasteful", traits: ["artistic", "individual"] },
      { value: "classic", label: "Classic and timeless", traits: ["traditional", "elegant"] },
      { value: "understated", label: "Understated and refined", traits: ["minimalist", "sophisticated"] },
    ],
  },
  {
    id: "comfort",
    question: "What matters most in your clothing?",
    options: [
      { value: "statement", label: "Making a statement", traits: ["expressive", "trendy"] },
      { value: "quality", label: "Quality and craftsmanship", traits: ["discerning", "investment"] },
      { value: "comfort", label: "Comfort above all", traits: ["practical", "relaxed"] },
      { value: "versatility", label: "Versatility and mix-match", traits: ["strategic", "efficient"] },
    ],
  },
  {
    id: "shopping",
    question: "How do you approach shopping?",
    options: [
      { value: "impulse", label: "I buy what catches my eye", traits: ["spontaneous", "trend-driven"] },
      { value: "curated", label: "I carefully curate each piece", traits: ["intentional", "collector"] },
      { value: "planned", label: "I plan purchases strategically", traits: ["organized", "methodical"] },
      { value: "minimal", label: "I buy only what I need", traits: ["minimalist", "conscious"] },
    ],
  },
  {
    id: "confidence",
    question: "When do you feel most confident?",
    options: [
      { value: "standout", label: "When I stand out", traits: ["bold", "unique"] },
      { value: "polished", label: "When I look polished", traits: ["refined", "professional"] },
      { value: "authentic", label: "When I feel authentic", traits: ["genuine", "comfortable"] },
      { value: "prepared", label: "When I'm well-prepared", traits: ["meticulous", "detail-oriented"] },
    ],
  },
];

export function StyleEssenceApp() {
  const [step, setStep] = useState<Step>("welcome");
  const [profile, setProfile] = useState<Profile>({
    personality: [],
    emailOrders: null,
    facePhoto: null,
    colorAnalysis: null,
    recommendations: null,
  });
  const [loading, setLoading] = useState(false);
  const [emailMethod, setEmailMethod] = useState<EmailMethod>(null);
  const [answers, setAnswers] = useState<Record<string, QuestionOption>>({});
  const [emailText, setEmailText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnswer = (questionId: string, option: QuestionOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const analyzePersonality = (): string[] => {
    const traits: Record<string, number> = {};
    Object.values(answers).forEach((answer) => {
      answer.traits.forEach((trait) => {
        traits[trait] = (traits[trait] || 0) + 1;
      });
    });

    return Object.entries(traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trait]) => trait);
  };

  const simulateEmailAnalysis = () => {
    setLoading(true);
    // Simulate API call with demo data
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        emailOrders: {
          brands: ["Zara", "H&M", "Uniqlo", "Nike"],
          colors: ["Navy", "Black", "White", "Beige"],
          styles: ["Casual", "Minimalist", "Athleisure"],
          priceRange: "Mid-range",
          frequency: "Monthly",
          gaps: ["Formal wear", "Statement pieces", "Accessories"],
        },
      }));
      setStep("photo");
      setLoading(false);
    }, 2000);
  };

  const analyzeEmailsPaste = () => {
    setLoading(true);
    // Simulate analysis with demo data
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        emailOrders: {
          brands: ["Zara", "ASOS", "Mango"],
          colors: ["Black", "Navy", "Grey"],
          styles: ["Smart Casual", "Business"],
          priceRange: "Mid-range",
          frequency: "Bi-weekly",
          gaps: ["Casual weekend wear", "Bold colors", "Accessories"],
        },
      }));
      setStep("photo");
      setLoading(false);
    }, 2000);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // Convert to base64 for display
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString().split(",")[1] || "";
      setProfile((prev) => ({ ...prev, facePhoto: base64 }));

      // Simulate color analysis with demo data
      setTimeout(() => {
        const colorAnalysis: ColorAnalysis = {
          undertone: "Warm",
          season: "Autumn",
          bestColors: ["Terracotta", "Olive", "Mustard", "Burgundy", "Cream"],
          avoidColors: ["Bright Pink", "Electric Blue", "Neon colors"],
          analysis:
            "Your warm undertones and rich coloring suggest an Autumn color palette. Earth tones and warm, muted colors will complement your natural coloring beautifully.",
        };

        setProfile((prev) => ({ ...prev, colorAnalysis }));
        setStep("results");
        generateRecommendations(colorAnalysis);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const generateRecommendations = (colorAnalysis: ColorAnalysis) => {
    const personality = analyzePersonality();

    // Simulate recommendations with demo data
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        personality,
        recommendations: {
          items: [
            {
              name: "Cashmere Sweater",
              reason: "A versatile piece that matches your minimalist style",
              colors: ["Camel", "Burgundy"],
            },
            {
              name: "Tailored Blazer",
              reason: "Elevates casual outfits for a polished look",
              colors: ["Olive", "Navy"],
            },
            {
              name: "Leather Accessories",
              reason: "Adds sophistication to your existing wardrobe",
              colors: ["Cognac", "Dark Brown"],
            },
            {
              name: "Statement Scarf",
              reason: "Easy way to incorporate your best colors",
              colors: ["Terracotta", "Mustard"],
            },
            {
              name: "Quality Denim",
              reason: "Foundation piece for your casual wardrobe",
              colors: ["Dark Indigo", "Black"],
            },
          ],
          colorCombos: [
            { combo: "Cream + Burgundy", occasion: "Evening events" },
            { combo: "Olive + Camel", occasion: "Business casual" },
            { combo: "Terracotta + Navy", occasion: "Weekend outings" },
          ],
          styleTips: [
            "Layer different textures to add depth to minimalist outfits",
            "Use accessories in your power colors to elevate neutral basics",
            "Invest in quality basics that can be dressed up or down",
            "Try monochromatic looks in warm earth tones for maximum impact",
          ],
          brands: ["COS", "Arket", "Massimo Dutti", "Everlane"],
        },
      }));
      setLoading(false);
    }, 1500);
  };

  const resetApp = () => {
    setStep("welcome");
    setProfile({
      personality: [],
      emailOrders: null,
      facePhoto: null,
      colorAnalysis: null,
      recommendations: null,
    });
    setAnswers({});
    setEmailText("");
    setEmailMethod(null);
  };

  const steps: Step[] = ["welcome", "questionnaire", "email", "photo", "results"];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      {/* Decorative background elements */}
      <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,155,0.2)_0%,transparent_70%)] blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(189,154,122,0.15)_0%,transparent_70%)] blur-[60px] pointer-events-none" />

      <div className="max-w-[900px] mx-auto px-6 py-15 relative z-10">
        {/* Header */}
        <header className="text-center mb-15">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles size={28} className="text-[#8b6f47]" />
            <h1 className="text-5xl md:text-6xl font-light text-[#2c2417] tracking-wide font-[var(--font-serif)]">
              Style Essence
            </h1>
          </div>
          <p className="text-lg text-[#5c4a3a] font-sans font-light tracking-wider uppercase">
            Your Personal Fashion Intelligence
          </p>
        </header>

        {/* Progress indicator */}
        <div className="flex justify-center gap-3 mb-12">
          {steps.map((s, i) => (
            <div
              key={s}
              className="w-10 h-1 rounded-sm transition-all duration-400"
              style={{
                background: steps.indexOf(step) >= i ? "#8b6f47" : "rgba(139, 111, 71, 0.2)",
              }}
            />
          ))}
        </div>

        {/* Welcome Screen */}
        {step === "welcome" && (
          <div className="animate-fadeIn bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-15 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
            <h2 className="text-3xl md:text-4xl font-light text-[#2c2417] mb-6 text-center font-[var(--font-serif)]">
              Discover Your Perfect Style
            </h2>
            <p className="text-lg text-[#5c4a3a] leading-relaxed mb-10 text-center font-sans">
              We&apos;ll analyze your personality, shopping history, and natural colors to create a
              personalized style profile that enhances your wardrobe.
            </p>

            <div className="grid gap-5 mb-10">
              {[
                { Icon: User, text: "Psychological style profiling", color: "#8b6f47" },
                { Icon: Mail, text: "Automatic Gmail order analysis", color: "#a67c52" },
                { Icon: Camera, text: "Personal color season analysis", color: "#bd9a7a" },
                { Icon: Palette, text: "Curated wardrobe recommendations", color: "#c9a88a" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 bg-white/50 rounded-xl border border-[#8b6f47]/10 transition-all duration-300 hover:bg-white/70"
                >
                  <item.Icon size={24} color={item.color} />
                  <span className="text-base text-[#2c2417] font-sans">{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep("questionnaire")}
              className="w-full p-5 bg-[#8b6f47] text-white border-none rounded-xl text-base font-sans font-medium cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 tracking-wider uppercase hover:bg-[#6d5838]"
            >
              Begin Your Journey
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Questionnaire */}
        {step === "questionnaire" && (
          <div className="animate-fadeIn bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-15 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
            <h2 className="text-3xl font-light text-[#2c2417] mb-3 font-[var(--font-serif)]">
              Understanding Your Style Psychology
            </h2>
            <p className="text-base text-[#5c4a3a] mb-10 font-sans">
              Answer these questions to help us understand your unique style personality
            </p>

            {questionnaire.map((q, qIndex) => (
              <div
                key={q.id}
                className="mb-9 animate-slideIn"
                style={{ animationDelay: `${qIndex * 0.1}s` }}
              >
                <h3 className="text-xl font-normal text-[#2c2417] mb-4 font-[var(--font-serif)]">
                  {qIndex + 1}. {q.question}
                </h3>
                <div className="grid gap-3">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(q.id, option)}
                      className="p-4 px-5 rounded-xl cursor-pointer text-left text-[15px] font-sans text-[#2c2417] transition-all duration-300 flex items-center gap-3"
                      style={{
                        background:
                          answers[q.id]?.value === option.value
                            ? "rgba(139, 111, 71, 0.15)"
                            : "rgba(255, 255, 255, 0.5)",
                        border:
                          answers[q.id]?.value === option.value
                            ? "2px solid #8b6f47"
                            : "1px solid rgba(139, 111, 71, 0.2)",
                      }}
                    >
                      {answers[q.id]?.value === option.value && (
                        <CheckCircle size={18} className="text-[#8b6f47]" />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                if (Object.keys(answers).length === questionnaire.length) {
                  setProfile((prev) => ({ ...prev, personality: analyzePersonality() }));
                  setStep("email");
                } else {
                  alert("Please answer all questions to continue");
                }
              }}
              disabled={Object.keys(answers).length !== questionnaire.length}
              className="w-full p-5 text-white border-none rounded-xl text-base font-sans font-medium transition-all duration-300 tracking-wider uppercase mt-6"
              style={{
                background:
                  Object.keys(answers).length === questionnaire.length ? "#8b6f47" : "#ccc",
                cursor:
                  Object.keys(answers).length === questionnaire.length ? "pointer" : "not-allowed",
              }}
            >
              Continue to Email Analysis
            </button>
          </div>
        )}

        {/* Email Analysis Choice */}
        {step === "email" && !emailMethod && (
          <div className="animate-fadeIn bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-15 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
            <div className="flex items-center gap-3 mb-3">
              <Mail size={28} className="text-[#8b6f47]" />
              <h2 className="text-3xl font-light text-[#2c2417] font-[var(--font-serif)]">
                Wardrobe Analysis
              </h2>
            </div>
            <p className="text-base text-[#5c4a3a] mb-8 font-sans">
              Choose how you&apos;d like to analyze your fashion purchase history
            </p>

            <div className="grid gap-4 mb-6">
              <button
                onClick={() => setEmailMethod("gmail")}
                className="p-6 bg-white/50 border-2 border-[#8b6f47]/20 rounded-xl cursor-pointer text-left transition-all duration-300 hover:bg-[#8b6f47]/10 hover:border-[#8b6f47]"
              >
                <div className="flex items-center gap-4 mb-2">
                  <Search size={24} className="text-[#8b6f47]" />
                  <h3 className="text-xl font-normal text-[#2c2417] font-sans">
                    Auto-Scan Gmail (Recommended)
                  </h3>
                </div>
                <p className="text-sm text-[#5c4a3a] font-sans pl-10">
                  Automatically search your Gmail for fashion order confirmations and analyze your
                  shopping history
                </p>
              </button>

              <button
                onClick={() => setEmailMethod("paste")}
                className="p-6 bg-white/50 border-2 border-[#8b6f47]/20 rounded-xl cursor-pointer text-left transition-all duration-300 hover:bg-[#8b6f47]/10 hover:border-[#8b6f47]"
              >
                <div className="flex items-center gap-4 mb-2">
                  <Mail size={24} className="text-[#8b6f47]" />
                  <h3 className="text-xl font-normal text-[#2c2417] font-sans">Manual Paste</h3>
                </div>
                <p className="text-sm text-[#5c4a3a] font-sans pl-10">
                  Manually copy and paste your order confirmation emails
                </p>
              </button>
            </div>

            <button
              onClick={() => setStep("questionnaire")}
              className="w-full p-5 bg-[#8b6f47]/10 text-[#8b6f47] border-2 border-[#8b6f47] rounded-xl text-base font-sans font-medium cursor-pointer transition-all duration-300 tracking-wider uppercase"
            >
              Back
            </button>
          </div>
        )}

        {/* Gmail Auto-Analysis */}
        {step === "email" && emailMethod === "gmail" && (
          <div className="animate-fadeIn bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-15 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
            <div className="flex items-center gap-3 mb-3">
              <Search size={28} className="text-[#8b6f47]" />
              <h2 className="text-3xl font-light text-[#2c2417] font-[var(--font-serif)]">
                Gmail Auto-Analysis
              </h2>
            </div>
            <p className="text-base text-[#5c4a3a] mb-8 font-sans">
              We&apos;ll search your Gmail for fashion order confirmations and analyze your shopping
              patterns automatically.
            </p>

            <div className="p-6 bg-[#8b6f47]/5 rounded-xl mb-6 border border-[#8b6f47]/15">
              <h4 className="text-base font-medium text-[#2c2417] mb-3 font-sans">
                What we&apos;ll analyze:
              </h4>
              <ul className="m-0 pl-5 text-sm text-[#5c4a3a] font-sans leading-relaxed list-disc">
                <li>Order confirmations from fashion retailers</li>
                <li>Brands you purchase from most often</li>
                <li>Color and style preferences</li>
                <li>Price range patterns</li>
                <li>Shopping frequency</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEmailMethod(null)}
                className="flex-1 p-5 bg-[#8b6f47]/10 text-[#8b6f47] border-2 border-[#8b6f47] rounded-xl text-base font-sans font-medium cursor-pointer transition-all duration-300 tracking-wider uppercase"
              >
                Back
              </button>
              <button
                onClick={simulateEmailAnalysis}
                disabled={loading}
                className="flex-[2] p-5 text-white border-none rounded-xl text-base font-sans font-medium transition-all duration-300 tracking-wider uppercase"
                style={{
                  background: loading ? "#ccc" : "#8b6f47",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Analyzing Gmail..." : "Start Gmail Analysis"}
              </button>
            </div>
          </div>
        )}

        {/* Manual Paste Email Analysis */}
        {step === "email" && emailMethod === "paste" && (
          <div className="animate-fadeIn bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-15 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
            <div className="flex items-center gap-3 mb-3">
              <Mail size={28} className="text-[#8b6f47]" />
              <h2 className="text-3xl font-light text-[#2c2417] font-[var(--font-serif)]">
                Manual Email Analysis
              </h2>
            </div>
            <p className="text-base text-[#5c4a3a] mb-8 font-sans">
              Paste your fashion order confirmation emails below. We&apos;ll analyze your shopping
              patterns, brand preferences, and identify gaps in your wardrobe.
            </p>

            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste your order confirmation emails here... (e.g., from Zara, H&M, ASOS, etc.)"
              className="w-full min-h-[300px] p-5 border-2 border-[#8b6f47]/20 rounded-xl text-[15px] font-sans resize-y mb-6 bg-white/70 text-[#2c2417] focus:outline-none focus:border-[#8b6f47]"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEmailMethod(null)}
                className="flex-1 p-5 bg-[#8b6f47]/10 text-[#8b6f47] border-2 border-[#8b6f47] rounded-xl text-base font-sans font-medium cursor-pointer transition-all duration-300 tracking-wider uppercase"
              >
                Back
              </button>
              <button
                onClick={analyzeEmailsPaste}
                disabled={!emailText.trim() || loading}
                className="flex-[2] p-5 text-white border-none rounded-xl text-base font-sans font-medium transition-all duration-300 tracking-wider uppercase"
                style={{
                  background: emailText.trim() && !loading ? "#8b6f47" : "#ccc",
                  cursor: emailText.trim() && !loading ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Analyzing..." : "Analyze My Wardrobe"}
              </button>
            </div>
          </div>
        )}

        {/* Photo Upload */}
        {step === "photo" && (
          <div className="animate-fadeIn bg-white/60 backdrop-blur-xl rounded-3xl p-12 md:p-15 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
            <div className="flex items-center gap-3 mb-3">
              <Camera size={28} className="text-[#8b6f47]" />
              <h2 className="text-3xl font-light text-[#2c2417] font-[var(--font-serif)]">
                Personal Color Analysis
              </h2>
            </div>
            <p className="text-base text-[#5c4a3a] mb-8 font-sans">
              Upload a clear photo of your face in natural lighting. We&apos;ll determine your
              color season and recommend the most flattering colors for your complexion.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-[#8b6f47]/30 rounded-2xl py-15 px-10 text-center cursor-pointer bg-white/40 transition-all duration-300 mb-6 hover:border-[#8b6f47] hover:bg-[#8b6f47]/5"
            >
              <div className="mb-4 flex justify-center">
                <Upload size={48} className="text-[#8b6f47]" />
              </div>
              <p className="text-lg text-[#2c2417] mb-2 font-sans font-medium">
                Click to upload your photo
              </p>
              <p className="text-sm text-[#5c4a3a] font-sans">
                For best results: face the camera directly in natural daylight
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {loading && (
              <div className="text-center p-5 text-base text-[#8b6f47] font-sans">
                Analyzing your colors...
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {step === "results" && profile.colorAnalysis && (
          <div className="animate-fadeIn">
            {/* Style Personality */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)] mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart size={24} className="text-[#8b6f47]" />
                <h3 className="text-2xl font-light text-[#2c2417] font-[var(--font-serif)]">
                  Your Style Personality
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.personality.map((trait, i) => (
                  <span
                    key={i}
                    className="py-2.5 px-5 bg-[#8b6f47]/12 rounded-full text-sm text-[#2c2417] font-sans capitalize tracking-wider"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Shopping Insights */}
            {profile.emailOrders && profile.emailOrders.brands && (
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)] mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shirt size={24} className="text-[#8b6f47]" />
                  <h3 className="text-2xl font-light text-[#2c2417] font-[var(--font-serif)]">
                    Your Shopping Insights
                  </h3>
                </div>

                <div className="mb-5">
                  <h4 className="text-base font-medium text-[#2c2417] mb-3 font-sans uppercase tracking-wider">
                    Favorite Brands
                  </h4>
                  <div className="flex gap-3 flex-wrap">
                    {profile.emailOrders.brands.map((brand, i) => (
                      <span
                        key={i}
                        className="py-2.5 px-5 bg-[#8b6f47]/12 rounded-full text-sm text-[#2c2417] font-sans"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-base font-medium text-[#2c2417] mb-3 font-sans uppercase tracking-wider">
                    Style Categories
                  </h4>
                  <div className="flex gap-3 flex-wrap">
                    {profile.emailOrders.styles?.map((style, i) => (
                      <span
                        key={i}
                        className="py-2.5 px-5 bg-[#8b6f47]/12 rounded-full text-sm text-[#2c2417] font-sans capitalize"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {profile.emailOrders.gaps && (
                  <div>
                    <h4 className="text-base font-medium text-[#2c2417] mb-3 font-sans uppercase tracking-wider">
                      Wardrobe Gaps
                    </h4>
                    <ul className="m-0 pl-5 text-sm text-[#5c4a3a] font-sans leading-relaxed list-disc">
                      {profile.emailOrders.gaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Color Season */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)] mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette size={24} className="text-[#8b6f47]" />
                <h3 className="text-2xl font-light text-[#2c2417] font-[var(--font-serif)]">
                  Your Color Season: {profile.colorAnalysis.season}
                </h3>
              </div>
              <p className="text-[15px] text-[#5c4a3a] mb-6 font-sans leading-relaxed">
                {profile.colorAnalysis.analysis}
              </p>

              <div className="mb-6">
                <h4 className="text-base font-medium text-[#2c2417] mb-3 font-sans uppercase tracking-wider">
                  Your Best Colors
                </h4>
                <div className="flex gap-3 flex-wrap">
                  {profile.colorAnalysis.bestColors.map((color, i) => (
                    <span
                      key={i}
                      className="py-2.5 px-5 bg-[#8b6f47]/12 rounded-full text-sm text-[#2c2417] font-sans capitalize"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium text-[#2c2417] mb-3 font-sans uppercase tracking-wider">
                  Colors to Minimize
                </h4>
                <div className="flex gap-3 flex-wrap">
                  {profile.colorAnalysis.avoidColors.map((color, i) => (
                    <span
                      key={i}
                      className="py-2.5 px-5 bg-[#8b6f47]/6 rounded-full text-sm text-[#5c4a3a] font-sans capitalize line-through"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {profile.recommendations && (
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-[#8b6f47]/10 shadow-[0_20px_60px_rgba(44,36,23,0.08)]">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles size={24} className="text-[#8b6f47]" />
                  <h3 className="text-2xl font-light text-[#2c2417] font-[var(--font-serif)]">
                    Personalized Recommendations
                  </h3>
                </div>

                {profile.recommendations.items && (
                  <div className="mb-8">
                    <h4 className="text-lg font-normal text-[#2c2417] mb-4 font-[var(--font-serif)]">
                      Items to Complete Your Wardrobe
                    </h4>
                    <div className="grid gap-4">
                      {profile.recommendations.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-5 bg-white/50 rounded-xl border border-[#8b6f47]/10"
                        >
                          <h5 className="text-base font-medium text-[#2c2417] mb-2 font-sans">
                            {item.name}
                          </h5>
                          <p className="text-sm text-[#5c4a3a] mb-2 font-sans">{item.reason}</p>
                          <div className="flex gap-2 flex-wrap">
                            {item.colors.map((color, ci) => (
                              <span
                                key={ci}
                                className="py-1.5 px-3.5 bg-[#8b6f47]/10 rounded-xl text-xs text-[#2c2417] font-sans"
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.recommendations.styleTips && (
                  <div className="mb-8">
                    <h4 className="text-lg font-normal text-[#2c2417] mb-4 font-[var(--font-serif)]">
                      Style Tips for You
                    </h4>
                    <ul className="list-none p-0 m-0 grid gap-3">
                      {profile.recommendations.styleTips.map((tip, i) => (
                        <li
                          key={i}
                          className="p-4 pl-11 bg-white/50 rounded-xl text-sm text-[#2c2417] font-sans leading-relaxed relative"
                        >
                          <span className="absolute left-4 top-4 text-[#8b6f47]">&#10022;</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={resetApp}
              className="w-full p-5 bg-[#8b6f47]/10 text-[#8b6f47] border-2 border-[#8b6f47] rounded-xl text-base font-sans font-medium cursor-pointer transition-all duration-300 tracking-wider uppercase mt-6 hover:bg-[#8b6f47]/20"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
