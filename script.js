// ==========================================
// AJ STORY / SMARTCELL
// Catálogo de celulares
// ==========================================
// ==========================================
// SISTEMA DE LINK SECRETO PARA O ADMINISTRADOR
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin');
    
    // Altere a palavra "meusegredo" para a senha que você quiser usar no link
    if (isAdmin !== 'meusegredo') {
        // Se não for o administrador, esconde o formulário da tela
        const formulario = document.querySelector('form') || document.querySelector('#form-cadastro') || document.querySelector('.admin-section');
        if (formulario) {
            formulario.style.setProperty('display', 'none', 'important');
        }
    }
});
const WHATSAPP = "559881530868";

// Produtos iniciais do catálogo
const defaultProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    storage: "256 GB",
    color: "Titânio Natural",
    price: "R$ 4.299",
    image: "",
    status: "disponivel",
    description: "iPhone 15 Pro com ótimo desempenho e acabamento premium."
  },
  {
    id: 2,
    name: "iPhone 14",
    storage: "128 GB",
    color: "Preto",
    price: "R$ 3.199",
    image: "",
    status: "disponivel",
    description: "Aparelho completo, rápido e excelente para o dia a dia."
  }
];

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const productsElement = document.getElementById("products");
const filters = document.querySelectorAll(".filter");
const productForm = document.getElementById("productForm");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// Filtro atual
let currentFilter = "todos";

// Carrega os produtos salvos
let products = loadProducts();

// ==========================================
// CARREGAR PRODUTOS
// ==========================================

function loadProducts() {
  try {
    const saved = localStorage.getItem("aj_story_products");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Não foi possível carregar o estoque salvo.", error);
  }

  return defaultProducts;
}

// ==========================================
// SALVAR PRODUTOS
// ==========================================

function saveProducts() {
  try {
    localStorage.setItem(
      "aj_story_products",
      JSON.stringify(products)
    );
  } catch (error) {
    console.warn("Não foi possível salvar os produtos.", error);
  }
}

// ==========================================
// PROTEÇÃO CONTRA HTML INDESEJADO
// ==========================================

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function renderProducts() {
  if (!productsElement) {
    return;
  }

  const visibleProducts = products.filter(function(product) {
    if (currentFilter === "todos") {
      return true;
    }

    return product.status === currentFilter;
  });

  // Caso não exista nenhum produto
  if (visibleProducts.length === 0) {
    productsElement.innerHTML = `
      <div style="
        grid-column: 1/-1;
        padding: 35px;
        text-align: center;
        color: #999;
      ">
        Nenhum celular encontrado nessa categoria.
      </div>
    `;

    return;
  }

  // Cria os cards
  productsElement.innerHTML = visibleProducts.map(function(product) {

    const isAvailable = product.status === "disponivel";

    let imageHTML;

    if (product.image) {
      imageHTML = `
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        >

        <div
          class="placeholder-phone"
          style="display:none"
        ></div>
      `;
    } else {
      imageHTML = `
        <div class="placeholder-phone"></div>
      `;
    }

    return `
      <article class="card">

        <div class="product-img">
          ${imageHTML}
        </div>

        <div class="info">

          <div class="status ${isAvailable ? "available" : "sold"}">
            ${isAvailable ? "● DISPONÍVEL" : "● VENDIDO"}
          </div>

          <h3>
            ${escapeHTML(product.name)}
          </h3>

          <div class="meta">
            ${escapeHTML(product.storage)}
            •
            ${escapeHTML(product.color)}
          </div>

          <div class="price">
            ${escapeHTML(product.price)}
          </div>

          <button
            class="details"
            type="button"
            data-id="${product.id}"
          >
            Ver detalhes
          </button>

        </div>

      </article>
    `;

  }).join("");

  // Ativa os botões "Ver detalhes"
  document.querySelectorAll(".details").forEach(function(button) {

    button.addEventListener("click", function() {

      const product = products.find(function(item) {
        return String(item.id) === String(button.dataset.id);
      });

      if (product) {
        openModal(product);
      }

    });

  });
}

// ==========================================
// ABRIR DETALHES DO PRODUTO
// ==========================================

