import { GoogleGenerativeAI } from '@google/generative-ai';

export default function DiseaseDetection() {
  const { lang } = useLanguage();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const t = {
    en: {
      title: 'AI Crop Disease Scanner',
      subtitle: 'Universal Health Protection',
      desc: 'Upload a photo of ANY crop or vegetable (Rice, Tomato, Potato, etc.) to detect diseases immediately using advanced vision AI.',
      uploadBtn: 'Scan Leaf Image',
      dragDrop: 'Drag and drop or click to upload',
      scanning: 'AI Analyzing Leaf Patterns...',
      detected: 'Diagnosis Found',
      healthy: 'Healthy Leaf Detected',
      disease: 'Detected Disease',
      confidence: 'AI Confidence Level',
      description: 'Symptom Analysis',
      treatment: 'Recommended Treatment Protocol',
      back: 'Scan New Leaf',
      source: 'Source: KrishiBangla AI (BRRI/BARI standard)',
      error: 'Analysis failed. Please try a clearer image.',
      limit: 'Daily Scan Limit Reached. Please try again tomorrow.',
    },
    bn: {
      title: 'এআই ফসল রোগ স্ক্যানার',
      subtitle: 'সর্বজনীন স্বাস্থ্য সুরক্ষা',
      desc: 'যেকোনো ফসল বা সবজির (ধান, টমেটো, আলু ইত্যাদি) ছবি আপলোড করুন এবং উন্নত ভিশন এআই ব্যবহার করে তাৎক্ষণিকভাবে রোগ শনাক্ত করুন।',
      uploadBtn: 'পাতা স্ক্যান করুন',
      dragDrop: 'ড্র্যাগ করে অথবা ক্লিক করে আপলোড করুন',
      scanning: 'এআই পাতার ধরণ বিশ্লেষণ করছে...',
      detected: 'রোগ শনাক্তকরণ ফলাফল',
      healthy: 'সুস্থ পাতা শনাক্ত হয়েছে',
      disease: 'শনাক্তকৃত রোগ',
      confidence: 'এআই আত্মবিশ্বাস স্তর',
      description: 'লক্ষণ বিশ্লেষণ',
      treatment: 'প্রস্তাবিত চিকিৎসা পদ্ধতি',
      back: 'নতুন পাতা স্ক্যান করুন',
      source: 'উৎস: কৃষিবাংলাদেশ এআই (BRRI/BARI মানসম্পন্ন)',
      error: 'বিশ্লেষণ ব্যর্থ হয়েছে। অনুগ্রহ করে পরিষ্কার ছবি দিয়ে চেষ্টা করুন।',
      limit: 'স্ক্যানারের দৈনিক সীমা অতিক্রম হয়েছে। অনুগ্রহ করে আগামীকাল চেষ্টা করুন।',
    }
  }[lang];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    try {
      const apiKey = "AIzaSyDcCXwAdRJQVpzjD-xFRImY2skgTdCUavI";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const base64Content = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const prompt = `Act as an expert plant pathologist specialized in Bangladesh agriculture (BRRI/BARI standards). Analyze this plant leaf image and provide a JSON response. 
      If a disease is found:
      {
        "detected": true,
        "crop_en": "Crop Name (e.g. Rice)",
        "crop_bn": "ফসলের নাম (যেমন: ধান)",
        "disease_en": "Disease Name (e.g. Rice Blast)",
        "disease_bn": "রোগের নাম (যেমন: ধানের ব্লাস্ট)",
        "confidence": 0.95,
        "description_en": "Detailed symptoms in English",
        "description_bn": "বিস্তারিত লক্ষণ বাংলায়",
        "treatment_en": ["Step 1", "Step 2"],
        "treatment_bn": ["ধাপ ১", "ধাপ ২"]
      }
      If the plant is healthy:
      {
        "detected": false,
        "message_en": "The plant looks healthy. Maintain regular care.",
        "message_bn": "গাছটি সুস্থ দেখাচ্ছে। নিয়মিত যত্ন নিন।"
      }
      ONLY return the raw JSON, no markdown formatting blocks.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Content,
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      let text = response.text();
      // Clean up potential markdown blocks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const data = JSON.parse(text);
      setResult(data);
    } catch (err) {
      console.error("Gemini Vision Error:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="disease-detection" className="py-24 px-4 relative overflow-hidden bg-[#05111e]">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t.subtitle}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            {t.title}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Area */}
          <div className="relative group">
            <div className={`relative aspect-square md:aspect-video lg:aspect-square bg-white/5 border-2 border-dashed ${preview ? 'border-emerald-500/50' : 'border-white/10'} rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:bg-white/10 flex flex-col items-center justify-center p-8 text-center`}>
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
                      </div>
                      <span className="text-emerald-400 font-bold tracking-widest animate-pulse">{t.scanning}</span>
                    </div>
                  )}
                  {!loading && !result && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <button onClick={handleDetect} className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-2xl shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-transform">
                          {t.uploadBtn}
                       </button>
                    </div>
                  )}
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-all duration-500">📸</div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.dragDrop}</h3>
                  <p className="text-white/30 text-sm">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            
            {/* Action Overlay */}
            {preview && !loading && (
               <div className="mt-6 flex gap-4">
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-3xl hover:bg-white/10 transition-all">
                    {t.back}
                  </button>
               </div>
            )}
          </div>

          {/* Result Panel */}
          <div className="relative">
            {result ? (
               <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl animate-scaleIn">
                  {result.detected ? (
                    <>
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{t.detected}</div>
                          <h3 className="text-3xl font-black text-white">
                            {lang === 'bn' ? `${result.crop_bn || ''} - ${result.disease_bn}` : `${result.crop_en || ''} - ${result.disease_en}`}
                          </h3>
                        </div>
                        <div className="bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30 text-center">
                          <div className="text-[10px] text-emerald-400 font-black uppercase leading-none mb-1">{t.confidence}</div>
                          <div className="text-xl font-black text-emerald-400 leading-none">{(result.confidence * 100).toFixed(1)}%</div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h4 className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase tracking-widest mb-4">
                            <span className="text-lg">🔍</span> {t.description}
                          </h4>
                          <p className="text-white/70 leading-relaxed text-sm">
                            {lang === 'bn' ? result.description_bn : result.description_en}
                          </p>
                        </div>

                        <div>
                          <h4 className="flex items-center gap-2 text-white/50 text-sm font-bold uppercase tracking-widest mb-4">
                            <span className="text-lg">💊</span> {t.treatment}
                          </h4>
                          <ul className="grid grid-cols-1 gap-3">
                            {(lang === 'bn' ? (result.treatment_bn || []) : (result.treatment_en || [])).map((step, i) => (
                               <li key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-4 items-start">
                                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-1">{i+1}</span>
                                  <span className="text-white/80 text-sm">{step}</span>
                               </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">🍃</div>
                      <h3 className="text-2xl font-black text-white mb-4">{t.healthy}</h3>
                      <p className="text-white/60 leading-relaxed">
                        {lang === 'bn' ? result.message_bn : result.message_en}
                      </p>
                    </div>
                  )}

                  <div className="mt-12 pt-6 border-t border-white/5 text-[10px] text-white/20 font-bold uppercase tracking-widest flex justify-between">
                    <span>{t.source}</span>
                    <span className="text-emerald-500/50 italic">Verified Algorithm v2.0</span>
                  </div>
               </div>
            ) : (
              <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 bg-white/[0.02]">
                <div className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center text-4xl mb-6 opacity-30">🔬</div>
                <h3 className="text-white/30 text-xl font-bold italic">Waiting for scan analysis...</h3>
              </div>
            )}

            {error && (
              <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-sm font-bold flex items-center gap-4 animate-shake">
                <span className="text-2xl">⚠️</span> {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </section>
  );
}
