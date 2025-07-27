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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorPicker } from 'react-native-color-picker';

interface BrandKit {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    colors: BrandColor[];
    fonts: BrandFont[];
    logos: BrandLogo[];
    templates: BrandTemplate[];
    createdAt: Date;
    lastModified: Date;
}

interface BrandColor {
    id: string;
    name: string;
    hex: string;
    rgb: { r: number; g: number; b: number };
    usage: string[];
    isPrimary: boolean;
}

interface BrandFont {
    id: string;
    name: string;
    family: string;
    weights: string[];
    usage: string[];
    isPrimary: boolean;
}

interface BrandLogo {
    id: string;
    name: string;
    type: 'primary' | 'secondary' | 'icon' | 'favicon';
    fileUrl: string;
    formats: string[];
    usage: string[];
}

interface BrandTemplate {
    id: string;
    name: string;
    type: 'social' | 'email' | 'landing' | 'presentation';
    previewUrl: string;
    colors: string[];
    fonts: string[];
    isActive: boolean;
}

const BrandKitScreen: React.FC = () => {
    const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'colors' | 'fonts' | 'logos' | 'templates'>('overview');
    const [showKitModal, setShowKitModal] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [showFontModal, setShowFontModal] = useState(false);
    const [showLogoModal, setShowLogoModal] = useState(false);
    const [newKit, setNewKit] = useState<Partial<BrandKit>>({});
    const [newColor, setNewColor] = useState<Partial<BrandColor>>({});
    const [newFont, setNewFont] = useState<Partial<BrandFont>>({});
    const [newLogo, setNewLogo] = useState<Partial<BrandLogo>>({});
    const [selectedKit, setSelectedKit] = useState<BrandKit | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('#667eea');

    // Mock data
    useEffect(() => {
        setBrandKits([
            {
                id: '1',
                name: 'Kingdom Collective Pro',
                description: 'Main brand kit for Kingdom Collective',
                isActive: true,
                colors: [
                    {
                        id: '1',
                        name: 'Primary Blue',
                        hex: '#667eea',
                        rgb: { r: 102, g: 126, b: 234 },
                        usage: ['Primary buttons', 'Links', 'Accents'],
                        isPrimary: true
                    },
                    {
                        id: '2',
                        name: 'Secondary Purple',
                        hex: '#764ba2',
                        rgb: { r: 118, g: 75, b: 162 },
                        usage: ['Secondary elements', 'Gradients'],
                        isPrimary: false
                    },
                    {
                        id: '3',
                        name: 'Faith Gold',
                        hex: '#FFD700',
                        rgb: { r: 255, g: 215, b: 0 },
                        usage: ['Highlights', 'Call-to-action'],
                        isPrimary: false
                    }
                ],
                fonts: [
                    {
                        id: '1',
                        name: 'Kingdom Sans',
                        family: 'Inter',
                        weights: ['400', '500', '600', '700'],
                        usage: ['Headings', 'Body text'],
                        isPrimary: true
                    },
                    {
                        id: '2',
                        name: 'Faith Serif',
                        family: 'Playfair Display',
                        weights: ['400', '700'],
                        usage: ['Titles', 'Quotes'],
                        isPrimary: false
                    }
                ],
                logos: [
                    {
                        id: '1',
                        name: 'Primary Logo',
                        type: 'primary',
                        fileUrl: 'https://example.com/logo-primary.png',
                        formats: ['PNG', 'SVG', 'JPG'],
                        usage: ['Website', 'Business cards', 'Presentations']
                    },
                    {
                        id: '2',
                        name: 'Icon Only',
                        type: 'icon',
                        fileUrl: 'https://example.com/logo-icon.png',
                        formats: ['PNG', 'SVG'],
                        usage: ['Favicon', 'Social media', 'App icons']
                    }
                ],
                templates: [
                    {
                        id: '1',
                        name: 'Social Media Template',
                        type: 'social',
                        previewUrl: 'https://example.com/template-social.jpg',
                        colors: ['#667eea', '#764ba2'],
                        fonts: ['Kingdom Sans'],
                        isActive: true
                    },
                    {
                        id: '2',
                        name: 'Email Template',
                        type: 'email',
                        previewUrl: 'https://example.com/template-email.jpg',
                        colors: ['#667eea', '#FFD700'],
                        fonts: ['Kingdom Sans', 'Faith Serif'],
                        isActive: true
                    }
                ],
                createdAt: new Date('2024-01-01'),
                lastModified: new Date('2024-01-20')
            }
        ]);
        setSelectedKit(brandKits[0]);
    }, []);

    const createBrandKit = () => {
        if (!newKit.name) {
            Alert.alert('Error', 'Please enter a brand kit name');
            return;
        }

        const kit: BrandKit = {
            id: Date.now().toString(),
            name: newKit.name,
            description: newKit.description || '',
            isActive: true,
            colors: [],
            fonts: [],
            logos: [],
            templates: [],
            createdAt: new Date(),
            lastModified: new Date()
        };

        setBrandKits([...brandKits, kit]);
        setNewKit({});
        setShowKitModal(false);
        Alert.alert('Success', 'Brand kit created successfully!');
    };

    const addColor = () => {
        if (!newColor.name || !newColor.hex) {
            Alert.alert('Error', 'Please enter color name and hex value');
            return;
        }

        if (!selectedKit) {
            Alert.alert('Error', 'Please select a brand kit first');
            return;
        }

        const color: BrandColor = {
            id: Date.now().toString(),
            name: newColor.name,
            hex: newColor.hex,
            rgb: hexToRgb(newColor.hex),
            usage: newColor.usage || [],
            isPrimary: newColor.isPrimary || false
        };

        const updatedKit = {
            ...selectedKit,
            colors: [...selectedKit.colors, color],
            lastModified: new Date()
        };

        setBrandKits(brandKits.map(kit =>
            kit.id === selectedKit.id ? updatedKit : kit
        ));
        setSelectedKit(updatedKit);
        setNewColor({});
        setShowColorModal(false);
        Alert.alert('Success', 'Color added successfully!');
    };

    const addFont = () => {
        if (!newFont.name || !newFont.family) {
            Alert.alert('Error', 'Please enter font name and family');
            return;
        }

        if (!selectedKit) {
            Alert.alert('Error', 'Please select a brand kit first');
            return;
        }

        const font: BrandFont = {
            id: Date.now().toString(),
            name: newFont.name,
            family: newFont.family,
            weights: newFont.weights || ['400'],
            usage: newFont.usage || [],
            isPrimary: newFont.isPrimary || false
        };

        const updatedKit = {
            ...selectedKit,
            fonts: [...selectedKit.fonts, font],
            lastModified: new Date()
        };

        setBrandKits(brandKits.map(kit =>
            kit.id === selectedKit.id ? updatedKit : kit
        ));
        setSelectedKit(updatedKit);
        setNewFont({});
        setShowFontModal(false);
        Alert.alert('Success', 'Font added successfully!');
    };

    const addLogo = () => {
        if (!newLogo.name || !newLogo.type) {
            Alert.alert('Error', 'Please enter logo name and type');
            return;
        }

        if (!selectedKit) {
            Alert.alert('Error', 'Please select a brand kit first');
            return;
        }

        const logo: BrandLogo = {
            id: Date.now().toString(),
            name: newLogo.name,
            type: newLogo.type,
            fileUrl: newLogo.fileUrl || 'https://example.com/logo.png',
            formats: newLogo.formats || ['PNG'],
            usage: newLogo.usage || []
        };

        const updatedKit = {
            ...selectedKit,
            logos: [...selectedKit.logos, logo],
            lastModified: new Date()
        };

        setBrandKits(brandKits.map(kit =>
            kit.id === selectedKit.id ? updatedKit : kit
        ));
        setSelectedKit(updatedKit);
        setNewLogo({});
        setShowLogoModal(false);
        Alert.alert('Success', 'Logo added successfully!');
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const renderOverview = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎨 Brand Kit Overview</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowKitModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>New Kit</Text>
                </TouchableOpacity>
            </View>

            {brandKits.map(kit => (
                <TouchableOpacity
                    key={kit.id}
                    style={[styles.kitCard, kit.isActive && styles.activeKitCard]}
                    onPress={() => setSelectedKit(kit)}
                >
                    <View style={styles.kitHeader}>
                        <Text style={styles.kitName}>{kit.name}</Text>
                        {kit.isActive && (
                            <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>Active</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.kitDescription}>{kit.description}</Text>
                    <View style={styles.kitStats}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{kit.colors.length}</Text>
                            <Text style={styles.statLabel}>Colors</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{kit.fonts.length}</Text>
                            <Text style={styles.statLabel}>Fonts</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{kit.logos.length}</Text>
                            <Text style={styles.statLabel}>Logos</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>{kit.templates.length}</Text>
                            <Text style={styles.statLabel}>Templates</Text>
                        </View>
                    </View>
                    <Text style={styles.kitDate}>
                        Last modified: {kit.lastModified.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderColors = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎨 Brand Colors</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowColorModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Color</Text>
                </TouchableOpacity>
            </View>

            {selectedKit?.colors.map(color => (
                <View key={color.id} style={styles.colorCard}>
                    <View style={styles.colorHeader}>
                        <View style={[styles.colorSwatch, { backgroundColor: color.hex }]} />
                        <View style={styles.colorInfo}>
                            <Text style={styles.colorName}>{color.name}</Text>
                            <Text style={styles.colorHex}>{color.hex}</Text>
                            <Text style={styles.colorRgb}>
                                RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                            </Text>
                        </View>
                        {color.isPrimary && (
                            <View style={styles.primaryBadge}>
                                <Text style={styles.primaryBadgeText}>Primary</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.colorUsage}>
                        <Text style={styles.usageLabel}>Usage:</Text>
                        {color.usage.map((use, index) => (
                            <Text key={index} style={styles.usageItem}>• {use}</Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderFonts = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Brand Fonts</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowFontModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Font</Text>
                </TouchableOpacity>
            </View>

            {selectedKit?.fonts.map(font => (
                <View key={font.id} style={styles.fontCard}>
                    <View style={styles.fontHeader}>
                        <Text style={[styles.fontName, { fontFamily: font.family }]}>
                            {font.name}
                        </Text>
                        {font.isPrimary && (
                            <View style={styles.primaryBadge}>
                                <Text style={styles.primaryBadgeText}>Primary</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.fontFamily}>{font.family}</Text>
                    <View style={styles.fontWeights}>
                        <Text style={styles.weightsLabel}>Weights:</Text>
                        {font.weights.map(weight => (
                            <Text key={weight} style={styles.weightTag}>{weight}</Text>
                        ))}
                    </View>
                    <View style={styles.fontUsage}>
                        <Text style={styles.usageLabel}>Usage:</Text>
                        {font.usage.map((use, index) => (
                            <Text key={index} style={styles.usageItem}>• {use}</Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderLogos = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🖼️ Brand Logos</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowLogoModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Logo</Text>
                </TouchableOpacity>
            </View>

            {selectedKit?.logos.map(logo => (
                <View key={logo.id} style={styles.logoCard}>
                    <View style={styles.logoHeader}>
                        <View style={styles.logoPreview}>
                            <Ionicons name="image" size={40} color="#ddd" />
                        </View>
                        <View style={styles.logoInfo}>
                            <Text style={styles.logoName}>{logo.name}</Text>
                            <Text style={styles.logoType}>{logo.type}</Text>
                            <Text style={styles.logoFormats}>
                                Formats: {logo.formats.join(', ')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.logoUsage}>
                        <Text style={styles.usageLabel}>Usage:</Text>
                        {logo.usage.map((use, index) => (
                            <Text key={index} style={styles.usageItem}>• {use}</Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderTemplates = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 Brand Templates</Text>
            <Text style={styles.sectionDescription}>
                Pre-designed templates using your brand elements
            </Text>

            {selectedKit?.templates.map(template => (
                <View key={template.id} style={styles.templateCard}>
                    <View style={styles.templateHeader}>
                        <View style={styles.templatePreview}>
                            <Ionicons name="document" size={40} color="#ddd" />
                        </View>
                        <View style={styles.templateInfo}>
                            <Text style={styles.templateName}>{template.name}</Text>
                            <Text style={styles.templateType}>{template.type}</Text>
                            <Text style={styles.templateStatus}>
                                {template.isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.templateColors}>
                        <Text style={styles.colorsLabel}>Colors:</Text>
                        {template.colors.map((color, index) => (
                            <View key={index} style={[styles.colorDot, { backgroundColor: color }]} />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>🎨 Brand Kit Manager</Text>
                <Text style={styles.headerSubtitle}>Manage colors, fonts, logos, and templates</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
                    onPress={() => setSelectedTab('overview')}
                >
                    <Ionicons name="grid" size={20} color={selectedTab === 'overview' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
                        Overview
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'colors' && styles.activeTab]}
                    onPress={() => setSelectedTab('colors')}
                >
                    <Ionicons name="color-palette" size={20} color={selectedTab === 'colors' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'colors' && styles.activeTabText]}>
                        Colors
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'fonts' && styles.activeTab]}
                    onPress={() => setSelectedTab('fonts')}
                >
                    <Ionicons name="text" size={20} color={selectedTab === 'fonts' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'fonts' && styles.activeTabText]}>
                        Fonts
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'logos' && styles.activeTab]}
                    onPress={() => setSelectedTab('logos')}
                >
                    <Ionicons name="image" size={20} color={selectedTab === 'logos' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'logos' && styles.activeTabText]}>
                        Logos
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'templates' && styles.activeTab]}
                    onPress={() => setSelectedTab('templates')}
                >
                    <Ionicons name="document" size={20} color={selectedTab === 'templates' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'templates' && styles.activeTabText]}>
                        Templates
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{brandKits.length}</Text>
                        <Text style={styles.statLabel}>Brand Kits</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {selectedKit?.colors.length || 0}
                        </Text>
                        <Text style={styles.statLabel}>Colors</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {selectedKit?.fonts.length || 0}
                        </Text>
                        <Text style={styles.statLabel}>Fonts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {selectedKit?.logos.length || 0}
                        </Text>
                        <Text style={styles.statLabel}>Logos</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'overview' && renderOverview()}
                {selectedTab === 'colors' && renderColors()}
                {selectedTab === 'fonts' && renderFonts()}
                {selectedTab === 'logos' && renderLogos()}
                {selectedTab === 'templates' && renderTemplates()}

                {/* Kit Modal */}
                <Modal
                    visible={showKitModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowKitModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Brand Kit</Text>

                            <Text style={styles.inputLabel}>Kit Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newKit.name}
                                onChangeText={(text) => setNewKit({ ...newKit, name: text })}
                                placeholder="Enter brand kit name"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newKit.description}
                                onChangeText={(text) => setNewKit({ ...newKit, description: text })}
                                placeholder="Describe your brand kit..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createBrandKit}
                                >
                                    <Text style={styles.modalButtonText}>Create Kit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowKitModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Color Modal */}
                <Modal
                    visible={showColorModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowColorModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Brand Color</Text>

                            <Text style={styles.inputLabel}>Color Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newColor.name}
                                onChangeText={(text) => setNewColor({ ...newColor, name: text })}
                                placeholder="e.g., Primary Blue"
                            />

                            <Text style={styles.inputLabel}>Hex Color</Text>
                            <TextInput
                                style={styles.input}
                                value={newColor.hex}
                                onChangeText={(text) => setNewColor({ ...newColor, hex: text })}
                                placeholder="#667eea"
                            />

                            <Text style={styles.inputLabel}>Usage (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newColor.usage?.join('\n')}
                                onChangeText={(text) => setNewColor({
                                    ...newColor,
                                    usage: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Primary buttons\nLinks\nAccents"
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Primary Color</Text>
                                <Switch
                                    value={newColor.isPrimary}
                                    onValueChange={(value) => setNewColor({ ...newColor, isPrimary: value })}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addColor}
                                >
                                    <Text style={styles.modalButtonText}>Add Color</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowColorModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Font Modal */}
                <Modal
                    visible={showFontModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowFontModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Brand Font</Text>

                            <Text style={styles.inputLabel}>Font Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newFont.name}
                                onChangeText={(text) => setNewFont({ ...newFont, name: text })}
                                placeholder="e.g., Kingdom Sans"
                            />

                            <Text style={styles.inputLabel}>Font Family</Text>
                            <TextInput
                                style={styles.input}
                                value={newFont.family}
                                onChangeText={(text) => setNewFont({ ...newFont, family: text })}
                                placeholder="e.g., Inter"
                            />

                            <Text style={styles.inputLabel}>Weights (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={newFont.weights?.join(', ')}
                                onChangeText={(text) => setNewFont({
                                    ...newFont,
                                    weights: text.split(',').map(w => w.trim())
                                })}
                                placeholder="400, 500, 600, 700"
                            />

                            <Text style={styles.inputLabel}>Usage (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newFont.usage?.join('\n')}
                                onChangeText={(text) => setNewFont({
                                    ...newFont,
                                    usage: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Headings\nBody text\nQuotes"
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Primary Font</Text>
                                <Switch
                                    value={newFont.isPrimary}
                                    onValueChange={(value) => setNewFont({ ...newFont, isPrimary: value })}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addFont}
                                >
                                    <Text style={styles.modalButtonText}>Add Font</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowFontModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Logo Modal */}
                <Modal
                    visible={showLogoModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowLogoModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Brand Logo</Text>

                            <Text style={styles.inputLabel}>Logo Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newLogo.name}
                                onChangeText={(text) => setNewLogo({ ...newLogo, name: text })}
                                placeholder="e.g., Primary Logo"
                            />

                            <Text style={styles.inputLabel}>Logo Type</Text>
                            <View style={styles.radioGroup}>
                                {['primary', 'secondary', 'icon', 'favicon'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newLogo.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewLogo({ ...newLogo, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>File URL</Text>
                            <TextInput
                                style={styles.input}
                                value={newLogo.fileUrl}
                                onChangeText={(text) => setNewLogo({ ...newLogo, fileUrl: text })}
                                placeholder="https://example.com/logo.png"
                            />

                            <Text style={styles.inputLabel}>Formats</Text>
                            <TextInput
                                style={styles.input}
                                value={newLogo.formats?.join(', ')}
                                onChangeText={(text) => setNewLogo({
                                    ...newLogo,
                                    formats: text.split(',').map(f => f.trim())
                                })}
                                placeholder="PNG, SVG, JPG"
                            />

                            <Text style={styles.inputLabel}>Usage (Optional)</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newLogo.usage?.join('\n')}
                                onChangeText={(text) => setNewLogo({
                                    ...newLogo,
                                    usage: text.split('\n').filter(line => line.trim())
                                })}
                                placeholder="Website\nBusiness cards\nPresentations"
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={addLogo}
                                >
                                    <Text style={styles.modalButtonText}>Add Logo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowLogoModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    kitCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    activeKitCard: {
        borderColor: '#667eea',
        backgroundColor: '#667eea10',
    },
    kitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    kitName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    activeBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    kitDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    kitStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#667eea',
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    kitDate: {
        fontSize: 12,
        color: '#999',
    },
    colorCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    colorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    colorSwatch: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    colorInfo: {
        flex: 1,
    },
    colorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    colorHex: {
        fontSize: 14,
        color: '#666',
    },
    colorRgb: {
        fontSize: 12,
        color: '#999',
    },
    primaryBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    primaryBadgeText: {
        fontSize: 10,
        color: '#333',
        fontWeight: 'bold',
    },
    colorUsage: {
        marginTop: 8,
    },
    usageLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    usageItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    fontCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    fontHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    fontName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    fontFamily: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    fontWeights: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    weightsLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    weightTag: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#667eea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 4,
    },
    fontUsage: {
        marginTop: 8,
    },
    logoCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    logoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    logoPreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoInfo: {
        flex: 1,
    },
    logoName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    logoType: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    logoFormats: {
        fontSize: 12,
        color: '#999',
    },
    logoUsage: {
        marginTop: 8,
    },
    templateCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    templateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    templatePreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    templateInfo: {
        flex: 1,
    },
    templateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    templateType: {
        fontSize: 14,
        color: '#666',
        textTransform: 'capitalize',
    },
    templateStatus: {
        fontSize: 12,
        color: '#999',
    },
    templateColors: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorsLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
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
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 16,
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

export default BrandKitScreen; 