function openModal(product) {

  if (!modal || !modalContent) {
    return;
  }

  const isAvailable = product.status === "disponivel";

  let imageHTML;

  if (product.image) {

    imageHTML = `
      <div class="product-img">

        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
        >

      </div>
    `;

  } else {

    imageHTML = `
      <div class="product-img">

        <div class="placeholder-phone"></div>

      </div>
    `;

  }

  // Mensagem que será enviada para o WhatsApp
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no ${product.name}, ${product.storage}, cor ${product.color}. Preço: ${product.price}.`
  );

  modalContent.innerHTML = `

    ${imageHTML}

    <div class="status ${isAvailable ? "available" : "sold"}">

      ${isAvailable ? "● DISPONÍVEL" : "● VENDIDO"}

    </div>

    <h2 style="margin:8px 0">

      ${escapeHTML(product.name)}

    </h2>

    <p class="meta">

      ${escapeHTML(product.storage)}
      •
      ${escapeHTML(product.color)}

    </p>

    <div class="price">

      ${escapeHTML(product.price)}

    </div>

    <p style="
      color:#aaa;
      line-height:1.6;
    ">

      ${escapeHTML(
        product.description ||
        "Entre em contato para saber mais detalhes."
      )}

    </p>

    ${
      isAvailable
        ? `
          <a
            class="primary-btn"
            target="_blank"
            rel="noopener"
            href="https://wa.me/${WHATSAPP}?text=${whatsappMessage}"
          >
            Comprar pelo WhatsApp
          </a>
        `
        : `
          <p style="
            color:#ff6464;
            font-weight:800;
          ">
            Este aparelho está vendido.
          </p>
        `
    }

  `;

  modal.classList.remove("hidden");

  document.body.style.overflow = "hidden";
}

// ==========================================
// FECHAR MODAL
// ==========================================

function closeProductModal() {

  if (!modal) {
    return;
  }

  modal.classList.add("hidden");

  document.body.style.overflow = "";
}

// ==========================================
// FILTROS
// ==========================================

filters.forEach(function(filter) {

  filter.addEventListener("click", function() {

    // Remove o "active" de todos
    filters.forEach(function(item) {
      item.classList.remove("active");
    });

    // Ativa o botão clicado
    filter.classList.add("active");

    // Atualiza o filtro
    currentFilter = filter.dataset.filter;

    // Atualiza os produtos
    renderProducts();

  });

});

// ==========================================
// FORMULÁRIO DE NOVO CELULAR
// ==========================================

if (productForm) {

  productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const nameInput = document.getElementById("name");
    const storageInput = document.getElementById("storage");
    const colorInput = document.getElementById("color");
    const priceInput = document.getElementById("price");
    const imageInput = document.getElementById("image");
    const statusInput = document.getElementById("status");
    const descriptionInput = document.getElementById("description");

    const newProduct = {

      id: Date.now(),

      name: nameInput.value.trim(),

      storage: storageInput.value.trim(),

      color: colorInput.value.trim(),

      price: priceInput.value.trim(),

      image: imageInput.value.trim(),

      status: statusInput.value,

      description: descriptionInput.value.trim()

    };

    // Adiciona ao catálogo
    products.push(newProduct);

    // Salva no navegador
    saveProducts();

    // Atualiza a tela
    renderProducts();

    // Limpa o formulário
    productForm.reset();

    alert("Celular adicionado ao catálogo!");

    // Volta para o catálogo
    const catalog = document.getElementById("catalogo");

    if (catalog) {
      catalog.scrollIntoView({
        behavior: "smooth"
      });
    }

  });

}

// ==========================================
// BOTÃO DE FECHAR O MODAL
// ==========================================

if (closeModal) {

  closeModal.addEventListener("click", function() {

    closeProductModal();

  });

}

// ==========================================
// FECHAR CLICANDO FORA DO MODAL
// ==========================================

if (modal) {

  modal.addEventListener("click", function(event) {

    if (event.target === modal) {

      closeProductModal();

    }

  });

}

// ==========================================
// FECHAR COM A TECLA ESC
// ==========================================

document.addEventListener("keydown", function(event) {

  if (
    event.key === "Escape" &&
    modal &&
    !modal.classList.contains("hidden")
  ) {

    closeProductModal();

  }

});

// ==========================================
// INICIAR O CATÁLOGO
// ==========================================

renderProducts();
