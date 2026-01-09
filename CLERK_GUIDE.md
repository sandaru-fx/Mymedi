# Clerk Authentication Guide - MediGuide AI

Machan, mama me document eke Clerk gana okkoma wisthara liyala thiyenawa. Meka kiyawala balanna.

## ❓ 1. Mokakda me Clerk kiyanne?
Clerk kiyanne **Authentication and User Management** solution ekak. Api sathiyak dekak liyanawa vage loku code ekak database backend ekka liyanne nathuwa, user login, signup, profile management vage dewal lesiyenma setup karaganna puluwan service ekak.

---

## 🛠️ 2. Api mokakda me project ekata kale?

Api Clerk me project ekata connect kale mehemai:

1.  **API Key Setup:** Oyage Clerk dashboard eken gaththa `VITE_CLERK_PUBLISHABLE_KEY` eka `frontend/.env.local` ekata add kala.
2.  **Package Installation:** `@clerk/clerk-react` kiyana library eka frontend ekata install kala.
3.  **App Wrapping (Provider):** `frontend/index.tsx` eka wrap kala `<ClerkProvider />` eken. Eken thamai app ekata auth functionalities okkoma enne.
4.  **UI Integration:** `Header.tsx` ekata Clerk components use kala:
    - `<SignedOut>`: User login wela nathnm penna ona de (e.g., Sign In button).
    - `<SignedIn>`: User login wela innawanam penna ona de (e.g., User avatar).
    - `<UserButton>`: User ge profile photo eka saha logout option ekath ekka ena dropdown eka.
    - `<SignInButton>`: Login popup eka open karana button eka.

---

## 🚀 3. Thawa monawada karanna puluwan?

Clerk walin thawa sahenna dewal karanna puluwan:

### A. Protecting Routes
App eke yanna bari than (e.g., Profile page, Admin dashboard) lock karanna puluwan login wela nathnm.
```javascript
const { isSignedIn } = useAuth();
if (!isSignedIn) return <p>Please login to see this!</p>;
```

### B. User Details Ganna
Login wela inna user ge name, email, profile picture vage dewal code eka thula use karanna puluwan.
```javascript
const { user } = useUser();
console.log(user.firstName); // "Sandaru"
```

### C. Social Logins
Clerk dashboard ekata gihin click ekakin Google, GitHub, Facebook vage logins add karanna puluwan. Ayeth code liyanna ona na.

### D. Custom Profile Pages
Clerk ge default profile ui eka vage nemei, oyata ona vidihata user profile eka hadaganna puluwan user settings manage karanna.

### E. Organizations
Meka complex app ekak nm, groups (Organizations) hadala teams manage karannath functionalities Clerk wala thiyenawa.

---

Machan, thawa deyak: Clerk nisa api dan user details database eke save karanna ona na backend eken. Clerk dashboard ekenma oyata users balanna puluwan!
