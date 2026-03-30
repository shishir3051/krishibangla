export const districtsData = {
  // --- DHAKA DIVISION ---
  "Dhaka": {
    name: "Dhaka", bn: "ঢাকা",
    crops: ["Rice", "Vegetables", "Mustard"],
    soil: "Alluvial / Clay Loam",
    risk: "Urban Waterlogging",
    irrigation: "88% (Deep Tube-well)",
    advisory: "Monitor for stem borer in Boro rice. Use balanced Fertilizer (Urea:TSP:MOP = 3:1:1).",
    calendar: "Planting: Nov–Dec; Harvest: May–June",
    potential: "High potential for rooftop gardening and greenhouse vegetable production.",
    qualityScore: 'A+', fertility: '91%', waterTable: 'Optimal', exportPotential: '89%', growthForecast: '+10.8%', exportTier: 'Tier 1'
  },
  "Gazipur": {
    name: "Gazipur", bn: "গাজীপুর",
    crops: ["Rice", "Jackfruit", "Pineapple"],
    soil: "Red Clay (Madhupur Terrace)",
    risk: "Industrial Pollution",
    irrigation: "70% (Mixed)",
    advisory: "Apply potash to improve jackfruit sweetness. Guard against fruit borer.",
    calendar: "Planting: July–August; Harvest: June–July",
    potential: "Strong potential for agro-processing and canned fruit exports.",
    qualityScore: 'A', fertility: '83%', waterTable: 'Medium', exportPotential: '80%', growthForecast: '+8.2%', exportTier: 'Tier 2'
  },
  "Nishardi": { name: "Nishardi", bn: "নিশর্দী", crops: ["Rice"], soil: "Aluvial", risk: "Flood", irrigation: "Medium" },
  "Tangail": {
    name: "Tangail", bn: "টাঙ্গাইল",
    crops: ["Pineapple", "Rice", "Banana"],
    soil: "Loamy / Red Soil",
    risk: "Flood",
    irrigation: "High (Canal/Mixed)",
    qualityScore: 'A', fertility: '86%', waterTable: 'Moderate', exportPotential: '78%', growthForecast: '+7.9%', exportTier: 'Tier 2',
    calendar: 'Planting: Dec-Feb; Harvest: Apr-May'
  },
  "Kishoreganj": {
    name: "Kishoreganj", bn: "কিশোরগঞ্জ",
    crops: ["Boro Rice", "Potato", "Fish"],
    soil: "Wetland (Haor) Peat",
    risk: "Flash Flood (April)",
    irrigation: "95% (Surface/LIFT)",
    qualityScore: 'A', fertility: '80%', waterTable: 'High (Haor)', exportPotential: '74%', growthForecast: '+7.1%', exportTier: 'Tier 2',
    calendar: 'Planting: Oct-Nov; Harvest: Feb-Mar'
  },
  "Manikganj": { name: "Manikganj", bn: "মানিকগঞ্জ", crops: ["Tobacco", "Rice"], soil: "Sandy Loam", risk: "River Erosion", irrigation: "High" },
  "Munshiganj": {
    name: "Munshiganj", bn: "মুন্সীগঞ্জ",
    crops: ["Potato (Top Producer)", "Rice"],
    soil: "Light Alluvial",
    risk: "River Erosion",
    irrigation: "80% (Surface/Mixed)",
    qualityScore: 'A+', fertility: '93%', waterTable: 'Optimal', exportPotential: '94%', growthForecast: '+12.1%', exportTier: 'Tier 1',
    calendar: 'Planting: Oct-Nov; Harvest: Feb-Mar'
  },
  "Narayanganj": { name: "Narayanganj", bn: "নারায়ণগঞ্জ", crops: ["Rice", "Jute"], soil: "Clay Loam", risk: "Industrial Runoff", irrigation: "Medium" },
  "Narsingdi": { name: "Narsingdi", bn: "নরসিংদী", crops: ["Banana", "Vegetables"], soil: "Loamy", risk: "Flood", irrigation: "High" },

  // --- RAJSHAHI DIVISION ---
  "Rajshahi": {
    name: "Rajshahi", bn: "রাজশাহী",
    crops: ["Mango (Fazli/Gopalbhog)", "Silk", "Rice"],
    soil: "Drought-prone Barind Clay",
    risk: "Severe Drought",
    irrigation: "90% (Deep Tube-well)",
    advisory: "Use pheromone traps for Mango fruit fly. Implement mulching to save water.",
    calendar: "Planting: June; Harvest: June–August",
    potential: "High export demand for G.I. certified Silk and premium Mango varieties.",
    qualityScore: 'A+', fertility: '87%', waterTable: 'Low (Barind)', exportPotential: '96%', growthForecast: '+14.8%', exportTier: 'Tier 1'
  },
  "Chapai Nawabganj": {
    name: "Chapai Nawabganj", bn: "চাঁপাইনবাবগঞ্জ",
    crops: ["Mango (Capital)", "Litchi"],
    soil: "High Barind Plateau Clay",
    risk: "Water Scarcity",
    irrigation: "Low (Groundwater reliance)",
    advisory: "Focus on Khirsapat and Langra mangoes. Prioritize drip irrigation.",
    calendar: "Planting: June; Harvest: May–July",
    potential: "Global Mango export hub. Potential for processing pulp and juice.",
    qualityScore: 'A+', fertility: '84%', waterTable: 'Very Low', exportPotential: '97%', growthForecast: '+15.3%', exportTier: 'Tier 1'
  },
  "Naogaon": {
    name: "Naogaon", bn: "নওগাঁ",
    crops: ["Rice (Highest Surplus)", "Chini Gura"],
    soil: "Barind Alluvial",
    risk: "Drought",
    irrigation: "95% (Intensive Tube-well)",
    qualityScore: 'A', fertility: '85%', waterTable: 'Low (Barind)', exportPotential: '88%', growthForecast: '+11.2%', exportTier: 'Tier 1',
    calendar: 'Planting: Dec-Feb; Harvest: Apr-May'
  },
  "Natore": { name: "Natore", bn: "নাটোর", crops: ["Sugar Cane", "Fish"], soil: "Clay", risk: "Drought", irrigation: "High" },
  "Pabna": { name: "Pabna", bn: "পাবনা", crops: ["Spices", "Rice"], soil: "Loamy", risk: "Flood", irrigation: "Medium" },
  "Bogra": { name: "Bogra", bn: "বগুড়া", crops: ["Vegetables (National Hub)", "Rice"], soil: "Sandy Loam", risk: "Flood", irrigation: "Very High" },
  "Joypurhat": { name: "Joypurhat", bn: "জয়পুরহাট", crops: ["Potato", "Rice"], soil: "Barind Clay", risk: "Drought", irrigation: "High" },
  "Sirajganj": { name: "Sirajganj", bn: "সিরাজগঞ্জ", crops: ["Rice", "Milk Hub"], soil: "Riverine Alluvial", risk: "River Erosion", irrigation: "Medium" },

  // --- RANGPUR DIVISION ---
  "Rangpur": {
    name: "Rangpur", bn: "রংপুর",
    crops: ["Tobacco", "Rice", "Ginger"],
    soil: "Sandy Alluvial (Tista)",
    risk: "Cold Waves / Monga",
    irrigation: "High (Surface Mixed)",
    qualityScore: 'B+', fertility: '76%', waterTable: 'Medium', exportPotential: '72%', growthForecast: '+6.8%', exportTier: 'Tier 2',
    calendar: 'Planting: Dec-Feb; Harvest: Apr-May'
  },
  "Dinajpur": {
    name: "Dinajpur", bn: "দিনাজপুর",
    crops: ["Litchi (China-3)", "Aromatic Rice"],
    soil: "Old Himalayan Piedmont",
    risk: "Cold Stress",
    irrigation: "High",
    qualityScore: 'A', fertility: '89%', waterTable: 'Moderate', exportPotential: '91%', growthForecast: '+13.0%', exportTier: 'Tier 1',
    calendar: 'Flowering: Feb-Mar; Harvest: Jun-Jul'
  },
  "Thakurgaon": { name: "Thakurgaon", bn: "ঠাকুরগাঁও", crops: ["Potato", "Rice"], soil: "Sandy Loam", risk: "Cold Stress", irrigation: "High" },
  "Panchagarh": { name: "Panchagarh", bn: "পঞ্চগড়", crops: ["Tea (Plateau)", "Rice"], soil: "Himalayan Foothill", risk: "Cold", irrigation: "Medium" },
  "Kurigram": { name: "Kurigram", bn: "কুড়িগ্রাম", crops: ["Maize", "Rice"], soil: "Sandy", risk: "River Erosion / Monga", irrigation: "Low" },
  "Gaibandha": { name: "Gaibandha", bn: "গাইবান্ধা", crops: ["Rice", "Maize"], soil: "Sandy Loam", risk: "River Erosion", irrigation: "Medium" },
  "Lalmonirhat": { name: "Lalmonirhat", bn: "লালমনিরহাট", crops: ["Tobacco", "Maize"], soil: "Tista Alluvial", risk: "Flood", irrigation: "Medium" },
  "Nilphamari": { name: "Nilphamari", bn: "নীলফামারী", crops: ["Ginger", "Rice"], soil: "Sandy Loam", risk: "Cold", irrigation: "High" },

  // --- SYLHET DIVISION ---
  "Sylhet": {
    name: "Sylhet", bn: "সিলেট",
    crops: ["Tea (Queen)", "Orange", "Rice"],
    soil: "Acidic Hill Soil",
    risk: "Flash Floods",
    irrigation: "Low (Rain-fed dominant)",
    qualityScore: 'A', fertility: '82%', waterTable: 'High (Haor)', exportPotential: '91%', growthForecast: '+10.5%', exportTier: 'Tier 1',
    calendar: 'Pruning: Dec-Feb; Plucking: Mar-Nov'
  },
  "Moulvibazar": { name: "Moulvibazar", bn: "মৌলভীবাজার", crops: ["Tea", "Pineapple"], soil: "Hilly Acidic", risk: "Flash Flood", irrigation: "Low" },
  "Habiganj": { name: "Habiganj", bn: "হবিগঞ্জ", crops: ["Boro Rice (Haor)", "Tea"], soil: "Wetland Clay", risk: "Flash Flood", irrigation: "Medium" },
  "Sunamganj": { name: "Sunamganj", bn: "সুনামগঞ্জ", crops: ["Boro Rice", "Fish"], soil: "Peat / Wetland", risk: "Flash Flood (Extreme)", irrigation: "High (Boro only)" },

  // --- CHITTAGONG DIVISION ---
  "Chittagong": {
    name: "Chittagong", bn: "চট্টগ্রাম",
    crops: ["Rice", "Watermelon", "Fish"],
    soil: "Saline/Alluvial",
    risk: "Cyclone / Salinity",
    irrigation: "Medium",
    qualityScore: 'B+', fertility: '74%', waterTable: 'Saline Intrusion', exportPotential: '86%', growthForecast: '+7.2%', exportTier: 'Tier 2',
    calendar: 'Planting: Dec-Feb; Harvest: Apr-May'
  },
  "Cox's Bazar": { name: "Cox's Bazar", bn: "কক্সবাজার", crops: ["Salt", "Betel Leaf", "Dry Fish"], soil: "Sandy Saline", risk: "Cyclone / Salinity", irrigation: "Low" },
  "Feni": { name: "Feni", bn: "ফেনী", crops: ["Rice", "Fish"], soil: "Alluvial", risk: "Coastal Flood", irrigation: "Medium" },
  "Noakhali": { name: "Noakhali", bn: "নোয়াখালী", crops: ["Rice", "Coconut", "Soybean"], soil: "Saline Alluvial", risk: "Salinity", irrigation: "Medium" },
  "Lakshmipur": { name: "Lakshmipur", bn: "লক্ষ্মীপুর", crops: ["Soybean (Capital)", "Betel Nut"], soil: "Silty Loam", risk: "Cyclone", irrigation: "Low" },
  "Comilla": { name: "Comilla", bn: "কুমিল্লা", crops: ["Vegetables", "Rice"], soil: "Clay Loam", risk: "Flood", irrigation: "High" },
  "Chandpur": { name: "Chandpur", bn: "চাঁদপুর", crops: ["Hilsa (River)", "Rice"], soil: "Riverine", risk: "River Erosion", irrigation: "Medium" },
  "Brahmanbaria": { name: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", crops: ["Rice"], soil: "Loamy", risk: "Flood", irrigation: "Medium" },
  "Khagrachhari": { name: "Khagrachhari", bn: "খাগড়াছড়ি", crops: ["Ginger", "Turmeric", "Mango"], soil: "Hilly Red Soil", risk: "Landslide", irrigation: "Low" },
  "Rangamati": { name: "Rangamati", bn: "রাঙামাটি", crops: ["Cashew Nut", "Coffee", "Mango"], soil: "Hill Soil", risk: "Landslide", irrigation: "Low" },
  "Bandarban": { name: "Bandarban", bn: "বান্দরবান", crops: ["Tobacco", "Ginger", "Coffee"], soil: "Rocky Hill Soil", risk: "Landslide", irrigation: "Low" },

  // --- KHULNA DIVISION ---
  "Khulna": {
    name: "Khulna", bn: "খুলনা",
    crops: ["Bagda Shrimp", "Coconut", "Rice"],
    soil: "Saline Clayey",
    risk: "Cyclones / Salinity",
    irrigation: "Medium (Surface Water)",
    qualityScore: 'A-', fertility: '77%', waterTable: 'Saline/Mixed', exportPotential: '95%', growthForecast: '+13.4%', exportTier: 'Tier 1',
    calendar: 'Planting: Dec-Feb; Harvest: Apr-May'
  },
  "Satkhira": { name: "Satkhira", bn: "সাতক্ষীরা", crops: ["White Gold (Shrimp)", "Honey", "Mango"], soil: "High Saline", risk: "Salinity / Cyclone", irrigation: "Low" },
  "Bagerhat": { name: "Bagerhat", bn: "বাগেরহাট", crops: ["Shrimp", "Betel Nut"], soil: "Silty Saline", risk: "Salinity / Cyclone", irrigation: "Low" },
  "Jessore": { name: "Jessore", bn: "যশোর", crops: ["Vegetables (Export)", "Rice", "Flower"], soil: "Sandy Loam", risk: "Drought", irrigation: "Very High" },
  "Kushtia": { name: "Kushtia", bn: "কুষ্টিয়া", crops: ["Rice", "Tobacco"], soil: "Sandy Alluvial", risk: "Drought", irrigation: "High" },
  "Magura": { name: "Magura", bn: "মাগুরা", crops: ["Guava", "Rice"], soil: "Clay Loam", risk: "Flood", irrigation: "Medium" },
  "Meherpur": { name: "Meherpur", bn: "মেহেরপুর", crops: ["Corn", "Vegetables"], soil: "Sandy Loam", risk: "Drought", irrigation: "High" },
  "Narail": { name: "Narail", bn: "নড়াইল", crops: ["Rice"], soil: "Clay Loam", risk: "Flood", irrigation: "Medium" },
  "Chuadanga": { name: "Chuadanga", bn: "চুয়াডাঙ্গা", crops: ["Corn", "Mango"], soil: "Sandy Loam", risk: "Drought", irrigation: "High" },
  "Jhenaidah": { name: "Jhenaidah", bn: "ঝিনাইদহ", crops: ["Banana", "Rice"], soil: "Loamy", risk: "Flood", irrigation: "High" },

  // --- BARISAL DIVISION ---
  "Barisal": {
    name: "Barisal", bn: "বরিশাল",
    crops: ["Rice", "Guava (Floating Market)", "Coconut"],
    soil: "Silty Saline Alluvial",
    risk: "Coastal Flood",
    irrigation: "Low (Surface river-fed)",
    qualityScore: 'A', fertility: '85%', waterTable: 'High (Riverine)', exportPotential: '81%', growthForecast: '+9.0%', exportTier: 'Tier 2',
    calendar: 'Planting: Dec-Feb; Harvest: Apr-May'
  },
  "Bhola": { name: "Bhola", bn: "ভোলা", crops: ["Betel Nut", "Rice", "Buffalo Milk"], soil: "Marine Alluvial", risk: "Extreme Cyclone", irrigation: "Low" },
  "Patuakhali": { name: "Patuakhali", bn: "পটুয়াখালী", crops: ["Rice", "Watermelon"], soil: "Silty Alluvial", risk: "Salinity", irrigation: "Low" },
  "Pirojpur": { name: "Pirojpur", bn: "পিরোজপুর", crops: ["Guava", "Hog-plum"], soil: "Saline Loam", risk: "Flood", irrigation: "Low" },
  "Barguna": { name: "Barguna", bn: "বরগুনা", crops: ["Rice", "Fish"], soil: "Silty Saline", risk: "Salinity / Cyclone", irrigation: "Low" },
  "Jhalokati": { name: "Jhalokati", bn: "ঝালকাঠি", crops: ["Rice", "Guava"], soil: "Alluvial", risk: "Flood", irrigation: "Low" },

  // --- MYMENSINGH DIVISION ---
  "Mymensingh": {
    name: "Mymensingh", bn: "ময়মনসিংহ",
    crops: ["Rice", "Fish (Capital)", "Litchi"],
    soil: "Clay Loam",
    risk: "Flood",
    irrigation: "High",
    qualityScore: 'A', fertility: '88%', waterTable: 'Optimal', exportPotential: '86%', growthForecast: '+10.2%', exportTier: 'Tier 2',
    calendar: 'Flowering: Feb-Mar; Harvest: Jun-Jul'
  },
  "Netrokona": { name: "Netrokona", bn: "নেত্রকোণা", crops: ["Boro Rice", "Duck"], soil: "Peat / Haor", risk: "Flash Flood", irrigation: "Medium" },
  "Sherpur": { name: "Sherpur", bn: "শেরপুর", crops: ["Rice"], soil: "Hilly Alluvial", risk: "Flood", irrigation: "Medium" },
  "Jamalpur": { 
    name: "Jamalpur", bn: "জামালপুর", 
    crops: ["Rice", "Mustard"], soil: "Loamy", risk: "River Erosion", irrigation: "Medium",
    qualityScore: 'A', fertility: '86%', waterTable: 'Optimal', exportPotential: '87%', growthForecast: '+10.4%', exportTier: 'Tier 2',
    calendar: 'Planting: Dec-Jan; Harvest: Apr-May'
  }
};
