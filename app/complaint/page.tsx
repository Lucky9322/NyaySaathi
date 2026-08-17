'use client';
import { useState } from 'react';
import { AlertCircle, Download, Edit, ChevronRight, ChevronLeft, Check, AlertTriangle, Copy, Loader2, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/translations';
import { saveDocumentDraft } from '@/lib/session';

interface ComplaintFormData {
  complainantName: string;
  complainantAddress: string;
  complainantPhone: string;
  incidentDate: string;
  incidentLocation: string;
  accusedDetails: string;
  incidentDescription: string;
  witnesses: string;
}

const INITIAL_DATA: ComplaintFormData = {
  complainantName: '',
  complainantAddress: '',
  complainantPhone: '',
  incidentDate: '',
  incidentLocation: '',
  accusedDetails: '',
  incidentDescription: '',
  witnesses: '',
};

export default function ComplaintPage() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ComplaintFormData>(INITIAL_DATA);
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const update = (field: keyof ComplaintFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = () => formData.complainantName && formData.complainantAddress && formData.complainantPhone;
  const canProceedStep2 = () => formData.incidentDate && formData.incidentLocation && formData.incidentDescription;

  const generateComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/complaint-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedText(data.complaint);
      // Persist to session for dashboard history
      saveDocumentDraft({
        type: 'complaint',
        title: `Police Complaint — ${formData.incidentLocation || 'Unknown Location'}`,
        department: formData.incidentLocation,
        language: language as 'en' | 'hi' | 'mr',
        preview: data.complaint.slice(0, 120),
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'processingError'));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - 2 * margin;

    doc.setFillColor(230, 69, 53);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('NyayaSathi - Police Complaint Draft', margin, 10);
    doc.text('NOT AN OFFICIAL FIR', pageWidth - margin, 10, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(generatedText, maxWidth);
    let y = 25;
    const lineHeight = 6;
    const pageHeight = doc.internal.pageSize.getHeight() - 20;

    for (const line of lines) {
      if (y > pageHeight) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('NyayaSathi | General information, not legal advice | This is a draft — file in person at police station', margin, doc.internal.pageSize.getHeight() - 8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
    }

    doc.save(`Police_Complaint_${formData.complainantName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepLabels = [
    t(language, 'yourDetails'),
    t(language, 'incidentDate').split(' ')[0] + ' Details',
    t(language, 'review'),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: '#dc2626' }}
          >
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-xl">{t(language, 'complaintTitle')}</h1>
            <p className="text-gray-500 text-sm">{t(language, 'complaintSubtitle')}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border ${
                step >= s
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-white text-gray-300 border-gray-200'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-12 sm:w-20 rounded transition-all ${step > s ? 'bg-red-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="ml-2 text-gray-400 text-xs">
            {t(language, 'step')} {step} {t(language, 'of')} 3
          </span>
        </div>
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        {stepLabels.map((label, i) => (
          <div key={i} className={`text-xs font-medium ${
            step === i + 1 ? 'text-red-700' : step > i + 1 ? 'text-gray-400' : 'text-gray-300'
          }`}>
            {label}
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <div className="alert-error mb-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 text-sm font-medium mb-1">
              {language === 'mr' ? 'महत्त्वाची सूचना' : language === 'hi' ? 'महत्वपूर्ण सूचना' : 'Important Notice'}
            </p>
            <p className="text-red-700 text-xs">
              {language === 'mr'
                ? 'हे साधन FIR मसुदा तयार करण्यासाठी आहे. प्रत्यक्ष FIR नोंदवण्यासाठी पोलिस ठाण्यात जाणे आवश्यक आहे. आपत्कालीन परिस्थितीत 100 वर कॉल करा.'
                : language === 'hi'
                ? 'यह टूल FIR ड्राफ्ट तैयार करने के लिए है। वास्तविक FIR दर्ज कराने के लिए पुलिस स्टेशन जाना जरूरी है। आपातकाल में 100 पर कॉल करें।'
                : 'This tool helps draft a complaint. To register an actual FIR, you must visit the police station in person. In emergencies, call 100.'}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-red-700 font-medium flex items-center gap-1"><Phone className="w-3 h-3" /> Police: 100</span>
              <span className="text-xs text-red-700 font-medium flex items-center gap-1"><Phone className="w-3 h-3" /> Women: 1091</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-4">{t(language, 'yourDetails')}</h2>
          <div>
            <label className="label">{t(language, 'name')} *</label>
            <input type="text" value={formData.complainantName} onChange={e => update('complainantName', e.target.value)} className="input-field"
              placeholder={language === 'mr' ? 'उदा. प्रिया पाटील' : language === 'hi' ? 'जैसे: प्रिया पाटिल' : 'e.g. Priya Patil'} />
          </div>
          <div>
            <label className="label">{t(language, 'address')} *</label>
            <textarea value={formData.complainantAddress} onChange={e => update('complainantAddress', e.target.value)} className="textarea-field" rows={3}
              placeholder={language === 'mr' ? 'संपूर्ण पत्ता, शहर, राज्य, पिन' : language === 'hi' ? 'पूरा पता, शहर, राज्य, पिन' : 'Full address, city, state, PIN'} />
          </div>
          <div>
            <label className="label">{t(language, 'phone')} *</label>
            <input type="tel" value={formData.complainantPhone} onChange={e => update('complainantPhone', e.target.value)} className="input-field" placeholder="+91 98765 43210" />
          </div>
        </div>
      )}

      {/* Step 2: Incident Details */}
      {step === 2 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-4">
            {language === 'mr' ? 'घटनेचा तपशील' : language === 'hi' ? 'घटना का विवरण' : 'Incident Details'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t(language, 'incidentDate')} *</label>
              <input type="date" value={formData.incidentDate} onChange={e => update('incidentDate', e.target.value)} className="input-field"
                max={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="label">{t(language, 'incidentLocation')} *</label>
              <input type="text" value={formData.incidentLocation} onChange={e => update('incidentLocation', e.target.value)} className="input-field"
                placeholder={language === 'mr' ? 'घटनेचे ठिकाण' : language === 'hi' ? 'घटना का स्थान' : 'Location of incident'} />
            </div>
          </div>
          <div>
            <label className="label">{t(language, 'accusedDetails')}</label>
            <input type="text" value={formData.accusedDetails} onChange={e => update('accusedDetails', e.target.value)} className="input-field"
              placeholder={language === 'mr' ? 'नाव, वर्णन, ओळखीचे तपशील (शक्य असल्यास)' : language === 'hi' ? 'नाम, विवरण, पहचान की जानकारी (यदि उपलब्ध)' : 'Name, description, identifying details (if known)'} />
          </div>
          <div>
            <label className="label">{t(language, 'incidentDescription')} *</label>
            <textarea value={formData.incidentDescription} onChange={e => update('incidentDescription', e.target.value)} className="textarea-field" rows={6}
              placeholder={language === 'mr' ? 'घटना कशी घडली याचे क्रमवार वर्णन करा. तारीख, वेळ, घटनाक्रम सविस्तर सांगा.' : language === 'hi' ? 'घटना कैसे हुई, इसका क्रमानुसार विवरण दें। तारीख, समय, घटनाक्रम विस्तार से बताएं।' : 'Describe chronologically what happened — date, time, sequence of events in detail.'} />
          </div>
          <div>
            <label className="label">{t(language, 'witnesses')}</label>
            <input type="text" value={formData.witnesses} onChange={e => update('witnesses', e.target.value)} className="input-field"
              placeholder={language === 'mr' ? 'साक्षीदारांची नावे आणि संपर्क (असल्यास)' : language === 'hi' ? 'गवाहों के नाम और संपर्क (यदि हों)' : 'Names and contacts of witnesses (if any)'} />
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div className="space-y-4">
          {loading && (
            <div className="card p-12 text-center">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">{t(language, 'generating')}</p>
            </div>
          )}
          {error && (
            <div className="alert-error">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {generatedText && !loading && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  {language === 'mr' ? 'तयार तक्रार मसुदा' : language === 'hi' ? 'तैयार शिकायत प्रारूप' : 'Generated Complaint Draft'}
                </h2>
                <div className="flex gap-2">
                  <button onClick={copyText} className="btn-ghost flex items-center gap-1.5 text-xs">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? t(language, 'copied') : t(language, 'copyText')}
                  </button>
                  <button onClick={() => setIsEditing(!isEditing)} className="btn-ghost flex items-center gap-1.5 text-xs">
                    <Edit className="w-3.5 h-3.5" />
                    {t(language, 'edit')}
                  </button>
                </div>
              </div>
              {isEditing ? (
                <textarea value={generatedText} onChange={e => setGeneratedText(e.target.value)} className="textarea-field font-mono text-sm w-full" rows={20} />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {generatedText}
                </pre>
              )}
              <div className="mt-4 alert-warning">
                <p>
                  {language === 'mr'
                    ? '🚔 हा मसुदा घेउन स्थानिक पोलिस ठाण्यात जा. SHO कडे FIR नोंदवण्याची विनंती करा. FIR ची मोफत प्रत मागण्याचा तुम्हाला अधिकार आहे.'
                    : language === 'hi'
                    ? '🚔 यह ड्राफ्ट लेकर स्थानीय पुलिस स्टेशन जाएं। SHO से FIR दर्ज करने का अनुरोध करें। FIR की मुफ्त कॉपी मांगना आपका अधिकार है।'
                    : '🚔 Take this draft to your local police station. Request the SHO to register an FIR. You have the right to a free copy of the FIR.'}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={downloadPDF} className="btn-primary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {t(language, 'download')}
                </button>
                <button onClick={() => { setStep(1); setGeneratedText(''); setFormData(INITIAL_DATA); }} className="btn-secondary">
                  {language === 'mr' ? 'नवीन तक्रार' : language === 'hi' ? 'नई शिकायत' : 'New Complaint'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between mt-6">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="btn-secondary flex items-center gap-2 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
            {t(language, 'back')}
          </button>
          {step === 2 ? (
            <button onClick={generateComplaint} disabled={!canProceedStep2() || loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
              {loading ? t(language, 'generating') : t(language, 'generate')}
            </button>
          ) : (
            <button onClick={() => setStep(s => s + 1)} disabled={!canProceedStep1()} className="btn-primary flex items-center gap-2">
              {t(language, 'next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
