'use strict'

const sendResponse = (req, res) => {
    if (req.response) {
        return res.status(req.response.status || 200).json(req.response)
    }

    res.json({
        status: 200,
        message: 'OK',
    })
}

module.exports = sendResponse
