class Validator {
    constructor () {
        this.error = null;
    }

    //method to get the errors from validations
    getError() {
        return this.error;
    }

    //method to validate natural number
    validateNaturalNumber(number) {
        if (number === null || number === undefined || typeof number !== 'number' || isNaN(number)) {
            this.error = "Input is not a valid number";
            return false;
        }

        if (!Number.isInteger(number)) {
            this.error = "Input is not an integer";
            return false;
        }

        if (number <= 0) {
            this.error = "Input is not a positive number";
            return false;
        }
        
        return true;
    }

    //method to validate a string is not empty and length is capped to a fixed number
    validateString(string, length) {
        if (!string) {
            this.error = "Input string is empty";
            return false;
        }

        if (typeof string !== "string") {
            this.error = "Input is not a string";
            return false;
        }

        if (length !== undefined) {
            const obj = new Validator();

            if (!obj.validateNaturalNumber(length)) {
                this.error = obj.getError();
                return false;
            }
    
            if (string.length > length) {
                this.error = `Input string is longer than ${length} characters cap`;
                return false;
            }
        }
        

        return true;
    }

    //method to validate format of dates YYYY-MM-dd 00:00
    validateDate(dateString) {
        const obj = new Validator();

        if (!obj.validateString(dateString)) {
            this.error = obj.getError();
            return false;
        }

        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) 00:00$/;
        if (!dateRegex.test(dateString)) {
            this.error = "Invalid date format. Use YYYY-MM-dd 00:00 string";
            return false;
        }

        return true;
    }

    //method to validate an email format
    validateEmail(emailString) {
        const obj = new Validator();

        if (!obj.validateString(emailString)) {
            this.error = obj.getError();
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailString)) {
            this.error = "Invalid email format";
            return false;
        }

        return true;
    }

    //method to validate a password is safe
    validatePassword(password) {
        const obj = new Validator();

        if (!obj.validateString(password)) {
            this.error = obj.getError();
            return false;
        }

        if (password.length < 8) {
            this.error = "Password lenght must be 8 characters long or more";
            return false;
        }

        if (!/\d/.test(password)) {
            this.error = "Password must contain at least one digit (0-9)";
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            this.error = "Password must contain at least one uppercase letter (A-Z)";
            return false;
        }

        if (!/[a-z]/.test(password)) {
            this.error = "Password must contain at least one lowercase letter (a-z)";
            return false;
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            this.error = "Password must contain at least one special character";
            return false;
        }

        return true;
    }

    //method to validate uuid format
    validateUuid(uuid) {
        const obj = new Validator();

        if (!obj.validateString(uuid)) {
            this.error = obj.getError();
        }

        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(uuid)) {
            this.error = "Invalid UUID format";
            return false;
        }

        return true;
    }

    validateTime(timeString) {
        const obj = new Validator();

        if (!obj.validateString(timeString)) {
            this.error = obj.getError();
            return false;
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(timeString)) {
            this.error = "Invalid time format. Use HH:mm (24-hour format).";
            return false;
        }

        return true;
    }

    //method to validate a value is on a list
    validateListValue(list, value) {

        if (!Array.isArray(list)) {
            this.error = "Input is not a list (Array)";
            return false;
        }

        if (value === null || value === undefined) {
            this.error = "Value cannot be undefined or null";
            return false;
        }

        if (!list.includes(value)) {
            this.error = `Value ${value} was not found in the list ${JSON.stringify(list)}`;
            return false; 
        }

        return true;
    }

    //method to validate a url
    validateUrl(url) {
        const obj = new Validator();

        if (!obj.validateString(url)) {
            this.error = obj.getError();
            return false;
        }

        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(url)) {
            this.error = "Invalid URL format";
            return false;
        }

        return true;
    }

    validateArray(array) {

        if (!Array.isArray(array)) {
            this.error = "Input is not an array";
            return false;
        }

        return true;
    }
}

module.exports = Validator;