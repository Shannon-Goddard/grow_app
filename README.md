# 🌿 GrowApp Cannabis Guide

> **Mobile App Repository** | This is the app store version of GrowApp. For web contributions, visit our [website repository](https://github.com/Shannon-Goddard/growappcannabis.guide).

> **Founder @ Loyal9 LLC | Scaling 2,800+ Strain DB with GrowApp | Architecting Social Blockchain w/ Mission Mischief | AWS Serverless & Open-Source — We Pass Them Left, Then Watch the Industry Blink.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-growappcannabis.guide-green?style=for-the-badge)](https://growappcannabis.guide)
[![App Store](https://img.shields.io/badge/📱_iOS-App_Store-blue?style=for-the-badge)](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
[![Google Play](https://img.shields.io/badge/🤖_Android-Google_Play-green?style=for-the-badge)](https://play.google.com/store/apps/details?id=com.GrowAppCannabisGuide)
[![License](https://img.shields.io/badge/📄_License-MIT-yellow?style=for-the-badge)](LICENSE.md)

## 🚀 What We Built

GrowApp isn't just another grow tracker — it's a **data-driven cultivation platform** that transforms how home growers approach cannabis cultivation. Built with vanilla JavaScript and powered by a comprehensive strain database, we're serving personalized grow schedules to thousands of cultivators worldwide.

### 🎯 The Problem We Solved

While 70% of home growers cultivate as a hobby, existing apps were stuck in reactive mode — tracking what already happened instead of guiding what should happen next. We flipped the script.

### ⚡ Our Solution

**Smart Grow Scheduling Engine**
- **2,800+ strain database** with flowering/vegetative timing data
- **Dynamic nutrient scheduling** across 6 major brands (Advanced Nutrients, FoxFarm, BioBizz, etc.)
- **Contextual daily tasks** generated from user selections
- **Plant diagnostics** with symptom-based troubleshooting

## 🛠️ Tech Stack

```javascript
// Core Technologies
const techStack = {
  frontend: ['Vanilla JavaScript', 'jQuery', 'CSS3', 'HTML5'],
  data: ['JSON', 'IndexedDB', 'CSV processing'],
  deployment: ['GitHub Pages', 'CDN optimization'],
  mobile: ['PWA', 'iOS App Store', 'Google Play'],
  analytics: ['Google Analytics', 'User behavior tracking']
};
```

## 🌱 Key Features

### 📊 **Strain Intelligence**
- Search through 2,800+ cannabis strains
- THC/CBD percentages and genetic profiles
- Flowering time predictions
- Growth characteristic matching

### 🧪 **Nutrient Automation**
- Multi-brand nutrient scheduling
- Growth stage optimization
- pH and feeding recommendations
- Custom nutrient mixing ratios

### 🔬 **Plant Diagnostics**
- Symptom-based problem identification
- Treatment recommendations
- Visual diagnostic tools
- Preventive care scheduling

### 📱 **Cross-Platform Experience**
- Responsive web application
- Native iOS/Android apps
- Offline functionality
- Data synchronization

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Strain DB     │    │  Schedule Engine │    │   User Interface│
│   (2,800+)      │───▶│  (Dynamic Tasks) │───▶│   (Responsive)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Nutrient Data  │    │   IndexedDB      │    │   PWA/Mobile    │
│  (6 Brands)     │    │   (Local Store)  │    │   (Apps)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Mobile Apps
- **iOS**: [Download from App Store](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=com.GrowAppCannabisGuide)

### Web Application
- **Live Demo**: [growappcannabis.guide](https://growappcannabis.guide)
- **Web Repository**: For development and contributions, visit the [website repository](https://github.com/yourusername/growappcannabis.guide)

## 📈 Performance Metrics

- **2,800+ strains** in searchable database
- **6 nutrient brands** with complete feeding schedules
- **Cross-platform deployment** (Web, iOS, Android)
- **Offline-first architecture** with IndexedDB
- **Mobile-optimized** responsive design

## 🎮 User Journey

1. **Strain Selection** → Search and filter 2,800+ strains
2. **Grow Configuration** → Set plant size, lighting, nutrients
3. **Schedule Generation** → Automated daily task creation
4. **Daily Guidance** → Contextual growing instructions
5. **Problem Solving** → Plant diagnostic tools
6. **Harvest Planning** → Timing and preparation guides

## 🔧 Development

### Project Structure
```
├── assets/
│   ├── css/           # Styling and themes
│   ├── js/            # Core JavaScript modules
│   └── img/           # Images and icons
├── mygrow/
│   ├── strain-selector/    # Strain search interface
│   ├── schedule-builder/   # Dynamic scheduling
│   └── nutrient-selector/  # Nutrient configuration
├── tools/
│   ├── plant-doctor/       # Diagnostic tools
│   └── search-strains/     # Strain database
└── data/
    ├── schedule-data.json  # Growth schedules
    └── nutrient-data.json  # Feeding schedules
```

### Key Components

**Strain Database Engine**
```javascript
// Dynamic strain filtering and selection
const strainEngine = {
  searchStrains: (query) => filterDatabase(query),
  getStrainData: (id) => strainDatabase[id],
  calculateSchedule: (strain, config) => generateTasks(strain, config)
};
```

**Schedule Builder**
```javascript
// Automated task generation
const scheduleBuilder = {
  generateDailyTasks: (userConfig) => {
    const { strain, size, lighting, nutrients } = userConfig;
    return buildCustomSchedule(strain, size, lighting, nutrients);
  }
};
```

## 🌍 Deployment

- **Production**: [growappcannabis.guide](https://growappcannabis.guide)
- **CDN**: Optimized asset delivery
- **Mobile**: iOS App Store & Google Play
- **Analytics**: Google Analytics integration

## 🤝 Contributing

This repository contains the **mobile app version** of GrowApp. To maintain stability for our app store users, we don't accept direct contributions to this repository.

**Want to contribute?** We'd love your help on the **web version**:
- 🌐 **Web Repository**: [growappcannabis.guide](https://github.com/yourusername/growappcannabis.guide)
- 🔄 **Contributions flow**: Web → App (we sync improvements from web to mobile)

### Areas We Need Help (Web Version)
- 🌱 **Strain data expansion** (genetics, terpene profiles)
- 🧪 **Nutrient brand integration** (new feeding schedules)
- 🔬 **Plant diagnostic accuracy** (symptom identification)
- 🌐 **Internationalization** (multi-language support)

## 📊 Data Sources

- **Strain Database**: Curated from multiple cannabis databases
- **Nutrient Schedules**: Official feeding charts from manufacturers
- **Growth Data**: Community-validated cultivation timelines
- **Diagnostic Info**: Peer-reviewed plant pathology resources

## 🏆 Recognition

- **Featured** on multiple cannabis technology platforms
- **Growing user base** across web and mobile platforms
- **Open-source** contribution to cannabis cultivation technology

## 📱 Get the Apps

<div align="center">

[![iOS App Store](https://img.shields.io/badge/Download_on_the-App_Store-black?style=for-the-badge&logo=apple&logoColor=white)](https://apps.apple.com/us/app/growapp-cannabis-guide/id6471381461)
[![Google Play](https://img.shields.io/badge/Get_it_on-Google_Play-green?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.GrowAppCannabisGuide)
[![Amazon Appstore](https://img.shields.io/badge/Available_at-Amazon_Appstore-orange?style=for-the-badge&logo=amazon&logoColor=white)](https://www.amazon.com/gp/product/B0CFG7HGQK)

</div>

## 🌐 Connect

<div align="center">

[![Website](https://img.shields.io/badge/🌐_Website-growappcannabis.guide-green?style=for-the-badge)](https://growappcannabis.guide)
[![Twitter](https://img.shields.io/badge/Twitter-@Loyal9GrowApp-blue?style=for-the-badge&logo=twitter)](https://twitter.com/Loyal9GrowApp)
[![Facebook](https://img.shields.io/badge/Facebook-Loyal9GrowApp-blue?style=for-the-badge&logo=facebook)](https://www.facebook.com/Loyal9GrowApp/)
[![Instagram](https://img.shields.io/badge/Instagram-@loyal9growapp-purple?style=for-the-badge&logo=instagram)](https://www.instagram.com/loyal9growapp/)

</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

<div align="center">

**"Grow what you can't."** 🌿

*Built with ❤️ by [Loyal9 LLC](https://loyal9.com)*

</div>