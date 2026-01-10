const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../models/Medicine');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const medicines = [
    // --- PAIN & FEVER ---
    {
        medicineName: "panadol",
        displayName: "Panadol (Paracetamol)",
        description: "The most common pain reliever and fever reducer in Sri Lanka.",
        uses: "Headache, fever, body ache, toothache.",
        howToUse: "Adults: 2 tablets every 6 hours. Max 8 tablets/day.",
        priceRange: "Rs. 30 - 45 (card)",
        sideEffects: ["Liver damage (overdose)"],
        foodInteractions: "Avoid alcohol.",
        disclaimer: "Safe for most."
    },
    {
        medicineName: "ibuprofen",
        displayName: "Ibuprofen (Brufen)",
        description: "Anti-inflammatory painkiller (NSAID).",
        uses: "Muscle pain, swelling, period pain, arthritis.",
        howToUse: "Take with food to avoid stomach pain.",
        priceRange: "Rs. 40 - 80 (card)",
        sideEffects: ["Stomach pain", "Gastritis"],
        foodInteractions: "Take after meals.",
        disclaimer: "Avoid if you have ulcers or asthma."
    },
    {
        medicineName: "diclofenac",
        displayName: "Diclofenac Sodium",
        description: "Strong anti-inflammatory painkiller.",
        uses: "Severe joint pain, back pain, sprains.",
        howToUse: "Twice daily after meals.",
        priceRange: "Rs. 30 - 90 (card)",
        sideEffects: ["Stomach burning", "Dizziness"],
        foodInteractions: "Take with food.",
        disclaimer: "Prescription recommended."
    },
    {
        medicineName: "aspirin",
        displayName: "Aspirin (Disprin/Ecosprin)",
        description: "Pain reliever and blood thinner.",
        uses: "Headache, heart attack prevention (low dose).",
        howToUse: "Dissolve in water or swallow with food.",
        priceRange: "Rs. 20 - 50 (card)",
        sideEffects: ["Bleeding", "Gastritis"],
        foodInteractions: "Take with food.",
        disclaimer: "Not for children (Reye's syndrome)."
    },
    {
        medicineName: "tramadol",
        displayName: "Tramadol",
        description: "Strong painkiller for severe pain.",
        uses: "Post-surgery pain, severe injury pain.",
        howToUse: "As prescribed by doctor only.",
        priceRange: "Rs. 100 - 300 (card)",
        sideEffects: ["Drowsiness", "Nausea", "Addiction risk"],
        foodInteractions: "No alcohol.",
        disclaimer: "Strictly prescription only."
    },

    // --- ANTIBIOTICS ---
    {
        medicineName: "amoxicillin",
        displayName: "Amoxicillin",
        description: "Widely used penicillin antibiotic.",
        uses: "Throat, ear, and chest infections.",
        howToUse: "Every 8 hours (3 times daily) for 5-7 days.",
        priceRange: "Rs. 60 - 150 (card)",
        sideEffects: ["Diarrhea", "Rash"],
        foodInteractions: "With or without food.",
        disclaimer: "Finish full course."
    },
    {
        medicineName: "azithromycin",
        displayName: "Azithromycin",
        description: "Antibiotic used for respiratory and skin infections.",
        uses: "Pneumonia, tonsillitis, skin infections.",
        howToUse: "Once daily for 3 or 5 days.",
        priceRange: "Rs. 200 - 500 (card)",
        sideEffects: ["Stomach upset", "Diarrhea"],
        foodInteractions: "Empty stomach best.",
        disclaimer: "Finish full course."
    },
    {
        medicineName: "ciprofloxacin",
        displayName: "Ciprofloxacin",
        description: "Antibiotic for urinary and bacterial infections.",
        uses: "UTIs, diarrhea, typhoid.",
        howToUse: "Twice daily. Drink plenty of water.",
        priceRange: "Rs. 50 - 150 (card)",
        sideEffects: ["Nausea", "Joint pain"],
        foodInteractions: "Avoid milk/calcium.",
        disclaimer: "Avoid sun exposure."
    },
    {
        medicineName: "cephalexin",
        displayName: "Cephalexin",
        description: "Cephalosporin antibiotic.",
        uses: "Skin, bone, and urinary tract infections.",
        howToUse: "Every 6 hours (4 times daily).",
        priceRange: "Rs. 60 - 180 (card)",
        sideEffects: ["Diarrhea", "Nausea"],
        foodInteractions: "With or without food.",
        disclaimer: "Finish full course."
    },
    {
        medicineName: "metronidazole",
        displayName: "Metronidazole (Flagyl)",
        description: "Antibiotic for gut infections.",
        uses: "Amoebiasis, bacterial vaginosis, dental infections.",
        howToUse: "Three times daily after food.",
        priceRange: "Rs. 30 - 80 (card)",
        sideEffects: ["Metallic taste", "Nausea"],
        foodInteractions: "NO ALCOHOL (Severe reaction).",
        disclaimer: "Avoid alcohol completely."
    },
    {
        medicineName: "augmentin",
        displayName: "Co-Amoxiclav (Augmentin)",
        description: "Strong antibiotic combination.",
        uses: "Serious respiratory and skin infections.",
        howToUse: "Twice daily.",
        priceRange: "Rs. 300 - 800 (card)",
        sideEffects: ["Diarrhea", "Thrush"],
        foodInteractions: "Take at start of meal.",
        disclaimer: "Prescription only."
    },

    // --- GASTRITIS & STOMACH ---
    {
        medicineName: "omeprazole",
        displayName: "Omeprazole",
        description: "Reduces stomach acid.",
        uses: "Gastritis, acid reflux, ulcers.",
        howToUse: "Once daily, 30 mins before breakfast.",
        priceRange: "Rs. 40 - 200 (card)",
        sideEffects: ["Gas", "Headache"],
        foodInteractions: "Empty stomach.",
        disclaimer: "Long term use needs advice."
    },
    {
        medicineName: "pantoprazole",
        displayName: "Pantoprazole",
        description: "Stronger acid reducer.",
        uses: "Severe acid reflux, GERD.",
        howToUse: "30 mins before breakfast.",
        priceRange: "Rs. 60 - 250 (card)",
        sideEffects: ["Headache", "Diarrhea"],
        foodInteractions: "Empty stomach.",
        disclaimer: "Consult doctor."
    },
    {
        medicineName: "domperidone",
        displayName: "Domperidone (Motilium)",
        description: "Stops nausea and vomiting.",
        uses: "Nausea, bloating, fullness.",
        howToUse: "15-30 mins BEFORE meals.",
        priceRange: "Rs. 30 - 80 (card)",
        sideEffects: ["Dry mouth"],
        foodInteractions: "Before food.",
        disclaimer: "Short term use only."
    },
    {
        medicineName: "gaviscon",
        displayName: "Gaviscon Syrup",
        description: "Antacid syrup.",
        uses: "Instant heartburn relief.",
        howToUse: "10-20ml after meals and at night.",
        priceRange: "Rs. 500 - 1200 (bottle)",
        sideEffects: ["None usually"],
        foodInteractions: "After food.",
        disclaimer: "Shake well."
    },
    {
        medicineName: "digene",
        displayName: "Digene",
        description: "Common antacid tablet.",
        uses: "Gas, acidity, indigestion.",
        howToUse: "Chew 2 tablets after meals.",
        priceRange: "Rs. 80 - 150 (strip)",
        sideEffects: ["Constipation"],
        foodInteractions: "After meals.",
        disclaimer: "Drink water."
    },
    {
        medicineName: "mebendazole",
        displayName: "Mebendazole (Worm Treatment)",
        description: "Treats worm infections.",
        uses: "Pinworms, roundworms.",
        howToUse: "Chew 1 tablet (500mg) once.",
        priceRange: "Rs. 40 - 100 (tablet)",
        sideEffects: ["Stomach pain"],
        foodInteractions: "With fatty food helps.",
        disclaimer: "Repeat in 6 months."
    },

    // --- ALLERGY & COUGH ---
    {
        medicineName: "piriton",
        displayName: "Piriton (Chlorphenamine)",
        description: "Classic antihistamine.",
        uses: "Allergies, itchiness, hay fever.",
        howToUse: "Every 4-6 hours.",
        priceRange: "Rs. 10 - 25 (card)",
        sideEffects: ["Drowsiness"],
        foodInteractions: "Avoid alcohol.",
        disclaimer: "Do not drive."
    },
    {
        medicineName: "cetirizine",
        displayName: "Cetirizine",
        description: "Non-drowsy allergy tablet.",
        uses: "Runny nose, sneezing, hives.",
        howToUse: "Once daily (night recommended).",
        priceRange: "Rs. 20 - 60 (card)",
        sideEffects: ["Mild drowsiness"],
        foodInteractions: "None.",
        disclaimer: "Safe for daily use."
    },
    {
        medicineName: "loratadine",
        displayName: "Loratadine",
        description: "Non-sedating allergy relief.",
        uses: "Allergies, skin hives.",
        howToUse: "Once daily.",
        priceRange: "Rs. 30 - 80 (card)",
        sideEffects: ["Headache"],
        foodInteractions: "Before meal.",
        disclaimer: "Non-drowsy."
    },
    {
        medicineName: "salbutamol",
        displayName: "Salbutamol (Ventolin)",
        description: "Asthma reliever.",
        uses: "Asthma attacks, wheezing.",
        howToUse: "Inhaler: 2 puffs when needed.",
        priceRange: "Rs. 400 - 800 (inhaler)",
        sideEffects: ["Shaking hands", "Fast heartbeat"],
        foodInteractions: "None.",
        disclaimer: "Emergency relief only."
    },
    {
        medicineName: "montelukast",
        displayName: "Montelukast",
        description: "Prevents asthma and allergies.",
        uses: "Allergic rhinitis, asthma maintenance.",
        howToUse: "Once daily at night.",
        priceRange: "Rs. 150 - 400 (card)",
        sideEffects: ["Mood changes", "Nightmares (rare)"],
        foodInteractions: "With or without food.",
        disclaimer: "Not for sudden attacks."
    },
    {
        medicineName: "fexofenadine",
        displayName: "Fexofenadine (Allegra)",
        description: "Non-drowsy antihistamine.",
        uses: "Hay fever, skin allergies.",
        howToUse: "One tablet daily.",
        priceRange: "Rs. 100 - 300 (card)",
        sideEffects: ["Headache"],
        foodInteractions: "Avoid fruit juice.",
        disclaimer: "Does not cause drowsiness."
    },
    {
        medicineName: "ascoril",
        displayName: "Ascoril Syrup",
        description: "Cough syrup/Expectorant.",
        uses: "Productive cough, chest congestion.",
        howToUse: "10ml three times daily.",
        priceRange: "Rs. 300 - 600 (bottle)",
        sideEffects: ["Tremors", "Palitations"],
        foodInteractions: "None.",
        disclaimer: "Verify ingredients."
    },

    // --- CHRONIC DISEASES (Diabetes, BP, Cholesterol) ---
    {
        medicineName: "metformin",
        displayName: "Metformin",
        description: "Primary diabetes medication.",
        uses: "Type 2 Diabetes control.",
        howToUse: "With meals.",
        priceRange: "Rs. 30 - 100 (card)",
        sideEffects: ["Stomach upset"],
        foodInteractions: "Avoid alcohol.",
        disclaimer: "Check B12 levels."
    },
    {
        medicineName: "atorvastatin",
        displayName: "Atorvastatin",
        description: "Statin for cholesterol.",
        uses: "Lowers cholesterol, prevents heart disease.",
        howToUse: "Once daily at night.",
        priceRange: "Rs. 70 - 300 (card)",
        sideEffects: ["Muscle pain"],
        foodInteractions: "Avoid grapefruit.",
        disclaimer: "Report muscle pain."
    },
    {
        medicineName: "rosuvastatin",
        displayName: "Rosuvastatin",
        description: "Potent statin for cholesterol.",
        uses: "High cholesterol.",
        howToUse: "Once daily.",
        priceRange: "Rs. 100 - 400 (card)",
        sideEffects: ["Muscle ache"],
        foodInteractions: "None.",
        disclaimer: "Prescription only."
    },
    {
        medicineName: "losartan",
        displayName: "Losartan",
        description: "BP medication.",
        uses: "High blood pressure.",
        howToUse: "Once daily.",
        priceRange: "Rs. 80 - 250 (card)",
        sideEffects: ["Dizziness"],
        foodInteractions: "Avoid potassium salt.",
        disclaimer: "Monitor BP."
    },
    {
        medicineName: "amlodipine",
        displayName: "Amlodipine",
        description: "Calcium channel blocker for BP.",
        uses: "High BP, angina.",
        howToUse: "Once daily.",
        priceRange: "Rs. 30 - 100 (card)",
        sideEffects: ["Swollen ankles"],
        foodInteractions: "None.",
        disclaimer: "Daily use likely."
    },
    {
        medicineName: "enalapril",
        displayName: "Enalapril",
        description: "ACE inhibitor for BP.",
        uses: "Hypertension, heart failure.",
        howToUse: "Once or twice daily.",
        priceRange: "Rs. 40 - 100 (card)",
        sideEffects: ["Dry cough"],
        foodInteractions: "None.",
        disclaimer: "Report dry cough."
    },
    {
        medicineName: "glibenclamide",
        displayName: "Glibenclamide",
        description: "Diabetes medication.",
        uses: "Type 2 diabetes.",
        howToUse: "Before breakfast.",
        priceRange: "Rs. 20 - 60 (card)",
        sideEffects: ["Low blood sugar"],
        foodInteractions: "Regular meals needed.",
        disclaimer: "Watch for hypoglycemia."
    },
    {
        medicineName: "thyroxine",
        displayName: "Thyroxine",
        description: "Thyroid hormone replacement.",
        uses: "Hypothyroidism.",
        howToUse: "Empty stomach first thing in morning.",
        priceRange: "Rs. 100 - 300 (bottle)",
        sideEffects: ["Palpitations (if dose high)"],
        foodInteractions: "Wait 1hr before eating.",
        disclaimer: "Regular blood tests needed."
    },

    // --- VITAMINS & SUPPLEMENTS ---
    {
        medicineName: "vitamin c",
        displayName: "Vitamin C",
        description: "Immunity booster.",
        uses: "Flu prevention, skin health.",
        howToUse: "Daily tablet.",
        priceRange: "Rs. 100 - 300",
        sideEffects: ["Acid stomach"],
        foodInteractions: "None.",
        disclaimer: "Safe daily."
    },
    {
        medicineName: "calcium",
        displayName: "Calcium Carbonate",
        description: "Bone strength.",
        uses: "Pregnancy, elderly bone health.",
        howToUse: "After meals.",
        priceRange: "Rs. 150 - 500",
        sideEffects: ["Constipation"],
        foodInteractions: "Avoid iron same time.",
        disclaimer: "Drink water."
    },
    {
        medicineName: "neurobion",
        displayName: "Neurobion",
        description: "B Vitamin complex.",
        uses: "Nerve pain, diabetes nerve care.",
        howToUse: "Once daily.",
        priceRange: "Rs. 100 - 200 (card)",
        sideEffects: ["None usually"],
        foodInteractions: "None.",
        disclaimer: "Safe."
    },
    {
        medicineName: "zincovit",
        displayName: "Zincovit",
        description: "Multivitamin with Zinc.",
        uses: "Immunity, recovery.",
        howToUse: "Daily after lunch.",
        priceRange: "Rs. 250 - 450 (card)",
        sideEffects: ["Nausea"],
        foodInteractions: "After food.",
        disclaimer: "Good for recovery."
    },
    {
        medicineName: "iron",
        displayName: "Ferrous Sulfate (Iron)",
        description: "Iron supplement.",
        uses: "Anemia, pregnancy.",
        howToUse: "Empty stomach ok, or with food if nausea.",
        priceRange: "Rs. 30 - 100",
        sideEffects: ["Black stools", "Constipation"],
        foodInteractions: "Enhance with Vit C. Avoid milk.",
        disclaimer: "Keep away from children."
    },
    {
        medicineName: "folic acid",
        displayName: "Folic Acid",
        description: "B Vitamin.",
        uses: "Pregnancy supplement, anemia.",
        howToUse: "Once daily.",
        priceRange: "Rs. 10 - 40",
        sideEffects: ["None"],
        foodInteractions: "None.",
        disclaimer: "Crucial for pregnancy."
    },
    {
        medicineName: "fish oil",
        displayName: "Fish Oil (Omega 3)",
        description: "Heart and brain supplement.",
        uses: "Heart health, joints.",
        howToUse: "1-2 capsules daily.",
        priceRange: "Rs. 1500 - 3000 (bottle)",
        sideEffects: ["Fishy burps"],
        foodInteractions: "With fatty meal.",
        disclaimer: "Check quality."
    },

    // --- TOPICAL & FIRST AID ---
    {
        medicineName: "siddhalepa",
        displayName: "Siddhalepa Balm",
        description: "Herbal pain relief balm.",
        uses: "Headache, muscle pain, cold.",
        howToUse: "Apply on forehead or area.",
        priceRange: "Rs. 100 - 400",
        sideEffects: ["Skin irritation"],
        foodInteractions: "External only.",
        disclaimer: "Do not apply on eyes."
    },
    {
        medicineName: "betadine",
        displayName: "Betadine (Povidone Iodine)",
        description: "Antiseptic solution/cream.",
        uses: "Wounds, cuts, burns.",
        howToUse: "Apply on wound.",
        priceRange: "Rs. 300 - 600",
        sideEffects: ["Staining"],
        foodInteractions: "External only.",
        disclaimer: "Clean wound first."
    },
    {
        medicineName: "deep heat",
        displayName: "Deep Heat Spray/Cream",
        description: "Pain relief spray.",
        uses: "Sports injuries, muscle ache.",
        howToUse: "Spray on area.",
        priceRange: "Rs. 800 - 1500",
        sideEffects: ["Burning sensation"],
        foodInteractions: "External only.",
        disclaimer: "Do not use on broken skin."
    },
    {
        medicineName: "soframyccin",
        displayName: "Soframycin",
        description: "Antibiotic skin cream.",
        uses: "Infected cuts, burns.",
        howToUse: "Apply twice daily.",
        priceRange: "Rs. 150 - 300",
        sideEffects: ["None usually"],
        foodInteractions: "External only.",
        disclaimer: "External use."
    },
    {
        medicineName: "mycoral",
        displayName: "Mycoral (Ketoconazole)",
        description: "Antifungal cream.",
        uses: "Fungal infections, ringworm.",
        howToUse: "Apply twice daily.",
        priceRange: "Rs. 300 - 600",
        sideEffects: ["Irritation"],
        foodInteractions: "External only.",
        disclaimer: "Continue after healing."
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Seed: Connected to MongoDB.');

        // Clear existing data to avoid duplicates only for test
        // await Medicine.deleteMany({}); 
        // console.log('Seed: Cleared existing medicines.');

        for (const med of medicines) {
            // Upsert: Update if exists, Insert if new
            await Medicine.findOneAndUpdate(
                { medicineName: med.medicineName },
                med,
                { upsert: true, new: true }
            );
        }

        console.log(`Seed: Successfully seeded/updated ${medicines.length} medicines.`);
        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedDB();
