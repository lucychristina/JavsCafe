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
  