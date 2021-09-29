export default class Item {
    constructor (size, AddOns, instructions, price, quantity) {
        this.size = size;
        this.addOns = {
            fruits: AddOns.fruits,
            toppings: AddOns.toppings,
            drizzle: AddOns.drizzle,
            powder: AddOns.powder
        };
        this.instructions = instructions;
        this.price = price;
        this.quantity =  quantity;
    }
}
