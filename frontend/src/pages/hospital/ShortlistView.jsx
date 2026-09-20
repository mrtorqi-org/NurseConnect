import { useState, useEffect } from 'react';
import api from '../../api/client';
import { Users, FileText, Eye, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';

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

export default function ShortlistView() {
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  useEffect(() => {
    api.get('/recruitment/hospital/shortlists/')
      .then(res => setShortlists(res.data.results || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1, 2].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Shortlists</h1>
        {shortlists.length ? (
          <StaggerContainer>
            {shortlists.map(sl => (
              <StaggerItem key={sl.id}>
                <HoverCard className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="font-semibold text-text-primary">{sl.requirement_title}</h2>
                      <p className="text-sm text-text-secondary">{sl.candidate_count} candidates · Required: {sl.requirement_quantity}</p>
                    </div>
                    <motion.button onClick={() => setExpanded(expanded === sl.id ? null : sl.id)} whileHover={{ scale: 1.02 }} className="text-sm text-primary hover:underline">
                      {expanded === sl.id ? 'Hide' : 'View Candidates'}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {expanded === sl.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        {sl.candidates?.map((sc, i) => (
                          <motion.div key={sc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="p-4 bg-gray-50 rounded-lg mt-3">
                            <div className="flex items-center gap-3 mb-3">
                              <motion.div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm" whileHover={{ scale: 1.15 }}>
                                {sc.candidate_detail?.full_name?.[0] || '?'}
                              </motion.div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">{sc.candidate_detail?.full_name}</p>
                                <p className="text-xs text-text-secondary">
                                  {sc.candidate_detail?.qualifications?.[0]?.degree_display || '—'} · {sc.candidate_detail?.experiences?.[0]?.years_of_experience || 0} years exp
                                  {sc.candidate_detail?.specializations?.length ? ` · ${sc.candidate_detail.specializations[0].name_display}` : ''}
                                </p>
                              </div>
                              {sc.candidate_detail?.verification?.is_fully_verified && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-0.5 bg-green-50 text-success text-xs rounded-full font-medium">✓ Verified</motion.span>
                              )}
                              {sc.candidate_detail?.documents?.length > 0 && (
                                <motion.button
                                  onClick={() => setExpandedCandidate(expandedCandidate === sc.id ? null : sc.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-2 py-1 bg-primary-light text-primary rounded-lg text-xs font-medium flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {sc.candidate_detail.documents.length}
                                </motion.button>
                              )}
                            </div>
                            {/* Documents section */}
                            <AnimatePresence>
                              {expandedCandidate === sc.id && sc.candidate_detail?.documents?.length > 0 && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                  className="mt-3 pt-3 border-t border-border">
                                  <p className="text-xs font-medium text-text-secondary mb-2">Documents:</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {sc.candidate_detail.documents.map(doc => (
                                      <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className={`p-3 rounded-lg border ${doc.document_type === 'profile_photo' ? 'border-primary/20 bg-primary-light/20' : 'border-border bg-white'}`}>
                                        <div className="flex items-center gap-2">
                                          {doc.document_type === 'profile_photo' ? (
                                            <Camera className="w-4 h-4 text-primary" />
                                          ) : (
                                            <FileText className="w-4 h-4 text-text-secondary" />
                                          )}
                                          <span className="text-xs font-medium text-text-primary">{DOCUMENT_LABELS[doc.document_type] || doc.document_type}</span>
                                        </div>
                                        <button onClick={() => setViewingDoc(doc)} className="text-xs text-primary hover:underline flex items-center gap-1 mt-2">
                                          <Eye className="w-3 h-3" /> View
                                        </button>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-white rounded-xl border border-border">
            <Users className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">No shortlists received yet</p>
            <p className="text-sm text-text-secondary mt-1">Shortlists will appear here once the admin processes your requirements.</p>
          </motion.div>
        )}
      </div>

      <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
    </PageTransition>
  );
}
