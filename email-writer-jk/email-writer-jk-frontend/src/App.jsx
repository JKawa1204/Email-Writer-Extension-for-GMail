import { useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", { emailContent, tone });
      setGeneratedReply(
        typeof response.data === "string" ? response.data : JSON.stringify(response.data)
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate email reply. Please try again.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-8xl font-semibold text-gray-900 mb-2">
            Email Reply Generator
          </h1>
          <p className="text-base sm:text-2xl text-gray-500">
            Generate quick, professional email responses effortlessly.
          </p>
        </header>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7 space-y-4">
          <label className="block text-md font-medium text-gray-500">
            Original Email Content
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800/10 focus:border-gray-400 transition"
            rows={6}
            placeholder="Paste the original email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-500">
              Tone (Optional)
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/10 focus:border-gray-400 transition"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="">None</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              loading || !emailContent
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-800 hover:bg-black"
            }`}
          >
            {loading ? "Generating..." : "Generate Reply"}
          </button>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
              {error}
            </div>
          )}

          {generatedReply && (
            <div className="pt-2">
              <h2 className="text-base font-semibold text-gray-500 mb-2">
                Generated Reply
              </h2>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50"
                rows={6}
                value={generatedReply}
                readOnly
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedReply)}
                className="mt-3 px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200 transition"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
