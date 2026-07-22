/************************************************************
 * Slide
 *
 * A timed slideshow made in Exhibeo
 *
 * Exhibeo: Web galleries – from the future!
 * http://exhibeoapp.com
 * © Copyright Softpress Systems – 2012
 *************************************************************/

/*! tocca v0.1.7 || Gianluca Guarini */
!function(a,b){"use strict";if("function"!=typeof a.createEvent)return!1;var c,d,e,f,g,h,i,j="undefined"!=typeof jQuery,k=!!navigator.pointerEnabled||navigator.msPointerEnabled,l=!!("ontouchstart"in b)&&navigator.userAgent.indexOf("PhantomJS")<0||k,m=function(a){var b=a.toLowerCase(),c="MS"+a;return navigator.msPointerEnabled?c:b},n={touchstart:m("PointerDown")+" touchstart",touchend:m("PointerUp")+" touchend",touchmove:m("PointerMove")+" touchmove"},o=function(a,b,c){for(var d=b.split(" "),e=d.length;e--;)a.addEventListener(d[e],c,!1)},p=function(a){return a.targetTouches?a.targetTouches[0]:a},q=function(){return(new Date).getTime()},r=function(b,e,f,g){var h=a.createEvent("Event");if(h.originalEvent=f,g=g||{},g.x=c,g.y=d,g.distance=g.distance,j&&(h=$.Event(e,{originalEvent:f}),jQuery(b).trigger(h,g)),h.initEvent){for(var i in g)h[i]=g[i];h.initEvent(e,!0,!0),b.dispatchEvent(h)}b["on"+e]&&b["on"+e](h)},s=function(a){var b=p(a);e=c=b.pageX,f=d=b.pageY,h=q(),B++},t=function(a){var b=[],j=q(),k=f-d,l=e-c;if(clearTimeout(g),-v>=l&&b.push("swiperight"),l>=v&&b.push("swipeleft"),-v>=k&&b.push("swipedown"),k>=v&&b.push("swipeup"),b.length)for(var m=0;m<b.length;m++){var n=b[m];r(a.target,n,a,{distance:{x:Math.abs(l),y:Math.abs(k)}})}else e>=c-z&&c+z>=e&&f>=d-z&&d+z>=f&&(h+w-j>=0?(r(a.target,2===B&&i===a.target?"dbltap":"tap",a),i=a.target):0>=h+y-j&&(r(a.target,"longtap",a),i=a.target)),g=setTimeout(function(){B=0},x)},u=function(a){var b=p(a);c=b.pageX,d=b.pageY},v=b.SWIPE_THRESHOLD||100,w=b.TAP_THRESHOLD||150,x=b.DBL_TAP_THRESHOLD||200,y=b.LONG_TAP_THRESHOLD||1e3,z=b.TAP_PRECISION/2||30,A=b.JUST_ON_TOUCH_DEVICES||l,B=0;o(a,n.touchstart+(A?"":" mousedown"),s),o(a,n.touchend+(A?"":" mouseup"),t),o(a,n.touchmove+(A?"":" mousemove"),u)}(document,window);

