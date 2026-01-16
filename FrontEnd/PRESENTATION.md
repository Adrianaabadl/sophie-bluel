# 🎨 Sophie Bluel - Frontend Presentation Guide

## 📊 Project Overview
This document serves as a presentation guide for the Sophie Bluel Frontend demonstration to the Product Owner (Charlotte).

---

## 🎯 Presentation Structure (30 minutes)

### **Part 1: Deliverables Presentation** (15 minutes)

#### 🔍 **1. Filter & Display Projects in Gallery**

**What It Does:**
- Displays all projects from the API in a gallery format
- Users can filter projects by category using interactive buttons
- Categories available: **All**, **Objects**, **Apartments**, **Hotel & Restaurants**

**How to Demonstrate:**
1. Open `index.html` - Show the gallery displaying all projects from the API
2. Point out the category filter buttons in the `<ul id="categories">` section
3. Click "Objects" button and show how the gallery updates instantly
4. Click "Apartments" button
5. Click "All" to show all projects again

**Code in Action - `assets/app.js` (Lines 127-153):**
```javascript
// Filter elements
const categoriesList = document.getElementById("categories");
categoriesList.addEventListener("click", (e) => {
    let filteredWork;
    if (e.target.tagName === "LI") {
        const categoryValue = e.target.dataset.value || "all";
        
        if (categoryValue === "all") {
            filteredWork = works;
        } else {
            filteredWork = works.filter(work => work.categoryId === Number(categoryValue));
        }
        // Update gallery with filtered results
    }
});
```

**Key Technical Points:**
- Categories are loaded from the API with `data-value` attributes
- Filtering happens **client-side** (no new API call needed)
- Filter logic: Compare `categoryId` with the selected filter value

---

#### 🔐 **2. Login System Setup**

**What It Does:**
- Allows users to authenticate with email and password
- Stores authentication token in localStorage
- Changes UI based on login status
- Provides logout functionality

**How to Demonstrate:**
1. Show the `login.html` page with email/password form
2. Explain the login flow step by step:
   - User enters email and password
   - System sends POST request to API endpoint
   - If valid, token is returned and stored in localStorage
   - User redirected to `index.html`
3. Show the header changes after login:
   - Edit button appears (originally hidden)
   - "Login" link changes to "Logout" button
4. Click logout and show the page returns to unauthenticated state

**Code in Action - `assets/login.js` (Lines 1-26):**
```javascript
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://api.../api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    localStorage.setItem("token", result.token);  // Store token
    window.location.href = 'index.html';  // Redirect
}
```

**Code in Action - `assets/app.js` (Lines 7-23):**
```javascript
const btn = document.getElementById("login-logout-hyperlink");
const token = localStorage.getItem("token");
const editSection = document.getElementById("edit-section");

if (!token) {
    editSection.style.display = "none";  // Hide edit button
    btn.innerHTML = `<a href="login.html">Login</a>`;
} else {
    btn.textContent = "Logout";  // Change link to logout
    btn.addEventListener("click", () => {
        localStorage.clear();  // Clear token
        window.location.href = "login.html";
    });
}
```

**Key Differences - Logged In vs Logged Out:**

| Feature | Logged Out | Logged In |
|---------|-----------|-----------|
| Edit button visibility | ❌ Hidden | ✅ Visible |
| Can add photos | ❌ No | ✅ Yes |
| Can delete photos | ❌ No | ✅ Yes |
| Header link | "Login" | "Logout" |

---

#### ➕ **3. Add Images to Gallery**

**What It Does:**
- Only available to **logged-in users**
- Opens a modal dialog for image upload
- User can select image, enter title, and choose category
- Shows image preview before uploading
- Uploads to API and immediately updates gallery

**How to Demonstrate:**
1. **Make sure you're logged in** (see step 2)
2. Click the "Edit" button next to "My Projects" heading
3. A modal opens showing all current photos with delete icons
4. Click the "Add a photo" button
5. Second modal opens with upload form showing:
   - Photo upload area (drag & drop or click)
   - Title input field
   - Category dropdown
6. Select an image:
   - Show the image preview appearing
   - Point out the upload box changes when image is selected
7. Enter title and select category
8. Click submit
9. Modal closes and new image appears in the gallery!

