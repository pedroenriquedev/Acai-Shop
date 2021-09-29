import {elements} from './base';

export const getSize = (sizeOptions) => sizeOptions.find(el => el.checked);

export const getAddOn = (category) => {
    // category => array from base.js
    const selectedAddOns = category.map(el =>{
       return el.checked ? el.dataset.value : -1
    });
    return selectedAddOns;
}

export const clearAllInputs = (inputs) => {
    inputs.forEach(el => {
        el.checked = false;
    });
}