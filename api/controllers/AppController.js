const mongoose = require('mongoose');

class AppController {
    static async app(req, res) {
        mongoose.connect(process.env.MONG_URL)
        return res.json({"message": "Test Ok"})
    }
}

module.exports = AppController