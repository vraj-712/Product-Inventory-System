class ApiResponse {
    constructor(statusCode, success, message, data = null, errors = null) {
        this.statusCode = statusCode
        this.success = success
        this.message = message
        this.data = success ? data : null
        this.errors = !success ? errors : null
    }
}

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(err => next(err));
    }
}

export {
    ApiResponse,
    asyncHandler
}