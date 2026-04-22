// ============================================
// EVENTS
// ============================================
// Events let JavaScript respond to user interactions and browser actions.
// Run these examples in a browser environment.

// ---- 1. ADDING EVENT LISTENERS ----

// addEventListener(eventType, handler, options)
const button = document.querySelector("#myBtn");

function handleClick(event) {
  console.log("Button clicked!", event);
}

// Add
// button.addEventListener("click", handleClick);

// Remove (must reference the same function — not an anonymous one)
// button.removeEventListener("click", handleClick);

// With options
// button.addEventListener("click", handleClick, { once: true }); // Fires only once
// button.addEventListener("click", handleClick, { passive: true }); // Performance hint

// Old way (don't use — can only have one handler)
// button.onclick = handleClick;

// ---- 2. COMMON EVENT TYPES ----

const eventExamples = `
// Mouse events
element.addEventListener("click", handler);       // Single click
element.addEventListener("dblclick", handler);     // Double click
element.addEventListener("mousedown", handler);    // Mouse button pressed
element.addEventListener("mouseup", handler);      // Mouse button released
element.addEventListener("mouseover", handler);    // Mouse enters element
element.addEventListener("mouseout", handler);     // Mouse leaves element
element.addEventListener("mousemove", handler);    // Mouse moves over element
element.addEventListener("contextmenu", handler);  // Right-click

// Keyboard events
document.addEventListener("keydown", handler);     // Key pressed
document.addEventListener("keyup", handler);       // Key released
// keypress is deprecated — use keydown instead

// Form events
form.addEventListener("submit", handler);          // Form submitted
input.addEventListener("input", handler);          // Value changes (real-time)
input.addEventListener("change", handler);         // Value changes (on blur)
input.addEventListener("focus", handler);          // Element gains focus
input.addEventListener("blur", handler);           // Element loses focus

// Window/Document events
window.addEventListener("load", handler);          // Page fully loaded
document.addEventListener("DOMContentLoaded", handler); // DOM ready (preferred)
window.addEventListener("resize", handler);        // Window resized
window.addEventListener("scroll", handler);        // Page scrolled
window.addEventListener("beforeunload", handler);  // About to leave page

// Drag events
element.addEventListener("dragstart", handler);
element.addEventListener("dragover", handler);
element.addEventListener("drop", handler);

// Touch events (mobile)
element.addEventListener("touchstart", handler);
element.addEventListener("touchmove", handler);
element.addEventListener("touchend", handler);

// Clipboard events
element.addEventListener("copy", handler);
element.addEventListener("paste", handler);
element.addEventListener("cut", handler);
`;

// ---- 3. THE EVENT OBJECT ----

const eventObjectDemo = (event) => {
  // Common properties
  console.log(event.type);           // "click", "keydown", etc.
  console.log(event.target);         // Element that triggered the event
  console.log(event.currentTarget);  // Element that listener is attached to
  console.log(event.timeStamp);      // When event occurred

  // Mouse event properties
  console.log(event.clientX, event.clientY); // Position relative to viewport
  console.log(event.pageX, event.pageY);     // Position relative to document
  console.log(event.button);                  // 0=left, 1=middle, 2=right

  // Keyboard event properties
  console.log(event.key);            // "Enter", "a", "ArrowUp"
  console.log(event.code);           // "Enter", "KeyA", "ArrowUp"
  console.log(event.altKey);         // true if Alt held
  console.log(event.ctrlKey);        // true if Ctrl held
  console.log(event.shiftKey);       // true if Shift held
  console.log(event.metaKey);        // true if Cmd/Windows held
};

// target vs currentTarget
// target = the actual element clicked (could be a child)
// currentTarget = the element the listener is attached to

// ---- 4. EVENT PROPAGATION ----

// Events travel in three phases:
// 1. Capturing — from window down to target
// 2. Target — event reaches the target element
// 3. Bubbling — from target back up to window (default)

