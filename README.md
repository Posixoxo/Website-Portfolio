# SYSTEM SPECIFICATION & ARCHITECTURAL OVERVIEW // PORTFOLIO CMS

> **Repository:** Portfolio & Terminal CMS
> **Target Audience:** Technical Engineers, Collaborators, and Non-Technical Stakeholders
> **Live Architecture:** Static Frontend + Firebase Serverless Backend Realtime Database

---

## 1. Executive Summary & Overview (For Everyone)

Think of this project as a bridge between an old-school hacker terminal and a modern web application.

Traditionally, updating a portfolio website requires writing code, rebuilding files, and pushing updates through complex developer tools. This portfolio changes that by introducing a **Terminal CMS Dashboard (`admin.html`)** backed by **Firebase**. It allows dispatches, project notes, technical write-ups ("IT Berries"), and contact inquiries to be managed seamlessly in real time through an intuitive interface, without touching raw source code every time content changes.

---

## 2. Core Features & User Experience

* **Editorial Nigerian Reference Aesthetic:** Features custom dark brown container gradients (`#2b1b17` to `#1c110e`), organic corner paint splash markers, bold mustard/crimson accent highlights, and JetBrains Mono terminal typography.
* **Dynamic IT Berries Shuffler (`script.js`):** Automatically shuffles through published technical notes every 1 minute and 30 seconds with smooth fade transitions, or allows users to manually shuffle instantly via local memory caching.
* **Backend Terminal CMS (`admin.html`):** Secured via Firebase Authentication and Realtime Database rules, providing complete Create, Read, Update, and Delete (CRUD) capabilities for dispatches and content items.
* **Integrated Firebase Contact Hub:** Routes all incoming contact form submissions directly into a secure Firebase database node (`contacts`), complete with async button loading states and custom input edge highlights.
* **Category Archive & Reader View (`stories.html`):** Features single-dispatch line-divided paragraphs, category lane filtering (`IT Berries`, `Technical Writeup`, `Documentation`, `Personal Story`), and dedicated "Full Read" buttons.

---

## 3. Technology Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules), Responsive Design (Mobile & Desktop layouts).
* **Backend & Database:** Firebase Realtime Database (`website-portfolio-c8b26-default-rtdb.firebaseio.com`) and Firebase Authentication.
* **Deployment & Version Control:** Git, GitHub, Vercel / Netlify.

---

## 4. Architectural Data Schema (For Engineers)

The application relies on a flat NoSQL JSON data tree structured under two primary root nodes:

```json
{
  "posts": {
    "unique_post_id_1": {
      "title": "Eye Strain Optimization 101",
      "excerpt": "Brief summary of the article...",
      "category": "IT Berries",
      "content": "Paragraph 1 content...\n\nParagraph 2 content...",
      "status": "published",
      "createdAt": 1712000000000
    }
  },
  "contacts": {
    "unique_contact_id_1": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+2348000000000",
      "message": "Inquiry regarding frontend engineering collaboration.",
      "createdAt": 1713000000000
    }
  }
}

```

---

## 5. Security & Database Rules

To ensure public readers can view dispatches and submit contact inquiries while protecting administrative CRUD actions, the Firebase Realtime Database rules are configured as follows:

```json
{
  "rules": {
    "posts": {
      ".read": true,
      ".write": "auth != null"
    },
    "contacts": {
      ".read": "auth != null",
      ".write": true
    }
  }
}

```

* **Public Reads:** Anyone visiting the portfolio can fetch published posts and write contact messages.
* **Restricted Writes (`posts`):** Only authenticated admin users via `admin.html` can create, update, or delete blog posts and dispatches.

---

## 6. How to Run Locally & Push to GitHub

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/your-portfolio-repo.git
cd your-portfolio-repo

```


2. **Run a local development server:**
Use VS Code's *Live Server* extension or any static file server to preview files locally (avoiding `file://` protocol CORS restrictions when querying Firebase).
3. **Commit and Push changes to GitHub:**
```bash
git add .
git commit -m "feat: updated portfolio architecture and README documentation"
git push origin main

```