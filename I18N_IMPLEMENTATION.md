# Internationalization (i18n) Implementation Guide

## Overview

This application now supports **three languages**: Sinhala (සිංහල), Tamil (தமிழ்), and English. Users can switch between languages using the language switcher in the navigation bar.

## Implementation Details

### 📦 Packages Installed

- `react-i18next`: React integration for i18next
- `i18next`: Core internationalization framework
- `i18next-browser-languagedetector`: Automatically detects user's preferred language

### 🗂️ File Structure

```
src/
├── i18n/
│   ├── config.js              # i18n configuration
│   └── locales/
│       ├── en.json            # English translations
│       ├── si.json            # Sinhala translations
│       └── ta.json            # Tamil translations
```

### 🔧 Configuration

**File: `src/i18n/config.js`**

This file initializes i18next with:
- Language detection from localStorage and browser settings
- Fallback language set to Sinhala (si)
- All translation resources

### 🌐 Translation Files

Each language has a JSON file containing all translations organized by sections:

- **nav**: Navigation bar elements
- **form**: Form labels and validation messages
- **council**: Community council specific content
- **login**: Login page content
- **submissions**: Admin submission list content

### 🎨 Components Updated

#### 1. **Navigation.jsx**
- Added language switcher with three buttons (සිංහල, தமிழ், English)
- Styled with active state highlighting
- All navigation text is now translatable

#### 2. **CommunityCouncilForm.jsx**
- Form title and labels translated
- Validation messages in selected language
- Submit button text changes with language

#### 3. **LocationSelectorBase.jsx**
- District, DS Division, and GN Division labels translated
- Dropdown placeholders in selected language

#### 4. **CommunityCouncilTable.jsx**
- Table headers translated
- Position dropdown options translated dynamically
- Required field indicators with translated notes

#### 5. **Login.jsx**
- Login form labels translated
- Button text changes with language

### 🚀 How to Use

#### For Users:
1. Look for the language switcher in the navigation bar (top right area)
2. Click on your preferred language: **සිංහල**, **தமிழ்**, or **English**
3. The entire interface will immediately switch to that language
4. Your language preference is saved in browser storage

#### For Developers:

**To use translations in components:**

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('form.title')}</h1>
      <button>{t('form.submit')}</button>
    </div>
  );
}
```

**To change language programmatically:**

```jsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <button onClick={() => changeLanguage('en')}>
      English
    </button>
  );
}
```

### ➕ Adding New Translations

1. **Add to all language files** (`en.json`, `si.json`, `ta.json`):

```json
{
  "newSection": {
    "key": "Translation text"
  }
}
```

2. **Use in component**:

```jsx
<p>{t('newSection.key')}</p>
```

### 🎯 Default Language

The application defaults to **Sinhala (සිංහල)** on first load. The language detector will:
1. Check localStorage for saved preference
2. Fall back to browser language settings
3. Finally fall back to Sinhala if nothing is found

### 🔄 Language Persistence

The selected language is automatically saved to `localStorage` and persists across:
- Page refreshes
- Browser sessions
- Different pages in the application

### 🎨 Language Switcher Design

The language switcher features:
- Semi-transparent background for visibility
- Active language highlighted with white background
- Smooth transitions between languages
- Responsive design for mobile devices

### 📱 Mobile Responsiveness

The language switcher is fully responsive:
- Displays inline on desktop
- Stacks appropriately on mobile devices
- Maintains accessibility across all screen sizes

### 🐛 Troubleshooting

**Issue: Language not changing**
- Clear browser cache and localStorage
- Ensure i18n config is imported in `main.jsx`

**Issue: Missing translations**
- Check that the key exists in all three language files
- Verify the correct translation key path

**Issue: Language reverts on refresh**
- Check browser's localStorage settings
- Ensure localStorage is not disabled

### 🔮 Future Enhancements

Potential improvements:
1. Add more languages (e.g., Japanese, Chinese)
2. Right-to-left (RTL) support if needed
3. Translation management system for non-developers
4. Automated translation validation
5. Language-specific date/time formatting
6. Language-specific number formatting

### 📝 Notes

- Position dropdown options in `CommunityCouncilTable` are dynamically translated
- All form validation messages appear in the selected language
- The language switcher is visible on all pages
- Admin panel content is also fully translated

## Testing

To test the i18n implementation:

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Click on each language button in the navigation bar
4. Verify all text changes appropriately
5. Fill out and submit forms to test validation messages
6. Refresh the page to ensure language preference persists

---

**Last Updated**: October 2025
**Version**: 1.0.0
