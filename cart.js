document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartContainer = document.createElement('div');
    cartContainer.id = 'cart-container';
    cartContainer.style.position = 'absolute';
    cartContainer.style.top = '60px';
    cartContainer.style.right = '140px';  /* shifted further right to align with currency selector */
    cartContainer.style.left = '';
    cartContainer.style.transform = '';
    cartContainer.style.bottom = '';
    cartContainer.style.width = '300px';
    cartContainer.style.maxHeight = '400px';
    cartContainer.style.overflowY = 'auto';
    cartContainer.style.backgroundColor = '#fff';
    cartContainer.style.border = '1px solid #ccc';
    cartContainer.style.padding = '10px';
    cartContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    cartContainer.style.zIndex = '1000';
    cartContainer.style.display = 'none';

    const cartTitle = document.createElement('h3');
    cartTitle.textContent = 'Your Cart';
    cartContainer.appendChild(cartTitle);

    const cartList = document.createElement('ul');
    cartList.id = 'cart-list';
    cartList.style.listStyle = 'none';
    cartList.style.padding = '0';
    cartContainer.appendChild(cartList);

    const cartTotal = document.createElement('p');
    cartTotal.id = 'cart-total';
    cartTotal.style.fontWeight = 'bold';
    cartTotal.style.marginTop = '10px';
    cartContainer.appendChild(cartTotal);

    const checkoutButton = document.createElement('button');
    checkoutButton.textContent = 'Checkout';
    checkoutButton.style.marginTop = '10px';
    checkoutButton.className = 'btn-primary';
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'payment.html';
    });
    cartContainer.appendChild(checkoutButton);

    document.body.appendChild(cartContainer);

    const toggleCartButton = document.createElement('button');
    toggleCartButton.textContent = 'Cart';
    toggleCartButton.style.position = 'absolute';
    toggleCartButton.style.top = '20px';
    toggleCartButton.style.right = '140px';  /* shifted further right to align with cart container */
    toggleCartButton.style.left = '';
    toggleCartButton.style.bottom = '';
    toggleCartButton.style.zIndex = '1001';
    toggleCartButton.className = 'btn-primary';
    toggleCartButton.addEventListener('click', () => {
        if (cartContainer.style.display === 'none') {
            cartContainer.style.display = 'block';
        } else {
            cartContainer.style.display = 'none';
        }
    });
    document.body.appendChild(toggleCartButton);

    const conversionRates = {
        '$': 1,
        'GHC': 10.33, // updated rate: 1 USD = 10.33 GHC
        '€': 0.9,
        '£': 0.8
    };

    function convertPrice(price, fromSymbol, toSymbol) {
        const fromRate = conversionRates[fromSymbol] || 1;
        const toRate = conversionRates[toSymbol] || 1;
        return (price / fromRate) * toRate;
    }

    function updateCartUI() {
        cartList.innerHTML = '';
        let total = 0;
        let currencySymbol = localStorage.getItem('currencySymbol') || '$';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.marginBottom = '5px';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${item.name} x${item.quantity}`;
            li.appendChild(nameSpan);

            const convertedPrice = convertPrice(item.price, item.currency || '$', currencySymbol);
            const priceSpan = document.createElement('span');
            priceSpan.textContent = `${currencySymbol}${(convertedPrice * item.quantity).toFixed(2)}`;
            li.appendChild(priceSpan);

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.marginLeft = '10px';
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                updateCartUI();
            });
            li.appendChild(removeBtn);

            cartList.appendChild(li);
            total += convertedPrice * item.quantity;
        });
        cartTotal.textContent = `Total: ${currencySymbol}${total.toFixed(2)}`;
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            if (localStorage.getItem('loggedIn') !== 'true') {
                alert('Please log in to add items to your cart.');
                window.location.href = 'login.html';
                return;
            }
            const menuItem = e.target.closest('.menu-item');
            const name = menuItem.getAttribute('data-name');
            // Accept all currencies by parsing price as float, ignoring currency symbols
            const priceText = menuItem.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCartUI();
            cartContainer.style.display = 'block';
        });
    });
});
