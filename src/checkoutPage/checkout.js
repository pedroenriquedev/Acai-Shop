

const state = {
};

const numberOfItems = document.querySelector('.shopCartNum');

const getHtmlElements = () => {
  const elements = {
    addQuantityBtns: Array.from(document.querySelectorAll('.addQtBtn')),
    removeQuantityBtns: Array.from(document.querySelectorAll('.removeQtBtn')),
    total: document.querySelector('.shoppingCart__total'),
    removeBtn: Array.from(document.querySelectorAll('.shoppingCart__item-remove')),
    itemsContainer: document.querySelector('.shoppingCart__items'),
    checkoutBtn: document.getElementById('checkoutBtn'),
  }

  return elements
}


const getSizeFromModel = (size) => {
  if (size === 0) {
    return '12 oz. cup'
  }

  if (size === 1) {
    return '24 oz. cup'
  }

  if (size === 2) {
    return '32 oz. bowl'
  }

  if (size === 3) {
    return '42 oz. bowl'
  }
  
};

const getAddOnsFromModel =  (addOn) => {
  
  const markup = [];
  addOn.forEach(el => {
    if (el !== -1) {
      let preHtml = `<i>${el}</i>`;
      markup.push(preHtml);
    }
  });
  if (markup.length === 0) return '-';
  return markup.join('<br>');
}

  /*
  const newArr = arr.filter((addOn) => addOn !== -1);

  console.log(newArr);
 */

const setOneItemMarkup = (item, i) => {
  const markup = `
<li class="shoppingCart__item shoppingCart__item-${i}">
<button class="shoppingCart__item-remove">remove</button>
<a class="shoppingCart__item-edit" href="#">edit</a>

<div class="img"></div>
<div class="shoppingCart__item-description">
  <h2>${getSizeFromModel(item.size)}</h2>

  <ul>
    <h3>Fruits</h3>
    <li>${getAddOnsFromModel(item.addOns.fruits)}</li>
  </ul>

  <ul>
    <h3>Powder</h3>
    <li>${getAddOnsFromModel(item.addOns.powder)}</li>
  </ul>

  <ul>
    <h3>Toppings</h3>
    <li>${getAddOnsFromModel(item.addOns.toppings)}</li>
  </ul>

  <ul>
    <h3>Drizzle</h3>
    <li>${getAddOnsFromModel(item.addOns.drizzle)}</li>
  </ul>
</div>

<div class="shoppingCart__item-quantity">
  <button class="removeQtBtn">-</button>
  <span>${item.quantity}</span> 
  <button class="addQtBtn">+</button>
</div>

<div class="shoppingCart__item-price">$${item.price}</div>

<div class="shoppingCart__item-total">$${(item.price)*(item.quantity)}</div>
</li>
`;

return markup;
}

const updateNumberOfItems = (num) => {
 numberOfItems.innerHTML = `${num}`;
};

const renderAllItems = () => {
  const markup = [];

  state.list.items.forEach((el, i) => {
    const itemMarkup = setOneItemMarkup(el, i);
    el.checkout_id = i;
    markup.push(itemMarkup);
  });
  let html = markup.join(' ');

  updateNumberOfItems(state.list.items.length);

  document
  .querySelector(".shoppingCart__items")
  .insertAdjacentHTML("beforeend", html);
  
}

const increaseAcaiQuantity = () => {

}
  
const elements = getHtmlElements();


const updateTotalUI = () => {
  let total = 0;
  
  let totals = Array.from(document.querySelectorAll('.shoppingCart__item-total'));
  totals.forEach((el, index) => {
    total = total + parseInt(el.innerHTML.split('$')[1]);
    
  })


  elements.total.innerHTML = `Total: $${total}`;

  
};



elements.addQuantityBtns.forEach(el => {
  el.addEventListener('click', () => {
    const quantityBox =  el.previousElementSibling;
    let quantity = parseInt(quantityBox.innerHTML);
    const itemBox = el.parentNode.parentNode;
    const totalBox = itemBox.querySelector('.shoppingCart__item-total');
    const id = parseInt(el.parentNode.parentNode.classList[1].split('-')[1]);
    quantity = quantity + 1;
    // update state list (quantity)
    
    for (var i = 0; i < state.list.items.length; i++) {
      if (state.list.items[i].checkout_id === id) {
          state.list.items[i].quantity = quantity;
      }
    }
     
       // update ui (quantity, total)
   quantityBox.innerHTML = '';
   quantityBox.innerHTML = quantity;
   const price = parseInt(itemBox.querySelector('.shoppingCart__item-price').innerHTML.split('$')[1]); 
   totalBox.innerHTML = `$${price*quantity}`;
   updateTotalUI();
  })
});

elements.removeQuantityBtns.forEach(el => {
  el.addEventListener('click', () => {
    
    const quantityBox =  el.nextElementSibling;
    let quantity = parseInt(quantityBox.innerHTML);
    const itemBox = el.parentNode.parentNode;
    const totalBox = itemBox.querySelector('.shoppingCart__item-total');
    const id = parseInt(el.parentNode.parentNode.classList[1].split('-')[1]);
    
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
   quantityBox.innerHTML = '';
   quantityBox.innerHTML = quantity;
   const price = parseInt(itemBox.querySelector('.shoppingCart__item-price').innerHTML.split('$')[1]); 
   totalBox.innerHTML = `$${price*quantity}`;
   updateTotalUI();
  })
})

elements.removeBtn.forEach((el, i) => {
  el.addEventListener('click', () => {
    
    const id = parseInt(el.parentNode.classList[1].split('-')[1]);
 
    // remove from state
    
    //const result = state.list.items.filter((obj, i) => {
    //  if (obj.checkout_id === id) return i;
    //})
    for (var i = 0; i < state.list.items.length; i++) {
      if (state.list.items[i].checkout_id === id) {
        state.list.items.splice(i, 1);
      }
    }
    // remove from ui
    elements.itemsContainer.removeChild(el.parentNode);
    updateTotalUI();
    console.log(state.list.items);
    updateNumberOfItems(state.list.items.length);
  });
})

elements.checkoutBtn.addEventListener('click', () => {
  console.log(state.list.items);
})

