import Item from "./model/Item";
import List from "./model/List";
import { elements } from "./view/base";
import * as itemView from "./view/itemView";
import { showAlert } from "./view/alerts";
import * as listView from "./view/listView";
import { loadSpinner } from "./view/spinningCircle";

const Base64 = require("js-base64");
const axios = require("axios");

const state = {
  list: {},
};

const logout = async () => {
  try {
    await axios({
      method: "GET",
      url: "/api/v1/user/logout",
    }).then(function (res) {
      if (res.data.message === "success") location.reload();
    });
    // console.log(res);
    // if (res.data.status === 'success') location.reload();
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

const login = async (email, password) => {
  try {
    loadSpinner(elements.loginBtn);
    const res = await axios({
      method: "POST",
      url: "/api/v1/user/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    elements.loginBtn.innerHTML = "Login";
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

const signUp = async (name, email, password, passwordConfirm) => {
  try {
    loadSpinner(elements.signUpBtn);
    const res = await axios({
      method: "POST",
      url: "/api/v1/user/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Your account has been created!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    elements.signUpBtn.innerHTML = "Sign up";
    showAlert("error", err.response.data.message);
  }
};

window.onload = (e) => {
  if (localStorage.getItem("items") !== null) {
    state.list.items = JSON.parse(localStorage.getItem("items"));
    state.list.items.forEach((e, i) => {
      e.checkout_id = i;
    });
  } else {
    state.list.items = [];
  }

  //listView.updateListNum(state.list.items);
};

const itemControl = (isPreLoad) => {
  let size;
  if (itemView.getSize(elements.sizeInput)) {
    size = parseInt(itemView.getSize(elements.sizeInput).dataset.size);
  } else {
    size = -1;
  }

  let price;
  if (size === 0) {
    price = 6;
  }

  if (size === 1) {
    price = 11;
  }

  if (size === 2) {
    price = 14;
  }

  if (size === 3) {
    price = 18;
  }

  const addOns = {
    fruits: itemView.getAddOn(elements.fruitsAddOn),
    toppings: itemView.getAddOn(elements.toppingAddOn),
    drizzle: itemView.getAddOn(elements.drizzleAddOn),
    powder: itemView.getAddOn(elements.powderAddOn),
  };

  const instr = elements.itemInstructions.value;

  const quantity = 1;

  if (size !== -1) {
    const acai = new Item(size, addOns, instr, price, quantity);

    itemView.clearAllInputs(elements.allInput);

    state.acai = acai;

    if (!isPreLoad) showAlert("success", "Successfully added!");
  } else {
    if (!isPreLoad) showAlert("error", "Please select a size");
    state.acai = null;
  }
};

const listControl = () => {
  if (!state.list) state.list = new List();

  if (state.acai !== null) {
    // add item to list
    state.list.items.push(state.acai);
    // update num (just number)
  }
};

//reviewOrder page functions
const updateTotalUI = () => {
  let total = 0;

  let totals = Array.from(
    document.querySelectorAll(".shoppingCart__item-total")
  );

  totals.forEach((el, index) => {
    total = total + parseInt(el.innerHTML.split("$")[1]);
  });

  elements.total.innerHTML = `Total: $ ${total}`;
};

const updateNumberOfItems = (num) => {
  //elements.listViewNumber.innerHTML = `${num}`;
};

// selectAcai page listeners
if (elements.addToCartBtn) {
  elements.addToCartBtn.addEventListener("click", () => {
    itemControl(false);
    listControl();
    updateNumberOfItems(state.list.items.length);
    // back to top of the page TODO
  });
}

const loadReviewOrderPage = (e) => {
  e.preventDefault();
  //take json obj and convert it to string
  if (state.list == undefined) {
    alert("Please, add at least one acai to proceed");
    return;
  }
  itemControl(true);
  listControl();
  let str = JSON.stringify(state.list.items);
  //take the string and encode it in Base64

  localStorage.setItem("items", str);
  str = Base64.encode(str);
  //append it to the URL andmake the get call

  const param = `items=${str}`;

  const url = `/reviewOrder?${param}`;
  window.location.href = url;
};

if (elements.reviewOrderBtn) {
  elements.reviewOrderBtn.addEventListener("click", loadReviewOrderPage);
}

// reviewOrder page listeners
if (elements.addQuantityBtns) {
  elements.addQuantityBtns.forEach((el) => {
    el.addEventListener("click", () => {
      const quantityBox = el.previousElementSibling;
      let quantity = parseInt(quantityBox.innerHTML);
      const itemBox = el.parentNode.parentNode;
      const totalBox = itemBox.querySelector(".shoppingCart__item-total");
      const id = parseInt(el.parentNode.parentNode.classList[1].split("-")[1]);
      quantity = quantity + 1;

      // update state list (quantity)
      for (var i = 0; i < state.list.items.length; i++) {
        if (state.list.items[i].checkout_id === id) {
          state.list.items[i].quantity = quantity;
        }
      }

      // update ui (quantity, total)

      quantityBox.innerHTML = quantity;
      const price = parseInt(
        itemBox
          .querySelector(".shoppingCart__item-price")
          .innerHTML.split("$")[1]
      );
      totalBox.innerHTML = `$ ${price * quantity}`;
      updateTotalUI();
    });
  });
}

if (elements.removeQuantityBtns) {
  elements.removeQuantityBtns.forEach((el) => {
    el.addEventListener("click", () => {
      const quantityBox = el.nextElementSibling;
      let quantity = parseInt(quantityBox.innerHTML);
      const itemBox = el.parentNode.parentNode;
      const totalBox = itemBox.querySelector(".shoppingCart__item-total");
      const id = parseInt(el.parentNode.parentNode.classList[1].split("-")[1]);

      // update state list (quantity)

      for (var i = 0; i < state.list.items.length; i++) {
        if (state.list.items[i].checkout_id === id) {
          if (quantity !== 1) {
            quantity = quantity - 1;
            state.list.items[i].quantity = quantity;
          } else {
            state.list.items[i].quantity = 1;
          }
        }
      }

      // update ui (quantity, total)
      quantityBox.innerHTML = "";
      quantityBox.innerHTML = quantity;
      const price = parseInt(
        itemBox
          .querySelector(".shoppingCart__item-price")
          .innerHTML.split("$")[1]
      );
      totalBox.innerHTML = `$ ${price * quantity}`;
      updateTotalUI();
    });
  });
}

if (elements.removeBtn) {
  elements.removeBtn.forEach((el, i) => {
    el.addEventListener("click", () => {
      const id = parseInt(el.parentNode.classList[1].split("-")[1]);
      // remove from state

      //const result = state.list.items.filter((obj, i) => {
      //  if (obj.checkout_id === id) return i;
      //})
      for (var i = 0; i < state.list.items.length; i++) {
        if (state.list.items[i].checkout_id === id) {
          state.list.items.splice(i, 1);
        }
      }
      console.log(state.list.items);
      let str = JSON.stringify(state.list.items);
      localStorage.setItem("items", str);

      // because of the rendering logic, we need to update the url
      str = Base64.encode(str);
      const url = `/reviewOrder?items=${str}`;
      window.history.pushState({}, "", url);
      // remove from ui
      elements.itemsContainer.removeChild(el.parentNode);

      updateNumberOfItems(state.list.items.length);
      updateTotalUI();
    });
  });
}

const createStripeSession = async (items) => {
  if (items.length === 0) return;

  try {
    //loadSpinner(elements.signUpBtn);
    const res = await axios({
      method: "POST",
      url: "/api/v1/bookings/checkout-session",
      data: {
        items,
      },
    });

    // if (res.data.message === 'success') {
    //   showAlert('success', 'Loading...')
    // }

    const url = res.data.session.url;

    window.location = url;
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

if (elements.checkoutBtn) {
  elements.checkoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    //console.log(state.list);

    if (state.list.items.length === 0) {
      showAlert("error", "Your cart is empty. Try adding some acais first!");
      return;
    }

    if (!elements.userBtn) {
      const blurredElements = [
        elements.navBar,
        elements.shoppingCart,
        elements.footer,
      ];
      blurredElements.forEach((e) => {
        e.classList.add("blur");
      });

      elements.createAnAcc.classList.add("display");
      return;
      // load page to fill name, email and address if user does not wish to crate an account
    }

    createStripeSession(state.list.items);
  });
}

if (elements.checkoutAsGuestBtn) {
  elements.checkoutAsGuestBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    createStripeSession(state.list.items);
  });
}

if (elements.editBtns) {
  elements.editBtns.forEach((el, i) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = parseInt(el.parentNode.classList[1].split("-")[1]);
      const item = state.list.items.find((item) => {
        return item.checkout_id === id;
      });

      // remove item from state before editing it
      for (var i = 0; i < state.list.items.length; i++) {
        if (state.list.items[i].checkout_id === id) {
          state.list.items.splice(i, 1);
        }
      }

      let itemsStr = JSON.stringify(state.list.items);
      localStorage.setItem("items", itemsStr);

      let str = JSON.stringify(item);
      str = Base64.encode(str);
      const url = `/?item=${str}`;
      window.location.href = url;
    });
  });
}

// Login/SignUp page listeners

if (elements.loginForm) {
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;
    login(email, password);
  });
}

if (elements.signUpForm) {
  elements.signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = elements.signUpName.value;
    const email = elements.signUpEmail.value;
    const password = elements.signUpPassword.value;
    const passwordConfirm = elements.signUpPasswordConfirm.value;

    signUp(name, email, password, passwordConfirm);
  });
}

