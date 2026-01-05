import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  PlusCircle,
  Users,
  ShoppingBag,
  User,
  Camera,
  Upload,
  Sparkles,
  Heart,
  Share2,
  Download,
  RefreshCw,
  X,
  Shield,
  ChevronRight,
  Star,
  MessageCircle,
  AlertTriangle,
  Lock,
  Check,
  MoreHorizontal,
  Coins,
} from "lucide-react";

// --- MOCK DATA & ASSETS ---
const MOCK_BABIES = [
  "https://storage.googleapis.com/msgsndr/TLr0awMT4Tn1nnvVwFyl/media/695c2e46d1950ece40ebac4e.jpg",
  "https://storage.googleapis.com/msgsndr/TLr0awMT4Tn1nnvVwFyl/media/695c2e254a70ef1daeafe1fb.jpg",
  "https://storage.googleapis.com/msgsndr/TLr0awMT4Tn1nnvVwFyl/media/695c2e7e28cd461f68a19861.jpg",
  "https://storage.googleapis.com/msgsndr/TLr0awMT4Tn1nnvVwFyl/media/695c2ed5ca807cfa9c50cca5.jpg",
];

const MOCK_GROUPS = [
  { id: 1, name: "Cute Overload", members: "12.4k", active: true },
  { id: 2, name: "Future Celebs", members: "8.2k", active: false },
  { id: 3, name: "Siblings Lookalike", members: "4.1k", active: false },
];

const PARENT_AVATARS = [
  "https://storage.googleapis.com/msgsndr/TLr0awMT4Tn1nnvVwFyl/media/695c302cca807c744e510525.jpg", // Female
  "https://storage.googleapis.com/msgsndr/TLr0awMT4Tn1nnvVwFyl/media/695c300a1e393b5c8d8673a6.jpg", // Male
];

// --- COMPONENTS ---

