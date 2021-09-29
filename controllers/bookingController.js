const Stripe = require('stripe');

const getAcaiName = size => {
    if (size === 0) return 'Acai Cup 12oz';
    if (size === 1) return 'Acai Cup 24oz';
    if (size === 2) return 'Acai Bowl 32oz';
    if (size === 3) return 'Acai Bowl 42oz';
}

const getAcaiPrice = size => {
    if (size === 0) return 6;
    if (size === 1) return 11;
    if (size === 2) return 14;
    if (size === 3) return 18;
}


const getAcaiAddOns = addOns => {
    let Str = [];
    
    const addOnsArr = Object.values(addOns);
    addOnsArr.forEach(e => {
        e.forEach(el => {
            if (el !== -1) {
                Str.push(el);
            }
        });
    });
    const finalStr = Str.join(', ');
    return finalStr;
}

const createStripeProduct = (stripe, item) => {
    
    const acaiName = getAcaiName(item.size);
    const addOnsStr = getAcaiAddOns(item.addOns);
    
    return stripe.products.create({
        name: acaiName,
        description: `${addOnsStr}`,
        metadata: {
            "instructions": item.instructions
        }
    })
} 

const createStripePrice = (stripe, StripeProduct, acai) => {
    const price = getAcaiPrice(acai.size);
    
    return stripe.prices.create({
        unit_amount: price * 100,
        currency: 'usd',
        product: StripeProduct.id
    })    
}

const createStripeSessionGuest = (lineItems, stripe, req) => {
    return stripe.checkout.sessions.create({
        success_url: `${req.protocol}://${req.get('host')}`,
        cancel_url: `${req.protocol}://${req.get('host')}`,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        shipping_rates: ['shr_1JaMWuAK1T2BEtG9tHug9ZzG'],
        shipping_address_collection: {
            allowed_countries: ['US'],
        }
    });
}

const createStripeSessionUser =  (lineItems, stripe, req) => {
    return stripe.checkout.sessions.create({
        success_url: `${req.protocol}://${req.get('host')}`,
        cancel_url: `${req.protocol}://${req.get('host')}`,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        client_reference_id: req.user.id,
        customer_email: req.user.email,
        shipping_rates: ['shr_1JaMWuAK1T2BEtG9tHug9ZzG'],
        shipping_address_collection: {
            allowed_countries: ['US'],
        }
    });
}


exports.getCheckoutSession = async (req, res, next) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY_DEVELOPMENT);
    try {
        // instructions, size, quantity, addOns
        const itemsArr = req.body.items;
        
        // for each item in array, create product then create price
        // return an array of objects, with the quantity and price object in it
        
        const acaiPriceObjects = itemsArr.map( async (acai, i) => {
            // create stripe product object
            const acaiProductObj = await createStripeProduct(stripe, acai);
            // create stripe price object
            const acaiPriceObj = createStripePrice(stripe, acaiProductObj, acai);
            
            return acaiPriceObj;
        });
        
        const results = await Promise.all(acaiPriceObjects);
        
        
        const lineItems = results.map((e, i) => {
            return {
                quantity: itemsArr[i].quantity,
                price: e.id
            }
        });
        
        // creates stripe session
        let session;
        if (req.user === undefined) {
            session = await createStripeSessionGuest(lineItems, stripe, req)
        } else {
            session = await createStripeSessionUser(lineItems, stripe, req);
        }
        
        res.status(200).json({
            message: 'success',
            session
        })
        
    } catch (error) {
        next(error);
    }
}