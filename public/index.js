$(document).ready(function(){

    $("#menu").click(function(){
        $(this).toggleClass("fa-times"); //jobhi class mentioned h agr vo add h to remove krdo or removed h to add krdo, toggleclass ka yehi mtlb hota h
        $(".navbar").toggleClass("nav-toggle");
    });

    $("#login").click(function(){
        $(".login-form").addClass("popup");
    });

    $(".login-form form .fa-times").click(function(){
        $(".login-form").removeClass("popup");
    });

    $(window).on("load scroll", function(){
        $("#menu").removeClass("fa-times");
        $(".navbar").removeClass("nav-toggle");
        $(".login-form").removeClass("popup");

        $("section").each(function(){
            let top = $(window).scrollTop();
            let height = $(this).height();
            let id = $(this).attr("id");
            let offset = $(this).offset().top - 200;

            if(top > offset && top < offset+height){
                $(".navbar ul li a").removeClass("active");
                $(".navbar").find(`[href="/#${id}"]`).addClass("active");//It means it's looking for elements with anhrefattribute that matches the value of the variableid`.
            }

        });
    });
});