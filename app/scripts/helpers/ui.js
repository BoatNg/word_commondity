import $ from 'jquery'
export default {
  loginSuccess(time = 0) {
    $(".authent")
      .show()
      .animate(
        { right: 90 },
        {
          easing: "easeOutQuint",
          duration: 600,
          queue: false
        }
      );
    $(".authent")
      .animate(
        { opacity: 0 },
        {
          duration: 200,
          queue: false
        }
      )
      .addClass("visible");
    $(".login").removeClass("testtwo");
    setTimeout(function () {
      $(".login").removeClass("test");
      $(".login>div").fadeOut(123);
    }, time + 300);
    setTimeout(function () {
      $(".success").fadeIn();
    }, time + 700);
  },
  loading() {
    $(".login").addClass("test");
    setTimeout(function () {
      $(".login").addClass("testtwo");
    }, 300);
    setTimeout(function () {
      $(".authent")
        .show()
        .animate(
          { right: -300 },
          {
            easing: "easeOutQuint",
            duration: 600,
            queue: false
          }
        );
      $(".authent")
        .animate(
          { opacity: 1 },
          {
            duration: 200,
            queue: false
          }
        )
        .addClass("visible");
    }, 500);
  },
  onUserInteraction() {
    
    $('input[type="text"],input[type="password"]').focus(function () {
      $(this)
        .prev()
        .animate({ opacity: "1" }, 200);
    });
    $('input[type="text"],input[type="password"]').blur(function () {
      $(this)
        .prev()
        .animate({ opacity: ".5" }, 200);
    });
    $('input[type="text"],input[type="password"]').keyup(function () {
      if (!$(this).val() == "") {
        $(this)
          .next()
          .animate(
            {
              opacity: "1",
              right: "30"
            },
            200
          );
      } else {
        $(this)
          .next()
          .animate(
            {
              opacity: "0",
              right: "20"
            },
            200
          );
      }
    });
    $(".tab").click(function () {
      $(this).fadeOut(200, function () {
        $(this)
          .parent()
          .animate({ left: "0" });
      });
    });
  }
}