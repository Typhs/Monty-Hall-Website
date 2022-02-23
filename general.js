// CHeck if user language is the same as document language: ----
{
    const userLang = navigator.language || navigator.userLanguage;
    const docLang = document.documentElement.lang;
    if (!(userLang.charAt(0)+userLang.charAt(1) == docLang.charAt(0)+docLang.charAt(1) )){ //compares the 2 first characters of userLang and docLang
        switch(userLang.charAt(0)+userLang.charAt(1)){//selects two first chars of userLangs
            case 'en': //english
                $("#lang-alert").append("<span>Would you like to see this in another language?<br><a href=''>--in maintainance:(--</a></span>");
                break;
            case 'pt': //portuguese
                $("#lang-alert").append("<span>Gostaria de ver isso em outra língua?<br><a href=''>--em manutenção :(--</a></span>");
                break;
            default: // else
                $("#lang-alert").append("<span>We seem to not support your language :( </span>");
                break;
        }
    }
}


{   // Hide Header on on scroll down: ----------
    
    let didScroll;
    let lastScrollTop = 0;
    let delta = 5;
    let navbarHeight = $('header').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        let st = $(this).scrollTop();
        
        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;
        
        // If they scrolled down and are past the navbar, add class .nav-up.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('header').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up');
            }
        }
        
        lastScrollTop = st;
    }

} // End of Header Hide stuff ----------------
