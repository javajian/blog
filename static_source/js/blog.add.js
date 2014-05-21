$(function () {
	// body...
	var wid = $('#blog_add_area').outerWidth();
	// alert(wid)
	$('#container').css({"width":wid*3/4+'px'});
	var ml = wid*1/8-15;

	um = UM.getEditor('container', {
        /* 传入配置参数,可配参数列表看umeditor.config.js */
        toolbar: ['undo redo | bold italic underline']
    });

    $('#container').parents('.edui-container').css({'margin-left':ml+'px'});
    $('#noLogin').css({'margin-left':ml+'px'});
    
    // alert(um.getContent())

    $('#blog_add_login').on('click',function(){
    	loginHandler(function(){
    		// 执行登录
    		$('#noLogin').hide();
    	});
    });

    $('#blog_add_reg').on('click',function(){
    	regHandler(function(){
    		// 执行注册
    		$('#noLogin').hide();
    	});
    });

});