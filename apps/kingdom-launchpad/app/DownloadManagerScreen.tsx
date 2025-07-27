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
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

interface DigitalProduct {
    id: string;
    name: string;
    description: string;
    type: 'ebook' | 'course' | 'template' | 'audio' | 'video' | 'bundle';
    fileUrl: string;
    fileSize: number;
    fileType: string;
    isActive: boolean;
    price: number;
    accessType: 'free' | 'email' | 'payment' | 'custom';
    downloadCount: number;
    createdAt: Date;
    tags: string[];
}

interface AccessGate {
    id: string;
    name: string;
    productId: string;
    gateType: 'email' | 'payment' | 'custom';
    customMessage?: string;
    redirectUrl?: string;
    isActive: boolean;
    unlockCount: number;
}

interface DownloadLink {
    id: string;
    productId: string;
    customerEmail: string;
    accessToken: string;
    expiresAt?: Date;
    downloadCount: number;
    lastDownloaded?: Date;
    isActive: boolean;
}

const DownloadManagerScreen: React.FC = () => {
    const [products, setProducts] = useState<DigitalProduct[]>([]);
    const [accessGates, setAccessGates] = useState<AccessGate[]>([]);
    const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
    const [selectedTab, setSelectedTab] = useState<'products' | 'gates' | 'links'>('products');
    const [showProductModal, setShowProductModal] = useState(false);
    const [showGateModal, setShowGateModal] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<DigitalProduct>>({});
    const [newGate, setNewGate] = useState<Partial<AccessGate>>({});
    const [selectedFile, setSelectedFile] = useState<any>(null);

    // Mock data
    useEffect(() => {
        setProducts([
            {
                id: '1',
                name: 'Kingdom Business Guide',
                description: 'Complete guide to building a faith-based business',
                type: 'ebook',
                fileUrl: 'https://example.com/kingdom-guide.pdf',
                fileSize: 2.5,
                fileType: 'PDF',
                isActive: true,
                price: 27,
                accessType: 'payment',
                downloadCount: 156,
                createdAt: new Date('2024-01-01'),
                tags: ['business', 'faith', 'guide']
            },
            {
                id: '2',
                name: 'Prayer Journal Template',
                description: 'Printable prayer journal for daily devotion',
                type: 'template',
                fileUrl: 'https://example.com/prayer-journal.pdf',
                fileSize: 1.2,
                fileType: 'PDF',
                isActive: true,
                price: 0,
                accessType: 'email',
                downloadCount: 89,
                createdAt: new Date('2024-01-05'),
                tags: ['prayer', 'faith', 'free']
            }
        ]);

        setAccessGates([
            {
                id: '1',
                name: 'Email Capture for Prayer Journal',
                productId: '2',
                gateType: 'email',
                customMessage: 'Enter your email to download your free prayer journal',
                isActive: true,
                unlockCount: 89
            },
            {
                id: '2',
                name: 'Payment Gate for Business Guide',
                productId: '1',
                gateType: 'payment',
                redirectUrl: 'https://checkout.stripe.com/...',
                isActive: true,
                unlockCount: 156
            }
        ]);

        setDownloadLinks([
            {
                id: '1',
                productId: '1',
                customerEmail: 'john@example.com',
                accessToken: 'abc123def456',
                expiresAt: new Date('2024-12-31'),
                downloadCount: 3,
                lastDownloaded: new Date('2024-01-20'),
                isActive: true
            }
        ]);
    }, []);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedFile(result.assets[0]);
                return result.assets[0];
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick file');
        }
        return null;
    };

    const createProduct = () => {
        if (!newProduct.name || !newProduct.description || !selectedFile) {
            Alert.alert('Error', 'Please fill in all required fields and select a file');
            return;
        }

        const product: DigitalProduct = {
            id: Date.now().toString(),
            name: newProduct.name,
            description: newProduct.description,
            type: newProduct.type || 'ebook',
            fileUrl: selectedFile.uri,
            fileSize: selectedFile.size / (1024 * 1024), // Convert to MB
            fileType: selectedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
            isActive: newProduct.isActive || true,
            price: newProduct.price || 0,
            accessType: newProduct.accessType || 'free',
            downloadCount: 0,
            createdAt: new Date(),
            tags: newProduct.tags || []
        };

        setProducts([...products, product]);
        setNewProduct({});
        setSelectedFile(null);
        setShowProductModal(false);
        Alert.alert('Success', 'Product created successfully!');
    };

    const createAccessGate = () => {
        if (!newGate.name || !newGate.productId || !newGate.gateType) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const gate: AccessGate = {
            id: Date.now().toString(),
            name: newGate.name,
            productId: newGate.productId,
            gateType: newGate.gateType,
            customMessage: newGate.customMessage,
            redirectUrl: newGate.redirectUrl,
            isActive: newGate.isActive || true,
            unlockCount: 0
        };

        setAccessGates([...accessGates, gate]);
        setNewGate({});
        setShowGateModal(false);
        Alert.alert('Success', 'Access gate created successfully!');
    };

    const generateDownloadLink = (productId: string, customerEmail: string) => {
        const accessToken = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        const downloadLink: DownloadLink = {
            id: Date.now().toString(),
            productId,
            customerEmail,
            accessToken,
            expiresAt,
            downloadCount: 0,
            isActive: true
        };

        setDownloadLinks([...downloadLinks, downloadLink]);
        Alert.alert('Success', `Download link generated: ${accessToken}`);
    };

    const getFileSizeString = (sizeInMB: number) => {
        if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(1)} KB`;
        return `${sizeInMB.toFixed(1)} MB`;
    };

    const renderProducts = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📚 Digital Products ({products.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowProductModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
            </View>

            {products.map(product => (
                <View key={product.id} style={styles.productCard}>
                    <View style={styles.productHeader}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productType}>{product.type}</Text>
                    </View>
                    <Text style={styles.productDescription}>{product.description}</Text>
                    <View style={styles.productMeta}>
                        <Text style={styles.productFile}>{product.fileType} • {getFileSizeString(product.fileSize)}</Text>
                        <Text style={styles.productDownloads}>{product.downloadCount} downloads</Text>
                        <Text style={styles.productPrice}>
                            {product.price === 0 ? 'Free' : `$${product.price}`}
                        </Text>
                    </View>
                    <View style={styles.productTags}>
                        {product.tags.map(tag => (
                            <Text key={tag} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                    <View style={styles.productActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="eye" size={16} color="#2196F3" />
                            <Text style={styles.actionText}>Preview</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="link" size={16} color="#4CAF50" />
                            <Text style={styles.actionText}>Get Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="analytics" size={16} color="#FF9800" />
                            <Text style={styles.actionText}>Analytics</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderAccessGates = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔒 Access Gates ({accessGates.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowGateModal(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Create Gate</Text>
                </TouchableOpacity>
            </View>

            {accessGates.map(gate => {
                const product = products.find(p => p.id === gate.productId);
                return (
                    <View key={gate.id} style={styles.gateCard}>
                        <View style={styles.gateHeader}>
                            <Text style={styles.gateName}>{gate.name}</Text>
                            <Text style={styles.gateType}>{gate.gateType}</Text>
                        </View>
                        <Text style={styles.gateProduct}>{product?.name || 'Unknown Product'}</Text>
                        {gate.customMessage && (
                            <Text style={styles.gateMessage}>{gate.customMessage}</Text>
                        )}
                        <View style={styles.gateMeta}>
                            <Text style={styles.gateUnlocks}>{gate.unlockCount} unlocks</Text>
                            {gate.isActive && <Text style={styles.activeBadge}>Active</Text>}
                        </View>
                        <View style={styles.gateActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="eye" size={16} color="#2196F3" />
                                <Text style={styles.actionText}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="copy" size={16} color="#4CAF50" />
                                <Text style={styles.actionText}>Copy Link</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="settings" size={16} color="#FF9800" />
                                <Text style={styles.actionText}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    const renderDownloadLinks = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 Download Links ({downloadLinks.length})</Text>
            <Text style={styles.sectionDescription}>
                Track and manage secure download links for your products
            </Text>

            {downloadLinks.map(link => {
                const product = products.find(p => p.id === link.productId);
                return (
                    <View key={link.id} style={styles.linkCard}>
                        <View style={styles.linkHeader}>
                            <Text style={styles.linkEmail}>{link.customerEmail}</Text>
                            <Text style={styles.linkStatus}>{link.isActive ? 'Active' : 'Expired'}</Text>
                        </View>
                        <Text style={styles.linkProduct}>{product?.name || 'Unknown Product'}</Text>
                        <Text style={styles.linkToken}>Token: {link.accessToken}</Text>
                        <View style={styles.linkMeta}>
                            <Text style={styles.linkDownloads}>{link.downloadCount} downloads</Text>
                            {link.expiresAt && (
                                <Text style={styles.linkExpiry}>
                                    Expires: {link.expiresAt.toLocaleDateString()}
                                </Text>
                            )}
                        </View>
                        <View style={styles.linkActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="copy" size={16} color="#4CAF50" />
                                <Text style={styles.actionText}>Copy Link</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="refresh" size={16} color="#2196F3" />
                                <Text style={styles.actionText}>Regenerate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="trash" size={16} color="#f44336" />
                                <Text style={styles.actionText}>Revoke</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>📥 Download Manager</Text>
                <Text style={styles.headerSubtitle}>Secure file delivery and access control</Text>
            </LinearGradient>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'products' && styles.activeTab]}
                    onPress={() => setSelectedTab('products')}
                >
                    <Ionicons name="document" size={20} color={selectedTab === 'products' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'products' && styles.activeTabText]}>
                        Products
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'gates' && styles.activeTab]}
                    onPress={() => setSelectedTab('gates')}
                >
                    <Ionicons name="lock-closed" size={20} color={selectedTab === 'gates' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'gates' && styles.activeTabText]}>
                        Access Gates
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'links' && styles.activeTab]}
                    onPress={() => setSelectedTab('links')}
                >
                    <Ionicons name="link" size={20} color={selectedTab === 'links' ? '#667eea' : '#666'} />
                    <Text style={[styles.tabText, selectedTab === 'links' && styles.activeTabText]}>
                        Download Links
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{products.length}</Text>
                        <Text style={styles.statLabel}>Products</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{accessGates.length}</Text>
                        <Text style={styles.statLabel}>Access Gates</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{downloadLinks.length}</Text>
                        <Text style={styles.statLabel}>Active Links</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {products.reduce((sum, p) => sum + p.downloadCount, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Total Downloads</Text>
                    </View>
                </View>

                {/* Tab Content */}
                {selectedTab === 'products' && renderProducts()}
                {selectedTab === 'gates' && renderAccessGates()}
                {selectedTab === 'links' && renderDownloadLinks()}

                {/* Product Modal */}
                <Modal
                    visible={showProductModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowProductModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Digital Product</Text>

                            <Text style={styles.inputLabel}>Product Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.name}
                                onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                                placeholder="e.g., Kingdom Business Guide"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                value={newProduct.description}
                                onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                                placeholder="Describe your digital product..."
                                multiline
                                textAlignVertical="top"
                            />

                            <Text style={styles.inputLabel}>Product Type</Text>
                            <View style={styles.radioGroup}>
                                {['ebook', 'course', 'template', 'audio', 'video', 'bundle'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newProduct.type === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewProduct({ ...newProduct, type: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={newProduct.price?.toString()}
                                onChangeText={(text) => setNewProduct({ ...newProduct, price: parseFloat(text) || 0 })}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Access Type</Text>
                            <View style={styles.radioGroup}>
                                {['free', 'email', 'payment', 'custom'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newProduct.accessType === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewProduct({ ...newProduct, accessType: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Upload File</Text>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={pickFile}
                            >
                                <Ionicons name="cloud-upload" size={20} color="#fff" />
                                <Text style={styles.uploadButtonText}>
                                    {selectedFile ? selectedFile.name : 'Choose File'}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createProduct}
                                >
                                    <Text style={styles.modalButtonText}>Create Product</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowProductModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Access Gate Modal */}
                <Modal
                    visible={showGateModal}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowGateModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Create Access Gate</Text>

                            <Text style={styles.inputLabel}>Gate Name</Text>
                            <TextInput
                                style={styles.input}
                                value={newGate.name}
                                onChangeText={(text) => setNewGate({ ...newGate, name: text })}
                                placeholder="e.g., Email Capture for Free Guide"
                            />

                            <Text style={styles.inputLabel}>Product</Text>
                            <View style={styles.dropdown}>
                                {products.map(product => (
                                    <TouchableOpacity
                                        key={product.id}
                                        style={[
                                            styles.dropdownOption,
                                            newGate.productId === product.id && styles.dropdownOptionSelected
                                        ]}
                                        onPress={() => setNewGate({ ...newGate, productId: product.id })}
                                    >
                                        <Text style={styles.dropdownOptionText}>{product.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Gate Type</Text>
                            <View style={styles.radioGroup}>
                                {['email', 'payment', 'custom'].map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.radioButton,
                                            newGate.gateType === type && styles.radioButtonActive
                                        ]}
                                        onPress={() => setNewGate({ ...newGate, gateType: type as any })}
                                    >
                                        <Text style={styles.radioLabel}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Custom Message</Text>
                            <TextInput
                                style={[styles.input, { height: 60 }]}
                                value={newGate.customMessage}
                                onChangeText={(text) => setNewGate({ ...newGate, customMessage: text })}
                                placeholder="Enter custom message for the gate..."
                                multiline
                                textAlignVertical="top"
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={createAccessGate}
                                >
                                    <Text style={styles.modalButtonText}>Create Gate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowGateModal(false)}
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
    productCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    productMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productFile: {
        fontSize: 12,
        color: '#666',
    },
    productDownloads: {
        fontSize: 12,
        color: '#666',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    productTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    tag: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#667eea',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 4,
        marginBottom: 2,
    },
    productActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    gateCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    gateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    gateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    gateType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    gateProduct: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    gateMessage: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    gateMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    gateUnlocks: {
        fontSize: 12,
        color: '#666',
    },
    activeBadge: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    gateActions: {
        flexDirection: 'row',
        gap: 12,
    },
    linkCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    linkHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    linkEmail: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    linkStatus: {
        fontSize: 12,
        color: '#4CAF50',
    },
    linkProduct: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    linkToken: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
        marginBottom: 8,
    },
    linkMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    linkDownloads: {
        fontSize: 12,
        color: '#666',
    },
    linkExpiry: {
        fontSize: 12,
        color: '#666',
    },
    linkActions: {
        flexDirection: 'row',
        gap: 12,
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
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
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

export default DownloadManagerScreen; 