const Logger = (req, res, next) => {
  console.log("--- Incoming Request ---");
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.originalUrl}`);
  // Log the entire parsed body for POST/PUT/PATCH requests
  if (req.method !== "GET" && req.method !== "DELETE" && req.body) {
    // Log the JSON body, formatted for readability
    console.log("Body:", JSON.stringify(req.body, null, 2));
  }
  console.log("------------------------");
  next();
};

module.exports = { Logger };
