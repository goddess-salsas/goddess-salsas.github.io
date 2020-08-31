/*jshint esversion: 6 */

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function getUniqueStyles(loadedProducts) {
  var styleCounts = [];
    loadedProducts.forEach((item) => {
        if (item.style && item.style.length > 0) {
            item.style.forEach((s) => {
                var data = styleCounts.find((e) => e.style === s);
                if (!data) {
                    var emptyStyle = { style: s, count: 1 };
                    styleCounts.push(emptyStyle);
                } else {
                  data.count++;
                }
            });
        }
    });
    return styleCounts;
}
function getUniqueTypes(loadedProducts) {
  var typeCounts = [];
  loadedProducts.forEach((item) => {
      if(item.type && item.type.length >0 ) {
          item.type.forEach((t) => {
              var typeExists = typeCounts.find((e) => e.type === t);
              if(!typeExists) {
                  var emptyType = {type: t, count: 1};
                  typeCounts.push(emptyType);
              } else {
                  typeExists.count++;
              }
          });
      }
  });
  return typeCounts;
}
function setTypesFilter(loadedProducts, page) {
    const $types = document.querySelector(".types");
    var tCounts = getUniqueTypes(loadedProducts);
    $types.innerHTML = tCounts.map((item) => `
            <li>
              <label class="checkbox-inline">
                <input name="input-group-radio" value="${item.type}" type="checkbox" class="checkbox-custom" onclick="${(page==="list")?"handleTypeFiltersChangedList(event)" : "handleTypeFiltersChangedGrid(event)"};" checked><span class="checkbox-custom-dummy"></span>${item.type}
              </label><span class="list-shop-filter-number">(${item.count})</span>
            </li>
    `).join("");
    tCounts.forEach(item => {
        addTypeFilter(item.type, page);
    });
}
function setTypes(loadedProducts) {
    var uniqueTypes = getUniqueTypes(loadedProducts).map((p) => `
        <option value="${p.type}">${p.type}</option>
    `
    ).join("");
    document.getElementById("product_types").innerHTML = uniqueTypes;
    $("#product_types").selectpicker("refresh");
}
function setStyles(loadedProducts) {
  var uniqueStyles = getUniqueStyles(loadedProducts).map((p) => `
      <option value="${p.style}">${p.style}</option>
  `
  ).join("");
  document.getElementById("styles").innerHTML = uniqueStyles;
  $("#styles").selectpicker("refresh");
}
/**
 * renders the filter styles on the product collection pages
 *
 */
function getStyles(type) {
    const $styles = document.querySelector(".styles");
    var styleCounts = [];
    products.forEach((item) => {
        if (item.style.length > 1) {
            item.style.forEach((s) => {

                var data = styleCounts.find((e) => e.style === s);
                if (data) {
                    data.count++;
                } else {
                    var emptyStyle = { style: s, count: 1 };
                    styleCounts.push(emptyStyle);
                }
            });
        } else {
            var data = styleCounts.find((e) => e.style === item.style[0]);
            if (data) {
                data.count++;
            } else {
                var emptyStyle = { style: item.style[0], count: 1 };
                styleCounts.push(emptyStyle);
            }
        }
    });
    styleCounts.forEach(item => {
        addStyleFilter(item.style, type);
    });
    $styles.innerHTML = styleCounts.map((item) => `
          <li>
            <label class="checkbox-inline">
              <input name="input-group-radio" value="${item.style}" type="checkbox" class="checkbox-custom" onclick="${(type==="list")?"handleStyleFiltersChangedList(event)" : "handleStyleFiltersChangedGrid(event)"};" checked><span class="checkbox-custom-dummy"></span>${item.style}
            </label><span class="list-shop-filter-number">(${item.count})</span>
          </li>
          `).join("");
}
function listToString(list) {
    var response ='';
    var listSize = list.length;
    var currentItem = 0;
    list.forEach((li) => {
        currentItem++;
        if(currentItem === 1) {
            response += '' + li;
        } else if (currentItem === listSize) {
            if(listSize === 2) {
                response += ' and ' + li;
            } else {
                response += ', and ' + li;
            }
        } else {
            response += ', ' + li;
        }
    });
    return response;
}
/**
 * renders the Product Grid Page collection
 *
 * @param {*} page
 * @param {*} styleFilters
 */