**Code in Action - `assets/app.js` (Lines 177-220):**
```javascript
// Open Edit Modal
editProjectIcon.addEventListener('click', () => {
    modalPhotoGallery.showModal();
    loadWorks({ containerSelector: '.photo-grid', showDeleteIcons: true });
});

// Open Add Photo Modal
addPhotoButton.addEventListener('click', (e) => {
    e.preventDefault();
    modalPhotoGallery.close();
    modalAddPhoto.showModal();
});

// Submit Form & Upload
addPhotoForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Build FormData (handles file upload)
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', imageTitle);
    formData.append('category', categoryId);
    
    // Send to API
    const response = await fetch('https://.../api/works', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    
    const data = await response.json();
    
    // Update gallery immediately
    img.src = data.imageUrl;
    caption.textContent = data.title;
    gallery.appendChild(figure);
    
    modalAddPhoto.close();
});
```

**Image Preview Feature - `assets/app.js` (Lines 222-241):**
```javascript
uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;  // Show preview
            preview.style.display = "block";
            uploadBox.style.display = "none";  // Hide upload prompt
        };
        reader.readAsDataURL(file);
    }
});
```

**Key Technical Points:**
- Uses `FormData` API for multipart/form-data submission
- Token from localStorage sent in Authorization header
- File is read on client-side for preview before upload
- API returns image URL immediately after upload
- Gallery updates dynamically without page refresh

---

### **Part 2: Discussion** (10 minutes)

#### ❓ **Potential Questions from Assessor (Charlotte)**

---

**Question 1: How API Calls Function & Data Retrieval**

*"Tell me about how your API calls work. How is data retrieved from the backend?"*

**Your Answer Should Cover:**

1. **Loading Works (GET)** - `assets/app.js` Line 29-30:
   ```javascript
   const res = await fetch(API_WORKS);
   works = await res.json();
   ```
   - Fetch all projects when page loads
   - Parse JSON response and store in `works` array
   - Used for both gallery display and filtering

2. **Login (POST)** - `assets/login.js` Line 8-12:
   ```javascript
   const response = await fetch('http://api.../api/users/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
   });
   ```
   - Send credentials as JSON
   - Receive token in response
   - Store token for authenticated requests

3. **Adding Works (POST with File)** - `assets/app.js` Line 197-203:
   ```javascript
   const response = await fetch('https://.../api/works', {
       method: 'POST',
       headers: { Authorization: `Bearer ${token}` },
       body: formData,  // Contains image file
   });
   ```
   - Send FormData (image + metadata)
   - Include token in Authorization header
   - Get new work object with imageUrl in response

4. **Deleting Works (DELETE)** - `assets/app.js` Line 53-62:
   ```javascript
   const response = await fetch(`${API_WORKS}/${id}`, {
       method: 'DELETE',
       headers: {
           Authorization: `Bearer ${token}`,
           'accept': '*/*'
       }
   });
   ```
   - DELETE request with work ID
   - Authenticated with token

**Key Points to Emphasize:**
- All data flows through the API, frontend is stateless
- Token ensures only logged-in users can modify data
- Error handling with try/catch blocks

---

**Question 2: User Login Management & Authentication States**

*"Explain how user login is managed. What's the difference between logged-in and logged-out users?"*

**Your Answer Should Cover:**

1. **Token Storage** - `assets/login.js` Line 20:
   ```javascript
   localStorage.setItem("token", result.token);
   ```
   - Token stored in browser's localStorage
   - Persists across page refreshes and browser sessions
   - Retrieved with: `localStorage.getItem("token")`

2. **State Check on Page Load** - `assets/app.js` Line 6-7:
   ```javascript
   const token = localStorage.getItem("token");
   if (!token) { /* user is logged out */ }
   ```

3. **UI Rendering Based on Auth State** - `assets/app.js` Line 10-23:
   ```javascript
   // Logged Out User
   if (!token) {
       editSection.style.display = "none";  // Hide edit features
       btn.innerHTML = `<a href="login.html">Login</a>`;
   }
   
   // Logged In User
   if (token) {
       btn.textContent = "Logout";  // Show logout option
       editSection.style.display = "block";  // Show edit features
   }
   ```

4. **Logout** - `assets/app.js` Line 18-21:
   ```javascript
   btn.addEventListener("click", () => {
       localStorage.clear();  // Remove token
       window.location.href = "login.html";
   });
   ```

**Differences Table:**

| Action | Logged Out | Logged In |
|--------|-----------|-----------|
| View gallery | ✅ Yes | ✅ Yes |
| Filter projects | ✅ Yes | ✅ Yes |
| See "Edit" button | ❌ No | ✅ Yes |
| Add photos | ❌ No | ✅ Yes |
| Delete photos | ❌ No | ✅ Yes |
| Edit modal | ❌ Cannot open | ✅ Can open |

