// ============================================
// DOM MANIPULATION
// ============================================
// The DOM (Document Object Model) represents HTML as a tree of objects.
// This code demonstrates browser-side JavaScript. Run in an HTML file or browser console.

// ---- 1. SELECTING ELEMENTS ----

// By ID (returns single element or null)
const header = document.getElementById("main-header");

// By CSS selector (returns first match or null)
const firstBtn = document.querySelector(".btn");
const navLink = document.querySelector("nav a.active");

// By CSS selector (returns NodeList of ALL matches)
const allBtns = document.querySelectorAll(".btn");
const allParagraphs = document.querySelectorAll("p");

// Other selectors (less common, prefer querySelector)
const byClass = document.getElementsByClassName("card");  // HTMLCollection (live)
const byTag = document.getElementsByTagName("div");        // HTMLCollection (live)

// NodeList vs HTMLCollection:
// - querySelectorAll → NodeList (static snapshot, has forEach)
// - getElementsBy*   → HTMLCollection (live, no forEach — use Array.from())

// Iterating NodeList
allBtns.forEach((btn) => {
  console.log(btn.textContent);
});

// Convert HTMLCollection to array
Array.from(byClass).forEach((card) => {
  console.log(card.textContent);
});

// ---- 2. MODIFYING CONTENT ----

const element = document.querySelector("#example");

// textContent — plain text (preferred, safer)
// element.textContent = "Hello, World!";

// innerHTML — can include HTML tags (XSS risk with user input!)
// element.innerHTML = "<strong>Bold</strong> text";

// innerText — visible text only (respects CSS display: none)
// element.innerText = "Visible text";

// Example: building a list dynamically
const buildList = (items) => {
  const ul = document.querySelector("#my-list");
  if (ul) {
    ul.innerHTML = items
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
};
// buildList(["Apple", "Banana", "Cherry"]);

// ---- 3. MODIFYING STYLES ----

// Inline styles (camelCase property names)
// element.style.color = "red";
// element.style.backgroundColor = "#f0f0f0";
// element.style.fontSize = "18px";
// element.style.display = "none";

// classList — best way to manage CSS classes
// element.classList.add("active", "highlight");
// element.classList.remove("inactive");
// element.classList.toggle("visible");      // Add if absent, remove if present
// element.classList.contains("active");     // true/false
// element.classList.replace("old", "new");

// Example: toggle dark mode
const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

// ---- 4. MODIFYING ATTRIBUTES ----

const link = document.querySelector("a");

// Get/Set/Remove attributes
// link.getAttribute("href");         // Get
// link.setAttribute("href", "https://example.com");  // Set
// link.removeAttribute("target");    // Remove
// link.hasAttribute("href");         // Check

// Common element properties (direct access)
// const img = document.querySelector("img");
// img.src = "new-image.jpg";
// img.alt = "Description";
// link.href = "https://example.com";

// Data attributes (data-*)
// HTML: <div data-user-id="42" data-role="admin">
// const div = document.querySelector("[data-user-id]");
// div.dataset.userId;     // "42" (camelCase)
// div.dataset.role;       // "admin"
// div.dataset.newProp = "value"; // Sets data-new-prop

// ---- 5. CREATING AND INSERTING ELEMENTS ----

// Create element
const card = document.createElement("div");
card.className = "card";
card.innerHTML = `
  <h3>New Card</h3>
  <p>This card was created with JavaScript</p>
`;

// Append to parent (at the end)
// document.querySelector(".container").appendChild(card);

// Modern insertion methods
// parent.append(child);              // End (accepts text and multiple nodes)
// parent.prepend(child);             // Beginning
// element.before(newElement);        // Before element
// element.after(newElement);         // After element
// parent.insertBefore(new, reference); // Before specific child

// Example: insert before a specific element
// const container = document.querySelector(".container");
// const firstCard = container.querySelector(".card");
// container.insertBefore(card, firstCard);

// Remove elements
// element.remove();                  // Remove self
// parent.removeChild(child);         // Remove child (older API)

// Replace elements
// parent.replaceChild(newChild, oldChild);
// element.replaceWith(newElement);   // Modern

// Clone elements
// const clone = element.cloneNode(true);  // true = deep clone (includes children)

// ---- 6. DOCUMENT FRAGMENTS (Performance) ----

// Build multiple elements off-screen, then add all at once
const createList = (items) => {
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    fragment.appendChild(li);
  });
  // Single DOM update instead of many
  // document.querySelector("ul").appendChild(fragment);
};

// ---- 7. TRAVERSING THE DOM ----

// Parent
// element.parentElement;
// element.parentNode;

// Children
// element.children;               // HTMLCollection of child elements
// element.childNodes;             // NodeList (includes text nodes)
// element.firstElementChild;
// element.lastElementChild;
// element.childElementCount;

// Siblings
// element.nextElementSibling;
// element.previousElementSibling;

// Closest ancestor matching selector
// element.closest(".container");  // Walks up the tree

// Example: find the parent card of a clicked button
// button.addEventListener("click", (e) => {
//   const card = e.target.closest(".card");
//   card.classList.toggle("selected");
// });

// ---- 8. PRACTICAL EXAMPLE: TODO LIST ----

const todoApp = `
<div id="todo-app">
  <input type="text" id="todo-input" placeholder="Add a task...">
  <button id="add-btn">Add</button>
  <ul id="todo-list"></ul>
</div>

<script>
  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");

  function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.innerHTML = \`
      <span>\${text}</span>
      <button class="delete-btn">×</button>
    \`;

    // Toggle complete on click
    li.querySelector("span").addEventListener("click", () => {
      li.classList.toggle("completed");
    });

    // Delete on button click
    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
    });

    list.appendChild(li);
    input.value = "";
    input.focus();
  }

  addBtn.addEventListener("click", addTodo);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });
</script>
`;
console.log("DOM Manipulation — run these examples in a browser!");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Select all paragraphs on a page and change their text color to blue
// 2. Create a function that builds an HTML table from an array of objects
// 3. Implement a dark mode toggle that switches body class and saves preference
// 4. Build a dynamic list where items can be added, deleted, and reordered
// 5. Create a function that highlights all links on a page that go to external sites
// 6. Use closest() and event delegation to handle clicks on dynamically added items
