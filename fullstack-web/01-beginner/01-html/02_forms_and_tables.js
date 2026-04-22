// ============================================================
// 02 — HTML FORMS & TABLES
// ============================================================
// Forms collect user input; tables display structured data.
// Together they cover most interactive + data-display needs
// you'll encounter in real-world web development.
// ============================================================

// ------------------------------------------------------------
// 1. THE <form> ELEMENT
// ------------------------------------------------------------
// A form wraps all inputs and tells the browser WHERE and HOW
// to send the data when the user submits.

const formBasics = `
<form action="/api/signup" method="POST">
  <!-- action → URL that receives the data -->
  <!-- method → HTTP verb: GET (query string) or POST (body) -->

  <!-- form controls go here -->
  <button type="submit">Sign Up</button>
</form>
`;

// GET  → data appended to URL (?name=value) — use for searches
// POST → data in request body — use for creating / updating data

// ------------------------------------------------------------
// 2. INPUT TYPES
// ------------------------------------------------------------
// The <input> element changes behavior based on its "type".

const inputTypes = `
<!-- Text -->
<input type="text" name="username" placeholder="Your name">

<!-- Password (characters hidden) -->
<input type="password" name="pw" placeholder="Password">

<!-- Email (basic format validation built-in) -->
<input type="email" name="email" placeholder="you@example.com">

<!-- Number (spinner arrows, min/max/step) -->
<input type="number" name="age" min="1" max="120" step="1">

<!-- Date picker -->
<input type="date" name="birthday">

<!-- Range slider -->
<input type="range" name="volume" min="0" max="100" value="50">

<!-- File upload -->
<input type="file" name="avatar" accept="image/*">

<!-- Checkbox (multiple choices) -->
<input type="checkbox" name="agree" id="agree" value="yes">
<label for="agree">I agree to the terms</label>

<!-- Radio buttons (single choice within a group) -->
<input type="radio" name="plan" id="free" value="free">
<label for="free">Free</label>

<input type="radio" name="plan" id="pro" value="pro">
<label for="pro">Pro</label>

<!-- Hidden (sends data the user doesn't see) -->
<input type="hidden" name="formId" value="signup-v2">
`;

// Important: every input needs a "name" attribute — that's the
// key sent to the server (e.g. name=username, value=Emmanuel).

// ------------------------------------------------------------
// 3. <select>, <textarea>, AND <button>
// ------------------------------------------------------------

const otherControls = `
<!-- Dropdown select -->
<label for="country">Country</label>
<select name="country" id="country">
  <option value="">-- Choose --</option>
  <option value="ke">Kenya</option>
  <option value="ng">Nigeria</option>
  <option value="za">South Africa</option>
</select>

<!-- Multi-line text -->
<label for="bio">Bio</label>
<textarea name="bio" id="bio" rows="4" cols="40"
  placeholder="Tell us about yourself..."></textarea>

<!-- Buttons -->
<button type="submit">Submit</button>   <!-- sends the form -->
<button type="reset">Reset</button>     <!-- clears all fields -->
<button type="button">Click Me</button> <!-- does nothing by default -->
`;

// ------------------------------------------------------------
// 4. LABELS & ACCESSIBILITY
// ------------------------------------------------------------
// Always pair an <input> with a <label>. This helps:
//   • Screen readers announce what the field is for
//   • Clicking the label focuses / toggles the input

const labels = `
<!-- Explicit association via "for" + "id" -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Implicit association (wrapping) -->
<label>
  Phone Number
  <input type="tel" name="phone">
</label>
`;

// Rule of thumb: if there's an input, there MUST be a label.
// Placeholder text is NOT a substitute for a label.

// ------------------------------------------------------------
// 5. FORM VALIDATION ATTRIBUTES
// ------------------------------------------------------------
// HTML5 can validate inputs BEFORE they reach the server.

const validation = `
<form action="/register" method="POST">
  <!-- required — field cannot be empty -->
  <input type="text" name="user" required>

  <!-- minlength / maxlength — character limits -->
  <input type="password" name="pw" minlength="8" maxlength="64" required>

  <!-- pattern — regex the value must match -->
  <input type="text" name="zip" pattern="[0-9]{5}"
    title="Enter a 5-digit zip code" required>

  <!-- min / max for numbers and dates -->
  <input type="number" name="qty" min="1" max="99">

  <!-- placeholder — hint shown when field is empty -->
  <input type="email" name="email" placeholder="you@example.com" required>

  <button type="submit">Register</button>
</form>
`;

