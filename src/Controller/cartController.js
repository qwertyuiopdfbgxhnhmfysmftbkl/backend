const Cart = require('../Model/cartModel')
const User = require('../Model/userModel')
const Food = require('../Model/foodMenu')

let createCart = async (req, res) => {
    try {
        let userId = req.params.userId;

        let { foodId, quantity,...a } = req.body;

        if(!quantity) return res.status(400).send({status:false,message:'quantity required'}) 
        if (!quantity.toString().match(/^[0-9]+$/) || quantity < 1) return res.status(400).send({ status: false, message: 'quantity should be a natural number' })
        // Check if user exists

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if product exists and is not deleted
        let product = await Food.findOne({ _id: foodId });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if cart exists for user
        let cart = await Cart.findOne({ userId:userId });
        if (!cart) {
            // Create a new cart for the user
            cart = new Cart({
                userId,
                items: [{ foodId, quantity }],
                totalPrice: product.price * quantity,
                totalItems: 1,
            });
            await cart.save();
        } else {
            // Add product to existing cart
            let itemIndex = -1;
            for (let i = 0; i < cart.items.length; i++) {
                if (cart.items[i].foodId.toString() === foodId) {
                    itemIndex = i;
                    break;
                }
            }

            if (itemIndex === -1) {
                // Product not in cart, add it
                cart.items.push({ foodId, quantity });
                cart.totalPrice += product.price * quantity;
                cart.totalItems += 1;
            } else {
                // Product already in cart, update quantity
                cart.items[itemIndex].quantity = quantity;
                cart.totalPrice += product.price * quantity;
            }

            await cart.save()
        }

        let { __v, ...cartData } = cart._doc

        return res.status(201).json({ status: true, message: "cart successfully created", data: cartData });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

//___________________________________________Fetch Cart_______________________________________________________________
let getCart = async (req, res) => {

    try {

        let userId = req.params.userId;
        let userExist = await User.findOne({_id:userId})
        if(!userExist) return res.status(400).send({status:false,message:'user does not exist'})

        let cart = await Cart.findOne({ userId: userId }).populate({path:"items",populate:{path:"foodId"}})
        if (!cart) return res.status(404).send({ status: false, message: "cart does not exist!" })

        return res.status(200).send({ status: true, message: 'Success', data: cart })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}


let updateCart = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status().send({ status: false, message: "put some data to update cart" });
        let userId = req.params.userId;
        // if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid userId" })
        let { foodId, cartId, removeProduct,...a } = data;
        if(Object.keys(a).length!=0) return res.status(400).send({status:false,message:`please remove ${Object.keys(a)}`})

    
        if(!foodId) return res.status(400).send({status:false,message:'foodId requuired'});
        if(!cartId) return res.status(400).send({status:false,message:'cartId requuired'});

        foodId = String(foodId);
        cartId = String(cartId);

       // ___________________________________Authorization___________________________________________
       if (userId != req.decodedToken) return res.status(403).send({ status: false, message: "Unauthorized" })
      //  ___________________________________________________________________________________________


        if (![0, 1].includes(removeProduct)) return res.status(400).send({ status: false, message: "put either 1 or 0" })

        let userExist = await User.findOne({_id:userId})
        if(!userExist) return res.status(400).send({status:false,message:'user does not exist'})

        let isProductExist = await Food.findOne({ _id: foodId, isDeleted: false })
        if (!isProductExist) return res.status(404).send({ status: false, message: "product does not exist" })

        let cartDetails = await Cart.findOne({ _id: cartId, userId: userId });

        if (!cartDetails) return res.status(404).send({ status: false, message: "add products in cart first" })

        let productInCart = cartDetails.items.find(product => product.foodId == foodId);

        if (productInCart == undefined) return res.status(404).send({ status: false, message: "no Product in cart to Update" })
        let productIndex = cartDetails.items.findIndex(product => product.foodId == foodId);

        if (removeProduct == 0 || productInCart.quantity == 1) {
            cartDetails.items.splice(productIndex, 1)
            let updatedTotalPrice = cartDetails.totalPrice - (isProductExist.price * productInCart.quantity)

            let updatedTotalItems = cartDetails.totalItems - 1
            let updatedCart = await Cart.findOneAndUpdate({ _id: cartId, userId: userId }, { items: cartDetails.items, totalPrice: updatedTotalPrice, totalItems: updatedTotalItems }, { new: true })
            return res.status(200).send({ status: true, message: "updated successfully", data: updatedCart })
        }
        if (removeProduct == 1) {

            productInCart.quantity = productInCart.quantity - 1;
            cartDetails.items.splice(productIndex, 1, productInCart)
            let updatedTotalPrice = cartDetails.totalPrice - isProductExist.price;
            let updatedCart = await Cart.findOneAndUpdate({ _id: cartId, userId: userId }, { items: cartDetails.items, totalPrice: updatedTotalPrice }, { new: true })
            return res.status(200).send({ status: true, message: "updated successfully", data: updatedCart })

        }


    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}
//___________________________________________Cart Deletion______________________________________________________________
let deleteCart = async function (req, res) {

    try {
        let userId = req.params.userId

        //Authorization
        // if (userId != req.decodedToken) return res.status(403).send({ status: false, message: "you are not authorised for this action" })
        //Authorization

        let userExist = await User.findOne({_id:userId})
        if(!userExist) return res.status(400).send({status:false,message:'user does not exist'})

        let checkCart = await Cart.findOne({ userId: userId })

        if (!checkCart) return res.status(404).send({ status: false, Message: 'Cart not found' })
        if(checkCart.items.length==0) return res.status(404).send({status:false,message:'no items found in cart'})

        await Cart.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 })

        return res.status(204).send({ status: true, message: 'Sucessfully deleted' })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCart, getCart, updateCart, deleteCart }