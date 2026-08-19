document.addEventListener('DOMContentLoaded', () => {
  const defaultProducts = window.UPPIN_PRODUCTS || [];
  const categoryDetails = {
    'Fresh Pulp': 'Naturally processed fruit pulps with authentic taste and dependable bulk packing options.',
    'Spices': 'Aromatic Indian spices sourced for quality, flavour and export-grade consistency.',
    'Agro Commodities': 'Reliable agricultural commodities for domestic and international bulk supply.',
    'Processed Food Products': 'Convenient frozen food products processed to retain taste, texture and freshness.',
    'Indian Coffee': 'Quality Indian coffee for buyers seeking distinctive origin and flavour.',
    'Coconut & Allied Products': 'Coconut-based products for food, retail and bulk requirements.'
  };
  const categoryOrder = Object.keys(categoryDetails);
  const freshPulpOrder = ['mango-pulp', 'guava-pulp', 'tropical-fruit-pulp'];
  const storageKey = 'uppin-products-v2';
  const savedProducts = JSON.parse(localStorage.getItem(storageKey) || 'null');
  const mangoPulp = defaultProducts.find((product) => product.id === 'mango-pulp');
  const guavaPulp = defaultProducts.find((product) => product.id === 'guava-pulp');
  const tropicalFruitPulp = defaultProducts.find((product) => product.id === 'tropical-fruit-pulp');
  const turmeric = defaultProducts.find((product) => product.id === 'turmeric');
  let products = savedProducts || defaultProducts;
  let selectedMedia = [];

  const isVideo = (source) => /^data:video\//.test(source) || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(source);
  const getProductMedia = (product) => {
    const media = Array.isArray(product.media) ? product.media : [];
    const normalised = media.map((item) => typeof item === 'string'
      ? { src: item, type: isVideo(item) ? 'video' : 'image' }
      : { src: item.src, type: item.type || (isVideo(item.src) ? 'video' : 'image') })
      .filter((item) => item.src);
    return normalised.length ? normalised : (product.image ? [{ src: product.image, type: 'image' }] : []);
  };

  // Apply current product images to catalogues saved in the browser.
  const currentImageById = new Map(defaultProducts.filter((product) => product.image).map((product) => [product.id, product.image]));
  if (products.some((product) => currentImageById.has(product.id) && product.image !== currentImageById.get(product.id))) {
    products = products.map((product) => currentImageById.has(product.id)
      ? { ...product, image: currentImageById.get(product.id) }
      : product);
    localStorage.setItem(storageKey, JSON.stringify(products));
  }

  // Remove products that are no longer part of the catalogue.
  if (products.some((product) => product.id === 'pineapple-pulp')) {
    products = products.filter((product) => product.id !== 'pineapple-pulp');
    localStorage.setItem(storageKey, JSON.stringify(products));
  }

  // Add Mango Pulp to catalogues saved before it was introduced.
  if (mangoPulp && !products.some((product) => product.id === mangoPulp.id)) {
    products = [...products, mangoPulp];
    localStorage.setItem(storageKey, JSON.stringify(products));
  }

  // Add Guava Pulp to catalogues saved before it was introduced.
  if (guavaPulp && !products.some((product) => product.id === guavaPulp.id)) {
    products = [...products, guavaPulp];
    localStorage.setItem(storageKey, JSON.stringify(products));
  }

  // Keep the Mango Pulp product image current in previously saved catalogues.
  if (mangoPulp && mangoPulp.image) {
    const currentMangoPulp = products.find((product) => product.id === mangoPulp.id);
    if (currentMangoPulp && currentMangoPulp.image !== mangoPulp.image) {
      products = products.map((product) => product.id === mangoPulp.id
        ? { ...product, image: mangoPulp.image }
        : product);
      localStorage.setItem(storageKey, JSON.stringify(products));
    }
  }

  // Keep the Guava Pulp product image current in previously saved catalogues.
  if (guavaPulp && guavaPulp.image) {
    const currentGuavaPulp = products.find((product) => product.id === guavaPulp.id);
    if (currentGuavaPulp && currentGuavaPulp.image !== guavaPulp.image) {
      products = products.map((product) => product.id === guavaPulp.id
        ? { ...product, image: guavaPulp.image }
        : product);
      localStorage.setItem(storageKey, JSON.stringify(products));
    }
  }

  // Keep the Tropical Fruit Pulp product image current in previously saved catalogues.
  if (tropicalFruitPulp && tropicalFruitPulp.image) {
    const currentTropicalFruitPulp = products.find((product) => product.id === tropicalFruitPulp.id);
    if (currentTropicalFruitPulp && currentTropicalFruitPulp.image !== tropicalFruitPulp.image) {
      products = products.map((product) => product.id === tropicalFruitPulp.id
        ? { ...product, image: tropicalFruitPulp.image }
        : product);
      localStorage.setItem(storageKey, JSON.stringify(products));
    }
  }

  // Keep the Turmeric product image current in previously saved catalogues.
  if (turmeric && turmeric.image) {
    const currentTurmeric = products.find((product) => product.id === turmeric.id);
    if (currentTurmeric && currentTurmeric.image !== turmeric.image) {
      products = products.map((product) => product.id === turmeric.id
        ? { ...product, image: turmeric.image }
        : product);
      localStorage.setItem(storageKey, JSON.stringify(products));
    }
  }
  let currentSeason = 'All';
  const productGrid = document.getElementById('productGrid');
  const productList = document.getElementById('productList');
  const productForm = document.getElementById('productForm');
  const noProducts = document.getElementById('noProducts');
  const managerPanel = document.getElementById('managerPanel');
  const managerToggle = document.getElementById('managerToggle');
  const catalogManager = document.getElementById('catalogManager');
  const adminAccess = document.getElementById('adminAccess');
  const adminAccessButton = document.getElementById('adminAccessButton');
  const adminAccessStatus = document.getElementById('adminAccessStatus');
  const changeAdminPassword = document.getElementById('changeAdminPassword');
  const lockAdmin = document.getElementById('lockAdmin');
  const adminPasswordKey = 'uppin-admin-password-v1';
  const adminSessionKey = 'uppin-admin-unlocked-v1';
  const productImage = document.getElementById('productImage');
  const productImageUrl = document.getElementById('productImageUrl');
  const productImageUpload = document.getElementById('productImageUpload');
  const imageUploadStatus = document.getElementById('imageUploadStatus');
  const productMediaUpload = document.getElementById('productMediaUpload');
  const mediaUploadStatus = document.getElementById('mediaUploadStatus');
  const productMediaModal = document.getElementById('productMediaModal');
  const mediaViewerContent = document.getElementById('mediaViewerContent');
  const mediaThumbnails = document.getElementById('mediaThumbnails');
  const mediaDialogTitle = document.getElementById('mediaDialogTitle');
  const previousMediaButton = document.querySelector('.media-viewer-prev');
  const nextMediaButton = document.querySelector('.media-viewer-next');
  let activeMedia = [];
  let activeMediaIndex = 0;

  const saveProducts = () => localStorage.setItem(storageKey, JSON.stringify(products));
  const renderProducts = () => {
    const visibleProducts = currentSeason === 'All' ? products : products.filter((product) => product.season === currentSeason || product.season === 'All Year');
    const visibleCategories = [...new Set([...categoryOrder, ...visibleProducts.map((product) => product.category)])];
    productGrid.innerHTML = visibleCategories.map((category) => {
      const categoryProducts = visibleProducts
        .filter((product) => product.category === category)
        .sort((first, second) => {
          if (category !== 'Fresh Pulp') return 0;
          const firstPosition = freshPulpOrder.indexOf(first.id);
          const secondPosition = freshPulpOrder.indexOf(second.id);
          return (firstPosition === -1 ? Infinity : firstPosition) - (secondPosition === -1 ? Infinity : secondPosition);
        });
      if (!categoryProducts.length) return '';
      return `
        <section class="product-category">
          <div class="category-heading">
            <h3>${category}</h3>
            <p>${categoryDetails[category] || 'Quality products available for bulk orders.'}</p>
          </div>
          <div class="category-product-grid">
            ${categoryProducts.map((product) => {
              const media = getProductMedia(product);
              const preview = media.find((item) => item.type === 'image') || media[0];
              return `
              <article class="product-card">
                ${preview ? `<button class="product-media-trigger" type="button" data-product-id="${product.id}" aria-label="View ${product.name} media">${preview.type === 'video' ? `<video class="product-image" src="${preview.src}" muted preload="metadata"></video>` : `<img class="product-image" src="${preview.src}" alt="${product.name}">`}${media.length > 1 ? `<span class="media-count">${media.length} media</span>` : ''}</button>` : '<div class="product-image-placeholder">Product image available on request</div>'}
                <span class="season-label">${product.season}</span>
                <h4>${product.name}</h4>
                <p>${product.description}</p>
              </article>`;
            }).join('')}
          </div>
        </section>`;
    }).join('');
    noProducts.hidden = visibleProducts.length !== 0;
    productList.innerHTML = products.map((product) => `
      <div class="product-list-item">
        <div><strong>${product.name}</strong><span>${product.category} · ${product.season}</span></div>
        <div><button type="button" class="edit-product" data-id="${product.id}">Edit</button><button type="button" class="delete-product" data-id="${product.id}">Delete</button></div>
      </div>`).join('');
  };
  const resetForm = () => {
    productForm.reset();
    document.getElementById('productId').value = '';
    productImage.value = '';
    selectedMedia = [];
    imageUploadStatus.textContent = 'No file selected';
    mediaUploadStatus.textContent = 'No additional media selected';
    document.getElementById('saveProduct').textContent = 'Add Product';
    document.getElementById('cancelEdit').hidden = true;
  };

  const renderActiveMedia = () => {
    const item = activeMedia[activeMediaIndex];
    if (!item) return;
    mediaViewerContent.innerHTML = item.type === 'video'
      ? `<video src="${item.src}" controls playsinline></video>`
      : `<img src="${item.src}" alt="${mediaDialogTitle.textContent}">`;
    mediaThumbnails.innerHTML = activeMedia.map((media, index) => `
      <button class="media-thumbnail ${index === activeMediaIndex ? 'active' : ''}" type="button" data-media-index="${index}" aria-label="View media ${index + 1}">
        ${media.type === 'video' ? `<video src="${media.src}" muted preload="metadata"></video>` : `<img src="${media.src}" alt="">`}
      </button>`).join('');
    previousMediaButton.disabled = activeMediaIndex === 0;
    nextMediaButton.disabled = activeMediaIndex === activeMedia.length - 1;
  };
  const openMediaViewer = (product) => {
    activeMedia = getProductMedia(product);
    activeMediaIndex = 0;
    mediaDialogTitle.textContent = product.name;
    productMediaModal.hidden = false;
    productMediaModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderActiveMedia();
  };
  const closeMediaViewer = () => {
    productMediaModal.hidden = true;
    productMediaModal.setAttribute('aria-hidden', 'true');
    mediaViewerContent.innerHTML = '';
    document.body.style.overflow = '';
  };

  productGrid.addEventListener('click', (event) => {
    const trigger = event.target.closest('.product-media-trigger');
    if (!trigger) return;
    const product = products.find((item) => item.id === trigger.dataset.productId);
    if (product) openMediaViewer(product);
  });
  productMediaModal.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-media-modal]')) closeMediaViewer();
    const thumbnail = event.target.closest('.media-thumbnail');
    if (thumbnail) {
      activeMediaIndex = Number(thumbnail.dataset.mediaIndex);
      renderActiveMedia();
    }
  });
  document.querySelectorAll('[data-close-media-modal]').forEach((button) => button.addEventListener('click', closeMediaViewer));
  previousMediaButton.addEventListener('click', () => {
    if (activeMediaIndex > 0) {
      activeMediaIndex -= 1;
      renderActiveMedia();
    }
  });
  nextMediaButton.addEventListener('click', () => {
    if (activeMediaIndex < activeMedia.length - 1) {
      activeMediaIndex += 1;
      renderActiveMedia();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (productMediaModal.hidden) return;
    if (event.key === 'Escape') closeMediaViewer();
    if (event.key === 'ArrowLeft') previousMediaButton.click();
    if (event.key === 'ArrowRight') nextMediaButton.click();
  });

  // This is a browser-level access gate for the static website. A hosted site
  // should use server-side authentication for real administrator security.
  const encodeAdminPassword = (password) => window.btoa(unescape(encodeURIComponent(password)));
  const isAdminUnlocked = () => sessionStorage.getItem(adminSessionKey) === 'true';
  const updateAdminArea = () => {
    const hasPassword = Boolean(localStorage.getItem(adminPasswordKey));
    const unlocked = isAdminUnlocked();
    catalogManager.hidden = !unlocked;
    adminAccess.hidden = unlocked;
    if (unlocked) return;
    adminAccessButton.textContent = hasPassword ? 'Unlock admin area' : 'Set up admin access';
    adminAccessStatus.textContent = hasPassword
      ? 'Enter the administrator password to add, edit or delete products.'
      : 'Create an administrator password to manage the catalogue on this browser.';
  };
  const setAdminPassword = () => {
    const password = window.prompt('Create an admin password (at least 6 characters):');
    if (password === null) return;
    if (password.length < 6) {
      window.alert('Please choose a password with at least 6 characters.');
      return;
    }
    const confirmation = window.prompt('Confirm the new admin password:');
    if (password !== confirmation) {
      window.alert('The passwords do not match.');
      return;
    }
    localStorage.setItem(adminPasswordKey, encodeAdminPassword(password));
    sessionStorage.setItem(adminSessionKey, 'true');
    updateAdminArea();
  };
  adminAccessButton.addEventListener('click', () => {
    const savedPassword = localStorage.getItem(adminPasswordKey);
    if (!savedPassword) {
      setAdminPassword();
      return;
    }
    const password = window.prompt('Enter the admin password:');
    if (password !== null && encodeAdminPassword(password) === savedPassword) {
      sessionStorage.setItem(adminSessionKey, 'true');
      updateAdminArea();
      return;
    }
    if (password !== null) window.alert('Incorrect password.');
  });
  changeAdminPassword.addEventListener('click', () => {
    const currentPassword = window.prompt('Enter the current admin password:');
    if (currentPassword === null) return;
    if (encodeAdminPassword(currentPassword) !== localStorage.getItem(adminPasswordKey)) {
      window.alert('Incorrect password.');
      return;
    }
    setAdminPassword();
  });
  lockAdmin.addEventListener('click', () => {
    sessionStorage.removeItem(adminSessionKey);
    managerPanel.hidden = true;
    managerToggle.setAttribute('aria-expanded', 'false');
    managerToggle.textContent = 'Manage Products';
    updateAdminArea();
  });
  updateAdminArea();

  document.querySelectorAll('.season-filter-btn').forEach((button) => button.addEventListener('click', () => {
    currentSeason = button.dataset.season;
    document.querySelectorAll('.season-filter-btn').forEach((item) => item.classList.toggle('active', item === button));
    renderProducts();
  }));
  managerToggle.addEventListener('click', () => {
    const isOpen = managerPanel.hidden;
    managerPanel.hidden = !isOpen;
    managerToggle.setAttribute('aria-expanded', String(isOpen));
    managerToggle.textContent = isOpen ? 'Close Product Manager' : 'Manage Products';
  });
  productImageUrl.addEventListener('change', () => {
    productImage.value = productImageUrl.value.trim();
    if (productImage.value) {
      selectedMedia = [{ src: productImage.value, type: 'image' }, ...selectedMedia.filter((item) => item.src !== productImage.value)];
      imageUploadStatus.textContent = 'Using image link';
    }
  });
  productImageUpload.addEventListener('change', () => {
    const [imageFile] = productImageUpload.files;
    if (!imageFile) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      productImage.value = reader.result;
      productImageUrl.value = '';
      selectedMedia = [{ src: reader.result, type: 'image' }, ...selectedMedia.filter((item) => item.src !== reader.result)];
      imageUploadStatus.textContent = `${imageFile.name} selected`;
    });
    reader.readAsDataURL(imageFile);
  });
  productMediaUpload.addEventListener('change', async () => {
    const files = [...productMediaUpload.files];
    if (!files.length) return;
    const newMedia = await Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve({ src: reader.result, type: file.type.startsWith('video/') ? 'video' : 'image' }));
      reader.readAsDataURL(file);
    })));
    selectedMedia = [...newMedia, ...selectedMedia];
    productImage.value = newMedia.find((item) => item.type === 'image')?.src || newMedia[0].src;
    mediaUploadStatus.textContent = `${newMedia.length} media file${newMedia.length === 1 ? '' : 's'} added (${selectedMedia.length} total)`;
  });
  productForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('productId').value;
    const product = {
      id: id || `product-${Date.now()}`,
      name: document.getElementById('productName').value.trim(),
      category: document.getElementById('productCategory').value,
      season: document.getElementById('productSeason').value,
      image: productImage.value,
      media: selectedMedia,
      description: document.getElementById('productDescription').value.trim()
    };
    products = id ? products.map((item) => item.id === id ? product : item) : [...products, product];
    saveProducts(); resetForm(); renderProducts();
  });
  productList.addEventListener('click', (event) => {
    const id = event.target.dataset.id;
    if (!id) return;
    if (event.target.classList.contains('delete-product')) {
      products = products.filter((product) => product.id !== id);
      saveProducts(); renderProducts();
    }
    if (event.target.classList.contains('edit-product')) {
      const product = products.find((item) => item.id === id);
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productSeason').value = product.season;
      productImage.value = product.image || '';
      productImageUrl.value = product.image && !product.image.startsWith('data:') ? product.image : '';
      selectedMedia = getProductMedia(product);
      imageUploadStatus.textContent = product.image ? 'Product photo selected' : 'No file selected';
      mediaUploadStatus.textContent = selectedMedia.length ? `${selectedMedia.length} media file${selectedMedia.length === 1 ? '' : 's'} available` : 'No additional media selected';
      document.getElementById('productDescription').value = product.description;
      document.getElementById('saveProduct').textContent = 'Update Product';
      document.getElementById('cancelEdit').hidden = false;
      productForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  document.getElementById('cancelEdit').addEventListener('click', resetForm);
  document.getElementById('resetProducts').addEventListener('click', () => {
    if (window.confirm('Restore the original catalogue? Your saved changes will be removed.')) {
      products = defaultProducts; saveProducts(); resetForm(); renderProducts();
    }
  });
  document.getElementById('exportProducts').addEventListener('click', () => {
    const fileContent = `// Update this file to permanently change the website catalogue.\nwindow.UPPIN_PRODUCTS = ${JSON.stringify(products, null, 2)};\n`;
    const downloadFile = () => {
      const fileUrl = URL.createObjectURL(new Blob([fileContent], { type: 'text/javascript' }));
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.download = 'products.js';
      downloadLink.click();
      URL.revokeObjectURL(fileUrl);
    };
    if (!window.showOpenFilePicker) {
      downloadFile();
      return;
    }
    window.showOpenFilePicker({
      multiple: false,
      types: [{ description: 'JavaScript file', accept: { 'text/javascript': ['.js'] } }]
    }).then(async ([fileHandle]) => {
      if (fileHandle.name !== 'products.js') {
        window.alert('Please select the products.js file from your project folder.');
        return;
      }
      const writable = await fileHandle.createWritable();
      await writable.write(fileContent);
      await writable.close();
      window.alert('products.js has been updated. Refresh the page to load the saved code.');
    }).catch((error) => {
      if (error.name !== 'AbortError') downloadFile();
    });
  });
  renderProducts();

  const inquiryForm = document.getElementById('inquiryForm');

  if (!inquiryForm) return;

  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!inquiryForm.checkValidity()) {
      inquiryForm.reportValidity();
      return;
    }

    const [name, email, product, message] = inquiryForm.elements;
    const subject = encodeURIComponent(`Product inquiry from ${name.value.trim()}`);
    const body = encodeURIComponent(
      `Name / Company: ${name.value.trim()}\n` +
      `Email: ${email.value.trim()}\n` +
      `Product requirements: ${product.value.trim()}\n\n` +
      `Message:\n${message.value.trim()}`
    );

    window.location.href = `mailto:uppinfoods@gmail.com?subject=${subject}&body=${body}`;
  });
});
