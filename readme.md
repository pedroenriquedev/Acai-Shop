# Acai Shop App

With this app, you can easily order your favorite açaí dish in just a few clicks. Choose from 4 different sizing options and add your favorite fruits, toppings, powders, and drizzle to create your perfect açaí.

## Tech Stack

- **Back End:** ExpressJS/NodeJS, Mongoose/MongoDB. Using Sendgrid for emails and Stripe for payments. Using JSON Web Tokens for authentication.
- **Front End:** Server side rendering with PUG, Javascript and SCSS.

## Live Demo

https://acaishop.onrender.com/

#### Showcase

![Acai Shop Demo](demo/acaishop.gif)

## Features

Users can/will:

- Choose different sizes for their acais.
- Select their desirable add ons.
- Add an acai to their shopping cart.
- Edit an already built acai from their shopping cart.
- Remove an acai and change the quantity from their shopping cart.
- Check out as a guest or create an account.
- Place an order with Stripe.
- Recover their password through a link sent via email.
- Receive an email upon signing up.
- Receive an email after placing an order.

## Installation

You'll need MongoDB, Stripe and Sendgrid accounts in order to run the app.

#### Environment Variables

To run this project, you will need to add the following environment variables:

`DATABASE` - Your MongoDB connection string.

`DATABASE_PASSWORD` - Your MongoDB password. We will replace the <password> in the connection string with this.

`JWT_SECRET` - Used for the JWT signature.

`JWT_EXPIRES_IN` - How long you want the JWT to last.

`NODE_ENV`

`EMAIL_FROM`

`SENDGRID_USERNAME`

`SENDGRID_PASSWORD`

`STRIPE_SECRET_KEY_DEVELOPMENT`

`STRIPE_WEBHOOK_SECRET`

#### Run Locally

Clone the project

```bash
  git clone https://github.com/pedroenriquedev/Acai-Shop.git
```

Go to the project directory

```bash
  cd my-project
```

```bash
  npm install
```

```bash
  npm run server
```

## Support

For support, please email pedroenriquedev@gmail.com.