export default function App() {
  // --- STATE ---
  const [view, setView] = useState("onboarding"); // onboarding, main, generation
  const [activeTab, setActiveTab] = useState("home");
  const [coins, setCoins] = useState(50);
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState(null); // 'store', 'report', 'save_limit'

  // Generation State
  const [genStep, setGenStep] = useState(0); // 0: Start, 1: Parent A, 2: Parent B, 3: Processing, 4: Result
  const [parentA, setParentA] = useState(null);
  const [parentB, setParentB] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isWatermarkRemoved, setIsWatermarkRemoved] = useState(false);

  // Social State
  const [ratingsCount, setRatingsCount] = useState(0);

  // --- ACTIONS ---
  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuyCoins = (amount, cost) => {
    // Simulate payment
    setTimeout(() => {
      setCoins((c) => c + amount);
      setModal(null);
      showToast(`Purchase successful! +${amount} coins`, "success");
    }, 1000);
  };

  const spendCoins = (amount) => {
    if (coins >= amount) {
      setCoins((c) => c - amount);
      return true;
    } else {
      setModal("store");
      return false;
    }
  };

  // --- VIEWS ---

  if (view === "onboarding") {
    return <Onboarding onComplete={() => setView("main")} />;
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans text-gray-900">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white shadow-2xl min-h-screen relative overflow-hidden flex flex-col">
        {/* Header (Dynamic) */}
        {activeTab !== "generate" && (
          <header className="px-4 py-3 flex justify-between items-center bg-white border-b sticky top-0 z-20">
            <div className="font-bold text-xl text-purple-600 tracking-tight flex items-center gap-1">
              <Sparkles size={20} /> BabyGen
            </div>
            <div
              onClick={() => setModal("store")}
              className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 font-bold text-sm cursor-pointer hover:bg-yellow-200 transition"
            >
              <Coins size={14} className="fill-yellow-500 text-yellow-600" />
              {coins}
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {activeTab === "home" && (
            <HomeView
              onGenerate={() => setActiveTab("generate")}
              onGroupClick={() => setActiveTab("groups")}
            />
          )}

          {activeTab === "generate" && (
            <GenerateFlow
              step={genStep}
              setStep={setGenStep}
              parentA={parentA}
              setParentA={setParentA}
              parentB={parentB}
              setParentB={setParentB}
              result={generatedResult}
              setResult={setGeneratedResult}
              isWatermarkRemoved={isWatermarkRemoved}
              setWatermarkRemoved={setIsWatermarkRemoved}
              onClose={() => {
                setActiveTab("home");
                setGenStep(0);
                setParentA(null);
                setParentB(null);
                setIsWatermarkRemoved(false);
              }}
              spendCoins={spendCoins}
              showToast={showToast}
            />
          )}

          {activeTab === "groups" && (
            <GroupsView
              ratingsCount={ratingsCount}
              setRatingsCount={setRatingsCount}
              showToast={showToast}
              addCoins={(amt) => setCoins((c) => c + amt)}
              openReport={() => setModal("report")}
            />
          )}

          {activeTab === "store" && <StoreView onBuy={handleBuyCoins} />}

          {activeTab === "profile" && (
            <ProfileView coins={coins} openReport={() => setModal("report")} />
          )}
        </div>

        {/* Bottom Navigation */}
        {activeTab !== "generate" && (
          <nav className="absolute bottom-0 w-full bg-white border-t px-6 py-3 flex justify-between items-center z-30 pb-6">
            <NavBtn
              icon={Home}
              label="Home"
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
            />
            <NavBtn
              icon={Users}
              label="Groups"
              active={activeTab === "groups"}
              onClick={() => setActiveTab("groups")}
            />

            {/* FAB for Generate */}
            <div className="relative -top-5">
              <button
                onClick={() => setActiveTab("generate")}
                className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-4 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95"
              >
                <PlusCircle size={32} />
              </button>
            </div>

            <NavBtn
              icon={ShoppingBag}
              label="Store"
              active={activeTab === "store"}
              onClick={() => setActiveTab("store")}
            />
            <NavBtn
              icon={User}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
          </nav>
        )}

        {/* Global Toasts & Modals */}
        {notification && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-fade-in-down flex items-center gap-2">
            {notification.type === "success" ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <AlertTriangle size={16} className="text-red-400" />
            )}
            {notification.msg}
          </div>
        )}

        {modal === "store" && (
          <StoreModal onClose={() => setModal(null)} onBuy={handleBuyCoins} />
        )}
        {modal === "report" && (
          <ReportModal
            onClose={() => setModal(null)}
            onSubmit={() =>
              showToast("Report submitted. We will review shortly.")
            }
          />
        )}
      </div>
    </div>
  );
}

