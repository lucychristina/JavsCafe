document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".menu a[href='keranjang.html'] img");
  const buttons = document.querySelectorAll(".add-to-cart");
  let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

  // Badge keranjang
  let cartBadge = document.createElement("span");
  cartBadge.style.position = "absolute";
  cartBadge.style.backgroundColor = "red";
  cartBadge.style.color = "white";
  cartBadge.style.borderRadius = "50%";
  cartBadge.style.padding = "5px 10px";
  cartBadge.style.fontSize = "13px";
  cartBadge.style.top = "-5px";
  cartBadge.style.right = "-10px";
  cartBadge.style.display = cartCount > 0 ? "block" : "none";
  cartBadge.textContent = cartCount;
  cartIcon.parentElement.style.position = "relative";
  cartIcon.parentElement.appendChild(cartBadge);

  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? "block" : "none";
    localStorage.setItem("cartCount", count);
  }

  // Fungsi animasi gambar terbang ke keranjang
  function animateToCart(button) {
    const productContainer = button.closest(".product") || button.closest(".tea") || button.closest(".menu-item");
    const productImg = productContainer?.querySelector("img");
    if (!productImg || !cartIcon) return;

    const img = document.createElement("img");
    img.src = productImg.src;
    img.style.position = "fixed";
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.borderRadius = "50%";
    img.style.zIndex = "1000";

    const startRect = productImg.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    img.style.left = `${startRect.left + window.scrollX}px`;
    img.style.top = `${startRect.top + window.scrollY}px`;
    document.body.appendChild(img);

    requestAnimationFrame(() => {
      img.style.transition = "all 1s ease-in-out";
      img.style.left = `${endRect.left + window.scrollX + 10}px`;
      img.style.top = `${endRect.top + window.scrollY + 10}px`;
      img.style.opacity = "0";
    });

    setTimeout(() => img.remove(), 1000);
  }

  // Event pada semua tombol "Tambah Pesanan"
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const name = button.getAttribute("data-name");
      const price = parseInt(button.getAttribute("data-price"));
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();

      // Animasi tombol
      button.classList.add("clicked");
      setTimeout(() => button.classList.remove("clicked"), 200);

      // Pulse icon keranjang
      cartIcon.classList.add("pulse");
      setTimeout(() => cartIcon.classList.remove("pulse"), 500);

      // Animasi gambar ke keranjang
      animateToCart(button);
    });
  });

  // Tombol scroll up
  const scrollUpButton = document.querySelector(".scroll-up");
  if (scrollUpButton) {
    scrollUpButton.style.display = "none";
    window.addEventListener("scroll", () => {
      scrollUpButton.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollUpButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // CART render
  const cartContainer = document.getElementById("add-to-cart");
  const totalDisplay = document.getElementById("total-data-price");
  const checkoutButton = document.getElementById("checkoutButton");

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.innerHTML = `
        <p><strong>${item.name}</strong> - Rp ${item.price.toLocaleString()} x${item.quantity}</p>
        <button class="increase" data-index="${index}">+</button>
        <button class="decrease" data-index="${index}">-</button>
        <button class="remove" data-index="${index}">Hapus</button>
      `;
      cartContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    if (totalDisplay) totalDisplay.textContent = `Total: Rp ${total.toLocaleString()}`;
    if (checkoutButton) checkoutButton.style.display = cart.length > 0 ? "block" : "none";
    updateCartBadge();

    cartContainer.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    cartContainer.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    cartContainer.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  if (cartContainer && totalDisplay && checkoutButton) {
    renderCart();
  }

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      alert("✅ Pembayaran berhasil! Terima kasih telah membeli di Jav's Cafe ☕️✨");
      localStorage.removeItem("cart");
      localStorage.removeItem("cartCount");
      location.href = "home.html";
    });
  }
});
