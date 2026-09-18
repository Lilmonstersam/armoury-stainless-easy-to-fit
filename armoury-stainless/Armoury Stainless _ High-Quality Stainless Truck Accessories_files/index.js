//import './configurator';
// import 'slick-carousel';

//import './doubletaptogo';

jQuery(document).ready( function($) {
//     var timeout = null;


//     if ($(window).scrollTop() > 0) {
//     	$('body').addClass('scrollpos-scrolled');
//     }


// 	$(window).scroll(function () {
// 	    if (!timeout) {
// 	    	if ($(window).scrollTop() > 0) {
//             	$('body').addClass('scrollpos-scrolled');
//             }
//             else {
//             	$('body').removeClass('scrollpos-scrolled');
//             }


// 	        timeout = setTimeout(function () {
// 	            clearTimeout(timeout);
// 	            timeout = null;
// 	            if ($(window).scrollTop() == 0) {
// 	            	$('body').removeClass('scrollpos-scrolled');
// 	            }
// 	        }, 250);
// 	    }
// 	});


// 	let advancedSlide = $('.advanced-slide');
// 	//let slickleft = $('.advanced-slide-right .elementor-loop-container');


// 	if(advancedSlide) {

// 		let offsideSlider = advancedSlide.clone().removeClass('advanced-slide').appendTo('.advanced-slider-offside');

// 		let $last = offsideSlider.children('.elementor-element').last();
// 		$last.parent().prepend($last);

// 		advancedSlide.slick({
// 			slidesToShow: 2,
// 			slidesToScroll: 1,
// 			//centerMode: true,
//  			dots: true,
//  			arrows: false,
//  			appendDots: '.advanced-slider-dots',
//  			speed: 500,
// 			asNavFor: '.advanced-slider-offside > .elementor-element',
// 			autoplay: true,
//   			autoplaySpeed: 2500,
// 			responsive: [
// 				{
// 			    	breakpoint: 1025,
// 			    	settings: {
// 						slidesToShow: 1,
// 					}
// 				},
// 				{
// 			    	breakpoint: 767,
// 			    	settings: {
// 						slidesToShow: 2,
// 					}
// 				}//,
// 			]
// 		});

// 		offsideSlider.slick({
// 			slidesToShow: 1,
// 			slidesToScroll: 1,
// 			asNavFor: '.advanced-slide',
// 			arrows: false,
// 		});
// 	}

// 	let verticalSlide = $('.vertical-slider .products');

// 	if(verticalSlide) {
// 		verticalSlide.slick({
// 			vertical: true,
// 			slidesToShow: 3,
// 			slidesToScroll: 1,
// 			//centerMode: true,
//  			arrows: true,
//  			//appendDots: '.advanced-slider-dots',
//  			speed: 500,
//  			rows: 1,
//  			slidesPerRow: 3,
// 			//asNavFor: '.advanced-slider-offside > .elementor-element',
// 			prevArrow: false,
// 			nextArrow: '<button type="button" class="slick-next"></button>',
// 			centerMode: false,
//   			variableWidth: false,
//   			responsive: [
// 			    {
// 			    	breakpoint: 768,
// 			    	settings: {
// 						slidesPerRow: 1,
// 						vertical: false,
// 						slidesToShow: 2,
// 					}
// 				}
// 			]
// 		});
// 	}



// 	let productSlider = $(".gallery-slider .elementor-grid");
// 	let productTopSlider = $(".gallery-slider-top .elementor-grid");


// 	if(productSlider) {
// 		productSlider.children('style').appendTo('head');

// 		productTopSlider.on('init', function(event, slick, currentSlide, nextSlide) {
// 			productSlider.find('.slick-slide').on('click', function() {
// 				slick.slickGoTo($(this).attr('data-slick-index'), false);
// 			});
// 		});

// 		productSlider.slick({
// 			//slidesToShow: 3,
// 			//slidesToScroll: 1,
// 			asNavFor: '.gallery-slider-top .elementor-grid',
// 			//centerMode: true,
// 			//focusOnSelect: true,
// 			//rows: 2,
// 			//slidesPerRow: 2,
// 			arrows: false, 
// 			dots: false,
// 			slidesToShow: 5,
//   			slidesToScroll: 1,
//   			responsive: [
// 			    {
// 			    	breakpoint: 1024,
// 			    	settings: {
// 						slidesToShow: 3,
// 					}
// 				},
// 				{
// 			    	breakpoint: 767,
// 			    	settings: {
// 						slidesToShow: 2,
// 					}
// 				}
// 			]

// 		});

// 		productTopSlider.children('style').appendTo('head');

// 		productTopSlider.slick({
// 			//slidesToShow: 3,
// 			//slidesToScroll: 1,
// 			asNavFor: '.gallery-slider .elementor-grid',
// 			//centerMode: true,
// 			//focusOnSelect: true,
// 			dots: false,
// 			prevArrow: '<button type="button" class="slick-prev"></button>',
// 			nextArrow: '<button type="button" class="slick-next"></button>',
// 			slidesToShow: 1,
//   			slidesToScroll: 1,
// 			fade: true,
// 		});
// 	}


// 	if( $('body').hasClass('single-product') ) {
// 		var imgtitles = [];
// 		$('.woocommerce-product-gallery__wrapper').children('div').each(function(){
// 		    var imgTitle = $(this).find('a').find('img').attr('data-caption');
// 		    imgtitles.push(imgTitle);
// 		});

// 		if( $('ol.flex-control-nav').length && $('ol.flex-control-nav').children().length>1 ){
// 		    for(i=0; i<imgtitles.length; ++i){
// 		        $('ol.flex-control-nav li:nth-child('+(i+1)+')').append('<span class="flexthum-title">'+imgtitles[i]+'</span>');
// 		    }
// 		}
// 	}


// 	$('body').on("adding_to_cart",  function() {
// 		$('.show-on-cart').css('visibility', 'visible');
// 	});	
	
	$('.k-series img.wp-image-1098').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/hinge-cover-k200-min.png');
	$('.k-series img.wp-image-1098').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/hinge-cover-k200-min.png');
	$('.k-series img.wp-image-1101').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/scuff-panel-k200-min.png');
	$('.k-series img.wp-image-1101').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/scuff-panel-k200-min.png');
	
	$('.t6-series img.wp-image-1089').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/aircleaner-panel-909-min.png');
	$('.t6-series img.wp-image-1089').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/aircleaner-panel-909-min.png');
	$('.t6-series img.wp-image-1097').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/headlight-surrounds-909.png');
	$('.t6-series img.wp-image-1097').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/headlight-surrounds-909.png');
	$('.t6-series img.wp-image-1090').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/battery-box-909-min.png');
	$('.t6-series img.wp-image-1090').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/battery-box-909-min.png');
	
	$('.t3-series img.wp-image-1101').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/scuff-panel-610-min.png');
	$('.t3-series img.wp-image-1101').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/scuff-panel-610-min.png');
	$('.t3-series img.wp-image-6438').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/kick-panel-with-lights-410-min.png');
	$('.t3-series img.wp-image-6438').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/kick-panel-with-lights-410-min.png');
	$('.t3-series img.wp-image-1098').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/hinge-cover-lights-610-min.png');
	$('.t3-series img.wp-image-1098').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/hinge-cover-lights-610-min.png');
	$('.t3-series img.wp-image-7074').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/bug-deflector-insert-min.png');
	$('.t3-series img.wp-image-7074').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/bug-deflector-insert-min.png');
	$('.t3-series img.wp-image-1089').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/aircleaner-panel-rear-610-min.png');
	$('.t3-series img.wp-image-1089').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/aircleaner-panel-rear-610-min.png');
	$('.t3-series img.wp-image-1090').attr('src', 'https://armourygroup.com.au/wp-content/uploads/2025/04/battery-box-610-min.png');
	$('.t3-series img.wp-image-1090').attr('srcset', 'https://armourygroup.com.au/wp-content/uploads/2025/04/battery-box-610-min.png');
});