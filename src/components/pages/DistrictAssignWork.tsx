
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    Users, Briefcase, Plus, Calendar,
    ArrowLeft, UserPlus, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import CredentialManager from '../admin/CredentialManager'; // Import existing component
import { userInstitutions } from '../../data/user_institutions'; // Mock data for now, ideally fetch from DB

// --- Interfaces ---

interface TeamMember {
    id: string;
    username: string;
    role: string;
    entity_name: string;
    created_at: string;
}

interface WorkAssignment {
    id: string;
    title: string;
    description: string;
    assigned_to: string;
    assigned_by: string;
    status: 'pending' | 'in_progress' | 'completed' | 'verified';
    due_date: string;
    created_at: string;
    assignee_name?: string;
    target_type?: 'institution' | 'scheme' | 'general' | 'module'; target_id?: string;
    target_name?: string; // Denormalized for display
}

interface DistrictAssignWorkProps {
    onBack: () => void;
}

export default function DistrictAssignWork({ onBack }: DistrictAssignWorkProps) {
    const [activeTab, setActiveTab] = useState<'assignments' | 'team' | 'partners'>('assignments');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [assignments, setAssignments] = useState<WorkAssignment[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', username: '', password: '' });

    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        target_type: 'general',
        target_id: ''
    });

    // --- Data Fetching ---

    useEffect(() => {
        fetchTeamMembers();
        fetchAssignments();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'district_team')
                .order('created_at', { ascending: false });
            if (data) setTeamMembers(data);
        } catch (error) { console.error("Error fetching team:", error); }
    };

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('work_assignments')
                .select(`*, assignee:users!assigned_to(entity_name)`)
                .order('created_at', { ascending: false });

            if (data) {
                const formatted = data.map((item: any) => ({
                    ...item,
                    assignee_name: item.assignee?.entity_name || 'Unknown'
                }));
                setAssignments(formatted);
            }
        } catch (error) { console.error("Error fetching assignments:", error); }
        finally { setLoading(false); }
    };

    // --- Handlers ---

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('users').insert([{
                entity_name: newMember.name,
                username: newMember.username,
                password_hash: newMember.password,
                role: 'district_team',
                created_at: new Date().toISOString()
            }]);
            if (error) throw error;
            setShowAddMember(false);
            setNewMember({ name: '', username: '', password: '' });
            fetchTeamMembers();
            alert('Team member added successfully!');
        } catch (error: any) { alert('Error adding member: ' + error.message); }
    };

    const handleAddAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        // Resolve Target Name
        let targetName = 'General Task';
        if (newAssignment.target_type === 'institution') {
            targetName = userInstitutions.find(i => i.id === newAssignment.target_id)?.name || 'Unknown Institution';
        } else if (newAssignment.target_type === 'module') {
            targetName = newAssignment.target_id; // For modules, ID is the name
        }

        try {
            // Store target info in description since we haven't migrated schema yet
            const enhancedDescription = `[Target: ${newAssignment.target_type} - ${targetName}] \n${newAssignment.description}`;

            const { error } = await supabase.from('work_assignments').insert([{
                title: newAssignment.title,
                description: enhancedDescription,
                assigned_to: newAssignment.assigned_to,
                due_date: newAssignment.due_date,
                status: 'pending',
                created_at: new Date().toISOString()
            }]);

            if (error) throw error;

            setShowAddAssignment(false);
            setNewAssignment({ title: '', description: '', assigned_to: '', due_date: '', target_type: 'general', target_id: '' });
            fetchAssignments();
            alert('Work assigned successfully!');
        } catch (error: any) { alert('Error assigning work: ' + error.message); }
    };

    const handleDeleteMember = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}?`)) return;
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (!error) fetchTeamMembers();
    };

    const updateStatus = async (id: string, status: WorkAssignment['status']) => {
        const { error } = await supabase.from('work_assignments').update({ status }).eq('id', id);
        if (!error) fetchAssignments();
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">District Delegation</h1>
                        <p className="text-sm text-slate-500">Manage team, assignments, and partner credentials</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('assignments')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'assignments' ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Work Assignments</button>
                    <button onClick={() => setActiveTab('team')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'team' ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>District Team</button>
                    <button onClick={() => setActiveTab('partners')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'partners' ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Partner Credentials</button>
                </div>
            </div>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full">

                {/* --- Assignments Tab --- */}
                {activeTab === 'assignments' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-500" /> Active Tasks
                            </h2>
                            <button onClick={() => setShowAddAssignment(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"><Plus size={18} /> Assign Work</button>
                        </div>

                        {loading ? <div className="text-center py-12 text-slate-500">Loading assignments...</div> : assignments.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No tasks assigned yet</h3>
                                <p className="text-slate-500">Create a new assignment to get started.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {assignments.map(task => (
                                    <div key={task.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-slate-800 dark:text-white">{task.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : task.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>{task.status.replace('_', ' ')}</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 whitespace-pre-wrap">{task.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <div className="flex items-center gap-1"><Users className="w-3 h-3" /><span>Assigned to: <span className="font-medium text-slate-700 dark:text-slate-300">{task.assignee_name}</span></span></div>
                                                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No Date'}</span></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {task.status === 'pending' && <button onClick={() => updateStatus(task.id, 'in_progress')} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Start</button>}
                                                {task.status === 'in_progress' && <button onClick={() => updateStatus(task.id, 'completed')} className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">Complete</button>}
                                                <button onClick={() => updateStatus(task.id, 'verified')} className="text-xs text-slate-400 hover:text-slate-600">Verify</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- Team Management Tab --- */}
                {activeTab === 'team' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Users className="w-5 h-5 text-purple-500" /> District Team</h2><button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"><UserPlus size={18} /> Add Member</button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamMembers.map(member => (
                                <div key={member.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                                    <button onClick={() => handleDeleteMember(member.id, member.entity_name)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                    <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">{member.entity_name.charAt(0)}</div><div><h3 className="font-bold text-slate-900 dark:text-white">{member.entity_name}</h3><p className="text-xs text-slate-500">District Team Member</p></div></div>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm space-y-2"><div className="flex justify-between"><span className="text-slate-500">Username:</span><span className="font-mono font-medium">{member.username}</span></div><div className="flex justify-between"><span className="text-slate-500">Joined:</span><span>{new Date(member.created_at).toLocaleDateString()}</span></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Partners (Credential Manager) Tab --- */}
                {activeTab === 'partners' && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[600px]">
                        <CredentialManager />
                    </div>
                )}
            </div>

            {/* --- Assigment Modal --- */}
            {showAddAssignment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Assign New Task</h3><button onClick={() => setShowAddAssignment(false)} className="text-slate-400 hover:text-slate-600">x</button></div>
                        <form onSubmit={handleAddAssignment} className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label><input type="text" required placeholder="e.g. Verify Institution Data" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} /></div>

                            {/* Target Selector */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Type</label>
                                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newAssignment.target_type} onChange={e => setNewAssignment({ ...newAssignment, target_type: e.target.value as any })}>
                                        <option value="general">General Task</option>
                                        <option value="institution">Institution</option>
                                        <option value="scheme">Scheme</option>
                                        <option value="module">Data Entry Module</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Target</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                        value={newAssignment.target_id}
                                        onChange={e => setNewAssignment({ ...newAssignment, target_id: e.target.value })}
                                        disabled={newAssignment.target_type === 'general'}
                                    >
                                        <option value="">-- Select --</option>
                                        {newAssignment.target_type === 'institution' && userInstitutions.map(i => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                        ))}
                                        {newAssignment.target_type === 'module' && [
                                            'Institution Profile', 'Infrastructure Details', 'Human Resource/Trainers', 'Trainee Enrollment', 'Assessment & Certification', 'Placements'
                                        ].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label><textarea rows={3} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To</label><select required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newAssignment.assigned_to} onChange={e => setNewAssignment({ ...newAssignment, assigned_to: e.target.value })}><option value="">Select Member</option>{teamMembers.map(m => (<option key={m.id} value={m.id}>{m.entity_name}</option>))}</select></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label><input type="date" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newAssignment.due_date} onChange={e => setNewAssignment({ ...newAssignment, due_date: e.target.value })} /></div>
                            </div>
                            <div className="pt-4 flex gap-3"><button type="button" onClick={() => setShowAddAssignment(false)} className="flex-1 py-2 border rounded-lg hover:bg-slate-50 text-slate-600">Cancel</button><button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Assign Task</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Team Member Modal */}
            {showAddMember && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Team Member</h3><button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-slate-600"><Trash2 className="w-5 h-5" /></button></div>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label><input type="text" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label><input type="text" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newMember.username} onChange={e => setNewMember({ ...newMember, username: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label><input type="password" required className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" value={newMember.password} onChange={e => setNewMember({ ...newMember, password: e.target.value })} /></div>
                            <div className="pt-4 flex gap-3"><button type="button" onClick={() => setShowAddMember(false)} className="flex-1 py-2 border rounded-lg hover:bg-slate-50 text-slate-600">Cancel</button><button type="submit" className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Create Account</button></div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