// The browser shows a built-in error tooltip if validation fails.
// Always ALSO validate on the server — client validation can be bypassed.

// ------------------------------------------------------------
// 6. TABLE STRUCTURE
// ------------------------------------------------------------
// Tables are for TABULAR DATA (not for page layout — use CSS).

const tableStructure = `
<table>
  <caption>Q1 Sales Report</caption>  <!-- optional table title -->

  <thead>                <!-- header row(s) -->
    <tr>
      <th>Month</th>     <!-- th = table header cell (bold, centered) -->
      <th>Revenue</th>
      <th>Expenses</th>
    </tr>
  </thead>

  <tbody>                <!-- main data rows -->
    <tr>
      <td>January</td>  <!-- td = table data cell -->
      <td>$12,000</td>
      <td>$8,500</td>
    </tr>
    <tr>
      <td>February</td>
      <td>$14,200</td>
      <td>$9,100</td>
    </tr>
    <tr>
      <td>March</td>
      <td>$11,800</td>
      <td>$7,900</td>
    </tr>
  </tbody>

  <tfoot>                <!-- summary / totals -->
    <tr>
      <td>Total</td>
      <td>$38,000</td>
      <td>$25,500</td>
    </tr>
  </tfoot>
</table>
`;

// thead, tbody, tfoot are optional but improve readability
// and allow the browser to scroll the body independently.

// ------------------------------------------------------------
// 7. COLSPAN & ROWSPAN
// ------------------------------------------------------------
// Merge cells across columns or rows.

const mergedCells = `
<table>
  <tr>
    <th colspan="2">Full Name</th>   <!-- spans 2 columns -->
    <th>Age</th>
  </tr>
  <tr>
    <td>First</td>
    <td>Last</td>
    <td rowspan="2">25</td>          <!-- spans 2 rows -->
  </tr>
  <tr>
    <td>Emmanuel</td>
    <td>Coder</td>
    <!-- no <td> here — the rowspan above covers this cell -->
  </tr>
</table>
`;

// ------------------------------------------------------------
// 8. FULL EXAMPLE — Registration Form + Data Table
// ------------------------------------------------------------

const fullExample = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration</title>
</head>
<body>

  <h1>Create an Account</h1>

  <form action="/api/register" method="POST">

    <label for="fname">First Name</label>
    <input type="text" id="fname" name="fname" required>

    <label for="lname">Last Name</label>
    <input type="text" id="lname" name="lname" required>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="pw">Password</label>
    <input type="password" id="pw" name="pw" minlength="8" required>

    <label for="dob">Date of Birth</label>
    <input type="date" id="dob" name="dob">

    <label for="country">Country</label>
    <select id="country" name="country">
      <option value="">-- Select --</option>
      <option value="ke">Kenya</option>
      <option value="ng">Nigeria</option>
    </select>

    <label>
      <input type="checkbox" name="terms" required>
      I accept the Terms of Service
    </label>

    <button type="submit">Register</button>
  </form>

  <hr>

  <h2>Registered Users</h2>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Name</th><th>Email</th><th>Country</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td><td>Alice</td><td>alice@mail.com</td><td>Kenya</td>
      </tr>
      <tr>
        <td>2</td><td>Bob</td><td>bob@mail.com</td><td>Nigeria</td>
      </tr>
    </tbody>
  </table>

</body>
</html>
`;

// ============================================================
// PRACTICE EXERCISES
// ============================================================
//
// 1. Build a "Contact Us" form with fields: name, email,
//    subject (dropdown), message (textarea), and a submit
//    button. Add appropriate validation attributes.
//
// 2. Create a table showing a weekly class schedule with
//    columns: Time, Monday, Tuesday, Wednesday, Thursday,
//    Friday. Use colspan to merge a "Lunch Break" cell
//    across all five day columns.
//
// 3. Add radio buttons to a form that let the user pick a
//    subscription plan: Free, Basic ($9/mo), Premium ($19/mo).
//    Only one option should be selectable at a time.
//
// 4. Explain in a comment: what is the difference between
//    GET and POST? When would you use each?
//
// 5. Create a file-upload form that accepts only PDF files
//    and requires the user to check an "I confirm" checkbox
//    before submitting.
// ============================================================

console.log("02_forms_and_tables.js loaded ✔");
