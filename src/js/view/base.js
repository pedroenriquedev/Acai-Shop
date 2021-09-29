const elements = {
    // nav bar elements
    userBtn: document.querySelector('.user'),
    navBar: document.querySelector('.nav'),
    shoppingCart: document.querySelector('.shoppingCart'),
    footer: document.querySelector('.footer'),
    createAnAcc: document.querySelector('.createAnAccount__container'),
    // selectAcai page elements
    sizeInput: Array.from(document.getElementsByName('size')),
    addToCartBtn: document.querySelector('.addToCart'),
    itemInstructions: document.getElementById('item-instructions'),
    allInput: Array.from(document.getElementsByTagName('input')),
    listViewNumber: document.querySelector('.shopCartNum'),
    reviewOrderBtn: document.querySelector('.btn__reviewOrder'),
    logoutBtn: document.querySelector('.logoutBtn'),
    inputOptions: Array.from(document.querySelectorAll('[id^="option"]')),
    // reviewOrder page elements
    addQuantityBtns: Array.from(document.querySelectorAll('.addQtBtn')),
    removeQuantityBtns: Array.from(document.querySelectorAll('.removeQtBtn')),
    total: document.querySelector('.shoppingCart__total'),
    removeBtn: Array.from(document.querySelectorAll('.shoppingCart__item-remove')),
    itemsContainer: document.querySelector('.shoppingCart__items'),
    checkoutBtn: document.querySelector('.btn__checkout'),
    editBtns: Array.from(document.querySelectorAll('.shoppingCart__item-edit')),
    checkoutAsGuestBtn: document.querySelector('.guestCheckoutBtn'),
    //login page elements
    loginEmail: document.querySelector('.loginForm__email'),
    loginPassword: document.querySelector('.loginForm__password'),
    signUpName: document.querySelector('.signUp__name'),
    signUpEmail: document.querySelector('.signUp__email'),
    signUpPassword: document.querySelector('.signUp__password'),
    signUpPasswordConfirm: document.querySelector('.signUp__confirmPassword'),
    loginForm: document.querySelector('.loginForm'),
    signUpForm: document.querySelector('.signUpForm'),
    loginBtn: document.querySelector('.login__btn'),
    signUpBtn: document.querySelector('.signUp__btn'),
    // password reset page elements
    resetPassword: document.querySelector('.resetPassword'),
    resetPasswordConfirm: document.querySelector('.resetPasswordConfirm'),
    resetPasswordBtn: document.querySelector('.resetPasswordBtn'),
    resetPasswordForm: document.querySelector('.resetPasswordForm'),
    // forgot password page elements
    forgotPasswordBtn: document.querySelector('.link__forgotPassword'),
    forgotPasswordFormBtn: document.querySelector('.forgotPasswordBtn'),
    forgotPasswordEmail: document.querySelector('.forgotPasswordEmail'),
    forgotPasswordForm: document.querySelector('.forgotPasswordForm'),
}

const fruitAddOn = document.getElementById('fruitAddOn');

if (fruitAddOn) {
    elements.fruitsAddOn = Array.from(document.getElementById('fruitAddOn').getElementsByTagName('input'));
    elements.toppingAddOn = Array.from(document.getElementById('toppingAddOn').getElementsByTagName('input'));
    elements.drizzleAddOn = Array.from(document.getElementById('drizzleAddOn').getElementsByTagName('input'));
    elements.powderAddOn = Array.from(document.getElementById('powderAddOn').getElementsByTagName('input'));
}

export { elements };