function renderGridProducts(page, typeFilters, styleFilters) {
    const $products = document.querySelector(".products");

    const filteredProductsByTypee = (typeFilters && typeFilters.size > 0) ? products.filter(p => p.type.some(r => typeFilters.has(r))) : products;
    const filteredProductsByStyle = (styleFilters && styleFilters.size > 0) ? filteredProductsByTypee.filter(p => p.style.some(r => styleFilters.has(r))) : filteredProductsByTypee;

    const pageProducts = filteredProductsByStyle.slice((page * 9) - 9, page * 9);
    var gridItems = '';
    pageProducts.forEach((item) => {
      var s = item.sizes.find(obj => {
        return obj.default === true;
      });
      gridItems += `
          <div class="col-sm-6 col-md-4 col-lg-6 col-xl-4">
            <!-- Product-->
            <article class="product">
              <div class="product-body">
                <div class="product-figure">
                  <a class=\"product-modern-figure\" href=\"single-product.html?id=${item.id}\">
                    <img src="${item.image_small}" alt="">
                  </a>
                </div>
                <h5 class="product-title"><a href="single-product.html?id=${item.id}">${item.name}</a></h5>
                <div class="product-price-wrap">
                  ${(s.onsale == true)? `<div class=\"product-price product-price-old\">$${s.price_previous}</div>` : ""}
                  <div class="product-price">$${s.price_current}</div>
                </div>
              </div>
              
              ${(s.onsale == true) ? `<span class=\"product-badge product-badge-sale\">Sale</span>` : "" }
              <div class="product-button-wrap">
                <div class="product-button"><a class="button button-primary-2 button-zakaria fl-bigmug-line-search74" href="single-product.html?id=${item.id}"></a></div>
                <div class="product-button"><span class="button button-primary-2 button-zakaria fl-bigmug-line-shopping202" onclick="cartLS.add({id: '${s.id}', productId: ${item.id}, name: '${item.name}', price: ${s.price_current}, size: ${s.value}, image: '${item.image_small}'})"></span></div>
              </div>
            </article>
          </div>
      `;
    });
    $products.innerHTML = gridItems;
}
/**
 * renders the Home PAge Product carousel
 *
 * @param {*} page
 */
function renderHomeProducts() {
    const $products = document.querySelector(".home-products");
    // $products.innerHTML = products.map((item) => `
    //         <div class="owl-item cloned ${(item.id < 4) ? "active" : ""}" style="width: 370px; margin-right: 30px;">
    //             <article class="box-info-modern wow slideInUp" data-wow-delay=".1s" style="visibility: hidden; animation-delay: 0.1s; animation-name: none;">
    //                 <a class="box-info-modern-figure" href="single-product.html?id=${item.id}"><img src="${item.image_small}" alt="" width="340" height="243"></a>
    //                 <h4 class="box-info-modern-title"><a href="single-product.html?id=${item.id}">${item.name} <br><i style="font-size: large;"></i></a></h4>
    //                 <div class="box-info-modern-text">${item.desc_short}</div>
    //                 <a class="box-info-modern-link" href="single-product.html?id=${item.id}">Read more</a>
    //             </article>
    //         </div>
    //     `).join("");
    $products.innerHTML = products.map((item) => `
                <article class="box-info-modern wow slideInUp" data-wow-delay=".1s" style="visibility: hidden; animation-delay: 0.1s; animation-name: none;">
                    <a class="box-info-modern-figure" href="single-product.html?id=${item.id}"><img src="${item.image_small}" alt="" width="340" height="243"></a>
                    <h4 class="box-info-modern-title"><a href="single-product.html?id=${item.id}">${item.name} <br><i style="font-size: large;"></i></a></h4>
                    <div class="box-info-modern-text">${item.desc_short}</div>
                    <a class="box-info-modern-link" href="single-product.html?id=${item.id}">Read more</a>
                </article>
        `).join("");
}
function renderProduct(id) {
  var idn = parseInt(id, 10);
  if(idn) {
    const $productTitle = document.querySelector(".single-product-title");
    const $productSubTitle = document.querySelector(".single-product-subtitle");
    const $productBreadcrumbTitle = document.querySelector(".product-active-title");
    const $productName = document.querySelector(".single-product-name");
    const $productPrice = document.querySelector(".single-product-price");
    const $productDesc = document.querySelector(".single-product-desc");
    const $productStyle = document.querySelector(".single-product-styles");
    const $productType = document.querySelector(".single-product-types");
    const $productVolume = document.querySelector(".single-product-volume");
    const $productRating = document.querySelector(".single-product-rating");
    const $productImages = document.querySelector(".single-product-images");
    const $productImages2 = document.querySelector(".single-product-images-2");
    const $productOnSale = document.querySelector(".single-product-onsale");
    const $productOldPrice = document.querySelector(".single-product-oldprice");
    const $productAddToCart = document.querySelector(".single-product-cartadd");
    const $productSize = document.querySelector(".single-product-sizes");
    const $productID = document.querySelector(".single-product-id");

    const pageProduct = products.find(p => p.id === idn);
    if(pageProduct) {
      $productName.innerHTML = pageProduct.name;
      $productTitle.innerHTML = pageProduct.name;
      $productSubTitle.innerHTML = 'A Goddess ' + listToString(pageProduct.type);
      $productBreadcrumbTitle.innerHTML = pageProduct.name;
      $productDesc.innerHTML = pageProduct.desc_long;
      $productStyle.innerHTML = pageProduct.style.join(", ");
      $productType.innerHTML = pageProduct.type.join(", ");
      $productID.innerHTML = pageProduct.id;
      var selectedSize;
      // product size options
      if(pageProduct.sizes && pageProduct.sizes.length > 0) {

        var sizeOptions = '';
        var defaultSize = '8';
        pageProduct.sizes.forEach((size) => {
          if(size.default === true) {
            defaultSize= size.value;
            selectedSize = size;
          }
          sizeOptions += `<option value="${size.value}" ${(size.default === true) ? 'selected':''}>${size.title} - (${size.volume})</option>`;
        });
        $productSize.innerHTML = `
        <div class="control-container">
          <div class="control-group">
            <div class="select">
              <select id="size_sel" onchange="size_changed(this.value)" value="${defaultSize}">
                ${sizeOptions}
              </select>
              <div class="select__arrow"></div>
            </div>
          </div>
        </div>
      `;
      } else {
        // this shouldn't happen once everything is in the new format
        // maybe a default 8oz size
      }

      $productVolume.innerHTML = selectedSize.volume;
      $productPrice.innerHTML = '$' + selectedSize.price_current;
      // on sale?
      if(selectedSize.onsale) {
        $productOnSale.style.visibility = "visible";
        $productOldPrice.innerHTML = '$' + selectedSize.price_previous;
      }
      // ratings
      var rating = '';
      var star_count = 0;
      var whole_stars = Math.floor(pageProduct.rating);
      for (i=1; i <= whole_stars; i++) {
        rating += '<span class="icon mdi mdi-star"></span>';
        star_count ++;
      }
      var fractional_rating = pageProduct.rating % 1;
      if(fractional_rating > 0 && fractional_rating < 0.8) {
        rating += '<span class="icon mdi mdi-star-half"></span>';
        star_count++;
      } else {
        rating += '<span class="icon mdi mdi-star"></span>';
        star_count++;
      }
      if(star_count<5) {
        while(star_count < 5) {
          rating += '<span class="icon mdi mdi-star-outline"></span>';
          star_count++;
        }
      }
      $productRating.innerHTML = rating;

      // add to cart button and link
      // $productAddToCart.innerHTML = `<span class="button button-lg button-secondary button-zakaria add-to-cart" style="color:white" onclick="cartAdd({id: '${selectedSize.id}', productId: ${pageProduct.id}, name: '${pageProduct.name}', price: ${selectedSize.price_current}, size: '${selectedSize.value}', image: '${pageProduct.image_small}'})">Add to cart</span>`;
      $productAddToCart.innerHTML = `<span class="button button-lg button-secondary button-zakaria add-to-cart" style="color:white" onclick="dynamicCartAdd()">Add to cart</span>`;

      // product images
      $productImages.innerHTML = pageProduct.image_details.map((item) => `
        <div class="item">
          <div class="slick-product-figure"><img src="${item}" alt="" width="530" height="480"/></div>
        </div>
      `).join("");
      $productImages2.innerHTML = $productImages.innerHTML;

      //social links
      renderSocialLinks(pageProduct.id);
    }
  }
  
  
}
/**
 * renders the Product List Page products
 *
 * @param {*} page number
 * @param {*} styleFilters selected style filters array
 */
function renderListProducts(page, typeFilters, styleFilters) {
    const $products = document.querySelector(".products");

    const filteredProductsByTypee = (typeFilters && typeFilters.size > 0) ? products.filter(p => p.type.some(r => typeFilters.has(r))) : products;
    const filteredProductsByStyle = (styleFilters && styleFilters.size > 0) ? filteredProductsByTypee.filter(p => p.style.some(r => styleFilters.has(r))) : filteredProductsByTypee;

    const pageProducts = filteredProductsByStyle.slice((page*3)-3,page*3);
    var listedProducts = '';
    pageProducts.forEach((item) => {
      var s = item.sizes.find(obj => {
        return obj.default === true;
      });
      var typeBadges = item.type.map((t) => `
         <span class="product-badge-type">${t.toUpperCase()}</span>
      `).join("");

      listedProducts += `
            <div class=\"col-12\">
                <!-- Product-->
                <article class=\"product-modern text-center text-sm-left\">
                    <div class=\"unit unit-spacing-0 flex-column flex-sm-row\">
                        <div class=\"unit-left\">
                            <a class=\"product-modern-figure\" href=\"single-product.html?id=${item.id}\">
                            <img src="${item.image_large}" alt="" width="328" height="330" style="margin-left: 5px; max-width: 400px;" class="list-img">
                            </a>
                        </div>
                        <div class=\"unit-body\">
                            <div class=\"product-modern-body\">
                                ${typeBadges}
                                <h4 class=\"product-modern-title\"><a href=\"single-product.html?id=${item.id}\">${item.name}</a></h4>
                                <div class=\"product-price-wrap\">
                                    ${(s.onsale == true)? `<div class=\"product-price product-price-old\">$${s.price_previous}</div>` : ""}
                                    <div class=\"product-price\">$${s.price_current}</div>
                                </div>
                                <p class=\"product-modern-text\">${item.desc_short}</p>
                                <span class=\"button button-primary button-zakaria\" onclick=\"cartAdd({id: '${s.id}', productId: ${item.id}, name: '${item.name}', price: ${s.price_current}, size: ${s.value}, image: '${item.image_small}'})\" style=\"color:white;\">Add to cart</span>
                            </div>
                        </div>
                    </div>
                    ${(s.onsale == true)? "<span class=\"product-badge product-badge-sale\">Sale</span>": "" }
                </article>
            </div>
      `;
    });
    $products.innerHTML = listedProducts;
}
/**
 * renders the mini-shopping cart
 *
 * @param {*} items cart item list
 */
function renderMiniCart(items) {
    const $cartItems = document.querySelector(".mini-cart-items");
    const $minitotal = document.querySelector(".mini-total");
    const $count = document.querySelector(".cart-count");
    const $minicount = document.querySelector(".cart-count-2");
    const $minicartcount = document.querySelector(".mini-cart-count");
    var quantity = 0;

    $cartItems.innerHTML = items.map((item) => `
        <div class="cart-inline-item">
          <div class="unit unit-spacing-sm align-items-center">
            <div class="unit-left"><a class="cart-inline-figure" href="single-product.html?id=${item.productId}"><img src="${item.image}" alt="" width="100" height="90" style="width:100px; height:90px;background-color:white"></a></div>
            <div class="unit-body">
              <h6 class="cart-inline-name"><a href="single-product.html?id=${item.productId}">${item.name} - <i style="font-size:smaller;">${item.size} oz</i></a></h6>
              <div>
                <div class="group-xs group-middle">
                  <div class="table-cart-stepper">
                    <div class="stepper "><input class="form-input stepper-input" type="number" data-zeros="true" value="${item.quantity}" min="1" max="1000"><span class="stepper-arrow up" onClick="cartLS.quantity('${item.id}',1)"></span><span class="stepper-arrow down" onClick="cartLS.quantity('${item.id}',-1)"></span></div>
                  </div>
                  <h6 class="cart-inline-title">$${item.price * item.quantity}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>`).join("");
        
    $minitotal.innerHTML = " $" + cartLS.total();
    cartLS.list().forEach(item => {
        quantity += item.quantity;

    });
    $count.innerHTML = " " + quantity;
    $minicount.innerHTML = " " + quantity;
    $minicartcount.innerHTML = " " + quantity;
}    
/**
 * renders the Product Grid Page Paginator
 *
 * @param {*} activePage
 */
function renderGridPaginator(activePage) {
    const $paging = document.querySelector(".pagination");
    const $matchingCount = document.querySelector(".matching-count");
    const $showItems = document.querySelector(".shown-items");

    const filteredProductsByType = (filterTypeSet && filterTypeSet.size > 0) ? products.filter(p => p.type.some(r => filterTypeSet.has(r))) : products;
    const filteredProductsByStyle = (filterStyleSet && filterStyleSet.size > 0) ? filteredProductsByType.filter(p => p.style.some(r => filterStyleSet.has(r))) : filteredProductsByType;
    const pageCount = Math.ceil(filteredProductsByStyle.length / 9);
    var pager = (activePage <= 1) ? `<li class="page-item page-item-control disabled"><a class="page-link" onclick="renderPaginator(${activePage - 1})" aria-label="Previous"><span class="icon" aria-hidden="true"></span></a></li>` : `<li class="page-item page-item-control"><a class="page-link" onclick="renderPaginator(${activePage - 1})" aria-label="Previous"><span class="icon" aria-hidden="true"></span></a></li>`;
    for(var i = 0; i < pageCount; i++) {
        pager += ((activePage == i+1) ? `<li class="page-item active"><span class="page-link">${activePage}</span></li>}` : `<li class="page-item"><span class="page-link" onclick="renderPaginator(${i+1})">${i+1}</span></li>`);
    }
    pager += (activePage < pageCount) ? `<li class="page-item page-item-control"><a class="page-link" onclick="renderPaginator(${activePage + 1});" aria-label="Next"><span class="icon" aria-hidden="true"></span></a></li>` : `<li class="page-item page-item-control disabled"><a class="page-link" onclick="renderPaginator(${activePage + 1})" aria-label="Next"><span class="icon" aria-hidden="true"></span></a></li>`;
    $paging.innerHTML = pager;
    $matchingCount.innerHTML = filteredProductsByStyle.length;
    var startItem = ((activePage*9)-8).toString();
    var endItem = (filteredProductsByStyle.length > (activePage*9)) ? (activePage*9).toString() : filteredProductsByStyle.length.toString();
    $showItems.innerHTML = startItem + "-" + endItem;
    renderGridProducts(activePage, filterTypeSet, filterStyleSet);
}
/**
 * renders pagination for the product-list page
 *
 * @param {*} activePage current active pagination page
 */
function renderListPaginator(activePage) {
    const $paging = document.querySelector(".pagination");
    const $matchingCount = document.querySelector(".matching-count");
    const $showItems = document.querySelector(".shown-items");

    const filteredProductsByType = (filterTypeSet && filterTypeSet.size > 0) ? products.filter(p => p.type.some(r => filterTypeSet.has(r))) : products;
    const filteredProductsByStyle = (filterStyleSet && filterStyleSet.size > 0) ? filteredProductsByType.filter(p => p.style.some(r => filterStyleSet.has(r))) : filteredProductsByType;
    const pageCount = Math.ceil(filteredProductsByStyle.length / 3);
    var pager = (activePage <= 1) ? `<li class="page-item page-item-control disabled"><a class="page-link" onclick="renderListPaginator(${activePage - 1})" aria-label="Previous"><span class="icon" aria-hidden="true"></span></a></li>` : `<li class="page-item page-item-control"><a class="page-link" onclick="renderListPaginator(${activePage - 1})" aria-label="Previous"><span class="icon" aria-hidden="true"></span></a></li>`;
    for(var i = 0; i < pageCount; i++) {
        pager += ((activePage == i+1) ? `<li class="page-item active"><span class="page-link">${activePage}</span></li>}` : `<li class="page-item"><span class="page-link" onclick="renderListPaginator(${i+1})">${i+1}</span></li>`);
    }
    pager += (activePage < pageCount) ? `<li class="page-item page-item-control"><a class="page-link" onclick="renderListPaginator(${activePage + 1})" aria-label="Next"><span class="icon" aria-hidden="true"></span></a></li>` : `<li class="page-item page-item-control disabled"><a class="page-link" onclick="renderListPaginator(${activePage + 1})" aria-label="Next"><span class="icon" aria-hidden="true"></span></a></li>`;
    $paging.innerHTML = pager;
    $matchingCount.innerHTML = filteredProductsByStyle.length;
    var startItem = ((activePage*3)-2).toString();
    var endItem = (filteredProductsByStyle.length > (activePage*3)) ? (activePage*3).toString() : filteredProductsByStyle.length.toString();
    $showItems.innerHTML = startItem + "-" + endItem;
    renderListProducts(activePage, filterTypeSet, filterStyleSet);
}
/**
 * renders popular products on product collection pages
 *
 */
function renderPopularItems() {
    const $popular = document.querySelector(".popular");
    const filteredPopular = products.filter(p => p.popular === true);
    var popularItems = '';
    filteredPopular.forEach((item) => {
      var s = item.sizes.find(obj => {
        return obj.default === true;
      });
      popularItems += `
                <div class="col-4 col-sm-6 col-md-12">
                    <!-- Product Minimal-->
                    <article class="product-minimal">
                    <div class="unit unit-spacing-sm flex-column flex-md-row align-items-center" >
                        <div class="unit-left" style="margin-top: 8px;"><a class="product-minimal-figure" href="single-product.html?id=${item.id}"><img src="${item.image_small}" alt="" width="106" height="104" style="width:106px;height:104px;background-color:white;"></a></div>
                        <div class="unit-body">
                        <p class="product-minimal-title"><a href="single-product.html?id=${item.id}">${item.name}</a></p>
                        <p class="product-minimal-price">$${s.price_current} ${(s.onsale === true) ? '<span class="product-minimal-badge product-minimal-badge-sale" style="margin-left:20px;">Sale</span>':''}</p>
                        </div>
                    </div>
                    </article>
                </div>
      `;
      
    });
    $popular.innerHTML = popularItems;
}
function renderFeaturedItems() {
  const $featured = document.querySelector(".featured");
  const filteredFeatured = products.filter(p => p.featured === true);
  var featuredItems = '';
  filteredFeatured.forEach((item) => {
    var s = item.sizes.find(obj => {
      return obj.default === true;
    });
    featuredItems += `
      <div class="col-sm-6 col-md-5 col-lg-3">
      <!-- Product-->
      <article class="product">
        <div class="product-body">
          <div class="product-figure">
            <a class=\"product-modern-figure\" href=\"single-product.html?id=${item.id}\">
              <img src="${item.image_small}" alt="" width="152" height="160" style="width: 200px;">
            </a>
          </div>
          <h5 class="product-title"><a href="single-product.html?id=${item.id}">${item.name}</a></h5>
          <div class="product-price-wrap">
            <div class="product-price product-price-old">${s.onsale ? '$' + s.price_previous : ''}</div>
            <div class="product-price">$${s.price_current}</div>
          </div>
        </div>
        ${(item.onSale == true)? `<span class="product-badge product-badge-sale">Sale</span>` : ""}
        
        <div class="product-button-wrap">
          <div class="product-button"><a class="button button-primary-2 button-zakaria fl-bigmug-line-search74" href="single-product.html?id=${item.id}"></a></div>
          <div class="product-button"><a class="button button-primary-2 button-zakaria fl-bigmug-line-shopping202" style="color:white;" onclick="cartLS.add({id: '${s.id}', productId: ${item.id}, name: '${item.name}', price: ${s.price_current}, size: '${s.value}', image: '${item.image_small}'})"></a></div>
        </div>
      </article>
    </div>
  `;
  });
  $featured.innerHTML = featuredItems;
}
function renderSocialLinks(id, ) {
  const $socialLinks = document.querySelector(".social-links");
  var links = `
      <li><a class="icon mdi mdi-facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://goddess-salsas.github.io/index.html" target="_blank"></a></li>
      <li><a class="icon mdi mdi-twitter" href="https://twitter.com/home?status=https://goddess-salsas.github.io//index.html"></a></li>
      <li><a class="icon mdi mdi-email" href="mailto:smggraf91@yahoo.com?&subject=&body=https://goddess-salsas.github.io/index.html"></a></li>
      <li><a class="icon mdi mdi-pinterest" href="https://pinterest.com/pin/create/button/?url=https://goddess-salsas.github.io/index.html&media=&description="></a></li>
  `;
  if(id) {
      links = `<li><a class="icon mdi mdi-facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://goddess-salsas.github.io/single-product-${id}.html" target="_blank"></a></li>`;
      links += `<li><a class="icon mdi mdi-twitter" href="https://twitter.com/home?status=https://goddess-salsas.github.io//single-product.html?id=${id}" ></a></li>`;
      links += `<li><a class="icon mdi mdi-email" href="mailto:smggraf91@yahoo.com?&subject=&body=https://goddess-salsas.github.io/single-product.html?id=${id}"></a></li>`;
      links += `<li><a class="icon mdi mdi-pinterest" href="https://pinterest.com/pin/create/button/?url=https://goddess-salsas.github.io/single-product.html?id=${id}&media=&description="></a></li>`;
      $socialLinks.innerHTML = links;
  }
}

// BLOG RENDERING
function splitBlogParagraphs(text) {
  if(text.includes('<p')) { return text; }
  var sentences = text.split(/\r\n|\r|\n/gi);
  var htmlText = sentences.map((s) => `
      <p class="post-modern-text">${s}</p>
  `).join("");
  return htmlText;
}
function getUniqueBlogTypes() {
  var blogTypeCounts = [];
    blogs.forEach((item) => {
        if (item.type && item.type.length > 0) {
            item.type.forEach((t) => {
                var data = blogTypeCounts.find((e) => e.type === t);
                if (!data) {
                    var emptyStyle = { type: t, count: 1 };
                    blogTypeCounts.push(emptyStyle);
                } else {
                  data.count++;
                }
            });
        }
    });
    return blogTypeCounts;
}
function getUniqueBlogTags() {
  var blogTagCounts = [];
    blogs.forEach((item) => {
        if (item.tags && item.tags.length > 0) {
            item.tags.forEach((t) => {
                var data = blogTagCounts.find((e) => e.tag === t);
                if (!data) {
                    var emptyTag = { tag: t, count: 1 };
                    blogTagCounts.push(emptyTag);
                } else {
                  data.count++;
                }
            });
        }
    });
    return blogTagCounts;
}
function renderBlogFilterLinks() {
  var $filterLinks = document.getElementById("blog-filter-links");
  var uniqueBlogTypes = getUniqueBlogTypes();
  var allFilter = `<li><a href="blog-list.html">All</a><span class="list-categories-number">(${blogs.length})</span></li>`;
  var filters = uniqueBlogTypes.map((item) => `
      <li><a href="blog-list.html?f=${item.type}">${item.type}</a><span class="list-categories-number">(${item.count})</span></li>
  `).join("");
  $filterLinks.innerHTML = allFilter + filters;
}
function renderBlogTypeFilters(elem) {
  var filters = '';
  var uniqueBlogTypes = getUniqueBlogTypes();
  uniqueBlogTypes.forEach(item => {
      addBlogFilter(item.type);
  });
  var allFilter = `
        <li>
          <label class="checkbox-inline">
            <span class="checkbox-custom-dummy" style="visibility: hidden;"></span>all
          </label>
          <span class="list-blog-filter-number">(${blogs.length})</span>
        </li>
        `;
  filters = uniqueBlogTypes.map((item) => `
        <li>
          <label class="checkbox-inline">
            <input name="input-group-radio" value="${item.type}" type="checkbox" class="checkbox-custom" onclick="handleBlogFiltersChanged(event)" checked><span class="checkbox-custom-dummy"></span>${item.type}
          </label><span class="list-blog-filter-number">(${item.count})</span>
        </li>
  `).join("");
  elem.innerHTML = allFilter + filters;
}
function loadBlogPost(id) {
  var post = blogs.find((p) => p.id.toString()===id);
  var $content = document.getElementById("content");
  $content.innerHTML = renderBlogPost(post);
  renderLatestBlogPosts();
  renderBlogUniqueMonths('m');
}
function renderBlogPost(post) {
  var types = "";
  post.type.forEach((t) => {
    types += `<span class="post-modern-tag" style="margin-right: 4px;">${t.toUpperCase()}</span>`;
  });
  var $content = document.getElementById("content");
  var item = `
  <article class="post post-modern box-xxl">
    <div class="post-modern-panel">
      <div>${types}</div>
      <div>
        <time class="post-modern-time" datetime="${post.timestamp}">${new Date(post.timestamp).toDateString()}</time>
      </div>
    </div>
    <h3 class="post-modern-title">${post.title}</h3>
    <div class="post-modern-figure"><img src="${post.image_main}" alt="" width="800" height="394"/>
    </div>
    ${splitBlogParagraphs(post.content)}
  <div class="single-post-bottom-panel">
    <div class="group-sm group-justify">
      <div>
        <div class="group-sm group-tags"><a class="link-tag" href="#">News</a><a class="link-tag" href="#">Tips</a><a class="link-tag" href="#">Blog</a></div>
      </div>
      <div>
        <div class="group-xs group-middle"><span class="list-social-title">Share</span>
          <div>
            <ul class="list-inline list-social list-inline-sm">
            <li><a class="icon mdi mdi-facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://goddess-salsas.github.io/blog-post-${post.id}.html" target="_blank"></a></li>
            <li><a class="icon mdi mdi-twitter" href="https://twitter.com/home?status=https://goddess-salsas.github.io//blog-post.html?id=${post.id}" ></a></li>
            <li><a class="icon mdi mdi-email" href="mailto:smggraf91@yahoo.com?&subject=&body=https://goddess-salsas.github.io/blog-post.html?id=${post.id}"></a></li>
            <li><a class="icon mdi mdi-pinterest" href="https://pinterest.com/pin/create/button/?url=https://goddess-salsas.github.io/blog-post.html?id=${post.id}&media=&description="></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
return item;
}
function loadBlogList(page) {
  var $blogList = document.getElementById("blog-list");
  var $blogFilters = document.getElementById("blog-filters");
  const $paging = document.querySelector(".pagination");
  renderBlogList(page);
  renderBlogTypeFilters($blogFilters);
  renderBlogListPaginator(page, $paging);
  renderLatestBlogPosts();
  renderBlogPopularTags();
  renderBlogUniqueMonths();
}
function renderBlogListPaginator(activePage, elem) {
  var orderedPosts = blogs.sort(function(a,b){
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  const filteredBlogsByType = (filterBlogSet && filterBlogSet.size > 0) ? orderedPosts.filter(p => p.type.some(r => filterBlogSet.has(r))) : orderedPosts;
  const pageCount = Math.ceil(filteredBlogsByType.length / 3);
    var pager = (activePage <= 1) ? `<li class="page-item page-item-control disabled"><span class="icon page-link" aria-hidden="true" onclick="renderBlogList(${activePage - 1})"></span></li>` : `<li class="page-item page-item-control"><span class="icon page-link" aria-hidden="true" onclick="renderBlogList(${activePage - 1})"></span></li>`;
    for(var i = 0; i < pageCount; i++) {
        pager += ((activePage == i+1) ? `<li class="page-item active"><span class="page-link">${activePage}</span></li>}` : `<li class="page-item"><span class="page-link" onclick="renderBlogList(${i+1})">${i+1}</span></li>`);
    }
    pager += (activePage < pageCount) ? `<li class="page-item page-item-control"><span class="icon page-link" aria-hidden="true" onclick="renderBlogList(${activePage + 1})"></span></li>` : `<li class="page-item page-item-control disabled"><span class="icon page-link" aria-hidden="true" onclick="renderBlogList(${activePage + 1})"></span></li>`;
    elem.innerHTML = pager;
}
function renderBlogListItem(post) {
  var types = "";
  post.type.forEach((t) => {
    types += `<span class="post-modern-tag" style="margin-right: 4px;">${t.toUpperCase()}</span>`;
  });
  var item = `
    <div class="col-12">
        <!-- Post Modern-->
        <article class="post post-modern box-xxl">
            <div class="post-modern-panel">
                <div>${types}</div>
                <div>
                    <time class="post-modern-time" datetime="${post.timestamp}">${new Date(post.timestamp).toDateString()}</time>
                </div>
            </div>
            <h3 class="post-modern-title"><a href="blog-post.html?id=${post.id}">${post.title}</a></h3>
            <a class="post-modern-figure" href="blog-post.html?id=${post.id}"><img src="${post.image_main}" alt="" width="800" height="394"></a>
            <p class="post-modern-text">${post.description}</p>
            <a class="post-modern-link" href="blog-post.html?id=${post.id}">Read more</a>
        </article>
    </div>
  `;
  return item;
}
function renderLatestBlogPosts() {
  var $latestPosts = document.getElementById("latest-posts");
  var orderedPosts = blogs.sort(function(a,b){
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  var lastTwoPosts = orderedPosts.slice(0, 2);
  $latestPosts.innerHTML = lastTwoPosts.map((item) => `
      <div class="col-6 col-lg-12">
          <!-- Post Minimal-->
          <article class="post post-minimal">
              <div class="unit unit-spacing-sm flex-column flex-lg-row align-items-lg-center">
                  <div class="unit-left">
                      <a class="post-minimal-figure" href="blog-post.html?id=${item.id}"><img src="${item.image_main}" alt="" width="106" height="104" /></a>
                  </div>
                  <div class="unit-body">
                      <p class="post-minimal-title"><a href="blog-post.html?id=${item.id}">${item.title}</a></p>
                      <div class="post-minimal-time">
                          <time datetime="${item.timestamp}">${new Date(item.timestamp).toDateString()}</time>
                      </div>
                  </div>
              </div>
          </article>
      </div>
  `).join("");
}
function renderBlogList(page) {
  var $blogList = document.getElementById("blog-list");
  const $paging = document.querySelector(".pagination");
  var orderedPosts = blogs.sort(function(a,b){
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  const filteredBlogsByType = (filterBlogSet && filterBlogSet.size > 0) ? orderedPosts.filter(p => p.type.some(r => filterBlogSet.has(r))) : orderedPosts;
  const pageBlogs = filteredBlogsByType.slice((page*3)-3, page*3);
  var listedBlogs = '';
  pageBlogs.forEach((item) => {
    listedBlogs +=renderBlogListItem(item);
  });
  $blogList.innerHTML = listedBlogs;
  renderBlogListPaginator(page, $paging);
}
function renderBlogUniqueMonths(m) {
  var $archives = document.querySelector(".list-archives");
  // get unique month-year
  var uniqueMonthYear = new Set();
  var orderedPosts = blogs.sort(function(a,b){
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  orderedPosts.forEach((p) => {
    var targetDate = new Date(p.timestamp);
    var y = targetDate.getFullYear(), m = targetDate.getMonth();
    var firstDayOfMonth = new Date(y, m, 1);
    uniqueMonthYear.add(firstDayOfMonth.toLocaleDateString('en-US'));
  });
  var months = '';
  uniqueMonthYear.forEach((s) => {
    var d = new Date(s);
    if(m && m === 'm') {
      months += `<li><a date="${s}" class="month-link" href="blog-list.html?m='${d.toLocaleDateString()}'">${d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear()}</a></li>`;
    } else {
      months += `<li><span date="${s}" class="month-link" onclick="renderBlogListByMonth('${s}')">${d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear()}</span></li>`;
    }
  });
  if(!m) {
    months = `<li><a class="month-link" href="blog-list.html">All</a></li>` + months;
  }
  $archives.innerHTML = months;
}
function renderBlogListByMonth(targetDate) {
  var $blogList = document.getElementById("blog-list");
  const $paging = document.querySelector(".pagination");
  var orderedPosts = blogs.sort(function(a,b){
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  var tDate = new Date(targetDate);
  var y = tDate.getFullYear(), m = tDate.getMonth();
  var firstDay = new Date(y, m, 1);
  var lastDay = new Date(y, m + 1, 0);

  var resultBlogData = orderedPosts.filter(function (a) {
      var ts = new Date(a.timestamp);
      return ts >= firstDay && ts <= lastDay;
  });

  var listedBlogs = '';
  resultBlogData.forEach((item) => {
    listedBlogs +=renderBlogListItem(item);
  });
  $blogList.innerHTML = listedBlogs;
  $paging.innerHTML = '';
}
function renderBlogPopularTags() {
  var uniqueTags = getUniqueBlogTags();
  var $groupTags = document.querySelector(".group-tags");
  var taglist = uniqueTags.map((t) => `
      <span class="link-tag"">${t.tag}</span>
  `).join(""); 
  $groupTags.innerHTML = taglist;

}
// STYLE FILTERS
/**
 * adds a style filter to the product collection page
 *
 * @param {*} f - style
 */
function addStyleFilter(f,type) {
    filterStyleSet.add(f);
    (type === "list") ? renderListPaginator(1) : renderGridPaginator(1);
}
/**
 * removes all style filters on product collection pages
 *
 */
function clearStyleFilter(type) {
    filterStyleSet.clear();
    (type === "list") ? renderListPaginator(1) : renderGridPaginator(1);
}
/**
 * removes a single style filter on a product collection page
 *
 * @param {*} f - filter style to remove
 */
function removeStyleFilter(f, type) {
    filterStyleSet.delete(f);
    (type === "list") ? renderListPaginator(1) : renderGridPaginator(1);
}
/**
 * handles filter changing events from the list product html
 *
 * @param {*} e
 */
function handleStyleFiltersChangedList(e) {
    if(e.target.checked) {
        addStyleFilter(e.target.value, "list");
    } else {
        removeStyleFilter(e.target.value, "list");
    }
}
/**
 * handles filter changing events from the grid product html
 *
 * @param {*} e
 */
function handleStyleFiltersChangedGrid(e) {
    if(e.target.checked) {
        addStyleFilter(e.target.value, "grid");
    } else {
        removeStyleFilter(e.target.value, "grid");
    }
}

// PRODUCT TYPE FILTERS
/**
 * adds a type filter to the product collection page
 *
 * @param {*} f - Type
 */
function addTypeFilter(f,type) {
  filterTypeSet.add(f);
  (type === "list") ? renderListPaginator(1) : renderGridPaginator(1);
}
/**
* removes all Type filters on product collection pages
*
*/
function clearTypeFilter(type) {
  filterTypeSet.clear();
  (type === "list") ? renderListPaginator(1) : renderGridPaginator(1);
}
/**
* removes a single Type filter on a product collection page
*
* @param {*} f - filter Type to remove
*/
function removeTypeFilter(f, type) {
  filterTypeSet.delete(f);
  (type === "list") ? renderListPaginator(1) : renderGridPaginator(1);
}
/**
* handles product type filter changing events from the list product html
*
* @param {*} e
*/
function handleTypeFiltersChangedList(e) {
  if(e.target.checked) {
      addTypeFilter(e.target.value, "list");
  } else {
      removeTypeFilter(e.target.value, "list");
  }
}
/**
* handles product type filter changing events from the grid product html
*
* @param {*} e
*/
function handleTypeFiltersChangedGrid(e) {
  if(e.target.checked) {
      addTypeFilter(e.target.value, "grid");
  } else {
      removeTypeFilter(e.target.value, "grid");
  }
}
// BLOG FILTERS
/**
 * adds a blog filter to the blog collection page
 *
 * @param {*} f - style
 */
function addBlogFilter(f) {
  filterBlogSet.add(f);
  renderBlogList(1);
}
/**
* removes all blog filters on blog collection pages
*
*/
function clearBlogFilter() {
  filterBlogSet.clear();
  renderBlogList(1);
}
/**
* removes a single blog filter on a blog collection page
*
* @param {*} f - filter style to remove
*/
function removeBlogFilter(f) {
  filterBlogSet.delete(f);
  renderBlogList(1);
}
/**
* handles filter changing events from the list product html
*
* @param {*} e
*/
function handleBlogFiltersChanged(e) {
  if(e.target.checked) {
      addBlogFilter(e.target.value);
  } else {
      removeBlogFilter(e.target.value);
  }
}

var filterStyleSet = new Set();
var filterTypeSet = new Set();
var filterBlogSet = new Set();