/* ============================================================
   URBANSPROUT — shared JavaScript (loaded by all 5 pages)
   File: js/main.js · Author: Binit Adhikari
   All prices are in Nepalese Rupees (Rs. / NPR).

   Three feature groups — plain JavaScript only, no libraries:
     1. Product "View Details" show/hide        (Products page)
     2. Demo cart: add / remove / checkout      (Products page)
     3. Feedback form validation + alert popup  (About page)
   ============================================================ */


/* ---------- 1. CART DATA ----------------------------------------
   One simple array. Each item is a small object holding the
   product's name and its DISCOUNTED price. The cart lives only
   in the visitor's memory — static demo, nothing is stored. */
var cart = [];


/* ---------- 2. SHOW / HIDE PRODUCT DETAILS ----------------------
   Each product has a hidden table row (class "detail-row").
   Clicking "View Details" toggles the class "open" on that row;
   css/style.css decides the visibility:
       tr.detail-row        -> display: none  (hidden)
       tr.detail-row.open   -> shown
   The button text is swapped so it always tells the truth. */
function toggleDetails(rowId, btn) {
  var row = document.getElementById(rowId);
  row.classList.toggle("open");
  if (row.classList.contains("open")) {
    btn.innerHTML = "Hide Details";
  } else {
    btn.innerHTML = "View Details";
  }
}


/* ---------- 3. ADD TO CART (popup: "added to cart") --------------
   Called from each product's button, e.g.
   onclick="addToCart('Balcony Starter Kit', 1199)" */
function addToCart(name, price) {
  cart.push({ name: name, price: price });
  updateCartUI();
  alert(name + " has been added to your cart!\n\nItems in cart: " + cart.length);
}


/* ---------- 4. REMOVE ONE ITEM ---------------------------------- */
function removeFromCart(index) {
  cart.splice(index, 1); // splice removes ONE item at position "index"
  updateCartUI();
}


/* ---------- 5. REDRAW THE CART -----------------------------------
   Runs after every add/remove. Refreshes the little counter in
   the navbar and, on the Products page, rebuilds the cart list
   and the total. */
function updateCartUI() {
  // 1) the navbar badge
  var badge = document.getElementById("cartCount");
  if (badge !== null) {
    badge.innerHTML = cart.length;
  }

  // 2) the cart list (only exists on the Products page)
  var list = document.getElementById("cartItems");
  if (list === null) {
    return; // not on the Products page — nothing else to draw
  }

  var items = "";
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].price;
    // toLocaleString("en-IN") = the comma grouping used in South
    // Asia (1199 -> 1,199). The currency itself is Nepalese Rupees.
    items = items + "<li><span>" + cart[i].name +
            " — Rs. " + cart[i].price.toLocaleString("en-IN") +
            "</span><button class='remove-btn' onclick='removeFromCart(" + i + ")'>remove</button></li>";
  }

  if (items === "") {
    items = "<li class='cart-empty'>Your cart is empty — add something green from the catalogue above.</li>";
  }

  list.innerHTML = items;
  document.getElementById("cartTotal").innerHTML = "Total: Rs. " + total.toLocaleString("en-IN");
}


/* ---------- 6. CHECKOUT (popup: "order placed") ------------------
   Static site, no server: checkout is a friendly popup that
   summarises the order, then empties the cart. Nothing is ever
   charged, stored or delivered. */
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Add a product from the catalogue first.");
    return;
  }

  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].price;
  }

  alert("Your order has been successfully placed!\n\n" +
        cart.length + " item(s) · Order total: Rs. " + total.toLocaleString("en-IN") +
        "\n\nThank you for shopping at UrbanSprout — happy growing!\n" +
        "(Demo store: no payment was taken and nothing will actually be delivered.)");

  cart = [];      // start fresh
  updateCartUI();
}


/* ---------- 7. FEEDBACK FORM VALIDATION (About page) -------------
   Wired to the form with: <form onsubmit="return validateForm()">
   Returning false cancels the browser's real submission — even on
   success, because there is no server: I show the popup, clear
   the form, and cancel. */
function validateForm() {
  var name = document.getElementById("fName").value;
  var email = document.getElementById("fEmail").value;
  var subject = document.getElementById("fSubject").value;
  var message = document.getElementById("fMessage").value;

  // clear error messages left over from a previous attempt
  document.getElementById("errName").innerHTML = "";
  document.getElementById("errEmail").innerHTML = "";
  document.getElementById("errSubject").innerHTML = "";
  document.getElementById("errMessage").innerHTML = "";

  var ok = true;

  if (name === "") {
    document.getElementById("errName").innerHTML = "Please tell me your name.";
    ok = false;
  }

  // a good-enough email check: "@" not the first character, and a "."
  if (email === "" || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
    document.getElementById("errEmail").innerHTML = "Please enter a valid email address.";
    ok = false;
  }

  if (subject === "") {
    document.getElementById("errSubject").innerHTML = "Please choose a subject.";
    ok = false;
  }

  if (message === "" || message.length < 10) {
    document.getElementById("errMessage").innerHTML = "Your message should be at least 10 characters long.";
    ok = false;
  }

  if (ok === false) {
    return false; // problems found — keep the form on screen
  }

  // everything checks out
  alert("Thank you, " + name + "!\n\nYour message about '" + subject +
        "' has been received.\nI will reply to " + email + " between watering sessions.\n\n" +
        "(.)");

  document.getElementById("feedbackForm").reset();
  return false;
}


/* ---------- 8. STARTUP CHECK -------------------------------------
   Runs the moment this file loads. If you open the console (F12)
   and see this message, main.js is loading correctly. */
console.log("main.js loaded — cart ready.");