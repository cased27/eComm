const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// receive post request to add item to cart
router.post('/cart/products', async (req, res) => {
    let cart;
    if (!req.session.cartId) {
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId)
    }
    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    });
    res.send('product added to cart')
})

router.get('/cart', (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }
    
    const cart = await cartsRepo.getOne(req.session.cartId);
})

//receive post request to delete item from cart


module.exports = router;