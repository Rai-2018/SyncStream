exports.allAccess = (req, res) => {
    res.status(200).send("All access");
};

exports.userAccess = (req, res) => {
    res.status(200).send("User access");
};

exports.adminAccess = (req, res) => {
    res.status(200).send("Admin access");
};

exports.moderatorAccess = (req, res) => {
    res.status(200).send("Moderator access");
};

