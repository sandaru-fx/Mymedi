export const getSosCuratedContent = (isSinhala: boolean) => ({
    'Snake Bite': {
        image: '/src/assets/snake_bite.png',
        actions: isSinhala ? ['සන්සුන්ව සිටින්න සහ අවයවය නොසොල්වා තබන්න', 'තුවාලය වටා තදින් බැඳීමෙන් වළකින්න', 'වහාම රෝහල් ගත වෙන්න'] : ['Keep the victim calm and still', 'Immobilize the bitten limb', 'Do not apply a tourniquet or cut the wound', 'Seek emergency medical help immediately'],
        avoid: isSinhala ? ['තුවාලය කැපීම හෝ ලේ උරා බීම', 'අයිස් තැබීම', 'මත්පැන් පානය කිරීම'] : ['Trying to suck out the venom', 'Applying ice or heat', 'Giving the victim alcohol or caffeine'],
        tip: isSinhala ? 'සර්පයාගේ පෙනුම මතක තබා ගැනීමට උත්සාහ කරන්න' : 'Try to remember the appearance of the snake if possible.'
    },
    'Dog Bite': {
        image: '/src/assets/dog_bite.png',
        actions: isSinhala ? ['සබන් සහ ජලය යොදා තුවාලය හොඳින් සෝදන්න', 'පිරිසිදු රෙදි කැබැල්ලකින් තද කර රුධිර වහනය නතර කරන්න', 'ප්‍රතිජීවක ආලේපනයක් ගල්වන්න'] : ['Wash the wound thoroughly with soap and water', 'Apply pressure with a clean cloth to stop bleeding', 'Apply antibiotic ointment and cover with a sterile bandage'],
        avoid: isSinhala ? ['තුවාලය නොසලකා හැරීම', 'එන්නත් ලබා ගැනීම ප්‍රමාද කිරීම'] : ['Ignoring even minor bites', 'Delaying medical evaluation for infection risk'],
        tip: isSinhala ? 'සුනඛයාගේ අයිතිකරු පිළිබඳව විමසන්න' : 'Check the vaccination status of the dog if known.'
    },
    'Choking': {
        image: '/src/assets/choking.png',
        actions: isSinhala ? ['පිට මැදට පහර 5ක් දෙන්න', 'උදරයට තෙරපුම (Heimlich Maneuver) 5ක් දෙන්න', 'වස්තුව පිටතට එනතුරු මෙය නැවත කරන්න'] : ['Give 5 back blows between the shoulder blades', 'Perform 5 abdominal thrusts (Heimlich maneuver)', 'Alternate between 5 blows and 5 thrusts until the blockage is cleared'],
        avoid: isSinhala ? ['පුද්ගලයා කහින විට බාධා කිරීම', 'කට තුලට ඇඟිලි දමා සෙවීමට උත්සාහ කිරීම'] : ['Interfering if the person is coughing forcefully', 'Blind finger sweeps in the mouth'],
        tip: isSinhala ? 'පුද්ගලයා සිහිසුන් වුවහොත් CPR ආරම්භ කරන්න' : 'If the person becomes unconscious, begin CPR immediately.'
    },
    'Severe Bleeding': {
        image: '/src/assets/bleeding.png',
        actions: isSinhala ? ['තුවාලය මත සෘජුවම තද කරන්න', 'තුවාලය හදවතේ මට්ටමට වඩා ඉහලින් තබන්න', 'පිරිසිදු වෙළුම් පටියක් භාවිතා කරන්න'] : ['Apply direct pressure to the wound with a clean cloth', 'Elevate the injured area above heart level', 'Apply a sterile bandage once bleeding is controlled'],
        avoid: isSinhala ? ['බැඳ ඇති රෙදි ඉවත් කිරීම', 'තුවාලය ඇතුලට අමුද්‍රව්‍ය දැමීම'] : ['Removing soaked bandages (layer more on top)', 'Applying a tourniquet unless bleeding is life-threatening'],
        tip: isSinhala ? 'රුධිර වහනය අධික නම් වහාම 1990 අමතන්න' : 'If bleeding is arterial (spirting), use dynamic pressure.'
    },
    'Poisoning': {
        image: '/src/assets/poisoning.png',
        actions: isSinhala ? ['විෂ වූ ද්‍රව්‍යය හඳුනා ගන්න', 'බහාලුම ළඟ තබා ගන්න', 'වහාම 1990 හෝ විෂ තොරතුරු මධ්‍යස්ථානය අමතන්න'] : ['Identify the substance and the amount taken', 'Keep the container for medical reference', 'Call emergency services or Poison Control immediately'],
        avoid: isSinhala ? ['වමනය කිරීමට උත්සහ කිරීම (විශේෂ උපදෙස් නැතිව)', 'කිරි හෝ ජලය ලබා දීම'] : ['Inducing vomiting unless told by a professional', 'Giving ipecac syrup or charcoal'],
        tip: isSinhala ? 'පුද්ගලයාගේ සිහිය පරීක්ෂා කරමින් සිටින්න' : 'Stay with the person and monitor breathing until help arrives.'
    },
    'Heart Attack': {
        image: '/src/assets/heart_attack.png',
        actions: isSinhala ? ['පුද්ගලයා සුව පහසු ලෙස වාඩි කරවන්න', 'සිරුරු ඇඳුම් ලිහිල් කරන්න', 'ඇස්පිරින් ලබා දීමට (වෛද්‍ය උපදෙස් මත) උත්සාහ කරන්න'] : ['Have the person sit down and rest', 'Loosen tight clothing', 'Ask if they take chest pain medication (like nitroglycerin)'],
        avoid: isSinhala ? ['පුද්ගලයාට තනිවම රිය පැදවීමට ඉඩ දීම', 'රෝග ලක්ෂණ නොසලකා හැරීම'] : ['Letting the person drive themselves to the hospital', 'Ignoring early warning signs like indigestion'],
        tip: isSinhala ? 'පුද්ගලයා සිහිසුන් වුවහොත් වහාම CPR ආරම්භ කරන්න' : 'Begin CPR if the person becomes unresponsive or stops breathing.'
    }
});
