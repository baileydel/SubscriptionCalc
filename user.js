const prices = require('./prices.json');

class User {
    
    /**
     * Creates an instance of the class with a given name and payment history.
     * @param {string} name - The name associated with the user.
     * @param {Array} history - The payment history, an array of objects with date and price properties.
     */
    constructor(name, history) {
        this.name = name;
        this.payments = history;

        this.startDate = new Date(this.payments[0].date);
        this.paid = this.calculatePaid();

        this.totalMonths = this.calculateTotalMonths();
        this.endDate = this.calculateEndDate()

        this.details;
    }

    /**
     * Calculates the total number of months based on the payment history and rates.
     * @returns {number} - The total number of months, rounded to three decimal places.
     */
    calculateTotalMonths() {
        let take = 0;
        let months = 0;
        let date = this.startDate;

        let remainingAmount = this.paid;

        for (let i = 1; i < prices.length; i++) {
            let nextDate = new Date(prices[i].date);

            if (date <= nextDate) {
                let difference = this.timeDifference(date, nextDate);
                let rate = this.getRateWithin(date);

                if (!this.details) {
                    this.details = `${difference.toFixed(3)} Months at $${rate}\n`;
                }
                else {
                    this.details += `${difference.toFixed(3)} Months at $${rate}\n`;
                }
              
                take += difference * rate;
                months += difference;
            }
            date = nextDate;
        }

        remainingAmount -= take;

        let rate = this.getRateWithin(date);

        months += remainingAmount / rate;

        this.details += `${(remainingAmount / rate).toFixed(3)} Months at $${rate}`;

        return Number(months.toFixed(3));
    }


    /**
     * Calculates the date when the user's funds run out.
     * @returns {Date} - The end date.
     */
    calculateEndDate() {
        let days = this.totalMonths * 30.44;
        let d = this.startDate;
        d.setDate(d.getDate() + days);

        return d;
    }

    /**
     * Calculates the total amount paid based on the payments array.
     * @returns {number} - The total amount paid, rounded to two decimal places.
     */
    calculatePaid() {
        let a = 0;

        this.payments.forEach(p => {
            a += p.price;
        });

        return a.toFixed(2);
    } 

    /**
     * Calculates the rate within a specific date based on the prices array.
     * @param {Date} date - The date to compare against the prices array.
     * @returns {number} - The rate within the corresponding date range.
     */ 
    getRateWithin(date) {
        let r = 0;

        for (let i = 0; i < prices.length; i++) {
            let d2 = new Date(prices[i]['date']);

            if (date >= d2) {
                r = prices[i]['price'] / 6;
            }
        }

        if (this.name == 'kent') {
            r *= 2;
        }
        return Number(r.toFixed(2));
    }

    /**
     * Calculates the difference between two dates in months.
     * @param {Date} date - The first date.
     * @param {Date} date2 - The second date.
     * @returns {number} - The difference in months, rounded to two decimal places.
     */
    timeDifference(date, date2) {
        const diffTime = Math.abs(date2 - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = (diffDays / 30.44).toFixed(2);

        return Number(diffMonths);
    }

    print() {
        let form = (w) => {
            let e = w.toString().split(' ');
            return `${e[1]} ${e[2]}, ${e[3]}`
        };

        let paylist = "";

        this.payments.forEach(e => {
            paylist += `$${e.price} - ${form(new Date(e.date))}\n`
        });

        console.log(`${this.name}\nEnds: ${form(this.endDate)}\nPaid: $${this.paid} : ${this.totalMonths} Months\n\n${paylist}\n${this.details}\n\n`);
    }
}

module.exports = {
    User
};