**Key Points to Emphasize:**
- Token validates user identity on backend
- UI dynamically shows/hides features based on token presence
- No reload needed - state changes instantly
- localStorage enables session persistence

---

**Question 3: Gallery Filter Functionality**

*"Walk me through how the gallery filtering works. How does a user filter projects?"*

**Your Answer Should Cover:**

1. **HTML Structure** - `index.html` Lines 46-49:
   ```html
   <ul id="categories">
       <li>All</li>
       <li data-value=1>Objects</li>
       <li data-value=2>Apartments</li>
       <li data-value=3>Hotel & Restaurants</li>
   </ul>
   ```
   - Each category has a `data-value` attribute (categoryId)
   - "All" has no data-value (matches entire array)

2. **Event Listener** - `assets/app.js` Line 127-129:
   ```javascript
   const categoriesList = document.getElementById("categories");
   categoriesList.addEventListener("click", (e) => {
       if (e.target.tagName === "LI") { /* handle click */ }
   });
   ```

3. **Filter Logic** - `assets/app.js` Line 130-140:
   ```javascript
   const categoryValue = e.target.dataset.value || "all";
   
   if (categoryValue === "all") {
       filteredWork = works;  // All projects
   } else {
       filteredWork = works.filter(work => 
           work.categoryId === Number(categoryValue)
       );  // Only matching category
   }
   ```

4. **Update Gallery** - `assets/app.js` Line 141-148:
   ```javascript
   gallery.innerHTML = "";  // Clear current view
   filteredWork.forEach(filteredWork => {
       const figure = document.createElement("figure");
       figure.innerHTML = `
           <img src="${filteredWork.imageUrl}" alt="${filteredWork.title}">
           <figcaption>${filteredWork.title}</figcaption>
       `;
       gallery.appendChild(figure);  // Add filtered items
   });
   ```

**How It Works Step-by-Step:**
1. User clicks category button (e.g., "Objects" = data-value=1)
2. Event listener catches click on `<li>` element
3. Extract `data-value` attribute from clicked element
4. If "all" → use entire works array
5. If specific category → filter works array by categoryId
6. Clear gallery HTML
7. Loop through filtered array and create figure elements
8. Add figures back to gallery DOM

**Key Points to Emphasize:**
- **Client-side filtering** - No API call needed (faster UX)
- Works array loaded once at page load, then filtered locally
- Filter preserves all works data - can switch filters instantly
- "All" button resets to original full list

---

**Question 4: Sending Images to API**

*"Explain the image upload process. How are images sent to the backend?"*

**Your Answer Should Cover:**

1. **Form Structure** - `index.html` Lines 93-103:
   ```html
   <form name="addphoto-form" class="add-photo" 
         action="/upload" method="post" enctype="multipart/form-data">
       <label for="uploadPhoto" id="uploadBox">
           <img src="assets/icons/image.png" alt="..." />
           <span id="uploadText">+ Add photo</span>
       </label>
       <input type="file" id="uploadPhoto" name="image" accept="image/*">
       
       <label for="title">Title</label>
       <input type="text" id="title" name="title">
       
       <label for="category">Category</label>
       <select id="category" name="category">...</select>
   </form>
   ```

2. **Image Preview** - `assets/app.js` Line 222-241:
   ```javascript
   uploadInput.addEventListener("change", function () {
       const file = this.files[0];
       const reader = new FileReader();
       reader.onload = function (e) {
           preview.src = e.target.result;  // Show preview
           preview.style.display = "block";
       };
       reader.readAsDataURL(file);
   });
   ```

3. **Form Submission** - `assets/app.js` Line 180-192:
   ```javascript
   addPhotoForm.addEventListener('submit', async function(e) {
       e.preventDefault();
       const token = localStorage.getItem("token");
       const imageTitle = document.getElementById("title").value;
       const categoryId = document.getElementById("category").value;
       const imageFile = uploadInput.files[0];
       
       // Create FormData object
       const formData = new FormData();
       formData.append('image', imageFile);
       formData.append('title', imageTitle);
       formData.append('category', categoryId);
   ```

4. **Send to API** - `assets/app.js` Line 197-203:
   ```javascript
   const response = await fetch('https://.../api/works', {
       method: 'POST',
       headers: {
           Authorization: `Bearer ${token}`,  // Auth required
       },
       body: formData,  // FormData handles file encoding
   });
   ```

