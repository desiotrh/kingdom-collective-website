import { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

type FAQCategory = 'custody' | 'support' | 'evictions' | 'small-claims' | 'general';

interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  upvotes: number;
  lastVerified: string;
}

export default function CommunityScreen() {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('general');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const categories = [
    { id: 'general' as FAQCategory, title: 'General Procedures', icon: '⚖️' },
    { id: 'custody' as FAQCategory, title: 'Child Custody', icon: '👨‍👩‍👧‍👦' },
    { id: 'support' as FAQCategory, title: 'Support', icon: '💰' },
    { id: 'evictions' as FAQCategory, title: 'Evictions', icon: '🏠' },
    { id: 'small-claims' as FAQCategory, title: 'Small Claims', icon: '📋' },
  ];

  const sampleFAQs: FAQ[] = [
    {
      id: '1',
      category: 'general',
      question: 'What documents do I need to bring to court?',
      answer: 'Bring: 1) Original documents, 2) 3 copies of all filings, 3) Photo ID, 4) Any exhibits referenced in your case. Check with your local clerk for specific requirements.',
      upvotes: 12,
      lastVerified: '2024-01-15',
    },
    {
      id: '2',
      category: 'custody',
      question: 'What documents do I need to file for custody?',
      answer: 'Typically: 1) Petition for custody, 2) Summons, 3) Financial affidavit, 4) Child support worksheets. Requirements vary by state. Check your state court website for specific forms.',
      upvotes: 8,
      lastVerified: '2024-01-10',
    },
    {
      id: '3',
      category: 'small-claims',
      question: 'What is the filing fee for small claims court?',
      answer: 'Filing fees vary by state and claim amount, typically $30-$100. Most courts offer fee waivers for low-income filers. Contact your local clerk for exact amounts.',
      upvotes: 15,
      lastVerified: '2024-01-12',
    },
  ];

  const filteredFAQs = sampleFAQs.filter(faq => faq.category === selectedCategory);

  const submitQuestion = () => {
    if (newQuestion.trim()) {
      // In a real app, this would submit to a backend
      setNewQuestion('');
      setShowSubmitForm(false);
      // Show success message
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Community FAQ</Text>
        <Text style={styles.subtitle}>Find answers with verified sources</Text>
      </View>

      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>📍 Phase 1 Rollout</Text>
        <Text style={styles.disclaimerText}>
          Currently showing curated Q&A with verified answers. Phase 2 will add community voting. 
          All answers are legal information only, not legal advice.
        </Text>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryTitle,
                selectedCategory === category.id && styles.categoryTitleActive
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.faqSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {categories.find(c => c.id === selectedCategory)?.title} Questions
          </Text>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => setShowSubmitForm(!showSubmitForm)}
          >
            <Text style={styles.submitButtonText}>Submit Question</Text>
          </TouchableOpacity>
        </View>

        {showSubmitForm && (
          <View style={styles.submitForm}>
            <Text style={styles.submitFormTitle}>Submit a Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="What would you like to know?"
              placeholderTextColor="#FFFFFF60"
              value={newQuestion}
              onChangeText={setNewQuestion}
              multiline
            />
            <View style={styles.submitFormButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSubmitForm(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitQuestionButton} onPress={submitQuestion}>
                <Text style={styles.submitQuestionButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {filteredFAQs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No questions available for this category yet. Be the first to submit one!
            </Text>
          </View>
        ) : (
          filteredFAQs.map((faq) => (
            <View key={faq.id} style={styles.faqCard}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
              <View style={styles.faqMeta}>
                <View style={styles.upvotes}>
                  <Text style={styles.upvoteText}>👍 {faq.upvotes}</Text>
                </View>
                <Text style={styles.verifiedBadge}>✅ Verified {faq.lastVerified}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  header: { padding: 20, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: '#FFFFFF', opacity: 0.8, fontSize: 14, textAlign: 'center' },
  
  disclaimerCard: { 
    backgroundColor: 'rgba(255,215,0,0.1)', 
    borderColor: 'rgba(255,215,0,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    margin: 16 
  },
  disclaimerTitle: { color: '#FFD700', fontWeight: '800', marginBottom: 8 },
  disclaimerText: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, lineHeight: 18 },
  
  categoriesSection: { marginHorizontal: 16, marginBottom: 16 },
  categoriesScroll: { marginTop: 8 },
  categoryCard: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 12, 
    marginRight: 8, 
    alignItems: 'center', 
    minWidth: 90 
  },
  categoryCardActive: { borderColor: '#FFD700', backgroundColor: 'rgba(255,215,0,0.1)' },
  categoryIcon: { fontSize: 20, marginBottom: 4 },
  categoryTitle: { color: '#FFFFFF', fontSize: 12, textAlign: 'center' },
  categoryTitleActive: { color: '#FFD700' },
  
  faqSection: { margin: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  
  submitButton: { backgroundColor: 'rgba(255,215,0,0.2)', borderColor: '#FFD700', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  submitButtonText: { color: '#FFD700', fontSize: 12, fontWeight: '600' },
  
  submitForm: { 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderColor: 'rgba(255,215,0,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16 
  },
  submitFormTitle: { color: '#FFD700', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  questionInput: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    color: '#FFFFFF', 
    minHeight: 80, 
    textAlignVertical: 'top',
    marginBottom: 12
  },
  submitFormButtons: { flexDirection: 'row', gap: 8 },
  cancelButton: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelButtonText: { color: '#FFFFFF', fontSize: 14 },
  submitQuestionButton: { flex: 1, backgroundColor: '#FFD700', borderRadius: 8, padding: 12, alignItems: 'center' },
  submitQuestionButtonText: { color: '#0B1020', fontSize: 14, fontWeight: '600' },
  
  emptyState: { alignItems: 'center', padding: 40 },
  emptyStateText: { color: '#FFFFFF', opacity: 0.6, fontSize: 14, textAlign: 'center' },
  
  faqCard: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12 
  },
  faqQuestion: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  faqAnswer: { color: '#FFFFFF', opacity: 0.9, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  faqMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upvotes: { flexDirection: 'row', alignItems: 'center' },
  upvoteText: { color: '#FFD700', fontSize: 12 },
  verifiedBadge: { color: '#00FF88', fontSize: 11 },
});