const propagationExample = `
<div id="outer">
  <div id="inner">
    <button id="btn">Click me</button>
  </div>
</div>

<script>
  // Bubbling (default) — inner fires first, then outer
  document.getElementById("btn").addEventListener("click", () => {
    console.log("Button clicked");  // 1st
  });
  document.getElementById("inner").addEventListener("click", () => {
    console.log("Inner div clicked"); // 2nd
  });
  document.getElementById("outer").addEventListener("click", () => {
    console.log("Outer div clicked"); // 3rd
  });

  // Capturing — set third argument to true
  document.getElementById("outer").addEventListener("click", () => {
    console.log("Outer (capture)"); // Fires FIRST during capture phase
  }, true);
</script>
`;

// ---- 5. EVENT DELEGATION ----
// Instead of adding listeners to every child, add ONE listener to the parent.
// Works because events bubble up.

const delegationExample = `
<ul id="task-list">
  <li data-id="1">Task 1 <button class="delete">×</button></li>
  <li data-id="2">Task 2 <button class="delete">×</button></li>
  <li data-id="3">Task 3 <button class="delete">×</button></li>
</ul>

<script>
  // ONE listener on the parent — handles all current AND future children
  document.getElementById("task-list").addEventListener("click", (e) => {
    // Check what was actually clicked
    if (e.target.classList.contains("delete")) {
      const li = e.target.closest("li");
      const id = li.dataset.id;
      console.log("Deleting task:", id);
      li.remove();
    }

    if (e.target.tagName === "LI") {
      e.target.classList.toggle("completed");
    }
  });

  // New items automatically work — no need to add listeners!
  const newLi = document.createElement("li");
  newLi.innerHTML = 'Task 4 <button class="delete">×</button>';
  newLi.dataset.id = "4";
  document.getElementById("task-list").appendChild(newLi);
</script>
`;

// ---- 6. preventDefault() AND stopPropagation() ----

const preventAndStop = `
// preventDefault() — stop the browser's default action
form.addEventListener("submit", (e) => {
  e.preventDefault();  // Stop form from actually submitting
  // Handle form data with JavaScript instead
  const formData = new FormData(form);
  console.log(Object.fromEntries(formData));
});

// Prevent link navigation
link.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Link clicked but not navigated");
});

// stopPropagation() — stop event from bubbling up
innerDiv.addEventListener("click", (e) => {
  e.stopPropagation();  // Outer div's click handler won't fire
  console.log("Only inner fires");
});

// stopImmediatePropagation() — stop all handlers, even on same element
button.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  console.log("This fires");
});
button.addEventListener("click", () => {
  console.log("This does NOT fire");
});
`;

// ---- 7. DEBOUNCING AND THROTTLING ----

// Debounce — wait until user STOPS doing something
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Use case: search input — only search after user stops typing
// const searchInput = document.querySelector("#search");
// searchInput.addEventListener("input", debounce((e) => {
//   console.log("Searching for:", e.target.value);
// }, 300));

// Throttle — execute at most once per time period
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Use case: scroll events — expensive to fire on every pixel
// window.addEventListener("scroll", throttle(() => {
//   console.log("Scroll position:", window.scrollY);
// }, 200));

// ---- 8. PRACTICAL EXAMPLE: KEYBOARD SHORTCUTS ----

const keyboardShortcuts = `
document.addEventListener("keydown", (e) => {
  // Ctrl+S — Save
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    console.log("Saving...");
  }

  // Escape — Close modal
  if (e.key === "Escape") {
    const modal = document.querySelector(".modal.active");
    if (modal) modal.classList.remove("active");
  }

  // Ctrl+K — Open search
  if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    document.querySelector("#search").focus();
  }
});
`;

console.log("Events — run these examples in a browser!");
console.log("Key concepts: delegation, bubbling, debounce/throttle");

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Add keyboard navigation to a list (arrow keys to move, Enter to select)
// 2. Implement event delegation for a dynamically generated table
// 3. Create a form that validates in real-time (input event) and on submit
// 4. Build a debounced search input that shows results after 500ms of inactivity
// 5. Implement a throttled scroll handler that shows/hides a "back to top" button
// 6. Explain the difference between event.target and event.currentTarget