5. **Handle Response & Update Gallery** - `assets/app.js` Line 204-217:
   ```javascript
   const data = await response.json();  // Get new work object
   
   // Create figure element
   const figure = document.createElement('figure');
   const img = document.createElement('img');
   const caption = document.createElement('figcaption');
   
   // Populate from response
   img.src = data.imageUrl;
   caption.textContent = data.title;
   
   figure.appendChild(img);
   figure.appendChild(caption);
   gallery.appendChild(figure);  // Add to page immediately
   
   modalAddPhoto.close();
   ```

**Upload Process Flow:**
1. User clicks file input
2. Selects image file from computer
3. `FileReader` reads file and creates data URL for preview
4. Preview displays in modal
5. User enters title and selects category
6. User clicks submit
7. FormData collects: image file, title, category
8. POST request sent to `/api/works` with:
   - `Authorization: Bearer {token}` header
   - FormData body (multipart/form-data encoding)
9. Backend processes and returns new work object
10. Extract imageUrl from response
11. Create new figure element with received data
12. Add figure to gallery DOM immediately
13. Close modal
14. User sees new image in gallery without refresh!

**Key Technical Points:**
- **FormData API** - Handles multipart/form-data encoding automatically
- **Token authentication** - Backend verifies user is logged in
- **Immediate UI update** - Gallery updates before full page refresh
- **File validation** - Could add file type/size checks
- **Error handling** - Try/catch block handles API errors

---

## 📁 Frontend File Structure

```
FrontEnd/
├── index.html                    # Main gallery page
├── login.html                    # Login page
├── PRESENTATION.md               # This file
└── assets/
    ├── app.js                    # Main app logic (gallery, filters, modals, auth UI)
    ├── login.js                  # Login functionality
    ├── style.css                 # All styling
    ├── icons/                    # Icon assets (image.png, etc.)
    └── images/                   # Image assets
```

---

## 🔌 API Endpoints Used

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|-------|
| GET | `/api/works` | Load all projects | ❌ No |
| POST | `/api/users/login` | Authenticate user | ❌ No |
| POST | `/api/works` | Create new project | ✅ Yes (token) |
| DELETE | `/api/works/{id}` | Delete project | ✅ Yes (token) |

---

## ⚡ Quick Demo Checklist

- [ ] Gallery displays all projects from API
- [ ] Filter buttons work (Objects, Apartments, Hotel & Restaurants, All)
- [ ] Clicking filter updates gallery without page reload
- [ ] Login page loads correctly
- [ ] Can enter email/password and submit
- [ ] After login, redirected to index.html
- [ ] "Edit" button appears in header after login
- [ ] "Login" link changes to "Logout" button after login
- [ ] Click edit button → Photo gallery modal opens
- [ ] Modal shows all current photos with delete icons
- [ ] Click "Add a photo" button
- [ ] Upload modal opens with file input, title field, category dropdown
- [ ] Select an image → preview appears in modal
- [ ] Enter title and select category
- [ ] Submit form → API POST request sent with image
- [ ] Modal closes → new image appears in gallery
- [ ] Click logout → localStorage cleared, redirected to login
- [ ] Logged out state: Edit button hidden, only "Login" link visible
- [ ] Gallery still displays after logout (no changes)

---

## 💡 Key Technical Concepts to Highlight

1. **Token-Based Authentication** - JWT stored in localStorage
2. **API Integration** - Fetch API for GET, POST, DELETE requests
3. **FormData API** - File upload handling with multipart/form-data
4. **DOM Manipulation** - Dynamic element creation and insertion
5. **Client-Side Filtering** - Fast filtering without API calls
6. **FileReader API** - Image preview before upload
7. **Event Delegation** - Single listener for category buttons
8. **Async/Await** - Asynchronous API operations
9. **Error Handling** - Try/catch for API failures
10. **State Management** - Token and works array as application state

---

## 📝 Important Code Snippets to Know

**Check if user is logged in:**
```javascript
const token = localStorage.getItem("token");
```

**Make authenticated API request:**
```javascript
fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
});
```

**Filter works array:**
```javascript
const filtered = works.filter(work => work.categoryId === 1);
```

**Create form data with file:**
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('title', title);
```

---

## 🎤 Presentation Tips

- **Start with the obvious:** Show the gallery first - it's what users see
- **Then go deeper:** Explain filters, how data comes from API
- **Show the login flow:** Demo logout → navigate to login → sign in → show Edit button appears
- **Finally, the advanced part:** Image upload - this shows all concepts together
- **Know your code:** Be able to quickly navigate to relevant code sections
- **Explain the "why":** Not just "what" the code does, but why it's designed that way
- **Use clear terminology:** API, endpoint, token, FormData, etc.
- **Be ready for deep questions:** Understand every line in app.js and login.js

---

**Good luck with your presentation! 🚀**
