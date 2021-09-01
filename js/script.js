"use strict";

window.onload = function () {

	function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});;
const animItems = document.querySelectorAll("._anim-item");

function offset(el) {
	const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

if (animItems.length > 0) {

	window.addEventListener('scroll', animOnScroll);

	function animOnScroll(params) {
		for (let index = 0; index < animItems.length; index++) {

			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && (pageYOffset < (animItemOffset + animItemHeight))) {
				animItem.classList.add("_animation");
			}
			else {
				if (!animItem.classList.contains("_anim-no-hide")) {
					animItem.classList.remove("_animation");
				}
			}
		}
	}

	setTimeout(() => {
		animOnScroll();
	}, 300);

};
(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];

	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};

					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);


		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {

				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
	}

	dynamicAdapt();

	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
}());;
const popupLinks = document.querySelectorAll(".popup-link"); 
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); 

let unlock = true;

const timeout = 800; 

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute("href").replace("#", ""); 
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll(".close-popup"); 
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest(".popup"));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup._open');
		if (popupActive) {
			popupClose(popupActive, false);
		}
		else {
			bodyLock();
		}
		curentPopup.classList.add("_open");
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest(".popup__content")) { 
				popupClose(e.target.closest(".popup"));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove("_open");
		if (doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}

	body.style.paddingRight = lockPaddingValue;
	body.classList.add("_lock");

	unlock = false;
	setTimeout(function () { 
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = "0px";
			}
		}
		body.style.paddingRight = "0px";
		body.classList.remove("_lock");
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);

}

document.addEventListener('keydown', function (e) { 
	if (e.which === 27) {
		const popupActive = document.querySelector(".popup._open");
		popupClose(popupActive);
	}
});

