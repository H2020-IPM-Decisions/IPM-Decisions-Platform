import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'IPM-Decisions-Platform';
  htmlContent = `
  <!-- Page Preloder -->
  <div id="preloder">
    <div class="loader"></div>
  </div>
  
  <!-- Header section  -->
    <div id="login-account" class="collapse">
       <div class="container">
         
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#login-form">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#create-form">Create Account</a>
            </li>
          </ul>
          <div class="tab-content">
            <div id="login-form" class="container tab-pane active"><br>    
            <div class="container login-container">
              <div class="row">
                <div class="col-md-12 login-form">
                      <div class="row">
                        <div class="col-md-4 form-group">
                          <input type="text" class="form-control" name="username" placeholder="Username">
                        </div>
                        <div class="col-md-4 form-group">
                          <input type="text" class="form-control" name="password" placeholder="Password">
                        </div>
                        <div class="col-md-4 form-group">
                            <button type="button" class="btn btn-primary btn-lg btn-block btn-login">Sign In</button>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12 form-group forget-password text-right">
                            <a href="#">Forget Password</a>
                        </div>
                      </div>
                </div>
              </div>
            </div>
            </div>
            <div id="create-form" class="container tab-pane fade"><br>
             Form
            </div>
            
          </div>
    </div>
    </div>
  <header class="header-section clearfix">
         
    <div class="header-top">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
          </div>
          <div class="col-md-6 text-md-right">
            <a href="#" data-toggle="collapse" data-target="#login-account">Login or Create Account</a>
          </div>
        </div>
      </div>
    </div>
    <div class="site-navbar">
      <!-- Logo -->
      <a href="index.html" class="site-logo">
        <img src="img/logo-ipm-decision.png" alt="Logo Ipm Decisions" title="Logo IPM">
      </a>
      <div class="header-right">
        
        <button class="search-switch"><i class="fa fa-search"></i></button>
      </div>
      <!-- Menu -->
      <nav class="site-nav-menu">
        <ul>
          <li class="active"><a href="index.html">Home</a></li>
          <li><a href="#">Title 1</a></li>
          <li><a href="solutions.html">Title 2</a>
            <ul class="sub-menu">
              <li><a href="#">Sub Title 1</a></li>
                            <li><a href="#">Sub Title 2</a></li>
                            <li><a href="#">Sub Title 3</a></li>
            </ul>
          </li>
          <li><a href="#">Title 3</a></li>
          <li><a href="#">Title 4</a></li>
        </ul>
      </nav>
  
    </div>
       
  </header>
  <!-- Header section end  -->
  
  <!-- Hero section  -->
  <section class="hero-section">
    <div class="hero-slider owl-carousel">
      <div class="hero-item set-bg" data-setbg="img/hero-slider/1.jpg">
        <div class="container">
          <div class="row">
            <div class="col-xl-8">
                            
              <h2><span>IPM</span><span>DECISIONS</span><span> Support System Platform</span></h2>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-item set-bg" data-setbg="img/hero-slider/2.jpg">
        <div class="container">
          <div class="row">
            <div class="col-xl-8">
              <h2><span>IPM</span><span>DECISIONS</span><span> Support System Platform</span></h2>
            </div>
          </div>
        </div>
      </div>
            <div class="hero-item set-bg" data-setbg="img/hero-slider/3.jpg">
        <div class="container">
          <div class="row">
            <div class="col-xl-8">
              <h2><span>IPM</span><span>DECISIONS</span><span> Support System Platform</span></h2>
            </div>
          </div>
        </div>
      </div>
            
    </div>
        <div class="border-animation"></div>
  </section>
  <!-- Hero section end  -->
  
  <!-- Services section  -->
  <section class="services-section">
    <div class="services-warp">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="service-item">
              <div class="si-head">
                <h5>Actors</h5>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-item">
              <div class="si-head">
                <h5>Data standards</h5>
              </div>
              <p>Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu.</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-item">
              <div class="si-head">
                <!--<div class="si-icon">
                   <img src="img/icons/wind-engine.png" alt=""> 
                </div>-->
                <h5>Architectural Approach</h5>
              </div>
              <p>Sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec con-sequat arcu et commodo interdum. </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-item">
              <div class="si-head">
                <h5>Farm</h5>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-item">
              <div class="si-head">
                <h5>Crop</h5>
              </div>
              <p>Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu.</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-item">
              <div class="si-head">
                <h5>Pest</h5>
              </div>
              <p>Sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec con-sequat arcu et commodo interdum. </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Services section end  -->
  
  <!-- Features section   -->
  <section class="features-section spad set-bg">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-md-6">
          <div class="feature-box">
            <img src="img/features/1.jpg" alt="">
            <div class="fb-text">
              <h5>DSS use </h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipi-scing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. </p>
              <a href="" class="fb-more-btn">Read More</a>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="feature-box">
            <img src="img/features/2.jpg" alt="">
            <div class="fb-text">
              <h5>DSS evaluation</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipi-scing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. </p>
              <a href="" class="fb-more-btn">Read More</a>
            </div>
          </div>
        </div>
            </div>
            <div class="row">
        <div class="col-lg-6 col-md-6">
          <div class="feature-box">
            <img src="img/features/3.jpg" alt="">
            <div class="fb-text">
              <h5>DSS adaptation</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipi-scing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. </p>
              <a href="" class="fb-more-btn">Read More</a>
            </div>
          </div>
        </div>
                <div class="col-lg-6 col-md-6">
          <div class="feature-box">
            <img src="img/features/4.jpg" alt="">
            <div class="fb-text">
              <h5>DSS integration</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipi-scing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. </p>
              <a href="" class="fb-more-btn">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Features section end  -->
  
  
  <!-- Clients section  -->
  <section class="clients-section spad">
    <div class="container">
      <div class="client-text">
        <h2>IPM DSS Innovation</h2>
        <p>"Farming must address the key challenge of increasing production of affordable food to meet global demand, whilst minimising environmental impacts. Clearly, crops affected by pests are less productive and plant protection products pose an environmental hazard. <br>
  The impact of Decision Support Systems (DSS) in crop protection has been constrained by regional and sectoral fragmentation of actors, inadequate testing of DSS and quantification of their benefits, lack of quantification of the economic, environmental and consumer benefits of using DSS, the fact that DSS address single pests whilst farmer decisions need to account for multiple pests. <br>
  The ‘IPM Decisions’ project will accelerate impact from farm DSS for Integrated Pest Management (IPM), as advocated in the Sustainable Use Directive, by addressing these constraints through the creation of a ‘one stop shop’ delivering DSS, data, tools and resources through a pan-European online Platform and an ‘IPM Decisions Network’. <br>
  
  IPM Decisions will prioritise 10 ‘case study DSS’ for pests threatening contrasting crop sectors, representing the key challenges IPM in arable crops, high value horticultural and fruit crops, and permanent crops.
  The project consortium brings together 28 multi-actors participants from public and commercial DSS providers, the research community, farmer and extension organisations, major international crop protection companies, ICT system integrators, meteorological services and national authorities."</p>
      </div>
    </div>
  </section>
  <!-- Clients section end  -->
  
  
  <!-- Testimonial section -->
  <section class="testimonial-section">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6 p-0">
          <div class="testimonial-bg set-bg" data-setbg="img/testimonial-bg.jpg"></div>
        </div>
        <div class="col-lg-6 p-0">
          <div class="testimonial-box">
            <div class="testi-box-warp">
              <h2>News</h2>
              <div class="testimonial-slider owl-carousel">
                <div class="testimonial">
                                    <h5>News 1</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu et commodo interdum. Vivamus posuere lorem lacus.Lorem ipsum dolor sit amet, consecte-tur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est.</p>
                  
                </div>
                <div class="testimonial">
                                    <h5>News 1</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu et commodo interdum. Vivamus posuere lorem lacus.Lorem ipsum dolor sit amet, consecte-tur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  
  <!-- Video section  -->
  <section class="video-section spad" >
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="video-text">
            <h2>Knowage dss</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu et commodo interdum. Vivamus posuere lorem lacus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu et commodo interdum. Vivamus posuere lorem lacus.Lorem ipsum dolor sit amet, consectetur.</p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="video-box set-bg" data-setbg="img/video-box.jpg">
            <a href="https://www.youtube.com/watch?v=wbnaHgSttVo" class="video-popup">
              <i class="fa fa-play"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Video section end  -->
  
  
  <!-- Footer section -->
  <footer class="footer-section spad">
        
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-6">
          <div class="footer-widget about-widget">
            <img src="img/logo-ipm-decision.png" alt="Logo Ipm Decisions" title="Logo IPM">
            <p>Lorem ipsum dolor sit amet, consec-tetur adipiscing elit. Quisque orci purus, sodales in est quis, blandit sollicitudin est. Nam ornare ipsum ac accumsan auctor. Donec consequat arcu et commodo interdum. </p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6">
          <div class="footer-widget">
            <h2 class="fw-title">Title</h2>
            <ul>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6">
          <div class="footer-widget">
            <h2 class="fw-title">Title</h2>
            <ul>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
              <li><a href="">Title</a></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-7">
          <div class="footer-widget">
            <h2 class="fw-title">Contact Us</h2>
            <div class="footer-info-box">
              <div class="fib-icon">
                <img src="img/icons/map-marker.png" alt="" class="">
              </div>
              <div class="fib-text">
                <p>Address</p>
              </div>
            </div>
            <div class="footer-info-box">
              <div class="fib-icon">
                <img src="img/icons/phone.png" alt="" class="">
              </div>
              <div class="fib-text">
                <p>+39 000 0000 000<br>contact@ipm-decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        <div class="border-animation"></div>
    <div class="footer-buttom">
      <div class="container">
      <div class="row">
        <div class="col-lg-4 order-2 order-lg-1 p-0">
          <div class="copyright">
                        Copyright &copy;
                    </div>
        </div>
        <div class="col-lg-7 order-1 order-lg-2 p-0">
          <ul class="footer-menu">
            <li class="active"><a href="index.html">Title</a></li>
            <li><a href="#">Title</a></li>
            <li><a href="#">Title</a></li>
            <li><a href="#">Title</a></li>
            <li><a href="#">Title</a></li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  </footer>
  <!-- Footer section end -->
  
  <!-- Search model -->
  <div class="search-model">
    <div class="h-100 d-flex align-items-center justify-content-center">
      <div class="search-close-switch">+</div>
      <form class="search-model-form">
        <input type="text" id="search-input" placeholder="Search here.....">
      </form>
    </div>
  </div>
  <!-- Search model end -->

  

  <!--====== Javascripts & Jquery ======-->
  <script src="js/jquery-3.2.1.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/jquery.slicknav.min.js"></script>
  <script src="js/owl.carousel.min.js"></script>
  <script src="js/circle-progress.min.js"></script>
  <script src="js/jquery.magnific-popup.min.js"></script>
  <script src="js/main.js"></script>
  `
}
