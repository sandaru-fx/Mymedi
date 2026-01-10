import snakeBiteImg from '../assets/snake_bite_aid.png';
import dogBiteImg from '../assets/dog_bite_aid.png';
import chokingImg from '../assets/choking_aid.png';
import bleedingImg from '../assets/bleeding_aid.png';
import poisoningImg from '../assets/poisoning_aid.png';
import heartAttackImg from '../assets/heart_attack.png';

export const getSosCuratedContent = (isSinhala: boolean) => ({
    'Snake Bite': {
        image: snakeBiteImg,
        actions: isSinhala
            ? ['සන්සුන්ව සිටින්න සහ අවයවය නොසොල්වා තබන්න (Immobilize)', 'තුවාලය හෘදයේ මට්ටමට වඩා පහළින් තබා ගන්න', 'වහාම රෝහල් ගත වෙන්න (විශේෂයෙන්ම සර්පයා හදුනාගත හැකි නම් පවසන්න)', 'තුවාලය වටා ලිහිල්ව රෙදි කැබැල්ලක් බදින්න']
            : ['Keep the victim calm; anxiety increases venom spread', 'Immobilize the bitten limb below the heart level', 'Get the victim to a hospital immediately; do not wait for symptoms', 'Loosely wrap a clean bandage around the bite area'],
        avoid: isSinhala
            ? ['තුවාලය කැපීම හෝ ලේ උරා බීම (Venom sucking)', 'තුවාලය මත අයිස් තැබීම', 'මත්පැන් හෝ වේදනා නාශක (Aspirin) ලබා දීම']
            : ['Do not cut the wound or try to suck out the venom', 'Do not apply ice, water, or any chemicals to the area', 'Do not give the person alcohol, caffeine, or aspirin'],
        tip: isSinhala ? 'සර්පයාගේ හැඩය හෝ පෙනුම මතක තබා ගැනීමට උත්සාහ කරන්න (සර්පයා රැගෙන යාම අවශ්‍ය නැත)' : 'Try to remember the snake\'s appearance only if safe; do not try to capture it.'
    },
    'Dog Bite': {
        image: dogBiteImg,
        actions: isSinhala
            ? ['සබන් සහ පිරිසිදු ගලා යන ජලය යොදා විනාඩි 10-15ක් තුවාලය හොඳින් සෝදන්න', 'පිරිසිදු රෙදි කැබැල්ලකින් තද කර රුධිර වහනය නතර කරන්න', 'තුවාලය විෂබීජ නාශකයකින් පිරිසිදු කර වෙළුම් පටියක් දමන්න']
            : ['Wash the wound with soap and running water for at least 15 minutes', 'Use a clean cloth to apply direct pressure and stop bleeding', 'Apply an antibiotic or antiseptic and cover with a sterile bandage'],
        avoid: isSinhala ? ['තුවාලය නොසලකා හැරීම', 'එන්නත් ලබා ගැනීම (Rabies vaccine) ප්‍රමාද කිරීම'] : ['Never ignore even a minor scratch or bite', 'Do not delay seeking medical advice for rabies vaccination'],
        tip: isSinhala ? 'සුනඛයාගේ අයිතිකරු පිළිබඳව හෝ සුනඛයාගේ එන්නත් විස්තර පරීක්ෂා කරන්න' : 'Identify the dog and its owner to check for rabies vaccination history.'
    },
    'Choking': {
        image: chokingImg,
        actions: isSinhala
            ? ['පුද්ගලයාගේ පිට මැදට තදින් පහර 5ක් දෙන්න (Back blows)', 'උදරයට තෙරපුම (Heimlich Maneuver) 5ක් දෙන්න', 'වස්තුව පිටතට එනතුරු හෝ පුද්ගලයා සිහිසුන් වනතුරු මෙය කරන්න']
            : ['Lean the person forward and give 5 firm back blows with the heel of your hand', 'Perform 5 abdominal thrusts (Heimlich maneuver) just above the navel', 'Continue alternating 5-and-5 until the object is forced out'],
        avoid: isSinhala ? ['පුද්ගලයා කහින විට එයට බාධා කිරීම', 'පෙනෙන්න නැති වස්තුවක් අත දමා ගැනීමට උත්සාහ කිරීම (Blind sweep)'] : ['Do not interfere if the person is coughing or speaking', 'Do not perform a blind finger sweep as it may push the object deeper'],
        tip: isSinhala ? 'පුද්ගලයා සිහිසුන් වුවහොත් වහාම 1990 අමතා CPR ආරම්භ කරන්න' : 'If the person loses consciousness, call 1990 immediately and start CPR.'
    },
    'Severe Bleeding': {
        image: bleedingImg,
        actions: isSinhala
            ? ['තුවාලය මත පිරිසිදු රෙදි kැබැල්ලකින් සෘජුවම සහ තදින් පීඩනය යොදන්න', 'තුවාල වූ අවයවය හැකි නම් හෘදයේ මට්ටමට වඩා ඉහලින් තබන්න', 'රුධිරය පාලනය වූ පසු වෙළුම් පටියක් තදින් බදින්න']
            : ['Apply direct and firm pressure to the wound with a clean cloth or bandage', 'Elevate the bleeding limb above the level of the heart if possible', 'Once bleeding slows, wrap a sterile bandage firmly around the area'],
        avoid: isSinhala ? ['බැඳ ඇති ලේ තැවරුණු රෙදි ඉවත් කිරීම (තව රෙදි උඩින් තබා බදින්න)', 'තුවාලය ඇතුලට දැමීම සඳහා කුඩු වර්ග භාවිතා කිරීම'] : ['Do not remove soaked bandages; add more layers on top', 'Do not use a tourniquet unless you have professional training for it'],
        tip: isSinhala ? 'රුධිරය විදීමක් (Arterial bleeding) සිදුවේ නම් වහාම 1990 අමතන්න' : 'If bleeding is spurting or bright red, seek emergency medical help immediately.'
    },
    'Poisoning': {
        image: poisoningImg,
        actions: isSinhala
            ? ['විෂ වූ ද්‍රව්‍යය කුමක්ද සහ ප්‍රමාණය කොපමණදැයි හඳුනා ගන්න', 'බහාලුම හෝ විෂ වූ ද්‍රව්‍යයේ නියැදියක් රෝහලට රැගෙන යන්න', 'වහාම 1990 හෝ විෂ තොරතුරු මධ්‍යස්ථානය (0112686143) අමතන්න']
            : ['Quickly identify what was taken and how much was swallowed', 'Keep the package or container to show the doctors at the hospital', 'Call 1990 or the Poison Information Centre at 0112686143 immediately'],
        avoid: isSinhala ? ['අවසරයකින් තොරව වමනය කිරීමට උත්සහ කිරීම (මෙය පෙනහළු වලට හානි කළ හැක)', 'කිරි හෝ තෙල් වර්ග පෙවීම'] : ['Do not induce vomiting unless specifically told by a professional', 'Do not give the person milk, oil, or any other home remedies'],
        tip: isSinhala ? 'පුද්ගලයාගේ ශ්වසනය සහ නාඩි වැටීම පරීක්ෂා කරමින් සිටින්න' : 'Monitor the person’s breathing and consciousness level until help arrives.'
    },
    'Heart Attack': {
        image: heartAttackImg,
        actions: isSinhala
            ? ['පුද්ගලයා සුව පහසු ලෙස (W-position) වාඩි කරවන්න', 'සිරුරු ඇඳුම් ලිහිල කර ඔවුන් සන්සුන්ව තබන්න', 'වහාම 1990 අමතන්න සහ ඇස්පිරින් තිබේ නම් හපනය කර වමනය කිරීමට ඉඩ දෙන්න']
            : ['Make the person sit down and rest in a comfortable position', 'Loosen any tight clothing and keep the person calm and warm', 'Call 1990 and give one full 325mg aspirin to chew (if no allergy)'],
        avoid: isSinhala ? ['පුද්ගලයාට රිය පැදවීමට හෝ ඇවිදීමට ඉඩ දීම', 'රෝග ලක්ෂණ සාමාන්‍ය දෙයක් ලෙස සලකා නොසලකා හැරීම'] : ['Do not let the person walk or exert themselves in anyway', 'Do not offer the person food or drink (other than prescribed med)'],
        tip: isSinhala ? 'පුද්ගලයා කලින් හෘද රෝගියෙක් නම් ඔවුන්ගේ නයිට්‍රොග්ලිසරින් තිබේදැයි බලන්න' : 'Ask if the person uses nitroglycerin and help them take it if they do.'
    }
});