//POLIFILLS PARA EXPLOER (para que closest y matches funcionen)
(function () {

	if (!Element.prototype.closest) {

		Element.prototype.closest = function (css) {
			var node = this;

			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}

})();

(function () {

	if (!Element.prototype.matches) {

		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;

	}

})();;
const spoilersArray = document.querySelectorAll('[data-spoilers]'); 

if (spoilersArray.length > 0) {

	const spoilersRegular = Array.from(spoilersArray).filter(function (item, index, self) {
		return !item.dataset.spoilers.split(",")[0];
	});

	if (spoilersRegular.length > 0) {
		initSpoilers(spoilersRegular);
	}

	const spoilersMedia = Array.from(spoilersArray).filter(function (item, index, self) {
		return item.dataset.spoilers.split(",")[0];
	});

	if (spoilersMedia.length > 0) {
		const breakpointArray = []; 
		spoilersMedia.forEach(item => {
			const params = item.dataset.spoilers; 
			const breakpoint = {}; 
			const paramsArray = params.split(","); 
			breakpoint.value = paramsArray[0]; 
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"; 
			breakpoint.item = item;
			breakpointArray.push(breakpoint); 
		});

	
		let mediaQueries = breakpointArray.map(function (item) {
			return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
		});

	
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spoilersArray = breakpointArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			matchMedia.addListener(function () {
				initSpoilers(spoilersArray, matchMedia);
			});
			initSpoilers(spoilersArray, matchMedia);
		});
	}

	//initSpoilers()
	function initSpoilers(spoilersArray, matchMedia = false) {
		spoilersArray.forEach(spoilerBlock => {
			spoilerBlock = matchMedia ? spoilerBlock.item : spoilerBlock;
			if (matchMedia.matches || !matchMedia) {
				spoilerBlock.classList.add("_init");
				initSpoilerBody(spoilerBlock);
				spoilerBlock.addEventListener("click", setSpoilerAction);
			}
			else {
				spoilerBlock.classList.remove("_init");
				initSpoilerBody(spoilerBlock, false);
				spoilerBlock.removeEventListener("click", setSpoilerAction);
			}
		});
	}

	//initSpoilerBody()
	function initSpoilerBody(spoilerBlock, hideSpoilerBody = true) {
		const spoilerTitles = spoilerBlock.querySelectorAll('[data-spoiler]');
		if (spoilerTitles.length > 0) {
			spoilerTitles.forEach(spoilerTitle => {
				if (hideSpoilerBody) {
					spoilerTitle.removeAttribute("tabindex");
					if (!spoilerTitle.classList.contains("_active")) {
						spoilerTitle.nextElementSibling.hidden = true;
					}
				}
				else {
					spoilerTitle.setAttribute("tabindex", "-1");
					spoilerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	//setSpoilerAction()
	function setSpoilerAction(e) {
		const el = e.target;
		if (el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
			const spoilerTitle = el.hasAttribute("data-spoiler") ? el : el.closest("[data-spoiler]");
			const spoilerBlock = spoilerTitle.closest("[data-spoilers]");
			const oneSpoiler = spoilerBlock.hasAttribute("data-one-spoiler") ? true : false;
			if (!spoilerBlock.querySelectorAll("._slide").length) {
				if (oneSpoiler && !spoilerTitle.classList.contains("_active")) {
					hideSpoilerBody(spoilerBlock);
				}
				spoilerTitle.classList.toggle("_active");
				_slideToggle(spoilerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}

	//hideSpoilerBody()
	function hideSpoilerBody(spoilerBlock) {
		const spoilerActiveTitle = spoilerBlock.querySelector('[data-spoiler]._active');
		if (spoilerActiveTitle) {
			spoilerActiveTitle.classList.remove("_active");
			_slideUp(spoilerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.boxSizing = 'border-box';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove("_slide");
		}, duration);
	}
}

let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove("_slide");
		}, duration);
	}
}

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
};;

	//========================BURGER
	const iconMenu = document.querySelector('.icon-menu');
	const menuBody = document.querySelector('.menu__body');
	if (iconMenu) {
		iconMenu.addEventListener('click', function (e) {
			document.body.classList.toggle("_lock");
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		});
	}
	//========================

	//========================ELEMENT_CLICK_FUNCTION
	document.addEventListener("click", documentActions);
	function documentActions(e) {
		const targetElement = e.target;

		//---SEARCH
		if (targetElement.classList.contains("header-icons__btn")) {
			document.querySelector(".search").classList.toggle("_active");
		}
		else if (!targetElement.closest(".search") && document.querySelector(".search._active")) {
			document.querySelector(".search").classList.remove("_active");
		}
		//---

		//---LOAD_MORE
		if (targetElement.classList.contains("projects-tabs__btn")) {
			getProducts(targetElement);
			e.preventDefault();
		}
		//---
	}
	//========================

	//========================HEADER_SCROLL
	const headerElement = document.querySelector('.header');
	const callback = function (entries, observer) {
		if (entries[0].isIntersecting) {
			headerElement.classList.remove("_scroll");
		}
		else {
			headerElement.classList.add("_scroll");
		}
	}
	const headerObserver = new IntersectionObserver(callback);
	headerObserver.observe(headerElement);
	//========================

	//========================IBG
	function ibg() {
		let ibgs = document.querySelectorAll('.ibg');
		for (let index = 0; index < ibgs.length; index++) {
			const ibg = ibgs[index];
			if (ibg.querySelector("img")) {
				ibg.style.backgroundImage = 'url("' + ibg.querySelector('img').src + '")';
			}
		}
	}
	ibg();
	//========================

	//========================FULLSCREEN_SLIDER
	new Swiper(".fullscreen-slider__slider", {
		navigation: {
			nextEl: ".fullscreen-slider .fullscreen-slider-arrow-next",
			prevEl: ".fullscreen-slider .fullscreen-slider-arrow-prev"
		},

		pagination: {
			el: ".fullscreen-slider__pagination",
			clickable: true
		},

		slidesPerView: 1,

		speed: 1000,

		parallax: true,

	});
	//========================

	//========================TABS
	if (document.querySelector('.tabs')) {
		let tabsItems = document.querySelectorAll('.tabs__item');
		let tabsBlocks = document.querySelectorAll('.tabs__block');

		if (tabsItems.length === tabsBlocks.length) {
			for (let index = 0; index < tabsItems.length; index++) {
				const tabsItem = tabsItems[index];
				const tabsBlock = tabsBlocks[index];
				tabsItem.addEventListener('click', function (e) {
					for (let index_2 = 0; index_2 < tabsItems.length; index_2++) {
						if (tabsItems[index_2].classList.contains("active") && (tabsBlocks[index_2].classList.contains("active"))) {
							tabsItems[index_2].classList.remove("active");
							tabsBlocks[index_2].classList.remove("active");
						}
					}
					this.classList.toggle("active");
					tabsBlock.classList.toggle("active");
				});
			}
		}
	}
	//========================

	//========================TAB_SETTINGS
	const tabGrids = document.querySelectorAll('.projects-tabs__grid');

	if (tabGrids.length > 0) {
		for (let index = 0; index < tabGrids.length; index++) {
			const tabGrid = tabGrids[index];
			const tabGridElments = tabGrid.querySelectorAll(".projects-item");

			if (tabGridElments.length < 3) {
				tabGrid.classList.add("less");
			}
		}
	}
	//========================

	//========================LOAD_MORE_GET_PRODUCTS
	async function getProducts(button) {
		if (!button.classList.contains("_hold")) {
			button.classList.add("_hold");
			const file = "json/products.json";
			let response = await fetch(file, {
				method: "GET"
			});
			if (response.ok) {
				let result = await response.json();
				loadProducts(result, button);
				button.classList.remove("_hold");
				button.remove();
			} else {
				alert("ERROR!");
			}
		}
	}
	//========================

	//========================LOAD_MORE_LOAD_PRODUCTS
	function loadProducts(data, button) {
		const productsItems = button.previousElementSibling;

		for (let index = 0; index < data.products.length; index++) {

			const item = data.products[index];
			const category = item.category;

			if (!productsItems.classList.contains(`${category}`) && !productsItems.classList.contains(`all`)) {
				continue;
			}
			else {
				const productUrl = item.url;
				const productImage = item.image;
				const productTitle = item.title;
				const productCategory = item.categoryName;

				let productTemplateStart = `<article class="projects-item">`;
				let productTemplateEnd = `</article>`;

				let productTemplateImage = `
			<div class="projects-item__image">
				<div class="projects-item__links">
					<a href="" class="_icon-link"></a>
					<a href="" class="_icon-lupa"></a>
				</div>
				<a href="${productUrl}" class="projects-item__img ibg">
					<img src="img/projects/${productImage}" alt="">
				</a>
			</div>
			`;

				let productTemplateBody = `
			<div class="projects-item__block">
				<a href="${productUrl}" class="projects-item__title">${productTitle}</a>
				<div class="projects-item__text">${productCategory}</div>
			</div>
			`;

				let productTemplate = ``;
				productTemplate += productTemplateStart;
				productTemplate += productTemplateImage;
				productTemplate += productTemplateBody;
				productTemplate += productTemplateEnd;

				productsItems.insertAdjacentHTML("beforeend", productTemplate);
			}
		}

		//---IBG_FUNCTION
		ibg();
		//---

		//---TABS_SETTINGS
		if (productsItems.classList.contains("less") && productsItems.querySelectorAll(".projects-item").length >= 3) {
			productsItems.classList.remove("less");
		}
		//---
	}
	//========================

	//========================COUNTER
	const counter = document.querySelector('[data-counter]');

	if (counter) {

		const time = parseInt(counter.dataset.time);
		const step = parseInt(counter.dataset.step);
		let conterFlag = false;

		window.addEventListener('scroll', counterRun);

		function counterRun() {
			if (!conterFlag) {

				const counterCoords = offset(counter).top;

				if (pageYOffset >= counterCoords - window.innerHeight) {

					const counterItems = document.querySelectorAll('[data-num]');

					for (let index = 0; index < counterItems.length; index++) {
						const counterItem = counterItems[index];

						outNum(counterItem.dataset.num, counterItem);
					}

					conterFlag = true;
				}
			}
		}

		function outNum(number, elem) {
			let increment = 0;
			let counterInterval = Math.round(time / (number / step));
			let interval = setInterval(function () {
				if (increment <= number) {
					elem.innerHTML = increment;
				}
				else {
					clearInterval(interval);
				}
				increment += step;
			}, counterInterval);
		}
	}
	//========================

	//========================POST_SLIDER
	new Swiper(".post-slider", {

		navigation: {
			nextEl: ".post-slider .post-slider__arrow-next",
			prevEl: ".post-slider .post-slider__arrow-prev"
		},
		
		speed: 800,

		autoHeight: true,

		spaceBetween: 30,

		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			650: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			}
		},

	});
	//========================

	//========================IMAGE_SLIDER
	let imageSlider = new Swiper(".image-slider", {

		pagination: {
			el: ".image-slider__pagination",
			clickable: true
		},

		slidesPerView: 1,

		speed: 1300,

		simulateTouch: false,

		nested: true,

		autoplay: {
			delay: 1300,

			disableOnInteraction: true
		},

		loop: true,

	});
	let imageSliderBlocks = document.querySelectorAll(".post-slider__slide");
	if (imageSliderBlocks.length > 0) {
		for (let index = 0; index < imageSliderBlocks.length; index++) {
			const imageSliderBlock = imageSliderBlocks[index];
			imageSliderBlock.addEventListener('mouseenter', function (e) {
				imageSlider[index].params.autoplay.disableOnInteraction = false;
				imageSlider[index].params.autoplay.delay = 1300;
				imageSlider[index].autoplay.stop();
			});
			imageSliderBlock.addEventListener('mouseleave', function (e) {
				imageSlider[index].autoplay.start();
			});
		}
	}
	//========================
}