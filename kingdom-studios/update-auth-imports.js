/**
 * 🔄 Update Auth Imports Script
 * Systematically updates all useAuth imports from AuthContext to UnifiedAuthContext
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/screens/AffiliateHubScreen.tsx',
  'src/screens/analytics/AnalyticsScreen.tsx',
  'src/screens/CreatorDashboardScreen.tsx',
  'src/screens/DashboardScreen.tsx',
  'src/screens/EnhancedFeaturesScreen.tsx',
  'src/screens/funnels/FunnelsScreen.tsx',
  'src/screens/KingdomClipsScreen.tsx',
  'src/screens/kingdomCircle/KingdomCircleScreen.tsx',
  'src/screens/MentorMatchingQuizScreen.tsx',
  'src/screens/LoginScreen.tsx',
  'src/screens/OnboardingScreen.tsx',
  'src/screens/OptimizedContentGeneratorScreen.tsx',
  'src/screens/ProductContentTemplatesScreen.tsx',
  'src/screens/planner/PlannerScreen.tsx',
  'src/screens/ProfileScreen.tsx',
  'src/screens/SponsorshipRequestScreen.tsx',
  'src/screens/storefront/StorefrontScreen.tsx',
  'src/screens/TeachingScreen.tsx',
  'src/screens/TierSelectionScreen.tsx',
  'src/screens/TierSystemScreen.tsx',
  'src/screens/RefinersFireScreen.tsx',
  'src/screens/LinkInBioBuilderScreen.tsx',
  'src/screens/HashtagManagerScreen.tsx',
  'src/screens/KingdomCircleScreen.tsx',
  'src/screens/ForgeCommunityScreen.tsx',
  'src/screens/FaithContentCalendarScreen.tsx',
  'src/screens/DigitalProductManagerScreen.tsx',
  'src/screens/CheckoutScreen.tsx',
  'src/screens/ai-studio/AvatarCreatorScreen.tsx',
  'src/screens/ai-studio/AIImageStudioScreen.tsx',
  'src/navigation/MainTabNavigator.tsx',
  'src/navigation/AuthNavigator.tsx',
  'src/navigation/AuthNavigator.clean.tsx',
  'src/components/EnhancedOnboardingScreen.tsx',
  'src/contexts/AuthContext.tsx',
  '__tests__/auth/AuthFlow.test.tsx'
];

function updateAuthImports() {
  console.log('🔄 Updating Auth Imports...\n');

  const results = {
    updated: 0,
    skipped: 0,
    errors: 0,
    files: []
  };

  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    try {
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipped: ${filePath} (file not found)`);
        results.skipped++;
        return;
      }

      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;

      // Check if file contains the old import
      if (content.includes("import { useAuth } from '../contexts/AuthContext'") || 
          content.includes("import { useAuth } from '../../contexts/AuthContext'") ||
          content.includes("import { useAuth } from '../../../contexts/AuthContext'")) {
        
        // Replace the import
        content = content.replace(
          /import \{ useAuth \} from ['"]\.\.\/contexts\/AuthContext['"]/g,
          "import { useAuth } from '../contexts/UnifiedAuthContext'"
        );
        
        content = content.replace(
          /import \{ useAuth \} from ['"]\.\.\/\.\.\/contexts\/AuthContext['"]/g,
          "import { useAuth } from '../../contexts/UnifiedAuthContext'"
        );
        
        content = content.replace(
          /import \{ useAuth \} from ['"]\.\.\/\.\.\/\.\.\/contexts\/AuthContext['"]/g,
          "import { useAuth } from '../../../contexts/UnifiedAuthContext'"
        );

        // Write the updated content
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        results.updated++;
        results.files.push(filePath);
      } else {
        console.log(`⏭️  Skipped: ${filePath} (no old import found)`);
        results.skipped++;
      }
    } catch (error) {
      console.log(`❌ Error updating ${filePath}:`, error.message);
      results.errors++;
    }
  });

  console.log('\n📊 Update Results:');
  console.log(`✅ Updated: ${results.updated}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`❌ Errors: ${results.errors}`);
  console.log(`📋 Total: ${results.updated + results.skipped + results.errors}`);

  if (results.updated > 0) {
    console.log('\n📝 Updated Files:');
    results.files.forEach(file => {
      console.log(`  - ${file}`);
    });
  }

  if (results.errors === 0) {
    console.log('\n🎉 Auth import update completed successfully!');
    console.log('\n✅ Next Steps:');
    console.log('1. Test the updated components');
    console.log('2. Verify authentication flows work correctly');
    console.log('3. Check for any remaining AuthContext references');
    console.log('4. Remove the old AuthContext.tsx file if no longer needed');
  } else {
    console.log('\n⚠️  Some files had errors during update');
  }
}

updateAuthImports(); 