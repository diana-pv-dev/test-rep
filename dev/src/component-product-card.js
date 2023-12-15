if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        }

      connectedCallback() {
        this.form = this.querySelector('.js-product__form');
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.submitButton = this.querySelector('.js-product__form-button');
        this.cartCount = document.querySelectorAll('.js-icon-cart__count')
      }
      
      disconnectedCallback() {
        this.form.removeEventListener('submit', this.onSubmitHandler)
      }

      onSubmitHandler(event) {
        event.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.submitButton.setAttribute('aria-disabled', true);

        const config = this.fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              console.log(response)
              return; 
            } 
            this.error = false;         
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');

          this.updateCartCount()
          });
      }

      updateCartCount = () => {

        const config = this.fetchConfig('json', 'GET')
  
        fetch(`${routes.cart_url}`, config)
          .then(response => response.json())
          .then(response => {
  
            if (response.item_count >= 0 && this.cartCount) {
              this.cartCount.forEach(item => {
                item.innerHTML = response.item_count
              })
            }
          })
      }
  
      fetchConfig(type = 'json', method = 'POST') {
        return {
          method: `${method}`,
          headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
        };
      }
    });
  }