(function() {
	/* Globals */
	// Does the browser support CSS Transitions and Animations?
	window.xbTransitions = window.xbTransitions || (function() {
		var body = document.body || document.documentElement;
		return body.style.transition !== undefined 
				|| body.style.WebkitTransition !== undefined
				|| body.style.MozTransition !== undefined 
				|| body.style.MsTransition !== undefined 
				|| body.style.OTransition !== undefined;
	})();
	
	// Does the browser support 3D Transforms
	window.xb3dTransforms = window.xb3dTransforms || (function() {
		var body = document.body || document.documentElement;
		return body.style.perspective !== undefined 
				|| body.style.WebkitPerspective !== undefined
				|| body.style.MozPerspective !== undefined 
				|| body.style.MsPerspective !== undefined 
				|| body.style.OPerspective !== undefined;
	})();
	
	function on(el, evt, fn, bubble) {
		var evts = evt.split(" "),
			i = 0,
			l = evts.length;
		for(i; i < l; i++) {
			evt = evts[i];
			if("addEventListener" in el) { // Standards
				try {
					el.addEventListener(evt, fn, bubble);
				} catch(e) {
					if(typeof fn == "object" && fn.handleEvent) {
						el.addEventListener(evt, function(e){
							fn.handleEvent.call(fn, e);
						}, bubble);
					} else
						throw e;
				}
			}
			else if("attachEvent" in el) { // IE
				if(typeof fn == "object" && fn.handleEvent) {
					el.attachEvent("on" + evt, function(){
						fn.handleEvent.call(fn, window.event);
					});
				} else
					el.attachEvent("on" + evt, fn);
			}
		}
	}
	
	function removeEvt(el, evt, fn, bubble) {
		var evts = evt.split(" "),
			i = 0,
			l = evts.length;
		for(i; i < l; i++) {
			evt = evts[i];
			if("removeEventListener" in el) { // Standards
				try {
					el.removeEventListener(evt, fn, bubble);
				} catch(e) {
					if(typeof fn == "object" && fn.handleEvent) {
						el.removeEventListener(evt, function(e){
							fn.handleEvent.call(fn, e);
						}, bubble);
					} else
						throw e;
				}
			} 
			else if("detachEvent" in el) { // IE
				if(typeof fn == "object" && fn.handleEvent) {
					el.detachEvent("on" + evt, function(){
						fn.handleEvent.call(fn);
					});
				} else
					el.detachEvent("on" + evt, fn);
			}
		}
	}

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
 
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
	
	// Quick and dirty shim for HTML5 in older browsers
    document.createElement("figure");
    document.createElement("figcaption");

	Slide = function(element, options) {
		
        // Globals
        this.gTransitionEnd = "transitionend webkitTransitionEnd oTransitionEnd otransitionend transitionEnd";
        this.gPrefixes = {"Webkit": "-webkit-","Moz": "-moz-","O": "-o-","MS": "-ms-"};
        
		options = this.options = options || {};
        this.options.animation = options.animation || "fade";
		this.options.randomImages = options.randomImages === true ? true : false;
		this.options.captions = options.captions === false ? false : true;
		this.options.autohide = options.autohide === true ? true : false;
		this.options.openLinksInNewWindow = options.openLinksInNewWindow === true ? true : false;
		// Set the default slide duration to 5 seconds if no value has been provided
		this.options.duration = options.duration || 5;
 
        this.options.displayBulletNav = options.displayBulletNav === true || options.displayAllControls === true ? true : false;
        this.options.displayStepNav = options.displayStepNav === true || options.displayAllControls === true ? true : false;
        this.options.displayPlayPause = options.displayPlayPause === true || options.displayAllControls === true ? true : false;
 
        this.options.autoplay = options.autoplay === false ? false : true;

        // On by default, unless play/pause button is activated
        this.options.pauseOnHover = options.pauseOnHover === false ? false : !this.options.displayPlayPause;
		
		this.element = element;
		this.id = element.id;
		this.index = 0;
 
		this.setImages();
 
        this.figure.style.backgroundImage = "url(" + this.images[this.index].image + ")";
		
		this.animations = ["glide", "fade", "fold", "flip", "shutter", "kenburns", "parallax", "step"];
		
		this.body = document.body || document.documentElement;
		
        if(this.options.autoplay === false && this.options.displayPlayPause === true)
            this.pause();

        if(this.options.pauseOnHover && !this.options.displayPlayPause) {
			on(this.slideContainer, "mouseover", this, false);
			on(this.slideContainer, "mouseout", this, false);
        }
	
		on(document, "keydown", this, false);
	
//		// Start the timer
//		if(img.complete) {
//			// Start the timer and pass in the next image, or a random number between 1 and this.length
//			this.startTimer(this.options.duration);
//		}
//		else {
//			on(img, "load", this, false);
//		}
	};
	Slide.prototype = {
        timerInit: function() {
            // Add a timer item
            this.timer = this.figure.appendChild(document.createElement("div"));
            this.timer.className = "slide-timer";
            this.timer.id = this.id + "-slide-timer";
        },

        // Start timer
		startTimer: function(duration) {
			if(this.timerStarted)
				return;
				
			this.setNextIndex();
 
            if(this.paused)
                return;
			
            this.timerStarted = true;
            
            var //nextImage = new Image(),
				_this = this;
			
            // // Start loading the next image
            // nextImage.src = this.images[this.nextIndex].image;
	
			// If transitions are supported, set the next slide to show once complete
			if(window.xbTransitions) {
                on(this.timer, this.gTransitionEnd, this, false);
                this.setDuration(duration);
			}
			else { // Otherwise set up a timer manually
				var last = +new Date(),
					distance = 0,
					_this = this;
				var tick = function() {
	                distance += (new Date() - last) / _this.options.duration;
	                _this.timer.style.width = Math.ceil(distance) + "px";
	                last = +new Date();
	                if(distance < _this.element.clientWidth) {
	                    _this.timeout = setTimeout(tick, 16);
	                }
	                else {
							_this.transitionEnd(_this.timer);
	                }
				}
						
	            tick();
			}
		},
		
		// Setters
		setNextIndex: function() {
			this.nextIndex = this.options.randomImages ? this.getRandomInt(0, this.length) : this.index + 1;
			
			// Make sure we get a different number to the current index
			while(this.nextIndex == this.index)
				this.nextIndex = this.getRandomInt(0, this.length);
			
			// Check to make sure the next image is in range
			if(this.nextIndex >= this.length)
				this.nextIndex = 0
			else if(this.nextIndex < 0)
				this.nextIndex = this.length-1;
		},
		
        getNextIndex: function(dir) {
            var index = this.index + dir;
            // Check to make sure the index is in range
            if(index >= this.length)
                index = 0
            else if(index < 0)
                index = this.length-1;
            return index;
		},
		
		setImages: function() {
			var anchors = this.element.getElementsByTagName("a"),
                images = [];
			
			for(var i = 0, l = anchors.length; i < l; i++) {
				if(!anchors[i].href || anchors[i].parentNode != this.element)
					continue;
				images.push({
					"image": anchors[i].href,
					"title": anchors[i].title,
					"description": anchors[i].getAttribute("data-content"),
					"url": anchors[i].getAttribute("data-url")
				});
			}
			
			this.images = images;
			this.length = images.length;
			
			// Make sure index isn't out of bounds
			if(this.index >= this.length) {
				this.index = this.options.randomImages ? this.getRandomInt(0, this.length) : 0;
			}
			
            // Set the next index (returns sequential or random index within bounds)
			this.setNextIndex();
			
			// We need to build the structure as this is either the first run or the structure has been destroyed
			if(!this.slideContainer || !this.slideContainer.parentNode) {
				// Get the figure element
			var figure = this.element.getElementsByTagName("figure")[0];
		 
				// Create structure
				this.slideContainer = document.createElement("div");
				this.element.insertBefore(this.slideContainer, this.element.firstElementChild || this.element.firstChild);
				this.slideContainer.className = "slide-container";
				this.figure = this.makeNextElement(this.index);
				this.slideContainer.appendChild(this.figure);
				this.setKenBurns(this.figure);
				figure.parentNode.removeChild(figure);

				// Get the img element
				img = this.figure.getElementsByTagName("img")[0];
				on(img, "mousedown touchstart touchmove touchend", this, false);
			}
			else {
				var newFigure = this.makeNextElement(this.index); 
				this.figure.parentNode.removeChild(this.figure);
				this.slideContainer.appendChild(newFigure);
				this.figure = newFigure;
			}
 
            if(this.options.autohide)
                this.autohideCaptions();
            
			if(!this.element.querySelector(".slide-bullet-nav"))
				this.bulletNav = "";
			if(!this.element.querySelector(".slide-step-nav"))
				this.stepNav = "";
			if(!this.element.querySelector(".slide-play-pause"))	
				this.playPause = "";
			this.addControls();
            this.animating = false;
			this.timerStarted = false;
            this.timerInit();
			this.startTimer(this.options.duration);

            this.setTouchImages(this.index);
        },

        setTouchImages: function(index) {
            if(index > this.length - 1)
            {
                prevIndex = index - 1;
                this.index = index = 0;
                nextIndex = 1;
            }
            else if(index < 0)
            {
                prevIndex = this.length - 2;
                this.index = index = this.length - 1;
                nextIndex = 0;
            }
            else
            {
                prevIndex = index - 1;
                this.index = index;
                nextIndex = index + 1;
            }

            this.prevTouch = this.makeNextElement(prevIndex);
            this.prevTouch.style.position = "absolute";
            this.prevTouch.style.left = "-100%";
            this.prevTouch.style.width = "100%";
            this.prevTouch.style.top = "0";
            this.figure.insertBefore(this.prevTouch, this.figure.firstElementChild || this.figure.firstChild);

            this.nextTouch = this.makeNextElement(nextIndex);
            this.nextTouch.style.position = "absolute";
            this.nextTouch.style.left = "100%";
            this.nextTouch.style.width = "100%";
            this.nextTouch.style.top = "0";
            this.figure.insertBefore(this.nextTouch, this.timer);
		},
 
         setDuration: function(duration) {
            var prevDuration = this.options.duration;
 
             this.options.duration = duration;
 
            if(prevDuration !== duration)
                if(this.options.animation == "kenburns")
                    this.setKenBurns(this.figure);
 
            // Reset the timer
            this.resetTimer();
                
             if(window.xbTransitions) {
                var _this = this;
                setTimeout(function() {
                           style = _this.timer.style;
                           style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + "s";
                
                           _this.timer.className = "slide-timer slide-playing";
                        }, 50);
             }
             else {	// Change the timer manually by clearing and resetting intervals
                var last = +new Date(),
					distance = 0,
					_this = this;
				var tick = function() {
	                distance += (new Date() - last) / duration;
	                _this.timer.style.width = Math.ceil(distance) + "px";
	                last = +new Date();
	                if(distance < _this.element.clientWidth) {
	                    _this.timeout = setTimeout(tick, 16);
	                }
	                else {
	                    _this.transitionEnd(_this.timer);
	                }
				}
                
	            tick();	
             }
         },
        
        /*
         * Options are: 
         *  randomImages (bool)
         *  sections (int)
		 *	captions (bool)
		 *	animation (string):
         *  fade,
         *  glide,
         *  fold,
         *  shutter,
         *  flip,
         *  random
		 *	duration (int)
         *  openLinksInNewWindow (bool)
         *  displayBulletNav (bool)
         *  displayStepNav (bool)
         *  displayPlayPause (bool) (removed)
         *  displayAllControls (bool)
         *  autoplay (bool)
         *  displayAllControls (bool)
         *  autohide (bool)
         */
		setOption: function(option, value) {
			var shouldSetOption = true;
			if(option in this.options) {
				// Do any validation needed before setting
				if (option == "animation") {
					if(this.animations.indexOf(value) != -1 || value == "random")
					{
						this.options.animation = value;
 
						if(value != "kenburns") {
							this.resetKenBurns(this.figure);
						}
						else
							this.setKenBurns(this.figure);
					}

					shouldSetOption = false;
				}
			}
			else {
				// The option doesn't exist
				shouldSetOption = false;
			}
 
			// If no validation prevents us, set the option and do anything else as necessary
			if (shouldSetOption) {
				this.options[option] = value;
	
			var image = this.images[this.index];
	
			if(option == "captions" && (image.title || image.description)) {
				var captions = this.element.getElementsByTagName("figcaption");
				if(captions.length) {
					for(var i = 0; i < captions.length; i++)
						captions[i].style.display = value ? "block" : "none";
				}
				else if (!this.animating) {
					var figure = this.element.getElementsByTagName("figure"),
						anchor = figure[0].getElementsByTagName("a"),
						container =  anchor.length ? anchor[0] : figure[0];
					this.addCaption(container, image);
				}
			}
				else if (option == "duration") {
					this.setDuration(value);
				}
			else if(option == "openLinksInNewWindow") {
				this.options.openLinksInNewWindow = value;
				this.setImages();
			}
				else if (option == "displayBulletNav" || option == "displayStepNav" || option == "displayPlayPause") {
					this.options[option] = value;
					// Turn off pause on hover feature if play/pause button is activated
					this.options.pauseOnHover = this.options.displayPlayPause == true ? false : this.options.pauseOnHover;
					//this.options.pauseOnHover = !this.options.displayPlayPause;
					this.addControls();
				}
				else if(option == "allControls") {
					this.options.displayBulletNav =
					this.options.displayStepNav = value;
					this.options.displayPlayPause = value;
					// Turn off pause on hover feature if play/pause button is activated
					this.options.pauseOnHover = this.options.displayPlayPause == true ? false : this.options.pauseOnHover;
					//this.options.pauseOnHover = !this.options.displayPlayPause;
					this.addControls();
				}
				else if(option == "autoplay")
					this.options[option] = value;
				else if(option == "pauseOnHover") {
					// Turn off play/pause button if this has been activated
					this.options[option] = value;
					this.options.displayPlayPause = value == true ? false : this.options.displayPlayPause;
					//this.options.pauseOnHover = !this.options.displayPlayPause;
					this.addControls();
				}
			else if(option == "autohide") {
				this.autohideCaptions();
			}
			}
		},
        
        // Reset the timer
        resetTimer: function() {
			window.clearTimeout(this.timeout);
            var style = this.timer.style;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = "";
            style.width = "";
            this.timer.className = "slide-timer";
 
        },
 
        setKenBurns: function(figure) {
			if(this.options.animation === "kenburns")
			{
				var img = figure.getElementsByTagName("img")[0];
				figure.className = "slide-ken-burns";
				
				this.nextFigure = figure;
				this.img = img;
		
				this.slideContainer.style.overflow = "hidden";

				img.style.WebkitTransition = "-webkit-transform linear " + this.options.duration*4 + "s";
				img.style.MozTransition = "-moz-transform linear " + this.options.duration*4 + "s";
				img.style.msTransition = "-ms-transform linear " + this.options.duration*4 + "s";
				img.style.OTransition = "-o-transform linear " + this.options.duration*4 + "s";
				img.style.transition = "transform linear " + this.options.duration*4 + "s";

				setTimeout(function() {
					img.style.WebkitTransform =
					img.style.MozTransform =
					img.style.msTransform =
					img.style.OTransform =
					img.style.transform = "scale(" + getRandomArbitrary(1, 2) + ") translateX(" + getRandomInt(-6, 6) + "%) translateY(" + getRandomInt(-6, 6) + "%)";
				}, 50);
			}
        },
 
        resetKenBurns: function(figure) {
            figure.className = "xb-slide-figure ";
            var img = figure.getElementsByTagName("img")[0];
            img.style.WebkitTransform =
            img.style.MozTransform =
            img.style.msTransform =
            img.style.OTransform =
            img.style.transform =
            img.style.WebkitTransition =
            img.style.MozTransition =
            img.style.msTransition =
            img.style.OTransition =
            img.style.transition = "";
        },
		
		makeNextElement: function(index) {

            if(index >= this.length)
                index = 0
            else if(index < 0)
                index = this.length-1;
			
			var figure = document.createElement("figure"),
				image = this.images[index],
				url = image.url,
				anchor,
				img,
				caption,
				title,
				description;
	
			figure.className = "xb-slide-figure ";
            // If there's a url, add a an anchor wrapper for the image
			if(url) {
				anchor = figure.appendChild(document.createElement("a"));
				anchor.href = url;
				if(this.options.openLinksInNewWindow)
					anchor.target = "_blank";
				img = anchor.appendChild(new Image());
			}
			else
				img = figure.appendChild(new Image());
			
			
			
			figure.style.backgroundImage = "url('" + image.image.replace(/'/g, "\\\'") + "')";
			img.src = image.image;
			
			this.addCaption((anchor || figure), image);
            
            on(img, "mousedown touchstart touchmove touchend", this, false);
	
			return figure;
		},
	
		addCaption: function(container, image) {
			// Check if there's a title or description and build a caption, if so.
			if(this.options.captions && (image.title || image.description)) {
				var caption = container.appendChild(document.createElement("figcaption"));
				caption.className = "xb-slide-figcaption ";
				if(this.options.autohide && !this.captionsShowing)
					caption.style.opacity = 0;
				
				if(image.title) {
					title = caption.appendChild(document.createElement("h1"));
					title.appendChild(document.createTextNode(image.title));
				}
				
				if(image.description) {
					description = caption.appendChild(document.createElement("p"));
					description.insertAdjacentHTML("afterbegin", image.description);
				}
				on(caption, "mousedown touchstart touchmove touchend", this, false);
			}
			
		},
 
        autohideCaptions: function() {
            var captions = this.element.getElementsByTagName("figcaption");
            if(captions.length && this.options.captions) {
                for(var i = 0; i < captions.length; i++) {
                    if(this.options.autohide)
                        captions[i].style.opacity = 0;
                    else
                        captions[i].style.opacity = "";
                }
            }
            if (this.options.autohide && !this.autohideIsSet) {
                on(this.element, "mouseover", this, false);
                on(this.element, "tap", this, false);
                on(this.element, "mouseout", this, false);
                this.autohideIsSet = 1;
                this.captionsShowing = 0;
            }
            else if (!this.options.autohide && this.autohideIsSet) {
                removeEvt(this.element, "mouseover", this, false);
                removeEvt(this.element, "tap", this, false);
                removeEvt(this.element, "mouseout", this, false);
                this.autohideIsSet = 0;
                this.captionsShowing = 0;
            }
        },
		
		addControls: function() {
            // Bullet navigation
            if(this.options.displayBulletNav && !this.bulletNav) {
                this.bulletNav = document.createElement("ul");
                this.bulletNav.className = "slide-bullet-nav";
                this.bullets = [];
 
                for(var i = 0; i < this.length; i++) {
                    var bullet = document.createElement("li");
                    bullet.appendChild(document.createTextNode(i+1));
                    if(i == this.index) {
                        bullet.className = "slide-bullet-set";
                        this.activeBullet = bullet;
                    }
                    else {
                        var index = i;
                        on(bullet, "click", this, false);
                    }
                    this.bulletNav.appendChild(bullet);
                    this.bullets.push(bullet);
                }
 
                this.element.appendChild(this.bulletNav);
            }
            else if(!this.options.displayBulletNav && this.bulletNav) {
                this.element.removeChild(this.bulletNav);
                this.bulletNav = undefined;
            }
 
            // Next/prev buttons
            if(this.options.displayStepNav && !this.stepNav) {
                var stepPrevLi = document.createElement("li"),
                    stepNextLi = document.createElement("li");

                this.stepNav = this.slideContainer.appendChild(document.createElement("ul"));
                this.stepNav.className = "slide-step-nav";
 
                // Make controls always visible on touch screens
                if(typeof document.createEvent !== 'function') {
                    this.stepNav.className = "slide-step-nav slide-step-nav-touch";
                }
 
                this.stepNav.appendChild(stepPrevLi);
                this.stepNav.appendChild(stepNextLi);
 
                this.stepPrev = stepPrevLi.appendChild(document.createElement("a"));
                this.stepNext = stepNextLi.appendChild(document.createElement("a"));
 
                this.stepPrev.className = "slide-step-nav-prev";
                this.stepNext.className = "slide-step-nav-next";
 
                this.stepPrev.href = "#slide-prev";
                this.stepNext.href = "#slide-next";
 
                this.stepPrev.appendChild(document.createTextNode("Previous"));
                this.stepNext.appendChild(document.createTextNode("Next"));
 
                on(this.stepPrev, "click", this, false);
                on(this.stepNext, "click", this, false);
 
                on(this.slideContainer, "mouseover", this, false);
                on(this.slideContainer, "mouseout", this, false);
 
            }
            else if(!this.options.displayStepNav && this.stepNav) {
                this.stepNav.parentNode.removeChild(this.stepNav);
                this.stepNav = undefined;
            }
 
            // Play/pause button
            if(this.options.displayPlayPause && !this.playPause) {
                var playPauseLi = document.createElement("li");

                this.playPause = this.slideContainer.appendChild(document.createElement("ul"));
                this.playPause.className = "slide-play-pause";
 
                // Make controls always visible on touch screens
                if(typeof document.createEvent !== 'function') {
                    this.playPause.className = "slide-play-pause slide-play-pause-touch";
				}
 
                this.playPause.appendChild(playPauseLi);

                this.playPauseButton = playPauseLi.appendChild(document.createElement("a"));
                
				if(this.paused) {
					this.playPauseButton.className = "slide-play";
					this.playPauseButton.appendChild(document.createTextNode("Play"));
				}
				else {
					this.playPauseButton.className = "slide-pause";
					this.playPauseButton.appendChild(document.createTextNode("Pause"));
				}
				
                this.playPauseButton.href = "#play-pause";
                
                on(this.playPauseButton, "click", this, false);
                on(this.slideContainer, "mouseover", this, false);
                on(this.slideContainer, "mouseout", this, false);
 
			}
            else if(!this.options.displayPlayPause && this.playPause) {
                this.playPause.parentNode.removeChild(this.playPause);
                this.playPause = undefined;
                this.play();
            }
        },
 
        fadeIn: function(el, callback) {
            var opacity = 0;

            el.style.opacity = 0;
            el.style.filter = 'alpha(opacity=0)';

            var last = +new Date();
            var tick = function() {
                opacity += (new Date() - last) / 750;
                el.style.opacity = opacity;
                el.style.filter = 'alpha(opacity=' + (100 * opacity)||0 + ')';

                last = +new Date();

                if(opacity < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 15);
                }
                else {
                    if(typeof callback === "function")
                        callback();
                }
			}

            tick();
		},
		// Animations ====================
		// Slide
		glide: function(index) {
		
			// Fall back to a fade if the browser doesn't support transitions
			if(!window.xbTransitions) {
				this.fade(index);
				return;
			}
				
			var container = document.createElement("div"),
				style = container.style,
				oldFigure = this.figure,
                oldFigureClone = oldFigure.cloneNode(true),
                newFigure = this.makeNextElement(index),
                img = newFigure.querySelectorAll("img")[0],
                _this = this;
 
            on(img, "load", function(){
				oldFigure.style.visibility = "hidden";
				setTimeout(function(){
                    
                    if(_this.reverse) {
                        setTimeout(function() {
                            container.className += " slide-glide-active-reverse";
                        }, 1);
                    }
                    else {
                        setTimeout(function() {
                            container.className += " slide-glide-active";
                        }, 1);
                    }
			
				}, 50);
			}, false);
            container.className = "slide-glide-container";

            container.appendChild(oldFigureClone);
			container.appendChild(newFigure);
 
            if(this.reverse) {
                newFigure.style.left = "-50%";
            }
            else {
                newFigure.style.left = "50%";
            }
 
            this.slideContainer.appendChild(container);
 
			on(container, this.gTransitionEnd, this, false);
        },
 
        parallax: function(index) {
            // Fall back to a fade if the browser doesn't support transitions
            if(!window.xbTransitions) {
                this.fade(index);
                return;
            }
	
            var container = document.createElement("div"),
                style = container.style,
                oldFigure = this.figure,
                oldFigureClone = oldFigure.cloneNode(true),
                newFigure = this.makeNextElement(index),
                img = newFigure.querySelectorAll("img")[0],
                caption = newFigure.querySelectorAll("figcaption")[0];
                _this = this;
 
            on(img, "load", function(){
                oldFigure.style.visibility = "hidden";
                setTimeout(function(){
	
                    if(_this.reverse)
                        container.className += " slide-parallax-active-reverse";
                    else
                        container.className += " slide-parallax-active";
                    if(caption)
                        caption.style.left = "";
			
                }, 50);
            }, false);
			
			container.className = "slide-parallax-container";
			if(this.reverse)
				container.className += " slide-parallax-reverse";
            oldFigureClone.className = "slide-parallax-item";
            newFigure.className = "slide-parallax-new-item";
			
            container.appendChild(oldFigureClone);
            container.appendChild(newFigure);
			
            if(this.reverse)
                newFigure.style.left = "-100%";
			else
                newFigure.style.left = "100%"; 
 
            this.slideContainer.appendChild(container);
			
            on(newFigure, this.gTransitionEnd, this, false);
		},
		
		// Fade
		fade: function(index) {
            var oldFigure = this.figure,
                newFigure = this.makeNextElement(index),
                img = newFigure.querySelectorAll("img")[0],
                _this = this;
	
			newFigure.style.position = "absolute";
			newFigure.style.top = 0;
            newFigure.style.opacity = 0;
            newFigure.style.filter = 'alpha(opacity=0)';
            on(img, "load", function(){
				setTimeout(function(){
					// Start the transition
					if(window.xbTransitions) {
						newFigure.className = "xb-slide-figure slide-fade";
						newFigure.style.opacity = "";
					}
					else {
						_this.fadeIn(newFigure, function() {
							newFigure.className = "xb-slide-figure  slide-fade";
							_this.transitionEnd(newFigure);
						});
					}
				}, 50);
            }, false);
	
			// Add the transition listener
			if(window.xbTransitions)
                on(newFigure, this.gTransitionEnd, this, false);
 
            this.slideContainer.insertBefore(newFigure, (this.slideContainer.firstElementChild || this.slideContainer.firstChild).nextSibling);
			
			if(!window.xbTransitions && img.complete) {
 				_this.fadeIn(newFigure, function() {
                    newFigure.className = "xb-slide-figure  slide-fade";
                    _this.transitionEnd(newFigure);
                });
 			}
        },
				
        // Ken Burns
        kenburns: function(index) {
            // Fall back to a fade if the browser doesn't support transitions or 3dTransforms
            if(!window.xbTransitions || !window.xb3dTransforms) {
                this.fade(index);
                return;
            }
 
            var oldFigure = this.figure,
                newFigure = this.makeNextElement(index),
                img = newFigure.querySelectorAll("img")[0],
                _this = this;
			
			this.nextFigure = newFigure;
			this.img = img;
			
			this.slideContainer.style.overflow = "hidden";
            newFigure.style.position = "absolute";
            newFigure.style.top = 0;
            newFigure.style.opacity = 0;
 
            newFigure.className = "xb-slide-figure slide-ken-burns";
 
            on(img, "load", function(){
				setTimeout(function(){
					img.style.WebkitTransform =
					img.style.MozTransform =
					img.style.mSTransform =
					img.style.OTransform =
					img.style.transform = "scale(" + getRandomArbitrary(1, 2) + ") translateX(" + getRandomInt(-6, 6) + "%) translateY(" + getRandomInt(-6, 6) + "%)";
					
					if(_this.paused) {
						var style = window.getComputedStyle(_this.img, null);
						_this.oldImg = img.cloneNode(true);
						img.style.WebkitTransform = style.getPropertyValue("-webkit-transform");
						img.style.MozTransform = style.getPropertyValue("-moz-transform");
						img.style.mSTransform = style.getPropertyValue("-ms-transform");
						img.style.OTransform = style.getPropertyValue("-o-transform");
						img.style.transform = style.getPropertyValue("transform");
					}
					
					// Start the transition
					newFigure.className += " slide-fade";
					newFigure.style.opacity = "";
				}, 50);
            }, false);
 
            // Add the transition listener
            on(newFigure, this.gTransitionEnd, this, false);
 
            this.slideContainer.insertBefore(newFigure, (this.slideContainer.firstElementChild || this.slideContainer.firstChild).nextSibling);
			
		},
	
		// Fold
		fold: function(index) {
			
			// Fall back to a fade if the browser doesn't support transitions or 3dTransforms
			if(!window.xbTransitions || !window.xb3dTransforms) {
				this.fade(index);
				return;
			}
			
			var container = document.createElement("div"),
				style = container.style,
				newFigure = this.makeNextElement(index),
				oldFigure = this.figure.cloneNode(false),
				img,
				sections = this.options.sections,
				i,
				_this = this;
				
			newFigure.style.visibility = "hidden";
			this.body.appendChild(newFigure);
 
            // Get the next slide ready
            this.nextFigure = newFigure.cloneNode(true);
			img = this.nextFigure.querySelectorAll("img")[0],
			on(img, "mousedown touchstart touchmove touchend", this, false);
			this.nextFigure.style.display = "none";
			this.slideContainer.appendChild(this.nextFigure);
	
            container.style.position = "absolute";
            container.style.top = 
            container.style.left = "0";
            container.style.width = 
            container.style.height = "100%";
	
			container.className = "slide-fold-container";
            if(this.reverse) {
                 container.className += " slide-fold-active";
                 oldFigure.className = "slide-fold-new";
                 oldFigure.style.width = (sections * 2) + "00%";
            }
            else {
			newFigure.className = "slide-fold-new";
                newFigure.style.width = (sections * 2) + "00%";
            }
	
	
			nestedFoldContainer = container;
			
			for(i = 0; i < sections * 2; i++) {
	
				// Add a new fold item
                foldPart = this.reverse ? newFigure.cloneNode(false) : oldFigure.cloneNode(false);
                foldPart.style.height =
                foldPart.style.visibility = "";
				
					nestedFoldContainer.appendChild(foldPart);

				foldPart.className = "slide-fold-part p" + (i + 1);
				if(i)
					foldPart.className += ((i+1) % 2 ? " slide-fold-odd" : " slide-fold-even");
				else
					foldPart.style.width = 100 / (sections * 2) + "%";
	
				// Set the background position as a percentage of the number of sections (100 * (N-1) * i / 2)
				foldPart.style.backgroundPosition = (100 / (sections * 2 - 1) * i) + "%";
	
                var shadow;
                if(!i) {
                  shadow = foldPart.appendChild(document.createElement("span"));
				shadow.className = "slide-fold-shadow";
                }
                else
                    shadow = foldPart.appendChild((foldPart.parentNode.firstElementChild || foldPart.parentNode.firstChild).cloneNode(false));
	
				// Update nestedFoldContainer so the next item gets added to this new fold
				nestedFoldContainer = foldPart;
            }
 
            nestedFoldContainer.appendChild(this.reverse ? oldFigure : newFigure);
            this.slideContainer.appendChild(container);
            
            if(img.complete) {
                setTimeout( function(){
                    if(_this.reverse) {
                        _this.body.removeChild(newFigure);
                        _this.figure.style.visibility = "hidden";
                        container.className = "slide-fold-container";
                    }
                    else {
                        newFigure.style.visibility = "";
                        _this.figure.style.visibility = "hidden";
                        container.className += " slide-fold-active";
                    }
                }, 50);
            }
            else {
                // When the img has loaded, start the transition (it's added to the DOM at the end of this method)
                on(img, "load", function(){
                    setTimeout( function(){
                        if(_this.reverse) {
                            _this.body.removeChild(newFigure);
                            _this.figure.style.visibility = "hidden";
                            container.className = "slide-fold-container";
                        }
                        else {
                            newFigure.style.visibility = "";
                            _this.figure.style.visibility = "hidden";
                            container.className += " slide-fold-active";
                        }
                    }, 50);
                }, false);
			}
 
            on(shadow, this.gTransitionEnd, this, false);
        },
 
        step: function(index) {
            
            // Fall back to a fade if the browser doesn't support transitions or 3dTransforms
            if(!window.xbTransitions || !window.xb3dTransforms) {
                this.fade(index);
                return;
            }
            
            var container = document.createElement("div"),
                style = container.style,
                oldFigure = this.figure,
                newFigure = this.makeNextElement(index),
                img,
                _this = this,
                steppPart,
                parts = [],
                style,
                i;
 
            newFigure.style.visibility = "hidden";
            this.body.appendChild(newFigure);
 
            this.nextFigure = newFigure.cloneNode(true);
			img = this.nextFigure.querySelectorAll("img")[0],
			on(img, "mousedown touchstart touchmove touchend", this, false);
            this.nextFigure.style.display = "none";
 
            this.slideContainer.style.WebkitTransform =
            container.style.WebkitTransform = "translateZ(0)";
 
            container.className = "slide-step-container";
            newFigure.className = "slide-step-new";

            for(i = 0; i < this.options.sections; i++) {
    
                var stepContainer = newFigure.cloneNode(false);
                container.appendChild(stepContainer);
	
                stepContainer.style.position = "relative";
                stepContainer.style.height = ((100 / this.options.sections)) + "%";
                stepContainer.style.visibility = "";

                if(this.reverse)
                    stepContainer.className = "slide-step-item-reverse";
			else
                    stepContainer.className = "slide-step-item";
 
                stepContainer.style.backgroundPosition = "0 " + ((100 / (this.options.sections - 1)) * i) + "%";
                parts.push(stepContainer);
            }
 
            stepContainer.className += " slide-step-last";

            container.style.width =
            container.style.height = "100%";
 
            this.slideContainer.appendChild(this.nextFigure);
            this.slideContainer.appendChild(container);
 
            if(img.complete) {
                this.body.removeChild(newFigure);
                // Start the transition
                var current = parts[0],
                    index = 0,
                    animate = function(duration) {
                        if(current) {
                            setTimeout(function(part){
                                current.className += " slide-step-active";
                                current = parts[++index];
                                animate(500 / _this.options.sections);
                            }, duration);
                        }
                    };
                    animate(50);
            }
            else {
                on(img, "load", function(){
                    _this.body.removeChild(newFigure);
                    // Start the transition
                    var current = parts[0],
                        index = 0,
                        animate = function(duration) {
                            if(current) {
                                setTimeout(function(part){
                                    current.className += " slide-step-active";
                                    current = parts[++index];
                                    animate(500 / _this.options.sections);
                                }, duration);
                            }
                        };
                        animate(50);
                }, false);
            }
 
			on(stepContainer, this.gTransitionEnd, this, false);
		},
	
		flip: function(index) {
			
			// Fall back to a fade if the browser doesn't support transitions or 3dTransforms
			if(!window.xbTransitions || !window.xb3dTransforms) {
				this.fade(index);
				return;
			}
			
            var container = document.createElement("div"),
				style = container.style,
                oldFigure = this.figure,
				newFigure = this.makeNextElement(index),
                img,
                _this = this,
				flipPart,
				style,
				i;
 
            newFigure.style.visibility = "hidden";
            this.body.appendChild(newFigure);
			
            this.nextFigure = newFigure.cloneNode(true);
			img = this.nextFigure.querySelectorAll("img")[0],
			on(img, "mousedown touchstart touchmove touchend", this, false);
            this.nextFigure.style.display = "none";
			this.element.style.overflow = "visible";
			this.slideContainer.style.overflow = "visible";
			this.slideContainer.style.WebkitTransform = "translateZ(0)";
			
			container.className = "slide-flip-container";
			newFigure.className = "slide-flip-new";

			for(i = 0; i < this.options.sections; i++) {
	
				var flipContainer = document.createElement("div");
				container.appendChild(flipContainer);
	
				flipContainer.style.position = "relative";
				flipContainer.style.height = ((100 / this.options.sections)) + "%";
	
				flipPart = newFigure.cloneNode(false);
				flipPart.style.visibility = "";
				flipContainer.appendChild(flipPart);
				if(this.reverse)
					flipPart.className = "slide-flip-back-reverse";
				else
				flipPart.className = "slide-flip-back";
				style = flipPart.style;
				style.position = "absolute";
				style.top = 0;
				style.height = "100%";
				style.width = "100%";
				style.backgroundPosition = "0 " + ((100 / (this.options.sections - 1)) * i) + "%";
				
				flipPart = oldFigure.cloneNode(false);
				flipContainer.appendChild(flipPart);
				if(this.reverse)
					flipPart.className = "slide-flip-front-reverse";
				else
				flipPart.className = "slide-flip-front";
				style = flipPart.style;
				style.position = "absolute";
				style.top = 0;
				style.height = "100%";
				style.width = "100%";
				style.backgroundPosition = "0 " + ((100 / (this.options.sections - 1)) * i) + "%";
			}
			
			container.style.width =
			container.style.height = "100%";
			
            this.slideContainer.appendChild(this.nextFigure);
            this.slideContainer.appendChild(container);
 
            if(img.complete) {
                this.body.removeChild(newFigure);
                // Start the transition
                setTimeout(function(){
                    oldFigure.style.visibility = "hidden";
                    container.className += " slide-flip-active";}, 50);
            }
            else {
                on(img, "load", function(){
                    _this.body.removeChild(newFigure);
                    // Start the transition
                    setTimeout(function(){
                        oldFigure.style.visibility = "hidden";
                        container.className += " slide-flip-active";}, 50);
                }, false);
            }

            on(flipPart, this.gTransitionEnd, this, false);
		},
		
		// Shutter
		shutter: function(index) {
			
			// Fall back to a fade if the browser doesn't support transitions or 3dTransforms
			if(!window.xbTransitions || !window.xb3dTransforms) {
				this.fade(index);
				return;
			}
			
			var container = document.createElement("div"),
				style = container.style,
				oldFigure = this.figure,
				newFigure = this.makeNextElement(index),
                img,
                _this = this,
				shutterPart,
				style,
				i;
 			
            newFigure.style.visibility = "hidden";
            this.body.appendChild(newFigure);
			
            this.nextFigure = newFigure.cloneNode(true);
			img = this.nextFigure.querySelectorAll("img")[0],
			on(img, "mousedown touchstart touchmove touchend", this, false);
			this.nextFigure.style.display = "none";
			this.element.style.overflow = "visible";
			this.slideContainer.style.overflow = "visible";
			this.slideContainer.style.WebkitTransform = "translateZ(0)";
			
			container.className = "slide-shutter-container";
			newFigure.className = "slide-shutter-new";
								
			for(i = 0; i < this.options.sections; i++) {
	
				var shutterContainer = document.createElement("div");
				container.appendChild(shutterContainer);
	
				shutterContainer.style.position = "relative";
				shutterContainer.style.float = "left";
				shutterContainer.style.width = ((100 / this.options.sections)) + "%";
				shutterContainer.style.height = "100%";
	
				shutterPart = newFigure.cloneNode(false);
                shutterPart.style.visibility = "";
				shutterContainer.appendChild(shutterPart);
                shutterPart.className = "slide-shutter-back";
                if(this.reverse)
                    shutterPart.className = "slide-shutter-back-reverse";
                else
				shutterPart.className = "slide-shutter-back";
				style = shutterPart.style;
				style.position = "absolute";
				style.left = 0;
				style.width =
				style.height = "100%";
				style.backgroundPosition = ((100 / (this.options.sections - 1)) * i) + "% 0";
				
				shutterPart = oldFigure.cloneNode(false);
				shutterContainer.appendChild(shutterPart);
                if(this.reverse)
                    shutterPart.className = "slide-shutter-front-reverse";
                else
				shutterPart.className = "slide-shutter-front";
				style = shutterPart.style;
				style.position = "absolute";
				style.left = 0;
				style.width =
				style.height = "100%";
				style.backgroundPosition = ((100 / (this.options.sections - 1)) * i) + "% 0";
			}

			container.style.width =
			container.style.height = "100%";
 
            this.slideContainer.appendChild(this.nextFigure);
            this.slideContainer.appendChild(container);
			
            if(img.complete) {
                this.body.removeChild(newFigure);
                // Start the transition
                setTimeout(function(){
                    oldFigure.style.visibility = "hidden";
                    container.className += " slide-shutter-active"}, 50);
            }
            else {
                on(img, "load", function(){
                    _this.body.removeChild(newFigure);
                    // Start the transition
                    setTimeout(function(){
                        oldFigure.style.visibility = "hidden";
                        container.className += " slide-shutter-active"}, 50);
                }, false);
            }

			on(shutterPart, this.gTransitionEnd, this, false);
		},
		
		random: function(index) {
            //this.resetKenBurns(this.figure);
			if(this.img && /slide-ken-burns/.test(this.img.parentNode.className)) {
				var style = window.getComputedStyle(this.img, null);
				this.img.style.WebkitTransform = style.getPropertyValue("-webkit-transform");
				this.img.style.MozTransform = style.getPropertyValue("-moz-transform");
				this.img.style.mSTransform = style.getPropertyValue("-ms-transform");
				this.img.style.OTransform = style.getPropertyValue("-o-transform");
				this.img.style.transform = style.getPropertyValue("transform");
			}

            this.figure.className = "xb-slide-figure ";
            var img = this.figure.getElementsByTagName("img")[0];
			// Pick a random animation from the animations array
			this[this.animations[this.getRandomInt(0, this.animations.length-1)]](index);
		},
		
		// Returns a random integer between min and max
		// Using Math.round() will give you a non-uniform distribution!
		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		
        showSlide: function(index, ignorePause) {
			
            if(this.animating || (this.paused && !ignorePause))
                return;
	
			this.animating = true;
	
			// Check the index isn't out of bounds
			if(index >= this.length)
				index = 0
			else if(index < 0)
				index = this.length-1;
 
            if(this.options.displayBulletNav) {
                // Reset the old bullet
                this.activeBullet.className = "";
                on(this.activeBullet, "click", this, false);
			
                // Set the new bullet
                this.activeBullet = this.bullets[index];
                this.activeBullet.className = "slide-bullet-set";
                removeEvt(this.activeBullet, "click", this, false);
            }
			
			// Set the index
			this.index = index;
			
			// Reset the timer
            this.resetTimer();

            // Remove the touch images
            this.prevTouch.parentNode.removeChild(this.prevTouch);
            this.nextTouch.parentNode.removeChild(this.nextTouch);
			
            // Call the necessary function for the specified animation
            this[this.options.animation](index);
		},
		
        pause: function() {
            if(this.paused)
                return;
			
			removeEvt(this.timer, this.gTransitionEnd, this, false);
			window.clearTimeout(this.timeout);
			var pc = this.timer.clientWidth / this.element.clientWidth * 100;
			this.timer.style.width = pc + "%";
			this.timer.className = "slide-timer";
			
			if(this.options.animation === "kenburns") {
				//removeEvt(this.nextFigure, this.gTransitionEnd, this, false);
				var style = window.getComputedStyle(this.img, null);
				this.oldImg = this.img.cloneNode(true);
				this.img.style.WebkitTransform = style.getPropertyValue("-webkit-transform");
				this.img.style.MozTransform = style.getPropertyValue("-moz-transform");
				this.img.style.mSTransform = style.getPropertyValue("-ms-transform");
				this.img.style.OTransform = style.getPropertyValue("-o-transform");
				this.img.style.transform = style.getPropertyValue("transform");
			}


			if(this.playPause) {
				this.playPauseButton.className = "slide-play";
				this.playPauseButton.removeChild(this.playPauseButton.firstChild);
				this.playPauseButton.appendChild(document.createTextNode("Play"));
			}
			
			this.paused = true;
			
        },
 
        play: function() {
            if(!this.paused)
                return;
 
            var pc = this.timer.clientWidth / this.element.clientWidth * 100,
                duration = this.options.duration * (100 - pc) / 100;
				
			if(this.options.animation === "kenburns") {
				this.img.style.WebkitTransform = this.oldImg.style.WebkitTransform;
                this.img.style.MozTransform = this.oldImg.style.MozTransform;
                this.img.style.mSTransform = this.oldImg.style.mSTransform;
                this.img.style.OTransform = this.oldImg.style.OTransform;
                this.img.style.transform = this.oldImg.style.transform;
				
			}
 			
			this.paused = false;
			
			if(this.animating) {
				this.startTimer(this.options.duration);
                this.animating = false;
			}
			else {
				
				// If transitions are supported, set the next slide to show once complete
				if(window.xbTransitions) {
					on(this.timer, this.gTransitionEnd, this, false);
	 
					var style = this.timer.style;
					style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + "s";
					style.width = "";
					this.timer.className = "slide-timer slide-playing";
				}
				else { // Otherwise set up a timer manually
					var last = +new Date(),
						distance = this.timer.clientWidth,
						_this = this;
					var tick = function() {
		                distance += (new Date() - last) / duration;
		                _this.timer.style.width = Math.ceil(distance) + "px";
		                last = +new Date();
		                if(distance < _this.element.clientWidth) {
		                    _this.timeout = setTimeout(tick, 16);
		                }
		                else {
		                    _this.transitionEnd(_this.timer);
		                }
					}

		            tick();
				}
			}
			
            if(this.playPause) {
                this.playPauseButton.className = "slide-pause";
                this.playPauseButton.removeChild(this.playPauseButton.firstChild);
                this.playPauseButton.appendChild(document.createTextNode("Pause"));
            }
		},
		
		// An image loaded
		imageLoaded: function(e) {
			this.startTimer(this.options.duration);
		},
		
		transitionEnd: function(t) {
			if(/slide-timer/.test(t.className)) {
				this.showSlide(this.nextIndex);
                this.reverse = false;
				this.timerStarted = false;
				return;
			}
			// Fade or Ken Burns
			else if(/slide-fade/.test(t.className)) {
                var oldFigure = this.figure,
                    newFigure = t;
				
				//this.slideContainer.style.overflow = "";
                oldFigure.parentNode.removeChild(oldFigure);
				newFigure.style.position = "";
				newFigure.style.top = "";
				//newFigure.className += " xb-slide-figure";
	
                this.figure = newFigure;
                this.timerInit();
                this.startTimer(this.options.duration);
				this.animating = false;
				this.setTouchImages(this.index);
			}
            // Glide or Parallax
            else if(/slide-glide-container|slide-parallax-new-item/.test(t.className)) {
                var innerContainer = this.element.querySelectorAll(".slide-glide-container, .slide-parallax-container")[0],
                    newFigure = innerContainer.lastElementChild || innerContainer.lastChild,
                    caption = newFigure.querySelectorAll("figcaption")[0];
 
                this.slideContainer.insertBefore(newFigure, this.slideContainer.firstElementChild || this.slideContainer.firstChild);
 
                newFigure.style.left =
                newFigure.style.width =
                newFigure.style.height =
				newFigure.style.position = "";
                if(caption) {
                    caption.style.left = "";
                    caption.style.width = "";
                }
                innerContainer.parentNode.removeChild(innerContainer);
                this.figure.parentNode.removeChild(this.figure);
                newFigure.className = "xb-slide-figure ";
 
				this.figure = newFigure;
				this.timerInit();
				this.startTimer(this.options.duration);
				this.animating = false;
                this.setTouchImages(this.index);
			}
			// Fold
			else if(/slide-fold-shadow/.test(t.className)) {
				var container = this.element.getElementsByClassName("slide-fold-container")[0];
				if(!container)
					return;
 
 				this.slideContainer.insertBefore(this.nextFigure, this.slideContainer.firstElementChild || this.slideContainer.firstChild);
 
				this.nextFigure.style.display = 
				this.nextFigure.style.visibility = "";
 
                container.parentNode.removeChild(container);
                this.figure.parentNode.removeChild(this.figure);
	
                this.figure = this.nextFigure;
                this.timerInit();
                this.startTimer(this.options.duration);
				this.animating = false;
                this.setTouchImages(this.index);
			}
			// Shutter or flip
            else if(/slide-shutter-front|slide-flip-front|slide-step-last/.test(t.className)) {
                var innerContainer = this.slideContainer.querySelectorAll(".slide-shutter-container, .slide-flip-container, .slide-step-container")[0],
                    oldFigure = this.figure;
				
				this.slideContainer.insertBefore(this.nextFigure, this.slideContainer.firstElementChild || this.slideContainer.firstChild);
 
				this.nextFigure.style.display = 
                this.nextFigure.style.visibility = "";
				innerContainer.parentNode.removeChild(innerContainer);
				this.element.style.overflow = "";
				this.figure.parentNode.removeChild(this.figure);
				
				this.slideContainer.style.WebkitTransform = "";
	
				this.figure = this.nextFigure;
				this.timerInit();
				this.startTimer(this.options.duration);
				this.animating = false;
                this.setTouchImages(this.index);
            }
            else if(/xb-slide-touch/.test(t.className)) {
                removeEvt(this.timer, this.gTransitionEnd, this, false);
                if(/xb-slide-touch-forward/.test(t.className))
                    var newFigure = this.nextTouch;
                else
                    var newFigure = this.prevTouch;
                this.slideContainer.insertBefore(newFigure, (this.slideContainer.firstElementChild || this.slideContainer.firstChild).nextSibling);
	
                newFigure.style.top = "";
                newFigure.style.width = "";
                newFigure.style.position = "";
                newFigure.style.left  = "";
				
                // Remove the touch images
                this.figure.parentNode.removeChild(this.figure);
				
				this.setKenBurns(newFigure);
                this.figure = newFigure;
                this.timerInit();
                this.timerStarted = false;
                this.startTimer(this.options.duration);
				this.animating = false;
                this.setTouchImages(this.index);
			}
            this.reverse = false;
		},
	
        click: function(e) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            var t = (e.target || e.srcElement);
            if(/slide-bullet-nav/.test(t.parentNode.className)) {
				this.timerStarted = false;
                this.showSlide(parseInt(t.textContent || t.innerText) - 1, true);
            }
            else if(/slide-step-nav-prev/.test(t.className)) {
                this.reverse = 1;
				this.timerStarted = false;
                this.showSlide(this.index - 1, true);
            }
            else if(/slide-step-nav-next/.test(t.className)) {
				this.timerStarted = false;
                this.showSlide(this.index + 1, true);
            }
            else if(/slide-play/.test(t.className)) {
                this.play();
            }
            else if(/slide-pause/.test(t.className)) {
                this.pause();
			}
            else if(t.nodeType == "img") {
                removeEvt(t, "click", this, false);
            }
        },
 
        mouseOver: function(e) {
            if(this.options.pauseOnHover)
                this.pause();
			this.showCaptions();
        },
 
        mouseOut: function(e) {
            if(this.options.pauseOnHover)
                this.play();
			this.hideCaptions();
		},
	
		keydown: function(e) {
			if(/textarea|input|select/.test(document.activeElement.nodeName.toLowerCase()))
				return;
			var key = e.which || e.keyCode;
			if(!this.animating && key == 37) {
				this.reverse = true;
				this.timerStarted = false;
				this.showSlide(this.index-1, true);
			}
			else if(!this.animating && key == 39) {
                this.reverse = false;
				this.timerStarted = false;
				this.showSlide(this.index+1, true);
			}
		},
 
        touchCaptions: function() {
            if(!this.captionsShowing)
                this.showCaptions();
            else
                this.hideCaptions();
        },
 
        showCaptions: function() {
            if(!this.options.autohide)
                return;
            var captions = this.element.getElementsByTagName("figcaption");
            for(var i = 0; i < captions.length; i++) {
                captions[i].style.opacity = 1;
            }
            this.captionsShowing = 1;
        },
 
        hideCaptions: function() {
            if(!this.options.autohide)
                return;
            var captions = this.element.getElementsByTagName("figcaption");
            for(var i = 0; i < captions.length; i++) {
                captions[i].style.opacity = 0;
            }
            this.captionsShowing = 0;
        },
		
        /*****************************************************************
        * The following three methods are based on Brad Birdsall's excellent Swipe
        *
        * Swipe 1.0
        *
        * Brad Birdsall, Prime
        * Copyright 2011, Licensed GPL & MIT
        * http://swipejs.com
        *****************************************************************/
 
        touchStart: function(e) {
            // Get the touch start points
            try {
                this.touch = {
                    startX: e.pageX || e.touches[0].pageX,
                    startY: e.pageY || e.touches[0].pageY,
                    // set initial timestamp of touch sequence
                    time: Number( new Date() )  
                };
            }
            catch(e) {
                return;
            }
            
			if(e.which && e.which != 1)
				return;
				
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            on(document.body || document.documentElement, "mouseup mousemove", this, false);

            // used for testing first onTouchMove event
            this.touch.isScrolling = undefined;
            
            // reset deltaX
            this.touch.deltaX = 0;
        },
        touchMove: function(e) {
            // If we detect more than one finger or a pinch, don't do anything
            if(!this.touch && (e.touches && (e.touches.length > 1 || e.scale && e.scale !== 1)) && e.which != 1) {
                return;
            }
            this.touch.deltaX = (e.pageX || e.touches[0].pageX) - this.touch.startX;
            
            // determine if scrolling test has run - one time test
            if ( typeof this.touch.isScrolling == "undefined") {
                this.touch.isScrolling = !!( this.touch.isScrolling || Math.abs(this.touch.deltaX) < Math.abs((e.pageY || e.touches[0].pageY) - this.touch.startY) );
            }
            
            // if user is not trying to scroll vertically
            if (!this.touch.isScrolling) {
                                
                // prevent native scrolling 
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                
                if(this.paused && this.wasPausedWhenTouched == undefined)
                    this.wasPausedWhenTouched = true;
                else if(this.wasPausedWhenTouched == undefined)
                    this.wasPausedWhenTouched = false;

                this.pause();

                var style = this.figure.style;
                
                // Set duration for 1-to-1 scrolling)
                style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = "0ms";
            
                // translate to touch position
                style.webkitTransform = "translate3d(" + (this.touch.deltaX) + "px,0,0)";
                style.msTransform = style.MozTransform = style.OTransform = "translateX(" + (this.touch.deltaX) + "px)";
            }
        },
        touchEnd: function(e) {
            
            // If we detect more than one finger or a pinch, don't do anything
           if(!this.touch && (e.touches && (e.touches.length > 1 || e.scale && e.scale !== 1))) {
               return;
           }

            // determine if slide attempt triggers next/prev slide
            var isValidSlide = 
                  Number(new Date()) - this.touch.time < 250 // if slide duration is less than 250ms
                  && Math.abs(this.touch.deltaX) > 20 // and if slide amt is greater than 20px
                  || Math.abs(this.touch.deltaX) > this.element.clientWidth / 2; // or if slide amt is greater than half the width
            
            // if not scrolling vertically
            if (!this.touch.isScrolling) {
                // call slide function with slide end value based on isValidSlide test
                if(isValidSlide) {
                    t = (e.target || e.srcElement);
                    on(this.figure, this.gTransitionEnd, this, false);
					this.figure.className = "xb-slide-figure";
                    if(this.touch.deltaX > 0) {
                        var style = this.figure.style;
                        style.webkitTransitionTimingFunction = style.MozTransitionTimingFunction = style.msTransitionTimingFunction = style.OTransitionTimingFunction = style.transitionTimingFunction = "ease-in";
                        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = "150ms";
                    
                        // translate to touch position
                        style.webkitTransform = "translate3d(100%,0,0)";
                        style.msTransform = style.MozTransform = style.OTransform = "translateX(100%)";
                        this.figure.className += " xb-slide-touch-back";
                        this.index = this.getNextIndex(-1);
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    } 
                    else if(this.touch.deltaX < 0) {
                        var style = this.figure.style;
                        style.webkitTransitionTimingFunction = style.MozTransitionTimingFunction = style.msTransitionTimingFunction = style.OTransitionTimingFunction = style.transitionTimingFunction = "ease-in";
                        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = "150ms";
                    
                        // translate to touch position
                        style.webkitTransform = "translate3d(-100%,0,0)";
                        style.msTransform = style.MozTransform = style.OTransform = "translateX(-100%)";
                        this.figure.className += " xb-slide-touch-forward";
                        this.index = this.getNextIndex(1);
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;   
                    }
                    if(this.options.displayBulletNav) {
                        // Reset the old bullet
                        this.activeBullet.className = "";
                        on(this.activeBullet, "click", this, false);
         
                        // Set the new bullet
                        this.activeBullet = this.bullets[this.index];
                        this.activeBullet.className = "slide-bullet-set";
                        removeEvt(this.activeBullet, "click", this, false);
                    }
                 }
                 else {
				 	on(this.figure, this.gTransitionEnd, function() { var style = this.style; style.webkitTransform = style.msTransform = style.MozTransform = style.OTransform =                     style.webkitTransitionTimingFunction = style.MozTransitionTimingFunction = style.msTransitionTimingFunction = style.OTransitionTimingFunction = style.transitionTimingFunction =  style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = ""; }, false);
                    var style = this.figure.style;
                    style.webkitTransitionTimingFunction = style.MozTransitionTimingFunction = style.msTransitionTimingFunction = style.OTransitionTimingFunction = style.transitionTimingFunction = "ease-in";
                    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = "75ms";
                
                    // translate to touch position
                    style.webkitTransform = "translate3d(0,0,0)";
                    style.msTransform = style.MozTransform = style.OTransform = "translateX(0)";
                 }
        
            }
            t = (e.target || e.srcElement);
            on(t, "click", this, false);
            if(!this.wasPausedWhenTouched)
                this.play();
            this.touch = this.wasPausedWhenTouched = undefined;
            removeEvt(document.body || document.documentElement, "mouseup mousemove", this, false);
        },
        
		// Handle events
        handleEvent: function(event) {
            e = event || window.event;
			var t;
			switch (e.type) {
                case "tap":
                    this.touchCaptions(e);
                    break;
                case "click": 
                    if (e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                    this.click(e);
                    break;
                case "mouseover":
                    this.mouseOver(e);
                    break;
                case "mouseout":
                    this.mouseOut(e);
                    break;
				case "load": 
					this.imageLoaded(e); 
					break;
                case "touchstart":
                case "mousedown":
                    this.touchStart(e); 
                    break;
                case "touchmove":
                case "mousemove":
                    this.touchMove(e); 
                    break;
                case "touchend":
                case "mouseup": 
                    this.touchEnd(e); 
                    break;
				case "webkitTransitionEnd":
				case "msTransitionEnd":
				case "oTransitionEnd":
				case "OTransitionEnd":
				case "otransitionend":
				case "transitionEnd":
				case "transitionend": 
                    e.stopPropagation();
					t = (e.target || e.srcElement); 
					this.transitionEnd(t); 
					break;
				case "webkitAnimationEnd": 
				case "mozAnimationEnd": 
				case "oAnimationEnd": 
				case "msAnimationEnd": 
				case "animationEnd": 
					t = (e.target || e.srcElement)
					this.options.animationEnd(t); 
					break;
				case "scroll": 
					this.scroll(e); 
					break;
				case "resize": 
				case "orientationchange": 
					this.resize(e);
                    break;
				case "keydown":
					this.keydown(e);
                    break;
			}
		}
	};
 
    if(!window.xb_slide)
        return;
 
    // Store args from window.xb_slide before changing its function
    var args = window.xb_slide.a;

    // Change the function of window.xb_slide to create new instances instead of loading arguments
    window.xb_slide = function(id, options) {
        window[id + "Slide"] = new Slide(document.getElementById(id), options);
    }

    if(!args)
        return;

    // Load instances that were initiated before script loaded
    for(var i = 0; i < args.length; i++)
    {
        var id = args[i][0];
        var options = args[i][1];
        window[id + "Slide"] = new Slide(document.getElementById(id), options);
    }
})();
