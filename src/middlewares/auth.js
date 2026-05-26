export const adminAuth = (req, res, next) => {
    // Logic to check if the request is authorised
    console.log("Admin Auth is getting checked");
    const token = "admin-token"; // This is just a dummy token for demonstration purposes.
    const isAdminAuthorised = token === "admin-token";
    if (isAdminAuthorised) {
        next();
    } else {
        res.status(401).send("Unauthorized request");
    }
};

export const userAuth = (req, res, next) => {
    // Logic to check if the request is authorised
    console.log("User Auth is getting checked");
    const token = "user-token"; // This is just a dummy token for demonstration purposes.
    const isUserAuthorised = token === "user-tokken";
    if (isUserAuthorised) {
        next();
    } else {
        res.status(401).send("Unauthorized request");
    }
};