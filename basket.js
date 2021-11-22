'use strict';

const mainMenuEl = document.querySelector('.main-menu');
const right__nav__burgerEl = document.querySelector('.right__nav__burger');
const mainMenuCloseBtnEl = document.querySelector('.main-menu-close-btn-svg');
const basketEl = document.querySelector('.basket');
const basket__imgEl = document.querySelector('.basket__img');
const basketTotalEl = document.querySelector('.basketTotal');
const basketTotalValueEl = document.querySelector('.basketTotalValue');

/**
 * Обработчик открытия меню.
 */
function showHideMenu() {
    if (mainMenuEl.classList.contains('main-menu-open')) {
        mainMenuEl.classList.remove('main-menu-open');
        mainMenuEl.classList.add('main-menu-close');
    } else {
        mainMenuEl.classList.remove('main-menu-close');
        mainMenuEl.classList.add('main-menu-open');
    }
}

right__nav__burgerEl.addEventListener('click', showHideMenu);
mainMenuCloseBtnEl.addEventListener('click', showHideMenu);

/**
 * Обработчик открытия корзины при клике на ее значок.
 */
basket__imgEl.addEventListener('click', () => {
    basketEl.classList.toggle('hidden');
});

const basket = {};

document.querySelector('.fetured').addEventListener('click', event => {
    // Проверяем, если клик был не по кнопке, то ничего не делаем.
    if (!event.target.classList.contains('items-card-btn')) {
        return;
    }

    // Открываем окно корзины, при добавлении товара
    if (basketEl.classList.contains('hidden')) {
        basketEl.classList.remove('hidden');
    }

    // Получаем ближайшего родителя с классом items-card, в нем записаны все
    // нужные данные о продукте, получаем эти данные.
    const featuredEl = event.target.closest('.items-card');
    const id = +featuredEl.dataset.id;
    const name = featuredEl.dataset.name;
    const price = +featuredEl.dataset.price;
    // Добавляем в корзину продукт.
    addToCart(id, name, price);
});

function addToCart(id, name, price) {
    // Если такого продукта еще не было добавлено в наш объект, который хранит
    // все добавленные товары, то создаем новый объект.
    if (!(id in basket)) {
        basket[id] = { id: id, name: name, price: price, count: 0 };
    }
    // Добавляем в количество +1 к продукту.
    basket[id].count++;
    // Ставим новую общую стоимость товаров в корзине.
    basketTotalValueEl.textContent = getTotalBasketPrice().toFixed(2);
    // Отрисовываем продукт с данным id.
    renderProductInBasket(id);
}

function getTotalBasketCount() {
    return Object.values(basket).reduce((acc, product) => acc + product.count, 0);
}

function getTotalBasketPrice() {
    return Object
        .values(basket)
        .reduce((acc, product) => acc + product.price * product.count, 0);
}

function renderProductInBasket(productId) {
    // Получаем строку в корзине, которая отвечает за данный продукт.
    const basketRowEl = basketEl
        .querySelector(`.basketRow[data-productId="${productId}"]`);
    // Если такой строки нет, то отрисовываем новую строку.
    if (!basketRowEl) {
        renderNewProductInBasket(productId);
        return;
    }

    // Получаем данные о продукте из объекта корзины, где хранятся данные о всех
    // добавленных продуктах.
    const product = basket[productId];
    // Ставим новое количество в строке продукта корзины.
    basketRowEl.querySelector('.productCount').textContent = product.count;
    // Ставим нужную итоговую цену по данному продукту в строке продукта корзины.
    basketRowEl.querySelector('.productTotalRow')
        .textContent = (product.price * product.count).toFixed(2);
}

function renderNewProductInBasket(productId) {
    const productRow = `
      <div class="basketRow" data-productId="${productId}">
        <div>${basket[productId].name}</div>
        <div>
          <span class="productCount">${basket[productId].count}</span> шт.
        </div>
        <div>$${basket[productId].price}</div>
        <div>
          $<span class="productTotalRow">${(basket[productId].price * basket[productId].count).toFixed(2)}</span>
        </div>
      </div>
      `;
    basketTotalEl.insertAdjacentHTML("beforebegin", productRow);
}