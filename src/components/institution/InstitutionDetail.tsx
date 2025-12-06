import React, { useState } from 'react';
import type { Institution } from '../../types/institution';
import type { GeminiResponse } from '../../types/ai';
import { fetchLocationDetails, fetchSearchInfo } from '../../services/geminiService';
import { X, MapPin, Phone, Globe, Award, Briefcase, GraduationCap, Activity, Sparkles, Search, ExternalLink, Loader2, Zap } from 'lucide-react';

interface InstitutionDetailProps {
    institution: Institution;
    onClose: () => void;
    isKeySet: boolean;
}

const InstitutionDetail: React.FC<InstitutionDetailProps> = ({ institution, onClose, isKeySet }) => {
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<GeminiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAllPrograms, setShowAllPrograms] = useState(false);

    const handleVerify = async () => {
        if (!isKeySet) return;
        setAiLoading(true);
        setError(null);
        try {
            const res = await fetchLocationDetails(`${institution.name}, ${institution.location.address}`);
            setAiResponse(res);
        } catch (e) {
            setError("Failed to verify location.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!isKeySet) return;
        setAiLoading(true);
        setError(null);
        try {
            const res = await fetchSearchInfo(`Latest news and updates about ${institution.name} in Dakshina Kannada`);
            setAiResponse(res);
        } catch (e) {
            setError("Failed to search news.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="absolute top-4 right-4 w-96 bg-white/95 backdrop-blur shadow-2xl rounded-xl border border-slate-200 flex flex-col max-h-[calc(100vh-32px)] z-[1000] overflow-hidden animate-in slide-in-from-right-10 duration-300">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${institution.category === 'Engineering' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            institution.category === 'Hospital' ? 'bg-red-50 text-red-700 border-red-200' :
                                institution.category === 'Company' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                            {institution.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                            {institution.type}
                        </span>
                    </div>
                    <h2 className="font-bold text-xl text-slate-900 leading-tight">{institution.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {institution.location.address}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* AI Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        AI Insights
                    </h3>

                    {!isKeySet ? (
                        <div className="text-xs text-slate-500 italic">
                            Set API Key in sidebar to enable AI features.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleVerify}
                                    disabled={aiLoading}
                                    className="flex-1 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
                                >
                                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                                    Verify Location
                                </button>
                                <button
                                    onClick={handleSearch}
                                    disabled={aiLoading}
                                    className="flex-1 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
                                >
                                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                                    Latest News
                                </button>
                            </div>

                            {error && (
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                    {error}
                                </div>
                            )}

                            {aiResponse && (
                                <div className="bg-white/80 p-3 rounded-lg border border-indigo-100 text-xs text-slate-700 leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                                    <p className="mb-2">{aiResponse.text}</p>
                                    {aiResponse.groundingChunks && aiResponse.groundingChunks.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-indigo-50">
                                            {aiResponse.groundingChunks.map((chunk, idx) => {
                                                const uri = chunk.web?.uri || chunk.maps?.uri;
                                                const title = chunk.web?.title || chunk.maps?.title || "Source";
                                                if (!uri) return null;
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={uri}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full hover:text-primary hover:border-primary/30 transition-colors text-[10px]"
                                                    >
                                                        {title} <ExternalLink className="w-2 h-2" />
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Rich Metadata Section */}
                {(institution.primaryDomains || (institution.domains && Object.keys(institution.domains).length > 0) || institution.keyTools || (institution.tools && institution.tools.length > 0)) && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            Key Highlights
                        </h3>
                        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 space-y-4">
                            {(institution.primaryDomains || (institution.domains && Object.keys(institution.domains).length > 0)) && (
                                <div>
                                    <p className="text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wider">Primary Domains</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(institution.primaryDomains || Object.entries(institution.domains || {})
                                            .sort(([, a], [, b]) => (b || 0) - (a || 0))
                                            .slice(0, 8)
                                            .map(([domain]) => domain)
                                        ).map((domain, i) => (
                                            <span key={i} className="text-[10px] font-medium bg-white border border-amber-200 text-amber-900 px-2 py-1 rounded shadow-sm">
                                                {domain}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(institution.keyTools || (institution.tools && institution.tools.length > 0)) && (
                                <div>
                                    <p className="text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wider">Tools & Technologies</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(institution.keyTools || (institution.tools || []).slice(0, 10).map(t => t.name)).map((tool, i) => (
                                            <span key={i} className="text-[10px] font-medium bg-white border border-amber-200 text-slate-700 px-2 py-1 rounded shadow-sm">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3">
                    {institution.contact.website && (
                        <a
                            href={institution.contact.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-medium text-slate-700"
                        >
                            <Globe className="w-4 h-4 text-primary" />
                            Website
                        </a>
                    )}
                    {institution.contact.phone && (
                        <a
                            href={`tel:${institution.contact.phone}`}
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-medium text-slate-700"
                        >
                            <Phone className="w-4 h-4 text-primary" />
                            Call Now
                        </a>
                    )}
                    <a
                        href={institution.location.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors text-xs font-medium text-primary"
                    >
                        <MapPin className="w-4 h-4" />
                        Get Directions
                    </a>
                </div>

                {/* Academic Info */}
                {(institution.academic || (institution.programs && institution.programs.length > 0)) && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-slate-500" />
                            Academic Highlights
                        </h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                            {institution.academic?.accreditation && (
                                <div className="flex flex-wrap gap-2">
                                    {institution.academic.accreditation.map((acc, i) => (
                                        <span key={i} className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-slate-600">
                                            {acc}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Programs</p>
                                <ul className="space-y-1">
                                    {(() => {
                                        const allPrograms = [
                                            ...(institution.academic?.programs || []),
                                            ...(institution.programs || [])
                                        ];
                                        return (showAllPrograms ? allPrograms : allPrograms.slice(0, 3)).map((prog, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex justify-between">
                                                <span>{prog.name}</span>
                                                {prog.seats && <span className="text-slate-400 text-xs">{prog.seats} seats</span>}
                                            </li>
                                        ));
                                    })()}
                                    {(() => {
                                        const totalPrograms = (institution.academic?.programs?.length || 0) + (institution.programs?.length || 0);
                                        return totalPrograms > 3 && (
                                            <li
                                                onClick={() => setShowAllPrograms(!showAllPrograms)}
                                                className="text-xs text-primary font-medium cursor-pointer hover:underline flex items-center gap-1"
                                            >
                                                {showAllPrograms ? 'Show Less' : `+ ${totalPrograms - 3} more programs`}
                                            </li>
                                        );
                                    })()}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placement Stats */}
                {institution.placement && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Award className="w-4 h-4 text-slate-500" />
                            Placement Stats ({institution.placement.year})
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center">
                                <div className="text-lg font-bold text-emerald-700">{institution.placement.rate}%</div>
                                <div className="text-[10px] text-emerald-600 font-medium">Placed</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
                                <div className="text-lg font-bold text-blue-700">₹{institution.placement.packages.highest}L</div>
                                <div className="text-[10px] text-blue-600 font-medium">Highest</div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-center">
                                <div className="text-lg font-bold text-indigo-700">₹{institution.placement.packages.average}L</div>
                                <div className="text-[10px] text-indigo-600 font-medium">Average</div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-2">Top Recruiters</p>
                            <div className="flex flex-wrap gap-1.5">
                                {institution.placement.topRecruiters.map((rec, i) => (
                                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                        {rec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Company Info */}
                {institution.company && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-500" />
                            Career Opportunities
                        </h3>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Sector</span>
                                <span className="font-medium text-slate-900">{institution.company.sector}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Employees</span>
                                <span className="font-medium text-slate-900">{institution.company.employees}+</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200">
                                <p className="text-xs font-semibold text-slate-500 mb-2">Hiring Positions</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {institution.company.hiring.positions.map((pos, i) => (
                                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                                            {pos}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hospital Info */}
                {institution.hospital && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-500" />
                            Healthcare Services
                        </h3>
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-red-700">{institution.hospital.beds}</div>
                                    <div className="text-[10px] text-red-600">Beds</div>
                                </div>
                                <div className="h-8 w-px bg-red-200"></div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-1">
                                        {institution.hospital.emergency && (
                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                                                24x7 Emergency
                                            </span>
                                        )}
                                        {institution.hospital.ambulance && (
                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                                                Ambulance
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-red-800 mb-1">Specialties</p>
                                <p className="text-xs text-red-700 leading-relaxed">
                                    {institution.hospital.specialties.join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tags Section */}
                {institution.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                        {institution.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default InstitutionDetail;