if (elements.logoutBtn) {
  elements.logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

// Reset password page listeners
const resetPasswordAPI = async (newPassword, newPasswordConfirm, token) => {
  try {
    loadSpinner(elements.resetPasswordBtn);
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/user/resetPassword/${token}`,
      data: {
        newPassword,
        newPasswordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Password updated successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    elements.resetPasswordBtn.innerHTML = "Reset Password";
    showAlert("error", err.response.data.message);
  }
};

if (elements.resetPasswordForm) {
  elements.resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPassword = elements.resetPassword.value;
    const newPasswordConfirm = elements.resetPasswordConfirm.value;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    console.log(token);
    resetPasswordAPI(newPassword, newPasswordConfirm, token);
  });
}

if (elements.forgotPasswordBtn) {
  elements.forgotPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/forgotPassword`;
  });
}

const sendResetPassEmail = async (email) => {
  try {
    loadSpinner(elements.forgotPasswordFormBtn);
    const res = await axios({
      method: "POST",
      url: "/api/v1/user/forgotPassword",
      data: {
        email,
      },
    });

    if (res.data.message === "success") {
      showAlert("success", "Email sent successfully! Check your inbox!");
      elements.forgotPasswordFormBtn.innerHTML = "Reset Password";
      //window.setTimeout(() => { location.assign('/') }, 1500)
    }
  } catch (err) {
    elements.forgotPasswordFormBtn.innerHTML = "Reset Password";
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

if (elements.forgotPasswordForm) {
  elements.forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = elements.forgotPasswordEmail.value;
    sendResetPassEmail(email);
  });
}

if (elements.inputOptions) {
  elements.inputOptions.forEach((input) => {
    input.addEventListener("change", (e) => {
      const optionsContainer = e.target.parentElement;
      const options = Array.from(
        optionsContainer.getElementsByTagName("input")
      );

      const checkedOptions = options.filter(
        (option) => option.checked === true
      );
      if (checkedOptions.length > 4) {
        showAlert("error", "Please choose up to 4 from each add-ons!");
        e.target.checked = false;
      }
    });
  });
}
