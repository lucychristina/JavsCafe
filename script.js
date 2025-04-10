document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".menu a[href='keranjang.html'] img");
  const buttons = document.querySelectorAll(".add-to-cart");
  let cartCount = localStorage.getItem("cartCount") ? parseInt(localStorage.getItem("cartCount")) : 0;
  let cartBadge = document.createElement("span");

  // Tambahkan badge jumlah di ikon keranjang
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

  // Tambah ke keranjang
  buttons.forEach(button => {
      button.addEventListener("click", function (event) {
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

          // Animasi gambar ke ikon keranjang
          let buttonRect = event.target.getBoundingClientRect();
          let cartRect = cartIcon.getBoundingClientRect();

          let img = document.createElement("img");
          img.src = event.target.parentElement.querySelector("img").src;
          img.style.position = "fixed";
          img.style.width = "50px";
          img.style.height = "50px";
          img.style.borderRadius = "50%";
          img.style.zIndex = "1000";
          img.style.left = `${buttonRect.left + window.scrollX}px`;
          img.style.top = `${buttonRect.top + window.scrollY}px`;
          document.body.appendChild(img);

          setTimeout(() => {
              img.style.transition = "all 1s ease-in-out";
              img.style.left = `${cartRect.left + window.scrollX + 10}px`;
              img.style.top = `${cartRect.top + window.scrollY + 10}px`;
              img.style.opacity = "0";
          }, 100);

          setTimeout(() => {
              img.remove();
          }, 1100);
      });
  });

  // Untuk halaman keranjang
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

      // Button fungsionalitas
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

      checkoutButton.addEventListener("click", () => {
          // Tampilkan opsi pembayaran
          const metode = confirm("Pilih OK untuk pembayaran via Barcode\nKlik Cancel untuk bayar Cash");
          if (metode) {
              // Barcode
              window.location.href = "bayar_barcode.html";
          } else {
              // Cash
              window.location.href = "bayar_cash.html";
          }
      });
  }
});
