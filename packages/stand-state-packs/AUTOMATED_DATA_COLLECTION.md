# 🚀 Automated Legal Data Collection

This system automatically populates skeleton files with real legal data from various sources including state bar associations, court systems, and legal aid organizations.

## 📋 What It Does

- **Scrapes legal directories** from official websites
- **Collects lawyer information** from state bar associations
- **Gathers mediator data** from court systems
- **Finds legal aid organizations** from verified sources
- **Updates skeleton files** with real, verified data
- **Maintains data integrity** with timestamps and sources

## 🛠️ Prerequisites

```bash
# Install dependencies
npm install

# Ensure you have Node.js 18+ and npm
node --version
npm --version
```

## 🧪 Testing the System

Before running real data collection, test the system:

```bash
# Test with sample data (no web scraping)
npm run test:data
```

This will populate a few California counties with test data to verify the system works.

## 🎯 Available Commands

### 1. **Test Data Population** (Recommended First)

```bash
npm run test:data
```

- Populates 3 California counties with test data
- No web scraping involved
- Verifies file structure and data format

### 2. **California Data Collection**

```bash
npm run populate:california
```

- Collects real data from California sources
- Updates all California counties
- Uses specialized California selectors

### 3. **Pilot States Collection**

```bash
npm run populate:pilot
```

- Collects data from CA, NY, TX, FL
- Good for testing with multiple states
- Moderate data collection

### 4. **Full State Collection**

```bash
npm run populate:all
```

- Collects data from all supported states
- Most comprehensive but takes longest
- Use after testing with smaller sets

## 🌍 Supported States

Currently configured for these states with verified sources:

| State | State Bar | Mediators | Legal Aid |
| ----- | --------- | --------- | --------- |
| CA    | ✅        | ✅        | ✅        |
| NY    | ✅        | ✅        | ✅        |
| TX    | ✅        | ✅        | ✅        |
| FL    | ✅        | ✅        | ✅        |
| IL    | ✅        | ⏳        | ⏳        |
| PA    | ✅        | ⏳        | ⏳        |
| OH    | ✅        | ⏳        | ⏳        |
| GA    | ✅        | ⏳        | ⏳        |
| NC    | ✅        | ⏳        | ⏳        |
| MI    | ✅        | ⏳        | ⏳        |

**Legend:**

- ✅ **Fully Supported** - All data types available
- ⏳ **Partially Supported** - Basic lawyer data only

## 📊 Data Sources

### **State Bar Associations**

- Official lawyer directories
- Verified attorney listings
- Practice area information
- Contact details

### **Court Systems**

- Mediator directories
- Alternative dispute resolution
- Family court resources
- Parenting class providers

### **Legal Aid Organizations**

- Pro bono services
- Low-income assistance
- Specialized legal help
- Community resources

## 🔧 Customization

### **Adding New States**

Edit `scripts/populate-legal-data.js`:

```javascript
const LEGAL_DATA_SOURCES = {
  stateBars: {
    NEW_STATE: "https://www.newstatebar.org/find-lawyer",
    // ... existing states
  },
  mediators: {
    NEW_STATE: "https://www.newstatecourts.gov/mediation/",
    // ... existing states
  },
};
```

### **Customizing Selectors**

Each website may need different CSS selectors:

```javascript
// In the collectStateBarData method
const lawyers = await page.evaluate(() => {
  // Customize these selectors for each state bar website
  const lawyerElements = document.querySelectorAll(
    ".custom-lawyer-class, .attorney-item"
  );
  // ... rest of extraction logic
});
```

### **Rate Limiting**

Adjust delays to be respectful to websites:

```javascript
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds instead of 1
```

## 📁 Output Structure

After running the scripts, your skeleton files will be populated:

```json
// states/ca/los-angeles/lawyers.json
{
  "state": "CA",
  "county": "Los Angeles",
  "verifiedAt": "2024-01-15T10:30:00.000Z",
  "sources": [
    {
      "title": "California State Bar Association",
      "url": "https://www.calbar.ca.gov/Attorneys/Find-A-Lawyer",
      "verified": true
    }
  ],
  "lawyers": [
    {
      "name": "John Smith, Esq.",
      "practice": "Family Law",
      "location": "Los Angeles, CA",
      "contact": "(555) 123-4567",
      "website": "https://example.com",
      "verified": true,
      "verifiedAt": "2024-01-15T10:30:00.000Z",
      "source": "California State Bar Association",
      "state": "CA"
    }
  ]
}
```

## ⚠️ Important Notes

### **Legal Compliance**

- Always respect website terms of service
- Use reasonable delays between requests
- Don't overwhelm servers
- Consider reaching out to organizations for API access

### **Data Quality**

- Automated collection may include errors
- Always verify critical information
- Update data regularly
- Maintain source attribution

### **Rate Limiting**

- Default delay: 1 second between requests
- Increase if websites become slow
- Monitor for blocking or errors
- Use different IP addresses if needed

## 🚨 Troubleshooting

### **Common Issues**

1. **"Browser initialization failed"**
   - Ensure you have enough system resources
   - Try running without headless mode for debugging

2. **"No data collected"**
   - Website structure may have changed
   - Check if selectors need updating
   - Verify website is accessible

3. **"Rate limited"**
   - Increase delays between requests
   - Wait before retrying
   - Consider using different IP

### **Debug Mode**

To see what's happening in the browser:

```javascript
// In the scripts, change headless: true to headless: false
this.browser = await puppeteer.launch({
  headless: false, // Shows browser window
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
```

## 📈 Next Steps

1. **Start with test data**: `npm run test:data`
2. **Try California**: `npm run populate:california`
3. **Expand to pilot states**: `npm run populate:pilot`
4. **Customize for your needs**
5. **Set up regular updates**

## 🤝 Contributing

To add support for new states or improve existing ones:

1. Research the state's legal resources
2. Update the `LEGAL_DATA_SOURCES` configuration
3. Test with a small sample
4. Submit improvements

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify website accessibility
3. Review error logs
4. Test with smaller data sets first

---

**Remember**: This system is designed to help populate legal resource directories. Always verify the collected data and respect the terms of service of the websites you're collecting from.
