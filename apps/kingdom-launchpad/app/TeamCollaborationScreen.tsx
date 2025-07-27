import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
    Switch,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'editor' | 'viewer' | 'client';
    avatar?: string;
    isActive: boolean;
    lastActive: Date;
    permissions: string[];
    projects: string[];
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'completed' | 'paused';
    teamMembers: string[];
    dueDate?: Date;
    progress: number; // 0-100
    files: ProjectFile[];
    comments: ProjectComment[];
    createdAt: Date;
}

interface ProjectFile {
    id: string;
    name: string;
    type: 'document' | 'image' | 'video' | 'audio' | 'other';
    size: number; // in bytes
    uploadedBy: string;
    uploadedAt: Date;
    url: string;
}

interface ProjectComment {
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    replies: ProjectComment[];
    isResolved: boolean;
}

interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'todo' | 'in-progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    projectId: string;
    createdAt: Date;
}

const TeamCollaborationScreen: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTab, setSelectedTab] = useState<'team' | 'projects' | 'tasks' | 'files'>('team');
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newMember, setNewMember] = useState<Partial<TeamMember>>({});
    const [newProject, setNewProject] = useState<Partial<Project>>({});
    const [newTask, setNewTask] = useState<Partial<Task>>({});
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Mock data
    useEffect(() => {
        setTeamMembers([
            {
                id: '1',
                name: 'John Smith',
                email: 'john@kingdomcollective.pro',
                role: 'owner',
                isActive: true,
                lastActive: new Date(),
                permissions: ['all'],
                projects: ['1', '2']
            },
            {
                id: '2',
                name: 'Sarah Johnson',
                email: 'sarah@kingdomcollective.pro',
                role: 'admin',
                isActive: true,
                lastActive: new Date('2024-01-20'),
                permissions: ['edit', 'comment', 'upload'],
                projects: ['1']
            },
            {
                id: '3',
                name: 'Mike Davis',
                email: 'mike@kingdomcollective.pro',
                role: 'editor',
                isActive: false,
                lastActive: new Date('2024-01-15'),
                permissions: ['edit', 'comment'],
                projects: ['2']
            }
        ]);

        setProjects([
            {
                id: '1',
                name: 'Course Launch 2024',
                description: 'Launch of the new faith-based business course',
                status: 'active',
                teamMembers: ['1', '2'],
                dueDate: new Date('2024-03-01'),
                progress: 65,
                files: [
                    {
                        id: '1',
                        name: 'Course Outline.pdf',
                        type: 'document',
                        size: 1024000,
                        uploadedBy: '1',
                        uploadedAt: new Date('2024-01-20'),
                        url: 'https://example.com/file1.pdf'
                    }
                ],
                comments: [
                    {
                        id: '1',
                        author: '2',
                        content: 'Great progress on the course outline!',
                        timestamp: new Date('2024-01-20'),
                        replies: [],
                        isResolved: false
                    }
                ],
                createdAt: new Date('2024-01-01')
            },
            {
                id: '2',
                name: 'Website Redesign',
                description: 'Redesign the main website with new branding',
                status: 'planning',
                teamMembers: ['1', '3'],
                progress: 25,
                files: [],
                comments: [],
                createdAt: new Date('2024-01-10')
            }
        ]);

        setTasks([
            {
                id: '1',
                title: 'Review course content',
                description: 'Review and approve all course modules',
                assignedTo: '2',
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date('2024-01-25'),
                projectId: '1',
                createdAt: new Date('2024-01-15')
            },
            {
                id: '2',
                title: 'Create launch video',
                description: 'Record and edit the course launch video',
                assignedTo: '1',
                status: 'todo',
                priority: 'medium',
                dueDate: new Date('2024-02-01'),
                projectId: '1',
                createdAt: new Date('2024-01-18')
            }
        ]);
    }, []);

    const addTeamMember = () => {
        if (!newMember.name || !newMember.email || !newMember.role) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const member: TeamMember = {
            id: Date.now().toString(),
            name: newMember.name,
            email: newMember.email,
            role: newMember.role,
            isActive: true,
            lastActive: new Date(),
            permissions: getPermissionsForRole(newMember.role),
            projects: []
        };

        setTeamMembers([...teamMembers, member]);
        setNewMember({});
        setShowMemberModal(false);
        Alert.alert('Success', 'Team member added successfully!');
    };

    const createProject = () => {
        if (!newProject.name || !newProject.description) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const project: Project = {
            id: Date.now().toString(),
            name: newProject.name,
            description: newProject.description,
            status: 'planning',
            teamMembers: newProject.teamMembers || [],
            dueDate: newProject.dueDate,
            progress: 0,
            files: [],
            comments: [],
            createdAt: new Date()
        };

        setProjects([...projects, project]);
        setNewProject({});
        setShowProjectModal(false);
        Alert.alert('Success', 'Project created successfully!');
    };

    const createTask = () => {
        if (!newTask.title || !newTask.assignedTo || !newTask.projectId) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const task: Task = {
            id: Date.now().toString(),
            title: newTask.title,
            description: newTask.description || '',
            assignedTo: newTask.assignedTo,
            status: 'todo',
            priority: newTask.priority || 'medium',
            dueDate: newTask.dueDate,
            projectId: newTask.projectId,
            createdAt: new Date()
        };

        setTasks([...tasks, task]);
        setNewTask({});
        setShowTaskModal(false);
        Alert.alert('Success', 'Task created successfully!');
    };

    const getPermissionsForRole = (role: string) => {
        switch (role) {
            case 'owner': return ['all'];
            case 'admin': return ['edit', 'comment', 'upload', 'manage-team'];
            case 'editor': return ['edit', 'comment', 'upload'];
            case 'viewer': return ['view', 'comment'];
            case 'client': return ['view'];
            default: return ['view'];
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'owner': return '#f44336';
            case 'admin': return '#FF9800';
            case 'editor': return '#2196F3';
            case 'viewer': return '#4CAF50';
            case 'client': return '#9C27B0';
            default: return '#666';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#4CAF50';
            case 'planning': return '#2196F3';
            case 'completed': return '#9C27B0';
            case 'paused': return '#FF9800';
            default: return '#666';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#f44336';
            case 'medium': return '#FF9800';
            case 'low': return '#4CAF50';
            default: return '#666';
        }
    };

    const renderTeamMembers = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>👥 Team Members ({teamMembers.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowMemberModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Member</Text>
                </TouchableOpacity>
            </View>

            {teamMembers.map(member => (
                <View key={member.id} style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text style={styles.memberEmail}>{member.email}</Text>
                        </View>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(member.role) }]}>
                            <Text style={styles.roleText}>{member.role}</Text>
                        </View>
                    </View>
                    <View style={styles.memberMeta}>
                        <View style={styles.memberStatus}>
                            <View style={[styles.statusDot, { backgroundColor: member.isActive ? '#4CAF50' : '#f44336' }]} />
                            <Text style={styles.statusText}>{member.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                        <Text style={styles.lastActive}>Last active: {member.lastActive.toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.memberProjects}>
                        <Text style={styles.projectsLabel}>Projects: {member.projects.length}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderProjects = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📁 Projects ({projects.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowProjectModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Project</Text>
                </TouchableOpacity>
            </View>

            {projects.map(project => (
                <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => setSelectedProject(project)}
                >
                    <View style={styles.projectHeader}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                            <Text style={styles.statusText}>{project.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.projectDescription}>{project.description}</Text>
                    <View style={styles.projectMeta}>
                        <Text style={styles.projectMembers}>{project.teamMembers.length} members</Text>
                        <Text style={styles.projectFiles}>{project.files.length} files</Text>
                        <Text style={styles.projectComments}>{project.comments.length} comments</Text>
                    </View>
                    <View style={styles.projectProgress}>
                        <Text style={styles.progressText}>{project.progress}% Complete</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
                        </View>
                    </View>
                    {project.dueDate && (
                        <Text style={styles.projectDue}>Due: {project.dueDate.toLocaleDateString()}</Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderTasks = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>✅ Tasks ({tasks.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowTaskModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Task</Text>
                </TouchableOpacity>
            </View>

            {tasks.map(task => {
                const assignedMember = teamMembers.find(m => m.id === task.assignedTo);
                const project = projects.find(p => p.id === task.projectId);

                return (
                    <View key={task.id} style={styles.taskCard}>
                        <View style={styles.taskHeader}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                                <Text style={styles.priorityText}>{task.priority}</Text>
                            </View>
                        </View>
                        <Text style={styles.taskDescription}>{task.description}</Text>
                        <View style={styles.taskMeta}>
                            <Text style={styles.taskAssignee}>Assigned to: {assignedMember?.name || 'Unknown'}</Text>
                            <Text style={styles.taskProject}>Project: {project?.name || 'Unknown'}</Text>
                            <Text style={styles.taskStatus}>{task.status}</Text>
                        </View>
                        {task.dueDate && (
                            <Text style={styles.taskDue}>Due: {task.dueDate.toLocaleDateString()}</Text>
                        )}
                    </View>
                );
            })}
        </View>
    );

    const renderFiles = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📁 File Manager</Text>
            <Text style={styles.sectionDescription}>
                Shared files across all projects
            </Text>

            {projects.map(project =>
                project.files.map(file => (
                    <View key={file.id} style={styles.fileCard}>
                        <View style={styles.fileHeader}>
                            <Ionicons name="document" size={20} color="#667eea" />
                            <Text style={styles.fileName}>{file.name}</Text>
                        </View>
                        <View style={styles.fileMeta}>
                            <Text style={styles.fileType}>{file.type}</Text>
                            <Text style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
                            <Text style={styles.fileUploader}>By: {teamMembers.find(m => m.id === file.uploadedBy)?.name || 'Unknown'}</Text>
                        </View>
                        <Text style={styles.fileDate}>{file.uploadedAt.toLocaleDateString()}</Text>
                    </View>
                ))
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>👥 Team Collaboration</Text>
                <Text style={styles.headerSubtitle}>Manage team, projects, and tasks</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'team' && styles.activeTab]}
                    onPress={() => setSelectedTab('team')}
                >
                    <Ionicons name="people" size={20} color={selectedTab === 'team' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'team' && styles.activeTabText]}>
                        Team
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'projects' && styles.activeTab]}
                    onPress={() => setSelectedTab('projects')}
                >
                    <Ionicons name="folder" size={20} color={selectedTab === 'projects' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'projects' && styles.activeTabText]}>
                        Projects
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'tasks' && styles.activeTab]}
                    onPress={() => setSelectedTab('tasks')}
                >
                    <Ionicons name="checkmark-circle" size={20} color={selectedTab === 'tasks' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'tasks' && styles.activeTabText]}>
                        Tasks
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'files' && styles.activeTab]}
                    onPress={() => setSelectedTab('files')}
                >
                    <Ionicons name="document" size={20} color={selectedTab === 'files' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'files' && styles.activeTabText]}>
                        Files
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{teamMembers.length}</Text>
                        <Text style={styles.statLabel}>Team Members</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{projects.length}</Text>
                        <Text style={styles.statLabel}>Projects</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tasks.length}</Text>
                        <Text style={styles.statLabel}>Tasks</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {projects.reduce((sum, p) => sum + p.files.length, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Files</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'team' && renderTeamMembers()}
                {selectedTab === 'projects' && renderProjects()}
                {selectedTab === 'tasks' && renderTasks()}
                {selectedTab === 'files' && renderFiles()}

                {/* Member Modal */}
                <Modal
                    visible={showMemberModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowMemberModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Team Member</Text>

                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newMember.name}
                                onChangeText={(text) => setNewMember({ ...newMember, name: text })}
                                placeholder="Enter member name"
                            />

                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={newMember.email}
                                onChangeText={(text) => setNewMember({ ...newMember, email: text })}
                                placeholder="Enter email address"
                                keyboardType="email-address"
                            />

                            <Text style={styles.inputLabel}>Role</Text>
                            <View style={styles.radioGroup}>
                                {['owner', 'admin', 'editor', 'viewer', 'client'].map(role => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            styles.radioButton,
                                            newMember.role === role && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewMember({ ...newMember, role: role as any })}
                                    >
                                        <Text style={styles.radioLabel}>{role}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addTeamMember}
                                >
                                    <Text style={styles.modalButtonText}>Add Member</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowMemberModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Project Modal */}
                <Modal
                    visible={showProjectModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowProjectModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Project</Text>

                            <Text style={styles.inputLabel}>Project Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newProject.name}
                                onChangeText={(text) => setNewProject({ ...newProject, name: text })}
                                placeholder="Enter project name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newProject.description}
                                onChangeText={(text) => setNewProject({ ...newProject, description: text })}
                                placeholder="Describe the project..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Due Date (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newProject.dueDate?.toLocaleDateString()}
                                placeholder="Select due date"
                                onFocus={() => {
                                    // In a real app, you'd show a date picker here
                                    setNewProject({ ...newProject, dueDate: new Date() });
                                }}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createProject}
                                >
                                    <Text style={styles.modalButtonText}>Create Project</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowProjectModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Task Modal */}
                <Modal
                    visible={showTaskModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowTaskModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Task</Text>

                            <Text style={styles.inputLabel}>Task Title</Text>
                            <TextInput
                                style={styles.input}
                                value={newTask.title}
                                onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                                placeholder="Enter task title"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newTask.description}
                                onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                                placeholder="Describe the task..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Assign To</Text>
                            <View style={styles.dropdown}>
                                {teamMembers.map(member => (
                                    <TouchableOpacity
                                        key={member.id}
                                        style={[
                                            styles.dropdownOption,
                                            newTask.assignedTo === member.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewTask({ ...newTask, assignedTo: member.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{member.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Project</Text>
                            <View style={styles.dropdown}>
                                {projects.map(project => (
                                    <TouchableOpacity
                                        key={project.id}
                                        style={[
                                            styles.dropdownOption,
                                            newTask.projectId === project.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewTask({ ...newTask, projectId: project.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{project.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Priority</Text>
                            <View style={styles.radioGroup}>
                                {['low', 'medium', 'high'].map(priority => (
                                    <TouchableOpacity
                                        key={priority}
                                        style={[
                                            styles.radioButton,
                                            newTask.priority === priority && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewTask({ ...newTask, priority: priority as any })}
                                    >
                                        <Text style={styles.radioLabel}>{priority}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createTask}
                                >
                                    <Text style={styles.modalButtonText}>Create Task</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowTaskModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#667eea10',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#667eea',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    memberCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    memberHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    memberEmail: {
        fontSize: 14,
        color: '#666',
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roleText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    memberMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    memberStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: '#666',
    },
    lastActive: {
        fontSize: 12,
        color: '#999',
    },
    memberProjects: {
        marginTop: 4,
    },
    projectsLabel: {
        fontSize: 12,
        color: '#666',
    },
    projectCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    projectName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    projectDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    projectMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    projectMembers: {
        fontSize: 12,
        color: '#666',
    },
    projectFiles: {
        fontSize: 12,
        color: '#666',
    },
    projectComments: {
        fontSize: 12,
        color: '#666',
    },
    projectProgress: {
        marginBottom: 8,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    projectDue: {
        fontSize: 12,
        color: '#999',
    },
    taskCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    taskMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    taskAssignee: {
        fontSize: 12,
        color: '#666',
    },
    taskProject: {
        fontSize: 12,
        color: '#666',
    },
    taskStatus: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    taskDue: {
        fontSize: 12,
        color: '#999',
    },
    fileCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    fileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    fileName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    fileMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    fileType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    fileSize: {
        fontSize: 12,
        color: '#666',
    },
    fileUploader: {
        fontSize: 12,
        color: '#666',
    },
    fileDate: {
        fontSize: 12,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    radioButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    radioButtonActive: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
        textTransform: 'capitalize',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownOptionSelected: {
        backgroundColor: '#667eea10',
    },
    dropdownOptionText: {
        fontSize: 14,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TeamCollaborationScreen; 