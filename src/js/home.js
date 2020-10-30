function home() {
  !(function($) {
    "use strict";

    // Preloader
    $(window).on('load', function() {
      if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function() {
          $(this).remove();
        });
      }
    });

    // Smooth scroll for the navigation menu and links with .scrollto classes
    var scrolltoOffset = $('#header').outerHeight() - 21;
    if (window.matchMedia("(max-width: 991px)").matches) {
      scrolltoOffset += 20;
    }
    $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        if (target.length) {
          e.preventDefault();

          var scrollto = target.offset().top - scrolltoOffset;

          if ($(this).attr("href") == '#header') {
            scrollto = 0;
          }

          $('html, body').animate({
            scrollTop: scrollto
          }, 1500, 'easeInOutExpo');

          if ($(this).parents('.nav-menu, .mobile-nav').length) {
            $('.nav-menu .active, .mobile-nav .active').removeClass('active');
            $(this).closest('li').addClass('active');
          }

          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
            $('.mobile-nav-overly').fadeOut();
          }
          return false;
        }
      }
    });

    // Activate smooth scroll on page load with hash links in the url
    $(document).ready(function() {
      if (window.location.hash) {
        var initial_nav = window.location.hash;
        if ($(initial_nav).length) {
          var scrollto = $(initial_nav).offset().top - scrolltoOffset;
          $('html, body').animate({
            scrollTop: scrollto
          }, 1500, 'easeInOutExpo');
        }
      }
    });

    // Navigation active state on scroll
    var nav_sections = $('section');
    var main_nav = $('.nav-menu, .mobile-nav');

    $(window).on('scroll', function() {
      var cur_pos = $(this).scrollTop() + 200;

      nav_sections.each(function() {
        var top = $(this).offset().top,
          bottom = top + $(this).outerHeight();

        if (cur_pos >= top && cur_pos <= bottom) {
          if (cur_pos <= bottom) {
            main_nav.find('li').removeClass('active');
          }
          main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
        }
        if (cur_pos < 300) {
          $(".nav-menu ul:first li:first, .mobile-menu ul:first li:first").addClass('active');
        }
      });
    });

    // Mobile Navigation
    if ($('.nav-menu').length) {
      var $mobile_nav = $('.nav-menu').clone().prop({
        class: 'mobile-nav d-lg-none'
      });
      $('body').append($mobile_nav);
      $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
      $('body').append('<div class="mobile-nav-overly"></div>');

      $(document).on('click', '.mobile-nav-toggle', function(e) {
        $('body').toggleClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        $('.mobile-nav-overly').toggle();
      });

      $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
        e.preventDefault();
        $(this).next().slideToggle(300);
        $(this).parent().toggleClass('active');
      });

      $(document).click(function(e) {
        var container = $(".mobile-nav, .mobile-nav-toggle");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
            $('.mobile-nav-overly').fadeOut();
          }
        }
      });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
      $(".mobile-nav, .mobile-nav-toggle").hide();
    }

    // Toggle .header-scrolled class to #header when page is scrolled
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('#header').addClass('header-scrolled');
        $('#topbar').addClass('topbar-scrolled');
      } else {
        $('#header').removeClass('header-scrolled');
        $('#topbar').removeClass('topbar-scrolled');
      }
    });

    if ($(window).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
      $('#topbar').addClass('topbar-scrolled');
    }

    // Back to top button
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });

    $('.back-to-top').click(function() {
      $('html, body').animate({
        scrollTop: 0
      }, 1500, 'easeInOutExpo');
      return false;
    });

    // Skills section
    $('.skills-content').waypoint(function() {
      $('.progress .progress-bar').each(function() {
        $(this).css("width", $(this).attr("aria-valuenow") + '%');
      });
    }, {
      offset: '80%'
    });

    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 1000
    });

    // Testimonials carousel (uses the Owl Carousel library)
    // $(".testimonials-carousel").owlCarousel({
    //   autoplay: true,
    //   dots: true,
    //   loop: true,
    //   items: 1
    // });

    // Porfolio isotope and filter
    $(window).on('load', function() {
      var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item'
      });

      $('#portfolio-flters li').on('click', function() {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        portfolioIsotope.isotope({
          filter: $(this).data('filter')
        });
        aos_init();
      });

      // Initiate venobox (lightbox feature used in portofilo)
      $(document).ready(function() {
        $('.venobox').venobox();
      });
    });

    // Portfolio details carousel
    $(".portfolio-details-carousel").owlCarousel({
      autoplay: true,
      dots: true,
      loop: true,
      items: 1
    });

    // Init AOS
    function aos_init() {
      AOS.init({
        duration: 4000,
        once: true
      });
    }
    $(window).on('load', function() {
      aos_init();
    });

  })(jQuery);


  $(document).ready(function() {
      AOS.init({
        duration: 1000,
        once: true
      });
      $("#news-slider").owlCarousel({
          items : 2,
          itemsDesktop : [1199,2],
          itemsMobile : [600,1],
          pagination :true,
          autoPlay : true
      });

      $("#news-slider2").owlCarousel({
          items:3,
          itemsDesktop:[1199,2],
          itemsDesktopSmall:[980,2],
          itemsMobile:[600,1],
          pagination:false,
          navigationText:false,
          autoPlay:true
      });

      $("#news-slider3").owlCarousel({
          items:3,
          itemsDesktop:[1199,2],
          itemsDesktopSmall:[1000,2],
          itemsMobile:[700,1],
          pagination:false,
          navigationText:false,
          autoPlay:true
      });

      $("#news-slider4").owlCarousel({
          items:3,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[1000,2],
          itemsMobile:[600,1],
          pagination:false,
          navigationText:false,
          autoPlay:true
      });

      $("#news-slider5").owlCarousel({
          items:3,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[1000,2],
          itemsMobile:[650,1],
          pagination:false,
          navigationText:false,
          autoPlay:true
      });

      $("#news-slider6").owlCarousel({
          items : 3,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[980,2],
          itemsMobile : [600,1],
          pagination:false,
          navigationText:false
      });

      $("#news-slider7").owlCarousel({
          items : 3,
          itemsDesktop : [1199,3],
          itemsDesktopSmall : [1000,2],
          itemsMobile : [650,1],
          pagination :false,
          autoPlay : true
      });

      $("#news-slider8").owlCarousel({
          items : 1,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[980,2],
          itemsMobile : [600,1],
          autoplay: true,
          loop: true
      });

      $("#news-slider9").owlCarousel({
          items : 3,
          itemsDesktop:[1199,2],
          itemsDesktopSmall:[980,2],
          itemsTablet:[650,1],
          pagination:false,
          navigation:true,
          navigationText:["",""]
      });

      $("#news-slider10").owlCarousel({
          items : 4,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[980,2],
          itemsMobile : [600,1],
          navigation:true,
          navigationText:["",""],
          pagination:true,
          autoPlay:true
      });

      $("#news-slider11").owlCarousel({
          items : 4,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[980,2],
          itemsMobile : [600,1],
          pagination:true,
          autoPlay:true
      });

      $("#news-slider12").owlCarousel({
          items : 2,
          itemsDesktop:[1199,2],
          itemsDesktopSmall:[980,1],
          itemsTablet: [600,1],
          itemsMobile : [550,1],
          pagination:true,
          autoPlay:true
      });

      $("#news-slider13").owlCarousel({
          navigation : false,
          pagination : true,
          items : 3,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[980,2],
          itemsMobile : [600,1],
          navigationText : ["",""]
      });

      $("#news-slider14").owlCarousel({
          items : 4,
          itemsDesktop:[1199,3],
          itemsDesktopSmall:[980,2],
          itemsMobile : [550,1],
          pagination:false,
          autoPlay:true
      });
  });
}