// --- SUB-VIEWS ---

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [consents, setConsents] = useState({ age: false, rights: false });

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-white flex flex-col p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 text-center">
        {step === 1 ? (
          <>
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl mb-8 rotate-3">
              <Sparkles size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BabyGen</h1>
            <p className="text-gray-500 mb-8">
              What will your future family look like? Find out in seconds with
              AI.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition transform active:scale-95"
            >
              Get Started
            </button>
          </>
        ) : (
          <div className="w-full text-left animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6">First, a few rules.</h2>

            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-purple-600"
                  checked={consents.age}
                  onChange={(e) =>
                    setConsents({ ...consents, age: e.target.checked })
                  }
                />
                <div className="text-sm">
                  <span className="font-semibold block text-gray-900">
                    I am 18+ years old
                  </span>
                  <span className="text-gray-500">
                    You must be an adult to use this app.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-purple-600"
                  checked={consents.rights}
                  onChange={(e) =>
                    setConsents({ ...consents, rights: e.target.checked })
                  }
                />
                <div className="text-sm">
                  <span className="font-semibold block text-gray-900">
                    I have permission
                  </span>
                  <span className="text-gray-500">
                    I have rights to the photos I upload and they follow our
                    Community Guidelines.
                  </span>
                </div>
              </label>
            </div>

            <button
              disabled={!consents.age || !consents.rights}
              onClick={onComplete}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition ${
                consents.age && consents.rights
                  ? "bg-purple-600 text-white hover:bg-purple-700 transform active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  );
}

function HomeView({ onGenerate, onGroupClick }) {
  return (
    <div className="p-4 space-y-8 animate-fade-in">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">See your future baby</h2>
          <p className="text-indigo-100 mb-6 text-sm max-w-[70%]">
            Combine two photos to see what your child might look like.
          </p>
          <button
            onClick={onGenerate}
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-50 transition flex items-center gap-2"
          >
            <Sparkles size={18} />
            Generate Now
          </button>
        </div>
        <img
          src={MOCK_BABIES[0]}
          alt="Baby"
          className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full border-4 border-indigo-400/30 object-cover"
        />
      </div>

      {/* Trending */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-900">Trending Results</h3>
          <span className="text-xs text-purple-600 font-medium">View All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {MOCK_BABIES.map((src, i) => (
            <div key={i} className="min-w-[140px] snap-center">
              <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-md">
                <img
                  src={src}
                  className="w-full h-full object-cover"
                  alt="Trending"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
                  <div className="flex items-center text-white text-xs font-medium">
                    <Heart size={12} className="fill-white mr-1" />
                    {(Math.random() * 10).toFixed(1)}k
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">
          Top Groups Today
        </h3>
        <div className="space-y-3">
          {MOCK_GROUPS.map((group) => (
            <div
              key={group.id}
              onClick={onGroupClick}
              className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    group.id === 1 ? "bg-pink-500" : "bg-blue-500"
                  }`}
                >
                  {group.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{group.name}</h4>
                  <p className="text-xs text-gray-500">
                    {group.members} members •{" "}
                    <span className="text-green-500">Active now</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenerateFlow({
  step,
  setStep,
  parentA,
  setParentA,
  parentB,
  setParentB,
  result,
  setResult,
  onClose,
  spendCoins,
  showToast,
  isWatermarkRemoved,
  setWatermarkRemoved,
}) {
  // Fake Processing Logic
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setResult(MOCK_BABIES[Math.floor(Math.random() * MOCK_BABIES.length)]);
        setStep(4);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handlers
  const handleUpload = (setter) => {
    // Simulate upload by setting a random stock avatar
    const randomAvatar =
      PARENT_AVATARS[Math.floor(Math.random() * PARENT_AVATARS.length)];
    setter(randomAvatar);
  };

  const handleReroll = () => {
    if (spendCoins(20)) {
      setStep(3);
      showToast("Rerolling...", "success");
    }
  };

  const handleRemoveWatermark = () => {
    if (spendCoins(50)) {
      setWatermarkRemoved(true);
      showToast("Watermark removed!", "success");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Gen Header */}
      <div className="px-4 py-3 flex justify-between items-center border-b">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>
        <span className="font-bold text-lg">
          {step < 3 ? "Generate" : step === 3 ? "Processing" : "It's a match!"}
        </span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col">
        {step < 3 && (
          <div className="p-6 flex flex-col items-center flex-1">
            <div className="flex-1 w-full flex flex-col justify-center items-center gap-6">
              {/* Slot A */}
              <div
                onClick={() => {
                  if (step === 0 || step === 1) handleUpload(setParentA);
                  setStep(1);
                }}
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                  parentA
                    ? "border-purple-500"
                    : "border-dashed border-gray-300 bg-gray-50"
                }`}
              >
                {parentA ? (
                  <img
                    src={parentA}
                    className="w-full h-full object-cover"
                    alt="Parent A"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <User className="mx-auto mb-1" />
                    <span className="text-xs font-bold">Person A</span>
                  </div>
                )}
                {parentA && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <RefreshCw className="text-white" />
                  </div>
                )}
              </div>

              <div className="text-2xl font-bold text-gray-300">+</div>

              {/* Slot B */}
              <div
                onClick={() => {
                  if (parentA) {
                    handleUpload(setParentB);
                    setStep(2);
                  } else {
                    showToast("Upload Person A first", "error");
                  }
                }}
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                  parentB
                    ? "border-pink-500"
                    : "border-dashed border-gray-300 bg-gray-50"
                }`}
              >
                {parentB ? (
                  <img
                    src={parentB}
                    className="w-full h-full object-cover"
                    alt="Parent B"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <User className="mx-auto mb-1" />
                    <span className="text-xs font-bold">Person B</span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-8">
              <button
                disabled={!parentA || !parentB}
                onClick={() => setStep(3)}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition ${
                  parentA && parentB
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Sparkles size={20} /> Generate Baby
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                By generating, you agree to our Content Policy.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="relative w-40 h-40 mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-purple-600 border-r-pink-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-100 animate-pulse">
                {/* Simulated morphing */}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Creating Magic...
            </h3>
            <p className="text-gray-500">
              Analyzing facial features and DNA...
            </p>
          </div>
        )}

        {step === 4 && result && (
          <div className="flex-1 flex flex-col animate-fade-in bg-gray-50">
            {/* Result Display */}
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                <img
                  src={result}
                  className="w-full h-full object-cover"
                  alt="Baby Result"
                />

                {/* Watermark Overlay */}
                {!isWatermarkRemoved && (
                  <div className="absolute bottom-4 right-4 opacity-70 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      BabyGen App
                    </div>
                  </div>
                )}

                {/* Watermark Pattern if needed */}
                {!isWatermarkRemoved && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 rotate-45">
                    <span className="text-4xl font-black text-white whitespace-nowrap">
                      PREVIEW PREVIEW PREVIEW
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Sheet */}
            <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 space-y-4">
              {/* Primary Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleReroll}
                  className="flex flex-col items-center justify-center gap-1 p-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <RefreshCw size={24} />
                  <span className="font-bold text-sm">Reroll</span>
                  <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    <Coins size={10} /> 20
                  </div>
                </button>
                <button className="flex flex-col items-center justify-center gap-1 p-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                  <Share2 size={24} />
                  <span className="font-bold text-sm">Share</span>
                  <span className="text-xs text-gray-400">
                    Free with watermark
                  </span>
                </button>
              </div>

              {/* Premium Action */}
              {!isWatermarkRemoved ? (
                <button
                  onClick={handleRemoveWatermark}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition"
                >
                  <Download size={20} /> Remove Watermark & Save
                  <div className="bg-white/20 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                    <Coins size={14} className="fill-white" /> 50
                  </div>
                </button>
              ) : (
                <button
                  onClick={() =>
                    showToast("Image saved to gallery!", "success")
                  }
                  className="w-full py-3 rounded-xl bg-green-500 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Check size={20} /> Saved to Gallery
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupsView({
  ratingsCount,
  setRatingsCount,
  showToast,
  addCoins,
  openReport,
}) {
  const [mode, setMode] = useState("rate"); // rate, list
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Simulation of rating deck
  const handleRate = (direction) => {
    // direction: 'left' (skip) or 'right' (love)
    if (currentCardIndex >= MOCK_BABIES.length - 1) {
      setCurrentCardIndex(0); // Reset for infinite loop
    } else {
      setCurrentCardIndex((i) => i + 1);
    }

    // Reward Logic
    const newCount = ratingsCount + 1;
    setRatingsCount(newCount);

    if (newCount % 5 === 0) {
      addCoins(10);
      showToast("🎉 +10 Coins for rating!", "success");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex gap-4">
        <button
          onClick={() => setMode("rate")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            mode === "rate"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          Rate & Earn
        </button>
        <button
          onClick={() => setMode("list")}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            mode === "list"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          Find Groups
        </button>
      </div>

      <div className="flex-1 p-4 bg-gray-50 overflow-hidden">
        {mode === "rate" ? (
          <div className="h-full flex flex-col items-center justify-center">
            {/* Progress Bar */}
            <div className="w-full max-w-xs mb-6">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                <span>Progress to reward</span>
                <span>{ratingsCount % 5} / 5</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${(ratingsCount % 5) * 20}%` }}
                ></div>
              </div>
            </div>

            {/* Card Deck */}
            <div className="relative w-full max-w-xs aspect-[3/4]">
              {/* Background Card */}
              <div className="absolute top-2 inset-x-4 bottom-0 bg-white rounded-2xl shadow-sm border border-gray-200 transform scale-95 translate-y-2"></div>

              {/* Active Card */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col animate-fade-in">
                <img
                  src={MOCK_BABIES[currentCardIndex]}
                  className="w-full flex-1 object-cover"
                  alt="Rate this"
                />
                <div className="p-4 bg-white flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">
                      Baby #{1200 + currentCardIndex}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Entry in "Cute Overload"
                    </p>
                  </div>
                  <button
                    onClick={openReport}
                    className="text-gray-300 hover:text-red-400"
                  >
                    <AlertTriangle size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-6 mt-8">
              <button
                onClick={() => handleRate("left")}
                className="w-16 h-16 rounded-full bg-white shadow-lg text-red-500 flex items-center justify-center hover:bg-red-50 transition transform active:scale-90"
              >
                <X size={32} />
              </button>
              <button
                onClick={() => handleRate("right")}
                className="w-16 h-16 rounded-full bg-white shadow-lg text-green-500 flex items-center justify-center hover:bg-green-50 transition transform active:scale-90"
              >
                <Heart size={32} className="fill-current" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm"
              />
              <Users
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
            {MOCK_GROUPS.map((g) => (
              <div
                key={g.id}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold">{g.name}</h4>
                  <p className="text-xs text-gray-500">{g.members} members</p>
                </div>
                <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoreView({ onBuy }) {
  const PACKS = [
    { id: 1, coins: 100, price: "$0.99", color: "bg-blue-500" },
    {
      id: 2,
      coins: 500,
      price: "$4.99",
      color: "bg-purple-600",
      popular: true,
    },
    { id: 3, coins: 1200, price: "$9.99", color: "bg-orange-500" },
  ];

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">Coin Store</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Use coins to remove watermarks, reroll results, and boost your entries.
      </p>

      <div className="space-y-4">
        {PACKS.map((pack) => (
          <div
            key={pack.id}
            onClick={() => onBuy(pack.coins, pack.price)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition active:scale-98"
          >
            {pack.popular && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                BEST VALUE
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${pack.color} rounded-full flex items-center justify-center text-white shadow-lg`}
                >
                  <Coins size={24} className="fill-white/50" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {pack.coins} Coins
                  </h3>
                  <p className="text-gray-400 text-xs">Remove 2 watermarks</p>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-900">
                {pack.price}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-indigo-900 rounded-2xl text-white relative overflow-hidden">
        <Sparkles className="absolute top-2 right-2 text-indigo-400 opacity-50" />
        <h3 className="font-bold text-lg mb-1">Watch Video</h3>
        <p className="text-indigo-200 text-sm mb-3">
          Earn 10 free coins by watching an ad.
        </p>
        <button className="bg-white/10 hover:bg-white/20 w-full py-2 rounded-lg font-semibold text-sm transition">
          Watch Now
        </button>
      </div>
    </div>
  );
}

function ProfileView({ coins, openReport }) {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white p-6 pb-8 border-b rounded-b-3xl shadow-sm text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">Alex Johnson</h2>
        <div className="flex justify-center gap-2 mt-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Coins size={12} className="fill-yellow-500" /> {coins}
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
            Premium Member
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider ml-2">
          My Content
        </h3>
        <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-lg text-pink-600">
              <Heart size={20} />
            </div>
            <span className="font-semibold text-gray-700">Saved Results</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider ml-2 mt-6">
          Safety & Support
        </h3>
        <button
          onClick={openReport}
          className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
              <Shield size={20} />
            </div>
            <span className="font-semibold text-gray-700">Safety Center</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
              <Lock size={20} />
            </div>
            <span className="font-semibold text-gray-700">Privacy Policy</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// --- MODALS ---

function StoreModal({ onClose, onBuy }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg">Top Up Coins</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins size={32} className="text-yellow-600 fill-yellow-400" />
          </div>
          <h4 className="text-xl font-bold mb-2">Need more coins?</h4>
          <p className="text-gray-500 text-sm mb-6">
            You need more coins to perform this action.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onBuy(100, 0.99)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              Buy 100 Coins - $0.99
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 font-semibold hover:text-gray-800"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportModal({ onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b">
          <h3 className="font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} /> Report Content
          </h3>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-sm text-gray-600 mb-2">
            Why are you reporting this?
          </p>
          {["Inappropriate Content", "Harassment", "Spam", "Underage User"].map(
            (reason) => (
              <button
                key={reason}
                onClick={() => {
                  onSubmit();
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 font-medium text-sm transition"
              >
                {reason}
              </button>
            )
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <button onClick={onClose} className="w-full font-bold text-gray-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// --- UTILS ---

function NavBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all w-16 ${
        active ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
