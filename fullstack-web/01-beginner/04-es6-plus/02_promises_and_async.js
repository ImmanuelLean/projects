// ============================================
// PROMISES AND ASYNC/AWAIT
// ============================================

// ---- 1. THE CALLBACK PROBLEM ----

// Callbacks work but lead to "callback hell" with nested async operations
function getUserCallback(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: "Alice" });
  }, 1000);
}

// Callback hell — deeply nested, hard to read and handle errors
// getUserCallback(1, (err, user) => {
//   getOrders(user.id, (err, orders) => {
//     getOrderDetails(orders[0].id, (err, details) => {
//       // 3 levels deep already...
//     });
//   });
// });

// ---- 2. CREATING PROMISES ----

// A Promise represents an eventual result (or failure) of an async operation
// States: pending → fulfilled (resolved) OR rejected

const myPromise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) {
      resolve({ data: "Here's your data!" });
    } else {
      reject(new Error("Something went wrong"));
    }
  }, 1000);
});

// Simulated API call
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "User" + id, email: `user${id}@test.com` });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 500);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, userId, total: 49.99 },
        { id: 102, userId, total: 29.99 },
      ]);
    }, 500);
  });
}

// ---- 3. CONSUMING PROMISES: then/catch/finally ----

fetchUser(1)
  .then((user) => {
    console.log("User:", user);
    return fetchOrders(user.id); // Return another promise → chain
  })
  .then((orders) => {
    console.log("Orders:", orders);
    return orders.length;
  })
  .then((count) => {
    console.log("Order count:", count);
  })
  .catch((error) => {
    // Catches ANY error in the chain
    console.error("Error:", error.message);
  })
  .finally(() => {
    // Always runs — cleanup, hide loading spinner, etc.
    console.log("Request complete");
  });

// ---- 4. PROMISE CHAINING ----

// Clean chain — flat, readable, errors caught centrally
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      console.log(`Processing ${user.name}`);
      return fetchOrders(user.id);
    })
    .then((orders) => {
      const total = orders.reduce((sum, o) => sum + o.total, 0);
      return { orderCount: orders.length, totalSpent: total };
    });
}

processUserData(1).then((summary) => console.log("Summary:", summary));

// ---- 5. PROMISE STATIC METHODS ----

const p1 = fetchUser(1);
const p2 = fetchUser(2);
const p3 = fetchUser(3);

// Promise.all — wait for ALL to resolve (fails fast if any rejects)
Promise.all([p1, p2, p3])
  .then((users) => console.log("All users:", users))
  .catch((err) => console.error("One failed:", err.message));

// Promise.allSettled — wait for ALL to complete (never rejects)
const p4 = fetchUser(-1); // Will reject
Promise.allSettled([p1, p4]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log("Success:", result.value);
    } else {
      console.log("Failed:", result.reason.message);
    }
  });
});

// Promise.race — first to settle wins (resolve or reject)
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve("slow"), 2000)),
  new Promise((resolve) => setTimeout(() => resolve("fast"), 500)),
]).then((winner) => console.log("Race winner:", winner)); // "fast"

// Promise.any — first to RESOLVE wins (ignores rejections)
Promise.any([
  new Promise((_, reject) => setTimeout(() => reject("fail1"), 100)),
  new Promise((resolve) => setTimeout(() => resolve("success"), 200)),
  new Promise((_, reject) => setTimeout(() => reject("fail2"), 300)),
]).then((result) => console.log("Any winner:", result)); // "success"

// ---- 6. ASYNC/AWAIT ----

// async function ALWAYS returns a promise
// await pauses execution until promise resolves

async function getUserData(id) {
  const user = await fetchUser(id);     // Wait for user
  const orders = await fetchOrders(user.id);  // Then wait for orders
  const total = orders.reduce((sum, o) => sum + o.total, 0);

  return {
    user: user.name,
    orderCount: orders.length,
    totalSpent: total,
  };
}

getUserData(1).then((data) => console.log("Async result:", data));

// Arrow function with async
const getUser = async (id) => {
  const user = await fetchUser(id);
  return user;
};

// ---- 7. ERROR HANDLING WITH ASYNC/AWAIT ----

async function safeGetUser(id) {
  try {
    const user = await fetchUser(id);
    const orders = await fetchOrders(user.id);
    return { user, orders };
  } catch (error) {
    console.error("Failed:", error.message);
    return null; // Graceful fallback
  } finally {
    console.log("Cleanup: hide loading spinner");
  }
}

safeGetUser(-1); // Will catch the error

// ---- 8. SEQUENTIAL VS PARALLEL ASYNC ----

// SEQUENTIAL — one after another (slower, use when dependent)
async function sequential() {
  console.time("sequential");
  const user1 = await fetchUser(1); // Wait 500ms
  const user2 = await fetchUser(2); // Wait another 500ms
  const user3 = await fetchUser(3); // Wait another 500ms
  console.timeEnd("sequential");    // ~1500ms total
  return [user1, user2, user3];
}

// PARALLEL — all at once (faster, use when independent)
async function parallel() {
  console.time("parallel");
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3),
  ]);
  console.timeEnd("parallel"); // ~500ms total
  return [user1, user2, user3];
}

// sequential();
// parallel();

// ---- 9. REAL-WORLD PATTERNS ----

// Retry pattern
async function fetchWithRetry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// Sequential processing of array
async function processSequentially(items) {
  const results = [];
  for (const item of items) {
    const result = await fetchUser(item);
    results.push(result);
  }
  return results;
}

// Batched parallel processing
async function processBatch(items, batchSize = 3) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchUser));
    results.push(...batchResults);
  }
  return results;
}

// ============================================
// PRACTICE EXERCISES
// ============================================
// 1. Create a promise that resolves after a random 1-3 second delay with a message
// 2. Chain 3 promises: fetch user → fetch user's posts → fetch post comments
// 3. Use Promise.all to fetch 5 users in parallel and log their names
// 4. Convert a callback-based function to return a promise
// 5. Implement a fetchWithRetry that retries up to 3 times with exponential backoff
// 6. Use async/await to fetch data sequentially vs parallel and compare timing
