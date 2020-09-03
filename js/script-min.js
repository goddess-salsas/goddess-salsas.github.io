"use strict";!function(){var t=navigator.userAgent.toLowerCase(),a=new Date,e=$(document),r=$(window),i=$("html"),o=$("body"),n=i.hasClass("desktop"),l=-1!==t.indexOf("msie")?parseInt(t.split("msie")[1],10):-1!==t.indexOf("trident")?11:-1!==t.indexOf("edge")&&12,s=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),d=!1,c={bootstrapTooltip:$("[data-toggle='tooltip']"),bootstrapModalDialog:$(".modal"),bootstrapTabs:$(".tabs-custom"),customToggle:$("[data-custom-toggle]"),captcha:$(".recaptcha"),campaignMonitor:$(".campaign-mailform"),copyrightYear:$(".copyright-year"),checkbox:$("input[type='checkbox']"),isotope:$(".isotope-wrap"),lightGallery:$("[data-lightgallery='group']"),lightGalleryItem:$("[data-lightgallery='item']"),lightDynamicGalleryItem:$("[data-lightgallery='dynamic']"),materialParallax:$(".parallax-container"),mailchimp:$(".mailchimp-mailform"),owl:$(".owl-carousel"),popover:$('[data-toggle="popover"]'),preloader:$(".preloader"),rdNavbar:$(".rd-navbar"),rdMailForm:$(".rd-mailform"),rdInputLabel:$(".form-label"),regula:$("[data-constraints]"),radio:$("input[type='radio']"),swiper:document.querySelectorAll(".swiper-container"),search:$(".rd-search"),searchResults:$(".rd-search-results"),statefulButton:$(".btn-stateful"),viewAnimate:$(".view-animate"),wow:$(".wow"),maps:$(".google-map-container"),rdRange:$(".rd-range"),selectFilter:$("select"),slick:$(".slick-slider"),stepper:$("input[type='number']"),radioPanel:$(".radio-panel .radio-inline"),multitoggle:document.querySelectorAll("[data-multitoggle]"),counter:document.querySelectorAll(".counter"),progressLinear:document.querySelectorAll(".progress-linear"),progressCircle:document.querySelectorAll(".progress-circle"),countdown:document.querySelectorAll(".countdown")};function u(t){return!!d||t.offset().top+t.outerHeight()>=r.scrollTop()&&t.offset().top<=r.scrollTop()+r.height()}r.on("load",(function(){if(c.preloader.length&&!d&&pageTransition({target:document.querySelector(".page"),delay:0,duration:500,classIn:"fadeIn",classOut:"fadeOut",classActive:"animated",conditions:function(t,a){return!/(\#|callto:|tel:|mailto:|:\/\/)/.test(a)&&!t.currentTarget.hasAttribute("data-lightgallery")},onTransitionStart:function(t){setTimeout((function(){c.preloader.removeClass("loaded")}),.75*t.duration)},onReady:function(){c.preloader.addClass("loaded"),!0}}),c.counter)for(let t=0;t<c.counter.length;t++){let a=c.counter[t],e=(aCounter({node:a,duration:a.getAttribute("data-duration")||1e3}),function(){Util.inViewport(this)&&!this.classList.contains("animated-first")&&(this.counter.run(),this.classList.add("animated-first"))}.bind(a)),r=function(){this.counter.params.to=parseInt(this.textContent,10),this.counter.run()}.bind(a);d?(a.counter.run(),a.addEventListener("blur",r)):(e(),window.addEventListener("scroll",e))}if(c.progressLinear)for(let t=0;t<c.progressLinear.length;t++){let a=c.progressLinear[t],e=aCounter({node:a.querySelector(".progress-linear-counter"),duration:a.getAttribute("data-duration")||1e3,onStart:function(){this.custom.bar.style.width=this.params.to+"%"}});e.custom={container:a,bar:a.querySelector(".progress-linear-bar"),onScroll:function(){(Util.inViewport(this.custom.container)&&!this.custom.container.classList.contains("animated")||d)&&(this.run(),this.custom.container.classList.add("animated"))}.bind(e),onBlur:function(){this.params.to=parseInt(this.params.node.textContent,10),this.run()}.bind(e)},d?(e.run(),e.params.node.addEventListener("blur",e.custom.onBlur)):(e.custom.onScroll(),document.addEventListener("scroll",e.custom.onScroll))}if(c.progressCircle)for(let t=0;t<c.progressCircle.length;t++){let a=c.progressCircle[t],e=aCounter({node:a.querySelector(".progress-circle-counter"),duration:500,onUpdate:function(t){this.custom.bar.render(3.6*t)}});e.params.onComplete=e.params.onUpdate,e.custom={container:a,bar:aProgressCircle({node:a.querySelector(".progress-circle-bar")}),onScroll:function(){Util.inViewport(this.custom.container)&&!this.custom.container.classList.contains("animated")&&(this.run(),this.custom.container.classList.add("animated"))}.bind(e),onBlur:function(){this.params.to=parseInt(this.params.node.textContent,10),this.run()}.bind(e)},d?(e.run(),e.params.node.addEventListener("blur",e.custom.onBlur)):(e.custom.onScroll(),window.addEventListener("scroll",e.custom.onScroll))}if(c.isotope.length)for(var t=0;t<c.isotope.length;t++){var a=c.isotope[t],e=function(t){t.preventDefault();for(var a=0;a<this.isoGroup.filters.length;a++)this.isoGroup.filters[a].classList.remove("active");this.classList.add("active"),this.isoGroup.isotope.arrange({filter:"*"!==this.getAttribute("data-isotope-filter")?'[data-filter*="'+this.getAttribute("data-isotope-filter")+'"]':"*"})};a.isoGroup={},a.isoGroup.filters=a.querySelectorAll("[data-isotope-filter]"),a.isoGroup.node=a.querySelector(".isotope"),a.isoGroup.layout=a.isoGroup.node.getAttribute("data-isotope-layout")?a.isoGroup.node.getAttribute("data-isotope-layout"):"masonry",a.isoGroup.isotope=new Isotope(a.isoGroup.node,{itemSelector:".isotope-item",layoutMode:a.isoGroup.layout,filter:"*",masonry:{columnWidth:".col-1"}});for(var r=0;r<a.isoGroup.filters.length;r++){var i=a.isoGroup.filters[r];i.isoGroup=a.isoGroup,i.addEventListener("click",e)}window.addEventListener("resize",function(){this.isoGroup.isotope.layout()}.bind(a))}if(c.materialParallax.length)if(d||l||s)for(var o=0;o<c.materialParallax.length;o++){var n=$(c.materialParallax[o]);n.addClass("parallax-disabled"),n.css({"background-image":"url("+n.data("parallax-img")+")"})}else c.materialParallax.parallax()})),$((function(){function t(t){for(var a=["-","-sm-","-md-","-lg-","-xl-","-xxl-"],e=[0,576,768,992,1200,1600],r={},i=0;i<e.length;i++){r[e[i]]={};for(var o=i;o>=-1;o--)!r[e[i]].items&&t.attr("data"+a[o]+"items")&&(r[e[i]].items=o<0?1:parseInt(t.attr("data"+a[o]+"items"),10)),!r[e[i]].stagePadding&&0!==r[e[i]].stagePadding&&t.attr("data"+a[o]+"stage-padding")&&(r[e[i]].stagePadding=o<0?0:parseInt(t.attr("data"+a[o]+"stage-padding"),10)),!r[e[i]].margin&&0!==r[e[i]].margin&&t.attr("data"+a[o]+"margin")&&(r[e[i]].margin=o<0?30:parseInt(t.attr("data"+a[o]+"margin"),10))}t.attr("data-dots-custom")&&t.on("initialized.owl.carousel",(function(t){var a=$(t.currentTarget),e=$(a.attr("data-dots-custom")),r=0;a.attr("data-active")&&(r=parseInt(a.attr("data-active"),10)),a.trigger("to.owl.carousel",[r,300,!0]),e.find("[data-owl-item='"+r+"']").addClass("active"),e.find("[data-owl-item]").on("click",(function(t){t.preventDefault(),a.trigger("to.owl.carousel",[parseInt(this.getAttribute("data-owl-item"),10),300,!0])})),a.on("translate.owl.carousel",(function(t){e.find(".active").removeClass("active"),e.find("[data-owl-item='"+t.item.index+"']").addClass("active")}))})),t.on("initialized.owl.carousel",(function(){v(t.find('[data-lightgallery="item"]'),"lightGallery-in-carousel")})),t.owlCarousel({autoplay:!d&&"true"===t.attr("data-autoplay"),loop:!d&&"false"!==t.attr("data-loop"),items:1,center:"true"===t.attr("data-center"),dotsContainer:t.attr("data-pagination-class")||!1,navContainer:t.attr("data-navigation-class")||!1,mouseDrag:!d&&"false"!==t.attr("data-mouse-drag"),nav:"true"===t.attr("data-nav"),dots:"true"===t.attr("data-dots"),dotsEach:!!t.attr("data-dots-each")&&parseInt(t.attr("data-dots-each"),10),animateIn:!!t.attr("data-animation-in")&&t.attr("data-animation-in"),animateOut:!!t.attr("data-animation-out")&&t.attr("data-animation-out"),responsive:r,smartSpeed:t.attr("data-smart-speed")?t.attr("data-smart-speed"):250,navText:t.attr("data-nav-text")?$.parseJSON(t.attr("data-nav-text")):[],navClass:t.attr("data-nav-class")?$.parseJSON(t.attr("data-nav-class")):["owl-prev","owl-next"]})}function s(t){$("#"+t.live).removeClass("cleared").html(),t.current++,t.spin.addClass("loading");var a=searchSite(decodeURI(t.term)),e=$("#"+t.live);t.processed!==t.current||e.hasClass("cleared")||(e.find("> #search-results").removeClass("active"),e.html(a),setTimeout((function(){e.find("> #search-results").addClass("active")}),50)),t.spin.parents(".rd-search").find(".input-group-addon").removeClass("loading")}function p(t,a){var e,r=0;if(t.length){for(var i=0;i<t.length;i++){var o=$(t[i]);if((e=o.regula("validate")).length)for(k=0;k<e.length;k++)r++,o.siblings(".form-validation").text(e[k].message).parent().addClass("has-error");else o.siblings(".form-validation").text("").parent().removeClass("has-error")}return a&&a.length?g(a)&&0===r:0===r}return!0}function g(t){return 0!==t.find(".g-recaptcha-response").val().length||(t.siblings(".form-validation").html("Please, prove that you are not robot.").addClass("active"),t.closest(".form-wrap").addClass("has-error"),t.on("propertychange",(function(){var t=$(this);t.find(".g-recaptcha-response").val().length>0&&(t.closest(".form-wrap").removeClass("has-error"),t.siblings(".form-validation").removeClass("active").html(""),t.off("propertychange"))})),!1)}function m(t){c.bootstrapTooltip.tooltip("dispose"),window.innerWidth<576?c.bootstrapTooltip.tooltip({placement:"bottom"}):c.bootstrapTooltip.tooltip({placement:t})}function h(t,a){d||$(t).lightGallery({thumbnail:"false"!==$(t).attr("data-lg-thumbnail"),selector:"[data-lightgallery='item']",autoplay:"true"===$(t).attr("data-lg-autoplay"),pause:parseInt($(t).attr("data-lg-autoplay-delay"))||5e3,addClass:a,mode:$(t).attr("data-lg-animation")||"lg-slide",loop:"false"!==$(t).attr("data-lg-loop")})}function f(t,a){d||$(t).on("click",(function(){$(t).lightGallery({thumbnail:"false"!==$(t).attr("data-lg-thumbnail"),selector:"[data-lightgallery='item']",autoplay:"true"===$(t).attr("data-lg-autoplay"),pause:parseInt($(t).attr("data-lg-autoplay-delay"))||5e3,addClass:a,mode:$(t).attr("data-lg-animation")||"lg-slide",loop:"false"!==$(t).attr("data-lg-loop"),dynamic:!0,dynamicEl:JSON.parse($(t).attr("data-lg-dynamic-elements"))||[]})}))}function v(t,a){d||$(t).lightGallery({selector:"this",addClass:a,counter:!1,youtubePlayerParams:{modestbranding:1,showinfo:0,rel:0,controls:0},vimeoPlayerParams:{byline:0,portrait:0}})}function b(t,a,e,r){var i={};try{i=JSON.parse(t),r(new google.maps.LatLng(i.lat,i.lng),a,e)}catch(i){e.geocoder.geocode({address:t},(function(t,i){if(i===google.maps.GeocoderStatus.OK){var o=t[0].geometry.location.lat(),n=t[0].geometry.location.lng();r(new google.maps.LatLng(parseFloat(o),parseFloat(n)),a,e)}}))}}function y(t){var a=t.$wrapperEl[0].children[t.activeIndex];t.realPrevious=Array.prototype.indexOf.call(a.parentNode.children,a)}function w(t){var a=t.getAttribute("data-autoplay")||5e3,e=t.querySelectorAll(".swiper-slide"),r={loop:"true"===t.getAttribute("data-loop")||!1,effect:t.getAttribute("data-effect")||"slide",direction:t.getAttribute("data-direction")||"horizontal",speed:t.getAttribute("data-speed")?Number(t.getAttribute("data-speed")):600,simulateTouch:"true"===t.getAttribute("data-simulate-touch")&&!d||!1,slidesPerView:t.getAttribute("data-slides")||1,spaceBetween:Number(t.getAttribute("data-margin"))||0};Number(a)&&(r.autoplay={delay:Number(a),stopOnLastSlide:!1,disableOnInteraction:!0,reverseDirection:!1}),"true"===t.getAttribute("data-keyboard")&&(r.keyboard={enabled:"true"===t.getAttribute("data-keyboard"),onlyInViewport:!0}),"true"===t.getAttribute("data-mousewheel")&&(r.mousewheel={sensitivity:1}),t.querySelector(".swiper-button-next, .swiper-button-prev")&&(r.navigation={nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}),t.querySelector(".swiper-pagination")&&(r.pagination={el:".swiper-pagination",type:"bullets",clickable:!0}),t.querySelector(".swiper-scrollbar")&&(r.scrollbar={el:".swiper-scrollbar",hide:!1});for(var i=0;i<e.length;i++){var o=e[i],n=o.getAttribute("data-slide-bg");n&&(o.style.backgroundImage="url("+n+")")}return r.on={init:function(){y(this),function(t){var a=function(t){return function(){var a;(a=t.getAttribute("data-caption-duration"))&&(t.style.animationDuration=a+"ms"),t.classList.remove("not-animated"),t.classList.add(t.getAttribute("data-caption-animate")),t.classList.add("animated")}},e=function(t){for(var a=0;a<t.length;a++){var e=t[a];e.classList.remove("animated"),e.classList.remove(e.getAttribute("data-caption-animate")),e.classList.add("not-animated")}},r=function(t){for(var e=0;e<t.length;e++){var r=t[e];r.getAttribute("data-caption-delay")?setTimeout(a(r),Number(r.getAttribute("data-caption-delay"))):a(r)()}};t.params.caption={animationEvent:"slideChangeTransitionEnd"},e(t.$wrapperEl[0].querySelectorAll("[data-caption-animate]")),r(t.$wrapperEl[0].children[t.activeIndex].querySelectorAll("[data-caption-animate]")),"slideChangeTransitionEnd"===t.params.caption.animationEvent?t.on(t.params.caption.animationEvent,(function(){e(t.$wrapperEl[0].children[t.previousIndex].querySelectorAll("[data-caption-animate]")),r(t.$wrapperEl[0].children[t.activeIndex].querySelectorAll("[data-caption-animate]"))})):(t.on("slideChangeTransitionEnd",(function(){e(t.$wrapperEl[0].children[t.previousIndex].querySelectorAll("[data-caption-animate]"))})),t.on(t.params.caption.animationEvent,(function(){r(t.$wrapperEl[0].children[t.activeIndex].querySelectorAll("[data-caption-animate]"))})))}(this),this.on("slideChangeTransitionEnd",(function(){y(this)}))}},new Swiper(t,r)}if(d=window.xMode,window.onloadCaptchaCallback=function(){for(var t=0;t<c.captcha.length;t++){var a=$(c.captcha[t]);grecaptcha.render(a.attr("id"),{sitekey:a.attr("data-sitekey"),size:a.attr("data-size")?a.attr("data-size"):"normal",theme:a.attr("data-theme")?a.attr("data-theme"):"light",callback:function(t){$(".recaptcha").trigger("propertychange")}}),a.after("<span class='form-validation'></span>")}},navigator.platform.match(/(Mac)/i)&&i.addClass("mac-os"),l&&(12===l&&i.addClass("ie-edge"),11===l&&i.addClass("ie-11"),l<10&&i.addClass("lt-ie-10"),l<11&&i.addClass("ie-10")),c.captcha.length&&$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en"),c.bootstrapTooltip.length){var C=c.bootstrapTooltip.attr("data-placement");m(C),r.on("resize orientationchange",(function(){m(C)}))}if(c.bootstrapModalDialog.length)for(var A=0;A<c.bootstrapModalDialog.length;A++){var x=$(c.bootstrapModalDialog[A]);x.on("hidden.bs.modal",$.proxy((function(){var t=$(this),a=t.find("video"),e=t.find("iframe");if(a.length&&a[0].pause(),e.length){var r=e.attr("src");e.attr("src","").attr("src",r)}}),x))}if(c.popover.length&&(window.innerWidth<767?(c.popover.attr("data-placement","bottom"),c.popover.popover()):c.popover.popover()),c.statefulButton.length&&$(c.statefulButton).on("click",(function(){var t=$(this).button("loading");setTimeout((function(){t.button("reset")}),2e3)})),c.bootstrapTabs.length)for(A=0;A<c.bootstrapTabs.length;A++){var S=$(c.bootstrapTabs[A]);S.find(".slick-slider").length&&S.find(".tabs-custom-list > li > a").on("click",$.proxy((function(){var t=$(this);setTimeout((function(){t.find(".tab-content .tab-pane.active .slick-slider").slick("setPosition")}),d?1500:300)}),S))}var I,T,G;if(c.copyrightYear.length&&c.copyrightYear.text(a.getFullYear()),c.maps.length&&(I=c.maps,T=function(){for(var t,a=0;a<c.maps.length;a++)if(c.maps[a].hasAttribute("data-key")){t=c.maps[a].getAttribute("data-key");break}$.getScript("//maps.google.com/maps/api/js?"+(t?"key="+t+"&":"")+"sensor=false&libraries=geometry,places&v=quarterly",(function(){var t=document.getElementsByTagName("head")[0],a=t.insertBefore;t.insertBefore=function(e,r){e.href&&-1!==e.href.indexOf("//fonts.googleapis.com/css?family=Roboto")||-1!==e.innerHTML.indexOf("gm-style")||a.call(t,e,r)};for(var e=new google.maps.Geocoder,r=0;r<c.maps.length;r++){var i=parseInt(c.maps[r].getAttribute("data-zoom"),10)||12,o=c.maps[r].hasAttribute("data-styles")?JSON.parse(c.maps[r].getAttribute("data-styles")):[],n=c.maps[r].getAttribute("data-center")||"Chicago",l=new google.maps.Map(c.maps[r].querySelectorAll(".google-map")[0],{zoom:i,styles:o,scrollwheel:!1,center:{lat:0,lng:0}});c.maps[r].map=l,c.maps[r].geocoder=e,c.maps[r].google=google,b(n,null,c.maps[r],(function(t,a,e){e.map.setCenter(t)}));var s=c.maps[r].querySelectorAll(".google-map-markers li");if(s.length)for(var d=[],u=0;u<s.length;u++){var p=s[u];b(p.getAttribute("data-location"),p,c.maps[r],(function(t,a,e){var r=a.getAttribute("data-icon")||e.getAttribute("data-icon"),i=(a.getAttribute("data-icon-active")||e.getAttribute("data-icon-active"),a.getAttribute("data-description")||""),o=new google.maps.InfoWindow({content:i});a.infoWindow=o;var n={position:t,map:e.map};r&&(n.icon=r);var s=new google.maps.Marker(n);a.gmarker=s,d.push({markerElement:a,infoWindow:o}),s.isActive=!1,google.maps.event.addListener(o,"closeclick",function(t,a){var e;t.gmarker.isActive=!1,e=t.getAttribute("data-icon")||a.getAttribute("data-icon"),t.gmarker.setIcon(e)}.bind(this,a,e)),google.maps.event.addListener(s,"click",function(t,a){if(0!==t.infoWindow.getContent().length){for(var e,r,i=t.gmarker,o=0;o<d.length;o++){var n;d[o].markerElement===t&&(r=d[o].infoWindow),(e=d[o].markerElement.gmarker).isActive&&d[o].markerElement!==t&&(e.isActive=!1,n=d[o].markerElement.getAttribute("data-icon")||a.getAttribute("data-icon"),e.setIcon(n),d[o].infoWindow.close())}i.isActive=!i.isActive,i.isActive?((n=t.getAttribute("data-icon-active")||a.getAttribute("data-icon-active"))&&i.setIcon(n),r.open(l,s)):((n=t.getAttribute("data-icon")||a.getAttribute("data-icon"))&&i.setIcon(n),r.close())}}.bind(this,a,e))}))}}}))},(G=function(){!I.hasClass("lazy-loaded")&&u(I)&&(T.call(),I.addClass("lazy-loaded"))})(),r.on("scroll",G)),c.radio.length)for(var A=0;A<c.radio.length;A++)$(c.radio[A]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>");if(c.checkbox.length)for(A=0;A<c.checkbox.length;A++)$(c.checkbox[A]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>");if(n&&!d&&$().UItoTop({easingType:"easeOutQuad",containerClass:"ui-to-top mdi mdi-arrow-up"}),c.rdNavbar.length){var L,E,N,q,M;for(L=["-","-sm-","-md-","-lg-","-xl-","-xxl-"],M={},A=E=0,N=(q=[0,576,768,992,1200,1600]).length;E<N;A=++E)q[A],M[q[A]]||(M[q[A]]={}),c.rdNavbar.attr("data"+L[A]+"layout")&&(M[q[A]].layout=c.rdNavbar.attr("data"+L[A]+"layout")),c.rdNavbar.attr("data"+L[A]+"device-layout")&&(M[q[A]].deviceLayout=c.rdNavbar.attr("data"+L[A]+"device-layout")),c.rdNavbar.attr("data"+L[A]+"hover-on")&&(M[q[A]].focusOnHover="true"===c.rdNavbar.attr("data"+L[A]+"hover-on")),c.rdNavbar.attr("data"+L[A]+"auto-height")&&(M[q[A]].autoHeight="true"===c.rdNavbar.attr("data"+L[A]+"auto-height")),d?M[q[A]].stickUp=!1:c.rdNavbar.attr("data"+L[A]+"stick-up")&&(M[q[A]].stickUp="true"===c.rdNavbar.attr("data"+L[A]+"stick-up")),c.rdNavbar.attr("data"+L[A]+"stick-up-offset")&&(M[q[A]].stickUpOffset=c.rdNavbar.attr("data"+L[A]+"stick-up-offset"));c.rdNavbar.RDNavbar({anchorNav:!d,stickUpClone:!(!c.rdNavbar.attr("data-stick-up-clone")||d)&&"true"===c.rdNavbar.attr("data-stick-up-clone"),responsive:M,callbacks:{onStuck:function(){var t=this.$element.find(".rd-search input");t&&t.val("").trigger("propertychange")},onDropdownOver:function(){return!d},onUnstuck:function(){if(null!==this.$clone){var t=this.$clone.find(".rd-search input");t&&(t.val("").trigger("propertychange"),t.trigger("blur"))}}}}),c.rdNavbar.attr("data-body-class")&&(document.body.className+=" "+c.rdNavbar.attr("data-body-class"))}if(c.owl.length){for(A=0;A<c.owl.length;A++){var P=$(c.owl[A]);c.owl[A].owl=P,t(P)}(!l||l>=12)&&setTimeout((function(){window.dispatchEvent(new Event("resize"))}),500)}if(c.search.length||c.searchResults){if(c.search.length)for(A=0;A<c.search.length;A++){var O=$(c.search[A]),D={element:O,filter:O.attr("data-search-filter")?O.attr("data-search-filter"):"*.html",template:O.attr("data-search-template")?O.attr("data-search-template"):'<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5><p>...#{token}...</p><p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>',live:!!O.attr("data-search-live")&&O.attr("data-search-live"),liveCount:O.attr("data-search-live-count")?parseInt(O.attr("data-search-live"),10):4,current:0,processed:0,timer:{}},z=$(".rd-navbar-search-toggle");if(z.length&&z.on("click",function(t){return function(){$(this).hasClass("active")||t.find("input").val("").trigger("propertychange")}}(O)),D.live){var R=!1;O.find("input").on("input propertychange",$.proxy((function(){this.term=this.element.find("input").val().trim(),this.spin=this.element.find(".input-group-addon"),clearTimeout(this.timer),this.term.length>2?(this.timer=setTimeout(s(this),200),!1===R&&(R=!0,o.on("click",(function(t){0===$(t.toElement).parents(".rd-search").length&&$("#rd-search-results-live").addClass("cleared").html("")})))):0===this.term.length&&$("#"+this.live).addClass("cleared").html("")}),D,this))}O.submit($.proxy((function(){return $("<input />").attr("type","hidden").attr("name","filter").attr("value",this.filter).appendTo(this.element),!0}),D,this))}if(c.searchResults.length){var B=/\?.*s=([^&]+)\&filter=([^&]+)/g.exec(location.search);if(null!==B){var U=searchSite(decodeURI(B[1])),W=`<div style="margin-bottom: 20px;text-align: left;"><h6 class="box-info-creative-title"><i>Your search for ...${B[1]}... had no matching results</i></h6></div>`;U&&U.length>0&&(W=`<div style="margin-bottom: 20px;text-align: left;"><h6 class="box-info-creative-title"><i>Your search for ...${B[1]}... has results on the following pages</i></h6></div>`),U.unshift(W),c.searchResults.html(U)}}}if(c.viewAnimate.length)for(A=0;A<c.viewAnimate.length;A++){var F=$(c.viewAnimate[A]).not(".active");e.on("scroll",$.proxy((function(){u(this)&&this.addClass("active")}),F)).trigger("scroll")}if(c.swiper){for(A=0;A<c.swiper.length;A++)c.swiper[A].swiper=w(c.swiper[A]);var j=$(".swiper-slider-custom");j.length&&r.on("resize orientationchange",(function(){for(var t=0;t<j.length;t++)window.innerWidth<576&&"vertical"===j[t].swiper.params.direction?(j[t].setAttribute("data-direction","horizontal"),j[t].swiper.destroy(),w(j[t])):window.innerWidth>=576&&"horizontal"===j[t].swiper.params.direction&&(j[t].setAttribute("data-direction","vertical"),j[t].swiper.destroy(),w(j[t]))}))}if(i.hasClass("wow-animation")&&c.wow.length&&!d&&n&&(new WOW).init(),c.rdInputLabel.length&&c.rdInputLabel.RDInputLabel(),c.regula.length&&function(t){regula.custom({name:"PhoneNumber",defaultMessage:"Invalid phone number format",validator:function(){return""===this.value||/^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value)}});for(var a=0;a<t.length;a++){var e=$(t[a]);e.addClass("form-control-has-validation").after("<span class='form-validation'></span>"),e.parent().find(".form-validation").is(":last-child")&&e.addClass("form-control-last-child")}t.on("input change propertychange blur",(function(t){var e,r=$(this);if(("blur"===t.type||r.parent().hasClass("has-error"))&&!r.parents(".rd-mailform").hasClass("success"))if((e=r.regula("validate")).length)for(a=0;a<e.length;a++)r.siblings(".form-validation").text(e[a].message).parent().addClass("has-error");else r.siblings(".form-validation").text("").parent().removeClass("has-error")})).regula("bind");var r=[{type:regula.Constraint.Required,newMessage:"The text field is required."},{type:regula.Constraint.Email,newMessage:"The email is not a valid email."},{type:regula.Constraint.Numeric,newMessage:"Only numbers are required"},{type:regula.Constraint.Selected,newMessage:"Please choose an option."}];for(a=0;a<r.length;a++){var i=r[a];regula.override({constraintType:i.type,defaultMessage:i.newMessage})}}(c.regula),c.mailchimp.length)for(A=0;A<c.mailchimp.length;A++){var Y=$(c.mailchimp[A]),J=Y.find('input[type="email"]');Y.attr("novalidate","true"),J.attr("name","EMAIL"),Y.on("submit",$.proxy((function(t,a){a.preventDefault();var e=this,r={},i=e.attr("action").replace("/post?","/post-json?").concat("&c=?"),o=e.serializeArray(),n=$("#"+e.attr("data-form-output"));for(A=0;A<o.length;A++)r[o[A].name]=o[A].value;return $.ajax({data:r,url:i,dataType:"jsonp",error:function(t,a){n.html("Server error: "+a),setTimeout((function(){n.removeClass("active")}),4e3)},success:function(a){n.html(a.msg).addClass("active"),t[0].value="";var e=$('[for="'+t.attr("id")+'"]');e.length&&e.removeClass("focus not-empty"),setTimeout((function(){n.removeClass("active")}),6e3)},beforeSend:function(t){var a=window.xMode,r=function(){var t,a=0,r=e.find("[data-constraints]");if(r.length){for(var i=0;i<r.length;i++){var o=$(r[i]);if((t=o.regula("validate")).length)for(var n=0;n<t.length;n++)a++,o.siblings(".form-validation").text(t[n].message).parent().addClass("has-error");else o.siblings(".form-validation").text("").parent().removeClass("has-error")}return 0===a}return!0}();if(a||!r)return!1;n.html("Submitting...").addClass("active")}}),!1}),Y,J))}if(c.campaignMonitor.length)for(A=0;A<c.campaignMonitor.length;A++){var V=$(c.campaignMonitor[A]);V.on("submit",$.proxy((function(t){var a={},e=this.attr("action"),r=this.serializeArray(),i=$("#"+c.campaignMonitor.attr("data-form-output")),o=$(this);for(l=0;l<r.length;l++)a[r[l].name]=r[l].value;$.ajax({data:a,url:e,dataType:"jsonp",error:function(t,a){i.html("Server error: "+a),setTimeout((function(){i.removeClass("active")}),4e3)},success:function(t){i.html(t.Message).addClass("active"),setTimeout((function(){i.removeClass("active")}),6e3)},beforeSend:function(t){if(d||!p(o.find("[data-constraints]")))return!1;i.html("Submitting...").addClass("active")}});for(var n=o[0].getElementsByTagName("input"),l=0;l<n.length;l++){n[l].value="";var s=document.querySelector('[for="'+n[l].getAttribute("id")+'"]');s&&s.classList.remove("focus","not-empty")}return!1}),V))}if(c.lightGallery.length)for(A=0;A<c.lightGallery.length;A++)h(c.lightGallery[A]);if(c.lightGalleryItem.length){for(var H=[],K=0;K<c.lightGalleryItem.length;K++)$(c.lightGalleryItem[K]).parents(".owl-carousel").length||$(c.lightGalleryItem[K]).parents(".swiper-slider").length||$(c.lightGalleryItem[K]).parents(".slick-slider").length||H.push(c.lightGalleryItem[K]);c.lightGalleryItem=H;for(A=0;A<c.lightGalleryItem.length;A++)v(c.lightGalleryItem[A])}if(c.lightDynamicGalleryItem.length)for(A=0;A<c.lightDynamicGalleryItem.length;A++)f(c.lightDynamicGalleryItem[A]);if(c.customToggle.length)for(A=0;A<c.customToggle.length;A++){var Q=$(c.customToggle[A]);Q.on("click",$.proxy((function(t){t.preventDefault();var a=$(this);$(a.attr("data-custom-toggle")).add(this).toggleClass("active")}),Q)),"true"===Q.attr("data-custom-toggle-hide-on-blur")&&o.on("click",Q,(function(t){t.target!==t.data[0]&&$(t.data.attr("data-custom-toggle")).find($(t.target)).length&&0===t.data.find($(t.target)).length&&$(t.data.attr("data-custom-toggle")).add(t.data[0]).removeClass("active")})),"true"===Q.attr("data-custom-toggle-disable-on-blur")&&o.on("click",Q,(function(t){t.target!==t.data[0]&&0===$(t.data.attr("data-custom-toggle")).find($(t.target)).length&&0===t.data.find($(t.target)).length&&$(t.data.attr("data-custom-toggle")).add(t.data[0]).removeClass("active")}))}if(c.rdRange.length&&!d&&c.rdRange.RDRange({callbacks:{onChange:function(){for(var t=$(".rd-range-input-value-1, .rd-range-input-value-2"),a=0;a<t.length;a++)n&&(t[a].style.width=1.15*(t[a].value.length+1)+"ch")}}}),c.selectFilter.length)for(A=0;A<c.selectFilter.length;A++){var _=$(c.selectFilter[A]),X="html-"+_.attr("data-style")+"-select";i.addClass(X),_.select2({placeholder:!!_.attr("data-placeholder")&&_.attr("data-placeholder"),minimumResultsForSearch:_.attr("data-minimum-results-search")?_.attr("data-minimum-results-search"):-1,maximumSelectionSize:3,dropdownCssClass:!!_.attr("data-dropdown-class")&&_.attr("data-dropdown-class")})}if(c.slick.length)for(A=0;A<c.slick.length;A++){var Z=$(c.slick[A]);Z.on("init",(function(t){h($('[data-lightgallery="group-slick"]'),"lightGallery-in-carousel"),h($('[data-lightgallery="item-slick"]'),"lightGallery-in-carousel")})),Z.slick({slidesToScroll:parseInt(Z.attr("data-slide-to-scroll"),10)||1,asNavFor:Z.attr("data-for")||!1,dots:"true"===Z.attr("data-dots"),infinite:!d&&"true"===Z.attr("data-loop"),focusOnSelect:Z.attr("data-focus-select")||!0,arrows:"true"===Z.attr("data-arrows"),swipe:"true"===Z.attr("data-swipe"),autoplay:"true"===Z.attr("data-autoplay"),centerMode:"true"===Z.attr("data-center-mode"),fade:"true"===Z.attr("data-slide-effect"),centerPadding:Z.attr("data-center-padding")?Z.attr("data-center-padding"):"0.50",mobileFirst:!0,appendArrows:Z.attr("data-arrows-class")||Z,nextArrow:'<button type="button" class="slick-next"></button>',prevArrow:'<button type="button" class="slick-prev"></button>',responsive:[{breakpoint:0,settings:{slidesToShow:parseInt(Z.attr("data-items"),10)||1,vertical:"true"===Z.attr("data-vertical")||!1}},{breakpoint:575,settings:{slidesToShow:parseInt(Z.attr("data-sm-items"),10)||1,vertical:"true"===Z.attr("data-sm-vertical")||!1}},{breakpoint:767,settings:{slidesToShow:parseInt(Z.attr("data-md-items"),10)||1,vertical:"true"===Z.attr("data-md-vertical")||!1}},{breakpoint:991,settings:{slidesToShow:parseInt(Z.attr("data-lg-items"),10)||1,vertical:"true"===Z.attr("data-lg-vertical")||!1}},{breakpoint:1199,settings:{slidesToShow:parseInt(Z.attr("data-xl-items"),10)||1,vertical:"true"===Z.attr("data-xl-vertical")||!1}},{breakpoint:1599,settings:{slidesToShow:parseInt(Z.attr("data-xxl-items"),10)||1,vertical:"true"===Z.attr("data-xxl-vertical")||!1}}]}).on("afterChange",(function(t,a,e,r){var i=$(this).attr("data-child");i&&($(i+" .slick-slide").removeClass("slick-current"),$(i+" .slick-slide").eq(e).addClass("slick-current"))}))}if(c.stepper.length&&c.stepper.stepper({labels:{up:"",down:""}}),c.radioPanel)for(A=0;A<c.radioPanel.length;A++){$(c.radioPanel[A]).on("click",(function(){c.radioPanel.removeClass("active"),$(this).addClass("active")}))}if(c.multitoggle.length&&multitoggles(),c.countdown.length)for(let t=0;t<c.countdown.length;t++){let a=c.countdown[t];aCountdown({node:a,from:a.getAttribute("data-from"),to:a.getAttribute("data-to"),count:a.getAttribute("data-count"),tick:100})}}))}();