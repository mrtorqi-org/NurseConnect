import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';
import { ArrowLeft, FileText, Eye, X, Camera, Check, X as XIcon } from 'lucide-react';

const DOCUMENT_LABELS = {
  profile_photo: 'Profile Photo',
  registration_certificate: 'Registration Certificate',
  qualification_certificate: 'Qualification Certificate',
};

function DocumentViewer({ document, onClose }) {
  if (!document) return null;
  const isImage = document.document_url && (document.document_url.match(/\.(jpg|jpeg|png|webp|gif)$/i));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-semibold text-lg">{DOCUMENT_LABELS[document.document_type] || document.document_type}</h3>
            {document.title && <p className="text-xs text-text-secondary mt-0.5">{document.title}</p>}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          {isImage ? (
            <img src={document.document_url} alt={DOCUMENT_LABELS[document.document_type]} className="w-full h-auto rounded-lg border border-border" />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <FileText className="w-16 h-16 text-text-secondary/30" />
              <p className="text-text-secondary text-sm">Document preview not available</p>
              <a href={document.document_url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Open Document
              </a>
            </div>
          )}
          <p className="text-xs text-text-secondary mt-4 text-center">
            Uploaded: {new Date(document.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ShortlistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shortlist, setShortlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  useEffect(() => {
    api.get('/recruitment/shortlists/' + id + '/')
      .then(res => setShortlist(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const sendShortlist = async () => {
    setSending(true);
    try {
      await api.post('/recruitment/shortlists/' + id + '/send/');
      toast.success('Shortlist sent to hospital!');
      setShortlist(prev => ({ ...prev, is_sent: true }));
    } catch (err) {
      toast.error('Failed');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
  if (!shortlist) return <div className="text-center py-12 text-text-secondary">Not found</div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline" whileHover={{ x: -4 }}>Back</motion.button>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Shortlist: {shortlist.requirement_title}</h1>
              <p className="text-text-secondary mt-1">{shortlist.candidate_count} candidates</p>
            </div>
            {shortlist.is_sent ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="px-4 py-2 bg-green-50 text-success rounded-lg text-sm font-medium">Sent to Hospital</motion.span>
            ) : (
              <motion.button onClick={sendShortlist} disabled={sending} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
                {sending ? 'Sending...' : 'Send to Hospital'}
              </motion.button>
            )}
          </div>
        </motion.div>

        <StaggerContainer>
          {shortlist.candidates && shortlist.candidates.map(sc => (
            <StaggerItem key={sc.id}>
              <HoverCard className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center gap-4 mb-3">
                  <motion.div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg" whileHover={{ scale: 1.15 }}>
                    {sc.candidate_detail?.full_name?.[0] || '?'}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{sc.candidate_detail?.full_name}</h3>
                    <p className="text-sm text-text-secondary">{sc.candidate_detail?.qualifications?.[0]?.degree_display || '—'}</p>
                  </div>
                  {sc.candidate_detail?.verification?.is_fully_verified && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1 bg-green-50 text-success text-xs font-medium rounded-full">Verified</motion.span>
                  )}
                  {sc.candidate_detail?.documents?.length > 0 && (
                    <motion.button
                      onClick={() => setExpandedCandidate(expandedCandidate === sc.id ? null : sc.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-primary-light text-primary rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      {sc.candidate_detail.documents.length} Doc{sc.candidate_detail.documents.length > 1 ? 's' : ''}
                    </motion.button>
                  )}
                </div>
                {/* Documents section */}
                <AnimatePresence>
                  {expandedCandidate === sc.id && sc.candidate_detail?.documents?.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-medium text-text-secondary mb-3">Documents:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {sc.candidate_detail.documents.map(doc => (
                            <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              className={`p-4 rounded-xl border ${doc.document_type === 'profile_photo' ? 'border-primary/20 bg-primary-light/20' : 'border-border bg-gray-50'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                {doc.document_type === 'profile_photo' ? (
                                  <Camera className="w-4 h-4 text-primary" />
                                ) : (
                                  <FileText className="w-4 h-4 text-text-secondary" />
                                )}
                                <span className="text-xs font-medium text-text-primary">{DOCUMENT_LABELS[doc.document_type] || doc.document_type}</span>
                              </div>
                              {doc.title && <p className="text-xs text-text-secondary mb-2 truncate">{doc.title}</p>}
                              <button onClick={() => setViewingDoc(doc)} className="text-xs text-primary hover:underline flex items-center gap-1">
                                <Eye className="w-3 h-3" /> View Document
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
      </div>
    </PageTransition>
  );
}
