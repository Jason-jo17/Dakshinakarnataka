import React, { useState } from 'react';
import { X, Download, FileText, Send, Check } from 'lucide-react';

interface ProposalModalProps {
    onClose: () => void;
    title: string;
    recipientName: string; // e.g., "The Principal, VC Puttur" or "HR Manager, Ather Energy"
}

const ProposalModal: React.FC<ProposalModalProps> = ({ onClose, title, recipientName }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleDownload = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            // In a real app, this would trigger a download
            alert("Draft downloaded successfully to your device.");
        }, 1500);
    };

    const handleSend = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                <div className="bg-primary p-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FileText size={20} />
                            Proposal Generator
                        </h2>
                        <p className="text-white/80 text-sm mt-1">Review and approve the official draft</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {!isSent ? (
                    <>
                        <div className="p-6 flex-1 overflow-y-auto bg-background">
                            <div className="bg-surface p-8 shadow-sm border border-border min-h-[400px] text-sm leading-relaxed text-text font-serif">
                                <p className="text-right mb-8 text-icon italic">Date: {new Date().toLocaleDateString()}</p>

                                <p className="font-bold mb-4">To,<br />{recipientName}</p>

                                <p className="font-bold mb-6 underline">Subject: Proposal for {title}</p>

                                <p className="mb-4">Dear Sir/Madam,</p>

                                <p className="mb-4">
                                    Dakshina Kannada District Administration, in its pursuit of excellence in education and employability, has identified a critical opportunity to collaborate with your esteemed organization.
                                </p>

                                <p className="mb-4">
                                    Our data-driven analysis indicates a significant concentration of talent in your vicinity that aligns with current industry demands. However, a specific skill gap analysis reveals the need for specialized intervention in this domain.
                                </p>

                                <p className="mb-4">
                                    We propose to establish a <strong>{title}</strong> to bridge this gap. This initiative aims to:
                                </p>
                                <ul className="list-disc pl-8 mb-4 space-y-1">
                                    <li>enhance practical skills through hands-on training.</li>
                                    <li>foster innovation and industry-relevant projects.</li>
                                    <li>improve employability and placement outcomes for students.</li>
                                </ul>

                                <p className="mb-8">
                                    We request your support and partnership in this endeavor to create a robust talent pipeline for the district's growth.
                                </p>

                                <p className="mb-2">Sincerely,</p>
                                <p className="font-bold">District Skill Development Officer</p>
                                <p>Dakshina Kannada</p>
                            </div>
                        </div>

                        <div className="p-4 bg-surface border-t border-border flex justify-end gap-3 shrink-0">
                            <button onClick={onClose} className="px-4 py-2 text-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                Discard
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="px-4 py-2 border border-border text-text hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors flex items-center gap-2"
                            >
                                <Download size={18} />
                                Download PDF
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isGenerating}
                                className="bg-success hover:bg-green-600 text-white px-6 py-2 rounded shadow transition-all active:scale-95 font-semibold flex items-center gap-2"
                            >
                                <Send size={18} />
                                {isGenerating ? 'Processing...' : 'Approve & Send'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-success rounded-full flex items-center justify-center mb-6">
                            <Check size={40} strokeWidth={3} />
                        </div>
                            <h3 className="text-2xl font-bold text-text mb-2">Proposal Sent Successfully!</h3>
                            <p className="text-icon max-w-md">
                            The proposal for <strong>{title}</strong> has been officially logged and sent to {recipientName}.
                        </p>
                            <button onClick={onClose} className="mt-8 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text rounded-lg font-semibold transition-colors">
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalModal;
